import React, { useState } from "react";
import { Container, Row, Col, Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";
import { FaFileImage } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import "../../assests/css/Comment.css";
import MediaPreview from "./MediaPreview";
import responseFromServer from "../../api-services/post/post";

const Comment = ({ parentId = null, replyToUsername = null }) => {
    const [commentText, setCommentText] = useState("");
    const [media, setMedia] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTextChange = (e) => setCommentText(e.target.value);

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUserName(value);
    };

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);
        const newMedia = files.map((file) => ({
            url: file,
            type: file.type.includes("image") ? "image" : "video",
            alt: file.type.includes("image") ? "Image" : "Video",
        }));
        setMedia((prevMedia) => [...prevMedia, ...newMedia]);
    };

    const handleDeleteMedia = (index) => {
        setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        const commentData = {
            commentText,
            media,
            parentId,
            replyToUsername,
        };


        try {
            const response = await responseFromServer(userName, commentData.commentText, commentData.media);
            setSuccess(response.message);
            setError(response.error)
            setCommentText("");
            setMedia([]);
        } catch (err) {
            setError("Failed to submit your comment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Row>
                <Col xs="12">
                    <Form onSubmit={handleSubmit}>
                        {replyToUsername && (
                            <p style={{ color: "red", marginBottom: "10px" }}>
                                Replying to <strong>@{replyToUsername}</strong>
                            </p>
                        )}
                        {!parentId && (
                            <FormGroup>
                                <Input
                                    type="text"
                                    value={userName}
                                    onChange={handleUsernameChange}
                                    placeholder="Enter your username"
                                    style={{ marginBottom: "10px" }}
                                />
                            </FormGroup>
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

                        <MediaPreview media={media} handleDeleteMedia={handleDeleteMedia} />

                        {error && <Alert color="danger">{error}</Alert>}
                        {success && <Alert color="success">{success}</Alert>}

                        {loading ? (
                            <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
                                <ClipLoader size={30} color={"#123abc"} />
                            </div>
                        ) : (
                            <Button type="submit" color="primary">
                                {parentId ? "Submit Reply" : "Submit Comment"}
                            </Button>
                        )}
                    </Form>


                </Col>
            </Row>
        </Container>
    );
};

export default Comment;