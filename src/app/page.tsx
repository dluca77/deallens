import Link from "next/link";
import {
  Ban,
  BadgeCheck,
  Bell,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Tags,
  Wallet,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroDemo } from "@/components/hero-demo";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

const trustItems = [
  { icon: ScanSearch, label: "AI-productherkenning" },
  { icon: Tags, label: "Prijsvergelijking" },
  { icon: BadgeCheck, label: "Kortingscodes" },
  { icon: Ban, label: "Geen verborgen kosten" },
];

const steps = [
  {
    title: "1. Upload een screenshot",
    description: "Upload een afbeelding van een product dat je online hebt gezien.",
  },
  {
    title: "2. Laat AI het product herkennen",
    description:
      "DealLens AI analyseert het merk, model, type en andere productkenmerken.",
  },
  {
    title: "3. Kies de beste deal",
    description:
      "Vergelijk prijzen, verzendkosten en kortingscodes en ga door naar de goedkoopste aanbieder.",
  },
];

const exampleCategories = [
  {
    category: "Schoenen",
    product: "Nike Air Max 95 Essential",
    original: 189.99,
    best: 107.95,
    image: "https://placehold.co/300x300/101828/FFFFFF?text=Sneakers",
  },
  {
    category: "Elektronica",
    product: "Sony WH-1000XM5 Koptelefoon",
    original: 379.0,
    best: 279.0,
    image: "https://placehold.co/300x300/172554/FFFFFF?text=Koptelefoon",
  },
  {
    category: "Meubels",
    product: "IKEA MALM Ladekast",
    original: 99.0,
    best: 89.0,
    image: "https://placehold.co/300x300/F59E0B/FFFFFF?text=Meubels",
  },
  {
    category: "Cosmetica",
    product: "The Ordinary Niacinamide Serum",
    original: 12.5,
    best: 9.95,
    image: "https://placehold.co/300x300/16A34A/FFFFFF?text=Cosmetica",
  },
  {
    category: "Kleding",
    product: "Levi's 501 Original Jeans",
    original: 109.95,
    best: 74.0,
    image: "https://placehold.co/300x300/2563EB/FFFFFF?text=Kleding",
  },
  {
    category: "Accessoires",
    product: "Ray-Ban Wayfarer Zonnebril",
    original: 154.0,
    best: 118.0,
    image: "https://placehold.co/300x300/101828/FFFFFF?text=Accessoires",
  },
  {
    category: "Speelgoed",
    product: "LEGO Technic Set",
    original: 89.99,
    best: 69.99,
    image: "https://placehold.co/300x300/DC2626/FFFFFF?text=Speelgoed",
  },
  {
    category: "Huishoudelijk",
    product: "Dyson V8 Stofzuiger",
    original: 349.0,
    best: 249.0,
    image: "https://placehold.co/300x300/172554/FFFFFF?text=Huishoudelijk",
  },
];

const benefits = [
  {
    icon: Sparkles,
    title: "Geen eindeloos zoeken",
    description: "De gebruiker hoeft niet meer handmatig verschillende webshops te openen.",
  },
  {
    icon: Wallet,
    title: "Zie de echte totaalprijs",
    description:
      "De app vergelijkt niet alleen de verkoopprijs, maar ook verzendkosten en eventuele kortingen.",
  },
  {
    icon: Tags,
    title: "Ontdek verborgen kortingscodes",
    description:
      "De app zoekt naar beschikbare kortingscodes en laat zien welke waarschijnlijk werken.",
  },
  {
    icon: ShieldCheck,
    title: "Vind alternatieven",
    description:
      "Wanneer het product uitverkocht is, toont DealLens AI vergelijkbare alternatieven.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:items-center md:px-8 md:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-dl-primary">
              <Bell className="h-3.5 w-3.5" /> Nieuw: automatische kortingscodecontrole
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-dl-navy md:text-5xl">
              Van screenshot naar de beste deal.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">
              Upload een screenshot van een product. DealLens AI herkent het product, vergelijkt
              prijzen en zoekt beschikbare kortingscodes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/scan" size="lg">
                Upload een screenshot
              </ButtonLink>
              <ButtonLink href="#hoe-het-werkt" variant="outline" size="lg">
                Bekijk hoe het werkt
              </ButtonLink>
            </div>
          </div>
          <HeroDemo />
        </section>

        <section className="border-y border-dl-border bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4 md:px-8">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-dl-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-sm font-semibold text-dl-text">{item.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section id="hoe-het-werkt" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <h2 className="text-center text-3xl font-bold text-dl-navy">Hoe het werkt</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <Card key={step.title} className="p-6">
                <h3 className="text-lg font-bold text-dl-text">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="voorbeelden" className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <h2 className="text-center text-3xl font-bold text-dl-navy">Voorbeelden</h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600">
              Een greep uit de productcategorieën die DealLens AI kan herkennen en vergelijken.
              Onderstaande resultaten zijn voorbeelddata.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {exampleCategories.map((ex) => (
                <Card key={ex.product} className="overflow-hidden">
                  <img src={ex.image} alt={`Voorbeeld: ${ex.product}`} className="h-36 w-full object-cover" />
                  <div className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-dl-primary">
                      {ex.category}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-dl-text">{ex.product}</p>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-slate-400 line-through">{formatPrice(ex.original)}</span>
                      <span className="font-bold text-dl-green">{formatPrice(ex.best)}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Bespaard: {formatPrice(ex.original - ex.best)} (demo)
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <h2 className="text-center text-3xl font-bold text-dl-navy">Voordelen</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <Card key={b.title} className="p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-dl-navy text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-dl-text">{b.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{b.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="bg-dl-navy py-16 text-white">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 text-center md:px-8">
            <h2 className="text-3xl font-bold">Zie je iets leuks? Screenshot het.</h2>
            <p className="max-w-xl text-blue-100">
              En vind meteen de laagste prijs, inclusief werkende kortingscodes.
            </p>
            <ButtonLink href="/scan" size="lg" className="mt-2">
              Upload een screenshot
            </ButtonLink>
            <p className="text-xs text-blue-200">
              <Link href="/privacy" className="underline">
                Lees hoe we je uploads beschermen
              </Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
