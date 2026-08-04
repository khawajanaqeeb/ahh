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
    image: MEDIA.ahhCityLogo,
    poster: MEDIA.posterAhhCityGrowthTerms,
    description: "Government Registered Project under 99-year lease scheme. Features rapid price appreciation (60 Yds up 133% in 2 months, 120 Yds up 100%). Monthly installments starting at Rs 10,000/month.",
    amenities: ["99-Year Leasehold", "Biometric & QR Code Verification", "Prime Highway Location", "Rapid Development", "High Future Returns"],
    paymentBreakdown: {
      residential: [
        { size: "60 SQ YARDS", booking: "Rs 50,000", confirmation: "Rs 25,000", allocation: "Rs 25,000", monthly: "Rs 10,000 × 10", possession: "—", totalCost: "Rs 200,000", todayRate: "Rs 350,000" },
        { size: "120 SQ YARDS", booking: "Rs 100,000", confirmation: "Rs 50,000", allocation: "Rs 50,000", monthly: "Rs 15,000 × 10", possession: "—", totalCost: "Rs 350,000", todayRate: "Rs 500,000" },
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
    image: MEDIA.hooriaVillasLogo,
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
    location: "Scheme 45, Northern Bypass (Survey Number 398, 398/1), Near Gulshan-e-Maymar, Karachi",
    type: "Residential Home Town & Commercial Plots",
    size: "80 Sq Yards (Residential) & 150 Sq Yards (Commercial)",
    status: "Government Approved — 99 Years Leased",
    badge: "active",
    payment: "Res 80 YDS: Rs 600,000 Total | Comm 150 YDS: Rs 1,350,000 Total",
    image: MEDIA.labourCityLogo,
    poster: MEDIA.posterLabourCityPaymentPlan,
    description: "Government Approved 99-Year Leasehold project. Features 80 Sq Yd Residential & 150 Sq Yd Commercial plots with boundary wall, 24/7 security, developed infrastructure, and parks.",
    amenities: ["Boundary Wall Society", "24/7 Security", "All Utilities Available", "Developed Infrastructure & Parks", "Ready for Construction"],
    paymentBreakdown: {
      residential: [
        { size: "80 SQ YARDS (Residential)", booking: "Rs 200,000", confirmation: "Rs 50,000", allocation: "Rs 50,000", monthly: "Rs 10,000 × 12", possession: "Rs 80,000", totalCost: "Rs 600,000" }
      ],
      commercial: {
        title: "Commercial Plots (150 Sq Yards)",
        installment: { booking: "Rs 300,000", confirmation: "Rs 100,000", allocation: "Rs 100,000", monthly: "Rs 15,000 × 12", halfYearly: "Rs 250,000 × 2", possession: "Rs 170,000", totalCost: "Rs 1,350,000" }
      },
      extraCharges: "Corner, West-Open, Road-Facing, Park-Facing: 5% of Total Cost each",
      processingCharges: "Biometric Verification: Rs 5,000 | QR-Code: Rs 5,000 | Site Plan: Rs 5,000"
    }
  },
  {
    id: "summer-farm-houses",
    name: "Summer Farm Houses",
    location: "Gadap Town / Malir, Karachi, Sindh",
    type: "Farm House Community",
    size: "1000 Sq Yards",
    status: "Now Booking (+212% Return)",
    badge: "active",
    payment: "Cash Price: Rs 25 Lacs | +212% Peak Return (Rs 8 Lacs → Rs 25 Lacs in 1.5 Yrs)",
    image: MEDIA.summerFarmhousesLogo,
    poster: MEDIA.posterInterestFreeGrowth,
    description: "Luxury farmhouse community delivering 3x+ growth in just 1.5 years (+212% return). 1000 Sq Yards Farm House plots at Cash Price Rs 25 Lacs.",
    amenities: ["Fruit Orchards", "Private Swimming Pools", "Boundary Wall Security", "Lush Landscapes", "24/7 Power Backup"],
    paymentBreakdown: {
      note: "📌 Cash Price: Rs 25 Lacs for 1000 Sq Yards Farm House plot. (Detailed installment plan schedule will be uploaded soon as announced by developer)."
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
              <div key={p.id} id={p.id} className="project-detail-row glass-card">
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
                </div>

                {/* Content Side */}
                <div className="p-content-side">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <span className="p-type">{p.type}</span>
                    <span className={`p-badge p-badge-${p.badge}`}>{p.status}</span>
                  </div>
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

                  {/* Detailed Payment Plan Tables */}
                  {p.paymentBreakdown?.residential && (
                    <div className="p-payment-card" style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "1.25rem", marginBottom: "1.25rem", border: "1px solid rgba(212,175,55,0.25)" }}>
                      <h4 style={{ color: "#D4AF37", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        📊 Official Payment Schedule Breakdown
                      </h4>

                      {/* Residential Table */}
                      <div className="table-responsive" style={{ overflowX: "auto", marginBottom: "1rem" }}>
                        <table style={{ width: "100%", fontSize: "0.8rem", textAlign: "left", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ background: "rgba(212,175,55,0.15)", color: "#D4AF37", borderBottom: "1px solid rgba(212,175,55,0.3)" }}>
                              <th style={{ padding: "0.5rem 0.6rem" }}>Description</th>
                              {p.paymentBreakdown.residential.map((res, ri) => (
                                <th key={ri} style={{ padding: "0.5rem 0.6rem" }}>{res.size}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                              <td style={{ padding: "0.45rem 0.6rem", color: "#8A8A9E" }}>Booking</td>
                              {p.paymentBreakdown.residential.map((res, ri) => (
                                <td key={ri} style={{ padding: "0.45rem 0.6rem", color: "#F5F5F7", fontWeight: 600 }}>{res.booking}</td>
                              ))}
                            </tr>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                              <td style={{ padding: "0.45rem 0.6rem", color: "#8A8A9E" }}>Confirmation</td>
                              {p.paymentBreakdown.residential.map((res, ri) => (
                                <td key={ri} style={{ padding: "0.45rem 0.6rem", color: "#F5F5F7" }}>{res.confirmation}</td>
                              ))}
                            </tr>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                              <td style={{ padding: "0.45rem 0.6rem", color: "#8A8A9E" }}>Allocation</td>
                              {p.paymentBreakdown.residential.map((res, ri) => (
                                <td key={ri} style={{ padding: "0.45rem 0.6rem", color: "#F5F5F7" }}>{res.allocation}</td>
                              ))}
                            </tr>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                              <td style={{ padding: "0.45rem 0.6rem", color: "#8A8A9E" }}>Monthly Installments</td>
                              {p.paymentBreakdown.residential.map((res, ri) => (
                                <td key={ri} style={{ padding: "0.45rem 0.6rem", color: "#D4AF37", fontWeight: 600 }}>{res.monthly}</td>
                              ))}
                            </tr>
                            {p.paymentBreakdown.residential.some(r => 'possession' in r && r.possession) && (
                              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <td style={{ padding: "0.45rem 0.6rem", color: "#8A8A9E" }}>Possession</td>
                                {p.paymentBreakdown.residential.map((res, ri) => (
                                  <td key={ri} style={{ padding: "0.45rem 0.6rem", color: "#F5F5F7" }}>{('possession' in res && res.possession) ? res.possession : "—"}</td>
                                ))}
                              </tr>
                            )}
                            <tr style={{ background: "rgba(212,175,55,0.1)", fontWeight: 700 }}>
                              <td style={{ padding: "0.55rem 0.6rem", color: "#D4AF37" }}>TOTAL COST</td>
                              {p.paymentBreakdown.residential.map((res, ri) => (
                                <td key={ri} style={{ padding: "0.55rem 0.6rem", color: "#E8CC6E", fontSize: "0.88rem" }}>{res.totalCost}</td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Commercial Shop / Unit Table if present */}
                      {p.paymentBreakdown.commercial && (
                        <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px dashed rgba(212,175,55,0.2)" }}>
                          <div style={{ color: "#E8CC6E", fontWeight: 700, fontSize: "0.82rem", marginBottom: "0.5rem" }}>
                            🏬 {p.paymentBreakdown.commercial.title} {p.paymentBreakdown.commercial.cashPrice ? `(Cash Price: ${p.paymentBreakdown.commercial.cashPrice})` : ''}
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", fontSize: "0.78rem", color: "#C5C5D3", background: "rgba(0,0,0,0.3)", padding: "0.6rem 0.8rem", borderRadius: "6px" }}>
                            <span>Booking: <strong>{p.paymentBreakdown.commercial.installment?.booking}</strong></span>
                            <span>Confirm: <strong>{p.paymentBreakdown.commercial.installment?.confirmation}</strong></span>
                            <span>Alloc: <strong>{p.paymentBreakdown.commercial.installment?.allocation}</strong></span>
                            {p.paymentBreakdown.commercial.installment?.monthly && <span>Monthly: <strong style={{ color: "#D4AF37" }}>{p.paymentBreakdown.commercial.installment.monthly}</strong></span>}
                            {p.paymentBreakdown.commercial.installment?.possession && <span>Possession: <strong>{p.paymentBreakdown.commercial.installment.possession}</strong></span>}
                            <span style={{ color: "#E8CC6E", fontWeight: 700 }}>Total: {p.paymentBreakdown.commercial.installment?.totalCost}</span>
                          </div>
                        </div>
                      )}

                      {/* Extra Charges & Document Fees */}
                      <div className="p-extra-charges-grid" style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: "0.76rem" }}>
                        <div style={{ color: "#8A8A9E" }}>
                          <span style={{ color: "#D4AF37", fontWeight: 700, display: "block" }}>⚡ Extra Charges:</span>
                          Corner, West-Open, Road, Park Facing: <strong>5% of Total Cost</strong>
                        </div>
                        <div style={{ color: "#8A8A9E" }}>
                          <span style={{ color: "#D4AF37", fontWeight: 700, display: "block" }}>📝 Processing Fees:</span>
                          Biometric: <strong>Rs 5,000</strong> | QR-Code: <strong>Rs 5,000</strong> | Site Plan: <strong>Rs 5,000</strong>
                        </div>
                      </div>
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
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(5, 5, 12, 0.95)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.5rem",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          onClick={() => setSelectedPoster(null)}
        >
          {/* Top-Right Close Button */}
          <button
            onClick={() => setSelectedPoster(null)}
            aria-label="Close poster view"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              zIndex: 10000,
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #D4AF37 0%, #B8942E 100%)",
              border: "1.5px solid rgba(255, 255, 255, 0.4)",
              color: "#0A0A0A",
              fontWeight: 900,
              cursor: "pointer",
              fontSize: "1.3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(212, 175, 55, 0.5)",
              transition: "transform 0.2s ease",
            }}
          >
            ✕
          </button>

          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              maxWidth: "98vw",
              maxHeight: "94vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedPoster}
              alt="Official Project Poster"
              width={1600}
              height={2000}
              priority
              style={{
                width: "auto",
                height: "auto",
                maxWidth: "98vw",
                maxHeight: "94vh",
                objectFit: "contain",
                borderRadius: "8px",
                border: "1.5px solid rgba(212, 175, 55, 0.4)",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.8), 0 0 50px rgba(212, 175, 55, 0.15)",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
