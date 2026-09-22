import { QuoteBuilder } from "@/components/quote-builder";
import type { PricingBreakdown } from "@/lib/types";

interface QuoteBuilderSectionProps {
  onContinue?: (pricing: PricingBreakdown) => void;
}

export function QuoteBuilderSection({ onContinue }: QuoteBuilderSectionProps) {
  return (
    <section
      id="quote-builder"
      className="bg-surface py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]"
    >
      <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)]">
        <div className="mx-auto mb-10 max-w-[560px] text-center concept:mb-14">
          <div className="mb-2.5 text-caption font-extrabold uppercase tracking-[0.1em] text-eyebrow">
            Build your quote
          </div>
          <h2
            className="mb-2.5 font-semibold text-text"
            style={{
              fontSize: "clamp(1.7rem, 3vw, 2.3rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Configure your service
          </h2>
          <p className="text-[1rem] leading-[1.6] text-text-muted">
            Pick your equipment, oil, and any add-ons. Your estimate updates as
            you go&nbsp;— the price is confirmed once you submit your details.
          </p>
        </div>
        <QuoteBuilder onContinue={onContinue} />
      </div>
    </section>
  );
}
