import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import register from "./routes/users/auth/register.js"
import login from "./routes/users/auth/login.js"
import confirmUser from "./routes/users/auth/confirm_user.js"
import personalData from "./routes/users/profile/personalData.js";
import roles from "./routes/users/profile/roles.js";
import bookAppointment from "./routes/users/profile/bookAppointment.js";
import users from "./routes/users/auth/users.js";
import createProject from "./routes/users/project/createProject.js";
import projectStatus from "./routes/users/project/projectStatus.js";


dotenv.config();
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

app.use("/api", register)
app.use("/api", login)
app.use("/api", confirmUser)
app.use("/api", personalData)
app.use("/api", roles)
app.use("/api", bookAppointment)
app.use("/api", users)
app.use("/api", createProject)
app.use("/api", projectStatus)

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'http://localhost';

app.listen(PORT, () => {
    console.log(`Server is running on ${HOST}:${PORT}`);
});