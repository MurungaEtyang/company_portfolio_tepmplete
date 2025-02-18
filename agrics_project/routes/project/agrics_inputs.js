import express from "express";
import { pool } from "../../config/config.js";
import { authenticateJWT } from "../../middleware/authenticateJwt.js";

const router = express.Router();

router.post('/kenf/v1/inputs', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only admin can perform this action' });
    }

    const { name, category, stock, stock_unit } = req.body;
    const validCategories = ['fertilizer', 'pesticide', 'seed', 'other'];
    const validUnits = ['kg', 'liters', 'bags', 'pieces'];

    if (!name || !category || stock === undefined || !stock_unit) {
        return res.status(400).json({ error: 'Name, category, stock, and stock_unit are required' });
    }

    if (!validCategories.includes(category)) {
        return res.status(400).json({ error: `Category must be one of the following: ${validCategories.join(', ')}` });
    }

    if (!validUnits.includes(stock_unit)) {
        return res.status(400).json({ error: `Stock unit must be one of the following: ${validUnits.join(', ')}` });
    }

    try {
        const query = `
            INSERT INTO agrics_inputs (name, category, stock, stock_unit)
            VALUES (?, ?, ?, ?)
        `;
        await pool.query(query, [name, category, stock, stock_unit]);
        res.status(201).json({ message: 'Input created successfully' });
    } catch (error) {
        console.error('Error creating input:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/kenf/v1/all-inputs', authenticateJWT, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Only admin can perform this action' });
        }

        const [inputs] = await pool.query('SELECT * FROM agrics_inputs');
        res.status(200).json(inputs);
    } catch (error) {
        console.error('Error fetching inputs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/kenf/v1/inputs/:id', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only admin can perform this action' });
    }

    const { id } = req.params;
    const { name, category, stock, stock_unit } = req.body;
    const validCategories = ['fertilizer', 'pesticide', 'seed', 'other'];
    const validUnits = ['kg', 'liters', 'bags', 'pieces'];

    if (!name || !category || stock === undefined || !stock_unit) {
        return res.status(400).json({ error: 'Name, category, stock, and stock_unit are required' });
    }

    if (!validCategories.includes(category)) {
        return res.status(400).json({ error: `Category must be one of the following: ${validCategories.join(', ')}` });
    }

    if (!validUnits.includes(stock_unit)) {
        return res.status(400).json({ error: `Stock unit must be one of the following: ${validUnits.join(', ')}` });
    }

    try {
        const [existingInput] = await pool.query('SELECT * FROM agrics_inputs WHERE id = ?', [id]);

        if (existingInput.length === 0) {
            return res.status(404).json({ error: 'Input not found' });
        }

        const query = `
            UPDATE agrics_inputs
            SET name = ?, category = ?, stock = ?, stock_unit = ?
            WHERE id = ?
        `;
        await pool.query(query, [name, category, stock, stock_unit, id]);
        res.status(200).json({ message: 'Input updated successfully' });
    } catch (error) {
        console.error('Error updating input:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
