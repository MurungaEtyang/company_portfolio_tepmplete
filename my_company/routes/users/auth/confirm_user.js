import express from "express";
import pool from "../../../config/config.js";
import { ConfirmationCode } from "../../../utils/confirmation_code.js";
import { EmailConfirmation } from "../../../public/emailConfirmation.js";
import {sendEmail} from "../../../utils/sendEmail.js";

const router = express.Router();

router.put('/kenf/nimrod/confirm/:confirmationCode', async (req, res) => {
    const { confirmationCode } = req.params;
    const { email } = req.body;

    try {
        const userResult = await pool.query(
            'SELECT * FROM nimrod_users WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const result = await pool.query(
            `SELECT * FROM nimrod_users 
             WHERE confirmation_code = $1 
             AND confirmation_code_expiry > NOW() 
             AND email = $2`,
            [confirmationCode, email]
        );

        if (result.rows.length === 0 || result.rows[0].is_confirmed) {
            return res.status(400).json({ message: 'Invalid or expired confirmation code' });
        }

        await pool.query(
            `UPDATE nimrod_users 
             SET is_confirmed = TRUE, confirmation_code = NULL, confirmation_code_expiry = NULL 
             WHERE confirmation_code = $1 AND email = $2`,
            [confirmationCode, email]
        );

        res.status(200).json({ message: 'User confirmed successfully' });
    } catch (error) {
        console.error('Error confirming user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/kenf/nimrod/regenerate/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM nimrod_users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result.rows[0];

        if (user.is_confirmed) {
            return res.status(400).json({ message: 'User already confirmed' });
        }

        const confirmationCode = await ConfirmationCode();

        await pool.query(
            `UPDATE nimrod_users 
             SET confirmation_code = $1, 
                 confirmation_code_expiry = NOW() + INTERVAL '1 DAY' 
             WHERE email = $2`,
            [confirmationCode, email]
        );

        const emailService = new EmailConfirmation();
        const { subject, emailContent } = await emailService.confirmationEmail(confirmationCode);

        await sendEmail(email, subject, emailContent);

        res.status(200).json({
            message: 'Confirmation code regenerated successfully. Please check your email.',
        });
    } catch (error) {
        console.error('Error regenerating confirmation code:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
