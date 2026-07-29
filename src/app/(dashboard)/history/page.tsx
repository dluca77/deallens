import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { demoSearchHistory } from "@/lib/demo-data";
import { formatPrice, formatRelativeTime } from "@/lib/utils";

export const metadata = { title: "Zoekgeschiedenis – DealLens AI" };

export default function HistoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-dl-navy">Mijn zoekopdrachten</h1>
      <p className="mt-1 text-sm text-slate-500">Een overzicht van al je eerdere screenshot-zoekopdrachten.</p>

      <div className="mt-6 space-y-3">
        {demoSearchHistory.map((item) => (
          <Card key={item.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <img src={item.image} alt={item.productName} className="h-16 w-16 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-dl-text">{item.productName}</p>
              <p className="text-xs text-slate-400">{formatRelativeTime(item.date)}</p>
            </div>
            <div className="text-right text-sm">
              <p className="text-slate-400 line-through">{formatPrice(item.originalPrice)}</p>
              <p className="font-bold text-dl-green">{formatPrice(item.lowestPrice)}</p>
              <p className="text-xs text-slate-500">Bespaard: {formatPrice(item.savings)}</p>
            </div>
            <ButtonLink href="/results" size="sm" variant="outline">
              Resultaten bekijken
            </ButtonLink>
          </Card>
        ))}
      </div>
    </div>
  );
}
