import express from "express";
import pool from "../../../config/config.js";
import {authenticateJWT} from "../../../middleware/authenticateJwt.js";


const router = express.Router();

router.post('/kenf/nimrod/personal-data', authenticateJWT, async (req, res) => {
    try {
        const {  birth_date, gender, phone_number, address, country, nationality } = req.body;

        const user_id = req.user.id;
        const isConfirmed = req.user.isConfirmed;

        console.log(user_id, isConfirmed);
        if (isConfirmed === false) {
            return res.status(403).json({ message: 'You need to confirm your email first' });
        }
        
        if (!user_id || !birth_date || !gender || !phone_number || !address || !country || !nationality) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const result = await pool.query(
            'SELECT * FROM nimrod_users WHERE id = $1',
            [user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const insertResult = await pool.query(
            'INSERT INTO nimrod_users_personal_data (user_id, birth_date, gender, phone_number, address, country, nationality) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [user_id, birth_date, gender, phone_number, address, country, nationality]
        );

        res.status(201).json({
            message: 'Personal data created successfully',
            data: insertResult.rows[0]
        });
    } catch (error) {
        console.error('Error creating personal data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/kenf/nimrod/personal-data/:email', authenticateJWT, async (req, res) => {
    try {
        const email = req.params.email;

        const result = await pool.query(
            'SELECT first_name, last_name, personal_data.* FROM nimrod_users INNER JOIN nimrod_users_personal_data AS personal_data ON nimrod_users.id = personal_data.user_id WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Personal data fetched successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching personal data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/kenf/nimrod/personal-data', authenticateJWT, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT first_name, last_name, personal_data.* FROM nimrod_users INNER JOIN nimrod_users_personal_data AS personal_data ON nimrod_users.id = personal_data.user_id ORDER BY nimrod_users.id DESC'
        );

        res.status(200).json({
            message: 'Personal data fetched successfully',
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching personal data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;