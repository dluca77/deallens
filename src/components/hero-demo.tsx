"use client";

import { useEffect, useState } from "react";
import { Check, ScanSearch, Tag, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { icon: Upload, label: "Screenshot geüpload" },
  { icon: ScanSearch, label: "Nike Air Max 95 herkend" },
  { icon: Tag, label: "5 webshops vergeleken" },
  { icon: Check, label: "Beste prijs: €107,95" },
];

export function HeroDemo() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((v) => (v + 1) % steps.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="relative rounded-3xl border border-dl-border bg-white p-6 shadow-xl shadow-slate-900/5"
      aria-label="Demonstratie: van screenshot naar beste prijs"
    >
      <div className="flex items-center gap-3 border-b border-dl-border pb-4">
        <img
          src="https://placehold.co/64x64/101828/FFFFFF?text=Nike"
          alt="Voorbeeld screenshot van een sneaker in een webshop"
          className="h-14 w-14 rounded-xl object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-dl-text">Nike Air Max 95 Essential</p>
          <p className="text-xs text-slate-500">Zwart · Heren · Demo</p>
        </div>
      </div>
      <ul className="mt-4 space-y-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const state = i < active ? "done" : i === active ? "active" : "pending";
          return (
            <li
              key={step.label}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                state === "active" && "bg-blue-50",
                state === "done" && "bg-green-50/60"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-sm",
                  state === "done" && "border-dl-green bg-dl-green text-white",
                  state === "active" && "border-dl-primary bg-white text-dl-primary",
                  state === "pending" && "border-dl-border bg-white text-slate-300"
                )}
                aria-hidden
              >
                <Icon className="h-4 w-4" />
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  state === "pending" ? "text-slate-400" : "text-dl-text"
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 rounded-xl bg-dl-navy p-4 text-white">
        <p className="text-xs uppercase tracking-wide text-blue-200">Beste deal (demo)</p>
        <p className="mt-1 text-2xl font-bold">€107,95</p>
        <p className="text-xs text-green-300">Je bespaart €42,00 t.o.v. adviesprijs</p>
      </div>
    </div>
  );
}
