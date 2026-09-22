/**
 * Server-side pricing catalog.
 *
 * All money values are in INTEGER MINOR UNITS (cents for USD).
 * This is the single source of truth — the pricing engine and API
 * read exclusively from here.
 *
 * These are demo/configurable values for development.
 * They do not represent real-world business claims.
 */

// ─── Currency ──────────────────────────────────────────────

export const CURRENCY = "USD" as const;

// ─── Equipment ─────────────────────────────────────────────

export interface EquipmentConfig {
  /**
   * Service fee in minor units, or null for custom-quote equipment
   * (Built-In/Fixed, Other/Custom) where we do not invent a fee.
   */
  serviceFeeMinor: number | null;
}

export const EQUIPMENT: Record<string, EquipmentConfig> = {
  COUNTERTOP_FRYER: {
    serviceFeeMinor: 1500, // $15.00
  },
  FLOOR_FRYER: {
    serviceFeeMinor: 2500, // $25.00
  },
  FRYER_BANK: {
    serviceFeeMinor: 4000, // $40.00
  },
  BUILT_IN: {
    serviceFeeMinor: null, // custom quote
  },
  OTHER: {
    serviceFeeMinor: null, // custom quote
  },
} as const;

export type EquipmentType = keyof typeof EQUIPMENT;

// ─── Capacity (gallons) ────────────────────────────────────
// Equipment type is separate from capacity. The customer picks a
// gallons range; the estimate uses a representative fill for that
// range so the quote is deterministic on both client and server.

export interface CapacityConfig {
  /** Representative gallons used to estimate the oil cost. */
  estimateGallons: number;
}

export const CAPACITY_TIERS: Record<string, CapacityConfig> = {
  UP_TO_5: {
    estimateGallons: 4, // ≈ 4 gal fill
  },
  RANGE_5_10: {
    estimateGallons: 8, // ≈ 8 gal fill
  },
  RANGE_10_15: {
    estimateGallons: 12, // ≈ 12 gal fill
  },
  RANGE_15_20: {
    estimateGallons: 18, // ≈ 18 gal fill
  },
  OVER_20: {
    estimateGallons: 24, // ≈ 24 gal fill
  },
} as const;

export type Capacity = keyof typeof CAPACITY_TIERS;

// ─── Oil ───────────────────────────────────────────────────

export interface OilConfig {
  /** Price per gallon in minor units */
  pricePerGallonMinor: number;
}

export const OIL: Record<string, OilConfig> = {
  CANOLA: {
    pricePerGallonMinor: 2600, // $26.00 / gal
  },
  SUNFLOWER: {
    pricePerGallonMinor: 2400, // $24.00 / gal
  },
  PALM: {
    pricePerGallonMinor: 2200, // $22.00 / gal
  },
  BLEND: {
    pricePerGallonMinor: 2300, // $23.00 / gal
  },
} as const;

export type OilType = keyof typeof OIL;

// ─── Add-ons ───────────────────────────────────────────────

export interface AddOnConfig {
  /** Flat price in minor units */
  priceMinor: number;
}

export const ADD_ONS: Record<string, AddOnConfig> = {
  FILTER_REPLACEMENT: {
    priceMinor: 500, // $5.00
  },
  DEEP_CLEAN: {
    priceMinor: 1200, // $12.00
  },
  WASTE_OIL_DISPOSAL: {
    priceMinor: 400, // $4.00
  },
} as const;

export type AddOn = keyof typeof ADD_ONS;

// ─── Frequency ─────────────────────────────────────────────

export interface FrequencyConfig {
  /**
   * Monthly discount as a fraction of subtotal.
   * e.g. 0.10 = 10 % discount for monthly subscribers.
   */
  monthlyDiscountRate: number;
}

export const FREQUENCY: Record<string, FrequencyConfig> = {
  ONE_TIME: {
    monthlyDiscountRate: 0,
  },
  MONTHLY: {
    monthlyDiscountRate: 0.10, // 10 %
  },
} as const;

export type Frequency = keyof typeof FREQUENCY;
