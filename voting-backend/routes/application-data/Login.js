import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../config/config.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();


router.post('/kenf/v1/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ ACCESS_DENIED: 'Email and password are required' });
    }

    try {
        const query = 'SELECT * FROM client_applications WHERE email = $1';
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ ACCESS_DENIED: 'Invalid credentials' });
        }

        const user = result.rows[0];

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ ACCESS_DENIED: 'Invalid credentials' });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone_number: user.phone_number,
                address: user.address,
                application_name: user.application_name,
            },
            jwtSecret,
            { expiresIn: process.env.JWT_EXPIRATION || '1h' }
        );
        
        res.status(200).json({
            ACCESS_GRANTED: 'Login successful',
            token,
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ CONNECTION_ERROR: 'Internal server error' });
    }
});

export default router;