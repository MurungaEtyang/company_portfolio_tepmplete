import axios from "axios";

export async function getLatestTweetId(bearerToken, username) {
    try {
        const response = await axios.get(`https://api.twitter.com/2/tweets/search/recent?query=from:${username}`, {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        });

        const tweets = response.data.data;
        if (tweets.length > 0) {
            return tweets[0].id;
        } else {
            console.log("No tweets found.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching tweet ID:", error.response.data);
        return null;
    }
}