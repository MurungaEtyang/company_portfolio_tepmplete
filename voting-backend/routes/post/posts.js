import { authenticateJWT } from "../../middleware/authenticateJWT.js";
import express from "express";
import pool from "../../config/config.js";

const router = express.Router();

router.get('/kenf/v1/posts', authenticateJWT, async (req, res) => {
    try {
        const query = `
            SELECT
                c.id AS comment_id,
                c.username,
                c.text,
                c.likes,
                c.shares,
                COALESCE(
                        json_agg(
                            DISTINCT jsonb_build_object(
                            'id', m.id,
                            'type', m.type,
                            'url', m.url,
                            'alt', m.alt
                        )
                    ) FILTER (WHERE m.id IS NOT NULL),
                        '[]'
                ) AS media,
                COALESCE(
                        json_agg(
                            DISTINCT jsonb_build_object(
                            'id', r.id,
                            'username', r.username,
                            'text', r.text,
                            'likes', r.likes,
                            'shares', r.shares,
                            'reply_media', (
                                SELECT json_agg(
                                    jsonb_build_object(
                                        'id', rm.id,
                                        'type', rm.type,
                                        'url', rm.url,
                                        'alt', rm.alt
                                    )
                                )
                                FROM reply_media rm
                                WHERE rm.reply_id = r.id
                            )
                        )
                    ) FILTER (WHERE r.id IS NOT NULL),
                        '[]'
                ) AS replies
            FROM comments c
                     LEFT JOIN media m ON c.id = m.comment_id
                     LEFT JOIN replies r ON c.id = r.comment_id
            GROUP BY c.id;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ CONNECTION_ERROR: 'Internal server error' });
    }
});

export default router;
