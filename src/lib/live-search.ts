import type { CouponCode, PriceResult, Retailer } from "./types";

export interface LiveSearchProduct {
  brand: string;
  name: string;
  color?: string | null;
  size?: string | null;
  category?: string | null;
  referencePrice?: number | null;
}

export interface LiveSearchResult {
  retailers: Retailer[];
  priceResults: PriceResult[];
  coupons: CouponCode[];
  searchedAt: string;
}

const SYSTEM_PROMPT = `Je bent de shopping-researchmodule van DealLens AI. Je krijgt een herkend product en moet met de
web-zoektool ECHTE, actuele informatie opzoeken. Verzin nooit gegevens.

Taak 1 — Webshops en prijzen:
Zoek naar webshops die dit product daadwerkelijk verkopen. Stop niet na de eerste de beste treffer: voer
meerdere verschillende zoekopdrachten uit (bijv. merk + productnaam, merk + productnaam + "prijs", de officiële
merkwebsite specifiek, en eventueel een prijsvergelijkingssite) zodat je minimaal 2-3 verschillende webshops
probeert te vinden voordat je stopt, tenzij je zoekbudget op is. Voor elke webshop die je vindt en kunt
bevestigen: merk/webshopnaam, domeinnaam, directe productprijs (in euro; converteer andere valuta),
verzendkosten indien vermeld, geschatte levertijd indien vermeld, voorraadstatus indien vermeld, en de directe
URL naar de productpagina. Neem alleen webshops op waarvoor je een zoekresultaat hebt gezien dat het product en
een prijs noemt. Vind maximaal 5 webshops.

Taak 2 — Kortingscodes:
Zoek naar kortingscodes voor dit merk of deze specifieke webshops. Voor elke code die je vindt: de code zelf,
voor welke webshop, het type/hoogte van de korting, en de bron-URL. Tel hoeveel ONAFHANKELIJKE bronnen (verschillende
websites) dezelfde code recent (bij voorkeur laatste 60 dagen) melden. Gebruik dit aantal als "confirmedBySources".
Test NOOIT daadwerkelijk of een code werkt (geen checkout-simulatie) — baseer je oordeel puur op hoeveel
onafhankelijke bronnen de code bevestigen.

Antwoord PAS NADAT je klaar bent met zoeken, ALLEEN met geldige JSON in exact dit formaat, zonder markdown-codeblok
en zonder extra tekst:
{
  "retailers": [
    {
      "name": string,
      "domain": string,
      "price": number,
      "shippingCost": number of null,
      "deliveryEstimate": string of null,
      "stockStatus": "in_stock" | "low_stock" | "out_of_stock" | "unknown",
      "url": string,
      "matchConfidence": number (0-100, hoe zeker je bent dat dit echt hetzelfde product is)
    }
  ],
  "coupons": [
    {
      "code": string,
      "retailerDomain": string,
      "discountDescription": string,
      "sourceUrl": string,
      "confirmedBySources": number
    }
  ]
}

Als je voor geen enkele webshop een betrouwbaar prijsresultaat vindt, geef dan "retailers": [] terug. Verzin nooit
een prijs, webshop of kortingscode die je niet daadwerkelijk in een zoekresultaat bent tegengekomen.`;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

function seedFromString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) | 0;
  return hash;
}

const PALETTE = ["#2563EB", "#16A34A", "#F59E0B", "#DC2626", "#172554", "#0EA5E9", "#9333EA"];

function colorForDomain(domain: string): string {
  const idx = Math.abs(seedFromString(domain)) % PALETTE.length;
  return PALETTE[idx];
}

interface RawRetailerResult {
  name?: string;
  domain?: string;
  price?: number;
  shippingCost?: number | null;
  deliveryEstimate?: string | null;
  stockStatus?: string;
  url?: string;
  matchConfidence?: number;
}

interface RawCouponResult {
  code?: string;
  retailerDomain?: string;
  discountDescription?: string;
  sourceUrl?: string;
  confirmedBySources?: number;
}

export async function liveSearchForProduct(
  product: LiveSearchProduct,
  apiKey: string
): Promise<LiveSearchResult> {
  const productDescription = [
    product.brand,
    product.name,
    product.color ?? "",
    product.size ? `maat ${product.size}` : "",
    product.category ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 6 }],
      messages: [
        {
          role: "user",
          content: `Zoek actuele prijzen en kortingscodes op voor dit product: "${productDescription}".${
            product.referencePrice ? ` De ongeveer verwachte prijs is €${product.referencePrice}.` : ""
          }`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Search-API gaf status ${response.status}: ${errorText.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    content?: { type: string; text?: string }[];
  };

  const textBlocks = (data.content ?? []).filter((b) => b.type === "text" && b.text);
  const combinedText = textBlocks.map((b) => b.text).join("\n");
  const jsonMatch = combinedText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Kon geen geldige JSON uit het zoekresultaat halen.");
  }

  const parsed = JSON.parse(jsonMatch[0]) as {
    retailers?: RawRetailerResult[];
    coupons?: RawCouponResult[];
  };

  const now = new Date().toISOString();
  const retailers: Retailer[] = [];
  const priceResults: PriceResult[] = [];
  const domainToRetailerId = new Map<string, string>();

  for (const raw of parsed.retailers ?? []) {
    if (!raw.domain || !raw.name || typeof raw.price !== "number" || !raw.url) continue;
    const id = slugify(raw.domain);
    if (!domainToRetailerId.has(raw.domain)) {
      domainToRetailerId.set(raw.domain, id);
      retailers.push({
        id,
        name: raw.name,
        logoInitial: raw.name.charAt(0).toUpperCase(),
        logoColor: colorForDomain(raw.domain),
        country: "—",
      });
    }
    const stockStatus: PriceResult["stockStatus"] =
      raw.stockStatus === "low_stock" || raw.stockStatus === "out_of_stock" ? raw.stockStatus : "in_stock";

    priceResults.push({
      id: `live-${id}-${priceResults.length}`,
      retailerId: id,
      productImage: "",
      productName: product.name,
      price: raw.price,
      shippingCost: raw.shippingCost ?? 0,
      deliveryEstimate: raw.deliveryEstimate ?? "Onbekend",
      stockStatus,
      variants: product.size ? [product.size] : [],
      matchLabel: (raw.matchConfidence ?? 0) >= 90 ? "exact" : "probable",
      matchConfidence: Math.max(0, Math.min(100, Math.round(raw.matchConfidence ?? 60))),
      matchReason: "Live gevonden via websearch op basis van merk- en productnaam",
      lastChecked: now,
      url: raw.url,
      isLive: true,
    });
  }

  const coupons: CouponCode[] = [];
  for (const raw of parsed.coupons ?? []) {
    if (!raw.code || !raw.retailerDomain) continue;
    const retailerId = domainToRetailerId.get(raw.retailerDomain);
    if (!retailerId) continue;
    const confirmedBySources = raw.confirmedBySources ?? 0;
    coupons.push({
      id: `live-coupon-${coupons.length}`,
      code: raw.code,
      retailerId,
      type: "percentage",
      value: raw.discountDescription ?? "Onbekende korting",
      lastChecked: now,
      successRate: 0,
      status: confirmedBySources >= 2 ? "probably_working" : "not_verifiable",
      sourceUrl: raw.sourceUrl,
      confirmedBySources,
      isLive: true,
    });
  }

  return { retailers, priceResults, coupons, searchedAt: now };
}
