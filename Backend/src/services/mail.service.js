import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await sgMail.send({
      to,
      from: process.env.EMAIL_USER,
      subject,
      html,
    });

    console.log("📧 Email sent");
  } catch (err) {
    console.log("❌ Email failed:", err.message);
  }
};