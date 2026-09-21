/**
 * Pure pricing engine.
 *
 * All inputs are catalog keys. All money is integer minor units.
 * This function has NO side effects — no DB, no network, no config mutation.
 */

import {
  CURRENCY,
  EQUIPMENT,
  OIL,
  ADD_ONS,
  FREQUENCY,
} from "@/config/catalog";
import type { ServiceConfig, PricingBreakdown } from "@/lib/types";

/**
 * Compute the full pricing breakdown for a service configuration.
 *
 * Formula:
 *   oilCost       = capacityLitres × oilPricePerLitre
 *   subtotal      = serviceFee + oilCost + Σ(addOnCosts)
 *   discount      = subtotal × monthlyDiscountRate  (0 for ONE_TIME)
 *   total         = subtotal − discount
 *
 * All values are integer minor units. No floating-point money.
 */
export function calculatePricing(input: ServiceConfig): PricingBreakdown {
  const equipment = EQUIPMENT[input.equipmentType];
  const oil = OIL[input.oilType];
  const frequencyConfig = FREQUENCY[input.frequency];

  if (!equipment || !oil || !frequencyConfig) {
    throw new Error("Invalid catalog selection");
  }

  // ── Oil cost ─────────────────────────────────────────────
  const oilCostMinor = equipment.capacityLitres * oil.pricePerLitreMinor;

  // ── Add-on costs (deduplicate if same add-on passed twice) ──
  const uniqueAddOns = [...new Set(input.addOns)];
  const addOnCostsMinor = uniqueAddOns.map((addOn) => {
    const config = ADD_ONS[addOn];
    if (!config) throw new Error(`Invalid add-on: ${addOn}`);
    return { addOn, costMinor: config.priceMinor };
  });
  const totalAddOnCostMinor = addOnCostsMinor.reduce(
    (sum, item) => sum + item.costMinor,
    0,
  );

  // ── Subtotal ─────────────────────────────────────────────
  const subtotalMinor =
    equipment.serviceFeeMinor + oilCostMinor + totalAddOnCostMinor;

  // ── Discount ─────────────────────────────────────────────
  const discountRate = frequencyConfig.monthlyDiscountRate;
  const discountMinor =
    discountRate > 0
      ? Math.round(subtotalMinor * discountRate)
      : 0;

  // ── Total ────────────────────────────────────────────────
  const totalMinor = subtotalMinor - discountMinor;

  return {
    serviceFeeMinor: equipment.serviceFeeMinor,
    oilCostMinor,
    addOnCostsMinor,
    subtotalMinor,
    discountMinor,
    totalMinor,
    currency: CURRENCY,
    config: {
      equipmentType: input.equipmentType,
      oilType: input.oilType,
      addOns: uniqueAddOns,
      frequency: input.frequency,
    },
  };
}
