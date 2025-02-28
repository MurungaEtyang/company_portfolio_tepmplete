import {authenticateJWT} from "../../middleware/authenticateJwt.js";
import express from "express";
import {pool} from "../../config/config.js";

const router = express.Router();

router.post('/kenf/v1/update-user-role', authenticateJWT, async (req, res) => {
    const { userId, role } = req.body;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only admin can perform this action' });
    }

    try {
        const [user] = await pool.query('SELECT * FROM agrics_users WHERE id = ?', [userId]);

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const [availableRoles] = await pool.query('SELECT role_name FROM agrics_roles');
        if (!availableRoles.map(role => role.role_name).includes(role)) {
            return res.status(400).json({ error: `Role '${role}' is not available` });
        }

        const [roleRow] = await pool.query('SELECT id FROM agrics_roles WHERE role_name = ?', [role]);
        if (roleRow.length === 0) {
            return res.status(400).json({ error: `Role '${role}' is not available` });
        }
        const roleId = roleRow[0].id;

        const query = `
            UPDATE agrics_users
            SET role_id = ?
            WHERE id = ?
        `;
        await pool.query(query, [roleId, userId]);

        res.status(200).json({ message: `User role successfully updated to ${role}` });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/kenf/v1/add-role', authenticateJWT, async (req, res) => {
    const { role } = req.body;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only admin can perform this action' });
    }

    if (!role || typeof role !== 'string') {
        return res.status(400).json({ error: 'Invalid role provided' });
    }

    try {
        const [availableRoles] = await pool.query('SELECT role_name FROM agrics_roles');
        if (availableRoles.map(role => role.role_name).includes(role)) {
            return res.status(400).json({ error: `Role '${role}' already exists` });
        }
        const query = `
            INSERT INTO agrics_roles (role_name)
            VALUES (?)
            ON DUPLICATE KEY UPDATE id = id
        `;
        await pool.query(query, [role]);

        res.status(201).json({ message: `Role '${role}' added successfully` });
    } catch (error) {
        console.error('Error adding role:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/kenf/v1/roles',  authenticateJWT, async (req, res) => {
    try {
        const [roles] = await pool.query('SELECT role_name FROM agrics_roles');
        res.status(200).json(roles.map(role => role.role_name));
    } catch (error) {
        console.error('Error getting roles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;