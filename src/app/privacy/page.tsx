import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = { title: "Privacybeleid – DealLens AI" };

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1 bg-white py-14">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <h1 className="text-3xl font-bold text-dl-navy">Privacybeleid</h1>
          <p className="mt-2 text-sm text-slate-500">Laatst bijgewerkt: 29 juli 2026</p>

          <div className="prose prose-slate mt-8 max-w-none text-sm leading-relaxed text-slate-700">
            <h2 className="text-lg font-bold text-dl-text">Welke gegevens verwerken wij?</h2>
            <p>
              Wanneer je een screenshot uploadt naar DealLens AI, verwerken wij de afbeelding om het product te
              herkennen en prijzen te vergelijken. Afbeeldingen kunnen persoonlijke informatie bevatten (zoals
              namen, adressen of accountgegevens op een pagina); vraag daarom altijd of een screenshot geen
              betaalgegevens, wachtwoorden of andere gevoelige informatie bevat voordat je deze uploadt.
            </p>

            <h2 className="mt-6 text-lg font-bold text-dl-text">Beveiliging van uploads</h2>
            <ul>
              <li>Uploads worden versleuteld verzonden en opgeslagen.</li>
              <li>Afbeeldingen worden automatisch verwijderd na analyse, tenzij je ze bewust opslaat bij een product.</li>
              <li>Je kunt een geüploade afbeelding op elk moment direct verwijderen.</li>
              <li>Waar mogelijk detecteren en vervagen we zichtbare persoonsgegevens.</li>
              <li>Uploads worden niet gebruikt om AI-modellen te trainen zonder jouw expliciete toestemming.</li>
            </ul>

            <h2 className="mt-6 text-lg font-bold text-dl-text">Accountbeveiliging</h2>
            <p>
              We beveiligen accounts met versleutelde wachtwoordopslag, passen rate limiting toe om misbruik te
              voorkomen en controleren geüploade bestanden op type en grootte om schadelijke bestanden te weren.
            </p>

            <h2 className="mt-6 text-lg font-bold text-dl-text">Delen met derden</h2>
            <p>
              We delen geen persoonsgegevens met derden, behalve waar noodzakelijk om de dienst te leveren (zoals
              hosting- en AI-verwerkingspartners) of waar wettelijk verplicht.
            </p>

            <h2 className="mt-6 text-lg font-bold text-dl-text">Jouw rechten</h2>
            <p>
              Je kunt op elk moment inzage vragen in je gegevens, deze laten corrigeren of laten verwijderen via je
              accountinstellingen of door contact met ons op te nemen.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
