import { NextResponse } from "next/server";
import { liveSearchForProduct } from "@/lib/live-search";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Live prijzen zoeken is niet geconfigureerd (ontbrekende API-sleutel op de server)." },
      { status: 503 }
    );
  }

  let body: {
    brand?: string;
    name?: string;
    color?: string | null;
    size?: string | null;
    category?: string | null;
    referencePrice?: number | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  if (!body.brand || !body.name) {
    return NextResponse.json({ error: "Geen productgegevens ontvangen." }, { status: 400 });
  }

  try {
    const result = await liveSearchForProduct(
      {
        brand: body.brand,
        name: body.name,
        color: body.color,
        size: body.size,
        category: body.category,
        referencePrice: body.referencePrice,
      },
      apiKey
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Live prijzen zoeken mislukt:", error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: "We konden geen actuele prijzen vinden. Probeer het later opnieuw.",
        // TIJDELIJK voor livedebug — weer verwijderen zodra de oorzaak gevonden is.
        debug: detail,
      },
      { status: 502 }
    );
  }
}
