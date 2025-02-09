import express from "express";
import pool from "../config/config.js";
import { getUserId } from "../api-configuration/userId.js";

const router = express.Router();

router.post('/kenf/v1/x-username/get-user-id', async (req, res) => {
    const { bearerToken, username } = req.body;

    if (!bearerToken || !username) {
        return res.status(400).json({ error: 'Both bearer token and username are required' });
    }

    try {
        const userId = await getUserId(bearerToken, username);

        if (!userId) {
            return res.status(404).json({ error: 'User not found on Twitter' });
        }

        const insertQuery = `
            INSERT INTO x_username (username, user_id)
            VALUES ($1, $2)
            ON CONFLICT (username) DO UPDATE
            SET user_id = $2
            RETURNING id, username, user_id
        `;

        const insertResult = await pool.query(insertQuery, [username, userId]);

        res.status(201).json({
            message: 'You have been registered successfully',
            data: insertResult.rows[0]
        });
    } catch (error) {
        console.error('Error registering:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/kenf/v1/x-username/get', async (req, res) => {
    try {
        const selectQuery = `
            SELECT id, username, user_id
            FROM x_username
        `;

        const selectResult = await pool.query(selectQuery);
        
        if (selectResult.rows.length === 0) {
            return res.status(404).json({ error: 'No data found' });
        }

        res.status(200).json({
            message: 'Data retrieved successfully',
            data: selectResult.rows
        });
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;