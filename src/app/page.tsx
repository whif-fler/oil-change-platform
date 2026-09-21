"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Frequency } from "@/components/sections/frequency";
import { QuoteCta } from "@/components/sections/quote-cta";
import { QuoteBuilderSection } from "@/components/sections/quote-builder-section";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/footer";
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
      <Header />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <Frequency />
        <QuoteCta />
        <QuoteBuilderSection onContinue={handleContinueToRequest} />
        <Contact
          submittedQuote={submittedQuote}
          onResetQuote={handleResetQuote}
        />
      </main>
      <Footer />
    </>
  );
}
