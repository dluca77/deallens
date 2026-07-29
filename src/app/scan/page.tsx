import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScanFlow } from "@/components/scan/scan-flow";

export const metadata = {
  title: "Screenshot uploaden – DealLens AI",
};

export default function ScanPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1 bg-dl-bg">
        <div className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
          <ScanFlow />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
