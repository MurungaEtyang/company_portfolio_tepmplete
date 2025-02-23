import {authenticateJWT} from "../../middleware/authenticateJwt.js";
import router from "../users/auth/login.js";
import pool from "../../config/config.js";

router.post('/kenf/nimrod/create-post', authenticateJWT, async (req, res) => {
    try {
        const { postMessage } = req.body;
        const { firstName, lastName, role, id: userId, email } = req.user;

        if (!postMessage) {
            return res.status(400).json({ message: 'Post message is required' });
        }

        const result = await pool.query(
            'INSERT INTO posts (post_message, first_name, last_name, role, user_id, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [postMessage, firstName, lastName, role, userId, email]
        );

        res.status(201).json({
            message: 'Post created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/kenf/nimrod/reply-post/:postId', authenticateJWT, async (req, res) => {
    try {
        const postId = parseInt(req.params.postId);
        const { postReplyMessage } = req.body;
        const { firstName, lastName, role, id: userId, email } = req.user;

        if (!postReplyMessage) {
            return res.status(400).json({ message: 'Post reply message is required' });
        }

        const result = await pool.query(
            'INSERT INTO post_replies (post_id, post_reply_message, first_name, last_name, role, user_id, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [postId, postReplyMessage, firstName, lastName, role, userId, email]
        );

        res.status(201).json({
            message: 'Post reply created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating post reply:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/kenf/nimrod/posts', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT posts.*, ' +
            'post_replies.id AS post_reply_id, post_replies.post_id, post_replies.post_reply_message, ' +
            'post_replies.first_name AS post_reply_first_name, post_replies.last_name AS post_reply_last_name, ' +
            'post_replies.role AS post_reply_role, post_replies.user_id AS post_reply_user_id, post_replies.email AS post_reply_email ' +
            'FROM posts ' +
            'LEFT JOIN post_replies ON posts.id = post_replies.post_id ' +
            'ORDER BY posts.created_at DESC'
        );

        const posts = result.rows.reduce((posts, row) => {
            const idx = posts.findIndex(post => post.id === row.post_id);

            if (idx === -1) {
                posts.push({
                    id: row.id,
                    postMessage: row.post_message,
                    firstName: row.first_name,
                    lastName: row.last_name,
                    role: row.role,
                    userId: row.user_id,
                    email: row.email,
                    replies: []
                });
            }

            if (row.post_reply_message) {
                posts[posts.length - 1].replies.push({
                    id: row.post_reply_id,
                    postReplyMessage: row.post_reply_message,
                    firstName: row.post_reply_first_name,
                    lastName: row.post_reply_last_name,
                    role: row.post_reply_role,
                    userId: row.post_reply_user_id,
                    email: row.post_reply_email
                });
            }

            return posts;
        }, []);

        res.status(200).json({
            message: 'Posts and replies fetched successfully',
            data: posts
        });
    } catch (error) {
        console.error('Error fetching posts and replies:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;