import express from "express";
import pool from "../../config/config.js";
import bcrypt from "bcrypt";
const router = express.Router();

router.post('/kenf/v1/register', async (req, res) => {
    const { first_name, last_name, email, phone_number, address, application_name, notes, password } = req.body;

    if (!first_name || !last_name || !email || !phone_number || !application_name || !password) {
        return res.status(400).json({ ACCESS_DENIED: 'All fields are required' });
    }

    const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordStrengthRegex.test(password)) {
        return res.status(400).json({ ACCESS_DENIED: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character' });
    }

    try {
        const query = `
            SELECT email, phone_number
            FROM client_applications
            WHERE email = $1 OR phone_number = $2
        `;

        const result = await pool.query(query, [email, phone_number]);

        if (result.rows.length > 0) {
            if (result.rows[0].email === email) {
                return res.status(400).json({ ACCESS_DENIED: 'Email already exists' });
            }
            if (result.rows[0].phone_number === phone_number) {
                return res.status(400).json({ ACCESS_DENIED: 'Phone number already exists' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const query2 = `
            INSERT INTO client_applications (first_name, last_name, email, phone_number, address, application_name, notes, password)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, first_name, last_name, email, phone_number, address, application_name, notes, password, date_applied
        `;

        const result2 = await pool.query(query2, [
            first_name, last_name, email, phone_number, address, application_name, notes, hashedPassword
        ]);

        res.status(201).json({
            ACCESS_GRANTED: 'Application registered successfully',
            application: result2.rows[0]
        });
    } catch (error) {
        console.error('Error registering application:', error);
        res.status(500).json({ CONNECTION_ERROR: 'Internal server error' });
    }
});

export default router;