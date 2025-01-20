import express from "express";
import pool from "../../config/config.js";
import {authenticateJWT} from "../../middleware/authenticateJWT.js";

const router = express.Router();

router.post('/kenf/v1/votes', authenticateJWT, async (req, res) => {
    const { option } = req.body;
    if (!['Yes', 'No', 'Neutral'].includes(option)) {
        return res.status(400).json({ error: 'Invalid vote option' });
    }

    try {
        const query = `
            INSERT INTO votes (option) VALUES ($1) RETURNING id;
        `;
        const result = await pool.query(query, [option]);
        res.status(201).json({ message: 'Vote recorded successfully', id: result.rows[0].id });
    } catch (error) {
        console.error('Error recording vote:', error);
        res.status(500).json({ CONNECTION_ERROR: 'Internal server error' });
    }
});

export default router;

