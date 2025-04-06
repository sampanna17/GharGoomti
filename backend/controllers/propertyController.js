
import db from '../config/db.js';
import cloudinary from '../config/cloudinary.js';

// Add a new property
export const addProperty = async (req, res) => {
    try {
        const {
            userID,
            propertyTitle,
            propertyPrice,
            propertyAddress,
            propertyCity,
            bedrooms,
            bathrooms,
            kitchens,
            halls,
            propertyType,
            propertyFor,
            propertySize,
            petPolicy,
            latitude,
            longitude,
            description
        } = req.body;

        // Validate required fields
        if (!userID || !propertyTitle || !propertyPrice || !propertyAddress || !propertyCity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate enum values
        const validPropertyTypes = ['Apartment', 'Building', 'Flat'];
        const validPropertyFor = ['Rent', 'Sale'];
        const validPetPolicies = ['Available', 'Not Available'];

        if (!validPropertyTypes.includes(propertyType)) {
            return res.status(400).json({ error: 'Invalid property type' });
        }

        if (!validPropertyFor.includes(propertyFor)) {
            return res.status(400).json({ error: 'Invalid property for value' });
        }

        if (!validPetPolicies.includes(petPolicy)) {
            return res.status(400).json({ error: 'Invalid pet policy' });
        }

        // Convert numeric fields to integers
        const numericFields = {
            bedrooms: parseInt(bedrooms),
            bathrooms: parseInt(bathrooms),
            kitchens: parseInt(kitchens),
            halls: parseInt(halls),
            propertySize: parseInt(propertySize)
        };

        // Check if numeric fields are valid
        for (const [field, value] of Object.entries(numericFields)) {
            if (isNaN(value)) {
                return res.status(400).json({ error: `${field} must be a valid number` });
            }
        }

        // Create the property in the database
        const query = `
            INSERT INTO property (
                userID,
                propertyTitle,
                propertyPrice,
                propertyAddress,
                propertyCity,
                bedrooms,
                bathrooms,
                kitchens,
                halls,
                propertyType,
                propertyFor,
                propertySize,
                petPolicy,
                latitude,
                longitude,
                description
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
        `;

        const [result] = await db.execute(query, [
            userID,
            propertyTitle,
            propertyPrice,
            propertyAddress,
            propertyCity,
            numericFields.bedrooms,
            numericFields.bathrooms,
            numericFields.kitchens,
            numericFields.halls,
            propertyType,
            propertyFor,
            numericFields.propertySize,
            petPolicy,
            latitude,
            longitude,
            description
        ]);

        res.status(201).json({
            message: 'Property added successfully',
            propertyID: result.insertId
        });

    } catch (error) {
        console.error('Error adding property:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all properties
export const getProperties = async (req, res) => {
    try {
        const [properties] = await db.query('SELECT * FROM property JOIN property_image ON property.propertyID = property_image.propertyID');
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

// Add image to property 
export const addPropertyImage = async (req, res) => {
    const { id } = req.params; 
    
    try {

        const [property] = await db.query('SELECT propertyID FROM property WHERE propertyID = ?', [id]);
        if (!property) {
            return res.status(404).json({ 
                success: false, 
                message: 'Property not found' 
            });
        }

        const [imageCount] = await db.query(
            'SELECT COUNT(*) AS count FROM property_image WHERE propertyID = ?', 
            [id]
        );
        
        if (imageCount[0].count >= 6) {
            return res.status(400).json({
                success: false,
                message: 'Maximum of 6 images allowed per property'
            });
        }

        if (!req.files || !req.files.image) {
            return res.status(400).json({ 
                success: false, 
                message: 'No file was uploaded' 
            });
        }

        const { image } = req.files;

        const result = await cloudinary.uploader.upload(image.path, {
            folder: "property_files",
            resource_type: "auto"
        });

        const query = 'INSERT INTO property_image (propertyID, imageURL) VALUES (?, ?)';
        const [dbResult] = await db.query(query, [id, result.secure_url]);

        res.status(201).json({ 
            success: true,
            message: 'File uploaded successfully',
            data: {
                fileID: dbResult.insertId,
                fileURL: result.secure_url,
                fileType: result.resource_type, // 'image', 'video', 'raw', etc.
                currentImageCount: imageCount[0].count + 1,
                maxImagesAllowed: 6
            }
        });

    } catch (error) {
        console.error('File upload error:', error);
        
        if (error.http_code) {
            return res.status(error.http_code).json({
                success: false,
                message: 'File upload failed',
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
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

// Delete property image from Cloudinary and database
export const deletePropertyImage = async (req, res) => {
    const { imageID } = req.body;

    try {
        const [result] = await db.query('SELECT imageURL FROM property_image WHERE imageID = ?', [imageID]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Image not found.' });
        }

        const imageURL = result[0].imageURL;
        const publicId = imageURL.split('/').pop().split('.')[0]; 

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(`property_images/${publicId}`);

        // Delete from Database
        await db.query('DELETE FROM property_image WHERE imageID = ?', [imageID]);

        res.status(200).json({ message: 'Image deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting image.', error });
    }
};

export const getPropertyUser = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT 
                u.userID,
                u.userFirstName,
                u.userLastName,
                u.userContact
            FROM property p
            JOIN users u ON p.userID = u.userID
            WHERE p.propertyID = ?
        `;

        const [user] = await db.query(query, [id]);
        
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found for this property.' });
        }

        res.status(200).json({
            firstName: user[0].userFirstName,
            lastName: user[0].userLastName,
            contact: user[0].userContact,
            fullName: `${user[0].userFirstName} ${user[0].userLastName}`
        });

    } catch (error) {
        console.error('Error fetching property user:', error);
        res.status(500).json({ message: 'Error fetching property user.', error });
    }
};