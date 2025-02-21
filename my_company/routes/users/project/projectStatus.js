import {authenticateJWT} from "../../../middleware/authenticateJwt.js";
import pool from "../../../config/config.js";
import express from 'express';

const router = express.Router();

router.post('/kenf/nimrod/create-project-status', authenticateJWT, async (req, res) => {
    try {
        const { projectId, statusId } = req.body;
        const userId = req.user.id;
        const role = req.user.role;

        if (role!== 'admin' && role!=='mps') {
            return res.status(403).json({ message: 'You are not authorized to create project statuses' });
        }

        if (!projectId || !statusId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const result = await pool.query(
            'INSERT INTO project_statuses (project_id, status_id) VALUES ($1, $2) RETURNING *',
            [projectId, statusId]
        );

        res.status(201).json({
            message: 'Project status created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating project status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/kenf/nimrod/create-status', authenticateJWT, async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const result = await pool.query(
            'INSERT INTO statuses (status) VALUES ($1) RETURNING *',
            [status]
        );

        res.status(201).json({
            message: 'Status created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/kenf/nimrod/statuses', authenticateJWT, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM statuses ORDER BY created_at DESC');

        res.status(200).json({
            message: 'Statuses fetched successfully',
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching statuses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



export default router;