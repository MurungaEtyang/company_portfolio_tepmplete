import React from "react";

const MediaPreview = ({ media, handleDeleteMedia }) => {
    return (
        <div className="media-preview">
            {media.map((mediaItem, index) => (
                <div key={index} className="media-item">
                    {mediaItem.type === "image" ? (
                        <img src={mediaItem.url} alt={mediaItem.alt} className="img-fluid" />
                    ) : (
                        <video controls className="img-fluid">
                            <source src={mediaItem.url} />
                        </video>
                    )}
                    <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDeleteMedia(index)}
                    >
                        &#10006;
                    </button>
                </div>
            ))}
        </div>
    );
};

export default MediaPreview;
