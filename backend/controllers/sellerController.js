import db from '../config/db.js';
import { sendSellerRequestNotification, sendSellerStatusUpdate } from '../utils/sendSellerRequest.js';

export const requestSellerStatus = async (req, res) => {
    const { userID } = req.body;

    if (!userID) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        // Check if user exists and is a buyer
        const [user] = await db.query(`
            SELECT userID, userFirstName, userLastName, userEmail, userContact, role 
            FROM users 
            WHERE userID = ?
        `, [userID]);

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user[0].role !== 'buyer') {
            return res.status(403).json({ 
                message: 'Only buyers can request seller status.' 
            });
        }

        // Check for existing pending request
        const [existingRequest] = await db.query(`
            SELECT requestSeller FROM users 
            WHERE userID = ? AND requestSeller = 'Pending'
        `, [userID]);

        if (existingRequest.length > 0) {
            return res.status(409).json({ 
                message: 'You already have a pending seller request.' 
            });
        }

        // Update user's request status
        await db.query(`
            UPDATE users 
            SET requestSeller = 'Pending' 
            WHERE userID = ?
        `, [userID]);

        // Get all admin emails
        const [admins] = await db.query(`
            SELECT userEmail FROM users WHERE role = 'admin'
        `);

        // Send notification to admins
        if (admins.length > 0) {
            await sendSellerRequestNotification(
                admins.map(a => a.userEmail),
                user[0]
            );
        }

        res.status(200).json({
            message: 'Seller request submitted successfully. Admins have been notified.'
        });
    } catch (error) {
        console.error('Error in requestSellerStatus:', error);
        res.status(500).json({ 
            message: 'Error processing seller request.',
            error: error.message 
        });
    }
};

export const getSellerRequests = async (req, res) => {
    try {
        const [requests] = await db.query(`
            SELECT 
                userID, 
                userFirstName, 
                userLastName, 
                userEmail, 
                userContact, 
                created_at 
            FROM users 
            WHERE requestSeller = 'Pending'
            ORDER BY created_at DESC
        `);

        res.status(200).json(requests);
    } catch (error) {
        console.error('Error in getSellerRequests:', error);
        res.status(500).json({ 
            message: 'Error fetching seller requests.',
            error: error.message 
        });
    }
};


export const updateSellerRequest = async (req, res) => {
    const { userID, status } = req.body;

    if (!userID || !status) {
        return res.status(400).json({ 
            message: 'User ID and status are required.' 
        });
    }

    if (!['Accepted', 'Rejected'].includes(status)) {
        return res.status(400).json({ 
            message: 'Invalid status. Must be "Accepted" or "Rejected".' 
        });
    }

    try {
        // Verify the request exists and get user details
        const [user] = await db.query(`
            SELECT 
                userID, 
                userFirstName, 
                userEmail, 
                requestSeller 
            FROM users 
            WHERE userID = ? AND requestSeller = 'Pending'
        `, [userID]);

        if (user.length === 0) {
            return res.status(404).json({ 
                message: 'No pending seller request found for this user.' 
            });
        }

        // Build the update query based on status
        let updateQuery = '';
        let queryParams = [];

        if (status === 'Accepted') {
            updateQuery = `
                UPDATE users 
                SET 
                    requestSeller = ?, 
                    role = 'seller'
                WHERE userID = ?
            `;
            queryParams = [status, userID];
        } else {
            updateQuery = `
                UPDATE users 
                SET 
                    requestSeller = ?
                WHERE userID = ?
            `;
            queryParams = [status, userID];
        }

        // Execute update
        await db.query(updateQuery, queryParams);

        // Send status update to user
        await sendSellerStatusUpdate(
            user[0].userEmail,
            user[0].userFirstName,
            status
        );

        res.status(200).json({ 
            message: `Seller request ${status.toLowerCase()} successfully.` 
        });

    } catch (error) {
        console.error('Error in updateSellerRequest:', error);
        res.status(500).json({ 
            message: 'Error updating seller request.',
            error: error.message 
        });
    }
};


export const getSellerRequestStatus = async (req, res) => {
    const { userID } = req.params;

    try {
        const [user] = await db.query(`
            SELECT role, requestSeller 
            FROM users 
            WHERE userID = ?
        `, [userID]);

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({
            currentRole: user[0].role,
            requestStatus: user[0].requestSeller || 'NotRequested'
        });
    } catch (error) {
        console.error('Error in getSellerRequestStatus:', error);
        res.status(500).json({ 
            message: 'Error checking seller request status.',
            error: error.message 
        });
    }
};