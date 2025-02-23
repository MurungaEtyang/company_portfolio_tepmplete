import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/auth/api_login";

const AdminLogin = ({ onClose = () => {} }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (email && password) {
            setLoading(true);
            try {
                const { message: loginMessage, lastName, user_email, token } = await login(email, password);
                setMessage(loginMessage);
                if (token) {
                    localStorage.setItem("last_name", lastName);
                    localStorage.setItem("admin_email", user_email);
                    localStorage.setItem("admin_token", token);
                    onClose();
                    navigate("/admin");
                    window.location.reload();
                }
            } catch (error) {
                setMessage(error.message);
            } finally {
                setLoading(false);
            }
        }
    };


    const handleCreateAccount = () => {
        onClose();
        navigate("/register");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-black bg-green-300 text-black p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Login</h2>
                {message && <p className="text-red-500 text-sm mb-2">{message}</p>}
                <input
                    type="email"
                    placeholder="type your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-3 bg-gray border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-3 border bg-gray rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                {showForgotPassword && (
                    <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">
                            Forgot your password?
                        </p>
                        <Link to="/forgot-password" className="text-green-600 underline">
                            Reset Password
                        </Link>
                    </div>
                )}
                <button onClick={handleLogin} className="w-full bg-green-600 text-white p-2 rounded flex justify-center items-center">
                    {loading ? <div className="loader"></div> : "Login"}
                </button>
            </div>
        </div>
    );
};

export default AdminLogin;