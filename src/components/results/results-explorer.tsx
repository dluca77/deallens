"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, SearchCheck, ShieldAlert, Sparkles, TriangleAlert } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { BestDealCard } from "@/components/results/best-deal-card";
import { ResultCard } from "@/components/results/result-card";
import { CouponCard } from "@/components/results/coupon-card";
import { LiveSearchProgress } from "@/components/results/live-search-progress";
import { FeedbackButtons } from "@/components/results/feedback-buttons";
import { MatchBadge } from "@/components/match-badge";
import {
  bestDealResult,
  buildDemoResultsForProduct,
  demoAlternatives,
  demoCoupons,
  demoPriceResults,
  demoProduct,
  demoRetailers,
  totalPrice,
} from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { DEALLENS_STORAGE_KEY } from "@/components/scan/scan-flow";
import type { VisionProductResult } from "@/lib/vision";
import type { CouponCode, PriceResult, Retailer } from "@/lib/types";

type StoredDetectedProduct = VisionProductResult & { image: string; source: "ai" | "demo" };
export const DEALLENS_RESULTS_STORAGE_KEY = "deallens:lastResultSet";
export const DEALLENS_RETAILERS_STORAGE_KEY = "deallens:lastRetailers";
export const DEALLENS_COUPONS_STORAGE_KEY = "deallens:lastCoupons";

type SortKey = "price" | "discount" | "delivery" | "match" | "reliable";
type SearchStatus = "idle" | "loading" | "success" | "empty" | "error";

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
  const [searchStatus, setSearchStatus] = useState<SearchStatus>("idle");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [liveRetailers, setLiveRetailers] = useState<Retailer[]>([]);
  const [livePriceResults, setLivePriceResults] = useState<PriceResult[]>([]);
  const [liveCoupons, setLiveCoupons] = useState<CouponCode[]>([]);

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

  useEffect(() => {
    if (!detected || detected.source !== "ai") return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kicks off an async fetch triggered by a prop change, not derivable during render
    setSearchStatus("loading");
    setSearchError(null);

    fetch("/api/search-prices", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        brand: detected.brand,
        name: detected.name,
        color: detected.color,
        size: detected.size,
        category: detected.category,
        referencePrice: detected.referencePrice,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (cancelled) return;
        if (!response.ok) {
          setSearchStatus("error");
          setSearchError(data.error ?? "Live prijzen zoeken is mislukt.");
          return;
        }
        if (!data.priceResults || data.priceResults.length === 0) {
          setSearchStatus("empty");
          return;
        }
        const withImages: PriceResult[] = data.priceResults.map((r: PriceResult) => ({
          ...r,
          productImage: r.productImage || detected.image,
        }));
        setLiveRetailers(data.retailers ?? []);
        setLivePriceResults(withImages);
        setLiveCoupons(data.coupons ?? []);
        setSearchStatus("success");
      })
      .catch(() => {
        if (!cancelled) {
          setSearchStatus("error");
          setSearchError("Er ging iets mis bij het zoeken naar actuele prijzen.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [detected]);

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

  const isLive = searchStatus === "success" && livePriceResults.length > 0;
  // Terwijl de live zoekopdracht nog loopt mag er geen (voorbeeld)data getoond worden —
  // anders zie je eerst kortingscodes van "Webshop A/B/C" verschijnen voordat de echte
  // resultaten binnen zijn.
  const isSearching = detected?.source === "ai" && searchStatus === "loading";

  const { activeResults, activeAlternatives, activeRetailers, activeCoupons } = useMemo(() => {
    if (isSearching) {
      return {
        activeResults: [] as PriceResult[],
        activeAlternatives: [] as PriceResult[],
        activeRetailers: [] as Retailer[],
        activeCoupons: [] as CouponCode[],
      };
    }
    if (isLive) {
      return {
        activeResults: livePriceResults,
        activeAlternatives: [] as PriceResult[],
        activeRetailers: [...demoRetailers, ...liveRetailers],
        activeCoupons: liveCoupons,
      };
    }
    if (!detected) {
      return {
        activeResults: demoPriceResults,
        activeAlternatives: demoAlternatives,
        activeRetailers: demoRetailers,
        activeCoupons: demoCoupons,
      };
    }
    const generated = buildDemoResultsForProduct({
      brand: detected.brand,
      name: detected.name,
      image: detected.image,
      color: detected.color,
      size: detected.size,
      category: detected.category,
      referencePrice: detected.referencePrice,
    });
    return {
      activeResults: generated.priceResults,
      activeAlternatives: generated.alternatives,
      activeRetailers: demoRetailers,
      activeCoupons: demoCoupons,
    };
  }, [isSearching, isLive, livePriceResults, liveRetailers, liveCoupons, detected]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        DEALLENS_RESULTS_STORAGE_KEY,
        JSON.stringify([...activeResults, ...activeAlternatives])
      );
      window.sessionStorage.setItem(DEALLENS_RETAILERS_STORAGE_KEY, JSON.stringify(activeRetailers));
      window.sessionStorage.setItem(DEALLENS_COUPONS_STORAGE_KEY, JSON.stringify(activeCoupons));
    } catch {
      // sessionStorage niet beschikbaar; vergelijkingspagina valt dan terug op statische demodata.
    }
  }, [activeResults, activeAlternatives, activeRetailers, activeCoupons]);

  const best = activeResults.length > 0 ? bestDealResult(activeResults, activeCoupons) : null;
  const productMsrp = detected?.referencePrice ?? (best ? best.originalPrice ?? best.price : demoProduct.msrp);

  const filtered = useMemo(() => {
    let list: PriceResult[] = [...activeResults];
    if (onlyExact) list = list.filter((r) => r.matchLabel === "exact");
    if (onlyStock) list = list.filter((r) => r.stockStatus !== "out_of_stock");
    if (onlyFreeShipping) list = list.filter((r) => r.shippingCost === 0);
    if (onlyCoupon) list = list.filter((r) => !!r.couponId);

    list.sort((a, b) => {
      switch (sort) {
        case "price":
          return totalPrice(a, activeCoupons) - totalPrice(b, activeCoupons);
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
  }, [activeResults, activeCoupons, sort, onlyExact, onlyStock, onlyFreeShipping, onlyCoupon]);

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
          {detected && searchStatus === "loading" && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-blue-50 p-3 text-xs text-dl-primary">
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
              <p>Live prijzen en kortingscodes zoeken bij webshops op basis van het herkende product…</p>
            </div>
          )}
          {isLive && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-green-50 p-3 text-xs text-dl-green">
              <SearchCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <p>
                Deze prijzen en webshops zijn live gevonden via websearch op basis van jouw geüploade screenshot.
                Kortingscodes zijn gevonden en gecontroleerd op meerdere onafhankelijke bronnen, maar nooit
                daadwerkelijk uitgeprobeerd bij het afrekenen.
              </p>
            </div>
          )}
          {detected && (searchStatus === "error" || searchStatus === "empty") && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <p>
                {searchStatus === "error"
                  ? searchError
                  : "We konden geen actuele prijzen bij webshops vinden voor dit product."}{" "}
                Onderstaande prijzen en kortingscodes zijn daarom voorbeelddata.
              </p>
            </div>
          )}
          {detected && searchStatus === "idle" && detected.source === "demo" && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-xs text-dl-primary">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <p>Dit product is handmatig ingevoerd of via een link toegevoegd. Prijzen hieronder zijn voorbeelddata.</p>
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

          {searchStatus === "loading" ? (
            <Card>
              <CardBody>
                <LiveSearchProgress />
              </CardBody>
            </Card>
          ) : (
            <>
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

              {best && (
                <BestDealCard result={best} msrp={productMsrp} retailers={activeRetailers} coupons={activeCoupons} />
              )}

              <div className="mt-6 space-y-4">
                {filtered
                  .filter((r) => r.id !== best?.id)
                  .map((r) => (
                    <ResultCard
                      key={r.id}
                      result={r}
                      retailers={activeRetailers}
                      coupons={activeCoupons}
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
            </>
          )}

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
            {isSearching ? (
              <Card className="mt-4">
                <CardBody className="flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Kortingscodes zoeken…
                </CardBody>
              </Card>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeCoupons.map((c) => (
                  <CouponCard key={c.id} coupon={c} retailers={activeRetailers} />
                ))}
                {activeCoupons.length === 0 && (
                  <Card>
                    <CardBody className="text-sm text-slate-500">
                      We hebben momenteel geen betrouwbare kortingscode voor deze webshops gevonden.
                    </CardBody>
                  </Card>
                )}
              </div>
            )}
            <p className="mt-3 flex items-start gap-1.5 text-xs text-slate-400">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              DealLens AI garandeert nooit dat een kortingscode werkt wanneer deze niet daadwerkelijk gecontroleerd
              kon worden. Codes worden niet automatisch bij het afrekenen getest, enkel gekruisverifieerd op
              meerdere bronnen.
            </p>
          </section>

          {activeAlternatives.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-bold text-dl-navy">Goedkoopste alternatieven</h2>
              <p className="mt-1 text-sm text-slate-500">
                Het exacte product is niet overal verkrijgbaar. Onderstaande producten zijn geen exact hetzelfde
                product (voorbeelddata).
              </p>
              <div className="mt-4 space-y-4">
                {activeAlternatives.map((alt) => (
                  <div key={alt.id}>
                    <div className="mb-1 flex items-center gap-2">
                      <MatchBadge label="alternative" />
                      <span className="text-xs text-slate-500">{alt.matchConfidence}% overeenkomst</span>
                    </div>
                    <ResultCard result={alt} retailers={activeRetailers} coupons={activeCoupons} />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mt-10">
            <FeedbackButtons />
          </section>

          <p className="mt-10 rounded-xl bg-slate-100 p-4 text-xs text-slate-500">
            Prijzen, voorraad en kortingscodes kunnen veranderen. Controleer de uiteindelijke prijs en voorwaarden
            altijd op de website van de aanbieder. DealLens AI verkoopt zelf geen producten, is niet verantwoordelijk
            voor wijzigingen bij webshops en kan affiliatecommissies ontvangen.{" "}
            {isLive
              ? "Deze resultaten zijn live opgezocht, maar kunnen inmiddels gewijzigd zijn."
              : "Alle resultaten op deze pagina zijn demodata."}
          </p>
        </div>
      </div>

      {best && (
        <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center border-t border-dl-border bg-white/95 p-3 backdrop-blur md:hidden">
          <ButtonLink href={best.url} target="_blank" rel="noopener noreferrer nofollow sponsored" size="lg" className="w-full max-w-sm justify-center">
            Bekijk goedkoopste deal
          </ButtonLink>
        </div>
      )}
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
