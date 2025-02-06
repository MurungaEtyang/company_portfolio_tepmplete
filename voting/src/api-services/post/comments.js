import { apiUrl } from "../votes/api-url";
import { getToken } from "../token";

const getComments = async () => {
    try {
        const token = await getToken();
        const response = await fetch(`${apiUrl.baseUrl}/api/kenf/v1/posts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('ERROR Failed to fetch');
        }

        return await response.json();
    } catch (error) {
        if (error instanceof TypeError) {
            console.error('TypeError: Failed to fetch', error);
        } else {
            console.error('Error fetching comments:', error);
        }
        return [];
    }
};

export default getComments;
