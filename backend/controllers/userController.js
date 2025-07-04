import db from '../config/db.js';
import cloudinary from '../config/cloudinary.js';

// controllers/userController.js
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT userID, userFirstName, userLastName, userEmail, userContact, role, created_at FROM users WHERE role != ?',
      ['admin']  // Exclude users with 'admin' role
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users.', error });
  }
};

// Get User Profile
export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [user] = await db.query(
      'SELECT userFirstName, userLastName, userContact, userEmail, userAge, role, profile_picture, created_at FROM users WHERE userID = ?',
      [id]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user.', error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { userFirstName, userLastName, userContact, userAge, deleteProfileImage } = req.fields;
    const { image } = req.files || {};

    // Check if user exists
    const [existingUser] = await db.query(
      'SELECT * FROM users WHERE userID = ?',
      [userId]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = existingUser[0];
    let profileImageUrl = currentUser.profile_picture;

    // Handle image deletion if flag is set
    if (deleteProfileImage === 'true' && profileImageUrl) {
      try {
        const publicId = profileImageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`user_profile_images/${publicId}`);
        profileImageUrl = null;
      } catch (uploadError) {
        console.error('Cloudinary deletion error:', uploadError);
        profileImageUrl = null;
      }
    }

    // Handle new image upload
    if (image && image.path) {
      try {
        // Delete old image if exists
        if (profileImageUrl) {
          const publicId = profileImageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`user_profile_images/${publicId}`);
        }

        // Upload new image
        const result = await cloudinary.uploader.upload(image.path, {
          folder: "user_profile_images",
          resource_type: "auto"
        });
        profileImageUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to update profile image' });
      }
    }

    // Update user data
    const [results] = await db.query(
      'UPDATE users SET userFirstName = ?, userLastName = ?, userContact = ?, userAge = ?, profile_picture = ? WHERE userID = ?',
      [
        userFirstName || currentUser.userFirstName,
        userLastName || currentUser.userLastName,
        userContact || currentUser.userContact,
        userAge ? parseInt(userAge) : currentUser.userAge,
        profileImageUrl,
        userId
      ]
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        userId,
        updatedFields: {
          userFirstName: userFirstName || currentUser.userFirstName,
          userLastName: userLastName || currentUser.userLastName,
          userContact: userContact || currentUser.userContact,
          userAge: userAge ? parseInt(userAge) : currentUser.userAge,
          hasProfileImage: profileImageUrl
        }
      }
    });

  } catch (error) {
    console.error('Error during user update:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Update failed'
    });
  }
};

export const removeProfileImage = async (req, res) => {
  try {
    const userId = req.params.id;

    const [user] = await db.query(
      'SELECT profile_picture FROM users WHERE userID = ?',
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const currentImageUrl = user[0].profile_picture;

    if (!currentImageUrl) {
      return res.status(200).json({
        success: true,
        message: 'No profile image to remove'
      });
    }

    try {
      const publicId = currentImageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`user_profile_images/${publicId}`);
    } catch (cloudinaryError) {
      console.error('Cloudinary deletion error:', cloudinaryError);
      // Continue even if Cloudinary deletion fails to maintain DB consistency
    }

    await db.query(
      'UPDATE users SET profile_picture = NULL WHERE userID = ?',
      [userId]
    );

    res.status(200).json({
      success: true,
      message: 'Profile image removed successfully'
    });

  } catch (error) {
    console.error('Error removing profile image:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to remove profile image'
    });
  }
};

// Subscribe endpoint
export const subscribeToNotifications = async (req, res) => {
  const userID = req.params.id;
  if (!userID) {
    return res.status(400).json({ error: 'Missing user ID in params' });
  }
  try {
    await db.execute(
      'UPDATE users SET hasSubscribed = TRUE WHERE userID = ?',
      [userID]
    );
    res.status(200).json({ message: 'Successfully subscribed to property notifications' });
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Unsubscribe endpoint
export const unsubscribeFromNotifications = async (req, res) => {
  const userID = req.params.id;

  try {
    await db.execute(
      'UPDATE users SET hasSubscribed = FALSE WHERE userID = ?',
      [userID]
    );
    res.status(200).json({ message: 'Successfully unsubscribed from property notifications' });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const checkSubscriptionStatus = async (req, res) => {
  const userId = req.params.id;
  
  if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
  }

  try {
      // Using parameterized query to prevent SQL injection
      const [user] = await db.query(
          'SELECT userID, hasSubscribed FROM users WHERE userID = ? LIMIT 1', 
          [userId]
      );
      
      if (!user || user.length === 0) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ 
          isSubscribed: user[0].hasSubscribed === 1, 
          userId: user[0].userID
      });
  } catch (error) {
      console.error('Error checking subscription status:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};
