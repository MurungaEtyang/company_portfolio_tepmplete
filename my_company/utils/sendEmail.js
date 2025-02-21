import { createTransport } from "nodemailer";

const transporter = createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    // tls: {
    //     rejectUnauthorized: false,
    //     secureProtocol: process.env.ENCRYPTION || 'TLS'
    // }
});

export const sendEmail = async (to, subject, htmlContent) => {
    const info = await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html: htmlContent
    });

    console.log(`Email sent: ${info.messageId}`);
};