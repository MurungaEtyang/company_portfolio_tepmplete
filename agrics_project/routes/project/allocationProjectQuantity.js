import {authenticateJWT} from "../../middleware/authenticateJwt.js";
import {pool} from "../../config/config.js";
import express from "express";

const router = express.Router();

router.post('/kenf/v1/quantity-allocations', authenticateJWT, async (req, res) => {
    const { project_id, quantity } = req.body;

    if (req.user.role !== 'admin' && req.user.role !== 'secretary') {
        return res.status(403).json({ error: 'Only admin and secretary can perform this action' });
    }

    if (!project_id || quantity === undefined) {
        return res.status(400).json({ error: 'Project ID and quantity are required' });
    }

    try {
        const [project] = await pool.query('SELECT * FROM agrics_projects WHERE id = ?', [project_id]);

        if (project.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (project[0].status !== 'approved') {
            return res.status(400).json({ error: 'Project must be approved before allocation' });
        }

        const query = `
            INSERT INTO agrics_allocations (project_id, quantity)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + ?
        `;
        await pool.query(query, [project_id, quantity, quantity]);

        res.status(201).json({ message: 'Allocation created successfully' });
    } catch (error) {
        console.error('Error creating allocation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/kenf/v1/quantity-allocations', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'admin' ) {
        return res.status(403).json({ error: 'Only admin and secretary can perform this action' });
    }
    try {
        const query = `
            SELECT u.id, u.full_name, SUM(a.quantity) AS allocated_quantity, SUM(a.price) AS allocated_price
            FROM agrics_allocations a
            JOIN agrics_users u ON a.project_id = u.id
            GROUP BY a.project_id
        `;
        const [allocations] = await pool.query(query);

        console.log([allocations])

        res.status(200).json(allocations);
    } catch (error) {
        console.error('Error fetching allocations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;