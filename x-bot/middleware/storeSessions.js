import session from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Create a Redis client
const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
    },
    password: process.env.REDIS_PASSWORD || '',
});

redisClient.connect().catch(console.error);

// ✅ Correct RedisStore setup
const store = new RedisStore({
    client: redisClient,
    prefix: "session:",  // Optional prefix for session keys
});

const sessionMiddleware = session({
    store: store,
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400000,
    },
});

export default sessionMiddleware;
