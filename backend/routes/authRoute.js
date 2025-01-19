import express from 'express';
import { sendemail, registerUser } from '../controllers/authController.js';


const router = express.Router();

router.post('/sendmail',sendemail)
router.post('/register', registerUser);


export default router;