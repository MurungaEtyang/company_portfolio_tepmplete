import {apiUrl} from "../../services/api_url";

export const checkUserRole = async () => {
    const response = await fetch(`${apiUrl.baseUrl}/api/kenf/nimrod/check-user-role`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    const data = await response.json();
    if (response.ok) {
        return {
            message: data.message,
            redirectingUrl: data.redirectingUrl
        };
    } else {
        throw new Error(data.message);
    }
};