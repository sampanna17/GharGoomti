import db from '../config/db.js';


// export const bookmarkProperty = async (req, res) => {
//     const { userID, propertyID } = req.body;

//     if (!userID || !propertyID) {
//         return res.status(400).json({ message: 'User ID and Property ID are required.' });
//     }

//     try {
//         await db.query(
//             'INSERT INTO bookmark (userID, propertyID) VALUES (?, ?)',
//             [userID, propertyID]
//         );
//         res.status(201).json({ message: 'Property added to bookmark.' });
//     } catch (error) {
//         if (error.code === 'ER_DUP_ENTRY') {
//             res.status(400).json({ message: 'Property already in bookmark.' });
//         } else {
//             res.status(500).json({ message: 'Error adding property to bookmark.', error });
//         }
//     }
// };

// Add bookmark
export const bookmarkProperty = async (req, res) => {
    const { userID, propertyID } = req.body;

    if (!userID || !propertyID) {
        return res.status(400).json({ message: 'User ID and Property ID are required.' });
    }

    try {
        // First check if bookmark already exists
        const [existing] = await db.query(
            'SELECT 1 FROM bookmark WHERE userID = ? AND propertyID = ? LIMIT 1',
            [userID, propertyID]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Property already in bookmark.' });
        }

        // If not exists, insert new bookmark
        const [result] = await db.query(
            'INSERT INTO bookmark (userID, propertyID) VALUES (?, ?)',
            [userID, propertyID]
        );

        res.status(201).json({ 
            message: 'Property added to bookmark.',
            bookmarkID: result.insertId
        });
    } catch (error) {
        console.error('Bookmark error:', error);
        res.status(500).json({ 
            message: 'Error processing bookmark request.',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

// Remove bookmark
export const removeBookmarks = async (req, res) => {
    const { userID, propertyID } = req.body;

    if (!userID || !propertyID) {
        return res.status(400).json({ message: 'User ID and Property ID are required.' });
    }

    try {
        await db.query('DELETE FROM bookmark WHERE userID = ? AND propertyID = ?', [userID, propertyID]);
        res.status(200).json({ message: 'Property removed from bookmark.' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing property from bookmark.', error });
    }
};


export const getBookmarks = async (req, res) => {
    const { userID } = req.params;

    if (!userID) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        // First get all bookmarked properties
        const [bookmarks] = await db.query(
            `SELECT 
                b.propertyID, 
                p.propertyTitle, 
                p.propertyPrice, 
                p.propertyType, 
                p.propertyAddress,
                p.propertyCity,
                p.bedrooms,
                p.bathrooms,
                p.propertyFor
             FROM 
                bookmark b
             JOIN 
                property p 
             ON 
                b.propertyID = p.propertyID 
             WHERE 
                b.userID = ?`,
            [userID]
        );

        // Then get all images for each property
        const bookmarksWithImages = await Promise.all(
            bookmarks.map(async (property) => {
                const [images] = await db.query(
                    'SELECT imageURL FROM property_image WHERE propertyID = ?',
                    [property.propertyID]
                );
                return {
                    ...property,
                    images: images.map(img => img.imageURL)
                };
            })
        );

        res.status(200).json(bookmarksWithImages);
    } catch (error) {
        console.error('Get bookmarks error:', error);
        res.status(500).json({ 
            message: 'Error retrieving bookmarks.',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};



// Add this to your bookmark controller file
export const checkBookmarkStatus = async (req, res) => {
    const { userID, propertyID } = req.params;

    if (!userID || !propertyID) {
        return res.status(400).json({ 
            message: 'Both userID and propertyID are required.' 
        });
    }

    try {
        const [bookmarks] = await db.query(
            `SELECT 1 FROM bookmark 
             WHERE userID = ? AND propertyID = ?`,
            [userID, propertyID]
        );

        res.status(200).json({ 
            isBookmarked: bookmarks.length > 0 
        });
    } catch (error) {
        console.error('Check bookmark error:', error);
        res.status(500).json({ 
            message: 'Error checking bookmark status.',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};