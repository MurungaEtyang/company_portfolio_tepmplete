import pool from "../../../config/config.js";
import {authenticateJWT} from "../../../middleware/authenticateJwt.js";
import express from 'express';
import TwitterService from "../../../utils/social-media/postTwieet.js";

const router = express.Router();

router.post('/kenf/nimrod/create-project', authenticateJWT, async (req, res) => {
    try {
        const { title, description, budget, deadline } = req.body;
        const userId = req.user.id;
        const role = req.user.role;

        if (role!== 'admin' && role!=='mps') {
            return res.status(403).json({ message: 'You are not authorized to create projects' });
        }

        if (!title || !description || !budget || !deadline) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (description.length > 200) {
            return res.status(400).json({ message: 'Description should be less than 200 words' });
        }

        const result = await pool.query(
            'INSERT INTO projects (user_id, title, description, budget, deadline) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, title, description, budget, deadline]
        );

        res.status(201).json({
            message: 'Project created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.put('/kenf/nimrod/update-project/:projectId', authenticateJWT, async (req, res) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const { title, description, budget, deadline } = req.body;
        const userId = req.user.id;
        const role = req.user.role;

        if (role!== 'admin' && role!=='mps') {
            return res.status(403).json({ message: 'You are not authorized to update projects' });
        }

        if (!title || !description || !budget || !deadline) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const result = await pool.query(
            'UPDATE projects SET title = $1, description = $2, budget = $3, deadline = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
            [title, description, budget, deadline, projectId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({
            message: 'Project updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.put('/kenf/nimrod/update-project-status/:projectId', authenticateJWT, async (req, res) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const { status } = req.body;
        const userId = req.user.id;
        const role = req.user.role;

        if (role !== 'admin' && role !== 'mps') {
            return res.status(403).json({ message: 'You are not authorized to update project status' });
        }

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const result = await pool.query(
            'UPDATE projects SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [status, projectId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({
            message: 'Project status updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating project status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




router.get('/kenf/nimrod/projects', authenticateJWT, async (req, res) => {
    try {

        const result = await pool.query(
            'SELECT * FROM projects WHERE visibility != $1 ORDER BY id DESC',
            ['draft']
        );

        res.status(200).json({
            message: 'Projects fetched successfully',
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/kenf/nimrod/all-projects', authenticateJWT, async (req, res) => {
    try {
        const role = req.user.role;

        if (role!== 'admin' && role!=='mps') {
            return res.status(403).json({ message: 'You are not authorized to delete projects' });
        }

        const result = await pool.query('SELECT * FROM projects ORDER BY id DESC');

        res.status(200).json({
            message: 'All projects fetched successfully',
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching all projects:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.delete('/kenf/nimrod/delete-project/:projectId', authenticateJWT, async (req, res) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const userId = req.user.id;
        const role = req.user.role;

        if (role!== 'admin' && role!=='mps') {
            return res.status(403).json({ message: 'You are not authorized to delete projects' });
        }

        const result = await pool.query(
            'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING *',
            [projectId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({
            message: 'Project deleted successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

export default router;

