import React, { useState, useEffect } from "react";
import "../assests/css/CookieConsent.css";
import {Link} from "react-router-dom";
import {cookieConsentData} from "../api-services/CookieConsent";


const CookieConsent = () => {
    const [showConsent, setShowConsent] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookieConsent");
        if (!consent) {
            setShowConsent(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookieConsent", "accepted");
        setShowConsent(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookieConsent", "declined");
        setShowConsent(false);
    };

    return (
        <>
            {showConsent && (
                <div className="cookie-consent-banner">
                    <p>
                        {cookieConsentData.message}
                        <Link to={cookieConsentData.link.url}>
                            {cookieConsentData.link.text}
                        </Link>
                    </p>
                    <div className="cookie-buttons">
                        <button className="accept-btn" onClick={handleAccept}>
                            Accept
                        </button>
                        <button className="decline-btn" onClick={handleDecline}>
                            Decline
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CookieConsent;
