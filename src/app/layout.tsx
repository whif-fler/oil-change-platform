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
  title: "FreshOil — Onsite Cooking-Oil Service",
  description:
    "Professional cooking-oil service for restaurants and cafes. Oil changes, deep cleaning, filter replacement, and waste-oil disposal — we come to you.",
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
    <html lang="en">
      <body className={`${manrope.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
