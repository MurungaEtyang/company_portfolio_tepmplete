export class EmailConfirmation {

    async confirmationEmail(code) {
        const subject = "Your Registration Code";
        const emailContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; color: #333;">
            <h2 style="color: #007bff;">Your Registration Code</h2>
            <p style="font-size: 16px;">Use this code to complete your registration. Please check your email spam folder if you don't see it in your inbox. If you have any issues, contact us at <a href="mailto:info@kenf.murunga.dev" style="color: #007bff;">info@kenf.murunga.dev</a>.</p>
            <h3 style="color: red; font-size: 24px;">${code}</h3>
            <p style="font-size: 16px;">This code is valid for 1 day. After that, you will need to request a new one.</p>
            <img src="https://picsum.photos/200/300?random=1" alt="Random Picture" style="width: 100%; height: auto; display: block; margin: 20px auto;">
        </div>
        `;
        return {subject, emailContent};
    }
}