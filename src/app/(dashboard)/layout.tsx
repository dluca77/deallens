import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1 bg-dl-bg">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:px-8 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-2xl border border-dl-border bg-white p-3">
              <DashboardNav />
            </div>
          </aside>
          <div>{children}</div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
