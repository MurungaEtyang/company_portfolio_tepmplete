import express from 'express';
import { authenticateJWT } from "../../middleware/authenticateJWT.js";
import pool from "../../config/config.js";
import upload from "../../utils/upload-profile.js";

const router = express.Router();

router.post('/kenf/v1/upload-profile', authenticateJWT, upload.single('logo'), (req, res, next) => {

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded or invalid file type.' });
    }

    const filePath = `/images/logos/${req.file.filename}`;
    const query = 'UPDATE user_profiles_image SET image_url = ? WHERE user_id = ?';

    pool.query(query, [filePath, req.user.id], (err) => {
        if (err) {
            console.error('Error updating user profile image:', err);
            return res.status(500).json({ message: 'Failed to update user profile image' });
        }
        res.status(200).json({
            message: 'User profile image updated successfully.',
            file: req.file.filename,
        });
    });
});

export default router;