import {getLatestTweetId} from "../api-configuration/tweets.js";
import express from "express";
import pool from "../config/config.js";

const router = express.Router();

router.post('/kenf/v1/x-linked-account/add', async (req, res) => {
    const { bearer_token, username } = req.body;

    const latest_post_id = await getLatestTweetId(bearer_token, username)

    if (!latest_post_id || !username) {
        return res.status(400).json({ error: 'bearer token and username are required' });
    }

    try {
        const insertQuery = `
            INSERT INTO x_linked_account (latest_post_id, username)
            VALUES ($1, $2)
            RETURNING id, latest_post_id, username
        `;

        const insertResult = await pool.query(insertQuery, [latest_post_id, username]);

        res.status(201).json({
            message: 'Data added successfully',
            data: insertResult.rows[0]
        });
    } catch (error) {
        console.error('Error adding data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/kenf/v1/x-linked-account/get', async (req, res) => {
    try {
        const selectQuery = `
            SELECT id, latest_post_id, username
            FROM x_linked_account
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
})

export default router;