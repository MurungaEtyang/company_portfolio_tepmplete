import {apiUrl} from "../api_url";

export const login = async (email, password) => {
const response = await fetch(`${apiUrl.baseUrl}/api/kenf/nimrod/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
        return {
            message: data.message,
            lastName: data.lastName,
            user_email: data.email,
            token: data.token,
            role: data.role
        };
    } else {
        throw new Error(data.message);
    }
}