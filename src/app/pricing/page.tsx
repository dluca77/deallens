import { Check } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardBody } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Abonnementen – DealLens AI" };

const plans = [
  {
    name: "Gratis",
    price: "€0",
    period: "per maand",
    description: "Ideaal om te beginnen met slimmer shoppen.",
    features: [
      "Beperkt aantal scans per maand",
      "Standaard prijsvergelijking",
      "Beperkt aantal prijsalerts",
      "Toegang tot basisresultaten",
    ],
    cta: "Start gratis",
    href: "/register",
  },
  {
    name: "DealLens Pro",
    price: "€6,99",
    period: "per maand",
    description: "Voor wie altijd de beste deal wil vinden.",
    features: [
      "Meer of onbeperkte scans",
      "Uitgebreidere prijsvergelijking",
      "Automatische kortingscodecontrole",
      "Onbeperkte prijsalerts",
      "Prijsgeschiedenis",
      "Snellere zoekresultaten",
      "Toegang tot internationale webshops",
      "Geen advertenties",
    ],
    cta: "Upgrade naar Pro",
    href: "/register",
    highlight: true,
  },
];

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1 bg-dl-bg py-14">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-dl-navy">Kies je abonnement</h1>
            <p className="mt-2 text-slate-600">
              Begin gratis. De belangrijkste basisfunctionaliteit blijft altijd beschikbaar.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <Card key={plan.name} className={plan.highlight ? "relative border-dl-primary" : "relative"}>
                {plan.highlight && (
                  <Badge tone="blue" className="absolute -top-3 left-6">
                    Populair
                  </Badge>
                )}
                <CardBody>
                  <h2 className="text-lg font-bold text-dl-text">{plan.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
                  <p className="mt-4">
                    <span className="text-3xl font-extrabold text-dl-text">{plan.price}</span>{" "}
                    <span className="text-sm text-slate-500">{plan.period}</span>
                  </p>
                  <ul className="mt-5 space-y-2.5 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-dl-green" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink
                    href={plan.href}
                    variant={plan.highlight ? "primary" : "outline"}
                    className="mt-6 w-full justify-center"
                  >
                    {plan.cta}
                  </ButtonLink>
                </CardBody>
              </Card>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-slate-400">
            Prijzen zijn voorbeeldprijzen voor deze demo. Betalingen worden in een productieversie via Stripe
            verwerkt. Je kunt op elk moment opzeggen.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
