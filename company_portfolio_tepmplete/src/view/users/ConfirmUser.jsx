import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { confirmUser, regenerateCode } from "../../services/auth/confirmEmail";

const ConfirmUser = (email) => {
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [count, setCount] = useState(60);
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        if (count > 0) {
            const timer = setInterval(() => {
                setCount((prevCount) => prevCount - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setIsDisabled(false);
        }
    }, [count]);

    const handleLogin = async () => {
        if (code) {
            setLoading(true);
            try {
                const { message } = await confirmUser(email, code);
                setMessage(message);
                navigate('/login');
            } catch (error) {
                setMessage(error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleRegenerateToken = async () => {
        if (!isDisabled) {
            try {
                setIsDisabled(true);
                setCount(60);
                const { message } = await regenerateCode(email);
                setMessage(message);
            } catch (error) {
                setMessage(error.message);
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-black bg-green-300 text-black p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Confirm Your Account</h2>
                {message && <p className="text-red-500 text-sm mb-2">{message}</p>}
                <input
                    type="text"
                    placeholder="Enter code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2 mb-3 bg-gray border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                />

                <button onClick={handleLogin} className="w-full bg-green-600 text-white p-2 rounded flex justify-center items-center">
                    {loading ? <div className="loader"></div> : "Confirm"}
                </button>

                <p className="text-sm text-gray-500 mt-2">
                    Didn't receive the code?{" "}
                    <span className={`text-green-500 cursor-pointer ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleRegenerateToken}>
                        Resend ({count})
                    </span>
                </p>
            </div>
        </div>
    );
};

export default ConfirmUser;