import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oil-change-platform-gilt.vercel.app"),
  title: "FreshOil — On-Site Cooking Oil Service",
  description:
    "On-site cooking-oil and fryer service for restaurants and cafés. Oil changes, deep cleaning, filter replacement, and waste-oil disposal — one-time or monthly.",
  openGraph: {
    type: "website",
    siteName: "FreshOil",
    url: "/",
    images: [
      {
        url: "/images/hero-commercial-fryer.jpg",
        width: 1600,
        height: 1067,
        alt: "Commercial deep fryer with stainless steel basket in a restaurant kitchen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
