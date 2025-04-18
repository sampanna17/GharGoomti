import db from '../config/db.js';

export const getChats = async (req, res) => {
    const userId = req.body.userId;

    try {
        // Get all chats where the user is a participant
        const [chats] = await db.query(`
      SELECT c.* 
      FROM chats c
      JOIN user_chats cu ON c.chatID = cu.chatID
      WHERE cu.userID = ?
    `, [userId]);

        // For each chat, get the receiver info
        for (const chat of chats) {
            // Get receiver ID (the other participant)
            const [participants] = await db.query(`
        SELECT userID 
        FROM user_chats 
        WHERE chatID = ? AND userID != ?
      `, [chat.chatID, userId]);

            if (participants.length > 0) {
                const receiverId = participants[0].userID;

                // Get receiver details
                const [users] = await db.query(`
          SELECT userID, CONCAT(userFirstName, ' ', userLastName) AS 'Full Name',  profile_picture
          FROM users 
          WHERE userID = ?
        `, [receiverId]);

                chat.receiver = users[0];
            }
        }

        res.status(200).json(chats);
    } catch (err) {
        console.error('Get chats error:', err);
        res.status(500).json({
            message: 'Failed to get chats!',
            error: process.env.NODE_ENV === 'development' ? err : undefined
        });
    }
};


export const getChat = async (req, res) => {
    const userId = req.body.userId;
    const chatId = req.params.id;

    if (!userId || !chatId) {
        return res.status(400).json({ message: "Missing userId or chatId" });
    }

    try {

        const [access] = await db.query(`
            SELECT 1 FROM user_chats 
            WHERE chatID = ? AND userID = ? 
            LIMIT 1
        `, [chatId, userId]);

        if (access.length === 0) {
            return res.status(403).json({ message: "Access denied!" });
        }

        // Get chat
        const [chatData] = await db.query(`
            SELECT * FROM chats WHERE chatID = ? LIMIT 1
        `, [chatId]);

        if (chatData.length === 0) {
            return res.status(404).json({ message: "Chat not found!" });
        }

        // Get messages
        const [messages] = await db.query(`
            SELECT m.*, CONCAT(u.userFirstName, ' ', u.userLastName) AS senderName 
            FROM messages m
            JOIN users u ON m.userID = u.userID
            WHERE m.chatID = ? 
            ORDER BY m.created_at ASC
        `, [chatId]);

        // Mark as seen
        await db.query(`
            UPDATE user_chats 
            SET seen = 1, last_seen_at = NOW() 
            WHERE chatID = ? AND userID = ?
        `, [chatId, userId]);

        //Get participants
        const [participants] = await db.query(`
            SELECT userID, seen, last_seen_at 
            FROM user_chats 
            WHERE chatID = ?
        `, [chatId]);

        const seenBy = participants.filter(p => p.seen).map(p => p.userID);
        const participantIds = participants.map(p => p.userID);

        //Get receiver info (exclude current user)
        const receiverId = participantIds.find(id => id !== userId);

        let receiver = null;
        if (receiverId) {
            const [receiverData] = await db.query(`
                SELECT userID, CONCAT(userFirstName, ' ', userLastName) AS fullName , profile_picture
                FROM users 
                WHERE userID = ?
                LIMIT 1
            `, [receiverId]);

            receiver = receiverData[0] || null;
        }

        res.status(200).json({
            chat: chatData[0],
            messages,
            participants: participantIds,
            seenBy,
            receiver
        });

    } catch (err) {
        console.error('Get chat error:', err);
        res.status(500).json({
            message: "Failed to get chat!",
            error: process.env.NODE_ENV === 'development' ? err : undefined
        });
    }
};


export const addChat = async (req, res) => {
    const userId = req.body.userId;
    const receiverId = req.body.receiverId;

    if (!userId || !receiverId) {
        return res.status(400).json({
            message: 'Both user IDs are required.',
            details: {
                userIdReceived: userId,
                receiverIdReceived: receiverId
            }
        });
    }

    try {
        // Verify both users exist
        const [users] = await db.query(`
            SELECT userID FROM users 
            WHERE userID IN (?, ?)
        `, [userId, receiverId]);

        if (users.length !== 2) {
            const missingUsers = [];
            if (!users.some(u => u.userID == userId)) missingUsers.push(userId);
            if (!users.some(u => u.userID == receiverId)) missingUsers.push(receiverId);

            return res.status(404).json({
                message: 'User(s) not found',
                missingUsers
            });
        }

        const [existingChats] = await db.query(`
            SELECT c.chatID 
            FROM chats c
            JOIN user_chats uc1 ON c.chatID = uc1.chatID
            JOIN user_chats uc2 ON c.chatID = uc2.chatID
            WHERE uc1.userID = ? AND uc2.userID = ?
            LIMIT 1
        `, [userId, receiverId]);

        if (existingChats.length > 0) {
            return res.status(200).json({
                id: existingChats[0].chatID,
                message: 'Existing chat found'
            });
        }

        await db.query('START TRANSACTION');

        // Create new chat
        const [chatResult] = await db.query(`
            INSERT INTO chats (created_at) 
            VALUES (NOW())
        `);

        const chatId = chatResult.insertId;

        // Add both users to the chat
        await db.query(`
            INSERT INTO user_chats (userID, chatID, seen) 
            VALUES (?, ?, 0), (?, ?, 0)
        `, [userId, chatId, receiverId, chatId]);

        await db.query('COMMIT');

        res.status(200).json({ id: chatId });
    } catch (err) {
        // Rollback on error
        await db.query('ROLLBACK');
        console.error('Add chat error:', err);
        res.status(500).json({
            message: "Failed to add chat!",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

export const readChat = async (req, res) => {
    const userId = req.body.userId;
    const chatId = req.params.id;

    try {
        // Mark chat as read
        const [result] = await db.query(`
      UPDATE user_chats 
      SET seen = 1, last_seen_at = NOW() 
      WHERE chatID = ? AND userID = ?
    `, [chatId, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Chat not found or access denied!" });
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Read chat error:', err);
        res.status(500).json({
            message: "Failed to read chat!",
            error: process.env.NODE_ENV === 'development' ? err : undefined
        });
    }
};