import pool from "../config/config.js";
import express from "express";

const router = express.Router();

router.post('/kenf/v1/x-bearer-token/add', async (req, res) => {
    const {
        bearer_token,
        api_key,
        api_key_secret,
        access_token_secret,
        access_token,
        client_id,
        client_secret,
        username
    } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'username is required' });
    }

    try {
        const insertQuery = `
            INSERT INTO x_bearer_token (bearer_token, api_key, api_key_secret, access_token_secret, access_token, client_id, client_secret, username)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, bearer_token, api_key, api_key_secret, access_token_secret, access_token, client_id, client_secret, username
        `;

        const insertResult = await pool.query(insertQuery, [
            bearer_token,
            api_key,
            api_key_secret,
            access_token_secret,
            access_token,
            client_id,
            client_secret,
            username
        ]);

        res.status(201).json({
            message: 'Data added successfully',
            data: insertResult.rows[0]
        });
    } catch (error) {
        console.error('Error adding data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/kenf/v1/x-bearer-token/get', async (req, res) => {
    try {
        const selectQuery = `
            SELECT id, bearer_token, api_key, api_key_secret, access_token_secret, access_token, client_id, client_secret, username
            FROM x_bearer_token
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