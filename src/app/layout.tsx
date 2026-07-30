import type { Metadata } from "next";
import { Playfair_Display, Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "AHH Brothers — Builders & Developers | Premium Real Estate in Karachi",
    template: "%s | AHH Brothers — Builders & Developers",
  },
  description:
    "Founded in 2018, AHH Brothers Builders & Developers has been delivering premium residential and commercial projects in Karachi. Explore Hooria Villas, Summer Farm Houses, Labour City, and AHH-City.",
  keywords: [
    "AHH Brothers",
    "Builders and Developers",
    "Real Estate Karachi",
    "Hooria Villas",
    "Summer Farm Houses",
    "Labour City",
    "AHH City",
    "Residential Plots Karachi",
    "Property Developer Pakistan",
    "Gulshan-e-Maymar",
  ],
  openGraph: {
    title: "AHH Brothers — Builders & Developers",
    description:
      "Premium real estate developer in Karachi since 2018. Residential plots, villas, farm houses, and township projects.",
    type: "website",
    locale: "en_PK",
    siteName: "AHH Brothers — Builders & Developers",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${playfair.variable} ${inter.variable} ${outfit.variable}`}
        style={{ fontFamily: "var(--font-body)" }}
      >
        {/* Top Bar */}
        <Header />

        {/* Sticky Navbar */}
        <Navbar />

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <Footer />

        {/* WhatsApp floating button */}
        <WhatsAppButton />
      </body>
    </html>
  );
}
