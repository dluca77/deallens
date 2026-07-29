"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CouponCode } from "@/lib/types";
import { couponStatusText } from "@/lib/types";
import { demoRetailers } from "@/lib/demo-data";
import { formatPrice, formatRelativeTime } from "@/lib/utils";

const statusTone: Record<CouponCode["status"], "green" | "blue" | "gray" | "amber"> = {
  verified_working: "green",
  probably_working: "blue",
  not_verifiable: "gray",
  new_customers_only: "amber",
  app_only: "amber",
  newsletter_only: "amber",
};

export function CouponCard({ coupon }: { coupon: CouponCode }) {
  const [copied, setCopied] = useState(false);
  const retailer = demoRetailers.find((r) => r.id === coupon.retailerId)!;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
    } catch {
      // Klembordtoegang niet beschikbaar; code blijft zichtbaar om handmatig te kopiëren.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{retailer.name}</p>
          <p className="mt-1 font-mono text-lg font-bold text-dl-text">{coupon.code}</p>
        </div>
        <Badge tone={statusTone[coupon.status]}>{couponStatusText[coupon.status]}</Badge>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-500">
        <dt>Korting</dt>
        <dd className="text-right font-medium text-dl-text">{coupon.value}</dd>
        {coupon.minOrderValue && (
          <>
            <dt>Min. bestelwaarde</dt>
            <dd className="text-right font-medium text-dl-text">{formatPrice(coupon.minOrderValue)}</dd>
          </>
        )}
        {coupon.expiresAt && (
          <>
            <dt>Vervaldatum</dt>
            <dd className="text-right font-medium text-dl-text">
              {new Date(coupon.expiresAt).toLocaleDateString("nl-NL")}
            </dd>
          </>
        )}
        <dt>Laatst gecontroleerd</dt>
        <dd className="text-right font-medium text-dl-text">{formatRelativeTime(coupon.lastChecked)}</dd>
        {coupon.successRate > 0 && (
          <>
            <dt>Succespercentage</dt>
            <dd className="text-right font-medium text-dl-text">{coupon.successRate}%</dd>
          </>
        )}
      </dl>

      <Button size="sm" variant={copied ? "primary" : "outline"} className="mt-4 w-full justify-center" onClick={onCopy}>
        {copied ? (
          <>
            <Check className="h-4 w-4" /> Gekopieerd
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" /> Kopieer code
          </>
        )}
      </Button>
    </Card>
  );
}
