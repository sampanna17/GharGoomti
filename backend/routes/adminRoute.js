import express from 'express';
import { deleteUser, getDashboardStats } from '../controllers/adminController.js';
import { getAllUsers } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/stats', getDashboardStats);
router.delete('/:id', deleteUser);


export default router;