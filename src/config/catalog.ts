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
  /** Service fee in minor units */
  serviceFeeMinor: number;
  /** Capacity in litres — used to compute oil cost */
  capacityLitres: number;
}

export const EQUIPMENT: Record<string, EquipmentConfig> = {
  COUNTERTOP_FRYER: {
    serviceFeeMinor: 1500, // $15.00
    capacityLitres: 8,
  },
  FLOOR_FRYER: {
    serviceFeeMinor: 2500, // $25.00
    capacityLitres: 15,
  },
  FRYER_BANK: {
    serviceFeeMinor: 4000, // $40.00
    capacityLitres: 30,
  },
} as const;

export type EquipmentType = keyof typeof EQUIPMENT;

// ─── Oil ───────────────────────────────────────────────────

export interface OilConfig {
  /** Price per litre in minor units */
  pricePerLitreMinor: number;
}

export const OIL: Record<string, OilConfig> = {
  CANOLA: {
    pricePerLitreMinor: 800, // $8.00 / L
  },
  SUNFLOWER: {
    pricePerLitreMinor: 700, // $7.00 / L
  },
  PALM: {
    pricePerLitreMinor: 600, // $6.00 / L
  },
  BLEND: {
    pricePerLitreMinor: 650, // $6.50 / L
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
