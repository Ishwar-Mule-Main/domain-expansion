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

export const ISHWAR_EMAIL_SIGNATURE_HTML = `<table cellpadding="0" cellspacing="0" border="0" style="background: #0d0d0d; border-radius: 14px; overflow: hidden; border: 1px solid #e3e3e3; box-shadow: rgba(0, 0, 0, 0.07) 0px 3px 20px; width: 100%; max-width: 650px; font-family: Arial, Helvetica, sans-serif;" width="100%" class="container-table">
	<tbody valign="middle">
		<tr valign="inherit">
			<td style="background-color: #0d0d0d; padding: 20px 14px 15px 18px; vertical-align: top; text-align: center; width: 130px;" valign="top" align="center" bgcolor="rgb(13, 13, 13)" class="stack-column"><img src="https://domainexpansion.in/Team%20Members/Ishwar%20Mule.png" alt="Ishwar Mule" width="100" height="100" style="display: block; margin: 0px auto; border-radius: 10px; object-fit: cover;" class="profile-img">
				<div style="margin-top: 10px; background-color: #0d0d0d; border-radius: 8px; padding: 6px;" class="logo-container"><img src="https://domainexpansion.in/Domain%20Expansion%20New%20Logo.png" alt="Domain Expansion" width="110" height="29" style="display: block; margin: 0px auto; max-width: 110px;" class="logo-img"></div>
			</td>
			<td style="background-color: #ffffff; width: 1px; font-size: 0; line-height: 0; padding: 0;" valign="inherit" bgcolor="rgb(255, 255, 255)" class="divider-col">&nbsp;</td>
			<td style="padding: 20px 14px 20px 20px; vertical-align: top;" valign="top" class="stack-column middle-column">

				<p style="margin: 0 0 3px 0; font-size: 19px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px; white-space: nowrap;" class="white-space-fix">Ishwar Mule</p>

				<p style="margin: 0 0 13px 0; font-size: 12px; color: #acacb8; letter-spacing: 0.3px; white-space: nowrap;" class="white-space-fix">Founder and CEO | <a href="https://domainexpansion.in/" target="_blank" rel="noopener noreferrer" style="color: #acacb8; text-decoration: none;">Domain Expansion</a></p>

				<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 12px; width: 100%;">
					<tbody valign="middle">
						<tr valign="inherit">
							<td height="1" style="background-color: #ffffff; font-size: 0; line-height: 0;" bgcolor="rgb(255, 255, 255)" valign="inherit">&nbsp;</td>
						</tr>
					</tbody>
				</table>

				<table cellpadding="0" cellspacing="0" border="0" width="100%" class="contact-table">
					<tbody valign="middle">
						<tr valign="inherit">
							<td style="vertical-align: middle; padding-bottom: 9px; padding-right: 8px; width: 26px;" valign="middle">

								<table cellpadding="0" cellspacing="0" border="0">
									<tbody valign="middle">
										<tr valign="inherit">
											<td height="22" bgcolor="rgb(255, 255, 255)" style="background-color: #ffffff; border-radius: 50%; text-align: center; vertical-align: middle; width: 22px;" align="center" valign="middle"><img src="https://img.icons8.com/ios-filled/50/0d0d0d/phone.png" alt="Phone" width="12" height="12" style="display: block; margin: 0px auto;"></td>
										</tr>
									</tbody>
								</table>
							</td>
							<td style="font-size: 12.5px; color: #acacb8; padding-bottom: 9px; vertical-align: middle; white-space: nowrap; text-align: left;" valign="middle" align="left" class="white-space-fix contact-cell"><a href="tel:+918983433664" style="color: #acacb8; text-decoration: none;">+91 89834 33664</a> | <a href="tel:+919529433664" style="color: #acacb8; text-decoration: none;">+91 95294 33664</a></td>
						</tr>
						<tr valign="inherit">
							<td style="vertical-align: middle; padding-bottom: 9px; padding-right: 8px; width: 26px;" valign="middle">

								<table cellpadding="0" cellspacing="0" border="0">
									<tbody valign="middle">
										<tr valign="inherit">
											<td height="22" bgcolor="rgb(255, 255, 255)" style="background-color: #ffffff; border-radius: 50%; text-align: center; vertical-align: middle; width: 22px;" align="center" valign="middle"><img src="https://cdn-icons-png.flaticon.com/128/646/646094.png" alt="Email" width="12" height="12" style="display: block; margin: 0px auto;"></td>
										</tr>
									</tbody>
								</table>
							</td>
							<td style="font-size: 12.5px; color: #acacb8; padding-bottom: 9px; vertical-align: middle; white-space: nowrap; text-align: left;" valign="middle" align="left" class="white-space-fix contact-cell"><a href="mailto:ishwar@domainexpansion.in" style="color: #acacb8; text-decoration: none;">ishwar@domainexpansion.in</a></td>
						</tr>
						<tr valign="inherit">
							<td style="vertical-align: middle; padding-bottom: 9px; padding-right: 8px; width: 26px;" valign="middle">

								<table cellpadding="0" cellspacing="0" border="0">
									<tbody valign="middle">
										<tr valign="inherit">
											<td height="22" bgcolor="rgb(255, 255, 255)" style="background-color: #ffffff; border-radius: 50%; text-align: center; vertical-align: middle; width: 22px;" align="center" valign="middle"><img src="https://cdn-icons-png.flaticon.com/128/535/535239.png" alt="Location" width="12" height="12" style="display: block; margin: 0px auto;"></td>
										</tr>
									</tbody>
								</table>
							</td>
							<td style="font-size: 12.5px; color: #acacb8; padding-bottom: 9px; vertical-align: middle; white-space: nowrap; text-align: left;" valign="middle" align="left" class="white-space-fix contact-cell">India | USA | UK | Canada | UAE</td>
						</tr>
						<tr valign="inherit">
							<td style="vertical-align: middle; padding-right: 8px; width: 26px;" valign="middle">

								<table cellpadding="0" cellspacing="0" border="0">
									<tbody valign="middle">
										<tr valign="inherit">
											<td height="22" bgcolor="rgb(255, 255, 255)" style="background-color: #ffffff; border-radius: 50%; text-align: center; vertical-align: middle; width: 22px;" align="center" valign="middle"><img src="https://img.icons8.com/ios-filled/50/0d0d0d/internet.png" alt="Website" width="12" height="12" style="display: block; margin: 0px auto;"></td>
										</tr>
									</tbody>
								</table>
							</td>
							<td style="font-size: 12.5px; color: #acacb8; vertical-align: middle; white-space: nowrap; text-align: left;" valign="middle" align="left" class="white-space-fix contact-cell"><a href="https://www.domainexpansion.in" style="color: #acacb8; text-decoration: none;">domainexpansion.in</a></td>
						</tr>
					</tbody>
				</table>
			</td>
			<td style="background-color: #ffffff; width: 1px; font-size: 0; line-height: 0; padding: 0;" valign="inherit" bgcolor="rgb(255, 255, 255)" class="divider-col">&nbsp;</td>
			<td style="padding: 0; vertical-align: middle; text-align: center; width: 56px;" valign="middle" align="center" class="stack-column social-links-td">

				<table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">
					<tbody valign="middle">
						<tr valign="inherit">
							<td valign="middle" align="center" style="vertical-align: middle; text-align: center; padding: 16px 14px;">

								<table cellpadding="0" cellspacing="0" border="0" align="center" class="social-table">
									<tbody valign="middle">
										<tr valign="inherit">
											<td style="padding-bottom: 8px; text-align: center;" align="center" valign="inherit" class="social-icon-item">
												<a href="https://facebook.com/domainexpansion.in" title="Facebook" style="text-decoration: none; display: block;">

													<table cellpadding="0" cellspacing="0" border="0" align="center">
														<tbody valign="middle">
															<tr valign="inherit">
																<td height="28" bgcolor="rgb(24, 119, 242)" style="background-color: #1877F2; border-radius: 6px; text-align: center; vertical-align: middle; width: 28px;" align="center" valign="middle"><img src="https://img.icons8.com/ios-filled/50/ffffff/facebook-new.png" alt="Facebook" width="16" height="16" style="display: block; margin: 0px auto;"></td>
															</tr>
														</tbody>
													</table>
												</a></td>
										</tr>
										<tr valign="inherit">
											<td style="padding-bottom: 8px; text-align: center;" align="center" valign="inherit" class="social-icon-item">
												<a href="https://aratt.ai/user/@ishwarmule" title="Arattai" style="text-decoration: none; display: block;">

													<table cellpadding="0" cellspacing="0" border="0" align="center">
														<tbody valign="middle">
															<tr valign="inherit">
																<td height="28" bgcolor="rgb(255, 214, 0)" style="background-color: #FFD600; border-radius: 6px; text-align: center; vertical-align: middle; width: 28px;" align="center" valign="middle"><img src="https://img.icons8.com/material-sharp/24/243238/comments.png" alt="Arattai" width="15" height="15" style="display: block; margin: 0px auto;"></td>
															</tr>
														</tbody>
													</table>
												</a></td>
										</tr>
										<tr valign="inherit">
											<td style="padding-bottom: 8px; text-align: center;" align="center" valign="inherit" class="social-icon-item">
												<a href="https://linkedin.com/company/domainexpansion" title="LinkedIn" style="text-decoration: none; display: block;">

													<table cellpadding="0" cellspacing="0" border="0" align="center">
														<tbody valign="middle">
															<tr valign="inherit">
																<td height="28" bgcolor="rgb(10, 102, 194)" style="background-color: #0A66C2; border-radius: 6px; text-align: center; vertical-align: middle; width: 28px;" align="center" valign="middle"><img src="https://img.icons8.com/ios-filled/50/ffffff/linkedin.png" alt="LinkedIn" width="15" height="15" style="display: block; margin: 0px auto;"></td>
															</tr>
														</tbody>
													</table>
												</a></td>
										</tr>
										<tr valign="inherit">
											<td style="padding-bottom: 8px; text-align: center;" align="center" valign="inherit" class="social-icon-item">
												<a href="https://instagram.com/domainexpansion.in" title="Instagram" style="text-decoration: none; display: block;">

													<table cellpadding="0" cellspacing="0" border="0" align="center">
														<tbody valign="middle">
															<tr valign="inherit">
																<td height="28" bgcolor="#C13584" style="background: linear-gradient(135deg, #f09433, #e6683c 30%, #dc2743 55%, #cc2366 75%, #bc1888); border-radius: 6px; text-align: center; vertical-align: middle; width: 28px;" align="center" valign="middle"><img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" alt="Instagram" width="16" height="16" style="display: block; margin: 0px auto;"></td>
															</tr>
														</tbody>
													</table>
												</a></td>
										</tr>
										<tr valign="inherit">
											<td style="padding-bottom: 0; text-align: center;" align="center" valign="inherit" class="social-icon-item">
												<a href="https://wa.me/+918983433664" title="WhatsApp" style="text-decoration: none; display: block;">

													<table cellpadding="0" cellspacing="0" border="0" align="center">
														<tbody valign="middle">
															<tr valign="inherit">
																<td height="28" bgcolor="rgb(37, 211, 102)" style="background-color: #25D366; border-radius: 6px; text-align: center; vertical-align: middle; width: 28px;" align="center" valign="middle"><img src="https://img.icons8.com/ios-filled/50/ffffff/whatsapp.png" alt="WhatsApp" width="16" height="16" style="display: block; margin: 0px auto;"></td>
															</tr>
														</tbody>
													</table>
												</a></td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
					</tbody>
				</table>
			</td>
		</tr>
	</tbody>
</table>`;

/**
 * Send an email via SMTP using Nodemailer
 */
export async function sendPitchEmail(options: MailOptions, settings: any) {
  const { gmailUser, gmailAppPassword, smtpHost, smtpPort } = settings;

  if (!gmailUser || !gmailAppPassword) {
    throw new Error("SMTP credentials missing. Please configure email address and password in Email Settings.");
  }

  const host = smtpHost || "smtp.gmail.com";
  const port = Number(smtpPort) || 465;

  // Create transporter for SMTP
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  const unsubscribeUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/unsubscribe?id=${options.prospectId}`;

  // Assemble high-aesthetic responsive HTML email card layout with signature
  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Container Card -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 650px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); overflow: hidden;">
          
          <!-- Header Bar -->
          <tr>
            <td style="background-color: #0d0d0d; padding: 20px 28px; text-align: left; border-bottom: 3px solid #FF6200;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="left" valign="middle">
                    <img src="https://domainexpansion.in/Domain%20Expansion%20New%20Logo.png" alt="Domain Expansion" width="140" style="display: block; max-width: 140px; height: auto;" />
                  </td>
                  <td align="right" valign="middle" style="font-size: 11px; color: #888898; font-family: monospace; letter-spacing: 0.5px;">
                    AGENCY &bull; TECHGUILD
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Email Content Area -->
          <tr>
            <td style="padding: 32px 28px 24px 28px; color: #1f2937; font-size: 15px; line-height: 1.7;">
              ${options.html}
            </td>
          </tr>

          <!-- Signature Section -->
          <tr>
            <td style="padding: 8px 16px 28px 16px;" align="center">
              ${ISHWAR_EMAIL_SIGNATURE_HTML}
            </td>
          </tr>

        </table>

        <!-- Footer / Compliance Unsubscribe -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 650px; margin-top: 20px;">
          <tr>
            <td align="center" style="font-size: 11px; color: #9ca3af; font-family: Arial, sans-serif; line-height: 1.5;">
              Domain Expansion &bull; Think Outside The Box &bull; Solapur / Latur, Maharashtra, India
              <br>
              You are receiving this email as a prospective partner.
              <br>
              Want to stop receiving emails? <a href="${unsubscribeUrl}" style="color: #FF6200; text-decoration: underline; font-weight: bold;">Unsubscribe instantly</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // Send mail with headers for unsubscribe standards
  const info = await transporter.sendMail({
    from: `"Ishwar Mule | Domain Expansion" <${gmailUser}>`,
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

  const host = imapHost || "imap.gmail.com";
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
