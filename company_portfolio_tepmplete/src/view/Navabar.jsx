import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setActiveSection, isLoggedIn, handleLogout, username }) => {
    const navigate = useNavigate();

    const handleLogoutClick = async () => {
        await handleLogout();
        navigate("/");
    };

    const handleLoginClick = () => {
       navigate("/login");
    };

    const handleRegisterClick = () => {
        navigate("/register");
    };

    return (
        <div className="flex justify-between p-4 bg-gray-900 text-white">
            <a href="/" className="text-lg font-bold hover:underline">Kenya Development 🇰🇪</a>
            <div>
                {isLoggedIn ? (
                    <div className="flex items-center space-x-4">
                        <span className="text-green-400">Welcome, {username}!</span>
                        <button onClick={handleLogoutClick} className="bg-red-500 px-4 py-2 rounded cursor-pointer hover:bg-red-600">
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex space-x-4">
                        <button onClick={handleLoginClick} className="bg-blue-600 px-4 py-2 rounded cursor-pointer hover:bg-blue-500">
                            Login
                        </button>
                        <button onClick={handleRegisterClick} className="bg-green-600 px-4 py-2 rounded cursor-pointer hover:bg-green-500">
                            Register
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;