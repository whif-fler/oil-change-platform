"use client";

import { useRouter } from "next/navigation";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Frequency } from "@/components/sections/frequency";
import { QuoteCta } from "@/components/sections/quote-cta";
import { QuoteBuilderSection } from "@/components/sections/quote-builder-section";
import { Contact } from "@/components/sections/contact";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { PricingBreakdown } from "@/lib/types";

function encodeConfig(config: PricingBreakdown["config"]): string {
  return btoa(JSON.stringify(config));
}

export default function Home() {
  const router = useRouter();

  const handleContinueToRequest = (pricing: PricingBreakdown) => {
    const encoded = encodeConfig(pricing.config);
    router.push(`/request?config=${encoded}`);
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
      <Contact />
    </>
  );
}
