import express from "express";
import {authenticateJWT} from "../../../middleware/authenticateJWT.js";
import pool from "../../../config/config.js";


const router = express.Router();

router.post('/kenf/v1/post/media', authenticateJWT, async (req, res) => {
    const { comment_id, type, url, alt } = req.body;

    if (!comment_id || !type || !url) {
        return res.status(400).json({ error: 'comment_id, type, and url are required' });
    }

    if (!['image', 'video'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type. Allowed values are image or video.' });
    }

    try {
        const query = `
            INSERT INTO media (comment_id, type, url, alt) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *;
        `;
        const result = await pool.query(query, [comment_id, type, url, alt || null]);

        res.status(201).json({
            message: 'Media added successfully',
            media: result.rows[0],
        });
    } catch (error) {
        console.error('Error adding media:', error);
        res.status(500).json({ CONNECTION_ERROR: 'Internal server error' });
    }
});

export default router;
