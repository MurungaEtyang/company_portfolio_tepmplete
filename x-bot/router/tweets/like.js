import express from "express";
import { TwitterApi } from "twitter-api-v2";

const router = express.Router();

router.post("/kenf/v1/tweets/like", async (req, res) => {
    try {
        const { accessToken, tweetId, x_user_id } = req.body;

        if (!tweetId) {
            return res.status(400).json({ error: "Tweet ID is required." });
        }

        if (!accessToken) {
            return res.status(401).json({ error: "Unauthorized. Please log in first." });
        }

        const client = new TwitterApi(accessToken);
        const response = await client.v2.like(x_user_id, tweetId);

        res.json({ message: "Tweet liked successfully", response });
    } catch (error) {
        console.error("Error liking tweet:", error);
        res.status(500).json({ error: "Failed to like tweet" });
    }
});

export default router;
