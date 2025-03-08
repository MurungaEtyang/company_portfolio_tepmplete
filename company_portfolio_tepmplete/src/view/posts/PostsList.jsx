import React, { useState, useEffect } from "react";
import {getPosts, replyPost} from "../../services/post/posts";

const PostsList = () => {
    const [posts, setPosts] = useState([]);
    const [replyInputs, setReplyInputs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await getPosts();
                setPosts(data);
            } catch (error) {
                setError("Failed to fetch posts. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();

        const interval = setInterval(async () => {
            try {
                const { data } = await getPosts();
                setPosts(data);
            } catch (error) {
                setError("Failed to fetch posts. Please try again later.");
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleReplyChange = (postId, value) => {
        setReplyInputs({ ...replyInputs, [postId]: value });
    };

    const handleReplySubmit = async (postId) => {
        setLoading(true);
        try {
            const { postReplyMessage } = await replyPost(replyInputs[postId], postId);
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? {
                              ...post,
                              replies: [...post.replies, { postReplyMessage }],
                          }
                        : post
                )
            );
        } catch (error) {
            if (error.response?.status === 401) {
                setError("Please log in to reply to this post.");
            } else {
                setError("Please log in to reply to this post. If you have already logged in OR  please check your internet connection and try again later OR contact support");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 p-6 bg-gray-900 text-white rounded-lg shadow-lg mx-auto w-[90%] lg:w-[80%]">
            <h2 className="text-2xl font-bold mb-4 text-left">Recent Posts</h2>

            {loading ? (
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
            ) : (
                posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.id} className="mb-6 p-4 bg-gray-800 rounded-lg shadow-md text-left">
                            <p className="font-semibold text-lg">{post.postMessage}</p>
                            <p className="text-sm text-gray-400 mt-1">By {post.firstName} {post.lastName}</p>

                            {/* Existing Replies */}
                            {post.replies.length > 0 && (
                                <div className="mt-3 border-t border-gray-700 pt-2">
                                    <h3 className="text-md font-semibold mb-2">Replies:</h3>
                                    {post.replies.map((reply) => (
                                        <div key={reply.id} className="p-2 bg-gray-700 rounded-md mb-2 text-left">
                                            <p className="text-sm">{reply.postReplyMessage}</p>
                                            <p className="text-xs text-gray-400">- {reply.firstName} {reply.lastName}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Reply Input Section */}
                            <div className="mt-3">
                                <textarea
                                    className="w-full p-3 rounded-lg text-black bg-white"
                                    rows="2"
                                    placeholder="Write a reply..."
                                    value={replyInputs[post.id] || ""}
                                    onChange={(e) => handleReplyChange(post.id, e.target.value)}
                                ></textarea>
                                <button
                                    onClick={() => handleReplySubmit(post.id)}
                                    className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg"
                                    disabled={loading}
                                >
                                    {loading ? "Sending..." : "Post Reply"}
                                </button>
                                {error && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {error}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-left mt-4">No posts yet.</p>
                )
            )}
        </div>
    );
};

export default PostsList;