import {replyToTweet} from "../../api-configuration/replyPost.js";
import express from "express";
import pool from "../../config/config.js";

const router = express.Router();

router.post('/kenf/v1/x-reply-tweets/add', async (req, res) => {
    const { bearer_token, tweet_id, reply_text } = req.body;

    if (!bearer_token || !tweet_id || !reply_text) {
        return res.status(400).json({ error: 'bearer token, tweet_id and reply_text are required' });
    }

    try {
        // const selectTriggerQuery = `
        //     SELECT trigger_comment
        //     FROM account_to_interact
        // `;
        //
        // const selectTriggerResult = await pool.query(selectTriggerQuery);
        // const trigger = selectTriggerResult.rows[0].trigger;
        //
        // if (!trigger) {
        //     return res.status(400).json({ error: 'Please allow comment' });
        // }

        const reply = await replyToTweet(bearer_token, tweet_id, reply_text);

        if (!reply) {
            return res.status(400).json({ error: 'Error posting reply' });
        }

        const insertQuery = `
            INSERT INTO x_reply_tweets (bearer_token, tweet_id, reply_text)
            VALUES ($1, $2, $3)
            RETURNING id, bearer_token, tweet_id, reply_text
        `;

        const insertResult = await pool.query(insertQuery, [bearer_token, tweet_id, reply_text]);

        res.status(201).json({
            message: 'Data added successfully',
            data: insertResult.rows[0]
        });
    } catch (error) {
        console.error('Error adding data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;