
import { apiUrl } from "../votes/api-url";
import {getToken} from "../token";


const responseFromServer = async (username, text, media = null) => {
    try {
        const token = await getToken();
        const requestBody = {
            username,
            text,
            media
        };

        if (media) {
            if (!Array.isArray(media)) {
                requestBody.media = [media];
            } else {
                requestBody.media = media;
            }
        }

        console.log(media);

        const response = await fetch(apiUrl.baseUrl + "/api/kenf/v1/post", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error('Failed to post comment');
        }

        return await response.json();
    } catch (error) {
        console.error('Error posting comment:', error);
        return { error: error.message };
    }
};

export default responseFromServer;