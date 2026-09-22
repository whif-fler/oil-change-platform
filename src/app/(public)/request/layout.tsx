import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Cooking Oil Service | FreshOil",
  description:
    "Complete your service request for on-site fryer oil service — confirm your venue and contact details with FreshOil.",
  alternates: { canonical: "/request" },
  openGraph: { url: "/request" },
};

export default function RequestLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}