import Link from "next/link";
import { Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

export const metadata = { title: "Inloggen – DealLens AI" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-dl-bg px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-bold text-dl-navy">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-dl-navy text-white">
            <Scan className="h-5 w-5" />
          </span>
          DealLens AI
        </Link>
        <Card>
          <CardBody>
            <h1 className="text-xl font-bold text-dl-text">Inloggen</h1>
            <p className="mt-1 text-sm text-slate-500">Log in om je zoekopdrachten en opgeslagen deals te bekijken.</p>
            <form className="mt-5 space-y-4" action="/dashboard">
              <div>
                <label htmlFor="email" className="text-sm font-medium text-dl-text">
                  E-mailadres
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="mt-1 w-full rounded-lg border border-dl-border px-3 py-2.5 text-sm"
                  placeholder="jij@voorbeeld.nl"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-medium text-dl-text">
                  Wachtwoord
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="mt-1 w-full rounded-lg border border-dl-border px-3 py-2.5 text-sm"
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full justify-center">
                Inloggen
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-500">
              Nog geen account?{" "}
              <Link href="/register" className="font-medium text-dl-primary">
                Registreer gratis
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
