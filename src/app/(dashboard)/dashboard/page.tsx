import Link from "next/link";
import { ArrowUpRight, Bell, Heart, Search, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { demoDashboardStats, demoSearchHistory } from "@/lib/demo-data";
import { formatPrice, formatRelativeTime } from "@/lib/utils";

export const metadata = { title: "Dashboard – DealLens AI" };

const stats = [
  { icon: Search, label: "Uitgevoerde zoekopdrachten", value: demoDashboardStats.totalSearches },
  { icon: Wallet, label: "Totaal mogelijke besparing", value: formatPrice(demoDashboardStats.totalSavings) },
  { icon: Bell, label: "Actieve prijsalerts", value: demoDashboardStats.activeAlerts },
  { icon: Heart, label: "Opgeslagen deals", value: demoDashboardStats.savedDeals },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dl-navy">
          Welkom terug. Welk product wil je vandaag goedkoper vinden?
        </h1>
        <Link
          href="/scan"
          className="mt-4 flex items-center justify-between rounded-2xl border-2 border-dashed border-dl-border bg-white px-5 py-6 text-sm font-semibold text-dl-primary hover:border-dl-primary hover:bg-blue-50/40"
        >
          Upload een screenshot om een nieuwe zoekopdracht te starten
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-dl-primary">
                <Icon className="h-4 w-4" />
              </span>
              <p className="mt-3 text-2xl font-bold text-dl-text">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </Card>
          );
        })}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-dl-text">Recente zoekopdrachten</h2>
          <ButtonLink href="/history" variant="ghost" size="sm">
            Alles bekijken
          </ButtonLink>
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {demoSearchHistory.slice(0, 3).map((item) => (
            <Card key={item.id} className="p-4">
              <img src={item.image} alt={item.productName} className="h-32 w-full rounded-lg object-cover" />
              <p className="mt-3 text-sm font-semibold text-dl-text">{item.productName}</p>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-slate-400 line-through">{formatPrice(item.originalPrice)}</span>
                <span className="font-bold text-dl-green">{formatPrice(item.lowestPrice)}</span>
              </div>
              <p className="text-xs text-slate-400">{formatRelativeTime(item.date)}</p>
              <ButtonLink href="/results" size="sm" variant="outline" className="mt-3 w-full justify-center">
                Bekijk resultaten
              </ButtonLink>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
