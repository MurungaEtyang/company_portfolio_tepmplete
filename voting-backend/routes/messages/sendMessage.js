import express from "express";
import { authenticateJWT } from "../../middleware/authenticateJWT.js";
import pool from "../../config/config.js";

const router = express.Router();

router.post('/kenf/v1/send-message', authenticateJWT, async (req, res) => {
    const { recipientUsername, message } = req.body;
    const { id: senderId } = req.user;

    if (!recipientUsername || !message) {
        return res.status(400).json({ error: 'The sender, recipient and message body are all required' });
    }

    try {
        const client = await pool.connect();
        const query = 'SELECT id FROM users WHERE username = $1';
        const result = await client.query(query, [recipientUsername]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Receiver not found' });
        }

        const recipientId = result.rows[0].id;

        if (senderId === recipientId) {
            return res.status(400).json({ error: 'You cannot send a message to yourself' });
        }

        const insertQuery = `
            INSERT INTO messages (sender_id, recipient_id, body) 
            VALUES ($1, $2, $3)
            RETURNING id
        `;
        const messageResult = await client.query(insertQuery, [senderId, recipientId, message]);

        res.status(201).json({
            message: 'Message sent successfully',
            messageId: messageResult.rows[0].id,
        });
    } catch (error) {
        if (error.code === '42703') {
            return res.status(400).json({ error: 'The column recipient_id does not exist in the messages table'.concat(error),  });
        }

        console.error('Error sending message:', error);
        res.status(500).json({ CONNECTION_ERROR: 'Internal server error' });
    }
});

export default router;