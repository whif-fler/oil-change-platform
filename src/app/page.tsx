import { Header } from "@/components/header";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Frequency } from "@/components/sections/frequency";
import { QuoteCta } from "@/components/sections/quote-cta";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <Frequency />
        <QuoteCta />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
