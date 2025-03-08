import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import streamRoutes from "./routes/podcast/streams.js";
import {handleSocketEvents} from "./routes/podcast/utils.js";

const app = express();
const server = createServer(app);
const io = new Server(server);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static("public"));
app.use(express.json());

app.use(streamRoutes);

handleSocketEvents(io);

server.listen(3000, () => console.log("🚀 Server running on port 3000"));
