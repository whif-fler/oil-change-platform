"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QuoteBuilder } from "@/components/quote-builder";
import { FREQUENCY } from "@/config/catalog";
import type { Frequency } from "@/config/catalog";
import type { PricingBreakdown } from "@/lib/types";

function encodeConfig(config: PricingBreakdown["config"]): string {
  return btoa(JSON.stringify(config));
}

function QuotePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedFrequency = searchParams.get("frequency");
  const initialFrequency: Frequency =
    requestedFrequency && requestedFrequency in FREQUENCY
      ? (requestedFrequency as Frequency)
      : "ONE_TIME";

  const handleContinue = (pricing: PricingBreakdown) => {
    const encoded = encodeConfig(pricing.config);
    router.push(`/request?config=${encoded}`);
  };

  return (
    <>
      {/* Page Hero — narrow, matching concept/quote.html */}
      <section className="pb-2 pt-12">
        <div className="mx-auto max-w-[700px] px-[var(--shell-px-mobile)]">
          <div className="mb-2.5 text-caption font-extrabold uppercase tracking-[0.1em] text-eyebrow">
            Build your quote
          </div>
          <h1 className="mb-3 text-h2 font-semibold leading-[var(--lh-h2)] tracking-[var(--ls-h2)] text-text">
            Configure your service
          </h1>
          <p className="text-[1.02rem] leading-[1.6] text-text-muted">
            Pick your equipment, oil, and any add-ons. Your estimate updates as
            you go&nbsp;— the price is confirmed once you submit your details.
          </p>
        </div>
      </section>

      {/* Builder */}
      <section className="pt-0 pb-[var(--section-py-mobile)]">
        <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)]">
          <QuoteBuilder
            initialFrequency={initialFrequency}
            onContinue={handleContinue}
          />
        </div>
      </section>
    </>
  );
}

export default function QuotePage() {
  return (
    <Suspense>
      <QuotePageContent />
    </Suspense>
  );
}
