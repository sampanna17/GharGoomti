import express from 'express';
import { countPropertyByTypes, countUsersByRoles, deleteUser, getDashboardStats, getPropertiesOverTime } from '../controllers/adminController.js';
import { getAllUsers } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/stats', getDashboardStats);
router.delete('/:id', deleteUser);
router.get('/property-types', countPropertyByTypes);
router.get('/role-count', countUsersByRoles);
router.get('/property-overtime', getPropertiesOverTime);

export default router;