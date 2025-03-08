import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import register from "./routes/users/auth/register.js";
import login from "./routes/users/auth/login.js";
import confirmUser from "./routes/users/auth/confirm_user.js";
import personalData from "./routes/users/profile/personalData.js";
import roles from "./routes/users/profile/roles.js";
import bookAppointment from "./routes/users/profile/bookAppointment.js";
import users from "./routes/users/auth/users.js";
import createProject from "./routes/users/project/createProject.js";
import projectStatus from "./routes/users/project/projectStatus.js";
import createPost from "./routes/posts/createPost.js";
import registerTwitterUsername from "./routes/socials/twitter/registerTwitterUsername.js";
import twitter from "./routes/socials/twitter/Twitter.js";
import UpdateProjectVisibilty from "./routes/users/project/updateProjectVisibilty.js";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import WebRtc from "./routes/podcast/WebRtc.js";

dotenv.config();
const app = express();
app.use(helmet());
const server = createServer(app); // Create HTTP Server
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins (adjust if needed)
        methods: ["GET", "POST"]
    }
});


const corsOptions = {
    origin: (origin, callback) => {
        callback(null, true); // Allow all origins
    },
    credentials: true
};

app.use(express.static("public"));
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", register);
app.use("/api", login);
app.use("/api", confirmUser);
app.use("/api", personalData);
app.use("/api", roles);
app.use("/api", bookAppointment);
app.use("/api", users);
app.use("/api", createProject);
app.use("/api", projectStatus);
app.use("/api", createPost);
app.use("/api", registerTwitterUsername);
app.use("/api", twitter);
app.use("/api", UpdateProjectVisibilty);

// Pass `server` and `io` to WebRTC
WebRtc(server, io);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "http://localhost";

// FIX: Use `server.listen()`, not `app.listen()`
server.listen(PORT, () => {
    console.log(`🚀 Server running at ${HOST}:${PORT}`);
});
