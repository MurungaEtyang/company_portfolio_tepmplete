import {apiUrl} from "../api_url";

export const confirmUser = async (email, code) => {
    console.log(email.email)
    const userEmail = email.email
    const response = await fetch(`${apiUrl.baseUrl}/api/kenf/nimrod/confirm/${code}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userEmail }),
      
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