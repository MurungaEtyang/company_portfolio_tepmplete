const axios = require('axios');

export async function likeTweet(bearerToken, userId, tweetId) {
    try {
        const response = await axios.post(
            `https://api.twitter.com/2/users/${userId}/likes`,
            { tweet_id: tweetId },
            {
                headers: {
                    "Authorization": `Bearer ${bearerToken}`,
                    "Content-Type": "application/json",
                    "User-Agent": "v2RecentSearchJS"
                }
            }
        );

        console.log("Tweet liked successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error liking tweet:", error.response?.data || error.message);
        throw error;
    }
}

// Example usage (Replace with real values)
// likeTweet('YOUR_BEARER_TOKEN', 'YOUR_USER_ID', 'TWEET_ID');
