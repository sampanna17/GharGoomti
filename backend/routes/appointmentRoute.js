import express from 'express';
import { addAppointment, checkAppointment, getAppointmentDetails, getSellerPendingAppointments, getUserAppointments, removeAppointment, updateAppointment, updateAppointmentStatus } from '../controllers/appointmentController.js';

const router = express.Router();

// Routes for managing appointments
router.post('/add', addAppointment);  
router.get('/user/:userID', getUserAppointments);  
router.put('/seller/:appointmentID/status', updateAppointmentStatus);
router.delete('/:appointmentID', removeAppointment);
router.get('/seller/:sellerID', getSellerPendingAppointments);  
router.get('/check/:userID/:propertyID', checkAppointment);

router.put('/:appointmentID', updateAppointment); 
router.get('/:appointmentID', getAppointmentDetails); 

export default router;