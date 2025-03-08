import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STREAMS_FILE = path.join(__dirname, "streams.json");
const STREAMS_FOLDER = path.join(__dirname, "videos");

// Ensure the videos folder exists
if (!fs.existsSync(STREAMS_FOLDER)) {
    fs.mkdirSync(STREAMS_FOLDER, { recursive: true });
}

/**
 * Reads existing streams from the JSON file.
 * @returns {Object} Stream data
 */
export const readStreams = () => {
    if (!fs.existsSync(STREAMS_FILE)) fs.writeFileSync(STREAMS_FILE, "{}");
    return JSON.parse(fs.readFileSync(STREAMS_FILE, "utf-8"));
};

/**
 * Writes the stream data to the JSON file.
 * @param {Object} data - Stream data to write
 */
export const writeStreams = (data) => {
    fs.writeFileSync(STREAMS_FILE, JSON.stringify(data, null, 2));
};

/**
 * Creates a writable stream for recording the video.
 * @param {string} streamId - Unique identifier for the stream
 * @returns {fs.WriteStream} Writable stream for saving video
 */
export const startVideoRecording = (streamId) => {
    const videoPath = path.join(STREAMS_FOLDER, `${streamId}.webm`);
    return fs.createWriteStream(videoPath, { flags: "a" }); // Append mode
};

/**
 * Handles WebSocket events for managing streams.
 * @param {import("socket.io").Server} io - Socket.io instance
 */
export const handleSocketEvents = (io) => {
    const videoStreams = {}; // Keep track of active stream file writes

    io.on("connection", (socket) => {
        console.log("🔗 A user connected:", socket.id);

        socket.on("joinStream", ({ streamId, userId }) => {
            const streams = readStreams();

            if (!streams[streamId]) {
                socket.emit("error", { error: "Invalid or expired stream ID!" });
                return;
            }

            if (!streams[streamId].users.includes(userId)) {
                streams[streamId].users.push(userId);
                writeStreams(streams);
            }

            socket.join(streamId);
            console.log(`👤 User ${userId} joined stream: ${streamId}`);

            io.to(streamId).emit("updateUserList", streams[streamId].users);

            // Start recording if not already started
            if (!videoStreams[streamId]) {
                videoStreams[streamId] = startVideoRecording(streamId);
            }
        });

        // Handle incoming video data
        socket.on("videoData", ({ streamId, chunk }) => {
            if (!videoStreams[streamId]) return;

            const buffer = Buffer.from(chunk, "base64");
            videoStreams[streamId].write(buffer, (err) => {
                if (err) {
                    console.error(`❌ Error writing video data for ${streamId}:`, err);
                }
            });
        });

        socket.on("leaveStream", ({ streamId, userId }) => {
            const streams = readStreams();

            if (streams[streamId]) {
                streams[streamId].users = streams[streamId].users.filter((u) => u !== userId);
                writeStreams(streams);

                io.to(streamId).emit("updateUserList", streams[streamId].users);
            }

            socket.leave(streamId);
            console.log(`👋 User ${userId} left stream: ${streamId}`);
        });

        socket.on("endStream", (streamId) => {
            if (videoStreams[streamId]) {
                videoStreams[streamId].end(); // Close file stream
                delete videoStreams[streamId];
                console.log(`📹 Stream recording ended: ${streamId}`);
            }
        });

        socket.on("disconnect", () => {
            console.log("🔌 A user disconnected:", socket.id);
        });
    });
};
