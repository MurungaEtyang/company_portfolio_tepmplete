import express from 'express';
import pool from '../../config/config.js';
import {authenticateJWT} from "../../middleware/authenticateJWT.js";

const router = express.Router();

router.get('/kenf/v1/votes/summary', authenticateJWT, async (req, res) => {
    try {
        const query = `
            SELECT 
                option, 
                COUNT(*) AS total
            FROM votes
            GROUP BY option;
        `;
        const result = await pool.query(query);

        const yes = Number(result.rows.find(row => row.option === 'Yes')?.total || 0);
        const no = Number(result.rows.find(row => row.option === 'No')?.total || 0);
        const neutral = Number(result.rows.find(row => row.option === 'Neutral')?.total || 0);
        const total = yes + no + neutral;

        res.status(200).json({ yes, no, neutral, total });
    } catch (error) {
        console.error('Error fetching vote summary:', error);
        res.status(500).json({ CONNECTION_ERROR: 'Internal server error' });
    }
});

export default router;