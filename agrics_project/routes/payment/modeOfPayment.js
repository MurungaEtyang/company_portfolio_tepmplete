import express from "express";
import { pool } from "../../config/config.js";
import { authenticateJWT } from "../../middleware/authenticateJwt.js";

const router = express.Router();

router.post('/kenf/v1/payment-modes', authenticateJWT, async (req, res) => {
    const {  payment_method, details } = req.body;
    const user_id = req.user.id;

    if (!user_id || !payment_method || !details) {
        return res.status(400).json({ error: 'User ID, payment method, and details are required' });
    }

    try {
        const query = `
            INSERT INTO agrics_payment_modes (user_id, payment_method, details)
            VALUES (?, ?, ?)
        `;
        await pool.query(query, [user_id, payment_method, details]);
        res.status(201).json({ message: 'Payment mode added successfully' });
    } catch (error) {
        console.error('Error adding payment mode:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/kenf/v1/user-payment-modes', authenticateJWT, async (req, res) => {
    const user_id = req.user.id;

    try {
        const query = `
            SELECT * 
            FROM agrics_payment_modes
            WHERE user_id = ?
        `;
        const [paymentModes] = await pool.query(query, [user_id]);
        res.status(200).json(paymentModes);
    } catch (error) {
        console.error('Error fetching payment modes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/kenf/v1/specific-payment-modes/:user_id',  async (req, res) => {
    const { user_id } = req.params;

    try {
        const query = `
            SELECT * 
            FROM agrics_payment_modes
            WHERE user_id = ?
        `;
        const [paymentModes] = await pool.query(query, [user_id]);
        res.status(200).json(paymentModes);
    } catch (error) {
        console.error('Error fetching payment modes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;