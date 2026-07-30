"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#hoe-het-werkt", label: "Hoe het werkt" },
  { href: "/#voorbeelden", label: "Voorbeelden" },
  { href: "/pricing", label: "Abonnementen" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-dl-border bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="DealLens AI" className="h-7 w-auto md:h-8" />
        </Link>

        <nav aria-label="Hoofdnavigatie" className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-slate-600 hover:text-dl-primary",
                pathname === link.href && "text-dl-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ButtonLink href="/login" variant="ghost" size="sm">
            Inloggen
          </ButtonLink>
          <ButtonLink href="/scan" variant="primary" size="sm">
            Upload een screenshot
          </ButtonLink>
        </div>

        <button
          className="rounded-lg p-2 text-dl-navy md:hidden"
          aria-label={open ? "Sluit menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-dl-border bg-white px-4 py-4 md:hidden">
          <nav aria-label="Mobiele navigatie" className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-slate-700"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700">
              Inloggen
            </Link>
            <ButtonLink href="/scan" variant="primary" size="md" className="mt-1 justify-center">
              Upload een screenshot
            </ButtonLink>
          </nav>
        </div>
      )}
    </header>
  );
}
