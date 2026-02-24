"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, Activity, Monitor } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const links: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/",          label: "대시보드",  icon: LayoutDashboard },
  { href: "/stores",    label: "매장 관리", icon: Store },
  { href: "/comm-logs", label: "통신 로그", icon: Activity },
];

interface SidebarNavProps {
  onNavigate?: () => void;
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const isActive =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            title={link.label}
            className={`flex items-center gap-6 rounded px-3 py-2 text-sm transition-colors ${
              isActive
                ? "bg-accent font-medium text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-14 hover:w-56 flex-col shrink-0 border-r bg-card overflow-hidden transition-[width] duration-300 ease-in-out py-4 px-2">
      {/* 브랜드 */}
      <div className="mb-6 flex items-center gap-6 px-3">
        <Monitor className="h-5 w-5 shrink-0 text-foreground" />
        <span className="whitespace-nowrap text-sm font-semibold text-foreground">
          Global Monitoring
        </span>
      </div>
      <SidebarNav />
    </aside>
  );
}
