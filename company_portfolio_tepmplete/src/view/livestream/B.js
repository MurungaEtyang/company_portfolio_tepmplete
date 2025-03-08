
import { useState, useRef } from 'react';

export default function LiveStreaming() {
    const [loading, setLoading] = useState(false);
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const videoRef = useRef(null);

    // Simulated join stream handler (for testing)
    const handleJoinStream = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    // Start the live stream: request media devices and show your video
    const handleStartLiveStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsBroadcasting(true);
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen px-4">
            <h1 className="text-4xl font-bold mb-4">Live Streaming</h1>
            <div className="mx-auto mt-8 border border-gray-300 rounded-lg p-8 shadow-lg">
                <h2 className="text-2xl mb-4">
                    Welcome to Kenya Development Live Streaming Platform
                </h2>
                <p className="mb-8">
                    Please join our live stream to learn more about Kenya Development and the impact it has on the community.
                </p>
                <div className="flex flex-col space-y-4">
                    <label className="block">
            <span className="block text-gray-700 text-sm font-bold mb-2">
              Enter streaming id
            </span>
                        <input
                            type="text"
                            className="block w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter stream id"
                        />
                    </label>
                    <button
                        onClick={handleJoinStream}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
                    >
                        {loading ? <span className="loader"></span> : 'Join live stream'}
                    </button>
                    <div className="live-stream-status">
                        <button
                            onClick={handleStartLiveStream}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Start Live Stream
                        </button>
                    </div>
                </div>
                {isBroadcasting && (
                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4">Your Live Stream</h3>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full max-w-md rounded-lg shadow-lg"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
