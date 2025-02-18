import express from "express";
import pool from "../../config/config.js";


const router = express.Router();

router.get('/kenf/v1/twitter-tokens/create-table', async (req, res) => {
    try {

        const selectQuery = `
            SELECT user_id, username, access_token, refresh_token
            FROM x_username
            LEFT JOIN twitter_tokens ON x_username.username = twitter_tokens.username
            WHERE x_username.username = $1
        `;

        const username = req.query.username;
        const selectResult = await pool.query(selectQuery, [username]);

        if (selectResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { user_id, username, access_token, refresh_token } = selectResult.rows[0];

        res.status(200).json({
            message: 'Table created successfully or already exists',
            userId: user_id,
            username,
            accessToken: access_token,
            refreshToken: refresh_token
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;