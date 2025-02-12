import express from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

import registerUsername from "./router/registerUsername.js";
import addSecretsData from "./router/addSecretsData.js";
import addLatestTweetId from "./router/addLatestTweetId.js";
import repost from "./router/tweets/repost.js";
import reply from "./router/tweets/reply.js";
import like from "./router/tweets/like.js";
import callBackLogin from "./router/x-users/callBackLogin.js";
import callBack from "./router/x-users/callBack.js";

const app = express();
app.use(helmet());

app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

const allowedOrigins = [
    process.env.HOST,
    process.env.CLIENT_URL,
    'http://127.0.0.1:5500',
    'http://localhost:63342',
    'http://localhost:3000'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`Blocked by CORS: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', registerUsername);
app.use('/api', addSecretsData);
app.use('/api', addLatestTweetId);
app.use('/api', repost);
app.use('/api', reply);
app.use('/api', callBackLogin);
app.use('/api', callBack);
app.use('/api', like);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'http://localhost';

app.listen(PORT, () => {
    console.log(`Server is running on ${HOST}:${PORT}`);
});
