const axios = require('axios');

const API_URL = "https://api.twitter.com/2/tweets";
const BEARER_TOKEN = process.env.X_BEARER_TOKEN;

async function replyToTweet(tweetId, replyText) {
    try {
        const response = await axios.post(API_URL, {
            text: replyText,
            reply: { in_reply_to_tweet_id: tweetId }
        }, {
            headers: {
                "Authorization": `Bearer ${BEARER_TOKEN}`,
                "User-Agent": "v2RecentSearchJS",
                "Content-Type": "application/json"
            }
        });

        console.log("Reply posted:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error posting reply:", error.response.data);
    }
}

replyToTweet("1234567890123456789", "This is my reply!");
