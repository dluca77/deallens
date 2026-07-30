import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { couponDiscountAmount, couponForResult, demoCoupons, demoRetailers, totalPrice } from "@/lib/demo-data";
import type { CouponCode, PriceResult, Retailer } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function BestDealCard({
  result,
  msrp,
  retailers = demoRetailers,
  coupons = demoCoupons,
}: {
  result: PriceResult;
  msrp: number;
  retailers?: Retailer[];
  coupons?: CouponCode[];
}) {
  const retailer = retailers.find((r) => r.id === result.retailerId);
  const coupon = couponForResult(result, coupons);
  const discount = couponDiscountAmount(result, coupons);
  const total = totalPrice(result, coupons);
  const savings = Math.round((msrp - total) * 100) / 100;

  return (
    <div className="rounded-3xl border-2 border-dl-green bg-white p-6 shadow-lg shadow-green-900/5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge tone="green" className="text-sm">
          <Sparkles className="h-3.5 w-3.5" /> Beste deal
        </Badge>
        <span className="text-sm font-medium text-slate-500">
          bij {retailer?.name ?? "onbekende webshop"}
          {result.isLive && (
            <Badge tone="blue" className="ml-2">
              Live gevonden
            </Badge>
          )}
        </span>
      </div>

      <div className="mt-4 grid gap-6 sm:grid-cols-[140px_1fr]">
        <img src={result.productImage} alt={result.productName} className="h-32 w-32 rounded-xl object-cover" />
        <div>
          <p className="font-semibold text-dl-text">{result.productName}</p>
          <dl className="mt-3 grid grid-cols-2 gap-y-1.5 text-sm">
            <dt className="text-slate-500">Normale verkoopprijs</dt>
            <dd className="text-right text-slate-400 line-through">{formatPrice(msrp)}</dd>
            <dt className="text-slate-500">Aanbiedingsprijs</dt>
            <dd className="text-right font-medium text-dl-text">{formatPrice(result.price)}</dd>
            {coupon && (
              <>
                <dt className="text-slate-500">Kortingscode</dt>
                <dd className="text-right font-mono font-medium text-dl-primary">{coupon.code}</dd>
                <dt className="text-slate-500">Extra korting</dt>
                <dd className="text-right font-medium text-dl-green">-{formatPrice(discount)}</dd>
              </>
            )}
            <dt className="text-slate-500">Verzendkosten</dt>
            <dd className="text-right font-medium text-dl-text">
              {result.shippingCost === 0 ? "Gratis" : formatPrice(result.shippingCost)}
            </dd>
            <dt className="font-semibold text-dl-text">Eindprijs</dt>
            <dd className="text-right text-lg font-bold text-dl-text">{formatPrice(total)}</dd>
          </dl>
          <p className="mt-3 text-sm font-semibold text-dl-green">Je bespaart {formatPrice(Math.max(0, savings))}</p>
        </div>
      </div>

      <ButtonLink
        href={result.url}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        size="lg"
        className="mt-5 w-full justify-center"
      >
        Bekijk deal
      </ButtonLink>
    </div>
  );
}
