import React, { useEffect, useRef, useState } from "react";
import "../assests/css/FadeInOut.css"

const FadeInSection = ({ children, threshold = 0.5, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            },
            { threshold }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, [threshold]);

    return (
        <div
            ref={sectionRef}
            className={`${className} ${isVisible ? "fade-in text-fade-in" : "fade-out text-fade-out"}`}
        >
            {children}
        </div>
    );
};

export default FadeInSection;