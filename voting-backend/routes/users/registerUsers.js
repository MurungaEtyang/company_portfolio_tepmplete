import express from "express";
import pool from "../../config/config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post('/kenf/v1/register/users', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'username and password are required' });
    }

    const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const usernameRegex = /^[a-zA-Z0-9_]{6,16}$/;

    if (!usernameRegex.test(username)) {
        return res.status(400).json({ error: 'Username must be between 3 and 16 characters long and can only contain letters, numbers, and underscores' });
    }

    if (!passwordStrengthRegex.test(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character' });
    }

    try {
        const query = `
            SELECT username
            FROM users
            WHERE username = $1
        `;

        const result = await pool.query(query, [username]);

        if (result.rows.length > 0) {
            return res.status(400).json({ error: 'username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const query2 = `
            INSERT INTO users (username, password)
            VALUES ($1, $2)
            RETURNING id, username
        `;

        const result2 = await pool.query(query2, [username, hashedPassword]);

        const token = jwt.sign(
            {
                userId: result2.rows[0].id,
                username: result2.rows[0].username
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || '1h' }
        );

        res.status(201).json({
            message: 'You have been registered successfully',
            token
        });
    } catch (error) {
        console.error('Error registering:', error);
        res.status(500).json({ CONNECTION_ERROR: 'Internal server error' });
    }
});

export default router;