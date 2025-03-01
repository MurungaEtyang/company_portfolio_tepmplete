import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();

import register_users from "./routes/users/register_users.js";
import login_users from "./routes/users/login_users.js";
import {initializeDatabase} from "./config/config.js";
import agrics_project from "./routes/project/agrics_project.js";
import agrics_inputs from "./routes/project/agrics_inputs.js";
import allocation_product from "./routes/project/allocation_product.js";
import users from "./routes/users/users.js";
import upgradeUser from "./routes/users/upgradeUser.js";
import allocationProjectQuantity from "./routes/project/allocationProjectQuantity.js";
import modeOfPayment from "./routes/payment/modeOfPayment.js";
import payment from "./routes/payment/payment.js";
import ngrok from "./routes/payment/ngrok.js";

const app = express();
app.use(helmet());


const allowedOrigins = [
    process.env.HOST,
    process.env.CLIENT_URL,
    'http://127.0.0.1:5500',
    'http://localhost:63342',
    'http://localhost:3000'
];

const corsOptions = {
    origin: (origin, callback) => {
        // if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        // } else {
        //     console.error(`Blocked by CORS: ${origin}`);
        //     callback(new Error('Not allowed by CORS'));
        // }
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', register_users);
app.use('/api', login_users);
app.use('/api', agrics_project);
app.use('/api', agrics_inputs);
app.use('/api', allocation_product);
app.use('/api', users);
app.use('/api', upgradeUser);
app.use('/api', allocationProjectQuantity);
app.use('/api', modeOfPayment);
app.use('/api', payment);
app.use('/api', ngrok);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'http://localhost';

initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on ${HOST}:${PORT}`);
    });
}).catch(err => {
    console.error("Error executing SQL:", err.message);
    process.exit(1);
});