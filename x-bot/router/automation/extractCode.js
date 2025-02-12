import axios from 'axios';

const API_URL = `${process.env.API_URLS}/api/kenf/v1/x-bearer-token/get`;
const callbackUrl = `${process.env.API_URLS}/api/kenf/v1/x-users/login`;

export async function extractCode() {
    try {
        if (!process.env.API_URLS) {
            throw new Error("API_URLS environment variable is not set.");
        }

        const response = await axios.get(API_URL);
        const { data } = response;

        if (!data || !Array.isArray(data.data) || data.data.length === 0) {
            throw new Error("Invalid or empty data received.");
        }

        const result = data.data.map(item => ({
            client_id: item.client_id,
            client_secret: item.client_secret,
            username: item.username,
        }));

        const results_data = [];
        for (const item of result) {
            try {
                const data = await requestTwitterLoginUrl(item.client_id, item.client_secret);
                results_data.push(data);
            } catch (error) {
                console.error("Error in requestTwitterLoginUrl:", error);
            }
        }
        console.log(results_data);
        return results_data;
    } catch (error) {
        console.error('Error getting Twitter login URL:', error);
        throw error;
    }
}

export async function requestTwitterLoginUrl(client_id, client_secret) {
    try {
        const response = await axios.post(callbackUrl, {
            clientId: client_id,
            clientSecret: client_secret,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error requesting Twitter login URL:', error);
        throw error;
    }
}