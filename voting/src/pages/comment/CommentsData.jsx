import React, { useState } from "react";
import { Col } from "reactstrap";
import { commentsResponse } from "../../api-services/commentsData";
import "../../assests/css/CommentsData.css";
import MediaModal from "./MediaModal";
import CommentCard from "./CommentCard";

export const CommentsData = () => {
    const [comments] = useState(commentsResponse);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [mediaList, setMediaList] = useState([]);

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

    return (
        <div>
            <Col className="comments-section">
                {comments
                    .slice(0)
                    .reverse()
                    .map((comment) => (
                        <CommentCard
                            key={comment.id}
                            comment={comment}
                            onMediaClick={handleMediaClick}
                        />
                    ))}
                {selectedMedia && (
                    <MediaModal
                        selectedMedia={selectedMedia}
                        onClose={handleCloseModal}
                        onNext={handleNext}
                        onPrev={handlePrev}
                    />
                )}
            </Col>
        </div>
    );
};
