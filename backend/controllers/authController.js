import nodemailer from 'nodemailer';
import { registerQuery } from '../config/query.js';

// Refactor `sendemail` to return a promise
export const sendemail = async (to, subject, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'piyasampanna@gmail.com',
      pass: 'ugdalllppzqdwcjd', // Use an App Password for better security
    },
  });

  const mailOptions = {
    from: 'piyasampanna@gmail.com',
    to,
    subject,
    text: `Your OTP is ${otp}`, // Include the OTP in the email body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    return true; // Indicate success
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email.');
  }
};

export const registerUser = (req, res) => {
  const { userName, userAge, userContact, userEmail, role, password } = req.body;

  // Validate the incoming data
  if (!userName || !userAge || !userContact || !userEmail || !role || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Prepare the data object
  const userData = {
    userName,
    userAge,
    userContact,
    userEmail,
    role,
    password,
  };

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Insert user into the database
  registerQuery(userData, async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to register user', details: err.message });
    }

    try {
      // Send the email
      await sendemail(userEmail, 'Registration Successful', otp);
      res.status(201).json({
        message: 'User registered successfully and email sent!',
        data: results,
      });
    } catch (emailError) {
      res.status(500).json({
        message: 'User registered, but failed to send email.',
        error: emailError.message,
      });
    }
  });
};
