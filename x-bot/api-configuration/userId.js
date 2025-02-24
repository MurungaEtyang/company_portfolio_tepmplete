import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export async function getUserId(bearerToken, username) {

    try {
        const response = await axios.get(`https://api.twitter.com/2/users/by/username/${username}`, {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
                'User-Agent': 'v2RecentSearchJS'
            }
        });
        return response.data.data.id;
    } catch (error) {
        console.error(error);
    }
}
