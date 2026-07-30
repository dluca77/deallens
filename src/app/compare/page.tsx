"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardBody } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { MatchBadge } from "@/components/match-badge";
import {
  couponForResult,
  demoAlternatives,
  demoCoupons,
  demoPriceResults,
  demoRetailers,
  totalPrice,
} from "@/lib/demo-data";
import {
  DEALLENS_COUPONS_STORAGE_KEY,
  DEALLENS_RESULTS_STORAGE_KEY,
  DEALLENS_RETAILERS_STORAGE_KEY,
} from "@/components/results/results-explorer";
import type { CouponCode, PriceResult, Retailer } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function ComparePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1 bg-dl-bg">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
          <h1 className="text-2xl font-bold text-dl-navy">Resultaten vergelijken</h1>
          <p className="mt-1 text-sm text-slate-500">
            Vergelijk tot vier resultaten naast elkaar op prijs, verzending, levertijd en betrouwbaarheid.
          </p>
          <Suspense fallback={null}>
            <CompareTable />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function CompareTable() {
  const searchParams = useSearchParams();
  const ids = searchParams.get("ids");
  const [pool, setPool] = useState<PriceResult[]>([...demoPriceResults, ...demoAlternatives]);
  const [retailers, setRetailers] = useState<Retailer[]>(demoRetailers);
  const [coupons, setCoupons] = useState<CouponCode[]>(demoCoupons);

  useEffect(() => {
    try {
      const rawResults = window.sessionStorage.getItem(DEALLENS_RESULTS_STORAGE_KEY);
      if (rawResults) {
        const stored = JSON.parse(rawResults) as PriceResult[];
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of a browser API unavailable during SSR/prerender
        setPool((prev) => [...stored, ...prev]);
      }
      const rawRetailers = window.sessionStorage.getItem(DEALLENS_RETAILERS_STORAGE_KEY);
      if (rawRetailers) {
        const stored = JSON.parse(rawRetailers) as Retailer[];
        setRetailers((prev) => [...stored, ...prev]);
      }
      const rawCoupons = window.sessionStorage.getItem(DEALLENS_COUPONS_STORAGE_KEY);
      if (rawCoupons) {
        const stored = JSON.parse(rawCoupons) as CouponCode[];
        setCoupons((prev) => [...stored, ...prev]);
      }
    } catch {
      // sessionStorage niet beschikbaar; val terug op de statische demodata.
    }
  }, []);

  const requested = ids ? ids.split(",").filter(Boolean) : [];
  const selected = requested.length
    ? requested.map((id) => pool.find((r) => r.id === id)).filter((r): r is PriceResult => !!r)
    : pool.slice(0, 3);

  const rows: { label: string; render: (r: PriceResult) => React.ReactNode }[] = [
    { label: "Webshop", render: (r) => retailers.find((x) => x.id === r.retailerId)?.name ?? "Onbekend" },
    { label: "Prijs", render: (r) => formatPrice(r.price) },
    {
      label: "Korting",
      render: (r) => {
        const c = couponForResult(r, coupons);
        return c ? `${c.code} (${c.value})` : "Geen kortingscode";
      },
    },
    { label: "Verzendkosten", render: (r) => (r.shippingCost === 0 ? "Gratis" : formatPrice(r.shippingCost)) },
    { label: "Totaalprijs", render: (r) => formatPrice(totalPrice(r, coupons)) },
    { label: "Levertijd", render: (r) => r.deliveryEstimate },
    { label: "Variant", render: (r) => r.variants.join(", ") },
    { label: "Betrouwbaarheid match", render: (r) => `${r.matchConfidence}%` },
    {
      label: "Webshopbeoordeling",
      render: (r) => {
        const rating = retailers.find((x) => x.id === r.retailerId)?.rating;
        return rating ? `${rating}/5` : "Onbekend";
      },
    },
    { label: "Retourvoorwaarden", render: () => "30 dagen bedenktijd (voorbeeld)" },
  ];

  if (selected.length === 0) {
    return (
      <Card className="mt-6">
        <CardBody className="text-center text-sm text-slate-500">
          Geen resultaten geselecteerd.{" "}
          <Link href="/results" className="text-dl-primary underline">
            Ga terug naar de resultaten
          </Link>{" "}
          om producten te selecteren.
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[640px] border-separate border-spacing-0 overflow-hidden rounded-2xl border border-dl-border bg-white text-sm">
        <thead>
          <tr>
            <th className="w-40 border-b border-dl-border bg-slate-50 p-4 text-left font-semibold text-slate-500">
              Kenmerk
            </th>
            {selected.map((r) => (
              <th key={r.id} className="border-b border-dl-border p-4 text-left align-top">
                <img src={r.productImage} alt={r.productName} className="h-16 w-16 rounded-lg object-cover" />
                <p className="mt-2 font-semibold text-dl-text">{r.productName}</p>
                <MatchBadge label={r.matchLabel} className="mt-1" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th className="border-b border-dl-border bg-slate-50 p-4 text-left font-medium text-slate-500">
                {row.label}
              </th>
              {selected.map((r) => (
                <td key={r.id} className="border-b border-dl-border p-4 text-dl-text">
                  {row.render(r)}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <th className="p-4 text-left font-medium text-slate-500">Actie</th>
            {selected.map((r) => (
              <td key={r.id} className="p-4">
                <ButtonLink href={r.url} target="_blank" rel="noopener noreferrer nofollow sponsored" size="sm">
                  Naar webshop
                </ButtonLink>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
