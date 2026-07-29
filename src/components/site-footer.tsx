import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-dl-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-dl-navy">DealLens AI</p>
            <p className="mt-2 text-sm text-slate-500">
              Zie je iets leuks? Screenshot het en vind de laagste prijs.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-dl-text">Product</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><Link href="/scan" className="hover:text-dl-primary">Screenshot uploaden</Link></li>
              <li><Link href="/pricing" className="hover:text-dl-primary">Abonnementen</Link></li>
              <li><Link href="/dashboard" className="hover:text-dl-primary">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-dl-text">Account</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><Link href="/login" className="hover:text-dl-primary">Inloggen</Link></li>
              <li><Link href="/register" className="hover:text-dl-primary">Registreren</Link></li>
              <li><Link href="/account" className="hover:text-dl-primary">Accountinstellingen</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-dl-text">Juridisch</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><Link href="/privacy" className="hover:text-dl-primary">Privacybeleid</Link></li>
              <li><Link href="/terms" className="hover:text-dl-primary">Algemene voorwaarden</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-dl-border pt-6 text-xs text-slate-400">
          <p>
            DealLens AI verkoopt zelf geen producten en is niet verantwoordelijk voor prijs-, voorraad- of
            voorwaardewijzigingen bij webshops. DealLens AI kan affiliatecommissies ontvangen wanneer je via een
            link doorklikt naar een webshop. Kortingscodes worden waar mogelijk gecontroleerd; wanneer dit niet kon,
            wordt dit duidelijk aangegeven.
          </p>
          <p className="mt-2">© {new Date().getFullYear()} DealLens AI. Alle prijzen in deze demo zijn voorbeelddata.</p>
        </div>
      </div>
    </footer>
  );
}
