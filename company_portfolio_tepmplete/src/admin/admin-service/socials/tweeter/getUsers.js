import {apiUrl} from "../../../../services/api_url";

export const getTwitterUsernames = async () => {
    try {
        const response = await fetch(`${apiUrl.baseUrl}/api/kenf/v1/x-username/get`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("admin_token")}`
            },
        });

        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        throw new Error("You are not logged in");
    }
};