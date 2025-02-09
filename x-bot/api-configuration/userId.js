import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export async function getUserId(bearerToken, username) {
    // const bearerToken = 'AAAAAAAAAAAAAAAAAAAAAGMHsQEAAAAA9ODDGMvFBIT6BKPExkFg8K1rhLk%3DxT0vtEdYK7zRridgqz2FWvSnBQ6KBuXFXhf4kTc22kuXqMY818';

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

// getUserId('BenjaminCh54588').then(res => {
//     console.log(`User Twitter ID: ${res}`);
// });