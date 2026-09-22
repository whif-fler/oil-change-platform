import type { Metadata } from "next";
import { ContactHero } from "@/components/sections/contact-hero";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "Contact FreshOil",
  description:
    "Send FreshOil a message about on-site cooking-oil and fryer service for restaurants and cafés. We'll get back to you soon.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <Contact />
    </>
  );
}
