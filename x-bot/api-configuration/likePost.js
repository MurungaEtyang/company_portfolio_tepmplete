const axios = require('axios');

const BEARER_TOKEN = process.env.X_BEARER_TOKEN;

async function likeTweet(userId, tweetId) {
    try {
        const response = await axios.post(
            `https://api.twitter.com/2/users/${userId}/like`, {
            tweet_id: tweetId
        }, {
            headers: {
                "Authorization": `Bearer ${BEARER_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        console.log("Tweet liked successfully:", response.data);
    } catch (error) {
        console.error("Error liking tweet:", error.response.data);
    }
}

likeTweet('1234567', "1234567890123456789");
