import React, { useState, useEffect } from 'react';
import '../assets/css/startingPage.css';
import { startingPageData } from '../api-services/starting-page';
import Dashboard from "../pages/Dashboard";

const SphericalGallery = () => {
    const [showDashboard, setShowDashboard] = useState(false);
    const [expandImage, setExpandImage] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        setData(startingPageData);
    }, []);

    const handleClick = () => {
        setExpandImage(true); 
        setTimeout(() => {
            setShowDashboard(true); 
        }, 2000);
    };

    return (
        <>
            {!showDashboard ? (
                <div className="image-container">
                    <img
                        className={`loader-image ${expandImage ? 'expand' : ''}`}
                        src={data.image}
                        alt="team"
                    />
                    <button onClick={handleClick} className="get-started-btn">{data.buttonLabel}</button>
                </div>
            ) : (
                <Dashboard /> 
            )}
        </>
    );
};

export default SphericalGallery;