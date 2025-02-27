import express from "express";
import {getUserId} from "../../../utils/social-media/getTwitterUserId.js";
import pool from "../../../config/config.js";
import {authenticateJWT} from "../../../middleware/authenticateJwt.js";


const router = express.Router();

router.post('/kenf/nimrod/x-username/get-user-id', authenticateJWT, async (req, res) => {
    const { bearerToken, username } = req.body;

    if (!bearerToken || !username) {
        return res.status(400).json({ message: 'Both bearer token and username are required' });
    }

    try {
        const { userId } = await getUserId(bearerToken, username);

        if (!userId) {
            return res.status(404).json({ message: 'User not found on Twitter' });
        }

        const insertQuery = `
            INSERT INTO twitter_username (username, user_id)
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
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/kenf/v1/x-username/get',  authenticateJWT, async (req, res) => {
    try {
        const selectQuery = `
            SELECT id, username, user_id
            FROM twitter_username
        `;

        const selectResult = await pool.query(selectQuery);

        if (selectResult.rows.length === 0) {
            return res.status(404).json({ message: 'No data found' });
        }

        res.status(200).json({
            message: 'Data retrieved successfully',
            data: selectResult.rows
        });
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/kenf/nimrod/x-tokens/add-access-token', async (req, res) => {
    const {
        username,
        access_token,
        refresh_token
    } = req.body;

    if (!username || !access_token || !refresh_token) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const insertQuery = `
            INSERT INTO twitter_tokens (username, access_token, refresh_token)
            VALUES ($1, $2, $3)
            ON CONFLICT (username) DO UPDATE
            SET access_token = $2, refresh_token = $3
            RETURNING id, username, access_token, refresh_token, created_at
        `;

        const insertResult = await pool.query(insertQuery, [username, access_token, refresh_token]);

        res.status(201).json({
            message: 'You have been registered successfully',
            data: insertResult.rows[0]
        });
    } catch (error) {
        console.error('Error registering:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.get('/kenf/v1/x-tokens/get', authenticateJWT, async (req, res) => {
    try {
        const selectQuery = `
            SELECT id, username, access_token, refresh_token, created_at
            FROM twitter_tokens
        `;

        const selectResult = await pool.query(selectQuery);

        if (selectResult.rows.length === 0) {
            return res.status(404).json({message: 'No data found' });
        }

        res.status(200).json({
            message: 'Data retrieved successfully',
            data: selectResult.rows
        });
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ messaage: 'Internal server error' });
    }
});


router.delete('/kenf/v1/x-tokens/delete', authenticateJWT, async (req, res) => {
    try {
        const deleteQuery = `
            DELETE FROM twitter_tokens
        `;

        const deleteResult = await pool.query(deleteQuery);

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ message: 'Data not found' });
        }

        res.status(200).json({
            message: 'All data deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
export default router;
