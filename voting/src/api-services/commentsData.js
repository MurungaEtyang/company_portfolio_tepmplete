import video from "../assests/images/vido.mp4"
export const commentsResponse = [
    {
        id: 1,
        username: "murunga",
        text: "I believe that the government of Kenya should prioritize the needs of its citizens and work towards creating a better future for all. It's time for us to come together and make our voices heard. Should President William Ruto resign? Share your thoughts with us!",
        likes: 100,
        shares: 20,
        media: [
            {
                type: "image",
                url: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 100)}`,
                alt: "Random Image",
            },
            {
                type: "image",
                url: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 100)}`,
                alt: "Another Random Image",
            },
            {
                type: "video",
                url: video,
                alt: "Kenya Culture Video",
            },
        ],
        replies: [
            {
                id: 11,
                username: "Victoria Wendo",
                text: "I totally agree with you! It's time for us to stand up for what we believe in and make a change. #MakeKenyaGreatAgain",
                likes: 5,
                shares: 1,
                media: [
                    {
                        type: "image",
                        url: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 100)}`,
                        alt: "I agree",
                    },
                ],
            },
            {
                id: 12,
                username: "Mourine",
                text: "I'm not sure about that. I think we should give the government a chance to prove themselves. Let's wait and see what they do.",
                likes: 3,
                shares: 1,
                media: [
                    {
                        type: "image",
                        url: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 100)}`,
                        alt: "Not sure",
                    },
                    {
                        type: "video",
                        url: video,
                        alt: "Not sure video",
                    },
                ],
            },
            {
                id: 13,
                username: "Daniel",
                text: "I'm so tired of the corruption in this country. It's time for us to stand up and demand change. We can't keep living like this.",
                likes: 10,
                shares: 2,
                media: [
                    {
                        type: "image",
                        url: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 100)}`,
                        alt: "Corruption",
                    },
                    {
                        type: "video",
                        url: video,
                        alt: "Corruption video",
                    },
                ],
            },
            {
                id: 14,
                username: "Elija",
                text: "I'm so disappointed in the government. They keep promising us things and never deliver. It's time for us to stand up and demand change.",
                likes: 8,
                shares: 2,
                media: [
                    {
                        type: "image",
                        url: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 100)}`,
                        alt: "Disappointed",
                    },
                    {
                        type: "image",
                        url: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 100)}`,
                        alt: "Disappointed",
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        username: "Baraka",
        text: "I think the government should focus on creating jobs and improving the economy. That's the only way we'll be able to move forward as a country.",
        likes: 75,
        shares: 10,
        media: [
            {
                type: "image",
                url: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 100)}`,
                alt: "Safari Adventure",
            },
            {
                type: "image",
                url: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 100)}`,
                alt: "Safari Adventure",
            },
            {
                type: "image",
                url: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 100)}`,
                alt: "Safari Adventure",
            },
            {
                type: "image",
                url: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 100)}`,
                alt: "Safari Adventure",
            },
            {
                type: "video",
                url: video,
                alt: "Kenya Wildlife Video",
            },
        ],
        replies: [
            {
                id: 21,
                username: "Kagwira",
                text: "I love this! It's so true. We need to focus on creating jobs and improving the economy. That's the only way we'll be able to move forward as a country.",
                likes: 2,
                shares: 1,
                media: [
                    {
                        type: "image",
                        url: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 100)}`,
                        alt: "I love this",
                    },
                ],
            },
            {
                id: 22,
                username: "Joan Wambui",
                text: "I'm so tired of the corruption in this country. It's time for us to stand up and demand change. We can't keep living like this.",
                likes: 8,
                shares: 2,
                media: [
                    {
                        type: "image",
                        url: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 100)}`,
                        alt: "Corruption",
                    },
                    {
                        type: "video",
                        url: video,
                        alt: "Corruption video",
                    },
                ],
            },
            {
                id: 23,
                username: "Fiona Kawira",
                text: "I'm so disappointed in the government. They keep promising us things and never deliver. It's time for us to stand up and demand change.",
                likes: 10,
                shares: 2,
                media: [
                    {
                        type: "image",
                        url: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 100)}`,
                        alt: "Disappointed",
                    },
                    {
                        type: "image",
                        url: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 100)}`,
                        alt: "Disappointed",
                    },
                ],
            },
        ],
    },
    {
        id: 3,
        username: "Mwiti",
        text: "I think the government should focus on creating jobs and improving the economy. That's the only way we'll be able to move forward as a country.",
        likes: 75,
        shares: 10,
        media: [

        ],
        replies: [

        ],
    },
];