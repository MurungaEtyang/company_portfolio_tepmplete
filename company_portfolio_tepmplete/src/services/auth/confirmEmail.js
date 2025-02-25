import {apiUrl} from "../api_url";

export const confirmUser = async (email, code) => {
    console.log(email.email)
    const userEmail = email.email
    try {
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
    } catch (error) {
        throw new Error(error.message);
    }
}

export const regenerateCode = async (email) => {

    // alert("this is email", email.email)
    const userEmail = email.email
    try {
        const response = await fetch(`${apiUrl.baseUrl}/api/kenf/nimrod/regenerate/${userEmail}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        if (response.ok) {
            return {
                message: data.message,
            };
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        throw new Error(error.message);
    }
}