import express from 'express';
import { addProperty, addPropertyImage, deleteProperty, deletePropertyImage, getProperties, getPropertyById, getPropertyImages, getPropertyUser, updateProperty, updatePropertyImages } from '../controllers/propertyController.js';
import { bookmarkProperty, checkBookmarkStatus, getBookmarks, removeBookmarks } from '../controllers/bookmarkController.js';
import formidable from 'express-formidable';

const router = express.Router();

// Property routes
router.post('/property', addProperty); 
router.get('/properties', getProperties); 
router.get('/property/:id', getPropertyById); 
router.delete('/property/:id', deleteProperty); 

// Property image routes
router.post('/property/:id/images', formidable(), addPropertyImage);
router.get('/property/:id/images', getPropertyImages); 
router.delete('/property/:propertyID/images/:imageID', deletePropertyImage);

// Routes for bookmarks
router.post('/bookmark',bookmarkProperty)
router.delete('/bookmark', removeBookmarks); 
router.get('/bookmark/:userID', getBookmarks);
router.get('/bookmark/check/:userID/:propertyID', checkBookmarkStatus);

// Routes for user proerty
router.get('/property/:id/user', getPropertyUser);

// New update routes
router.put('/property/:id', updateProperty);
router.put('/property/:id/images', formidable(), updatePropertyImages);

export default router;