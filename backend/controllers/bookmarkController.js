// Add bookmark
export const bookmarkProperty = async (req, res) => {
    const { userID, propertyID } = req.body;

    if (!userID || !propertyID) {
        return res.status(400).json({ message: 'User ID and Property ID are required.' });
    }

    try {
        await db.query(
            'INSERT INTO bookmark (userID, propertyID, created_at) VALUES (?, ?, NOW())',
            [userID, propertyID]
        );
        res.status(201).json({ message: 'Property added to bookmark.' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'Property already in bookmark.' });
        } else {
            res.status(500).json({ message: 'Error adding property to bookmark.', error });
        }
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

// Get all bookmarks for a user
export const getBookmarks = async (req, res) => {
    const { userID } = req.params;

    if (!userID) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const [bookmarks] = await db.query(
            `SELECT 
                b.propertyID, 
                p.propertyTitle, 
                p.propertyPrice, 
                p.propertyType, 
                p.propertyLocation, 
                p.propertySize 
             FROM 
                bookmark b
             INNER JOIN 
                property p 
             ON 
                w.propertyID = p.propertyID 
             WHERE 
                w.userID = ?`,
            [userID]
        );
        res.status(200).json({ bookmarks });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving bookmarks.', error });
    }
};