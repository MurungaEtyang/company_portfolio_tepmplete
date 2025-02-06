import { Button } from "reactstrap";
import { FaComments, FaHome, FaSearch } from "react-icons/fa";
import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../pages/users/Register";
const DesktopDisplayIcons = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn');
        setIsAuthenticated(loggedIn === 'true');
    }, []);

    const handleSearchClick = useCallback(() => {
        if (!isAuthenticated) {
            setModalOpen(true);
            return;
        }
        navigate("/search");
    }, [isAuthenticated, navigate]);

    const handleSearchChats = useCallback(() => {
        if (!isAuthenticated) {
            setModalOpen(true);
            return;
        }
        navigate("/chats");
    }, [isAuthenticated, navigate]);

    const handleHomeClick = useCallback(() => {
        navigate("/");
    }, [isAuthenticated, navigate]);

    return (
        <div className="d-flex justify-content-between align-items-center">
            <div>
                <Button className="d-md-block d-none" onClick={handleHomeClick}>
                    <FaHome /> Home
                </Button>
            </div>

            <div>
                <Button className="d-md-block d-none" onClick={handleSearchClick}>
                    <FaSearch /> Search
                </Button>
            </div>

            <div>
                <Button className="d-md-block d-none" onClick={handleSearchChats}>
                    <FaComments /> Chat
                </Button>
            </div>

            {modalOpen && <AuthForm />}
        </div>
    );
};

export default DesktopDisplayIcons;
