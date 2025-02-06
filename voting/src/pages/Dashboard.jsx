import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import "../assests/css/Dashboard.css";
import { FaArrowUp, FaComments, FaHome, FaSearch, FaShare } from "react-icons/fa";
import Home from "./home/Home";
import { CommentsData } from "./comment/CommentsData";
import AdvertiseShowCase from "./adverise with us/AdvertiseShowCase";
import { Button, Input } from "reactstrap";
import ShareModal from "../components/ShareModal";
import MobileDisplayIcons from "../components/MobileDisplayIcons";


export const Dashboard = () => {
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


    return (
        <div className="App" style={{ gap: "50px" }}>
            <section>
                <NavBar onClick={() => { }} />
            </section>
            <br />
            <br />
            <section>
                <AdvertiseShowCase />
                <Home />
            </section>
            <section id="comments">
                <CommentsData />
            </section>
            <br />
            <br />

            {showScrollTop && (
                <>
                    <Button className="scroll-to-share" onClick={toggleShareModal}>
                        <FaShare style={{ fontSize: "2rem", marginBottom: ".5rem", color: "green" }} />
                    </Button>
                    <Button className="scroll-to-top" onClick={scrollToTop}>
                        <FaArrowUp style={{ fontSize: "2rem", marginBottom: ".5rem", color: "green" }} />
                    </Button>
                </>
            )}

            <ShareModal isOpen={isShareModalOpen} toggle={toggleShareModal} />
            <MobileDisplayIcons />
        </div>
    );
};

export default Dashboard;