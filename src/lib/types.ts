export type MatchLabel =
  | "exact"
  | "probable"
  | "alternative"
  | "other_color"
  | "other_size"
  | "used"
  | "refurbished";

export const matchLabelText: Record<MatchLabel, string> = {
  exact: "Exact product",
  probable: "Waarschijnlijke match",
  alternative: "Vergelijkbaar alternatief",
  other_color: "Andere kleur",
  other_size: "Andere maat",
  used: "Tweedehands",
  refurbished: "Refurbished",
};

export type CouponStatus =
  | "verified_working"
  | "probably_working"
  | "not_verifiable"
  | "new_customers_only"
  | "app_only"
  | "newsletter_only";

export const couponStatusText: Record<CouponStatus, string> = {
  verified_working: "Gecontroleerd en werkend",
  probably_working: "Waarschijnlijk werkend",
  not_verifiable: "Niet automatisch te controleren",
  new_customers_only: "Alleen voor nieuwe klanten",
  app_only: "Alleen in de app",
  newsletter_only: "Alleen voor nieuwsbriefinschrijving",
};

export interface DetectedProduct {
  id: string;
  brand: string;
  name: string;
  variant: string;
  color: string;
  size?: string;
  category: string;
  description: string;
  confidence: number;
  image: string;
  msrp: number;
}

export interface Retailer {
  id: string;
  name: string;
  logoInitial: string;
  logoColor: string;
  country: string;
  rating?: number;
}

export interface CouponCode {
  id: string;
  code: string;
  retailerId: string;
  type: "percentage" | "fixed" | "shipping";
  value: string;
  minOrderValue?: number;
  expiresAt?: string;
  lastChecked: string;
  successRate: number;
  status: CouponStatus;
  /** Aanwezig bij live (via websearch) gevonden codes: waar de code is teruggevonden. */
  sourceUrl?: string;
  /** Aantal onafhankelijke bronnen dat deze code recent bevestigde (alleen bij live data). */
  confirmedBySources?: number;
  isLive?: boolean;
}

export interface PriceResult {
  id: string;
  retailerId: string;
  productImage: string;
  productName: string;
  price: number;
  originalPrice?: number;
  shippingCost: number;
  deliveryEstimate: string;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
  variants: string[];
  couponId?: string;
  matchLabel: MatchLabel;
  matchConfidence: number;
  matchReason: string;
  sponsored?: boolean;
  lastChecked: string;
  url: string;
  isLive?: boolean;
}

export interface SavedProduct {
  id: string;
  productName: string;
  image: string;
  lowestPrice: number;
  priceChange: "up" | "down" | "none";
  savedAt: string;
}

export interface PriceAlert {
  id: string;
  productName: string;
  image: string;
  type: "any_drop" | "below_amount" | "new_coupon" | "back_in_stock";
  threshold?: number;
  channels: ("email" | "push" | "dashboard")[];
  active: boolean;
}

export interface SearchHistoryItem {
  id: string;
  productName: string;
  image: string;
  originalPrice: number;
  lowestPrice: number;
  savings: number;
  date: string;
}
