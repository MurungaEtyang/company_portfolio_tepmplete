import { TwitterApi } from "twitter-api-v2";
import crypto from "crypto";

// Twitter API Credentials
const clientId = "NmxhUmEteHZIdjhlQ0RMdnJPLUo6MTpjaQ";
const clientSecret = "KGqOwWm1baS5mro8a47SbwvWsfglffoQzVTl7UOmkuZhpVTOaY";
const redirectUri = "https://kenflix.xyz";

// Generate a `codeVerifier`
const codeVerifier = crypto.randomBytes(32).toString("hex");

// Create `codeChallenge` (SHA256 hash of `codeVerifier`, then Base64 URL encode it)
const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

console.log("🔹 Code Verifier:", codeVerifier);
console.log("🔹 Code Challenge:", codeChallenge);

// Step 1: Get Authorization URL (Direct the user here)
const client = new TwitterApi({ clientId, clientSecret });

const authUrl = client.generateOAuth2AuthLink(redirectUri, {
    scope: ["tweet.read", "users.read", "offline.access"], // Add necessary scopes
    state: "state123", // Optional, can be any random value
    codeChallenge,
    codeChallengeMethod: "S256",
});

console.log("🔹 Authorize the app here:", authUrl.url);

// Step 2: Wait for user to authenticate and get `code` from redirect URL
const code = "MElGSzU3OFdnZ1ZSd2k3QmgwWWJONmRxdjZGU0NST0xUbVlRbzJNSnhTbE4wOjE3MzkzNjI5ODY3MjA6MTowOmFjOjE"; // Replace with actual code from Twitter's redirect

// Step 3: Exchange `code` for `accessToken` and `refreshToken`
try {
    const {
        client: loggedClient,
        accessToken,
        refreshToken,
    } = await client.loginWithOAuth2({
        code,
        codeVerifier, // Must match the one used before
        redirectUri,
    });

    console.log("✅ Login Successful!");
    console.log("🔹 Access Token:", accessToken);
    console.log("🔹 Refresh Token:", refreshToken);
} catch (error) {
    console.error("❌ OAuth Callback Error:", error);
}
