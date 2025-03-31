import db from '../config/db.js'; // Import the database connection
import { sendemail } from '../utils/sendemail.js'; // Import the email utility
import { sendResetEmail, mailTemplate } from '../utils/sendResetEmail.js';
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

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

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Set expiry for OTP (5 minutes)
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    console.log("Generated OTP:", otp);
    console.log("Generated OTP Expiry:", otpExpiry);

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
      password: hashedPassword,
      role,
      otp,
      otpExpiry,
    };

    // Insert the new user into the database
    const [results] = await db.query(
      'INSERT INTO users (userFirstName, userLastName, userContact, userEmail, userAge, password, role, otp, otp_expiry) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        userData.userFirstName,
        userData.userLastName,
        userData.userContact,
        userData.userEmail,
        userData.userAge,
        userData.password,
        userData.role,
        userData.otp,
        userData.otpExpiry,
      ]
    );

    // Update Database with OTP details
    const [updateResult] = await db.query(
      'UPDATE users SET otp = ?, otp_expiry = ? WHERE userEmail = ?',
      [otp, otpExpiry, userEmail]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: "User not found. OTP not updated." });
    }

    console.log("OTP updated successfully in the database.");
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

export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  // Check if email or OTP are missing
  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    // Retrieve the OTP from the database
    const [user] = await db.query("SELECT otp FROM users WHERE userEmail = ?", [email]);

    if (!user.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const { otp: storedOtp } = user[0];

    // Check if the OTP matches
    if (otp !== storedOtp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Clear the OTP in the database
    await db.query("UPDATE users SET otp = NULL WHERE userEmail = ?", [email]);

    // Return success response with user data
    res.status(200).json({ 
      message: "Email verified successfully!", 
      user: { email } 
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signin = async (req, res) => {
  const { userEmail, password, rememberMe } = req.body;

  if (!userEmail || !password) {
    return res.status(400).json({ error: "Email and password are required!" });
  }

  try {
    // Check if the user exists
    const [rows] = await db.query("SELECT * FROM users WHERE userEmail = ?", [userEmail]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found!" });
    }

    const validUser = rows[0];

    if (!validUser.password) {
      return res.status(500).json({ error: "Password field is missing in the database!" });
    }

    // Compare password
    const isPasswordValid = bcrypt.compareSync(password, validUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Wrong credentials!" });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET, {
      expiresIn: "15m", // Access Token 
    });

    const refreshToken = jwt.sign({ id: validUser.id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: rememberMe ? "30d" : "1d", 
    });

    // Store access token 
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    // Store refresh token 
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, 
    });

    const { password: hashedPassword, ...userDetails } = validUser;

    res.status(200).json({ message: "Login successful!", user: userDetails });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) return res.status(403).json({ error: "Refresh token required" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid refresh token" });

    const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    res.json({ accessToken: newAccessToken });
  });
};

export const google = async (req, res) => {
  const { userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).json({ error: "Email is required!" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE userEmail = ?", [userEmail]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found!" });
    }

    const validUser = rows[0];

    const token = jwt.sign(
      { id: validUser.id, email: validUser.userEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password, ...userDetails } = validUser;

    res.status(200).json({
      message: "Google sign-in successful!",
      user: userDetails,
      token, 
    });
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signOut = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.clearCookie("connect.sid"); // Remove session cookie
      res.json({ message: "Logged out successfully" });
  });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { userEmail } = req.body;

    // Fetch user by email
    const [user] = await db.query(
      `SELECT userID, userEmail FROM users WHERE userEmail = ?`,
      [userEmail]
    );

    if (!user || user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "You are not registered! Please Signp First.",
      });
    }

    const currentTime = new Date();
    const resetTokenExpiry = new Date(user[0].reset_token_expiry);

    if (resetTokenExpiry > currentTime) {
      return res.status(400).json({
        success: false,
        message: "A password reset link has already been sent. Please check your email.",
      });
    }

    // Generate a reset token
    const token = crypto.randomBytes(20).toString("hex");
    const resetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Update the user's reset token and expiry in the database
    const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 1000).toISOString(); // 24 hours expiry
    await db.query(
      `UPDATE users 
       SET reset_password_token = ?, reset_token_expiry = ? 
       WHERE userID = ?`,
      [resetToken, expiresAt, user[0].userID]
    );

    // Email content
    const mailOption = {
      email: userEmail,
      subject: "Forgot Password Link",
      message: mailTemplate(
        "We have received a request to reset your password. Please reset your password using the link below.",
        `${process.env.FRONTEND_URL}/reset-password?id=${user[0].userID}&token=${resetToken}`,
        "Reset Password"
      ),
    };

    // Send the reset email
    await sendResetEmail(mailOption);

    // Send success response
    res.status(200).json({
      success: true,
      message: "A password reset link has been sent to your email.",
    });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });
  }
};

const NumSaltRounds = 10; 
export const resetPassword = async (req, res) => {
  try {
    const { userID, password, reset_password_token } = req.body;

    // Fetch the reset token for the user
    const [userToken] = await db.query(
      `SELECT reset_password_token 
       FROM users 
       WHERE userID = ?`,
      [userID]
    );

    console.log("Database Token:", userToken[0].reset_password_token);
    console.log("Request Token:", reset_password_token);

    // Check if the user exists and has a reset token
    if (!userToken || userToken.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invalid reset link!",
      });
    }

    // Check if the reset token matches
    if (userToken[0].reset_password_token !== reset_password_token) {
      return res.status(400).json({
        success: false,
        message: "Reset Password link is invalid!",
      });
    }

    // Clear the reset token and expiry time
    await db.query(
      `UPDATE users 
       SET reset_password_token = NULL, reset_token_expiry = NULL 
       WHERE userID = ?`,
      [userID]
    );

    // Hash the new password
    const salt = await bcrypt.genSalt(NumSaltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password
    await db.query(
      `UPDATE users 
       SET password = ? 
       WHERE userID = ?`,
      [hashedPassword, userID]
    );

    // success response
    res.status(200).json({
      success: true,
      message: "Your password has been reset successfully!",
    });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });
  }
};