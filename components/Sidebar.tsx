"use client";

import { Activity, BarChart, Calendar as CalendarIcon, Target, Settings, Lightbulb, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: Activity },
    { href: "/goals", label: "Goals", icon: Target },
    { href: "/activity", label: "Activity", icon: CalendarIcon },
    { href: "/analytics", label: "Analytics", icon: BarChart },
    { href: "/insights", label: "AI Insights", icon: Lightbulb },
  ];

  return (
    <div className="w-64 bg-[var(--card)] border-r border-[var(--border)] hidden md:flex flex-col h-screen shrink-0 sticky top-0 py-6 px-4">
      <div className="flex items-center gap-2 mb-8 px-4">
        <div className="w-8 h-8 rounded-lg bg-[var(--foreground)] flex items-center justify-center">
          <Activity className="w-5 h-5 text-[var(--card)]" />
        </div>
        <span className="font-semibold text-lg tracking-tight">Goal Intel</span>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-[var(--secondary)] text-[var(--foreground)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)]/50 hover:text-[var(--foreground)]"
            )}
          >
            <link.icon className="w-4 h-4" />
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="pt-4 border-t border-[var(--border)]">
        <div className="flex items-center justify-between px-4 py-3 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--secondary)] flex items-center justify-center">
              <User className="w-4 h-4 text-[var(--foreground)]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">Developer</span>
              <span className="text-xs text-[var(--muted-foreground)] mt-1">Free Plan</span>
            </div>
          </div>
          <button 
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 transition-colors"
            title="Log Out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
