import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./users/Login";
import PostsList from "./PostsList";
import PostAndReplies from "./PostAndReplies";
import { FaArrowUp, FaShare } from "react-icons/fa6";
import { Button } from "reactstrap";
import ShareModal from "./components/ShareModal";

const GovernmentBanner = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    const [showPost, setShowPost] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const toggleShareModal = () => {
        setIsShareModalOpen(!isShareModalOpen);
    };

    const handleNavigation = (path) => {
        if (isLoggedIn) {
            navigate(path);
        } else {
            setShowLogin(true);
        }
    };

    const handleCancel = () => {
        setShowPost(false);
        setShowLogin(false);
    };

    const handleWriteMessage = () => {
        if (isLoggedIn) {
            setShowPost(true);
        } else {
            setShowLogin(true);
        }
    };

    return (
        <div className="relative min-h-screen bg-black text-white flex flex-col">
            {/* Main Banner */}
            <div className="mt-8 p-6 text-white rounded-lg shadow-lg mx-auto w-[90%] lg:w-[80%]">
                <h1 className="text-6xl md:text-5xl sm:text-4xl font-bold leading-tight text-left">
                    Driving Kenya’s 🇰🇪: Growth through Innovation & Development.
                </h1>
                <p className="mt-4 text-lg text-left">
                    Highlighting <span className="text-blue-400 font-semibold">completed</span> &
                    <span className="text-green-400 font-semibold"> upcoming</span> government projects shaping the
                    nation’s future.
                </p>

                <p className="mt-4 text-gray-300 text-left">
                    Discover <span className="font-medium text-blue-400">major initiatives</span>,
                    book appointments effortlessly, and engage in <span className="font-medium text-green-400">meaningful discussions</span> by
                    sharing your thoughts.
                </p>


                <div className="mt-6 flex flex-wrap gap-4">
                    <button
                        onClick={() => handleNavigation("/projects")}
                        className="px-6 py-3 rounded-lg shadow-lg w-full sm:w-auto transition bg-green-600 hover:bg-green-500"
                    >
                        View Projects
                    </button>
                    <button
                        onClick={() => handleNavigation("/book-application")}
                        className="px-6 py-3 rounded-lg shadow-lg w-full sm:w-auto transition bg-blue-600 hover:bg-blue-500"
                    >
                        Book an Appointment
                    </button>
                    <button
                        onClick={handleWriteMessage}
                        className="px-6 py-3 rounded-lg shadow-lg w-full sm:w-auto transition bg-gray-600 hover:bg-gray-500"
                    >
                        Write a Message
                    </button>
                </div>
            </div>

            {/* Write Message Modal */}
            {showPost && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[40rem] relative">
                        <button
                            onClick={handleCancel}
                            className="absolute top-4 right-4 text-red-600 hover:text-red-400 text-xl font-bold"
                        >
                            ✖
                        </button>
                        <PostAndReplies />
                    </div>
                </div>
            )}

            {/* Posts List */}
            <div>
                <PostsList />
            </div>

            {/* Login Modal */}
            {showLogin && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                        <Login onClose={handleCancel} />
                        <button
                            onClick={handleCancel}
                            className="mt-4 px-6 py-3 rounded-lg shadow-lg w-full transition bg-red-600 hover:bg-red-500"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}


            <div className="fixed bottom-6 right-6 flex flex-col gap-3">

                <Button className="scroll-to-share" onClick={toggleShareModal}>
                    <FaShare style={{ fontSize: "2rem", marginBottom: ".5rem", color: "green" }} />
                </Button>


                {showScrollTop && (
                    <Button className="scroll-to-top" onClick={scrollToTop}>
                        <FaArrowUp style={{ fontSize: "2rem", marginBottom: ".5rem", color: "green" }} />
                    </Button>
                )}

            </div>


            <ShareModal isOpen={isShareModalOpen} toggle={toggleShareModal} />
        </div>
    );
};

export default GovernmentBanner;