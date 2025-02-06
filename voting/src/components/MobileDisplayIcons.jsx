import {Button} from "reactstrap";
import {FaComments, FaHome, FaSearch} from "react-icons/fa";
import React from "react";
import { useNavigate } from "react-router-dom";


const MobileDisplayIcons = () => {

    const navigate = useNavigate()
    const handleSearchClick = () => {
        navigate("/search");
    };

    const handleSearchChats = () => {
        navigate("/mobile-chats");
    };

    return (
        <div className="d-flex justify-content-between align-items-center d-block fixed-icons d-md-none">
            <div>
                <Button onClick={handleSearchClick}>
                    <FaHome/>
                </Button>
            </div>

            <div>
                <Button onClick={handleSearchClick}>
                    <FaSearch/>
                </Button>
            </div>
            <div>
                <Button onClick={handleSearchChats}>
                    <FaComments/>
                </Button>
            </div>
        </div>
    )
}

export default MobileDisplayIcons