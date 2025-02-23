import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { confirmUser } from "../../services/auth/confirmEmail";
import { Check } from "lucide-react";

const RegenerateCode = () => {
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { message: confirmMessage } = await confirmUser(email, code);
            setMessage(confirmMessage);
            navigate("/login");
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold">Confirm Your Account</h1>
            <p className="text-red-500 text-sm my-2">{message}</p>
            <form onSubmit={handleSubmit} className="mt-6">
                <input
                    type="email"
                    className="w-full p-4 rounded-lg border-white text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter the code sent to your email"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                <div className="flex justify-end mt-3">
                    <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg flex items-center gap-2 shadow-md transition">
                        Confirm <Check size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegenerateCode;