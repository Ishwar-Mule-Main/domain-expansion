import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { BarChart3, Database, FolderGit2, LogOut, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Redirection backup if middleware is bypassed
  if (pathname !== "/admin/login" && !session) {
    redirect("/admin/login");
  }

  // If on login page, render children directly without the dashboard sidebar wrapper
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Admin sign out action
  const handleSignOut = async () => {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#2E2E2E] bg-[#141414] p-6 flex flex-col justify-between shrink-0">
        <div className="flex flex-col gap-8 text-left">
          {/* Header */}
          <div className="flex items-center gap-2.5 pb-6 border-b border-[#2E2E2E]/60">
            <div className="h-8 w-8 rounded bg-[#FF6200]/10 flex items-center justify-center border border-[#FF6200]/20">
              <Shield className="h-4.5 w-4.5 text-[#FF6200]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold tracking-wide">Admin Engine</span>
              <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-wider">
                {session?.user?.name || "ADMIN"} Active
              </span>
            </div>
          </div>

          {/* Links Grid */}
          <nav className="flex flex-col gap-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase text-[#ACACB8] hover:text-white hover:bg-white/5 transition-all"
            >
              <BarChart3 className="h-4 w-4 text-[#FF8C42]" /> Overview
            </Link>

            <Link
              href="/admin/leads"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase text-[#ACACB8] hover:text-white hover:bg-white/5 transition-all"
            >
              <Database className="h-4 w-4 text-[#FF8C42]" /> Lead Inquiries
            </Link>

            <Link
              href="/admin/waitlist"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase text-[#ACACB8] hover:text-white hover:bg-white/5 transition-all"
            >
              <Users className="h-4 w-4 text-[#FF8C42]" /> TechGuild Waitlist
            </Link>

            <Link
              href="/admin/portfolio"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase text-[#ACACB8] hover:text-white hover:bg-white/5 transition-all"
            >
              <FolderGit2 className="h-4 w-4 text-[#FF8C42]" /> Portfolio Control
            </Link>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-[#2E2E2E]/60 mt-8 md:mt-0">
          <form action={handleSignOut}>
            <button
              type="submit"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all w-full text-left"
            >
              <LogOut className="h-4 w-4" /> Sign Out Session
            </button>
          </form>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-grow p-6 sm:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
