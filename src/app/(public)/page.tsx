import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Frequency } from "@/components/sections/frequency";
import { QuoteCta } from "@/components/sections/quote-cta";
import { ServiceArea } from "@/components/sections/service-area";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <HowItWorks />
      <Frequency />
      <QuoteCta />
      <ServiceArea />
    </>
  );
}
