import { apiUrl } from "./api-url";

const loginUser = async (username, password) => {
    try {
        const response = await fetch(apiUrl.baseUrl + '/api/kenf/v1/login/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        return {
            token: data.token,
            message: data.message,
            error: data.error
        };

    } catch (error) {
        console.error('ERROR Failed to login', error.message);
        throw error;
    }
};

export default loginUser;