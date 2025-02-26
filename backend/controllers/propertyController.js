
import db from '../config/db.js'; 
import fs from 'fs';
import upload from '../config/multer.js'; 

// Add a new property
export const addProperty = async (req, res) => {
    const { userID, propertyTitle, propertyPrice, propertyType, propertyLocation, propertySize } = req.body;

    // Check if all required fields are provided
    if (!userID || !propertyTitle || !propertyPrice || !propertyType || !propertyLocation || !propertySize) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Insert property into the database
        const query = `
            INSERT INTO property (userID, propertyTitle, propertyPrice, propertyType, propertyLocation, propertySize, created_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        const [result] = await db.query(query, [userID, propertyTitle, propertyPrice, propertyType, propertyLocation, propertySize]);

        res.status(201).json({ message: 'Property added successfully.', propertyID: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error adding property.', error });
    }
};


// Get all properties
export const getProperties = async (req, res) => {
    try {
        const [properties] = await db.query('SELECT * FROM property');
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching properties.', error });
    }
};

// Get a single property by ID
export const getPropertyById = async (req, res) => {
    const { id } = req.params;

    try {
        const [property] = await db.query('SELECT * FROM property WHERE propertyID = ?', [id]);
        if (property.length === 0) {
            return res.status(404).json({ message: 'Property not found.' });
        }
        res.status(200).json(property[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching property.', error });
    }
};

// Delete a property 
export const deleteProperty = async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM property WHERE propertyID = ?', [id]);
        res.status(200).json({ message: 'Property deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting property.', error });
    }
};

// Add an image to a property
export const addPropertyImage = async (req, res) => {
    const { id } = req.params; // propertyID

    // Check if file is uploaded
    if (!req.file) {
        return res.status(400).json({ message: 'Image file is required.' });
    }

    // Construct the image URL from the uploaded file's path
    const imageURL = `/uploads/images/${req.file.filename}`;

    try {
        // Insert image into the database
        const query = 'INSERT INTO property_image (propertyID, imageURL) VALUES (?, ?)';
        await db.query(query, [id, imageURL]);

        res.status(201).json({ message: 'Image added to property.', imageURL });
    } catch (error) {
        res.status(500).json({ message: 'Error adding image to property.', error });
    }
};

// Get all images for a property
export const getPropertyImages = async (req, res) => {
    const { id } = req.params; 

    try {
        const [images] = await db.query('SELECT * FROM property_image WHERE propertyID = ?', [id]);
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching property images.', error });
    }
};

// Delete a property image from the server and the database
export const deletePropertyImages = async (req, res) => {
    const { imageID } = req.body;

    try {
        const [result] = await db.query('SELECT imageURL FROM property_image WHERE imageID = ?', [imageID]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Image not found.' });
        }

        // Delete the image file from the server
        const imagePath = `uploads/images/${result[0].imageURL.split('/').pop()}`;
        fs.unlinkSync(imagePath);

        await db.query('DELETE FROM property_image WHERE imageID = ?', [imageID]);

        res.status(200).json({ message: 'Image deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting image.', error });
    }
};