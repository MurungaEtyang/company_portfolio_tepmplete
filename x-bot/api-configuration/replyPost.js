import axios from "axios";


const API_URL = "https://api.twitter.com/2/tweets";

export async function replyToTweet(bearerToken, tweetId, replyText) {
    try {
        const response = await axios.post(API_URL, {
            text: replyText,
            reply: {
                in_reply_to_tweet_id: tweetId
            }
        }, {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
                "User-Agent": "v2RecentSearchJS",
                "Content-Type": "application/json"
            }
        });

        console.log("Reply posted:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error posting reply:", error.response.data);
        return null;
    }
}