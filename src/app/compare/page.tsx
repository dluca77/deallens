import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardBody } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { MatchBadge } from "@/components/match-badge";
import {
  couponForResult,
  demoAlternatives,
  demoPriceResults,
  demoRetailers,
  totalPrice,
} from "@/lib/demo-data";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "Vergelijken – DealLens AI",
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids } = await searchParams;
  const requested = ids ? ids.split(",").filter(Boolean) : [];
  const allResults = [...demoPriceResults, ...demoAlternatives];
  const selected = requested.length
    ? allResults.filter((r) => requested.includes(r.id))
    : demoPriceResults.slice(0, 3);

  const rows: { label: string; render: (r: (typeof selected)[number]) => React.ReactNode }[] = [
    { label: "Webshop", render: (r) => demoRetailers.find((x) => x.id === r.retailerId)?.name },
    { label: "Prijs", render: (r) => formatPrice(r.price) },
    {
      label: "Korting",
      render: (r) => {
        const c = couponForResult(r);
        return c ? `${c.code} (${c.value})` : "Geen kortingscode";
      },
    },
    { label: "Verzendkosten", render: (r) => (r.shippingCost === 0 ? "Gratis" : formatPrice(r.shippingCost)) },
    { label: "Totaalprijs", render: (r) => formatPrice(totalPrice(r)) },
    { label: "Levertijd", render: (r) => r.deliveryEstimate },
    { label: "Variant", render: (r) => r.variants.join(", ") },
    { label: "Betrouwbaarheid match", render: (r) => `${r.matchConfidence}%` },
    { label: "Webshopbeoordeling", render: (r) => `${demoRetailers.find((x) => x.id === r.retailerId)?.rating}/5` },
    { label: "Retourvoorwaarden", render: () => "30 dagen bedenktijd (voorbeeld)" },
  ];

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1 bg-dl-bg">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
          <h1 className="text-2xl font-bold text-dl-navy">Resultaten vergelijken</h1>
          <p className="mt-1 text-sm text-slate-500">
            Vergelijk tot vier resultaten naast elkaar op prijs, verzending, levertijd en betrouwbaarheid.
          </p>

          {selected.length === 0 ? (
            <Card className="mt-6">
              <CardBody className="text-center text-sm text-slate-500">
                Geen resultaten geselecteerd.{" "}
                <Link href="/results" className="text-dl-primary underline">
                  Ga terug naar de resultaten
                </Link>{" "}
                om producten te selecteren.
              </CardBody>
            </Card>
          ) : (
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
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
