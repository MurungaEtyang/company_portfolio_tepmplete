import {authenticateJWT} from "../../middleware/authenticateJwt.js";
import express from "express";
import {pool} from "../../config/config.js";

const router = express.Router();

router.get('/kenf/v1/all-users', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only admin can perform this action' });
    }

    try {
        const [users] = await pool.query(`
            SELECT u.*,
            (SELECT r.role_name FROM agrics_roles r WHERE r.id = u.role_id) AS role
            FROM agrics_users u
        `);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;