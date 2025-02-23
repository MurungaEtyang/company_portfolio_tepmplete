import {apiUrl} from "../api_url";

export const createPost = async (postMessage) => {
    const response = await fetch(`${apiUrl.baseUrl}/api/kenf/nimrod/create-post`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ postMessage: postMessage })
    });
    const data = await response.json();
    if (response.ok) {
        return {
            postMessage: data.message
        };
    } else {
        throw new Error(data.message);
    }
}



export const replyPost = async (postMessage, post_id) => {
    const response = await fetch(`${apiUrl.baseUrl}/api/kenf/nimrod/reply-post/${post_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ postReplyMessage: postMessage })
    });
    const data = await response.json();
    if (response.ok) {
        return {
            postMessage: data.message
        };
    } else {
        throw new Error(data.message);
    }
}


export const getPosts = async () => {
    try {
        const response = await fetch(`${apiUrl.baseUrl}/api/kenf/nimrod/posts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`
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
}




