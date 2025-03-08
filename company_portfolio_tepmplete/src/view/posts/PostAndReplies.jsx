import React, { useState } from "react";
import { Send, Loader } from "lucide-react";
import {createPost} from "../../services/post/posts";

const PostAndReplies = () => {
    const [message, setMessage] = useState("");
    const [postMessage, setPostMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const {postMessage: newPostMessage} = await createPost(message);
        
        setPostMessage(newPostMessage);
        setMessage("");
        setLoading(false);
        window.location.reload();

    };

    return (
        <div className="mt-8 p-6 bg-gray-900 text-white rounded-2xl shadow-xl w-full max-w-2xl mx-auto">
            <p className="text-green-500 text-sm mb-2">{postMessage}</p>
            <form onSubmit={handleSubmit} className="mt-6">
                <textarea
                    className="w-full p-4 rounded-lg border-white text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                ></textarea>

                <div className="flex justify-end mt-3">
                    <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg flex items-center gap-2 shadow-md transition"
                    >
                        {loading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
                        Post Message
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostAndReplies;