import { Resend } from "resend";

// Initialize Resend Client, with fallback mock if API key is missing
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface SendMailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendMailParams) {
  if (!resend) {
    console.log(`[Email Mock Output]
To: ${to}
Subject: ${subject}
HTML Body Snippet: ${html.substring(0, 180)}...
---------------------------------------`);
    return { success: true, id: "mock_id" };
  }

  try {
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL || "Domain Expansion <info@domainexpansion.in>",
      to,
      subject,
      html,
    });
    return { success: true, id: data.data?.id };
  } catch (error) {
    console.error("Resend API failed to route email:", error);
    return { success: false, error };
  }
}

// Admin notification template
export async function sendAdminLeadNotification(leadData: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  budget?: string;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "info@domainexpansion.in";
  const subject = `🔥 New Lead Received: ${leadData.name} (${leadData.service})`;
  const html = `
    <div style="font-family: sans-serif; color: #111827; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
      <h2 style="color: #ff6200; margin-top: 0;">New Inbound Lead Received</h2>
      <p style="margin: 8px 0;"><strong>Name:</strong> ${leadData.name}</p>
      <p style="margin: 8px 0;"><strong>Email:</strong> ${leadData.email}</p>
      <p style="margin: 8px 0;"><strong>Phone:</strong> ${leadData.phone || "Not Provided"}</p>
      <p style="margin: 8px 0;"><strong>Company:</strong> ${leadData.company || "Not Provided"}</p>
      <p style="margin: 8px 0;"><strong>Service:</strong> ${leadData.service}</p>
      <p style="margin: 8px 0;"><strong>Budget:</strong> ${leadData.budget || "Not Provided"}</p>
      <h4 style="margin: 16px 0 8px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">Brief Description:</h4>
      <p style="background-color: #f9fafb; padding: 12px; border-left: 4px solid #ff6200; border-radius: 4px; font-style: italic; white-space: pre-wrap; margin: 0;">${leadData.message}</p>
    </div>
  `;
  return sendEmail({ to: adminEmail, subject, html });
}

// User submission confirmation template
export async function sendLeadUserConfirmation(userEmail: string, userName: string) {
  const subject = "Thank you for contacting Domain Expansion!";
  const html = `
    <div style="font-family: sans-serif; color: #1f2937; max-width: 600px; margin: 0 auto; line-height: 1.6;">
      <h2 style="color: #ff6200;">Hello ${userName},</h2>
      <p>Thank you for reaching out to <strong>Domain Expansion</strong>. We have successfully logged your project request.</p>
      <p>Our founder and chief strategist, Ishwar Mule, reviews all inquiries. We will reach back out to you within 24 business hours to schedule a discovery call.</p>
      <p>If you'd like to get in touch immediately, feel free to reply to this email or send us a message on WhatsApp via <a href="https://wa.me/918983433664" style="color: #ff6200; font-weight: bold;">+91 89834 33664</a>.</p>
      <br />
      <hr style="border: 0; border-top: 1px solid #e5e7eb;" />
      <p style="font-size: 12px; color: #6b7280; margin-top: 16px;">
        Domain Expansion · Think Outside The Box<br />
        Solapur / Latur, Maharashtra, India<br />
        <a href="https://domainexpansion.in" style="color: #6b7280;">domainexpansion.in</a>
      </p>
    </div>
  `;
  return sendEmail({ to: userEmail, subject, html });
}

// TechGuild waitlist welcome template
export async function sendWaitlistConfirmation(userEmail: string, role: string, position: number) {
  const subject = "You're on the list! Welcome to TechGuild";
  const roleText = role === "AGENCY" ? "Agency Partner" : "Client Partner";
  const html = `
    <div style="font-family: sans-serif; color: #1f2937; max-width: 600px; margin: 0 auto; line-height: 1.6;">
      <h2 style="color: #6d28d9; margin-top: 0;">Welcome to the TechGuild Waitlist!</h2>
      <p>Thank you for joining the waitlist for TechGuild — the verified, agency-only B2B marketplace launching in Q3 2026.</p>
      <div style="background-color: #f5f3ff; border-left: 4px solid #6d28d9; padding: 16px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold; color: #6d28d9;">Your Waitlist Position: #${position}</p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #4c1d95;">Registered Role: ${roleText}</p>
      </div>
      <p>As a waitlist member, you will receive:</p>
      <ul style="padding-left: 20px;">
        <li>Early platform access 2 weeks before the public launch</li>
        <li><strong>3 months free</strong> on any premium subscription plans</li>
        <li>Priority onboarding assistance and profile vetting</li>
      </ul>
      <p>We will keep you updated with progress reports, features, and key milestone announcements leading up to launch.</p>
      <p>If you have any questions or want to collaborate, feel free to reply directly to this email.</p>
      <br />
      <hr style="border: 0; border-top: 1px solid #e5e7eb;" />
      <p style="font-size: 12px; color: #6b7280; margin-top: 16px;">
        TechGuild by Domain Expansion · Think Outside The Box<br />
        Solapur / Latur, Maharashtra, India<br />
        <a href="https://domainexpansion.in/techguild" style="color: #6b7280;">domainexpansion.in/techguild</a>
      </p>
    </div>
  `;
  return sendEmail({ to: userEmail, subject, html });
}

