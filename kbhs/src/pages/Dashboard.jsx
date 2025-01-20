import React, { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import ContactUs from "./contact-us/ContactUs";
import AboutUs from "./about-us/AboutUs";
import Initiatives from "./initiatives/Initiatives";
import Technologies from "./technologies/Technologies";
import {FaArrowUp} from "react-icons/fa";

export const Dashboard = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="App" style={{ gap: '5px' }}>
            <section><NavBar onClick={() => {}} /></section><br />
            <br />
            <section id="about"><AboutUs /></section>
            <br />
            <section id="technologies"><Technologies /></section>
            <br />
            <section id="initiatives"><Initiatives /></section>
            <br />
            <section id="contact"><ContactUs /></section>
            <br />

            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    style={scrollButtonStyle}
                    className="scroll-to-top"
                >
                    <FaArrowUp style={{ fontSize: '2rem', marginBottom: '.5rem' }} />
                </button>
            )}
        </div>
    );
};

const scrollButtonStyle = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    padding: '10px',
    fontSize: '24px',
    backgroundColor: 'rgba(0,123,255,0)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'opacity 0.3s',

    '@media (max-width: 768px)': {
        right: '10px',
        bottom: '10px',
    },
};

export default Dashboard;