/**
 * Pure pricing engine.
 *
 * All inputs are catalog keys. All money is integer minor units.
 * This function has NO side effects — no DB, no network, no config mutation.
 */

import {
  CURRENCY,
  EQUIPMENT,
  CAPACITY_TIERS,
  OIL,
  ADD_ONS,
  FREQUENCY,
} from "@/config/catalog";
import type { ServiceConfig, PricingBreakdown } from "@/lib/types";

/**
 * Compute the full pricing breakdown for a service configuration.
 *
 * Formula:
 *   oilGallons    = estimateGallons for the selected capacity tier
 *   oilCost       = oilGallons × oilPricePerGallon
 *   subtotal      = (serviceFee ?? 0) + oilCost + Σ(addOnCosts)
 *   discount      = subtotal × monthlyDiscountRate  (0 for ONE_TIME)
 *   total         = subtotal − discount
 *
 * For custom-quote equipment (BUILT_IN, OTHER) the service fee is null
 * and is excluded from the subtotal — the fee is agreed after review.
 *
 * All values are integer minor units. No floating-point money.
 */
export function calculatePricing(input: ServiceConfig): PricingBreakdown {
  const equipment = EQUIPMENT[input.equipmentType];
  const capacity = CAPACITY_TIERS[input.capacity];
  const oil = OIL[input.oilType];
  const frequencyConfig = FREQUENCY[input.frequency];

  if (!equipment || !capacity || !oil || !frequencyConfig) {
    throw new Error("Invalid catalog selection");
  }

  // ── Oil cost ─────────────────────────────────────────────
  const oilGallons = capacity.estimateGallons;
  const oilCostMinor = oilGallons * oil.pricePerGallonMinor;

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
  // Custom-quote equipment has no service fee, so (null ?? 0).
  const subtotalMinor =
    (equipment.serviceFeeMinor ?? 0) +
    oilCostMinor +
    totalAddOnCostMinor;

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
    oilGallons,
    oilCostMinor,
    addOnCostsMinor,
    subtotalMinor,
    discountMinor,
    totalMinor,
    currency: CURRENCY,
    config: {
      equipmentType: input.equipmentType,
      capacity: input.capacity,
      oilType: input.oilType,
      addOns: uniqueAddOns,
      frequency: input.frequency,
    },
  };
}
