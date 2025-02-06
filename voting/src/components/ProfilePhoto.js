import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { Alert } from "reactstrap";

const ProfilePhoto = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentLogo, setCurrentLogo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [fileName, setFileName] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.match('image.*')) {
            setMessage("Please select an image file.");
            setError("");
            return;
        }
        if (file.size > 1024 * 1024 * 5) { // 5MB
            setMessage("File size is too large. Please select a file less than 5MB.");
            setError("");
            return;
        }
        setSelectedFile(file);
        setFileName(file.name);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            setMessage("Please select a file to upload.");
            setError("");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("logo", selectedFile);

        try {
            const response = await fetch('http://localhost:5000/api/kenf/v1/upload-profile', {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload logo.');
            }

            const result = await response.json();
            setMessage(`Logo uploaded successfully!`);
            setError("");
            setLoading(false);

        } catch (error) {
            if (error.message === 'Failed to fetch') {
                setMessage("Network error. Please check your server.");
            } else {
                setMessage(`Error: ${error.message}`);
            }
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            setSelectedFile(null);
            setImagePreview(null);
        };
    }, []);

    useEffect(() => {
        if (error) {
            setMessage(error);
        }
    }, [error]);

    return (
        <div>
            <h2>Upload Logo</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <button type="submit">Upload</button>
                {loading ? <ClipLoader /> : null}
                {message && <Alert message={message} />}
                {error && <Alert message={error} variant="danger" />}
                {imagePreview && (
                    <img src={imagePreview} alt={fileName} width="100" />
                )}
            </form>
        </div>
    );
};

export default ProfilePhoto;