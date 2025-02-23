import {authenticateJWT} from "../../../middleware/authenticateJwt.js";
import express from "express";


export const router = express.Router();
router.get('/kenf/nimrod/check-user-role', authenticateJWT, (req, res) => {
    if (req.user.role === 'user') {
        return res.status(403).json({ message: 'You are not authorized' });
    }
    res.status(200).json({ message: 'You are authorized', redirectingUrl: '/' });
});