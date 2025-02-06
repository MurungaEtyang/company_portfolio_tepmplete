import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public/uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

function processMediaObjects(mediaObjects) {
    return mediaObjects.map((media) => {
        console.log("Processing media:", media);

        if (media.type === 'image' && media.url && typeof media.url === 'string') {

            if (media.url.startsWith('data:image')) {
                const base64Data = media.url.split(",")[1];
                const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
                const filePath = path.join(uploadDir, fileName);

                fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
                console.log("Saved image to:", filePath);
                return { ...media, url: `/uploads/${fileName}` };
            } else {
                try {
                    new URL(media.url);
                    console.log("Valid URL:", media.url);
                    return media;
                } catch (e) {
                    console.log("Invalid URL:", media.url);
                    throw new Error('Invalid image URL or format.');
                }
            }
        }

        return media;
    });
}

export { processMediaObjects };