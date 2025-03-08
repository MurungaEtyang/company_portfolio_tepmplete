import { Server } from "socket.io";
import { authenticateWebSocket } from "../../middleware/authenticateJwt.js";
import { v4 as uuidv4 } from "uuid";

export default function setupWebRTC(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    const rooms = {}; // Stores active meetings
    io.use(authenticateWebSocket); // Apply JWT authentication for WebSocket

    io.on("connection", (socket) => {
        console.log(`🔗 New client connected: ${socket.id} (User ID: ${socket.user.id}), (User Full name: ${socket.user.firstName} ${socket.user.lastName})`);

        // Start a new meeting (returns meeting ID)
        socket.on("start-meeting", (callback) => {
            const meetingId = uuidv4(); // Generate unique meeting ID
            rooms[meetingId] = []; // Create a new room
            console.log(`📌 New meeting started: ${meetingId}`);
            callback({ meetingId }); // Send meeting ID to client
        });

        // Join an existing meeting
        socket.on("join-meeting", ({ meetingId }) => {
            try {
                if (!rooms[meetingId]) {
                    socket.emit("error", "Meeting not found.");
                    return;
                }

                if (!rooms[meetingId].includes(socket.user.id)) {
                    rooms[meetingId].push(socket.user.id);
                    socket.join(meetingId);

                    console.log(`✅ User ${socket.user.id} joined meeting: ${meetingId}`);
                    socket.broadcast.to(meetingId).emit("user-connected", socket.user.id);
                }

                socket.on("disconnect", () => {
                    rooms[meetingId] = rooms[meetingId].filter(id => id !== socket.user.id);
                    socket.broadcast.to(meetingId).emit("user-disconnected", socket.user.id);
                });
            } catch (error) {
                console.error("❌ Error in join-meeting:", error);
            }
        });

        // WebRTC signaling
        socket.on("offer", ({ to, offer }) => {
            io.to(to).emit("offer", { from: socket.id, offer });
        });

        socket.on("answer", ({ to, answer }) => {
            io.to(to).emit("answer", { from: socket.id, answer });
        });

        socket.on("ice-candidate", ({ to, candidate }) => {
            io.to(to).emit("ice-candidate", { from: socket.id, candidate });
        });
    });
}
