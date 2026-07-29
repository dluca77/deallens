import {
  BarChart3,
  Gauge,
  MousePointerClick,
  ShieldAlert,
  Wallet,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { couponStatusText } from "@/lib/types";
import {
  demoAdminStats,
  demoCoupons,
  demoRetailers,
  demoSearchHistory,
} from "@/lib/demo-data";
import { formatPrice, formatRelativeTime } from "@/lib/utils";

export const metadata = { title: "Admin – DealLens AI" };

const statCards = [
  { icon: Gauge, label: "Aantal scans", value: demoAdminStats.totalScans.toLocaleString("nl-NL") },
  { icon: BarChart3, label: "Herkenningspercentage", value: `${demoAdminStats.recognitionRate}%` },
  { icon: MousePointerClick, label: "Klikratio naar webshops", value: `${demoAdminStats.clickThroughRate}%` },
  { icon: Wallet, label: "Gemiddelde besparing", value: formatPrice(demoAdminStats.averageSavings) },
];

export default function AdminPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1 bg-dl-bg py-10">
        <div className="mx-auto max-w-6xl space-y-8 px-4 md:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-dl-navy">Admin-dashboard</h1>
              <p className="text-sm text-slate-500">Afgeschermde beheerdersomgeving · alle cijfers zijn demodata</p>
            </div>
            <Badge tone="navy">Beheerder</Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((s) => {
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

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <p className="font-semibold text-dl-text">Meest gezochte categorieën</p>
              </CardHeader>
              <CardBody className="space-y-3">
                {demoAdminStats.topCategories.map((c) => (
                  <div key={c.name}>
                    <div className="flex justify-between text-sm">
                      <span className="text-dl-text">{c.name}</span>
                      <span className="text-slate-500">{c.share}%</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-dl-primary" style={{ width: `${c.share}%` }} />
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <p className="font-semibold text-dl-text">Populairste webshops</p>
              </CardHeader>
              <CardBody className="space-y-3">
                {demoAdminStats.topRetailers.map((r) => (
                  <div key={r.name} className="flex items-center justify-between text-sm">
                    <span className="text-dl-text">{r.name}</span>
                    <span className="text-slate-500">{r.clicks.toLocaleString("nl-NL")} kliks</span>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <p className="font-semibold text-dl-text">Kortingscodes beheren</p>
              <Button size="sm" variant="outline">
                Nieuwe code toevoegen
              </Button>
            </CardHeader>
            <CardBody className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-slate-400">
                    <th className="pb-2">Code</th>
                    <th className="pb-2">Webshop</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Succespercentage</th>
                    <th className="pb-2">Laatst gecontroleerd</th>
                  </tr>
                </thead>
                <tbody>
                  {demoCoupons.map((c) => (
                    <tr key={c.id} className="border-t border-dl-border">
                      <td className="py-2 font-mono">{c.code}</td>
                      <td className="py-2">{demoRetailers.find((r) => r.id === c.retailerId)?.name}</td>
                      <td className="py-2">
                        <Badge tone="gray">{couponStatusText[c.status]}</Badge>
                      </td>
                      <td className="py-2">{c.successRate}%</td>
                      <td className="py-2 text-slate-500">{formatRelativeTime(c.lastChecked)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <p className="font-semibold text-dl-text">Webshops &amp; affiliatepartners</p>
              </CardHeader>
              <CardBody className="space-y-3">
                {demoRetailers.map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ backgroundColor: r.logoColor }}
                      >
                        {r.logoInitial}
                      </span>
                      {r.name} <span className="text-xs text-slate-400">({r.country})</span>
                    </div>
                    <Badge tone="green">Actief</Badge>
                  </div>
                ))}
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-dl-error" />
                <p className="font-semibold text-dl-text">Foutieve matches &amp; feedback</p>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-slate-600">
                  {demoAdminStats.falseMatches} matches zijn door gebruikers gemarkeerd als incorrect deze maand.
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {demoAdminStats.successfulCoupons} kortingscodes zijn bevestigd werkend.
                </p>
                <Button size="sm" variant="outline" className="mt-3">
                  Bekijk feedbackrapport
                </Button>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <p className="font-semibold text-dl-text">Recente zoekopdrachten (alle gebruikers)</p>
            </CardHeader>
            <CardBody className="space-y-2">
              {demoSearchHistory.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <span className="text-dl-text">{s.productName}</span>
                  <span className="text-slate-400">{formatRelativeTime(s.date)}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
