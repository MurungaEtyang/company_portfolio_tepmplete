import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {confirmUser} from "../../services/auth/confirmEmail";

const ConfirmUser = ( email ) => {
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (code ) {
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


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-black bg-green-300 text-black p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Confirm Your Account</h2>
                {message && <p className="text-red-500 text-sm mb-2">{message}</p>}
                <input
                    type="code"
                    placeholder="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2 mb-3 bg-gray border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                />

                <button onClick={handleLogin} className="w-full bg-green-600 text-white p-2 rounded flex justify-center items-center">
                    {loading ? <div className="loader"></div> : "Confirm"}
                </button>


            </div>
        </div>
    );
};

export default ConfirmUser;