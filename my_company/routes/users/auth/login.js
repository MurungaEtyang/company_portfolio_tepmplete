import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../../../config/config.js";

const router = express.Router();

router.post('/kenf/nimrod/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const result = await pool.query('SELECT * FROM nimrod_users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Wrong password' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                isConfirmed: user.is_confirmed,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ CONNECTION_ERROR: 'Internal server error' });
    }
});

router.post('/kenf/nimrod/logout', (req, res) => {
    res.clearCookie('token').sendStatus(200);
});


export default router;