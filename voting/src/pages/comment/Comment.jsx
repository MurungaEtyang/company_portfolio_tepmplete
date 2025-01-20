import React, { useState, useRef } from "react";
import { Container, Row, Col, Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";
import "../../assests/css/Comment.css";
import FadeInSection from "../../components/FadeInSection";
import { FaFileImage, FaCamera } from "react-icons/fa";

const Comment = ({ parentId = null, onSubmit, replyToUsername = null }) => {
    const [commentText, setCommentText] = useState("");
    const [media, setMedia] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Reference to the file input for the camera
    const cameraInputRef = useRef(null);

    const handleTextChange = (e) => setCommentText(e.target.value);

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);
        const newMedia = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setMedia((prevMedia) => [...prevMedia, ...newMedia]);
    };

    const handleDeleteMedia = (index) => {
        setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!commentText.trim()) {
            setError("Comment text is required.");
            return;
        }

        setError("");

        const commentData = {
            commentText,
            media: media.map((m) => m.file),
            parentId,
            replyToUsername,
        };

        console.log("Submitting comment data:", commentData);

        onSubmit(commentData);

        setSuccess(parentId ? "Reply submitted successfully!" : "Comment submitted successfully!");
        setCommentText("");
        setMedia([]);
    };

    const handleCameraClick = () => {
        if (cameraInputRef.current) {
            cameraInputRef.current.click(); // Trigger the file input click to open the camera
        }
    };

    return (
        <Container>
            <Row>
                <Col xs="12">
                    <Form onSubmit={handleSubmit}>
                        {replyToUsername && (
                            <p>
                                Replying to <strong>@{replyToUsername}</strong>
                            </p>
                        )}

                        <FormGroup>
                            <Input
                                type="textarea"
                                name="commentText"
                                value={commentText}
                                onChange={handleTextChange}
                                placeholder={
                                    parentId
                                        ? `Write your reply to @${replyToUsername}...`
                                        : "Type your comment here"
                                }
                            />
                        </FormGroup>

                        <FormGroup style={{ display: "flex", flexDirection: "row-reverse" }}>
                            {/* Image Upload Button */}
                            <div className="file-input">
                                <Label for="media" className="file-input-label">
                                    <FaFileImage size={20} style={{ marginRight: "10px", backgroundColor: "green" }} />
                                </Label>
                                <Input
                                    type="file"
                                    name="media"
                                    id="media"
                                    onChange={handleMediaChange}
                                    accept="image/*, video/*"
                                    multiple
                                    style={{ display: "none" }}
                                />
                            </div>

                            {/* Camera Button */}
                            <div className="file-input">
                                <Label for="camera" className="file-input-label" onClick={handleCameraClick}>
                                    <FaCamera size={20} style={{ marginRight: "10px", backgroundColor: "green" }} />
                                </Label>
                                <input
                                    ref={cameraInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="camera"
                                    style={{ display: "none" }}
                                    onChange={handleMediaChange}
                                />
                            </div>
                        </FormGroup>

                        <div className="media-preview">
                            {media.map((mediaItem, index) => (
                                <div key={index} className="media-item">
                                    {mediaItem.file.type.includes("image") ? (
                                        <img
                                            src={mediaItem.preview}
                                            alt={`Preview ${index}`}
                                            className="img-fluid"
                                        />
                                    ) : mediaItem.file.type.includes("video") ? (
                                        <video controls className="img-fluid">
                                            <source src={mediaItem.preview} />
                                        </video>
                                    ) : null}
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

                        {error && <Alert color="danger">{error}</Alert>}
                        {success && <Alert color="success">{success}</Alert>}
                        <Button type="submit" color="primary">
                            {parentId ? "Submit Reply" : "Submit Comment"}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Comment;
