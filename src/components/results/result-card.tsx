"use client";

import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MatchBadge } from "@/components/match-badge";
import {
  couponDiscountAmount,
  couponForResult,
  demoCoupons,
  demoRetailers,
  totalPrice,
} from "@/lib/demo-data";
import type { CouponCode, PriceResult, Retailer } from "@/lib/types";
import { formatPrice, formatRelativeTime } from "@/lib/utils";

const stockText: Record<PriceResult["stockStatus"], string> = {
  in_stock: "Op voorraad",
  low_stock: "Bijna uitverkocht",
  out_of_stock: "Uitverkocht",
};

const stockTone: Record<PriceResult["stockStatus"], "green" | "amber" | "red"> = {
  in_stock: "green",
  low_stock: "amber",
  out_of_stock: "red",
};

export function ResultCard({
  result,
  highlight,
  compareChecked,
  onToggleCompare,
  compareDisabled,
  retailers = demoRetailers,
  coupons = demoCoupons,
}: {
  result: PriceResult;
  highlight?: boolean;
  compareChecked?: boolean;
  onToggleCompare?: () => void;
  compareDisabled?: boolean;
  retailers?: Retailer[];
  coupons?: CouponCode[];
}) {
  const retailer = retailers.find((r) => r.id === result.retailerId);
  const coupon = couponForResult(result, coupons);
  const discount = couponDiscountAmount(result, coupons);
  const total = totalPrice(result, coupons);
  const discountPct = result.originalPrice
    ? Math.round((1 - result.price / result.originalPrice) * 100)
    : 0;

  return (
    <Card className={highlight ? "border-dl-primary ring-1 ring-dl-primary/30" : undefined}>
      <div className="flex flex-col gap-4 p-5 sm:flex-row">
        <img
          src={result.productImage}
          alt={result.productName}
          className="h-28 w-28 shrink-0 self-center rounded-xl object-cover sm:self-start"
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: retailer?.logoColor ?? "#667085" }}
              aria-hidden
            >
              {retailer?.logoInitial ?? "?"}
            </span>
            <span className="text-sm font-semibold text-dl-text">{retailer?.name ?? "Onbekende webshop"}</span>
            {retailer?.country && retailer.country !== "—" && (
              <span className="text-xs text-slate-400">· {retailer.country}</span>
            )}
            {result.sponsored && <Badge tone="amber">Gesponsord</Badge>}
            {result.isLive && <Badge tone="blue">Live gevonden</Badge>}
            <MatchBadge label={result.matchLabel} />
          </div>

          <p className="mt-2 font-medium text-dl-text">{result.productName}</p>
          <p className="mt-0.5 text-xs text-slate-500">{result.matchReason} · {result.matchConfidence}% match</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span>Verzending: {result.shippingCost === 0 ? "Gratis" : formatPrice(result.shippingCost)}</span>
            <span>Levertijd: {result.deliveryEstimate}</span>
            <Badge tone={stockTone[result.stockStatus]} className="!py-0.5">
              {stockText[result.stockStatus]}
            </Badge>
            <span>Varianten: {result.variants.join(", ")}</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Prijs gecontroleerd {formatRelativeTime(result.lastChecked)}</p>

          {coupon && (
            <p className="mt-2 text-xs font-medium text-dl-green">
              Kortingscode {coupon.code} toegepast: -{formatPrice(discount)}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end justify-between gap-3 sm:w-40">
          <div className="text-right">
            {result.originalPrice && (
              <p className="text-xs text-slate-400 line-through">{formatPrice(result.originalPrice)}</p>
            )}
            <p className="text-xl font-bold text-dl-text">{formatPrice(result.price)}</p>
            {discountPct > 0 && <Badge tone="green">-{discountPct}%</Badge>}
            <p className="mt-1 text-xs text-slate-500">Totaal: <span className="font-semibold text-dl-navy">{formatPrice(total)}</span></p>
          </div>
          <ButtonLink href={result.url} target="_blank" rel="noopener noreferrer nofollow sponsored" size="sm" className="w-full justify-center">
            Naar webshop <ExternalLink className="h-3.5 w-3.5" />
          </ButtonLink>
          {onToggleCompare && (
            <label className="flex items-center gap-1.5 text-xs text-slate-500">
              <input
                type="checkbox"
                checked={!!compareChecked}
                disabled={compareDisabled && !compareChecked}
                onChange={onToggleCompare}
                className="h-3.5 w-3.5 accent-dl-primary"
              />
              Vergelijken
            </label>
          )}
        </div>
      </div>
    </Card>
  );
}
