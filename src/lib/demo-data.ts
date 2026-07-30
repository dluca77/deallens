import type {
  CouponCode,
  DetectedProduct,
  PriceAlert,
  PriceResult,
  Retailer,
  SavedProduct,
  SearchHistoryItem,
} from "./types";

// Alle onderstaande gegevens zijn DEMODATA voor deze MVP-versie van DealLens AI.
// In productie worden deze vervangen door live vision-, shopping- en kortingscode-API's.
export const IS_DEMO_DATA = true;

export const demoProduct: DetectedProduct = {
  id: "demo-product-1",
  brand: "Nike",
  name: "Air Max 95 Essential",
  variant: "Heren sneaker",
  color: "Zwart",
  size: "42",
  category: "Schoenen",
  description:
    "Klassieke Nike Air Max 95 in de Essential-uitvoering, met gelaagd bovenwerk en zichtbare Air-zool. Herkend op basis van merklogo, siliconenzool-profiel en tekst op de schoendoos in de screenshot.",
  confidence: 94,
  image: "https://placehold.co/600x600/101828/FFFFFF?text=Nike+Air+Max+95",
  msrp: 189.99,
};

export const demoRetailers: Retailer[] = [
  { id: "webshop-a", name: "Webshop A", logoInitial: "A", logoColor: "#2563EB", country: "NL", rating: 4.6 },
  { id: "webshop-b", name: "Webshop B", logoInitial: "B", logoColor: "#16A34A", country: "NL", rating: 4.3 },
  { id: "webshop-c", name: "Webshop C", logoInitial: "C", logoColor: "#F59E0B", country: "BE", rating: 4.1 },
  { id: "webshop-d", name: "SportGigant", logoInitial: "S", logoColor: "#DC2626", country: "DE", rating: 4.4 },
  { id: "webshop-e", name: "StepUp Outlet", logoInitial: "SU", logoColor: "#172554", country: "NL", rating: 3.9 },
];

export const demoCoupons: CouponCode[] = [
  {
    id: "coupon-1",
    code: "EXTRA10",
    retailerId: "webshop-a",
    type: "percentage",
    value: "10%",
    minOrderValue: 75,
    expiresAt: "2026-08-31",
    lastChecked: "2026-07-29T07:12:00Z",
    successRate: 92,
    status: "verified_working",
  },
  {
    id: "coupon-2",
    code: "WELKOM15",
    retailerId: "webshop-b",
    type: "percentage",
    value: "15%",
    minOrderValue: 50,
    expiresAt: "2026-09-15",
    lastChecked: "2026-07-28T18:40:00Z",
    successRate: 61,
    status: "new_customers_only",
  },
  {
    id: "coupon-3",
    code: "GRATISVERZ",
    retailerId: "webshop-c",
    type: "shipping",
    value: "Gratis verzending",
    lastChecked: "2026-07-29T06:05:00Z",
    successRate: 88,
    status: "probably_working",
  },
  {
    id: "coupon-4",
    code: "APPONLY5",
    retailerId: "webshop-d",
    type: "fixed",
    value: "€5,00",
    minOrderValue: 40,
    lastChecked: "2026-07-27T09:00:00Z",
    successRate: 0,
    status: "app_only",
  },
  {
    id: "coupon-5",
    code: "NEWSLETTER",
    retailerId: "webshop-e",
    type: "percentage",
    value: "10%",
    lastChecked: "2026-07-20T09:00:00Z",
    successRate: 0,
    status: "newsletter_only",
  },
];

export const demoPriceResults: PriceResult[] = [
  {
    id: "result-1",
    retailerId: "webshop-a",
    productImage: "https://placehold.co/400x400/101828/FFFFFF?text=Air+Max+95",
    productName: "Nike Air Max 95 Essential - Zwart",
    price: 149.99,
    originalPrice: 189.99,
    shippingCost: 0,
    deliveryEstimate: "1-2 werkdagen",
    stockStatus: "in_stock",
    variants: ["40", "41", "42", "43", "44"],
    couponId: "coupon-1",
    matchLabel: "exact",
    matchConfidence: 98,
    matchReason: "Exact model, kleur en uitvoering komen overeen",
    lastChecked: "2026-07-29T07:12:00Z",
    url: "https://example.com/webshop-a/nike-air-max-95",
  },
  {
    id: "result-2",
    retailerId: "webshop-b",
    productImage: "https://placehold.co/400x400/16A34A/FFFFFF?text=Air+Max+95",
    productName: "Nike Air Max 95 Essential Zwart Heren",
    price: 139.99,
    originalPrice: 189.99,
    shippingCost: 4.95,
    deliveryEstimate: "2-4 werkdagen",
    stockStatus: "in_stock",
    variants: ["41", "42", "43"],
    matchLabel: "exact",
    matchConfidence: 96,
    matchReason: "Exact model en kleur, geen actieve kortingscode gevonden",
    lastChecked: "2026-07-28T21:30:00Z",
    url: "https://example.com/webshop-b/nike-air-max-95",
  },
  {
    id: "result-3",
    retailerId: "webshop-c",
    productImage: "https://placehold.co/400x400/F59E0B/FFFFFF?text=Air+Max+95+Wit",
    productName: "Nike Air Max 95 Essential - Wit/Grijs",
    price: 129.99,
    originalPrice: 179.99,
    shippingCost: 0,
    deliveryEstimate: "3-5 werkdagen",
    stockStatus: "in_stock",
    variants: ["42", "43", "44", "45"],
    couponId: "coupon-3",
    matchLabel: "other_color",
    matchConfidence: 82,
    matchReason: "Zelfde model, afwijkende kleurstelling",
    lastChecked: "2026-07-29T06:05:00Z",
    url: "https://example.com/webshop-c/nike-air-max-95-wit",
  },
  {
    id: "result-4",
    retailerId: "webshop-d",
    productImage: "https://placehold.co/400x400/DC2626/FFFFFF?text=Air+Max+95",
    productName: "Nike Air Max 95 Essential (EU import)",
    price: 134.5,
    originalPrice: 189.99,
    shippingCost: 6.95,
    deliveryEstimate: "5-8 werkdagen",
    stockStatus: "low_stock",
    variants: ["43", "44"],
    couponId: "coupon-4",
    matchLabel: "probable",
    matchConfidence: 90,
    matchReason: "Zelfde model en kleur, ander verpakkingsland",
    sponsored: true,
    lastChecked: "2026-07-27T09:00:00Z",
    url: "https://example.com/webshop-d/nike-air-max-95",
  },
  {
    id: "result-5",
    retailerId: "webshop-e",
    productImage: "https://placehold.co/400x400/172554/FFFFFF?text=Air+Max+95+Refurb",
    productName: "Nike Air Max 95 Essential - Refurbished",
    price: 99.0,
    originalPrice: 189.99,
    shippingCost: 3.95,
    deliveryEstimate: "3-6 werkdagen",
    stockStatus: "in_stock",
    variants: ["42"],
    matchLabel: "refurbished",
    matchConfidence: 75,
    matchReason: "Zelfde model, gerefurbished exemplaar met lichte gebruikssporen",
    lastChecked: "2026-07-26T12:00:00Z",
    url: "https://example.com/webshop-e/nike-air-max-95-refurb",
  },
];

export const demoAlternatives: PriceResult[] = [
  {
    id: "alt-1",
    retailerId: "webshop-d",
    productImage: "https://placehold.co/400x400/DC2626/FFFFFF?text=Air+Max+97",
    productName: "Nike Air Max 97 - Zwart",
    price: 159.99,
    originalPrice: 199.99,
    shippingCost: 0,
    deliveryEstimate: "2-3 werkdagen",
    stockStatus: "in_stock",
    variants: ["41", "42", "43"],
    matchLabel: "alternative",
    matchConfidence: 88,
    matchReason: "Zelfde merk en prijsklasse, vergelijkbaar silhouet en kleurstelling",
    lastChecked: "2026-07-29T05:00:00Z",
    url: "https://example.com/webshop-d/nike-air-max-97",
  },
  {
    id: "alt-2",
    retailerId: "webshop-e",
    productImage: "https://placehold.co/400x400/172554/FFFFFF?text=Air+Max+90",
    productName: "Nike Air Max 90 - Zwart/Wit",
    price: 124.99,
    originalPrice: 159.99,
    shippingCost: 0,
    deliveryEstimate: "1-2 werkdagen",
    stockStatus: "in_stock",
    variants: ["40", "41", "42", "43", "44"],
    matchLabel: "alternative",
    matchConfidence: 79,
    matchReason: "Zelfde merk, vergelijkbaar materiaal en kleurgebruik, ander model",
    lastChecked: "2026-07-29T05:20:00Z",
    url: "https://example.com/webshop-e/nike-air-max-90",
  },
];

export function bestDealResult(
  list: PriceResult[] = demoPriceResults,
  coupons: CouponCode[] = demoCoupons
): PriceResult {
  const candidates = list.filter((r) => !r.sponsored);
  return candidates.reduce((best, current) => {
    const bestTotal = totalPrice(best, coupons);
    const currentTotal = totalPrice(current, coupons);
    if (currentTotal < bestTotal) return current;
    if (currentTotal === bestTotal && current.matchConfidence > best.matchConfidence) return current;
    return best;
  }, candidates[0]);
}

export function cheapestAlternative(
  list: PriceResult[] = demoPriceResults,
  coupons: CouponCode[] = demoCoupons
): PriceResult {
  return [...list]
    .filter((r) => r.matchLabel !== "exact")
    .sort((a, b) => totalPrice(a, coupons) - totalPrice(b, coupons))[0];
}

function seedFromString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return hash;
}

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface RecognizedProductLike {
  brand: string;
  name: string;
  image: string;
  color?: string | null;
  size?: string | null;
  category?: string | null;
  referencePrice?: number | null;
}

/**
 * Genereert consistente (maar illustratieve) demo-prijsresultaten rond een écht herkend product,
 * zodat de resultatenpagina niet langer altijd de vaste sneaker-demodata toont voor een ander
 * product. Prijzen en webshops blijven voorbeelddata totdat er een live shopping-API gekoppeld is.
 * Wanneer de AI een referentieprijs teruggaf (zichtbaar op de screenshot of een schatting), wordt
 * die als anker gebruikt zodat de voorbeeldprijzen realistisch aanvoelen voor dit type product.
 */
export function buildDemoResultsForProduct(product: RecognizedProductLike): {
  priceResults: PriceResult[];
  alternatives: PriceResult[];
} {
  const rand = mulberry32(seedFromString(`${product.brand}-${product.name}`));
  const basePrice = product.referencePrice
    ? Math.round(Math.max(1, product.referencePrice) * 100) / 100
    : Math.round((29 + rand() * 220) * 100) / 100;
  const now = new Date().toISOString();
  const variants = product.size ? [product.size] : ["Eenheidsmaat"];

  const retailerConfigs: {
    discountPct: number;
    shippingCost: number;
    deliveryEstimate: string;
    stockStatus: PriceResult["stockStatus"];
    matchLabel: PriceResult["matchLabel"];
    matchConfidence: number;
    couponId?: string;
    sponsored?: boolean;
  }[] = [
    {
      discountPct: 0.24,
      shippingCost: 0,
      deliveryEstimate: "1-2 werkdagen",
      stockStatus: "in_stock",
      matchLabel: "exact",
      matchConfidence: 97,
      couponId: demoCoupons[0]?.id,
    },
    {
      discountPct: 0.18,
      shippingCost: 4.95,
      deliveryEstimate: "2-4 werkdagen",
      stockStatus: "in_stock",
      matchLabel: "exact",
      matchConfidence: 95,
    },
    {
      discountPct: 0.12,
      shippingCost: 0,
      deliveryEstimate: "3-5 werkdagen",
      stockStatus: "low_stock",
      matchLabel: "probable",
      matchConfidence: 89,
      couponId: demoCoupons[2]?.id,
    },
    {
      discountPct: 0.08,
      shippingCost: 3.95,
      deliveryEstimate: "5-8 werkdagen",
      stockStatus: "in_stock",
      matchLabel: "probable",
      matchConfidence: 86,
      couponId: demoCoupons[3]?.id,
      sponsored: true,
    },
    {
      discountPct: 0.34,
      shippingCost: 2.95,
      deliveryEstimate: "3-6 werkdagen",
      stockStatus: "in_stock",
      matchLabel: "refurbished",
      matchConfidence: 74,
    },
  ];

  const priceResults: PriceResult[] = demoRetailers.map((retailer, i) => {
    const config = retailerConfigs[i];
    const price = Math.round(basePrice * (1 - config.discountPct) * 100) / 100;
    return {
      id: `dyn-${i}-${retailer.id}`,
      retailerId: retailer.id,
      productImage: product.image,
      productName: `${product.name}${product.color ? ` - ${product.color}` : ""}`,
      price,
      originalPrice: basePrice,
      shippingCost: config.shippingCost,
      deliveryEstimate: config.deliveryEstimate,
      stockStatus: config.stockStatus,
      variants,
      couponId: config.couponId,
      matchLabel: config.matchLabel,
      matchConfidence: config.matchConfidence,
      matchReason: "Geschat op basis van herkende merk- en productkenmerken (voorbeelddata, nog geen live shopping-bron)",
      sponsored: config.sponsored,
      lastChecked: now,
      url: `https://example.com/voorbeeldwinkel/${retailer.id}`,
    };
  });

  const alternatives: PriceResult[] = [
    {
      id: "dyn-alt-1",
      retailerId: demoRetailers[3].id,
      productImage: product.image,
      productName: `Vergelijkbaar model van ${product.brand || "hetzelfde merk"}`,
      price: Math.round(basePrice * 0.82 * 100) / 100,
      originalPrice: Math.round(basePrice * 1.1 * 100) / 100,
      shippingCost: 0,
      deliveryEstimate: "2-3 werkdagen",
      stockStatus: "in_stock",
      variants,
      matchLabel: "alternative",
      matchConfidence: 84,
      matchReason: "Zelfde merk en prijsklasse, vergelijkbare kenmerken (voorbeelddata)",
      lastChecked: now,
      url: `https://example.com/voorbeeldwinkel/${demoRetailers[3].id}-alternatief`,
    },
    {
      id: "dyn-alt-2",
      retailerId: demoRetailers[4].id,
      productImage: product.image,
      productName: `Vergelijkbaar alternatief - ${product.category ?? "zelfde categorie"}`,
      price: Math.round(basePrice * 0.66 * 100) / 100,
      originalPrice: Math.round(basePrice * 0.95 * 100) / 100,
      shippingCost: 0,
      deliveryEstimate: "1-2 werkdagen",
      stockStatus: "in_stock",
      variants,
      matchLabel: "alternative",
      matchConfidence: 77,
      matchReason: "Vergelijkbaar type product en kleur, ander merk (voorbeelddata)",
      lastChecked: now,
      url: `https://example.com/voorbeeldwinkel/${demoRetailers[4].id}-alternatief`,
    },
  ];

  return { priceResults, alternatives };
}

export function couponForResult(result: PriceResult, coupons: CouponCode[] = demoCoupons): CouponCode | undefined {
  return coupons.find((c) => c.id === result.couponId);
}

export function retailerForResult(result: { retailerId: string }, retailers: Retailer[] = demoRetailers): Retailer {
  return retailers.find((r) => r.id === result.retailerId)!;
}

export function couponDiscountAmount(result: PriceResult, coupons: CouponCode[] = demoCoupons): number {
  const coupon = couponForResult(result, coupons);
  if (!coupon) return 0;
  if (coupon.type === "percentage") {
    const pct = parseFloat(coupon.value) / 100;
    if (Number.isNaN(pct)) return 0;
    return Math.round(result.price * pct * 100) / 100;
  }
  if (coupon.type === "fixed") {
    const amount = parseFloat(coupon.value.replace(/[^0-9.,]/g, "").replace(",", "."));
    return Number.isNaN(amount) ? 0 : amount;
  }
  return 0;
}

export function totalPrice(result: PriceResult, coupons: CouponCode[] = demoCoupons): number {
  const discount = couponDiscountAmount(result, coupons);
  return Math.max(0, Math.round((result.price + result.shippingCost - discount) * 100) / 100);
}

export const demoSavedProducts: SavedProduct[] = [
  {
    id: "saved-1",
    productName: "Nike Air Max 95 Essential - Zwart",
    image: "https://placehold.co/200x200/101828/FFFFFF?text=Air+Max+95",
    lowestPrice: 129.99,
    priceChange: "down",
    savedAt: "2026-07-20T10:00:00Z",
  },
  {
    id: "saved-2",
    productName: "Sony WH-1000XM5 Koptelefoon - Zwart",
    image: "https://placehold.co/200x200/172554/FFFFFF?text=WH-1000XM5",
    lowestPrice: 279.0,
    priceChange: "none",
    savedAt: "2026-07-15T14:30:00Z",
  },
  {
    id: "saved-3",
    productName: "IKEA MALM Ladekast 4 lades - Wit",
    image: "https://placehold.co/200x200/F59E0B/FFFFFF?text=MALM",
    lowestPrice: 89.0,
    priceChange: "up",
    savedAt: "2026-07-10T09:15:00Z",
  },
];

export const demoPriceAlerts: PriceAlert[] = [
  {
    id: "alert-1",
    productName: "Nike Air Max 95 Essential - Zwart",
    image: "https://placehold.co/200x200/101828/FFFFFF?text=Air+Max+95",
    type: "below_amount",
    threshold: 100,
    channels: ["email", "dashboard"],
    active: true,
  },
  {
    id: "alert-2",
    productName: "Sony WH-1000XM5 Koptelefoon - Zwart",
    image: "https://placehold.co/200x200/172554/FFFFFF?text=WH-1000XM5",
    type: "any_drop",
    channels: ["push", "dashboard"],
    active: true,
  },
  {
    id: "alert-3",
    productName: "IKEA MALM Ladekast 4 lades - Wit",
    image: "https://placehold.co/200x200/F59E0B/FFFFFF?text=MALM",
    type: "new_coupon",
    channels: ["dashboard"],
    active: false,
  },
];

export const demoSearchHistory: SearchHistoryItem[] = [
  {
    id: "search-1",
    productName: "Nike Air Max 95 Essential - Zwart",
    image: "https://placehold.co/200x200/101828/FFFFFF?text=Air+Max+95",
    originalPrice: 189.99,
    lowestPrice: 107.95,
    savings: 42.0,
    date: "2026-07-29T07:00:00Z",
  },
  {
    id: "search-2",
    productName: "Sony WH-1000XM5 Koptelefoon - Zwart",
    image: "https://placehold.co/200x200/172554/FFFFFF?text=WH-1000XM5",
    originalPrice: 379.0,
    lowestPrice: 279.0,
    savings: 100.0,
    date: "2026-07-24T16:20:00Z",
  },
  {
    id: "search-3",
    productName: "IKEA MALM Ladekast 4 lades - Wit",
    image: "https://placehold.co/200x200/F59E0B/FFFFFF?text=MALM",
    originalPrice: 99.0,
    lowestPrice: 89.0,
    savings: 10.0,
    date: "2026-07-10T09:15:00Z",
  },
  {
    id: "search-4",
    productName: "The Ordinary Niacinamide 10% Serum",
    image: "https://placehold.co/200x200/16A34A/FFFFFF?text=Niacinamide",
    originalPrice: 12.5,
    lowestPrice: 9.95,
    savings: 2.55,
    date: "2026-07-02T11:45:00Z",
  },
];

export const demoDashboardStats = {
  totalSearches: 27,
  totalSavings: 486.4,
  activeAlerts: demoPriceAlerts.filter((a) => a.active).length,
  savedDeals: demoSavedProducts.length,
};

export const demoAdminStats = {
  totalScans: 18420,
  recognitionRate: 91.4,
  clickThroughRate: 34.2,
  averageSavings: 27.8,
  topCategories: [
    { name: "Schoenen", share: 28 },
    { name: "Elektronica", share: 22 },
    { name: "Kleding", share: 18 },
    { name: "Cosmetica", share: 11 },
    { name: "Meubels", share: 9 },
  ],
  topRetailers: demoRetailers.map((r, i) => ({ name: r.name, clicks: 4200 - i * 620 })),
  successfulCoupons: demoCoupons.filter((c) => c.status === "verified_working").length,
  falseMatches: 47,
};
