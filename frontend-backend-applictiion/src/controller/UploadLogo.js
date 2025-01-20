import React from 'react';
import apiUrlContrller from "./ApiUrlContrller";

const UploadLogo = () => {
    const handleUploadLogo = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        try {
            const response = await fetch(apiUrlContrller.apiUrl + "/api/kenf/management/kenf-logo/upload", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                // If the response is not OK, throw an error
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json(); // Parse JSON response

            // Log the response data from the server
            console.log('Success:', data);

            // Optionally, you can show a success message or handle the response data further here.
        } catch (error) {
            // Handle any errors that occur during the fetch process
            console.error('Error during file upload:', error);
        }
    };

    return (
        <div className="upload-logo-container">
            <h1>Upload Logo</h1>
            <form onSubmit={handleUploadLogo}>
                <input type="file" name="logo" accept="image/*" required />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}

export default UploadLogo;
