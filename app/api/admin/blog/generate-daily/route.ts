import { NextResponse } from "next/server";
import { runDailyBlogAgent } from "@/lib/blog/blogAgentService";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Validate cron secret if set in environment
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, message: "Unauthorized cron execution" }, { status: 401 });
  }

  try {
    console.log("[Cron Engine] Running Daily Blog Agent loops at 9:00 AM IST equivalent...");
    const results = await runDailyBlogAgent();
    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error("[Cron Engine] Daily Blog Agent run failed:", err);
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}
