import db from '../config/db.js'; // Import the database connection
import { sendemail } from '../utils/sendemail.js'; // Import the email utility
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing

export const registerUser = async (req, res) => {
  const { userFirstName, userLastName, userContact, userEmail, userAge, password, role } = req.body;

  // Validate the incoming data
  if (!userFirstName || !userLastName || !userContact || !userEmail || !userAge || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if the email already exists
    const [existingUser] = await db.query(
      'SELECT * FROM users WHERE userEmail = ?',
      [userEmail]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prepare the data object
    const userData = {
      userFirstName,
      userLastName,
      userContact,
      userEmail,
      userAge,
      password: hashedPassword, // Use the hashed password
      role,
    };

    // Insert the new user into the database
    const [results] = await db.query(
      'INSERT INTO users (userFirstName, userLastName, userContact, userEmail, userAge, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        userData.userFirstName,
        userData.userLastName,
        userData.userContact,
        userData.userEmail,
        userData.userAge,
        userData.password,
        userData.role,
      ]
    );

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Send the email with OTP
    await sendemail(userEmail, 'Registration Successful', otp);

    res.status(201).json({
      message: 'User registered successfully and email sent!',
      data: results,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};