import {TwitterApi} from "twitter-api-v2";

const client = new TwitterApi("RVg5OUlMWGtySi1DNk5ha29EV3NfcE80TlpLdHRXUDdycl9wODF6QUhUOVdEOjE3NDA0MjQwNDAwNTM6MToxOmF0OjE");


const rwClient = client.readWrite;


const tweetText = async () => {
    try {

        await rwClient.v2.tweet(
            "Good evening everyone");

        console.log("success");
    } catch (error) {
        console.log(error);
    }
};

const mediaTweet = async () => {
    try {

        const mediaId = await client.v1.uploadMedia(

            "./1605232393098780672example.png"
        );

        await rwClient.v2.tweet({
            text:
                "Twitter is a fantastic social network. Look at this:",
            media: { media_ids: [mediaId] },
        });
        console.log("success");
    } catch (error) {
        console.log(error);
    }
};

await tweetText();
// await mediaTweet();

//
// Access Token: RVg5OUlMWGtySi1DNk5ha29EV3NfcE80TlpLdHRXUDdycl9wODF6QUhUOVdEOjE3NDA0MjQwNDAwNTM6MToxOmF0OjE
// Refresh Token: bmxLQklCZkdmbk1sakx6R2VsNEhyMGI5cnhOTUVtUzBGV0ZBTGxlTVZWWWhJOjE3NDA0MjQwNDAwNTM6MToxOnJ0OjE