import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ResultsExplorer } from "@/components/results/results-explorer";

export const metadata = {
  title: "Prijsresultaten – DealLens AI",
};

export default function ResultsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1 bg-dl-bg">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
          <ResultsExplorer />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
