import db from '../config/db.js';

export const addMessage = async (req, res) => {
    const userId = req.body.userId; 
    const chatId = req.params.chatId;
    const text = req.body.text;

    if (!text) {
        return res.status(400).json({ message: "Message text is required!" });
    }

    try {
        // Check if user has access to the chat
        const [chatAccess] = await db.query(`
            SELECT 1 FROM user_chats 
            WHERE chatID = ? AND userID = ?
            LIMIT 1
        `, [chatId, userId]);

        if (chatAccess.length === 0) {
            return res.status(403).json({ message: "Chat not found or access denied!" });
        }

        await db.query('START TRANSACTION');

        const [messageResult] = await db.query(`
            INSERT INTO messages (text, userID, chatID, created_at)
            VALUES (?, ?, ?, NOW())
        `, [text, userId, chatId]);

        await db.query(`
            UPDATE chats 
            SET last_message = ?, last_message_at = NOW()
            WHERE chatID = ?
        `, [text, chatId]);

        // Mark message as seen by the sender
        await db.query(`
            UPDATE user_chats 
            SET seen = 1, last_seen_at = NOW()
            WHERE chatID = ? AND userID = ?
        `, [chatId, userId]);

        await db.query('COMMIT');

        const [message] = await db.query(`
            SELECT m.*, CONCAT(u.userFirstName, ' ', u.userLastName) AS senderName
            FROM messages m
            JOIN users u ON m.userID = u.userID
            WHERE m.messageID = ?
            LIMIT 1
        `, [messageResult.insertId]);

        res.status(200).json(message[0]);
    } catch (err) {
        // Rollback on error
        await db.query('ROLLBACK');
        console.error('Add message error:', err);
        res.status(500).json({ 
            message: "Failed to add message!",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};