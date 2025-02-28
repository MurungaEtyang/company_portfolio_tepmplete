import {apiUrl} from "../../../../services/api_url";

export const addTweeterUsers = async (username, bearerToken) => {
    try{
        const response = await fetch(`${apiUrl.baseUrl}/api/kenf/nimrod/x-username/get-user-id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("admin_token")}`
            },
            body: JSON.stringify({ bearerToken: bearerToken, username: username})
        });
        const data = await response.json();
        if (response.ok) {
            return {
                message: data.message,
            };
        } else {
            throw new Error(data.message);
        }
    }catch (e) {
        throw new Error(e);
    }
};