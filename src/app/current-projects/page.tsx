"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MEDIA } from "@/lib/media";

const currentProjects = [
  {
    id: "ahh-city",
    name: "AHH-City",
    location: "Scheme 45, Northern Bypass (Survey Number 297), Karachi",
    type: "Residential & Commercial Units",
    size: "60 & 120 Sq Yards | Commercial Shops 100 Sq Ft",
    status: "Rapid Site Development (Rates Rising!)",
    badge: "active",
    payment: "60 YDS: Rs 200,000 (Today Rate: Rs 350,000) | 120 YDS: Rs 350,000 (Today Rate: Rs 500,000)",
    image: MEDIA.posterAhhCityGrowthTerms,
    poster: MEDIA.posterAhhCityGrowthTerms,
    description: "Government Registered Project under 99-year lease scheme. Features rapid price appreciation (60 Yds up 133% in 2 months, 120 Yds up 100%). Monthly installments starting at Rs 10,000/month.",
    amenities: ["99-Year Leasehold", "Biometric & QR Code Verification", "Prime Highway Location", "Rapid Development", "High Future Returns"],
    paymentBreakdown: {
      residential: [
        { size: "60 SQ YARDS", booking: "Rs 50,000", confirmation: "Rs 25,000", allocation: "Rs 25,000", monthly: "Rs 10,000 × 10", totalCost: "Rs 200,000", todayRate: "Rs 350,000" },
        { size: "120 SQ YARDS", booking: "Rs 100,000", confirmation: "Rs 50,000", allocation: "Rs 50,000", monthly: "Rs 15,000 × 10", totalCost: "Rs 350,000", todayRate: "Rs 500,000" },
      ],
      commercial: {
        title: "Commercial Shops (100 Sq Ft)",
        cashPrice: "Rs 350,000",
        installment: { booking: "Rs 200,000", confirmation: "Rs 50,000", allocation: "Rs 50,000", possession: "Rs 50,000", totalCost: "Rs 350,000" }
      },
      extraCharges: "Corner, West-Open, Road-Facing, Park-Facing: 5% of Total Cost each",
      processingCharges: "Biometric Verification: Rs 5,000 | QR-Code: Rs 5,000 | Site Plan: Rs 5,000"
    }
  },
  {
    id: "hooria-villas",
    name: "Hooria Villas",
    location: "Scheme 45, Northern Bypass (Survey Number 395, 396, 397), Karachi",
    type: "Residential & Commercial Plots",
    size: "120 Sq Yds (Residential) & 150 Sq Yds (Commercial)",
    status: "Under Development (+122% Return)",
    badge: "active",
    payment: "Res 120 YDS: Total Rs 1,000,000 | Comm 150 YDS: Total Rs 1,500,000",
    image: MEDIA.posterHooriaVillasPaymentPlan,
    poster: MEDIA.posterHooriaVillasPaymentPlan,
    description: "Proven 2.5x growth in 2 years (+122% return). Premium gated community near Gulshan-e-Maymar with complete boundary wall and active street infrastructure.",
    amenities: ["Gated Township", "24/7 Security", "Wide Asphalt Roads", "Mosque & Parks", "NOC Cleared"],
    paymentBreakdown: {
      residential: [
        { size: "120 SQ YARDS (Residential)", booking: "Rs 200,000", confirmation: "Rs 50,000", allocation: "Rs 50,000", monthly: "Rs 25,000 × 24", possession: "Rs 100,000", totalCost: "Rs 1,000,000" }
      ],
      commercial: {
        title: "Commercial Plots (150 Sq Yards)",
        installment: { booking: "Rs 300,000", confirmation: "Rs 100,000", allocation: "Rs 100,000", monthly: "Rs 30,000 × 24", halfYearly: "Rs 50,000 × 4", possession: "Rs 80,000", totalCost: "Rs 1,500,000" }
      },
      extraCharges: "Corner, West-Open, Road-Facing, Park-Facing: 5% of Total Cost each",
      processingCharges: "Biometric Verification: Rs 5,000 | QR-Code: Rs 5,000 | Site Plan: Rs 5,000"
    }
  },
  {
    id: "labour-city",
    name: "Labour City",
    location: "Industrial Corridor, Karachi",
    type: "Affordable Housing Plots",
    size: "80 & 120 Sq Yards",
    status: "Now Booking (+200% Return)",
    badge: "active",
    payment: "3x Growth in 1 Year (Rs 2 Lacs → Rs 6 Lacs) | Monthly from Rs 6,000",
    image: MEDIA.posterInterestFreeGrowth,
    poster: MEDIA.posterInterestFreeGrowth,
    description: "Designed specifically to bring affordable land within reach of working professionals. Proven 3x growth in 1 year (+200% return). Subsidised down payments and flexible terms.",
    amenities: ["Proximity to Industrial Hubs", "Public Transport Links", "Primary School & Clinic", "Community Center", "Basic Utilities"],
    paymentBreakdown: {
      note: "3x Price Growth in 1 Year (Rs 2,000,000 → Rs 6,000,000). Flexible monthly installment plans available from Rs 6,000/month."
    }
  },
  {
    id: "summer-farm-houses",
    name: "Summer Farm Houses",
    location: "Gadap Town / Malir, Karachi, Sindh",
    type: "Farm House Community",
    size: "2000 to 4000 Sq Yards",
    status: "Now Booking (+212% Return)",
    badge: "active",
    payment: "+212% Peak Return (Rs 8 Lacs → Rs 25 Lacs in 1.5 Years)",
    image: MEDIA.summerFarmhousesLogo,
    poster: MEDIA.posterInterestFreeGrowth,
    description: "Luxury farmhouse community delivering 3x+ growth in just 1.5 years (+212% return). Escape to your private countryside retreat with lush greenery and private pool options.",
    amenities: ["Fruit Orchards", "Private Swimming Pools", "Boundary Wall Security", "Lush Landscapes", "24/7 Power Backup"],
    paymentBreakdown: {
      note: "📌 Note: Updated payment schedule details will be uploaded soon as announced by developer."
    }
  },
];

export default function CurrentProjects() {
  const [selectedPoster, setSelectedPoster] = useState<string | null>(null);

  return (
    <>
      <div className="page-hero">
        <h1 className="text-gradient-gold">Current Projects</h1>
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Current Projects</span>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Active Developments & <span className="gold-text">Official Payment Schedules</span></h2>
            <div className="gold-line" />
            <p>Explore updated government-approved payment plans, rate growth trends, and official project posters below.</p>
          </div>

          <div className="project-detail-list">
            {currentProjects.map((p) => (
              <div key={p.id} id={p.id} className="project-detail-row glass-card" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "2rem" }}>
                {/* Poster / Image side */}
                <div className="p-image-side" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(10,10,22,0.6)" }}>
                  <div style={{ position: "relative", width: "100%", height: "auto", cursor: "pointer", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(212,175,55,0.25)" }} onClick={() => setSelectedPoster(p.poster)}>
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={600}
                      height={750}
                      className="p-detail-img"
                      style={{ objectFit: "contain", width: "100%", height: "auto", maxHeight: "420px", display: "block" }}
                    />
                    <div style={{ position: "absolute", bottom: "10px", right: "10px", background: "rgba(10,10,26,0.9)", color: "#D4AF37", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, border: "1px solid rgba(212,175,55,0.3)" }}>
                      🔍 Tap to View Full Poster
                    </div>
                  </div>
                  <div className={`p-badge p-badge-${p.badge}`} style={{ marginTop: "0.75rem" }}>{p.status}</div>
                </div>

                {/* Content Side */}
                <div className="p-content-side">
                  <span className="p-type">{p.type}</span>
                  <h2>{p.name}</h2>
                  
                  <div className="p-meta">
                    <div className="p-meta-item" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <strong>Location:</strong> {p.location}
                    </div>
                    <div className="p-meta-item" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18" strokeWidth="1"/></svg>
                      <strong>Plot Sizes:</strong> {p.size}
                    </div>
                  </div>

                  <p className="p-desc">{p.description}</p>

                  <div className="p-payment-highlight" style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(212,175,55,0.08)", borderLeft: "3px solid #D4AF37", padding: "0.85rem 1rem", borderRadius: "0 8px 8px 0", marginBottom: "1.25rem" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    <span><strong>Payment Plan:</strong> {p.payment}</span>
                  </div>

                  {/* Structured Payment Breakdown Table / Info */}
                  {p.paymentBreakdown?.residential && (
                    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "1rem", marginBottom: "1.25rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <h4 style={{ color: "#D4AF37", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Official Schedule Summary</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {p.paymentBreakdown.residential.map((res, ri) => (
                          <div key={ri} style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", fontSize: "0.83rem", color: "#C5C5D3", borderBottom: "1px dashed rgba(255,255,255,0.08)", paddingBottom: "0.4rem" }}>
                            <span style={{ fontWeight: 600, color: "#F5F5F7" }}>{res.size}</span>
                            <span>Booking: <strong style={{ color: "#D4AF37" }}>{res.booking}</strong> | Total Cost: <strong style={{ color: "#E8CC6E" }}>{res.totalCost}</strong></span>
                          </div>
                        ))}
                      </div>
                      {p.paymentBreakdown.extraCharges && (
                        <div style={{ fontSize: "0.76rem", color: "#8A8A9E", marginTop: "0.6rem" }}>
                          ⚠️ {p.paymentBreakdown.extraCharges}
                        </div>
                      )}
                    </div>
                  )}

                  {p.paymentBreakdown?.note && (
                    <div style={{ background: "rgba(212,175,55,0.06)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1.25rem", border: "1px solid rgba(212,175,55,0.2)", fontSize: "0.85rem", color: "#D4AF37" }}>
                      {p.paymentBreakdown.note}
                    </div>
                  )}

                  <div className="p-action-row" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
                    <Link href={`/contact?project=${encodeURIComponent(p.name)}`} className="btn-gold">
                      Book Now / Inquiry
                    </Link>
                    <button onClick={() => setSelectedPoster(p.poster)} className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                      📄 View Full Poster
                    </button>
                    <a
                      href={`https://wa.me/923111123160?text=Hello%20AHH%20Brothers%2C%20I%20am%20interested%20in%20${encodeURIComponent(p.name)}`}
                      target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ color: "#25D366", borderColor: "#25D366" }}
                    >
                      WhatsApp Inquiry
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox for Poster Images */}
      {selectedPoster && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", backdropFilter: "blur(8px)" }} onClick={() => setSelectedPoster(null)}>
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedPoster(null)} style={{ position: "absolute", top: "-15px", right: "-15px", width: 40, height: 40, borderRadius: "50%", background: "#D4AF37", border: "none", color: "#000", fontWeight: 800, cursor: "pointer", fontSize: "1.2rem", zIndex: 10000 }}>✕</button>
            <Image src={selectedPoster} alt="Official Project Poster" width={900} height={1200} style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", borderRadius: "12px", border: "2px solid #D4AF37" }} />
          </div>
        </div>
      )}
    </>
  );
}
