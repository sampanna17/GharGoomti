import express from 'express';
import { addProperty, addPropertyImage, deleteProperty, getProperties, getPropertyById, getPropertyImages } from '../controllers/propertyController.js';
import { bookmarkProperty, getBookmarks, removeBookmarks } from '../controllers/bookmarkController.js';


const router = express.Router();

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

export default router;