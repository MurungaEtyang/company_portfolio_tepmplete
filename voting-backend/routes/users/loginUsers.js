import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../../config/config.js";

const router = express.Router();

router.post('/kenf/v1/login/users', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'username and password are required' });
    }

    try {
        const client = await pool.connect();
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await client.query(query, [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = result.rows[0];

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful', token });
        } else {
            res.status(401).json({ error: 'Wrong password' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ CONNECTION_ERROR: 'Internal server error' });
    }
});

export default router;