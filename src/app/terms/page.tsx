import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = { title: "Algemene voorwaarden – DealLens AI" };

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1 bg-white py-14">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <h1 className="text-3xl font-bold text-dl-navy">Algemene voorwaarden</h1>
          <p className="mt-2 text-sm text-slate-500">Laatst bijgewerkt: 29 juli 2026</p>

          <div className="prose prose-slate mt-8 max-w-none text-sm leading-relaxed text-slate-700">
            <h2 className="text-lg font-bold text-dl-text">Wat DealLens AI wel en niet is</h2>
            <p>
              DealLens AI is een prijsvergelijkings- en herkenningsdienst. DealLens AI verkoopt zelf geen producten
              en is geen partij bij de koopovereenkomst tussen jou en een webshop.
            </p>

            <h2 className="mt-6 text-lg font-bold text-dl-text">Prijzen en beschikbaarheid</h2>
            <p>
              Prijzen, voorraad en kortingscodes kunnen op elk moment veranderen bij de betreffende webshop.
              DealLens AI is niet verantwoordelijk voor wijzigingen bij webshops. Controleer de uiteindelijke prijs
              en voorwaarden altijd op de website van de aanbieder voordat je een aankoop doet.
            </p>

            <h2 className="mt-6 text-lg font-bold text-dl-text">Kortingscodes</h2>
            <p>
              DealLens AI probeert kortingscodes te verifiëren waar dit technisch en juridisch mogelijk is. Een
              code die niet automatisch gecontroleerd kon worden, wordt nooit als &ldquo;bevestigd werkend&rdquo; weergegeven.
              Wij geven geen garantie dat een niet-geverifieerde kortingscode werkt.
            </p>

            <h2 className="mt-6 text-lg font-bold text-dl-text">Affiliatecommissies</h2>
            <p>
              DealLens AI kan een affiliatecommissie ontvangen wanneer je via een link op ons platform een aankoop
              doet bij een webshop. Dit heeft geen invloed op de weergegeven prijs voor jou en gesponsorde
              resultaten worden altijd duidelijk gelabeld als &ldquo;Gesponsord&rdquo;. De objectief berekende beste deal wordt
              nooit vervangen door een gesponsord resultaat.
            </p>

            <h2 className="mt-6 text-lg font-bold text-dl-text">Gebruik van het platform</h2>
            <p>
              Je gaat ermee akkoord het platform niet te gebruiken voor onrechtmatige doeleinden, geautomatiseerd
              misbruik van kortingscodes, of het uploaden van schadelijke bestanden.
            </p>

            <h2 className="mt-6 text-lg font-bold text-dl-text">Aansprakelijkheid</h2>
            <p>
              DealLens AI spant zich in om nauwkeurige informatie te tonen, maar is niet aansprakelijk voor
              schade die voortvloeit uit onjuiste, verouderde of niet-werkende prijzen of kortingscodes bij
              derde partijen.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
