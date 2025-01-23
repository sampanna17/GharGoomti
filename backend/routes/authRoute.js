import express from 'express';
import {forgotPassword, google, registerUser, resetPassword, signin, signOut, verifyEmail } from '../controllers/authController.js';
import {sendemail } from '../utils/sendemail.js';
import {sendResetEmail} from '../utils/sendResetEmail.js';

const router = express.Router();

router.post('/sendmail',sendemail)
router.post('/register', registerUser);
router.post('/signin', signin);
router.post('/google', google);
router.post('/signout', signOut);
router.post('/verify-email', verifyEmail);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);
router.post('/sendResetEmail', sendResetEmail);

export default router;