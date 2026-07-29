"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AccountPage() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [trainingConsent, setTrainingConsent] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dl-navy">Accountinstellingen</h1>
        <p className="mt-1 text-sm text-slate-500">Beheer je profiel, abonnement en privacyvoorkeuren.</p>
      </div>

      <Card>
        <CardHeader>
          <p className="font-semibold text-dl-text">Profiel</p>
        </CardHeader>
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-dl-text">Naam</label>
            <input defaultValue="Isaak Elia" className="mt-1 w-full rounded-lg border border-dl-border px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-dl-text">E-mailadres</label>
            <input defaultValue="isaak_elia@hotmail.nl" className="mt-1 w-full rounded-lg border border-dl-border px-3 py-2.5 text-sm" />
          </div>
          <Button size="sm" className="sm:col-span-2 sm:w-fit">
            Wijzigingen opslaan
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <p className="font-semibold text-dl-text">Abonnement</p>
          <Badge tone="gray">Gratis</Badge>
        </CardHeader>
        <CardBody className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            Je gebruikt momenteel het gratis abonnement met een beperkt aantal scans per maand.
          </p>
          <Button size="sm" variant="outline" className="shrink-0">
            Upgrade naar Pro
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <p className="font-semibold text-dl-text">Meldingen</p>
        </CardHeader>
        <CardBody className="space-y-3 text-sm">
          <label className="flex items-center justify-between">
            E-mailmeldingen over prijsalerts
            <input type="checkbox" checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} className="accent-dl-primary" />
          </label>
          <label className="flex items-center justify-between">
            Pushnotificaties
            <input type="checkbox" checked={notifPush} onChange={(e) => setNotifPush(e.target.checked)} className="accent-dl-primary" />
          </label>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <p className="font-semibold text-dl-text">Privacy &amp; gegevens</p>
        </CardHeader>
        <CardBody className="space-y-3 text-sm">
          <label className="flex items-center justify-between gap-4">
            <span>
              Sta toe dat mijn geüploade screenshots (zonder herleidbare informatie) gebruikt worden om
              DealLens AI te verbeteren
            </span>
            <input
              type="checkbox"
              checked={trainingConsent}
              onChange={(e) => setTrainingConsent(e.target.checked)}
              className="accent-dl-primary"
            />
          </label>
          <p className="text-xs text-slate-400">
            Geüploade afbeeldingen worden automatisch verwijderd na analyse, tenzij je ze opslaat bij een product.
          </p>
          <Button size="sm" variant="danger">
            Account en gegevens verwijderen
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
