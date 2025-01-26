import express from 'express';
import {forgotPassword, google, registerUser, resetPassword, signin, signOut, verifyEmail } from '../controllers/authController.js';
import {sendemail } from '../utils/sendemail.js';
import {sendResetEmail} from '../utils/sendResetEmail.js';
import { bookmarkProperty, getBookmarks, removeBookmarks } from '../controllers/bookmarkController.js';
import { addProperty, addPropertyImage, deleteProperty, getProperties, getPropertyById, getPropertyImages } from '../controllers/propertyController.js';
import { addAppointment, getUserAppointments, removeAppointment, updateAppointmentStatus } from '../controllers/appoinmentController.js';
import upload from '../config/multer.js';  // Import the multer configuration

const router = express.Router();

// Routes for authentication
router.post('/sendmail',sendemail)
router.post('/register', registerUser);
router.post('/signin', signin);
router.post('/google', google);
router.post('/signout', signOut);
router.post('/verify-email', verifyEmail);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);
router.post('/sendResetEmail', sendResetEmail);

// Property routes
router.post('/property', addProperty); // Add a new property
router.get('/properties', getProperties); // Get all properties
router.get('/property/:id', getPropertyById); // Get a specific property by ID
router.delete('/property/:id', deleteProperty); // Delete a property

// Property image routes
router.post('/property/:id/images', upload.single('image'), addPropertyImage); // Add an image to a property
router.get('/property/:id/images', getPropertyImages); // Get images for a specific property

// Routes for bookmarks
router.post('/bookmark',bookmarkProperty)
router.delete('/bookmark', removeBookmarks); // Route to remove a bookmark
router.get('/bookmark/:userId', getBookmarks);// Route to get all bookmarks for a user

// Routes for managing appointments
router.post('/appointment', addAppointment);  // Create an appointment (book visit)
router.get('/appointments/:userID', getUserAppointments);  // Get all appointments for a user
router.put('/appointment/status', updateAppointmentStatus);  // Update appointment status
router.delete('/appointment', removeAppointment);  // Remove an appointment

export default router;