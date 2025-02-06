const axios = require('axios');



async function repostTweet(userId, tweetId) {
    const API_URL = `https://api.twitter.com/2/users/${userId}/retweets`;
    const BEARER_TOKEN = "YOUR_ACCESS_TOKEN";
    try {
        const response = await axios.post(API_URL, {
            tweet_id: tweetId
        }, {
            headers: {
                "Authorization": `Bearer ${BEARER_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        console.log("Tweet reposted successfully:", response.data);
    } catch (error) {
        console.error("Error reposting tweet:", error.response.data);
    }
}

repostTweet("1234556", "1234567890123456789");
