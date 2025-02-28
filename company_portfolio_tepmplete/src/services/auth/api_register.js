import {apiUrl} from "../api_url";

export const register_users = async (first_name, last_name, email, password) => {
    const response = await fetch(`${apiUrl.baseUrl}/api/kenf/nimrod/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: first_name,
            lastName: last_name,
            email: email,
            password: password
        })
    });
    const data = await response.json();
    if (response.ok) {
        return {
            message: data.message,
        };
    } else {
        throw new Error(data.message);
    }
}