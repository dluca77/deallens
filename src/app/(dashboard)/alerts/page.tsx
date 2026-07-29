"use client";

import { useState } from "react";
import { Bell, Mail, MonitorSmartphone, Smartphone } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { demoPriceAlerts } from "@/lib/demo-data";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

const typeLabels: Record<string, string> = {
  any_drop: "Waarschuw mij bij iedere prijsdaling",
  below_amount: "Waarschuw mij onder een bepaald bedrag",
  new_coupon: "Waarschuw mij wanneer er een nieuwe kortingscode is",
  back_in_stock: "Waarschuw mij wanneer het product weer op voorraad is",
};

const channelIcons = { email: Mail, push: Smartphone, dashboard: MonitorSmartphone };

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(demoPriceAlerts);
  const [showForm, setShowForm] = useState(false);
  const [consent, setConsent] = useState(false);
  const [type, setType] = useState<keyof typeof typeLabels>("below_amount");
  const [threshold, setThreshold] = useState(100);

  const toggleActive = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dl-navy">Prijsalerts</h1>
          <p className="mt-1 text-sm text-slate-500">Krijg een melding zodra de prijs of een kortingscode verandert.</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? "Sluiten" : "Nieuwe alert"}</Button>
      </div>

      {showForm && (
        <Card className="mt-4">
          <CardBody>
            <p className="font-semibold text-dl-text">Nieuwe prijsalert instellen</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {Object.entries(typeLabels).map(([key, label]) => (
                <label
                  key={key}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-xl border border-dl-border px-3 py-2.5 text-sm",
                    type === key && "border-dl-primary bg-blue-50"
                  )}
                >
                  <input
                    type="radio"
                    name="alert-type"
                    checked={type === key}
                    onChange={() => setType(key as keyof typeof typeLabels)}
                    className="accent-dl-primary"
                  />
                  {label}
                </label>
              ))}
            </div>

            {type === "below_amount" && (
              <div className="mt-4">
                <label htmlFor="threshold" className="text-sm text-slate-600">
                  Stuur mij een melding wanneer de totaalprijs lager is dan
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm">€</span>
                  <input
                    id="threshold"
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-32 rounded-lg border border-dl-border px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 accent-dl-primary"
                />
                Ik geef toestemming om meldingen te ontvangen via e-mail, pushnotificatie en/of het dashboard.
              </label>
            </div>

            <Button className="mt-4" disabled={!consent} onClick={() => setShowForm(false)}>
              <Bell className="h-4 w-4" /> Alert instellen
            </Button>
          </CardBody>
        </Card>
      )}

      <div className="mt-6 space-y-3">
        {alerts.map((alert) => (
          <Card key={alert.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <img src={alert.image} alt={alert.productName} className="h-14 w-14 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-dl-text">{alert.productName}</p>
              <p className="text-xs text-slate-500">
                {typeLabels[alert.type]}
                {alert.type === "below_amount" && alert.threshold ? ` (${formatPrice(alert.threshold)})` : ""}
              </p>
              <div className="mt-1 flex gap-2">
                {alert.channels.map((c) => {
                  const Icon = channelIcons[c];
                  return (
                    <span key={c} className="flex items-center gap-1 text-xs text-slate-400">
                      <Icon className="h-3 w-3" /> {c}
                    </span>
                  );
                })}
              </div>
            </div>
            <Badge tone={alert.active ? "green" : "gray"}>{alert.active ? "Actief" : "Gepauzeerd"}</Badge>
            <Button size="sm" variant="outline" onClick={() => toggleActive(alert.id)}>
              {alert.active ? "Pauzeren" : "Activeren"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
