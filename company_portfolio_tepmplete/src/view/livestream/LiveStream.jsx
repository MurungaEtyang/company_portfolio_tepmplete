import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {useNavigate} from "react-router-dom";

const SERVER_URL = "http://localhost:5000";

const WebRTCMeeting = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [socket, setSocket] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [meetingId, setMeetingId] = useState("");
    const [joined, setJoined] = useState(false);
    const localStreamRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const newSocket = io(SERVER_URL, {
            auth: { token },
        });
        setSocket(newSocket);
        return () => newSocket.disconnect();
    }, []);

    const startLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    };

    const handleStartMeeting = () => {
        if (socket) {
            socket.emit("start-meeting", (response) => {
                if (response && response.meetingId) {
                    setMeetingId(response.meetingId);
                    setJoined(true);
                    socket.emit("join-meeting", { meetingId: response.meetingId });
                    console.log("Meeting started with ID:", response.meetingId);
                }
            });
        }
    };

    const handleJoinMeeting = () => {
        navigate("/meeting")
    }

    useEffect(() => {
        if (!socket || !joined) return;

        const configuration = {
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        };

        const pc = new RTCPeerConnection(configuration);
        setPeerConnection(pc);

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                pc.addTrack(track, localStreamRef.current);
            });
        }

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", { to: null, candidate: event.candidate });
            }
        };

        pc.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        socket.on("offer", async ({ from, offer }) => {
            console.log("Received offer:", offer);
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit("answer", { to: from, answer });
        });

        socket.on("answer", async ({ from, answer }) => {
            console.log("Received answer:", answer);
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on("ice-candidate", async ({ from, candidate }) => {
            console.log("Received ICE candidate:", candidate);
            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
                console.error("Error adding received ice candidate", error);
            }
        });

        return () => {
            pc.close();
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidate");
        };
    }, [socket, joined]);

    useEffect(() => {
        startLocalStream();
    }, []);

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">WebRTC Meeting</h2>
            <div className="mb-4">
                <button onClick={handleStartMeeting} className="px-4 py-2 bg-blue-500 text-white rounded">
                    Start Meeting
                </button>
                <div className="live-stream-status">
                    <button onClick={handleJoinMeeting} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Join Livestream
                    </button>
                </div>
            </div>
            {meetingId && <p className="text-lg mb-4">Meeting ID: {meetingId}</p>}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Local Video</h3>
                    <video ref={localVideoRef} autoPlay muted className="w-full border rounded" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Remote Video</h3>
                    <video ref={remoteVideoRef} autoPlay className="w-full border rounded" />
                </div>
            </div>
        </div>
    );
};

export default WebRTCMeeting;