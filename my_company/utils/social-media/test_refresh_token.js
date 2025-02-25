import { TwitterApi } from "twitter-api-v2";

const refreshTokens = async (client_id, client_secret, refreshToken) => {
    const client = new TwitterApi({
        clientId: client_id,
        clientSecret: client_secret
    });
    try {
        const newTokens = await client.refreshOAuth2Token(refreshToken);
        console.log("New tokens:", newTokens);
        return newTokens;
    } catch (error) {
        console.error("Error refreshing tokens:", error);
    }
};

await refreshTokens();
