import nodemailer from "nodemailer";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { prisma } from "../db/prisma";

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
  prospectId: string;
}

/**
 * Send an email via SMTP using Nodemailer
 */
export async function sendPitchEmail(options: MailOptions, settings: any) {
  const { gmailUser, gmailAppPassword, smtpHost, smtpPort } = settings;

  if (!gmailUser || !gmailAppPassword) {
    throw new Error("SMTP credentials missing. Please configure email address and password in Email Settings.");
  }

  const host = smtpHost || "smtpout.secureserver.net";
  const port = Number(smtpPort) || 465;

  // Create transporter for GoDaddy Professional / SMTP
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for port 465, false for port 587
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  const unsubscribeUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/unsubscribe?id=${options.prospectId}`;

  const htmlBody = `
    ${options.html}
    <br><br>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 11px; color: #999; font-family: sans-serif; text-align: center;">
      You are receiving this email because you are a prospective business partner. 
      <br>
      If you would like to opt out, you can <a href="${unsubscribeUrl}" style="color: #FF6200; text-decoration: underline;">unsubscribe instantly</a>.
    </p>
  `;

  // Send mail with headers for unsubscribe standards
  const info = await transporter.sendMail({
    from: `"Domain Expansion" <${gmailUser}>`,
    to: options.to,
    subject: options.subject,
    html: htmlBody,
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });

  return info;
}

/**
 * Connect via IMAP and scan for replies from active prospects.
 */
export async function syncGmailReplies(settings: any) {
  const { gmailUser, gmailAppPassword, imapHost, imapPort } = settings;

  if (!gmailUser || !gmailAppPassword) {
    throw new Error("IMAP credentials missing. Please configure email address and password in Email Settings.");
  }

  const host = imapHost || "imap.secureserver.net";
  const port = Number(imapPort) || 993;

  const client = new ImapFlow({
    host,
    port,
    secure: true,
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
    logger: false,
  });

  await client.connect();

  let repliesFound = 0;
  // Select inbox folder
  const lock = await client.getMailboxLock("INBOX");
  try {
    // Search for emails in the last 7 days (to keep search fast and light)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Gmail search query
    const messages = await client.search({
      since: sevenDaysAgo,
    });

    if (messages && Array.isArray(messages)) {
      for (const uid of messages) {
        // Fetch email headers and body structure
        const email = await client.fetchOne(uid, {
          source: true,
        });

        if (!email || !email.source) continue;

      // Parse MIME structure
      const parsed = await simpleParser(email.source);
      const fromAddress = parsed.from?.value?.[0]?.address?.toLowerCase();

      if (!fromAddress) continue;

      // Check if this fromAddress matches a prospect who has status SENT or SENDING
      const prospect = await prisma.prospect.findFirst({
        where: {
          email: fromAddress,
          status: {
            in: ["SENT", "SENDING"],
          },
        },
      });

      if (prospect) {
        // We found a reply!
        const replyText = parsed.text || parsed.html || "Empty body";
        const cleanReplyText = typeof replyText === "string" ? replyText.substring(0, 5000) : "Unparseable";

        await prisma.$transaction([
          // Update prospect status to REPLIED
          prisma.prospect.update({
            where: { id: prospect.id },
            data: {
              status: "REPLIED",
              repliedAt: parsed.date || new Date(),
            },
          }),
          // Log the reply
          prisma.emailLog.create({
            data: {
              prospectId: prospect.id,
              prospectEmail: prospect.email,
              action: "REPLY_RECEIVED",
              details: `Subject: ${parsed.subject}\n\nSnippet: ${cleanReplyText.substring(0, 500)}...`,
            },
          }),
        ]);

        repliesFound++;
      }
    }
  }
} finally {
    // Release mailbox lock
    lock.release();
  }

  await client.logout();
  return repliesFound;
}
