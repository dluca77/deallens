"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Bell, Minus, Search, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { demoSavedProducts } from "@/lib/demo-data";
import { formatPrice, formatRelativeTime } from "@/lib/utils";

const changeConfig = {
  down: { icon: ArrowDown, text: "Prijs is gedaald", tone: "text-dl-green" },
  up: { icon: ArrowUp, text: "Prijs is gestegen", tone: "text-dl-error" },
  none: { icon: Minus, text: "Prijs ongewijzigd", tone: "text-slate-400" },
} as const;

export default function SavedPage() {
  const [items, setItems] = useState(demoSavedProducts);

  return (
    <div>
      <h1 className="text-2xl font-bold text-dl-navy">Opgeslagen producten</h1>
      <p className="mt-1 text-sm text-slate-500">Producten die je met het harticoon hebt opgeslagen.</p>

      {items.length === 0 ? (
        <Card className="mt-6 p-8 text-center text-sm text-slate-500">
          Je hebt nog geen producten opgeslagen. Sla een resultaat op met het harticoon om het hier terug te vinden.
        </Card>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const change = changeConfig[item.priceChange];
            const ChangeIcon = change.icon;
            return (
              <Card key={item.id} className="p-4">
                <img src={item.image} alt={item.productName} className="h-32 w-full rounded-lg object-cover" />
                <p className="mt-3 text-sm font-semibold text-dl-text">{item.productName}</p>
                <p className="mt-1 text-lg font-bold text-dl-text">{formatPrice(item.lowestPrice)}</p>
                <p className={`flex items-center gap-1 text-xs ${change.tone}`}>
                  <ChangeIcon className="h-3.5 w-3.5" /> {change.text}
                </p>
                <p className="text-xs text-slate-400">Opgeslagen {formatRelativeTime(item.savedAt)}</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <Button size="sm" variant="outline" className="justify-center" title="Prijsalert instellen">
                    <Bell className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" className="justify-center" title="Opnieuw zoeken">
                    <Search className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="justify-center"
                    title="Verwijderen"
                    onClick={() => setItems((prev) => prev.filter((p) => p.id !== item.id))}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
