import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AdminLeftSidebar from "@/components/AdminLeftSidebar";
import { createClient } from "@/utils/supabase/server";
import { isEmailAdmin } from "@/lib/constants";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0D0D1A",
};

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch user role for admin access control
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let isAdmin = false;
  if (user) {
    const hasAdminEmail = isEmailAdmin(user.email);
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      
      isAdmin = profile?.role === 'admin' || profile?.role === 'accounts' || hasAdminEmail || user.user_metadata?.role === 'admin';
    } catch {
      isAdmin = hasAdminEmail || user.user_metadata?.role === 'admin';
    }
  }
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} ${outfit.variable}`}
        style={{ fontFamily: "var(--font-body)" }}
        suppressHydrationWarning
      >
        {/* Top Bar */}
        <Header />

        {/* Sticky Navbar */}
        <Navbar isAdmin={isAdmin} />

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <Footer />

        {/* WhatsApp floating button */}
        <WhatsAppButton />

        {/* Left Side Admin Panel (Only injected for admins) */}
        {isAdmin && <AdminLeftSidebar />}
      </body>
    </html>
  );
}
