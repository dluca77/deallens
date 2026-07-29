"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Heart,
  History,
  LayoutDashboard,
  ScanLine,
  Settings,
  Tag,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overzicht", icon: LayoutDashboard },
  { href: "/scan", label: "Nieuwe zoekopdracht", icon: ScanLine },
  { href: "/history", label: "Mijn zoekopdrachten", icon: History },
  { href: "/saved", label: "Opgeslagen producten", icon: Heart },
  { href: "/alerts", label: "Prijsalerts", icon: Bell },
  { href: "/results", label: "Kortingscodes", icon: Tag },
  { href: "/account", label: "Account", icon: UserRound },
  { href: "/account", label: "Instellingen", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Dashboardnavigatie" className="space-y-1">
      {links.map((link, i) => {
        const Icon = link.icon;
        const active = pathname === link.href;
        return (
          <Link
            key={link.label + i}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100",
              active && "bg-blue-50 text-dl-primary"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
