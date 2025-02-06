import { apiUrl, loginCredentials } from "./api-url";

const email = loginCredentials.email;
const password = loginCredentials.password;

const applicationLogin = async () => {
    try {
        const response = await fetch(apiUrl.baseUrl + '/api/kenf/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            return data.token;
        } else {
            console.log('Login failed:', response.status);
            throw new Error('Failed to login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};



export default applicationLogin;