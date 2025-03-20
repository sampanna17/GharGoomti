import express from 'express';
import { addAppointment, getUserAppointments, removeAppointment, updateAppointmentStatus } from '../controllers/appoinmentController.js';

// Routes for managing appointments
router.post('/appointment', addAppointment);  // Create an appointment (book visit)
router.get('/appointments/:userID', getUserAppointments);  // Get all appointments for a user
router.put('/appointment/status', updateAppointmentStatus);  // Update appointment status
router.delete('/appointment', removeAppointment);  // Remove an appointment

export default router;