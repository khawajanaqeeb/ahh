"use client";

import Link from "next/link";
import { useState } from "react";

const projects = [
  {
    id: "hooria-villas",
    name: "Hooria Villas",
    basePrice: 2800000,
    minDown: 8,
    maxDown: 30,
    tenures: [24, 36, 48],
    defaultTenure: 36,
    location: "Northern Bypass, Near Gulshan-e-Maymar",
    size: "120 Sq Yards",
    color: "#D4AF37",
  },
  {
    id: "summer-farm-houses",
    name: "Summer Farm Houses",
    basePrice: 4500000,
    minDown: 10,
    maxDown: 40,
    tenures: [12, 24, 36],
    defaultTenure: 24,
    location: "Karachi, Sindh",
    size: "Various Sizes",
    color: "#C5A028",
  },
  {
    id: "labour-city",
    name: "Labour City",
    basePrice: 1800000,
    minDown: 10,
    maxDown: 30,
    tenures: [24, 36, 48],
    defaultTenure: 36,
    location: "Karachi, Sindh",
    size: "80–120 Sq Yards",
    color: "#E8CC6E",
  },
  {
    id: "ahh-city",
    name: "AHH-City",
    basePrice: 3500000,
    minDown: 10,
    maxDown: 35,
    tenures: [24, 36, 48],
    defaultTenure: 48,
    location: "Karachi, Sindh",
    size: "120–500 Sq Yards",
    color: "#B8942E",
  },
];

function formatPKR(amount: number) {
  if (amount >= 10000000) return `PKR ${(amount / 10000000).toFixed(2)} Crore`;
  if (amount >= 100000) return `PKR ${(amount / 100000).toFixed(2)} Lakh`;
  return `PKR ${amount.toLocaleString()}`;
}

export default function Calculator() {
  const [selectedProjectId, setSelectedProjectId] = useState("hooria-villas");
  const [downPercent, setDownPercent] = useState(8);
  const [tenure, setTenure] = useState(36);

  const project = projects.find((p) => p.id === selectedProjectId)!;
  const totalPrice = project.basePrice;
  const downPayment = Math.round((downPercent / 100) * totalPrice);
  const remaining = totalPrice - downPayment;
  const monthlyInstallment = Math.round(remaining / tenure);
  const semiAnnualBonus = Math.round(monthlyInstallment * 1.5);
  const possessionCharges = Math.round(totalPrice * 0.05);

  const whatsappMsg = encodeURIComponent(
    `Hello AHH Brothers! I used the Payment Calculator for *${project.name}*.\n\n` +
    `📍 Project: ${project.name}\n` +
    `💰 Total Price: ${formatPKR(totalPrice)}\n` +
    `⬇️ Down Payment (${downPercent}%): ${formatPKR(downPayment)}\n` +
    `📅 Monthly Installment: ${formatPKR(monthlyInstallment)} × ${tenure} months\n\n` +
    `I'd like to book a consultation. Please contact me.`
  );

  return (
    <>
      <div className="page-hero">
        <h1 className="text-gradient-gold">Installment Calculator</h1>
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Payment Calculator</span>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Plan Your Investment</div>
            <h2>Flexible <span className="gold-text">Payment Plans</span></h2>
            <div className="gold-line" />
            <p>Calculate your monthly installments across all AHH Brothers projects. Adjust down payment and tenure to find a plan that works for your budget.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "start" }}>
            {/* Left: Controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Project Selection */}
              <div className="glass-card" style={{ padding: "1.75rem" }}>
                <h3 style={{ color: "#D4AF37", marginBottom: "1.25rem", fontSize: "1rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Select Project</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProjectId(p.id);
                        setDownPercent(p.minDown);
                        setTenure(p.defaultTenure);
                      }}
                      style={{
                        padding: "0.85rem 1rem",
                        borderRadius: "10px",
                        border: `1.5px solid ${selectedProjectId === p.id ? p.color : "rgba(255,255,255,0.08)"}`,
                        background: selectedProjectId === p.id ? `rgba(212,175,55,0.12)` : "rgba(255,255,255,0.03)",
                        color: selectedProjectId === p.id ? p.color : "#8A8A9E",
                        fontWeight: selectedProjectId === p.id ? 700 : 500,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        textAlign: "left",
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>{p.name}</div>
                      <div style={{ fontSize: "0.72rem", opacity: 0.7 }}>{p.size}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Down Payment Slider */}
              <div className="glass-card" style={{ padding: "1.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ color: "#D4AF37", fontSize: "1rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Down Payment</h3>
                  <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "#D4AF37", fontFamily: "var(--font-heading)" }}>{downPercent}%</span>
                </div>
                <input
                  type="range"
                  min={project.minDown}
                  max={project.maxDown}
                  step={1}
                  value={downPercent}
                  onChange={(e) => setDownPercent(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#D4AF37", cursor: "pointer", height: "6px" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontSize: "0.78rem", color: "#8A8A9E" }}>
                  <span>{project.minDown}% Min</span>
                  <span>{project.maxDown}% Max</span>
                </div>
                <div style={{ marginTop: "0.75rem", padding: "0.6rem 1rem", background: "rgba(212,175,55,0.06)", borderRadius: "8px", borderLeft: "3px solid #D4AF37", fontSize: "0.88rem", color: "#D4AF37", fontWeight: 600 }}>
                  Down: {formatPKR(downPayment)}
                </div>
              </div>

              {/* Tenure Selection */}
              <div className="glass-card" style={{ padding: "1.75rem" }}>
                <h3 style={{ color: "#D4AF37", marginBottom: "1rem", fontSize: "1rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Installment Tenure</h3>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {project.tenures.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTenure(t)}
                      style={{
                        flex: 1,
                        padding: "0.75rem",
                        borderRadius: "10px",
                        border: `1.5px solid ${tenure === t ? "#D4AF37" : "rgba(255,255,255,0.08)"}`,
                        background: tenure === t ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.03)",
                        color: tenure === t ? "#D4AF37" : "#8A8A9E",
                        fontWeight: tenure === t ? 700 : 500,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        fontSize: "0.9rem",
                      }}
                    >
                      {t} mo
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Results */}
            <div style={{ position: "sticky", top: "6rem" }}>
              <div className="glass-card" style={{ padding: "2rem", border: "1px solid rgba(212,175,55,0.3)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#D4AF37", boxShadow: "0 0 10px rgba(212,175,55,0.6)" }} />
                  <h3 style={{ color: "#D4AF37", fontSize: "1.1rem", letterSpacing: "0.05em" }}>{project.name} — Payment Breakdown</h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.75rem" }}>
                  {[
                    { label: "Total Plot Price", value: formatPKR(totalPrice), highlight: false },
                    { label: `Down Payment (${downPercent}%)`, value: formatPKR(downPayment), highlight: false },
                    { label: "Remaining Balance", value: formatPKR(remaining), highlight: false },
                    { label: `Monthly Installment × ${tenure}`, value: formatPKR(monthlyInstallment), highlight: true },
                    { label: "Possession Charges (~5%)", value: formatPKR(possessionCharges), highlight: false },
                  ].map(({ label, value, highlight }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.85rem 1rem",
                        borderRadius: "10px",
                        background: highlight ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${highlight ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.06)"}`,
                      }}
                    >
                      <span style={{ color: highlight ? "#D4AF37" : "#8A8A9E", fontSize: "0.88rem" }}>{label}</span>
                      <span style={{ color: highlight ? "#E8CC6E" : "#F5F5F7", fontWeight: 700, fontSize: highlight ? "1.1rem" : "0.95rem" }}>{value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: "rgba(212,175,55,0.06)", borderRadius: "10px", padding: "1rem", marginBottom: "1.5rem", border: "1px solid rgba(212,175,55,0.15)" }}>
                  <div style={{ fontSize: "0.78rem", color: "#8A8A9E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Note</div>
                  <p style={{ fontSize: "0.82rem", color: "#C5C5D3", lineHeight: 1.6 }}>
                    Prices are indicative and subject to availability. Final payment schedule confirmed at time of booking. Possession charges may vary by project.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <a
                    href={`https://wa.me/923111123160?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold"
                    style={{ justifyContent: "center", textAlign: "center" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    Send to WhatsApp
                  </a>
                  <Link href={`/contact?project=${encodeURIComponent(project.name)}`} className="btn-outline" style={{ justifyContent: "center", textAlign: "center" }}>
                    Book Consultation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Plans Overview */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>All <span className="gold-text">Project Prices</span></h2>
            <div className="gold-line" />
            <p>Starting prices across all active AHH Brothers developments.</p>
          </div>
          <div className="grid-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {projects.map((p) => (
              <div
                key={p.id}
                className="glass-card"
                style={{ padding: "1.5rem", cursor: "pointer", border: `1px solid ${selectedProjectId === p.id ? p.color + "60" : "rgba(255,255,255,0.07)"}` }}
                onClick={() => { setSelectedProjectId(p.id); setDownPercent(p.minDown); setTenure(p.defaultTenure); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              >
                <div style={{ fontSize: "0.7rem", color: p.color, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.5rem" }}>{p.size}</div>
                <h3 style={{ color: "#F5F5F7", fontSize: "1.1rem", marginBottom: "0.4rem" }}>{p.name}</h3>
                <div style={{ color: "#8A8A9E", fontSize: "0.8rem", marginBottom: "0.85rem" }}>{p.location}</div>
                <div style={{ color: p.color, fontWeight: 800, fontSize: "1.3rem", fontFamily: "var(--font-heading)" }}>
                  {formatPKR(p.basePrice)}
                </div>
                <div style={{ color: "#8A8A9E", fontSize: "0.75rem", marginTop: "0.2rem" }}>Starting price</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
