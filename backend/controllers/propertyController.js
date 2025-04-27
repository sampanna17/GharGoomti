
import db from '../config/db.js';
import cloudinary from '../config/cloudinary.js';
import { sendPropertyNotificationEmail } from '../utils/subscribeMail.js';

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

        const [subscribedUsers] = await db.query(`
            SELECT userEmail, CONCAT(userFirstName, ' ', userLastName) as userName
            FROM users
            WHERE hasSubscribed = TRUE AND userID != ?
        `, [userID]);

        // Send notifications to subscribed users
        if (subscribedUsers.length > 0) {
            const propertyDetails = {
                title: propertyTitle,
                price: propertyPrice,
                address: propertyAddress,
                city: propertyCity,
                type: propertyType,
                for: propertyFor,
                size: propertySize
            };

            for (const user of subscribedUsers) {
                await sendPropertyNotificationEmail(
                    user.userEmail,
                    user.userName,
                    propertyDetails
                );
            }
        }

        res.status(201).json({
            message: 'Property added successfully',
            propertyID: result.insertId,
            notifiedUsers: subscribedUsers.length
        });

    } catch (error) {
        console.error('Error adding property:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all properties
// export const getProperties = async (req, res) => {
//     try {
//         const [properties] = await db.query('SELECT * FROM property JOIN property_image ON property.propertyID = property_image.propertyID');
//         res.status(200).json(properties);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching properties.', error });
//     }
// };

export const getProperties = async (req, res) => {
    try {
        let baseQuery = `
            SELECT p.*, pi.imageID, pi.imageURL 
            FROM property p
            LEFT JOIN property_image pi ON p.propertyID = pi.propertyID
            WHERE 1=1
            ORDER BY p.created_at DESC
        `;
        
        const conditions = [];
        const params = [];
        
        if (req.query.city) {
            conditions.push('AND p.propertyCity LIKE ?');
            params.push(`%${req.query.city}%`);
        }

        if (req.query.type) {
            conditions.push('AND p.propertyFor = ?');
            params.push(req.query.type === 'rent' ? 'Rent' : 'Sale');
        }
        
        if (req.query.property) {
            conditions.push('AND p.propertyType = ?');
            params.push(req.query.property.charAt(0).toUpperCase() + req.query.property.slice(1));
        }
        
        if (req.query.minPrice) {
            conditions.push('AND p.propertyPrice >= ?');
            params.push(parseFloat(req.query.minPrice));
        }
        if (req.query.maxPrice) {
            conditions.push('AND p.propertyPrice <= ?');
            params.push(parseFloat(req.query.maxPrice));
        }
        
        if (req.query.bedroom) {
            conditions.push('AND p.bedrooms = ?');
            params.push(parseInt(req.query.bedroom));
        }
        
        const finalQuery = baseQuery + conditions.join(' ');
        const [properties] = await db.query(finalQuery, params);
        
        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ message: 'Error fetching properties.', error });
    }
};

export const getPropertyById = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch property details
        const [property] = await db.query('SELECT * FROM property WHERE propertyID = ?', [id]);
        
        if (property.length === 0) {
            return res.status(404).json({ message: 'Property not found.' });
        }

        // Fetch property images
        const [images] = await db.query(
            'SELECT imageURL FROM property_image WHERE propertyID = ?', 
            [id]
        );

        // Combine the data
        const propertyWithImages = {
            ...property[0],
            images: images.map(img => ({ imageURL: img.imageURL }))
        };

        res.status(200).json(propertyWithImages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching property.', error });
    }
};

// Delete a property 
export const deleteProperty = async (req, res) => {
    const { id } = req.params;

    try {
        const [images] = await db.query(
            'SELECT imageURL FROM property_image WHERE propertyID = ?', 
            [id]
        );

        for (const img of images) {
            const imageURL = img.imageURL;
            const publicId = imageURL.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`property_files/${publicId}`);
        }
  
        await db.query('DELETE FROM property_image WHERE propertyID = ?', [id]);
        await db.query('DELETE FROM property WHERE propertyID = ?', [id]);

        res.status(200).json({ message: 'Property and associated images deleted successfully.' });
    } catch (error) {
        console.error(error);
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
    const { propertyID, imageID } = req.params;

    try {
        const [result] = await db.query(
            'SELECT imageURL FROM property_image WHERE imageID = ? AND propertyID = ?', 
            [imageID, propertyID]
        );;

        if (result.length === 0) {
            return res.status(404).json({ message: 'Image not found.' });
        }

        const imageURL = result[0].imageURL;
        const publicId = imageURL.split('/').pop().split('.')[0]; 

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(`property_images/${publicId}`);

        // Delete from Database
        await db.query(
            'DELETE FROM property_image WHERE imageID = ? AND propertyID = ?', 
            [imageID, propertyID]
        );

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
                u.userContact,
                u.profile_picture
            FROM property p
            JOIN users u ON p.userID = u.userID
            WHERE p.propertyID = ?
        `;

        const [user] = await db.query(query, [id]);
        
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found for this property.' });
        }

        res.status(200).json({
            userID: user[0].userID,
            firstName: user[0].userFirstName,
            lastName: user[0].userLastName,
            contact: user[0].userContact,
            fullName: `${user[0].userFirstName} ${user[0].userLastName}`,
            profile: user[0].profile_picture,
        });

    } catch (error) {
        console.error('Error fetching property user:', error);
        res.status(500).json({ message: 'Error fetching property user.', error });
    }
};

export const getPropertyByUser = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ 
            success: false,
            message: 'User ID is required.' 
        });
    }

    try {
        // First get all properties for the user
        const query = `
            SELECT 
                p.propertyID,
                p.userID,
                p.propertyTitle,
                p.propertyPrice,
                p.propertyAddress,
                p.propertyCity,
                p.bedrooms,
                p.bathrooms,
                p.kitchens,
                p.halls,
                p.propertyType,
                p.propertyFor,
                p.propertySize,
                p.petPolicy,
                p.latitude,
                p.longitude,
                p.description,
                p.created_at
            FROM property p
            WHERE p.userID = ?
            ORDER BY p.created_at DESC
        `;

        const [properties] = await db.query(query, [userId]);

        if (properties.length === 0) {
            return res.status(404).json({ 
                success: true,
                message: 'No properties found for this user.',
                properties: [] 
            });
        }

        // Then get all images for each property
        const propertiesWithImages = await Promise.all(
            properties.map(async (property) => {
                const [images] = await db.query(
                    'SELECT imageURL FROM property_image WHERE propertyID = ?',
                    [property.propertyID]
                );
                
                // Convert created_at to JavaScript Date if needed
                const createdAt = property.created_at 
                    ? new Date(property.created_at) 
                    : null;
                
                return {
                    ...property,
                    images: images.map(img => img.imageURL),
                };
            })
        );

        res.status(200).json({ 
            success: true,
            count: propertiesWithImages.length,
            properties: propertiesWithImages
        });

    } catch (error) {
        console.error('Error fetching properties by user:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching properties.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


// Update property details
export const updateProperty = async (req, res) => {
    const { id } = req.params;
    const {propertyTitle, propertyPrice, propertyAddress, propertyCity, bedrooms, bathrooms, kitchens, halls, propertyType,  propertyFor, propertySize, petPolicy, latitude, longitude, description
    } = req.body;

    try {
        // Validate required fields
        if (!propertyTitle || !propertyPrice || !propertyAddress || !propertyCity) {
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

        // Check if property exists
        const [property] = await db.query('SELECT * FROM property WHERE propertyID = ?', [id]);
        if (property.length === 0) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Update the property in the database
        const query = `
            UPDATE property SET
                propertyTitle = ?,
                propertyPrice = ?,
                propertyAddress = ?,
                propertyCity = ?,
                bedrooms = ?,
                bathrooms = ?,
                kitchens = ?,
                halls = ?,
                propertyType = ?,
                propertyFor = ?,
                propertySize = ?,
                petPolicy = ?,
                latitude = ?,
                longitude = ?,
                description = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE propertyID = ?
        `;

        await db.execute(query, [
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
            description,
            id
        ]);

        res.status(200).json({
            success: true,
            message: 'Property updated successfully',
            propertyID: id
        });

    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const updatePropertyImages = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Check if property exists
        const [property] = await db.query('SELECT propertyID FROM property WHERE propertyID = ?', [id]);
        if (property.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Property not found' 
            });
        }

        // Check if files were uploaded
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No files were uploaded' 
            });
        }

        // Get the uploaded files from formidable
        const files = req.files.images;
        const filesArray = Array.isArray(files) ? files : [files];

        // Get existing images to delete from Cloudinary
        const [existingImages] = await db.query('SELECT imageURL FROM property_image WHERE propertyID = ?', [id]);
        
        // Delete existing images from Cloudinary
        await Promise.all(existingImages.map(async (image) => {
            const publicId = image.imageURL.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`property_files/${publicId}`);
        }));

        // Delete existing images from database
        await db.query('DELETE FROM property_image WHERE propertyID = ?', [id]);

        // Upload new images
        const uploadResults = [];

        for (const file of filesArray) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "property_files",
                resource_type: "auto"
            });

            const [dbResult] = await db.query(
                'INSERT INTO property_image (propertyID, imageURL) VALUES (?, ?)',
                [id, result.secure_url]
            );

            uploadResults.push({
                fileID: dbResult.insertId,
                fileURL: result.secure_url,
                fileType: result.resource_type
            });
        }

        res.status(200).json({ 
            success: true,
            message: 'Property images updated successfully',
            data: {
                images: uploadResults,
                totalImages: uploadResults.length
            }
        });

    } catch (error) {
        console.error('Error updating property images:', error);
        
        if (error.http_code) {
            return res.status(error.http_code).json({
                success: false,
                message: 'Image update failed',
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

export const getallProperties = async (req, res) => {
    try {
        const [properties] = await db.query(`
            SELECT p.*, 
                   pi.imageID, 
                   pi.imageUrl,
                   CONCAT(u.userFirstName, ' ', u.userLastName) AS sellerName,
                   u.userEmail,
                   u.userContact
            FROM property p
            LEFT JOIN property_image pi ON p.propertyID = pi.propertyID
            LEFT JOIN users u ON p.userID = u.userID
            ORDER BY p.created_at DESC
        `);

        const groupedProperties = properties.reduce((acc, curr) => {
            const existingProperty = acc.find(p => p.propertyID === curr.propertyID);
            if (existingProperty) {
                if (curr.imageID) {
                    existingProperty.images.push({
                        imageID: curr.imageID,
                        imageUrl: curr.imageUrl
                    });
                }
            } else {
                acc.push({
                    propertyID: curr.propertyID,
                    title: curr.propertyTitle,
                    price: curr.propertyPrice,
                    location: curr.propertyAddress,
                    seller: curr.sellerName,
                    sellerEmail: curr.userEmail,
                    sellerContact: curr.userContact,
                    description: curr.description,
                    bedrooms: curr.bedrooms,
                    bathrooms: curr.bathrooms,
                    Kitchens: curr.kitchens,
                    halls: curr.bathrooms,
                    area: curr.propertySize,
                    status: curr.propertyFor,
                    type: curr.propertyType,
                    petPolicy:curr.petPolicy,
                    createdAt: curr.created_at,
                    images: curr.imageID ? [{
                        imageID: curr.imageID,
                        imageUrl: curr.imageUrl
                    }] : []
                });
            }
            return acc;
        }, []);

        res.status(200).json(groupedProperties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ 
            message: 'Error fetching properties.', 
            error: error.message 
        });
    }
};