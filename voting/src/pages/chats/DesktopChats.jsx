import React, { useState, useEffect } from "react";
import "../../assests/css/DesktopChats.css";
import NavBar from "../../components/NavBar";
import {FaCheck, FaPaperPlane, FaTrashAlt} from "react-icons/fa";
import ChatsLoader from "../../components/ChatsLoader";

const ChatArea = () => {
    const [activeUser, setActiveUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const users = ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8", "user9"];
    const [messages, setMessages] = useState({
        user1: [
            { id: 1, text: "Hey! How are you?", sender: "user1", seen: false },
            { id: 2, text: "I'm good, how about you?", sender: "user2", seen: true },
            { id: 3, text: "Hey! How are you?", sender: "user1", seen: false },
            { id: 4, text: "I'm good, how about you?", sender: "user2", seen: true },
            { id: 5, text: "Hey! How are you?", sender: "user1", seen: false },
            { id: 6, text: "I'm good, how about you?", sender: "user2", seen: true },
            { id: 7, text: "Hey! How are you?", sender: "user1", seen: false },
            { id: 8, text: "I'm good, how about you?", sender: "user2", seen: true },
            { id: 9, text: "Hey! How are you?", sender: "user1", seen: false },
        ],
        user2: [
            { id: 1, text: "Hi! What's up?", sender: "user2", seen: true },
            { id: 2, text: "Not much, just chilling.", sender: "user1", seen: true }
        ],
        user3: [
            { id: 1, text: "Hello!", sender: "user3", seen: true },
            { id: 2, text: "How are you doing?", sender: "user1", seen: true }
        ],
        user4: [
            { id: 1, text: "Wassup?", sender: "user4", seen: true },
            { id: 2, text: "Hello! How are you?", sender: "user1", seen: true }
        ]
    });
    const [newMessage, setNewMessage] = useState("");
    const [editMessageId, setEditMessageId] = useState(null);
    const [editText, setEditText] = useState("");
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isLoadingMessage, setIsLoadingMessage] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);

    useEffect(() => {
        if (activeUser) {
            setIsLoadingMessages(true);
            setTimeout(() => {
                setIsLoadingMessages(false);
            }, 1000);
        }
    }, [activeUser]);

    useEffect(() => {
        setIsLoadingUsers(true);
        setTimeout(() => {
            setIsLoadingUsers(false);
        }, 1000);
    }, []);

    const sendMessage = () => {
        if (newMessage.trim() !== "") {
            setMessages((prevMessages) => ({
                ...prevMessages,
                [activeUser]: [
                    ...prevMessages[activeUser],
                    { id: Date.now(), text: newMessage, sender: activeUser, seen: false }
                ]
            }));
            setNewMessage("");
        }
    };

    const handleRightClick = (e, messageId) => {
        e.preventDefault();
        const message = messages[activeUser].find(msg => msg.id === messageId);
        if (message.sender === activeUser) {
            setEditMessageId(messageId);
            setEditText(message.text);
            setIsLoadingMessage(true);
            setTimeout(() => {
                setIsLoadingMessage(false);
            }, 1000);
        }
    };

    const handleEditMessage = () => {
        setMessages(prevMessages => ({
            ...prevMessages,
            [activeUser]: prevMessages[activeUser].map(msg =>
                msg.id === editMessageId ? { ...msg, text: editText } : msg
            )
        }));
        setEditMessageId(null);
        setEditText("");
        setIsLoadingMessage(false);
    };

    const handleDeleteMessage = (messageId) => {
        setMessages(prevMessages => ({
            ...prevMessages,
            [activeUser]: prevMessages[activeUser].filter(msg => msg.id !== messageId)
        }));
    };

    const sortedUsers = users
        .map(user => ({
            name: user,
            unseenMessages: messages[user]?.filter(msg => !msg.seen).length || 0,
            totalMessages: messages[user]?.length || 0
        }))
        .filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => b.totalMessages - a.totalMessages);

    return (
        <div className={`chat-main-container`}>
            <NavBar onClick={() => { }} />
            <div className="chat-container">
                <div className="user-list">
                    <h2>Users</h2>
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="search-box"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <ul>
                        {isLoadingUsers ? (
                            <div className="flex justify-center">
                                <ChatsLoader numberOfLoadersToDisplay={5} />
                            </div>
                        ) : sortedUsers.length > 0 ? (
                            sortedUsers.map((user) => (
                                <li
                                    key={user.name}
                                    className={`user-item ${user.unseenMessages > 0 ? "bg-green-300" : "bg-red-300"}`}
                                    onClick={() => setActiveUser(user.name)}
                                >
                                    {user.name} <span>({user.totalMessages} chats)</span>
                                    {user.unseenMessages > 0 && (
                                        <span className="unseen-badge">{user.unseenMessages}</span>
                                    )}
                                </li>
                            ))
                        ) : (
                            <p>No users found</p>
                        )}
                    </ul>
                </div>

                <div className="chat-area">
                    {activeUser ? (
                        <div className="flex flex-col h-full">
                            <h2 className="chat-header">Chat with {activeUser}</h2>
                            <div className="chat-messages">
                                {isLoadingMessages ? (
                                    <div className="flex justify-center">
                                        <ChatsLoader numberOfLoadersToDisplay={4}/>
                                    </div>
                                ) : (
                                    messages[activeUser] ? (
                                        <div className="scroll-to-bottom">
                                            {messages[activeUser].map((msg, index) => (
                                                <div
                                                    key={msg.id}
                                                    className={`message ${index % 2 === 0 ? 'received' : 'sent'}`}
                                                    onContextMenu={(e) => handleRightClick(e, msg.id)}
                                                >
                                                    {editMessageId === msg.id ? (
                                                        <>
                                                            <input
                                                                type="text"
                                                                value={editText}
                                                                onChange={(e) => setEditText(e.target.value)}
                                                            />
                                                            <button onClick={handleEditMessage} className="edit-btn">
                                                                <FaCheck />
                                                            </button>
                                                            <button onClick={() => handleDeleteMessage(msg.id)}
                                                                className="delete-btn">
                                                                <FaTrashAlt />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        msg.text
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No conversation. Start a conversation!</p>
                                    )
                                )}
                            </div>
                            <div className="message-input">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            sendMessage();
                                        }
                                    }}
                                />
                                <button className="send-button" onClick={sendMessage}>
                                    <FaPaperPlane className="send-icon" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <h1>Ready to chat? Click a user to start a conversation!</h1>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatArea;