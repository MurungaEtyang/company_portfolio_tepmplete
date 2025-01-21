import {apiUrl} from "./api-url";
import login from "./login";

export const summaryVotes = async () => {
    try {
        const token = await login();

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

        return [
            {label: 'R', count: yes},
            {label: 'S', count: no},
            {label: 'N', count: neutral},
            {label: 'Votes', count: total},
        ];
    } catch (error) {
        console.error('Error fetching summary votes:', error);
        return [{label: 'R', count: 0}, {label: 'S', count: 0}, {label: 'N', count: 0}, {label: 'Votes', count: 0}];
    }
}