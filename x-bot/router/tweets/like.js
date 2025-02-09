import express from "express";
import { likeTweet } from "../../api-configuration/likePost.js";

const router = express.Router();

router.post('/kenf/v1/x-tweet-like/like', async (req, res) => {
    const { bearer_token, user_id, tweet_id } = req.body;

    if (!bearer_token || !user_id || !tweet_id) {
        return res.status(400).json({ error: 'bearer token, user_id and tweet_id are required' });
    }

    try {
        const response = await likeTweet(bearer_token, user_id, tweet_id);

        if (response === null) {
            console.error('Error liking tweet:', 'No response from Twitter API');
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({
            message: 'Tweet liked successfully',
            data: response
        });
    } catch (error) {
        console.error('Error liking tweet:', error);
        return null;
    }
});

export default router;