import express from "express";
import { pool } from "../../config/config.js";
import { authenticateJWT } from "../../middleware/authenticateJwt.js";

const router = express.Router();

router.post('/kenf/v1/projects', authenticateJWT, async (req, res) => {
    const { project_name, crop_type, expected_yield, land_size, location, land_size_unit, expected_yield_unit } = req.body;

    if (!project_name || !crop_type || !expected_yield || !land_size || !location) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const landSizeUnit = land_size_unit || 'acres';
    const expectedYieldUnit = expected_yield_unit || 'kgs';

    try {
        const query = `
            INSERT INTO agrics_projects (user_id, project_name, crop_type, expected_yield, expected_yield_unit, land_size, land_size_unit, location)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await pool.query(query, [req.user.id, project_name, crop_type, expected_yield, expectedYieldUnit, land_size, landSizeUnit, location]);
        res.status(201).json({ message: 'Project created successfully' });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/kenf/v1/user-projects', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const [userProjects] = await pool.query('SELECT * FROM agrics_projects WHERE user_id = ?', [userId]);
        res.status(200).json(userProjects);
    } catch (error) {
        console.error('Error fetching user projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/kenf/v1/all-projects', authenticateJWT, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Only admin can perform this action' });
        }

        const [projects] = await pool.query('SELECT * FROM agrics_projects');
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/kenf/v1/projects/approve/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    const allowedTransitions = {
        pending: ['approved', 'rejected'],
        approved: ['pending'],
        rejected: ['pending', 'approved']
    };

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only admin can perform this action' });
    }

    if (!newStatus || typeof newStatus !== 'string') {
        return res.status(400).json({ error: 'Invalid status provided' });
    }

    try {
        const [project] = await pool.query('SELECT status FROM agrics_projects WHERE id = ?', [id]);

        if (project.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const currentStatus = project[0].status;

        if (!allowedTransitions.hasOwnProperty(currentStatus) || !allowedTransitions[currentStatus].includes(newStatus)) {
            return res.status(400).json({
                error: `Invalid status transition from '${currentStatus}' to '${newStatus}'`
            });
        }

        await pool.query('UPDATE agrics_projects SET status = ? WHERE id = ?', [newStatus, id]);

        const [updatedProject] = await pool.query('SELECT * FROM agrics_projects WHERE id = ?', [id]);

        res.status(200).json({
            message: `Project status successfully changed to '${newStatus}'`,
            project: updatedProject[0]
        });

    } catch (error) {
        console.error('Error updating project status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



export default router;