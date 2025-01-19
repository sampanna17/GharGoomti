import express from 'express';
import {registerUser } from '../controllers/authController.js';
import {sendemail } from '../utils/sendemail.js';


const router = express.Router();

router.post('/sendmail',sendemail)
router.post('/register', registerUser);


export default router;