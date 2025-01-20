import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import "../assests/css/Dashboard.css";
import { FaArrowUp, FaShare, FaFacebook, FaWhatsapp, FaTelegram, FaEnvelope } from "react-icons/fa";
import Home from "./home/Home";
import { CommentsData } from "./comment/CommentsData";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import {FaXTwitter} from "react-icons/fa6";

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

    const shareUrl = window.location.href;
    const shareText = encodeURIComponent("Check this out!");

    return (
        <div className="App" style={{ gap: "5px" }}>
            <section>
                <NavBar onClick={() => {}} />
            </section>
            <br />
            <br />
            <section>
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

            <Modal isOpen={isShareModalOpen} toggle={toggleShareModal} centered>
                <ModalBody>
                    <h5 className="text-center">Share this page</h5>
                    <div className="d-flex justify-content-around align-items-center mt-3">
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaFacebook size={32} color="#3b5998" />
                        </a>
                        <a
                            href={`https://twitter.com/share?url=${shareUrl}&text=${shareText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaXTwitter size={32} color="#1DA1F2" />
                        </a>
                        <a
                            href={`https://wa.me/?text=${shareText} ${shareUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaWhatsapp size={32} color="#25D366" />
                        </a>
                        <a
                            href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaTelegram size={32} color="#0088cc" />
                        </a>
                        <a
                            href={`https://mail.google.com/mail/u/0/?fs=1&to=&su=Check+this+out!&body=${shareUrl}&bcc=&tf=&trace`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaEnvelope size={32} color="#EA4335" />
                        </a>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleShareModal}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default Dashboard;
