const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function getUserId(username) {
    const bearerToken = process.env.X_BEARER_TOKEN;

    try {
        const response = await axios.get(`https://api.twitter.com/2/users/by/username/${username}`, {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
                'User-Agent': 'v2RecentSearchJS'
            }
        });
        return response.data.data.id;
    } catch (error) {
        console.error(error);
    }
}

getUserId('elonmusk').then(res => {
    console.log(`Elon Musk's Twitter ID: ${res}`);
});