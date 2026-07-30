export interface VisionProductResult {
  brand: string;
  name: string;
  variant: string;
  color: string;
  size: string | null;
  category: string;
  description: string;
  confidence: number;
  referencePrice: number | null;
}

const SYSTEM_PROMPT = `Je bent de productherkenningsmodule van DealLens AI. Je krijgt een screenshot van een webshop,
sociale media-advertentie of productpagina. Herken het hoofdproduct in de afbeelding zo nauwkeurig mogelijk
op basis van merklogo, productnaam, tekst op de afbeelding, kleur, materiaal en categorie.

Let ook goed op of er ergens een prijs zichtbaar is in de afbeelding (bijvoorbeeld "€ 17,49" of "$24.99").

Antwoord ALLEEN met geldige JSON in exact dit formaat, zonder markdown-codeblok en zonder extra tekst:
{
  "brand": string,
  "name": string,
  "variant": string,
  "color": string,
  "size": string of null,
  "category": string,
  "description": string (max 2 zinnen, in het Nederlands),
  "confidence": number (0-100, hoe zeker je bent van deze herkenning),
  "referencePrice": number of null — gebruik prioriteit in deze volgorde:
    1. Een prijs die letterlijk zichtbaar is in de afbeelding, omgerekend naar euro's als dat nodig is.
    2. Als er geen prijs zichtbaar is: jouw beste schatting van de gangbare verkoopprijs in euro's voor dit
       specifieke type product, gebaseerd op merk, categorie en materiaal.
    Geef altijd een getal terug tenzij je totaal geen inschatting kunt maken; gebruik dan null.
}

Als je geen duidelijk product kunt herkennen, geef dan "confidence" onder de 40 terug.`;

export async function recognizeProduct(
  imageBase64: string,
  mimeType: string,
  apiKey: string
): Promise<VisionProductResult> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType,
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: "Herken het product in deze screenshot en antwoord met de gevraagde JSON.",
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Vision-API gaf status ${response.status}: ${errorText.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    content?: { type: string; text?: string }[];
  };

  const textBlock = data.content?.find((block) => block.type === "text")?.text;
  if (!textBlock) {
    throw new Error("Geen tekstantwoord ontvangen van de vision-API.");
  }

  const jsonMatch = textBlock.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Kon geen geldige JSON uit het AI-antwoord halen.");
  }

  const parsed = JSON.parse(jsonMatch[0]) as Partial<VisionProductResult>;

  if (!parsed.brand || !parsed.name || typeof parsed.confidence !== "number") {
    throw new Error("AI-antwoord miste verplichte velden.");
  }

  const referencePrice =
    typeof parsed.referencePrice === "number" && Number.isFinite(parsed.referencePrice) && parsed.referencePrice > 0
      ? parsed.referencePrice
      : null;

  return {
    brand: parsed.brand,
    name: parsed.name,
    variant: parsed.variant ?? "",
    color: parsed.color ?? "Onbekend",
    size: parsed.size ?? null,
    category: parsed.category ?? "Onbekend",
    description: parsed.description ?? "",
    confidence: Math.max(0, Math.min(100, Math.round(parsed.confidence))),
    referencePrice,
  };
}
