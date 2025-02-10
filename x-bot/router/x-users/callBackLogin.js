import { TwitterApi } from "twitter-api-v2";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post('/kenf/v1/x-users/login', async (req, res) => {
    try {
        const { clientId, clientSecret } = req.body;
        const callbackUrl = process.env.X_SET_CALLBACK_URL;

        if (!clientId || !clientSecret) {
            return res.status(400).json({ error: "Client ID and Client Secret are required." });
        }

        const client = new TwitterApi({ clientId, clientSecret });

        const { url, codeVerifier, state } = client.generateOAuth2AuthLink(callbackUrl, {
            scope: ["tweet.read", "tweet.write", "users.read", "offline.access", "like.write"],
        });

        req.session.oauthState = state;
        req.session.codeVerifier = codeVerifier;

        res.json({ authUrl: url, state });
    } catch (error) {
        console.error("Twitter Login Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
