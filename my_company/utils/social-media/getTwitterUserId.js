import dotenv from "dotenv";
import axios from "axios";
import pool from "../../config/config.js";

dotenv.config();

export async function getUserId(bearerToken, username) {

    try {
        const response = await axios.get(`https://api.twitter.com/2/users/by/username/${username}`, {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
                'User-Agent': 'v2RecentSearchJS'
            }
        });
        return {
            userId: response.data.data.id
        };
    } catch (error) {
        console.error(error);
    }
}

export async function getUsername() {
    try {
        const result = await pool.query('SELECT username FROM twitter_username LIMIT 1');
        return {
            username: result.rows[0].username
        };
    } catch (error) {
        console.error(error);
    }
}
