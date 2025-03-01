import express from "express";
import { pool } from "../../config/config.js";
import {authenticateJWT} from "../../middleware/authenticateJwt.js";

const router = express.Router();

router.post('/ngrok-url', authenticateJWT,async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const getQuery = `
            SELECT url
            FROM ngrok_urls
            ORDER BY created_at DESC
            LIMIT 1
        `;

        const [existingUrl] = await pool.query(getQuery);

        if (existingUrl && existingUrl.url === url) {
            return res.status(200).json({ message: 'Ngrok URL already exists' });
        }

        const insertOrUpdateQuery = `
            INSERT INTO ngrok_urls (url)
            VALUES (?)
            ON DUPLICATE KEY UPDATE url = VALUES(url), created_at = CURRENT_TIMESTAMP
        `;
        await pool.query(insertOrUpdateQuery, [url]);

        res.status(201).json({ message: 'Ngrok URL inserted/updated successfully' });
    } catch (error) {
        console.error('Error inserting/updating Ngrok URL:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/get-ngrok-url', authenticateJWT, async (req, res) => {
    try {
        const [ngrokUrl] = await pool.query('SELECT url FROM ngrok_urls ORDER BY created_at DESC LIMIT 1');
        res.status(200).json({ url: ngrokUrl[0].url || null });
    } catch (error) {
        console.error('Error getting Ngrok URL:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;