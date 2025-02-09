import {repostTweet} from "../../api-configuration/repost.js";
import express from "express";

const router = express.Router();

router.post('/kenf/v1/x-tweet-repost/post', async (req, res) => {
    const { bearer_token, user_id, tweet_id } = req.body;

    if (!bearer_token || !user_id || !tweet_id) {
        return res.status(400).json({ error: 'bearer token, user_id and tweet_id are required' });
    }

    try {
        const response = await repostTweet(bearer_token, user_id, tweet_id);

        if (response === null) {
            console.error('Error reposting tweet:', 'No response from Twitter API');
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({
            message: 'Tweet reposted successfully',
            data: response
        });
    } catch (error) {
        console.error('Error reposting tweet:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;