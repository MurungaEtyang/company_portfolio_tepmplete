import axios from "axios";

export async function likeTweet(bearerToken, userId, tweetId) {
    try {
        const response = await axios.post(
            `https://api.x.com/2/users/${userId}/likes`,
            { tweet_id: tweetId },
            {
                headers: {
                    "Authorization": `Bearer ${bearerToken}`,
                    "Content-Type": "application/json",
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
// const token = "b2RzM2xKU1ZxZXptZmt3NWZZUF9qZEdVVlFsekl2QWlCZlp6ci1qTE1JdVhTOjE3MzkwOTUxMTg1Nzk6MToxOmF0OjE"
//
// const tweetId = "1888536918247215132";
// const userId = "1888333090189107201";
//
// likeTweet(token, userId, tweetId);
