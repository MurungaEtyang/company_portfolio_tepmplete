import { apiUrl } from "../../services/api_url";

export const createProject = async (title, amount, description, deadline) => {
    const response = await fetch(`${apiUrl.baseUrl}/api/kenf/nimrod/create-project`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`
        },
        body: JSON.stringify({ title, description, budget: amount, deadline })
    });
    const data = await response.json();
    if (response.ok) {
        return {
            postMessage: data.message,
            id: data.data.id
        };
    } else {
        throw new Error(data.message);
    }
};

export const updateProject = async (visibility, id) => {
    const response = await fetch(`${apiUrl.baseUrl}/api/kenf/nimrod/update-visibility/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`
        },
        body: JSON.stringify({ visibility })
    });
    const data = await response.json();
    if (response.ok) {
        return {
            postMessage: data.message,
        };
    } else {
        throw new Error(data.message);
    }
};

export const updateProjectStatus = async (status, id) => {
    const response = await fetch(`${apiUrl.baseUrl}/api/kenf/nimrod/update-project-status/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`
        },
        body: JSON.stringify({ status: status })
    });
    const data = await response.json();
    if (response.ok) {
        return {
            postMessage: data.message,
        };
    } else {
        throw new Error(data.message);
    }
};

export const getAllProjects = async () => {
    try {
        const response = await fetch(`${apiUrl.baseUrl}/api/kenf/nimrod/projects`, {
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