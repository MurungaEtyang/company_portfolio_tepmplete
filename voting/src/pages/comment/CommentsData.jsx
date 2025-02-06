import React, { useState, useEffect } from "react";
import { Col } from "reactstrap";
import "../../assests/css/CommentsData.css";
import MediaModal from "./MediaModal";
import CommentCard from "./CommentCard";
import getComments from "../../api-services/post/comments";
import Loader from "../../components/Loader";
import AdvertiseShowCase from "../adverise with us/AdvertiseShowCase";

export const CommentsData = () => {
    const [comments, setComments] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [mediaList, setMediaList] = useState([]);
    const [showComments, setShowComments] = useState(5);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await getComments();
                if (Array.isArray(data)) {
                    setComments(data);
                } else {
                    console.error("Unexpected response format:", data);
                    setComments([]); 
                }
            } catch (error) {
                console.error("Error fetching comments in CommentsData:", error.message);
                setComments([]);
            }
        };

        const intervalId = setInterval(() => {
            fetchComments();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);


    const handleMediaClick = (media, index, mediaArray) => {
        setSelectedMedia(media);
        setMediaList(mediaArray);
        setCurrentIndex(index);
    };

    const handleCloseModal = () => setSelectedMedia(null);

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % mediaList.length;
        setSelectedMedia(mediaList[nextIndex]);
        setCurrentIndex(nextIndex);
    };

    const handlePrev = () => {
        const prevIndex = (currentIndex - 1 + mediaList.length) % mediaList.length;
        setSelectedMedia(mediaList[prevIndex]);
        setCurrentIndex(prevIndex);
    };

    const handleScroll = () => {
        const bottom =
            Math.ceil(window.innerHeight + window.scrollY) >=
            document.documentElement.scrollHeight;
        if (bottom && !loading) {
            setLoading(true);
            setTimeout(() => {
                setShowComments(showComments + 5);
                setLoading(false);
            }, 2000);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading]);

    if (comments.length === 0) {
        return <div className="no-comments"><Loader numberOfLoadersToDisplay={3}/></div>;
    }

    const reversedComments = [...comments].reverse();

    return (
        <div>
            <Col className="comments-section">
                <AdvertiseShowCase/>
                {reversedComments.slice(0, showComments).map((comment, index) => (
                    <React.Fragment key={comment.commet_id}>
                        <CommentCard
                            comment={comment}
                            onMediaClick={handleMediaClick}
                        />
                        {(index + 1) % 5 === 0 && <AdvertiseShowCase />}
                    </React.Fragment>
                ))}
                {selectedMedia && (
                    <MediaModal
                        selectedMedia={selectedMedia}
                        onClose={handleCloseModal}
                        onNext={handleNext}
                        onPrev={handlePrev}
                    />
                )}
                {loading && <div ><Loader numberOfLoadersToDisplay={3}/></div>}
            </Col>
        </div>
    );
};