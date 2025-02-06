import React, { useState } from "react";
import { Form, FormGroup, Input, Button, Alert } from "reactstrap";
import { ClipLoader } from "react-spinners";
import reply from "../../api-services/post/reply";
const ReplyInput = ({ commentId, parentUsername }) => {
    const [username, setUsername] = useState('');
    const [replyText, setReplyText] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleReplyChange = (e) => {
        setReplyText(e.target.value);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        const replyData = {
            comment_id: commentId,
            username: username,
            text: replyText,
            // media: media
        };

        try {
            const response = await reply(commentId, username, replyText);
            setSuccessMessage(`Reply submitted successfully!`);
            setError(response.error)
            setLoading(false);
        } catch (err) {
            setError("Failed to submit your reply. Please try again.");
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleReplySubmit} style={{ marginTop: "15px" }}>
            <Input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Your username"
            /><br/>
            <FormGroup>
                <Input
                    type="textarea"
                    value={replyText}
                    onChange={handleReplyChange}
                    placeholder={`Write your reply to ${parentUsername}`}
                />
            </FormGroup>
            
            <p style={{ color: error ? "red" : successMessage ? "green" : "" }}>
                {error || successMessage}
            </p>
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
                    <ClipLoader size={30} color={"#123abc"} />
                </div>
            ) : (
                <Button type="submit" color="primary">
                    Submit Reply
                </Button>
            )}
        </Form>
    );
};

export default ReplyInput;