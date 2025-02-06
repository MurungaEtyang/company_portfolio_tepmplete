import express from "express";
import pool from "../../config/config.js";
import { authenticateJWT } from "../../middleware/authenticateJWT.js";

const router = express.Router();

router.post('/kenf/v1/reply', authenticateJWT, async (req, res) => {
    let { comment_id, username, text, media } = req.body;

    if (!comment_id || !text) {
        return res.status(400).json({ error: 'Comment ID and text are required' });
    }

    username = username || `user_${Math.random().toString(36).substring(2, 10)}`;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const query = 'INSERT INTO replies (comment_id, username, text) VALUES ($1, $2, $3) RETURNING *';
        const result = await client.query(query, [comment_id, username, text]);
        const replyId = result.rows[0].id;

        if (media && media.length > 0) {
            const mediaQuery = `
                INSERT INTO reply_media (reply_id, type, url, alt) 
                VALUES ($1, $2, $3, $4)
            `;
            for (const item of media) {
                const { type, url, alt } = item;
                if (!type || !url || !['image', 'video'].includes(type)) {
                    throw new Error('Invalid media type or missing required fields.');
                }
                await client.query(mediaQuery, [replyId, type, url, alt || null]);
            }
        }
        await client.query('COMMIT');
        res.status(201).json({
            message: 'Reply created successfully',
            reply: result.rows[0],
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating reply and adding media:', error);
        res.status(500).json({ CONNECTION_ERROR: 'Internal server error' });
    } finally {
        client.release();
    }
});

export default router;