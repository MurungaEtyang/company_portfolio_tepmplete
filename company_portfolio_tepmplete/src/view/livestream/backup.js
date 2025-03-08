import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:5000";

const JoinMeeting = () => {
    const remoteVideoRef = useRef(null);
    const [socket, setSocket] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [meetingId, setMeetingId] = useState("");
    const [joined, setJoined] = useState(false);
    const localStreamRef = useRef(null);

    // Initialize Socket.IO with JWT token from localStorage
    useEffect(() => {
        const token = localStorage.getItem("token");
        const newSocket = io(SERVER_URL, {
            auth: { token },
        });
        setSocket(newSocket);
        return () => newSocket.disconnect();
    }, []);

    // Capture only audio (camera off) for joining user
    const startLocalAudio = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: true,
            });
            localStreamRef.current = stream;
            // (Optional) You could attach this stream to an audio element if you want to monitor audio.
        } catch (error) {
            console.error("Error accessing audio devices:", error);
        }
    };

    // Handle input changes for meeting ID
    const handleMeetingIdChange = (e) => {
        setMeetingId(e.target.value);
    };

    // Join the meeting by emitting the meeting ID to the backend
    const handleJoinMeeting = () => {
        if (socket && meetingId.trim() !== "") {
            socket.emit("join-meeting", { meetingId });
            setJoined(true);
            console.log("Joined meeting with ID:", meetingId);
        }
    };

    // Setup WebRTC peer connection once the user has joined
    useEffect(() => {
        if (!socket || !joined) return;

        const configuration = {
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        };

        const pc = new RTCPeerConnection(configuration);
        setPeerConnection(pc);

        // Add local audio track to the peer connection if available
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                pc.addTrack(track, localStreamRef.current);
            });
        }

        // Handle ICE candidates and send them to the signaling server
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                // In a real-world app, you would need to direct this candidate to the correct peer.
                socket.emit("ice-candidate", { to: null, candidate: event.candidate });
            }
        };

        // When a remote track (host's stream) is received, display it in the video element
        pc.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        // Signaling event: handle incoming offer
        socket.on("offer", async ({ from, offer }) => {
            console.log("Received offer:", offer);
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit("answer", { to: from, answer });
        });

        // Signaling event: handle incoming answer
        socket.on("answer", async ({ from, answer }) => {
            console.log("Received answer:", answer);
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
        });

        // Signaling event: handle incoming ICE candidate
        socket.on("ice-candidate", async ({ from, candidate }) => {
            console.log("Received ICE candidate:", candidate);
            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
                console.error("Error adding received ICE candidate:", error);
            }
        });

        return () => {
            pc.close();
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidate");
        };
    }, [socket, joined]);

    // Start capturing local audio when the component mounts
    useEffect(() => {
        startLocalAudio();
    }, []);

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Join Meeting</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Enter Meeting ID"
                    value={meetingId}
                    onChange={handleMeetingIdChange}
                    className="px-4 py-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <button
                    onClick={handleJoinMeeting}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Join Meeting
                </button>
            </div>
            {joined && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        Host Video (Your camera is off, microphone is on)
                    </h3>
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        className="w-full border rounded"
                    />
                </div>
            )}
        </div>
    );
};

export default JoinMeeting;
