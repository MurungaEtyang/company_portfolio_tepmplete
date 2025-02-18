import express from "express";
import { pool } from "../../config/config.js";
import { authenticateJWT } from "../../middleware/authenticateJwt.js";

const router = express.Router();

router.post('/kenf/v1/allocations', authenticateJWT, async (req, res) => {

    const { project_id, input_id, quantity } = req.body;

    if (!project_id || !input_id || quantity === undefined) {
        return res.status(400).json({ error: 'Project ID, input ID, and quantity are required' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only admin can perform this action' });
    }

    try {
        const [project] = await pool.query('SELECT * FROM agrics_projects WHERE id = ?', [project_id]);

        if (project.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (project[0].status !== 'approved') {
            return res.status(400).json({ error: 'Project must be approved before allocation' });
        }

        const [input] = await pool.query('SELECT * FROM agrics_inputs WHERE id = ?', [input_id]);

        if (input.length === 0) {
            return res.status(404).json({ error: 'Input not found' });
        }

        if (input[0].stock < quantity) {
            return res.status(400).json({ error: 'Not enough stock available' });
        }

        const [existingAllocation] = await pool.query('SELECT * FROM agrics_allocations WHERE project_id = ? AND input_id = ?', [project_id, input_id]);

        if (existingAllocation.length > 0) {
            return res.status(400).json({ error: 'Input has already been allocated for this project' });
        }

        const query = `
            INSERT INTO agrics_allocations (project_id, input_id, quantity)
            VALUES (?, ?, ?)
        `;
        await pool.query(query, [project_id, input_id, quantity]);

        const updateStockQuery = `
            UPDATE agrics_inputs
            SET stock = stock - ?
            WHERE id = ?
        `;
        await pool.query(updateStockQuery, [quantity, input_id]);

        const [user] = await pool.query('SELECT * FROM agrics_users WHERE id = ?', [req.user.id]);

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(201).json({
            message: 'Allocation created and stock updated successfully',
            notification: `Hello ${user[0].full_name}, you have been allocated ${quantity} units of ${input[0].name} for your project.`
        });

    } catch (error) {
        console.error('Error creating allocation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/kenf/v1/user-allocations', authenticateJWT, async (req, res) => {

    try {
        const query = `
            SELECT u.full_name, a.quantity
            FROM agrics_allocations a
            JOIN agrics_projects p ON a.project_id = p.id
            JOIN agrics_users u ON p.user_id = u.id
            WHERE u.id = ?
        `;
        const [allocations] = await pool.query(query, [req.user.id]);

        if (allocations.length === 0) {
            return res.status(404).json({ error: 'No allocations found for this user' });
        }

        res.status(200).json(allocations);
    } catch (error) {
        console.error('Error fetching allocations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/kenf/v1/all-allocations', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only admin can perform this action' });
    }

    try {
        const query = `
            SELECT u.full_name, a.quantity, p.crop_type AS project_name
            FROM agrics_allocations a
            JOIN agrics_projects p ON a.project_id = p.id
            JOIN agrics_users u ON p.user_id = u.id
        `;
        const [allocations] = await pool.query(query);

        res.status(200).json(allocations);
    } catch (error) {
        console.error('Error fetching allocations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;