import express from 'express';
import {forgotPassword, google, refreshToken, registerUser, resetPassword, signin, signOut, verifyEmail } from '../controllers/authController.js';
import {sendemail } from '../utils/sendemail.js';
import {sendResetEmail} from '../utils/sendResetEmail.js';
import formidable from 'express-formidable';

const router = express.Router();

// Routes for authentication
router.post('/sendmail',sendemail)
router.post('/register',formidable(), registerUser);
// router.post('/register', registerUser);
router.post('/signin', signin);
router.post("/refresh-token", refreshToken);
router.post('/google', google);
router.post('/verify-email', verifyEmail);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);
router.post('/sendResetEmail', sendResetEmail);
router.post("/signout", signOut);

export default router;