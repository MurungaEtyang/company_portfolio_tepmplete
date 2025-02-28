import { TwitterApi } from 'twitter-api-v2';
import pool from '../../config/config.js';

class TwitterService {
    constructor() {
        this.twitterClients = {};
    }

    async getAllTwitterAccounts() {
        try {
            const query = `
                SELECT t.username, t.access_token, t.refresh_token, b.client_id, b.client_secret
                FROM twitter_tokens t
                         JOIN twitter_bearer_token b ON t.username = b.username
            `;
            const result = await pool.query(query);

            if (result.rows.length === 0) {
                throw new Error("No Twitter accounts found in the database.");
            }

            return result.rows;
        } catch (error) {
            console.error("❌ Error fetching Twitter accounts:", error.message);
            throw new Error("Failed to retrieve Twitter accounts.");
        }
    }

    /**
     * Refreshes an expired access token and updates it in the database.
     */
    async refreshAccessToken(refreshToken, clientId, clientSecret, username) {
        try {
            console.log(`🔄 Refreshing token for @${username}...`);

            const clientSecretAuth = new TwitterApi({ clientId, clientSecret });

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
                await clientSecretAuth.refreshOAuth2Token(refreshToken);

            const updateQuery = `
                UPDATE twitter_tokens
                SET access_token = $1, refresh_token = $2
                WHERE username = $3
            `;
            await pool.query(updateQuery, [newAccessToken, newRefreshToken, username]);

            console.log(`✅ Token refreshed successfully for @${username}!`);
            return newAccessToken;
        } catch (error) {
            console.error(`❌ Error refreshing token for @${username}:`, error.message);
            throw new Error(`Failed to refresh Twitter token for @${username}`);
        }
    }

    /**
     * Sends a tweet from all stored Twitter accounts.
     */
    async sendTweetToAll(tweetMessage) {
        const results = [];

        try {
            const accounts = await this.getAllTwitterAccounts();

            for (const account of accounts) {
                const { username, access_token, refresh_token, client_id, client_secret } = account;
                console.log(`🔹 Processing @${username}...`);

                let twitterClient = new TwitterApi(access_token);
                let rwClient = twitterClient.readWrite;

                try {
                    console.log(`🔹 Verifying authentication for @${username}...`);
                    await twitterClient.v2.me();
                    console.log(`✅ @${username} authenticated successfully!`);
                } catch (error) {
                    if (error?.data?.errors?.[0]?.code === 89) {
                        console.warn(`🔄 Token expired for @${username}, attempting refresh...`);
                        try {
                            const newAccessToken = await this.refreshAccessToken(refresh_token, client_id, client_secret, username);
                            twitterClient = new TwitterApi(newAccessToken);
                            rwClient = twitterClient.readWrite;
                            console.log(`🔄 Retrying authentication for @${username}...`);
                            await twitterClient.v2.me();
                            console.log(`✅ @${username} re-authenticated successfully!`);
                        } catch (refreshError) {
                            console.error(`❌ Token refresh failed for @${username}:`, refreshError.message);
                            results.push({ username, success: false, error: "Token refresh failed" });
                            continue;
                        }
                    } else {
                        console.error(`❌ Authentication failed for @${username}:`, error.message);
                        results.push({ username, success: false, error: "Authentication failed" });
                        continue;
                    }
                }

                try {
                    console.log(`📢 Sending tweet from @${username}...`);
                    await rwClient.v2.tweet(tweetMessage);
                    console.log(`✅ Tweet sent successfully from @${username}!`);
                    results.push({ username, success: true });
                } catch (tweetError) {
                    console.error(`❌ Failed to tweet from @${username}:`, tweetError.message);

                    let errorMessage = "Tweet failed";
                    if (tweetError?.code === 403 && tweetError?.data?.detail) {
                        errorMessage = tweetError.data.detail;
                    } else if (tweetError?.code === 429) {
                        errorMessage = "Rate limit exceeded. Try again later.";
                    }

                    results.push({ username, success: false, error: errorMessage });
                }
            }
        } catch (error) {
            console.error("❌ Error sending tweets:", error.message);
            throw new Error("Failed to send tweets from all accounts.");
        }

        return results;
    }
}

export default TwitterService;
