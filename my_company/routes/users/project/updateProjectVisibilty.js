import pool from "../../../config/config.js";
import {authenticateJWT} from "../../../middleware/authenticateJwt.js";
import express from 'express';
import TwitterService from "../../../utils/social-media/postTwieet.js";

const router = express.Router();

router.put('/kenf/nimrod/update-visibility/:projectId', authenticateJWT, async (req, res) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const userId = req.user.id;
        const role = req.user.role;
        const { visibility } = req.body;

        if (role!== 'admin' && role!=='mps') {
            return res.status(403).json({ message: 'You are not authorized to update project visibility' });
        }

        if (!visibility) {
            return res.status(400).json({ message: 'Visibility is required' });
        }

        const result = await pool.query(
            'UPDATE projects SET visibility = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [visibility, projectId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (visibility !== 'draft') {
            const { title, description } = result.rows[0];
            const descriptionInText = description.replace(/<[^>]*>/g, '');
            const message = `${title}\n${descriptionInText}\n\nCheck out more projects at ${process.env.CLIENT_APPLICATION_URL}/projects`;

            const accounts = await pool.query('SELECT username FROM twitter_tokens');

            if (accounts.rows.length > 0) {
                for (const account of accounts.rows) {
                    try {
                        const twitter = new TwitterService();
                        await twitter.sendTweetToAll(message);
                        console.log(`✅ Announcement posted on Twitter for @${account.username}`);
                    } catch (error) {
                        console.error(`❌ Failed to post on Twitter for @${account.username}:`, error);
                    }
                }
            } else {
                console.log('⚠️ No Twitter accounts found, skipping announcement.');
            }
        }


        res.status(200).json({
            message: 'Project visibility updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating project visibility:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;