"use client";

import { useReducer } from "react";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EQUIPMENT, OIL, ADD_ONS, FREQUENCY, CURRENCY } from "@/config/catalog";
import { calculatePricing } from "@/lib/pricing";
import type { EquipmentType, OilType, AddOn, Frequency } from "@/config/catalog";
import type { PricingBreakdown } from "@/lib/types";

// ─── State ────────────────────────────────────────────────

interface QuoteState {
  equipmentType: EquipmentType;
  oilType: OilType;
  addOns: AddOn[];
  frequency: Frequency;
}

type QuoteAction =
  | { type: "SET_EQUIPMENT"; value: EquipmentType }
  | { type: "SET_OIL"; value: OilType }
  | { type: "TOGGLE_ADDON"; value: AddOn }
  | { type: "SET_FREQUENCY"; value: Frequency };

const INITIAL_STATE: QuoteState = {
  equipmentType: "COUNTERTOP_FRYER",
  oilType: "CANOLA",
  addOns: [],
  frequency: "ONE_TIME",
};

function quoteReducer(state: QuoteState, action: QuoteAction): QuoteState {
  switch (action.type) {
    case "SET_EQUIPMENT":
      return { ...state, equipmentType: action.value };
    case "SET_OIL":
      return { ...state, oilType: action.value };
    case "TOGGLE_ADDON": {
      const exists = state.addOns.includes(action.value);
      return {
        ...state,
        addOns: exists
          ? state.addOns.filter((a) => a !== action.value)
          : [...state.addOns, action.value],
      };
    }
    case "SET_FREQUENCY":
      return { ...state, frequency: action.value };
  }
}

// ─── Formatting ───────────────────────────────────────────

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 2,
});

function fmtCents(cents: number): string {
  return currencyFormatter.format(cents / 100);
}

// ─── Human-readable labels ────────────────────────────────

const EQUIPMENT_LABELS: Record<EquipmentType, string> = {
  COUNTERTOP_FRYER: "Countertop Fryer",
  FLOOR_FRYER: "Floor Fryer",
  FRYER_BANK: "Fryer Bank",
};

const EQUIPMENT_DETAILS: Record<EquipmentType, { fee: string; capacity: string }> = {
  COUNTERTOP_FRYER: { fee: "$15.00 service fee", capacity: "8 L capacity" },
  FLOOR_FRYER: { fee: "$25.00 service fee", capacity: "15 L capacity" },
  FRYER_BANK: { fee: "$40.00 service fee", capacity: "30 L capacity" },
};

const OIL_LABELS: Record<OilType, string> = {
  CANOLA: "Canola",
  SUNFLOWER: "Sunflower",
  PALM: "Palm",
  BLEND: "Blend",
};

const OIL_PRICES: Record<OilType, string> = {
  CANOLA: "$8.00 / L",
  SUNFLOWER: "$7.00 / L",
  PALM: "$6.00 / L",
  BLEND: "$6.50 / L",
};

const ADDON_LABELS: Record<AddOn, string> = {
  FILTER_REPLACEMENT: "Filter Replacement",
  DEEP_CLEAN: "Deep Clean",
  WASTE_OIL_DISPOSAL: "Waste Oil Disposal",
};

const ADDON_PRICES: Record<AddOn, string> = {
  FILTER_REPLACEMENT: "$5.00",
  DEEP_CLEAN: "$12.00",
  WASTE_OIL_DISPOSAL: "$4.00",
};

const FREQUENCY_LABELS: Record<Frequency, string> = {
  ONE_TIME: "One-time",
  MONTHLY: "Monthly",
};

const FREQUENCY_DESCRIPTIONS: Record<Frequency, string> = {
  ONE_TIME: "Single service visit",
  MONTHLY: "Recurring monthly — 10% off",
};

// ─── Component ────────────────────────────────────────────

export function QuoteBuilder() {
  const [state, dispatch] = useReducer(quoteReducer, INITIAL_STATE);

  let pricing: PricingBreakdown;
  try {
    pricing = calculatePricing(state);
  } catch {
    return (
      <p className="text-center text-destructive">
        Unable to calculate pricing. Please refresh the page.
      </p>
    );
  }

  const handleContinue = () => {
    const el = document.getElementById("contact");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
        {/* ── Configuration (left) ───────────────────────── */}
        <div className="lg:col-span-3 space-y-8">
          {/* Equipment */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-text">
              Equipment type
            </legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {(Object.keys(EQUIPMENT) as EquipmentType[]).map((key) => (
                <label
                  key={key}
                  className={[
                    "relative flex cursor-pointer flex-col rounded-xl p-4 ring-1 transition-colors",
                    state.equipmentType === key
                      ? "bg-accent text-accent-foreground ring-accent"
                      : "bg-surface-raised text-text ring-border hover:ring-accent/40",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="equipment"
                    value={key}
                    checked={state.equipmentType === key}
                    onChange={() =>
                      dispatch({ type: "SET_EQUIPMENT", value: key })
                    }
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold">
                    {EQUIPMENT_LABELS[key]}
                  </span>
                  <span
                    className={[
                      "mt-1 text-xs",
                      state.equipmentType === key
                        ? "text-accent-foreground/70"
                        : "text-text-muted",
                    ].join(" ")}
                  >
                    {EQUIPMENT_DETAILS[key]!.fee}
                  </span>
                  <span
                    className={[
                      "text-xs",
                      state.equipmentType === key
                        ? "text-accent-foreground/70"
                        : "text-text-muted",
                    ].join(" ")}
                  >
                    {EQUIPMENT_DETAILS[key]!.capacity}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Oil */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-text">
              Oil type
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(OIL) as OilType[]).map((key) => (
                <label
                  key={key}
                  className={[
                    "relative flex cursor-pointer items-center justify-between rounded-xl p-4 ring-1 transition-colors",
                    state.oilType === key
                      ? "bg-accent text-accent-foreground ring-accent"
                      : "bg-surface-raised text-text ring-border hover:ring-accent/40",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="oil"
                    value={key}
                    checked={state.oilType === key}
                    onChange={() =>
                      dispatch({ type: "SET_OIL", value: key })
                    }
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold">
                    {OIL_LABELS[key]}
                  </span>
                  <span
                    className={[
                      "text-xs",
                      state.oilType === key
                        ? "text-accent-foreground/70"
                        : "text-text-muted",
                    ].join(" ")}
                  >
                    {OIL_PRICES[key]}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Add-ons */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-text">
              Additional services
            </legend>
            <div className="grid gap-3">
              {(Object.keys(ADD_ONS) as AddOn[]).map((key) => {
                const checked = state.addOns.includes(key);
                return (
                  <label
                    key={key}
                    className={[
                      "relative flex cursor-pointer items-center justify-between rounded-xl p-4 ring-1 transition-colors",
                      checked
                        ? "bg-accent text-accent-foreground ring-accent"
                        : "bg-surface-raised text-text ring-border hover:ring-accent/40",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          "flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                          checked
                            ? "border-primary bg-primary"
                            : "border-border bg-transparent",
                        ].join(" ")}
                      >
                        {checked && (
                          <svg
                            viewBox="0 0 12 12"
                            fill="none"
                            className="size-3"
                            aria-hidden="true"
                          >
                            <path
                              d="M2.5 6L5 8.5L9.5 3.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <input
                        type="checkbox"
                        name="addon"
                        value={key}
                        checked={checked}
                        onChange={() =>
                          dispatch({ type: "TOGGLE_ADDON", value: key })
                        }
                        className="sr-only"
                      />
                      <span className="text-sm font-semibold">
                        {ADDON_LABELS[key]}
                      </span>
                    </div>
                    <span
                      className={[
                        "text-xs",
                        checked
                          ? "text-accent-foreground/70"
                          : "text-text-muted",
                      ].join(" ")}
                    >
                      {ADDON_PRICES[key]}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Frequency */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-text">
              Frequency
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(FREQUENCY) as Frequency[]).map((key) => (
                <label
                  key={key}
                  className={[
                    "relative flex cursor-pointer flex-col rounded-xl p-4 ring-1 transition-colors",
                    state.frequency === key
                      ? "bg-accent text-accent-foreground ring-accent"
                      : "bg-surface-raised text-text ring-border hover:ring-accent/40",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value={key}
                    checked={state.frequency === key}
                    onChange={() =>
                      dispatch({ type: "SET_FREQUENCY", value: key })
                    }
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold">
                    {FREQUENCY_LABELS[key]}
                  </span>
                  <span
                    className={[
                      "mt-1 text-xs",
                      state.frequency === key
                        ? "text-accent-foreground/70"
                        : "text-text-muted",
                    ].join(" ")}
                  >
                    {FREQUENCY_DESCRIPTIONS[key]}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* ── Pricing breakdown (right) ──────────────────── */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl bg-surface-raised p-6 ring-1 ring-border lg:p-8">
            <h3 className="mb-5 text-h4 font-semibold text-text">
              Estimated quote
            </h3>

            <div
              className="space-y-3 text-sm"
              aria-live="polite"
              aria-atomic="true"
            >
              {/* Service fee */}
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Service fee</span>
                <span className="font-medium text-text">
                  {fmtCents(pricing.serviceFeeMinor)}
                </span>
              </div>

              {/* Oil cost */}
              <div className="flex items-center justify-between">
                <span className="text-text-muted">
                  Oil ({EQUIPMENT[state.equipmentType]!.capacityLitres}L{" "}
                  × {fmtCents(OIL[state.oilType]!.pricePerLitreMinor)}/L)
                </span>
                <span className="font-medium text-text">
                  {fmtCents(pricing.oilCostMinor)}
                </span>
              </div>

              {/* Add-ons */}
              {pricing.addOnCostsMinor.map((item) => (
                <div
                  key={item.addOn}
                  className="flex items-center justify-between"
                >
                  <span className="text-text-muted">
                    {ADDON_LABELS[item.addOn]}
                  </span>
                  <span className="font-medium text-text">
                    {fmtCents(item.costMinor)}
                  </span>
                </div>
              ))}

              {/* Divider */}
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="font-medium text-text">
                    {fmtCents(pricing.subtotalMinor)}
                  </span>
                </div>
              </div>

              {/* Discount */}
              {pricing.discountMinor > 0 && (
                <div className="flex items-center justify-between text-success">
                  <span>Monthly discount (10%)</span>
                  <span className="font-medium">
                    −{fmtCents(pricing.discountMinor)}
                  </span>
                </div>
              )}

              {/* Total */}
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-text">
                    Estimated total
                  </span>
                  <span className="text-base font-bold text-text">
                    {fmtCents(pricing.totalMinor)}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-text-muted">
              Prices are estimates — final pricing confirmed on submission.
            </p>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleContinue();
              }}
              className={[
                buttonVariants({ variant: "secondary", size: "lg" }),
                "mt-6 w-full",
              ].join(" ")}
            >
              Continue
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
