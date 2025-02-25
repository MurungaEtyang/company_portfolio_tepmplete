import express from "express";
import pool from "../../../config/config.js";
import {authenticateJWT} from "../../../middleware/authenticateJwt.js";

const router = express.Router();

router.post('/kenf/nimrod/x-bearer-token/add', authenticateJWT, async (req, res) => {
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
        return res.status(400).json({ message: 'username is required' });
    }

    try {
        const selectQuery = `
            SELECT id FROM twitter_username
            WHERE username = $1
        `;

        const selectResult = await pool.query(selectQuery, [username]);

        if (selectResult.rows.length === 0) {
            return res.status(404).json({ error: 'Username not found' });
        }

        const userId = selectResult.rows[0].id;

        const insertQuery = `
            INSERT INTO twitter_bearer_token (bearer_token, api_key, api_key_secret, access_token_secret, access_token, client_id, client_secret, user_id, username)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (user_id) DO UPDATE
            SET bearer_token = $1, api_key = $2, api_key_secret = $3, access_token_secret = $4, access_token = $5, client_id = $6, client_secret = $7, username = $9
            RETURNING id, bearer_token, api_key, api_key_secret, access_token_secret, access_token, client_id, client_secret, user_id, username
        `;

        const insertResult = await pool.query(insertQuery, [
            bearer_token,
            api_key,
            api_key_secret,
            access_token_secret,
            access_token,
            client_id,
            client_secret,
            userId,
            username
        ]);

        res.status(201).json({
            message: 'Data added successfully',
            data: insertResult.rows[0]
        });
    } catch (error) {
        console.error('Error adding data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/kenf/v1/x-bearer-token/get', authenticateJWT,  async (req, res) => {
    try {
        const selectQuery = `
            SELECT 
                tb.id::integer, 
                tb.bearer_token, 
                tb.api_key, 
                tb.api_key_secret, 
                tb.access_token_secret, 
                tb.access_token, 
                tb.client_id, 
                tb.client_secret, 
                tu.username
            FROM twitter_bearer_token tb
            INNER JOIN twitter_username tu ON tb.user_id::integer = tu.id::integer
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