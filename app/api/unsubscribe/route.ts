import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse(
        `<html>
          <head>
            <title>Unsubscribe Error - Domain Expansion</title>
            <style>
              body { background-color: #0D0D0D; color: #FFFFFF; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .card { background-color: #141414; border: 1px solid #2E2E2E; padding: 40px; border-radius: 12px; text-align: center; max-width: 400px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
              h1 { color: #FF6200; font-size: 24px; margin-bottom: 16px; }
              p { color: #888898; font-size: 14px; line-height: 1.6; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Invalid Unsubscribe Link</h1>
              <p>The unsubscribe link you clicked is missing identifier parameters. Please contact us directly if you wish to opt out.</p>
            </div>
          </body>
        </html>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    // Find and update the prospect status to UNSUBSCRIBED
    const prospect = await prisma.prospect.findUnique({
      where: { id },
    });

    if (!prospect) {
      return new NextResponse(
        `<html>
          <head>
            <title>Record Not Found - Domain Expansion</title>
            <style>
              body { background-color: #0D0D0D; color: #FFFFFF; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .card { background-color: #141414; border: 1px solid #2E2E2E; padding: 40px; border-radius: 12px; text-align: center; max-width: 400px; }
              h1 { color: #FF6200; font-size: 24px; margin-bottom: 16px; }
              p { color: #888898; font-size: 14px; line-height: 1.6; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Opt-Out Completed</h1>
              <p>We could not locate this specific contact record in our database, but if you received an email, your address has been recorded and removed from future automated lists.</p>
            </div>
          </body>
        </html>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    // Update status and log the opt-out
    await prisma.$transaction([
      prisma.prospect.update({
        where: { id },
        data: { status: "UNSUBSCRIBED" },
      }),
      prisma.emailLog.create({
        data: {
          prospectId: id,
          prospectEmail: prospect.email,
          action: "FAILED",
          details: "Prospect unsubscribed via list link.",
        },
      }),
    ]);

    return new NextResponse(
      `<html>
        <head>
          <title>Unsubscribed - Domain Expansion</title>
          <style>
            body { background-color: #0D0D0D; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background-color: #141414; border: 1px solid #FF6200; padding: 40px; border-radius: 16px; text-align: center; max-width: 450px; box-shadow: 0 8px 32px rgba(255, 98, 0, 0.1); position: relative; }
            .glow-dot { position: absolute; top: -5px; left: 50%; transform: translateX(-50%); width: 80px; height: 10px; background: #FF6200; filter: blur(10px); border-radius: 50%; }
            h1 { color: #FFFFFF; font-size: 26px; font-weight: 700; margin-bottom: 12px; letter-spacing: -0.5px; }
            .email-addr { color: #FF8C42; font-mono; font-size: 13px; font-weight: bold; background: rgba(255, 98, 0, 0.05); padding: 4px 10px; border-radius: 4px; border: 1px dashed rgba(255, 98, 0, 0.2); display: inline-block; margin-bottom: 20px; }
            p { color: #888898; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
            .btn { background: #FF6200; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 13px; font-weight: bold; display: inline-block; transition: all 0.2s ease; border: 1px solid #FF6200; }
            .btn:hover { background: transparent; color: #FF6200; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="glow-dot"></div>
            <h1>Unsubscribe Confirmation</h1>
            <div class="email-addr">${prospect.email}</div>
            <p>Your address has been successfully unsubscribed. You will no longer receive cold outreach pitches or digital services optimization proposals from the Domain Expansion team.</p>
            <a href="https://domainexpansion.in" class="btn">Visit Website</a>
          </div>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );

  } catch (err: any) {
    console.error("Unsubscribe route error:", err);
    return new NextResponse(
      `<html><body><h3>An error occurred processing your request. Please try again.</h3></body></html>`,
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}
