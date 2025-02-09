import axios from "axios";

export async function repostTweet(bearer_token, userId, tweetId) {
    const API_URL = `https://api.twitter.com/2/users/${userId}/retweets`;
    try {
        const response = await axios.post(API_URL, {
            tweet_id: tweetId
        }, {
            headers: {
                "Authorization": `Bearer ${bearer_token}`,
                "Content-Type": "application/json"
            }
        });

        console.log("Tweet reposted successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error reposting tweet:", error.response.data);
        return null;
    }
}