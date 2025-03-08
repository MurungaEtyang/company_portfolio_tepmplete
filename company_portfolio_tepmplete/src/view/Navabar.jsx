import React from "react";
import { useNavigate } from "react-router-dom";
import {FaVideo} from "react-icons/fa";
import { HiMenu } from "react-icons/hi";

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

    const handleLiveStreamingClick = () => {
        navigate("/livestream");
    }

    const [open, setOpen] = React.useState(false);

    return (
        <div className="flex justify-between p-4 bg-gray-900 text-white">
            <a href="/" className="text-lg font-bold hover:underline">Kenya Development 🇰🇪</a>
            <button onClick={handleLiveStreamingClick} className="flex text-2xl items-center space-x-2 bg-red-500 hover:bg-red-400 px-2 py-1 rounded">
                <FaVideo className="text-green-400" />
                <span>Live</span>
            </button>

            <div className="flex items-center space-x-4 md:hidden">
                <HiMenu className="text-3xl cursor-pointer" onClick={() => setOpen(!open)} />
            </div>

            <div className="hidden md:flex">
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

            {open && (
                <div className="md:hidden absolute top-0 right-0 w-full bg-gray-900 p-4">
                    {isLoggedIn ? (
                        <div className="flex flex-col space-y-4">
                            <span className="text-green-400">Welcome, {username}!</span>
                            <button onClick={handleLogoutClick} className="bg-red-500 px-4 py-2 rounded cursor-pointer hover:bg-red-600">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-4">
                            <button onClick={handleLoginClick} className="bg-blue-600 px-4 py-2 rounded cursor-pointer hover:bg-blue-500">
                                Login
                            </button>
                            <button onClick={handleRegisterClick} className="bg-green-600 px-4 py-2 rounded cursor-pointer hover:bg-green-500">
                                Register
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navbar;