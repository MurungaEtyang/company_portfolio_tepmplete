import express from "express";
import { authenticateJWT } from "../../middleware/authenticateJWT.js";
import pool from "../../config/config.js";

const router = express.Router();

router.get('/kenf/v1/outbox-messages', authenticateJWT, async (req, res) => {
    const userId = req.user.id;

    try {
        const client = await pool.connect();
        const query = `
            SELECT m.*, u.username AS recipient_username, array_agg(ur.reply_body) AS replies
            FROM messages m
            JOIN users u ON m.recipient_id = u.id
            LEFT JOIN user_replies ur ON m.id = ur.message_id
            WHERE m.sender_id = $1
            GROUP BY m.id, u.username
        `;
        const result = await client.query(query, [userId]);

        const messages = result.rows;
        res.json(messages);
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ CONNECTION_ERROR: 'Internal server error' });
    }
});

router.put('/kenf/v1/messages/edit/:messageId', authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    const { messageId } = req.params;
    const { text } = req.body;

    if (!messageId || !text) {
        return res.status(400).json({ error: 'Message ID and text are required' });
    }

    try {
        const client = await pool.connect();
        const query = `
            UPDATE messages
            SET body = $1
            WHERE id = $2 AND sender_id = $3
            RETURNING *
        `;
        const result = await client.query(query, [text, messageId, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Message not found or you are not the sender' });
        }

        res.json({ message: 'Message updated successfully', data: result.rows[0] });
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ CONNECTION_ERROR: 'Internal server error' });
    }
});

router.delete('/kenf/v1/messages/delete/:messageId', authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    const { messageId } = req.params;

    if (!messageId) {
        return res.status(400).json({ error: 'Message ID is required' });
    }

    try {
        const client = await pool.connect();
        const query = `
            DELETE FROM messages
            WHERE id = $1 AND sender_id = $2
            RETURNING *
        `;
        const result = await client.query(query, [messageId, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Message not found or you are not the sender' });
        }

        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ CONNECTION_ERROR: 'Internal server error' });
    }
});

export default router;