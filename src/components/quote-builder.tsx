"use client";

import { useReducer } from "react";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  EQUIPMENT,
  CAPACITY_TIERS,
  OIL,
  ADD_ONS,
  FREQUENCY,
} from "@/config/catalog";
import { calculatePricing } from "@/lib/pricing";
import { formatCents } from "@/lib/formatting";
import type {
  EquipmentType,
  Capacity,
  OilType,
  AddOn,
  Frequency,
} from "@/config/catalog";
import type { PricingBreakdown } from "@/lib/types";

// ─── State ────────────────────────────────────────────────

interface QuoteState {
  equipmentType: EquipmentType;
  capacity: Capacity;
  oilType: OilType;
  addOns: AddOn[];
  frequency: Frequency;
}

type QuoteAction =
  | { type: "SET_EQUIPMENT"; value: EquipmentType }
  | { type: "SET_CAPACITY"; value: Capacity }
  | { type: "SET_OIL"; value: OilType }
  | { type: "TOGGLE_ADDON"; value: AddOn }
  | { type: "SET_FREQUENCY"; value: Frequency };

const INITIAL_STATE: QuoteState = {
  equipmentType: "COUNTERTOP_FRYER",
  capacity: "UP_TO_5",
  oilType: "CANOLA",
  addOns: [],
  frequency: "ONE_TIME",
};

function quoteReducer(state: QuoteState, action: QuoteAction): QuoteState {
  switch (action.type) {
    case "SET_EQUIPMENT":
      return { ...state, equipmentType: action.value };
    case "SET_CAPACITY":
      return { ...state, capacity: action.value };
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

// ─── Human-readable labels (exported for /quote page) ─────

export const EQUIPMENT_LABELS: Record<EquipmentType, string> = {
  COUNTERTOP_FRYER: "Countertop Fryer",
  FLOOR_FRYER: "Floor Fryer",
  FRYER_BANK: "Fryer Bank",
  BUILT_IN: "Built-In / Fixed",
  OTHER: "Other / Custom",
};

export const CAPACITY_LABELS: Record<Capacity, string> = {
  UP_TO_5: "Up to 5 gal",
  RANGE_5_10: "5–10 gal",
  RANGE_10_15: "10–15 gal",
  RANGE_15_20: "15–20 gal",
  OVER_20: "20+ gal",
};

export const OIL_LABELS: Record<OilType, string> = {
  CANOLA: "Canola",
  SUNFLOWER: "Sunflower",
  PALM: "Palm",
  BLEND: "Blend",
};

export const ADDON_LABELS: Record<AddOn, string> = {
  FILTER_REPLACEMENT: "Filter Replacement",
  DEEP_CLEAN: "Deep Clean",
  WASTE_OIL_DISPOSAL: "Waste Oil Disposal",
};

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  ONE_TIME: "One-time",
  MONTHLY: "Monthly",
};

export const FREQUENCY_DESCRIPTIONS: Record<Frequency, string> = {
  ONE_TIME: "Single service visit",
  MONTHLY: "Recurring monthly — 10% off",
};

// ─── Component ────────────────────────────────────────────

interface QuoteBuilderProps {
  initialFrequency?: Frequency;
  onContinue?: (pricing: PricingBreakdown) => void;
}

export function QuoteBuilder({
  initialFrequency = INITIAL_STATE.frequency,
  onContinue,
}: QuoteBuilderProps) {
  const [state, dispatch] = useReducer(
    quoteReducer,
    initialFrequency,
    (frequency): QuoteState => ({
      ...INITIAL_STATE,
      frequency,
    }),
  );

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
    if (onContinue) {
      onContinue(pricing);
    } else {
      const el = document.getElementById("contact");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid min-w-0 gap-8 concept:grid-cols-5 concept:gap-10">
        {/* ── Configuration (left) ───────────────────────── */}
        <div className="min-w-0 space-y-8 concept:col-span-3">
          {/* Equipment */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-text">
              Equipment type
            </legend>
            <div className="grid gap-3 concept:grid-cols-3">
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
                    className="sr-only focus-visible:outline-none"
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
                    {EQUIPMENT[key]!.serviceFeeMinor === null
                      ? "Custom quote"
                      : `${formatCents(EQUIPMENT[key]!.serviceFeeMinor)} service fee`}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Capacity */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-text">
              Frying capacity
            </legend>
            <div className="grid gap-3 concept:grid-cols-2">
              {(Object.keys(CAPACITY_TIERS) as Capacity[]).map((key) => (
                <label
                  key={key}
                  className={[
                    "relative flex cursor-pointer items-center justify-between rounded-xl p-4 ring-1 transition-colors",
                    state.capacity === key
                      ? "bg-accent text-accent-foreground ring-accent"
                      : "bg-surface-raised text-text ring-border hover:ring-accent/40",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="capacity"
                    value={key}
                    checked={state.capacity === key}
                    onChange={() =>
                      dispatch({ type: "SET_CAPACITY", value: key })
                    }
                    className="sr-only focus-visible:outline-none"
                  />
                  <span className="text-sm font-semibold">
                    {CAPACITY_LABELS[key]}
                  </span>
                  <span
                    className={[
                      "text-xs",
                      state.capacity === key
                        ? "text-accent-foreground/70"
                        : "text-text-muted",
                    ].join(" ")}
                  >
                    ≈ {CAPACITY_TIERS[key]!.estimateGallons} gal
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
            <div className="grid gap-3 concept:grid-cols-2">
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
                    className="sr-only focus-visible:outline-none"
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
                    {formatCents(OIL[key]!.pricePerGallonMinor)} / gal
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
                        className="sr-only focus-visible:outline-none"
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
                      {formatCents(ADD_ONS[key]!.priceMinor)}
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
            <div className="grid gap-3 concept:grid-cols-2">
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
                    className="sr-only focus-visible:outline-none"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">
                      {FREQUENCY_LABELS[key]}
                    </span>
                    {key === "MONTHLY" && (
                      <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[0.68rem] font-extrabold text-primary-foreground">
                        Save 10%
                      </span>
                    )}
                  </div>
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
        <div className="min-w-0 concept:col-span-2">
          <div className="rounded-2xl bg-surface-raised p-6 ring-1 ring-border concept:sticky concept:top-24 concept:p-8">
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
                  {pricing.serviceFeeMinor === null
                    ? "Custom quote"
                    : formatCents(pricing.serviceFeeMinor)}
                </span>
              </div>

              {/* Oil cost */}
              <div className="flex items-center justify-between">
                <span className="text-text-muted">
                  Oil ({pricing.oilGallons} gal ×{" "}
                  {formatCents(OIL[state.oilType]!.pricePerGallonMinor)}/gal)
                </span>
                <span className="font-medium text-text">
                  {formatCents(pricing.oilCostMinor)}
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
                    {formatCents(item.costMinor)}
                  </span>
                </div>
              ))}

              {/* Divider */}
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="font-medium text-text">
                    {formatCents(pricing.subtotalMinor)}
                  </span>
                </div>
              </div>

              {/* Discount */}
              {pricing.discountMinor > 0 && (
                <div className="flex items-center justify-between text-success">
                  <span>Monthly discount (10%)</span>
                  <span className="font-medium">
                    −{formatCents(pricing.discountMinor)}
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
                    {formatCents(pricing.totalMinor)}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-text-muted">
              Prices are estimates — final pricing confirmed on submission.
            </p>

            <button
              type="button"
              onClick={handleContinue}
              className={[
                buttonVariants({ variant: "secondary", size: "lg" }),
                "mt-6 w-full",
              ].join(" ")}
            >
              Continue
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
