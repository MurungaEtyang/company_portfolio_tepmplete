import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import bcrypt from "bcrypt";

dotenv.config();

console.log('Database Name:', process.env.DB_NAME);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultData = {
    firstName: process.env.DEFAULT_FIRST_NAME || 'Murunga',
    lastName: process.env.DEFAULT_LAST_NAME || 'Evans',
    email: process.env.DEFAULT_EMAIL || 'murungaevans845@gmail.com',
    password: process.env.DEFAULT_PASSWORD || 'Evans1324$M',
    ipAddress: process.env.DEFAULT_IP_ADDRESS || '',
    location: process.env.DEFAULT_LOCATION || 'Nairobi',
    isConfirmed: process.env.DEFAULT_IS_CONFIRMED || true,
    role: process.env.DEFAULT_ROLE || 'admin',
};

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'murunga',
    password: process.env.DB_PASSWORD || 'Evans1324$M',
    database: process.env.DB_NAME || 'x-bot-db',
    port: process.env.DB_PORT || 5432,
    maxConnections: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 20000,
    // ssl: {
    //     ca: fs.readFileSync(process.env.CERTIFICATE_PATH || path.join(__dirname, 'ca.pem')).toString(),
    // },
};

const pool = new pg.Pool(dbConfig);

async function setupDatabase() {
    let connection;

    try {
        console.log(`Connecting to database: ${dbConfig.host}/${dbConfig.database}`);
        await pool.connect();
        console.log('Database connected successfully.');

        console.log('Setting up database file...');
        const sqlFilePath = path.join(__dirname, 'company_db.sql');

        if (!fs.existsSync(sqlFilePath)) {
            throw new Error(`SQL file not found: ${sqlFilePath}`);
        }

        const sql = fs.readFileSync(sqlFilePath, 'utf8');
        console.log('Database file is installing...........');

        await pool.query(sql);
        console.log('Database setup install completed successfully.');

        const result = await pool.query('SELECT * FROM nimrod_users WHERE email = $1', [defaultData.email]);

        if (result.rows.length === 0) {
            const hashedPassword = await bcrypt.hash(defaultData.password, 10);
            const insertResult = await pool.query(
                'INSERT INTO nimrod_users (first_name, last_name, email, password, registration_ip, location, is_confirmed, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [
                    defaultData.firstName,
                    defaultData.lastName,
                    defaultData.email,
                    hashedPassword,
                    defaultData.ipAddress,
                    defaultData.location,
                    defaultData.isConfirmed,
                    defaultData.role,
                ]
            );

            console.log('Default data inserted into nimrod_users successfully.');
        }
    } catch (err) {
        console.error('Error setting up the database:', err.message);
        console.error('Error Stack:', err.stack);
    } finally {
        // if (pool) {
        //     await pool.end();
        // }
    }
}

setupDatabase().then(() => console.log('Setup completed.'));

export default pool;