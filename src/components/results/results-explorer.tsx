"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, ShieldAlert, Sparkles } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { BestDealCard } from "@/components/results/best-deal-card";
import { ResultCard } from "@/components/results/result-card";
import { CouponCard } from "@/components/results/coupon-card";
import { FeedbackButtons } from "@/components/results/feedback-buttons";
import { MatchBadge } from "@/components/match-badge";
import {
  bestDealResult,
  buildDemoResultsForProduct,
  demoAlternatives,
  demoCoupons,
  demoPriceResults,
  demoProduct,
  totalPrice,
} from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { DEALLENS_STORAGE_KEY } from "@/components/scan/scan-flow";
import type { VisionProductResult } from "@/lib/vision";
import type { PriceResult } from "@/lib/types";

type StoredDetectedProduct = VisionProductResult & { image: string; source: "ai" | "demo" };
export const DEALLENS_RESULTS_STORAGE_KEY = "deallens:lastResultSet";

type SortKey = "price" | "discount" | "delivery" | "match" | "reliable";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "price", label: "Laagste totaalprijs" },
  { key: "discount", label: "Hoogste korting" },
  { key: "delivery", label: "Snelste levering" },
  { key: "match", label: "Beste overeenkomst" },
  { key: "reliable", label: "Meest betrouwbaar" },
];

export function ResultsExplorer() {
  const router = useRouter();
  const [sort, setSort] = useState<SortKey>("price");
  const [onlyExact, setOnlyExact] = useState(false);
  const [onlyStock, setOnlyStock] = useState(false);
  const [onlyFreeShipping, setOnlyFreeShipping] = useState(false);
  const [onlyCoupon, setOnlyCoupon] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [detected, setDetected] = useState<StoredDetectedProduct | null>(null);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(DEALLENS_STORAGE_KEY);
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of a browser API unavailable during SSR/prerender
        setDetected(JSON.parse(raw));
      }
    } catch {
      // sessionStorage niet beschikbaar of ongeldige data; val terug op demoproduct.
    }
  }, []);

  const productDisplay = detected
    ? {
        image: detected.image,
        brand: detected.brand,
        category: detected.category,
        name: detected.name,
        color: detected.color,
        size: detected.size ?? undefined,
        confidence: detected.confidence,
      }
    : {
        image: demoProduct.image,
        brand: demoProduct.brand,
        category: demoProduct.category,
        name: demoProduct.name,
        color: demoProduct.color,
        size: demoProduct.size,
        confidence: demoProduct.confidence,
      };

  const { activeResults, activeAlternatives } = useMemo(() => {
    if (!detected) return { activeResults: demoPriceResults, activeAlternatives: demoAlternatives };
    const generated = buildDemoResultsForProduct({
      brand: detected.brand,
      name: detected.name,
      image: detected.image,
      color: detected.color,
      size: detected.size,
      category: detected.category,
      referencePrice: detected.referencePrice,
    });
    return { activeResults: generated.priceResults, activeAlternatives: generated.alternatives };
  }, [detected]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        DEALLENS_RESULTS_STORAGE_KEY,
        JSON.stringify([...activeResults, ...activeAlternatives])
      );
    } catch {
      // sessionStorage niet beschikbaar; vergelijkingspagina valt dan terug op statische demodata.
    }
  }, [activeResults, activeAlternatives]);

  const best = bestDealResult(activeResults);
  const productMsrp = detected ? best.originalPrice ?? best.price : demoProduct.msrp;

  const filtered = useMemo(() => {
    let list: PriceResult[] = [...activeResults];
    if (onlyExact) list = list.filter((r) => r.matchLabel === "exact");
    if (onlyStock) list = list.filter((r) => r.stockStatus !== "out_of_stock");
    if (onlyFreeShipping) list = list.filter((r) => r.shippingCost === 0);
    if (onlyCoupon) list = list.filter((r) => !!r.couponId);

    list.sort((a, b) => {
      switch (sort) {
        case "price":
          return totalPrice(a) - totalPrice(b);
        case "discount": {
          const da = a.originalPrice ? 1 - a.price / a.originalPrice : 0;
          const db = b.originalPrice ? 1 - b.price / b.originalPrice : 0;
          return db - da;
        }
        case "delivery":
          return a.deliveryEstimate.localeCompare(b.deliveryEstimate);
        case "match":
          return b.matchConfidence - a.matchConfidence;
        case "reliable":
          return b.matchConfidence - a.matchConfidence;
        default:
          return 0;
      }
    });
    return list;
  }, [activeResults, sort, onlyExact, onlyStock, onlyFreeShipping, onlyCoupon]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : prev.length >= 4 ? prev : [...prev, id]
    );
  };

  return (
    <div className="pb-24 md:pb-0">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div className="hidden lg:block">
          <FiltersPanel
            onlyExact={onlyExact}
            setOnlyExact={setOnlyExact}
            onlyStock={onlyStock}
            setOnlyStock={setOnlyStock}
            onlyFreeShipping={onlyFreeShipping}
            setOnlyFreeShipping={setOnlyFreeShipping}
            onlyCoupon={onlyCoupon}
            setOnlyCoupon={setOnlyCoupon}
          />
        </div>

        <div>
          {detected && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-xs text-dl-primary">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <p>
                Dit product is herkend door de vision-AI op basis van jouw geüploade screenshot. De
                prijzen, webshops en kortingscodes hieronder zijn nog voorbeelddata totdat er live
                shopping-bronnen zijn gekoppeld.
              </p>
            </div>
          )}
          <Card className="mb-6">
            <CardBody className="grid gap-4 md:grid-cols-[160px_1fr_auto]">
              <img
                src={productDisplay.image}
                alt={productDisplay.name}
                className="h-32 w-full rounded-xl object-cover md:h-full"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {productDisplay.brand} · {productDisplay.category}
                  {detected && (
                    <Badge tone="blue" className="ml-2 normal-case">
                      AI-analyse
                    </Badge>
                  )}
                </p>
                <h1 className="text-xl font-bold text-dl-text">{productDisplay.name}</h1>
                <p className="text-sm text-slate-500">
                  {productDisplay.color}
                  {productDisplay.size ? ` · Maat ${productDisplay.size}` : ""}
                </p>
                <p className="mt-1 text-sm font-medium text-dl-green">
                  Herkenningsscore: {productDisplay.confidence}%
                </p>
              </div>
              <div className="flex items-start md:items-center">
                <ButtonLink href="/scan" variant="outline" size="sm">
                  <Pencil className="h-4 w-4" /> Productgegevens aanpassen
                </ButtonLink>
              </div>
            </CardBody>
          </Card>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 lg:hidden">
              <label className="inline-flex items-center gap-1.5 rounded-full border border-dl-border bg-white px-3 py-1.5 text-xs">
                <input type="checkbox" checked={onlyExact} onChange={(e) => setOnlyExact(e.target.checked)} className="accent-dl-primary" />
                Alleen exacte matches
              </label>
              <label className="inline-flex items-center gap-1.5 rounded-full border border-dl-border bg-white px-3 py-1.5 text-xs">
                <input type="checkbox" checked={onlyStock} onChange={(e) => setOnlyStock(e.target.checked)} className="accent-dl-primary" />
                Alleen op voorraad
              </label>
            </div>
            <label className="ml-auto flex items-center gap-2 text-sm text-slate-600">
              Sorteer op
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-lg border border-dl-border bg-white px-2 py-1.5 text-sm"
              >
                {sortOptions.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <BestDealCard result={best} msrp={productMsrp} />

          <div className="mt-6 space-y-4">
            {filtered
              .filter((r) => r.id !== best.id)
              .map((r) => (
                <ResultCard
                  key={r.id}
                  result={r}
                  compareChecked={compareIds.includes(r.id)}
                  compareDisabled={compareIds.length >= 4}
                  onToggleCompare={() => toggleCompare(r.id)}
                />
              ))}
            {filtered.length === 0 && (
              <Card>
                <CardBody className="text-center text-sm text-slate-500">
                  Geen resultaten voor deze filtercombinatie. Pas je filters aan.
                </CardBody>
              </Card>
            )}
          </div>

          {compareIds.length > 0 && (
            <div className="fixed bottom-20 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full bg-dl-navy px-5 py-3 text-white shadow-xl md:bottom-6">
              <span className="text-sm">{compareIds.length} geselecteerd</span>
              <Button size="sm" onClick={() => router.push(`/compare?ids=${compareIds.join(",")}`)}>
                Vergelijk
              </Button>
            </div>
          )}

          <section className="mt-10">
            <h2 className="text-xl font-bold text-dl-navy">Kortingscodes</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {demoCoupons.map((c) => (
                <CouponCard key={c.id} coupon={c} />
              ))}
            </div>
            <p className="mt-3 flex items-start gap-1.5 text-xs text-slate-400">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              DealLens AI garandeert nooit dat een kortingscode werkt wanneer deze niet daadwerkelijk gecontroleerd
              kon worden.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-bold text-dl-navy">Goedkoopste alternatieven</h2>
            <p className="mt-1 text-sm text-slate-500">
              Het exacte product is niet overal verkrijgbaar. Onderstaande producten zijn geen exact hetzelfde
              product.
            </p>
            <div className="mt-4 space-y-4">
              {activeAlternatives.map((alt) => (
                <div key={alt.id}>
                  <div className="mb-1 flex items-center gap-2">
                    <MatchBadge label="alternative" />
                    <span className="text-xs text-slate-500">{alt.matchConfidence}% overeenkomst</span>
                  </div>
                  <ResultCard result={alt} />
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <FeedbackButtons />
          </section>

          <p className="mt-10 rounded-xl bg-slate-100 p-4 text-xs text-slate-500">
            Prijzen, voorraad en kortingscodes kunnen veranderen. Controleer de uiteindelijke prijs en voorwaarden
            altijd op de website van de aanbieder. DealLens AI verkoopt zelf geen producten, is niet verantwoordelijk
            voor wijzigingen bij webshops en kan affiliatecommissies ontvangen. Alle resultaten op deze pagina zijn
            demodata.
          </p>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center border-t border-dl-border bg-white/95 p-3 backdrop-blur md:hidden">
        <ButtonLink href={best.url} target="_blank" rel="noopener noreferrer nofollow sponsored" size="lg" className="w-full max-w-sm justify-center">
          Bekijk goedkoopste deal
        </ButtonLink>
      </div>
    </div>
  );
}

function FiltersPanel({
  onlyExact,
  setOnlyExact,
  onlyStock,
  setOnlyStock,
  onlyFreeShipping,
  setOnlyFreeShipping,
  onlyCoupon,
  setOnlyCoupon,
}: {
  onlyExact: boolean;
  setOnlyExact: (v: boolean) => void;
  onlyStock: boolean;
  setOnlyStock: (v: boolean) => void;
  onlyFreeShipping: boolean;
  setOnlyFreeShipping: (v: boolean) => void;
  onlyCoupon: boolean;
  setOnlyCoupon: (v: boolean) => void;
}) {
  return (
    <Card className="sticky top-20 p-5">
      <p className="font-semibold text-dl-text">Filters</p>
      <div className="mt-3 space-y-2 text-sm">
        <FilterCheckbox label="Alleen exacte matches" checked={onlyExact} onChange={setOnlyExact} />
        <FilterCheckbox label="Alleen op voorraad" checked={onlyStock} onChange={setOnlyStock} />
        <FilterCheckbox label="Gratis verzending" checked={onlyFreeShipping} onChange={setOnlyFreeShipping} />
        <FilterCheckbox label="Kortingscode beschikbaar" checked={onlyCoupon} onChange={setOnlyCoupon} />
      </div>
      <div className="mt-4 border-t border-dl-border pt-4 text-xs text-slate-400">
        Extra filters zoals land, kleur, maat en levertijd worden per webshopbron aangevuld zodra live data
        beschikbaar is.
      </div>
    </Card>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5", checked && "bg-blue-50")}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-dl-primary" />
      {label}
    </label>
  );
}
