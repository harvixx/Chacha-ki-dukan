import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,  
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify connection on startup
transporter.verify((error) => {
    if (error) {
        console.error("❌ Email transporter error:", error.message);
    } else {
        console.log("✅ Email transporter is ready");
    }
});

export const sendEmail = async ({ to, subject, html, text }) => {
    const mailOptions = {
        from: `"Knowra AI" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        ...(text && { text }), // optional plain text fallback
    };

    const MAX_RETRIES = 2;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`📧 Email sent (attempt ${attempt}):`, info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error(`❌ Email attempt ${attempt} failed:`, error.message);

            if (attempt === MAX_RETRIES) {
                console.error("❌ All email attempts failed");
                return { success: false, error: error.message };
            }

            // Wait 1s before retrying
            await new Promise((res) => setTimeout(res, 1000));
        }
    }
};