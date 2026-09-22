import { quotationBreakdownSchema } from "@/lib/validations";
import { formatCurrency } from "@/lib/formatting";

type QuotationSelect = {
  equipmentType: string;
  oilType: string;
  addOns: string[];
  frequency: string;
  totalMinor: number;
  currency: string;
  breakdown: unknown;
};

function humanize(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function QuotationDetails({
  quotation,
}: {
  quotation: QuotationSelect;
}) {
  const result = quotationBreakdownSchema.safeParse(quotation.breakdown);

  if (!result.success) {
    return (
      <div className="rounded-lg bg-surface-muted p-4 text-sm text-text-muted">
        Quotation details are unavailable.
      </div>
    );
  }

  const b = result.data;

  return (
    <div className="space-y-4 text-sm">
      {/* Config summary */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-text-muted">Equipment</span>
          <p className="font-medium text-text">
            {humanize(quotation.equipmentType)}
          </p>
        </div>
        <div>
          <span className="text-xs text-text-muted">Oil type</span>
          <p className="font-medium text-text">
            {humanize(quotation.oilType)}
          </p>
        </div>
        <div>
          <span className="text-xs text-text-muted">Frequency</span>
          <p className="font-medium text-text">
            {humanize(quotation.frequency)}
          </p>
        </div>
        {b.config.addOns.length > 0 && (
          <div>
            <span className="text-xs text-text-muted">Add-ons</span>
            <p className="font-medium text-text">
              {b.config.addOns.map(humanize).join(", ")}
            </p>
          </div>
        )}
      </div>

      {/* Line items */}
      <div className="space-y-2 rounded-lg bg-surface-muted p-4">
        <div className="flex justify-between">
          <span className="text-text-muted">Service fee</span>
          <span className="font-medium text-text">
            {formatCurrency(b.serviceFeeMinor, b.currency)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Oil cost</span>
          <span className="font-medium text-text">
            {formatCurrency(b.oilCostMinor, b.currency)}
          </span>
        </div>
        {b.addOnCostsMinor.map((item) => (
          <div key={item.addOn} className="flex justify-between">
            <span className="text-text-muted">{humanize(item.addOn)}</span>
            <span className="font-medium text-text">
              {formatCurrency(item.costMinor, b.currency)}
            </span>
          </div>
        ))}
        <div className="my-2 border-t border-border" />
        <div className="flex justify-between">
          <span className="text-text-muted">Subtotal</span>
          <span className="font-medium text-text">
            {formatCurrency(b.subtotalMinor, b.currency)}
          </span>
        </div>
        {b.discountMinor > 0 && (
          <div className="flex justify-between">
            <span className="text-text-muted">Monthly discount</span>
            <span className="font-medium text-success">
              −{formatCurrency(b.discountMinor, b.currency)}
            </span>
          </div>
        )}
        <div className="my-2 border-t border-border" />
        <div className="flex justify-between text-base font-semibold">
          <span className="text-text">Estimated total</span>
          <span className="text-text">
            {formatCurrency(b.totalMinor, b.currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
