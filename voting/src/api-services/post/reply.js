
import { apiUrl } from "../votes/api-url";
import {getToken} from "../token";


const reply = async (parentId, username, text, media = null) => {
    try {
        const token = await getToken();
        const requestBody = {
            comment_id: parentId,
            username: username,
            text: text,
            media: media
        };

        if (media) {
            if (!Array.isArray(media)) {
                requestBody.media = [media];
            } else {
                requestBody.media = media;
            }
        }

        const response = await fetch(apiUrl.baseUrl + "/api/kenf/v1/reply", {
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

export default reply;
