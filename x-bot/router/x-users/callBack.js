import { TwitterApi } from "twitter-api-v2";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post('/kenf/v1/x-users/callback', async (req, res) => {
    try {
        const { state, code, clientId, clientSecret } = req.body;

        if (!state || !code || !clientId || !clientSecret) {
            return res.status(400).json({ error: "State, code, clientId, and clientSecret are required." });
        }

        // Ensure session state matches
        if (!req.session || req.session.oauthState !== state) {
            return res.status(400).json({ error: "Invalid state" });
        }

        const codeVerifier = req.session.codeVerifier;
        if (!codeVerifier) {
            return res.status(400).json({ error: "Missing code_verifier. Restart login." });
        }

        const client = new TwitterApi({ clientId, clientSecret });

        // Exchange code for access token
        const {
            client: loggedClient,
            accessToken,
            refreshToken,
        } = await client.loginWithOAuth2({
            code,
            codeVerifier,
            redirectUri: process.env.X_SET_CALLBACK_URL,
        });

        req.session.codeVerifier = null;
        req.session.oauthState = null;

        res.json({
            message: "Login successful",
            accessToken,
            refreshToken,
            state,
            clientId
        });
    } catch (error) {
        console.error("OAuth Callback Error:", error);

        res.status(500).json({
            error: "Failed to authenticate with Twitter",
            details: error.data || error.message,
        });
    }
});

export default router;
