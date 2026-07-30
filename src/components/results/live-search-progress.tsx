"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  "Webshops doorzoeken",
  "Prijzen vergelijken",
  "Kortingscodes controleren",
  "Beste deal berekenen",
];

const STEP_DURATION_MS = 1800;

export function LiveSearchProgress() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1 < steps.length ? i + 1 : i));
    }, STEP_DURATION_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="dl-pulse-ring absolute h-16 w-16 rounded-full bg-dl-primary/30" />
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-dl-primary text-white">
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
        </span>
      </div>
      <p className="font-semibold text-dl-navy">DealLens AI doorzoekt het web naar de beste deal…</p>
      <ul className="mx-auto mt-2 w-full max-w-xs space-y-2 text-left" aria-live="polite">
        {steps.map((label, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <li
              key={label}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active && "bg-blue-50 font-semibold text-dl-primary",
                done && "text-slate-400"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                  done && "border-dl-green bg-dl-green text-white",
                  active && "border-dl-primary text-dl-primary",
                  !done && !active && "border-dl-border text-slate-300"
                )}
              >
                {done ? <Check className="h-3 w-3" /> : active ? <Loader2 className="h-3 w-3 animate-spin" /> : i + 1}
              </span>
              {label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
