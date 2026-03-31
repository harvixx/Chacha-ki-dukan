// ✅ @getbrevo/brevo v5 — pure fetch-based API, no constructors
const BREVO_API_BASE = "https://api.brevo.com/v3";

const brevoHeaders = {
  "api-key": process.env.BREVO_API_KEY,
  "Content-Type": "application/json",
  "Accept": "application/json",
};

// ✅ Verify API key on startup
export const verifyBrevoConnection = async () => {
  try {
    const response = await fetch(`${BREVO_API_BASE}/account`, {
      method: "GET",
      headers: brevoHeaders,
    });

    const body = await response.json();

    if (response.ok) {
      console.log(`✅ Brevo connected | Account: ${body.email} | Plan: ${body.plan?.[0]?.type}`);
    } else {
      console.error("❌ Brevo API key invalid:", body.message);
    }

    return response.ok;
  } catch (error) {
    console.error("❌ Brevo connection failed:", error.message);
    return false;
  }
};

// ✅ Send transactional email
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await fetch(`${BREVO_API_BASE}/smtp/email`, {
      method: "POST",
      headers: brevoHeaders,
      body: JSON.stringify({
        subject,
        htmlContent: html,
        sender: {
          name: "Chacha ki Dukan",
          email: process.env.SENDER_EMAIL,
        },
        to: [{ email: to }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unknown Brevo error");
    }

    console.log(`📧 Brevo Email Sent! ID: ${data.messageId}`);
    return { success: true, messageId: data.messageId };

  } catch (error) {
    console.error("❌ Brevo Error:", error.message);
    return { success: false, error: error.message };
  }
};