"use client";

import { useState } from "react";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Frequency } from "@/components/sections/frequency";
import { QuoteCta } from "@/components/sections/quote-cta";
import { QuoteBuilderSection } from "@/components/sections/quote-builder-section";
import { Contact } from "@/components/sections/contact";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { PricingBreakdown } from "@/lib/types";

export default function Home() {
  const [submittedQuote, setSubmittedQuote] =
    useState<PricingBreakdown | null>(null);

  const handleContinueToRequest = (pricing: PricingBreakdown) => {
    setSubmittedQuote(pricing);
  };

  const handleResetQuote = () => {
    setSubmittedQuote(null);
    const el = document.getElementById("quote-builder");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Hero />
      <ScrollReveal>
        <Services />
      </ScrollReveal>
      <ScrollReveal>
        <HowItWorks />
      </ScrollReveal>
      <ScrollReveal>
        <Frequency />
      </ScrollReveal>
      <ScrollReveal>
        <QuoteCta />
      </ScrollReveal>
      <QuoteBuilderSection onContinue={handleContinueToRequest} />
      <Contact
        submittedQuote={submittedQuote}
        onResetQuote={handleResetQuote}
      />
    </>
  );
}
