import {apiUrl} from "../api_url";

export const get_projects = async () => {
    const response = await fetch(`${apiUrl.baseUrl}/api/kenf/nimrod/projects`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

    const data = await response.json();
    if (response.ok) {
        return data;
    } else {
        throw new Error(data.message);
    }
};