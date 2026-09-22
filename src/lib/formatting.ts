/**
 * Shared formatting utilities.
 *
 * All functions are pure and side-effect-free.
 * Locale and formatting conventions match the existing application behavior.
 */

// ─── Currency (minor units) ───────────────────────────────

const dashboardCurrencyFormatters = new Map<string, Intl.NumberFormat>();

function getDashboardCurrencyFormatter(currency: string): Intl.NumberFormat {
  let formatter = dashboardCurrencyFormatters.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    dashboardCurrencyFormatters.set(currency, formatter);
  }
  return formatter;
}

/**
 * Format an integer minor-unit amount as a currency string.
 * Used in the dashboard for persisted quotation values.
 *
 * @example formatCurrency(1500, "USD") // "$15"
 */
export function formatCurrency(minorUnits: number, currency: string): string {
  return getDashboardCurrencyFormatter(currency).format(minorUnits / 100);
}

// ─── Date ─────────────────────────────────────────────────

const dateFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/**
 * Format a Date as a human-readable string.
 *
 * @example formatDate(new Date("2026-03-15")) // "15 Mar 2026"
 */
export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

// ─── Cents (USD) ──────────────────────────────────────────

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

/**
 * Format a cent amount (integer) as a USD currency string.
 * Used in the quote builder and service request form for live pricing.
 *
 * @example formatCents(1500) // "$15.00"
 */
export function formatCents(cents: number): string {
  return usdFormatter.format(cents / 100);
}
