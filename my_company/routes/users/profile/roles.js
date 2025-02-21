import {authenticateJWT} from "../../../middleware/authenticateJwt.js";
import pool from "../../../config/config.js";
import express from 'express';

const router = express.Router();

router.post('/kenf/nimrod/create-role', authenticateJWT, async (req, res) => {
    try {
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({ message: 'Role is required' });
        }

        const result = await pool.query(
            'INSERT INTO nimrod_roles (role) VALUES ($1) RETURNING *',
            [role]
        );

        res.status(201).json({
            message: 'Role created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/kenf/nimrod/roles', authenticateJWT, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM nimrod_roles');

        res.status(200).json({ data: result.rows });
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.put('/kenf/nimrod/update-role/:email', authenticateJWT, async (req, res) => {
    try {
        const { email } = req.params;
        const { role } = req.body;

        if (!email || !role) {
            return res.status(400).json({ message: 'Email and role are required' });
        }

        const userResult = await pool.query(
            'SELECT * FROM nimrod_users WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const result = await pool.query(
            'UPDATE nimrod_users SET role = $1 WHERE email = $2 RETURNING *',
            [role, email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User role updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;