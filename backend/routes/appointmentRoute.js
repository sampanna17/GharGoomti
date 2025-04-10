import express from 'express';
import { addAppointment, getSellerPendingAppointments, getUserAppointments, removeAppointment, updateAppointmentStatus } from '../controllers/appointmentController.js';

const router = express.Router();

// Routes for managing appointments
router.post('/add', addAppointment);  
router.get('/user/:userID', getUserAppointments);  
router.put('/seller/:appointmentID/status', updateAppointmentStatus);
router.delete('/:appointmentID', removeAppointment);
router.get('/seller/:userID', getSellerPendingAppointments);  

export default router;