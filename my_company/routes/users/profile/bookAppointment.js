import {authenticateJWT} from "../../../middleware/authenticateJwt.js";
import express from 'express';
import pool from "../../../config/config.js";

const router = express.Router();


router.post('/kenf/nimrod/book-appointment', authenticateJWT, async (req, res) => {
    try {
        const { appointmentDate, mpsName, purpose } = req.body;
        const userId = req.user.id;

        if (!appointmentDate || !mpsName || !purpose) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const result = await pool.query(
            'INSERT INTO book_appointments (user_id, appointment_date, mps_name, purpose) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, appointmentDate, mpsName, purpose]
        );

        res.status(201).json({
            message: 'Appointment booked successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/kenf/nimrod/user-appointments', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            'SELECT * FROM book_appointments WHERE user_id = $1 ORDER BY appointment_date DESC',
            [userId]
        );

        res.status(200).json({
            message: 'Appointments fetched successfully',
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.delete('/kenf/nimrod/cancel-appointment/:appointmentId', authenticateJWT, async (req, res) => {
    try {
        const appointmentId = parseInt(req.params.appointmentId);
        const userId = req.user.id;

        const result = await pool.query(
            'DELETE FROM book_appointments WHERE id = $1 AND user_id = $2 RETURNING *',
            [appointmentId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({
            message: 'Appointment cancelled successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})


router.get('/kenf/nimrod/all-appointments', authenticateJWT, async (req, res) => {
    try {

        const role = req.user.role;

        if (role === 'admin' || role === 'mps') {
            return res.status(400).json({ message: 'You are not authorized to access all appointments' });
        }

        const result = await pool.query(
            'SELECT * FROM book_appointments ORDER BY appointment_date DESC'
        );

        res.status(200).json({
            message: 'All appointments fetched successfully',
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching all appointments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/kenf/nimrod/update-appointment/:appointmentId', authenticateJWT, async (req, res) => {
    try {
        const appointmentId = parseInt(req.params.appointmentId);
        const userId = req.user.id;
        const role = req.user.role;
        const { status } = req.body;

        if (role!== 'admin' && role!=='mps') {
            return res.status(400).json({ message: 'You are not authorized to update appointment status' });
        }

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const result = await pool.query(
            'UPDATE book_appointments SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [status, appointmentId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Appointment not found' });
        }

        res.status(200).json({
            message: 'Appointment status updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating appointment status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

export default router;