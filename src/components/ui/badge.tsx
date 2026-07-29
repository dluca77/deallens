import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "blue" | "green" | "amber" | "red" | "gray" | "navy";

const toneClasses: Record<BadgeTone, string> = {
  blue: "bg-blue-50 text-dl-primary border-blue-100",
  green: "bg-green-50 text-dl-green border-green-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  red: "bg-red-50 text-dl-error border-red-100",
  gray: "bg-slate-100 text-slate-600 border-slate-200",
  navy: "bg-dl-navy text-white border-dl-navy",
};

export function Badge({
  tone = "gray",
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
