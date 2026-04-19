import { SignOutButton, UserButton } from "@clerk/nextjs";
import {
  ClipboardList,
  Globe2,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  SearchCheck,
  Settings,
  ShieldCheck
} from "lucide-react";
import type { ReactNode } from "react";
import { getCurrentSession } from "../../lib/session";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Connected Sites", href: "/connected-sites", icon: Globe2 },
  { label: "AI Audit", href: "/ai-audit", icon: SearchCheck },
  { label: "Tasks", href: "/tasks", icon: ClipboardList },
  { label: "Client Requests", href: "/client-requests", icon: MessageSquareText },
  { label: "Settings", href: "/settings", icon: Settings }
];

export async function AppShell({ children }: { children: ReactNode }) {
  const session = await getCurrentSession();
  const clerkIsConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="grid min-h-screen lg:grid-cols-[272px_1fr]">
        <aside className="scan-panel motion-slide relative overflow-hidden border-b border-cloud/10 bg-graphite px-5 py-5 text-cloud lg:border-b-0 lg:border-r lg:border-cloud/10">
          <div className="motion-gradient absolute -left-24 top-14 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(27,138,122,0.36),rgba(215,229,111,0.16),transparent_70%)] blur-2xl" />
          <div className="relative z-10 flex items-start justify-between gap-4 lg:block">
            <div>
              <p className="text-xs font-black uppercase text-citron">OmniSite AI</p>
              <h1 className="mt-2 font-[var(--font-display)] text-3xl leading-none">Agency OS</h1>
            </div>
            <span className="status-pill bg-citron text-ink lg:mt-5">{clerkIsConfigured ? "Clerk auth" : "Local MVP"}</span>
          </div>

          <nav className="relative z-10 mt-6 grid grid-cols-2 gap-2 lg:grid-cols-1">
            {navItems.map((item) => (
              <a
                className="group flex items-center gap-3 rounded-ui border border-cloud/0 px-3 py-3 text-sm font-bold text-cloud/75 hover:-translate-y-0.5 hover:border-cloud/10 hover:bg-cloud/10 hover:text-cloud hover:shadow-xl hover:shadow-ink/20"
                href={item.href}
                key={item.href}
              >
                <span className="grid h-8 w-8 place-items-center rounded-ui bg-cloud/8 text-citron group-hover:bg-citron group-hover:text-ink">
                  <item.icon className="h-4 w-4" />
                </span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="relative z-10 mt-8 rounded-ui border border-cloud/10 bg-cloud/6 p-4 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-ui bg-citron text-ink">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-cloud/60">Workspace</p>
                <p className="mt-1 font-bold">{session.agencyName}</p>
                <p className="text-sm text-cloud/65">{session.userName}</p>
              </div>
              {clerkIsConfigured ? <UserButton /> : null}
            </div>
            {clerkIsConfigured ? (
              <SignOutButton redirectUrl="/">
                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-ui border border-cloud/20 px-3 py-2 text-sm font-bold text-cloud/80 hover:-translate-y-0.5 hover:bg-cloud/10" type="button">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </SignOutButton>
            ) : (
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-ui border border-cloud/20 px-3 py-2 text-sm font-bold text-cloud/80 hover:-translate-y-0.5 hover:bg-cloud/10" type="submit">
                <LogOut className="h-4 w-4" />
                Demo session
              </button>
            )}
          </div>
        </aside>

        <div className="min-w-0 px-5 py-6 md:px-8 lg:px-10">{children}</div>
      </div>
    </div>
  );
}
