import express from "express";
import {authenticateJWT} from "../../middleware/authenticateJWT.js";
import pool from "../../config/config.js";

const router = express.Router();

router.post('/kenf/v1/replies', authenticateJWT, async (req, res) => {
    const { messageId, replyBody } = req.body;
    const { id: userId } = req.user;

    if (!messageId || !replyBody) {
        return res.status(400).json({ error: 'The message ID and reply body are all required' });
    }

    try {
        const query = `
            SELECT *
            FROM messages
            WHERE id = $1 AND recipient_id = $2
        `;
        const result = await pool.query(query, [messageId, userId]);

        if (result.rows.length === 0) {
            return res.status(403).json({ error: 'You are not authorized to reply to this message' });
        }

        if (!result.rows[0].is_read) {
            return res.status(400).json({ error: 'You can only reply to messages that have been read' });
        }

        const query2 = `
            INSERT INTO user_replies (message_id, user_id, reply_body)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const result2 = await pool.query(query2, [messageId, userId, replyBody]);

        res.status(201).json({
            message: 'Reply saved successfully',
            reply: result2.rows[0],
        });
    } catch (error) {
        console.error('Error saving reply:', error);
        res.status(500).json({ CONNECTION_ERROR: 'Internal server error' });
    }
})

export default router