import {apiUrl} from "./api-url";
import getComments from "../post/comments";
import {getToken} from "../token";

export const summaryVotes = async () => {
    try {
        const token = await getToken();

        const response = await fetch(`${apiUrl.baseUrl}/api/kenf/v1/votes/summary`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch summary votes');
        }

        const {yes, no, neutral, total} = await response.json();

        await getComments()
        return [
            {label: 'YES', count: yes},
            {label: 'NO', count: no},
            {label: 'NEUTRAL', count: neutral},
            {label: 'Votes', count: total},
        ];

    } catch (error) {
        console.error('Error fetching summary votes:', error);
        return [{label: 'YES', count: 0}, {label: 'NO', count: 0}, {label: 'NEURAL', count: 0}, {label: 'Votes', count: 0}];
    }
}

