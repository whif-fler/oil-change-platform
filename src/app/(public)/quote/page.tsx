"use client";

import { useRouter } from "next/navigation";
import { QuoteBuilder } from "@/components/quote-builder";
import type { PricingBreakdown } from "@/lib/types";

function encodeConfig(config: PricingBreakdown["config"]): string {
  return btoa(JSON.stringify(config));
}

export default function QuotePage() {
  const router = useRouter();

  const handleContinue = (pricing: PricingBreakdown) => {
    const encoded = encodeConfig(pricing.config);
    router.push(`/request?config=${encoded}`);
  };

  return (
    <section
      id="quote"
      className="bg-surface py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]"
    >
      <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)] lg:px-[var(--shell-px-desktop)]">
        <div className="mb-12 text-center lg:mb-16">
          <h1 className="mb-4 text-h2 font-semibold leading-[var(--lh-h2)] tracking-[var(--ls-h2)] text-text">
            Configure your service
          </h1>
          <p className="mx-auto max-w-2xl text-body text-text-muted">
            Select your equipment, oil type, and any add‑ons to see an
            estimated&nbsp;price.
          </p>
        </div>

        <QuoteBuilder onContinue={handleContinue} />
      </div>
    </section>
  );
}
