import pool from "../../../config/config.js";
import express from 'express';
import {authenticateJWT} from "../../../middleware/authenticateJwt.js";

const router = express.Router();

router.get('/kenf/nimrod/users', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'You are not authorized to access this route' });
    }

    try {
        const result = await pool.query('SELECT * FROM nimrod_users ORDER BY id DESC');
        res.status(200).json({
            message: 'Users fetched successfully',
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;