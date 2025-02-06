import express from "express";
import { authenticateJWT } from "../../middleware/authenticateJWT.js";
import pool from "../../config/config.js";

const router = express.Router();

router.get('/kenf/v1/inbox-messages', authenticateJWT, async (req, res) => {
    const userId = req.user.id;

    try {
        const client = await pool.connect();
        const query = `
            SELECT m.*, u.username AS sender_username
            FROM messages m
                     JOIN users u ON m.sender_id = u.id
            WHERE m.recipient_id = $1
        `;
        const result = await client.query(query, [userId]);

        const messages = result.rows;
        res.json(messages);
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ CONNECTION_ERROR: 'Internal server error' });
    }
});

router.put('/kenf/v1/messages/view/:messageId', authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    const { messageId } = req.params;

    if (!messageId) {
        return res.status(400).json({ error: 'Message ID is required' });
    }

    try {
        const client = await pool.connect();
        const query = `
            UPDATE messages
            SET is_read = CASE WHEN is_read = false THEN true ELSE is_read END
            WHERE id = $1 AND recipient_id = $2
            RETURNING *
        `;
        const result = await client.query(query, [messageId, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Message not found or you are not the recipient' });
        }

        res.json({ message: 'seen', data: result.rows[0] });
    } catch (error) {
        console.error('Error updating message status:', error);
        res.status(500).json({ CONNECTION_ERROR: 'Internal server error' });
    }
});

export default router;