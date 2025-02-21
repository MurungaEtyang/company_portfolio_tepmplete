import express from 'express';
import bcrypt from 'bcrypt';
import { ConfirmationCode } from "../../../utils/confirmation_code.js";
import pool from "../../../config/config.js";
import geoip from 'geoip-lite';
import { EmailConfirmation } from "../../../public/emailConfirmation.js";
import {sendEmail} from "../../../utils/sendEmail.js";


const router = express.Router();

router.post('/kenf/nimrod/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const result = await pool.query(
            'SELECT * FROM nimrod_users WHERE email = $1',
            [email]
        );

        if (result.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordStrengthRegex.test(password)) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const confirmationCode = await ConfirmationCode();

        const ipLookup = geoip.lookup(req.ip);
        const location = ipLookup
            ? `${ipLookup.city}, ${ipLookup.region}, ${ipLookup.country}`
            : 'Unknown';

        const user = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            ipAddress: req.ip,
            location,
            confirmationCode
        };

        const insertResult = await pool.query(
            'INSERT INTO nimrod_users (first_name, last_name, email, password, registration_ip, location, confirmation_code) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            [user.firstName, user.lastName, user.email, user.password, user.ipAddress, user.location, user.confirmationCode]
        );

        const emailService = new EmailConfirmation();
        const { subject, emailContent } = await emailService.confirmationEmail(confirmationCode);

        await sendEmail(email, subject, emailContent);

        res.status(201).json({
            message: 'You have been registered successfully. Please check your email for the confirmation code.',
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
