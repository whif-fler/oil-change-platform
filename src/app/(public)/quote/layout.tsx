import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get a Cooking Oil Service Quote | FreshOil",
  description:
    "Configure fryer equipment, capacity, oil type, add-ons, and service frequency to get an estimate for on-site cooking-oil service.",
  alternates: { canonical: "/quote" },
  openGraph: { url: "/quote" },
};

export default function QuoteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}