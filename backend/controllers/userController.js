import db from '../config/db.js';

// **Get User Profile**
export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
      const [user] = await db.query(
          'SELECT userFirstName, userLastName, userContact, userEmail, userAge, role FROM users WHERE userID = ?',
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


// **Update User Profile**
export const updateUser = (req, res) => {
    const { userFirstName, userLastName, userContact, userEmail, userAge } = req.body;
    const userId = req.params.id; 
    
    if (!userFirstName || !userLastName || !userContact || !userEmail || !userAge) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    const sql = "UPDATE users SET userFirstName=?, userLastName=?, userContact=?, userEmail=?, userAge=? WHERE userID=?";
  
    db.query(sql, [userFirstName, userLastName, userContact, userEmail, userAge, userId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error updating user profile" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found." });
      }
      res.json({ message: "Profile updated successfully." });
    });
  };
  
