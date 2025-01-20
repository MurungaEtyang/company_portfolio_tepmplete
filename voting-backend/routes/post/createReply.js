import {authenticateJWT} from "../../middleware/authenticateJWT.js";
import pool from "../../config/config.js";
import express from "express";

const router = express.Router();

router.post('/kenf/v1/reply', authenticateJWT, async (req, res) => {
    const { comment_id, username, text } = req.body;

    if (!comment_id || !text) {
        return res.status(400).json({ error: 'Comment ID and text are required' });
    }

    try {
        const query = 'INSERT INTO replies (comment_id, username, text) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(query, [comment_id, username, text]);
        res.json({ message: 'Reply created successfully', reply: result.rows[0] });
    } catch (error) {
        console.error('Error creating reply:', error);
        res.status(500).json({ CONNECTION_ERROR: 'Internal server error' });
    }
});

export default router;

