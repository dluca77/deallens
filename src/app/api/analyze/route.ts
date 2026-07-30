import { NextResponse } from "next/server";
import { recognizeProduct } from "@/lib/vision";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Vision-AI is niet geconfigureerd (ontbrekende API-sleutel op de server)." },
      { status: 503 }
    );
  }

  let body: { image?: string; mimeType?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const { image, mimeType } = body;
  if (!image || !mimeType) {
    return NextResponse.json({ error: "Geen afbeelding ontvangen." }, { status: 400 });
  }
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return NextResponse.json({ error: "Bestandstype niet ondersteund." }, { status: 415 });
  }
  // Base64 is ~4/3 the size of the raw bytes.
  if (image.length * 0.75 > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Afbeelding is te groot." }, { status: 413 });
  }

  try {
    const result = await recognizeProduct(image, mimeType, apiKey);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Productherkenning mislukt:", error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: "We konden het product niet herkennen. Probeer een duidelijkere afbeelding.",
        // TIJDELIJK voor livedebug — weer verwijderen zodra de oorzaak gevonden is.
        debug: detail,
      },
      { status: 502 }
    );
  }
}
