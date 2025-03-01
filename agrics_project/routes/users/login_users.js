import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pool } from "../../config/config.js";

const router = express.Router();

router.post('/kenf/v1/login/users', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const query = 'SELECT * FROM agrics_users WHERE email = ?';
        const [rows] = await pool.query(query, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = rows[0];

        const [ role_name ] = await pool.query('SELECT role_name FROM agrics_roles WHERE id = ?', [user.role_id]);
        user.role = role_name[0].role_name;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Wrong password' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || '1y' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ CONNECTION_ERROR: 'Internal server error' });
    }
});

export default router;
