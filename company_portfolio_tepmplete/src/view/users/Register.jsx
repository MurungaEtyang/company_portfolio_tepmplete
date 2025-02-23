import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register_users } from "../../services/auth/api_register";
import ConfirmUser from "./ConfirmUser";

const Register = ({ onClose }) => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showConfirmEmail, setShowConfirmEmail] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        try {
            const { message: registerMessage } = await register_users(
                firstName,
                lastName,
                email,
                password
            );
            setMessage(registerMessage);
            setShowConfirmEmail(true);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            {showConfirmEmail ? (
                <ConfirmUser email={email} />
            ) : (
                <div className="bg-black bg-green-300 text-black p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-bold mb-4">Register</h2>
                    {message && <p className="text-red-500 text-sm mb-2">{message}</p>}
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full p-2 mb-3 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full p-2 mb-3 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 mb-3 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 mb-3 border rounded"
                    />
                    <button
                        onClick={handleRegister}
                        className="w-full bg-blue-600 text-white p-2 rounded"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Register"}
                    </button>
                    <p className="text-center mt-4">
                        Already have an account?{" "}
                        <button
                            onClick={() => navigate("/login")}
                            className="text-blue-600 hover:underline"
                        >
                            Proceed to Login
                        </button>
                    </p>
                </div>
            )}
        </div>
    );
};

export default Register;