"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { MEDIA } from "@/lib/media";

const steps = [
  {
    num: "01",
    title: "Choose Your Project",
    desc: "Browse our active projects online. Our overseas team provides virtual video walkthroughs and detailed floor plan packages via WhatsApp or email.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" fill="rgba(212,175,55,0.12)"/>
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "Submit Your Application",
    desc: "Fill in our online form or WhatsApp us with your CNIC copy, passport, and preferred project/plot. Our overseas team contacts you within 24 hours.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="rgba(212,175,55,0.12)"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    num: "03",
    title: "Power of Attorney",
    desc: "Authorize a trusted local representative (family member or AHH Brothers' legal team) to sign documents on your behalf via a verified POA from your country's Pakistani Embassy.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(212,175,55,0.12)"/>
      </svg>
    ),
  },
  {
    num: "04",
    title: "Secure Payment Transfer",
    desc: "Transfer your down payment via bank wire transfer (SWIFT) or Western Union. We accept transfers from UAE, Saudi Arabia, UK, USA, Canada, and all GCC countries.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" fill="rgba(212,175,55,0.12)"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    num: "05",
    title: "Allotment & Documentation",
    desc: "Receive your Allotment Letter, payment receipts, and legal documents digitally. All originals are couriered to your international address or kept secure until your Pakistan visit.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" stroke="#D4AF37"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" fill="rgba(212,175,55,0.12)"/>
      </svg>
    ),
  },
];

const currencies = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸", rate: 278 },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪", rate: 75.7 },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦", rate: 74.1 },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", rate: 352 },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", rate: 204 },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", rate: 180 },
];

const countries = [
  "United Arab Emirates", "Saudi Arabia", "United Kingdom", "United States",
  "Canada", "Australia", "Qatar", "Kuwait", "Bahrain", "Oman",
  "Malaysia", "Germany", "Italy", "Spain", "Other",
];

export default function OverseasInvestors() {
  const [pkrAmount, setPkrAmount] = useState(2800000);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", country: "", project: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const selectedCurr = currencies.find((c) => c.code === selectedCurrency)!;
  const convertedAmount = (pkrAmount / selectedCurr.rate).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hello AHH Brothers! I am an overseas Pakistani interested in investing.\n\n` +
      `Name: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nCountry: ${formData.country}\nProject Interest: ${formData.project}\n\nMessage: ${formData.message}`
    );
    window.open(`https://wa.me/923111123160?text=${msg}`, "_blank");
    setSubmitted(true);
  };

  return (
    <>
      <div className="page-hero">
        <h1 className="text-gradient-gold">Overseas Investors Hub</h1>
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Overseas Investors</span>
        </div>
      </div>

      {/* Hero Intro */}
      <section className="section">
        <div className="container">
          <div className="overseas-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
            <div>
              <div className="section-label">For Overseas Pakistanis</div>
              <h2 className="section-title">Invest in Pakistan <span className="text-gradient-gold">From Anywhere</span></h2>
              <div className="gold-line-left" />
              <p className="intro-text">
                Living abroad doesn&apos;t mean missing Pakistan&apos;s highest-yielding real estate opportunities. AHH Brothers offers dedicated <strong>Interest-Free Business Investment Plans</strong> designed specifically for Pakistanis in UAE, Saudi Arabia, UK, USA, and worldwide.
              </p>
              <p className="normal-text" style={{ marginTop: "1rem" }}>
                Earn <strong>PKR 40,000 to 45,000 PER MONTH</strong> on a 1 Million PKR investment (1 to 5 years tenure), backed by a <strong>legally binding contract signed directly with AHH Brothers</strong> and a <strong>Full-Payment Post-Dated Cheque</strong> as ultimate security for your principal.
              </p>
              <div style={{ background: "rgba(212,175,55,0.08)", borderLeft: "3px solid #D4AF37", padding: "0.85rem 1rem", borderRadius: "0 8px 8px 0", marginTop: "1.25rem" }}>
                <span style={{ color: "#D4AF37", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>📈 Proven Track Record</span>
                <span style={{ color: "#F5F5F7", fontSize: "0.85rem" }}>4 Active Projects delivering up to 212%+ peak return (Summer Farm Houses +212%, Hooria Villas +122%, Labour City +200%, AHH City +133%).</span>
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.75rem", flexWrap: "wrap" }}>
                <a href="https://wa.me/923111123160?text=Hello%20AHH%20Brothers%2C%20I%20am%20an%20overseas%20Pakistani%20interested%20in%20the%20Monthly%20Profit%20Investment%20Plan." target="_blank" rel="noopener noreferrer" className="btn-gold">
                  WhatsApp Overseas Investment Desk
                </a>
                <a href="#inquiry-form" className="btn-outline">Submit Inquiry</a>
              </div>
            </div>

            {/* Currency Converter */}
            <div className="glass-card" style={{ padding: "2rem", border: "1px solid rgba(212,175,55,0.3)" }}>
              <h3 style={{ color: "#D4AF37", marginBottom: "0.5rem", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Currency Converter</h3>
              <p style={{ color: "#8A8A9E", fontSize: "0.82rem", marginBottom: "1.5rem" }}>Estimated rates — always confirm with your bank.</p>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ color: "#8A8A9E", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.5rem" }}>Amount in PKR</label>
                <input
                  type="number"
                  value={pkrAmount}
                  onChange={(e) => setPkrAmount(Number(e.target.value))}
                  style={{
                    width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(212,175,55,0.25)", borderRadius: "8px",
                    color: "#F5F5F7", fontSize: "1rem", outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ color: "#8A8A9E", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.5rem" }}>Convert To</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                  {currencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setSelectedCurrency(c.code)}
                      style={{
                        padding: "0.6rem 0.5rem", borderRadius: "8px",
                        border: `1.5px solid ${selectedCurrency === c.code ? "#D4AF37" : "rgba(255,255,255,0.07)"}`,
                        background: selectedCurrency === c.code ? "rgba(212,175,55,0.12)" : "transparent",
                        color: selectedCurrency === c.code ? "#D4AF37" : "#8A8A9E",
                        cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, transition: "all 0.2s",
                      }}
                    >
                      {c.flag} {c.code}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background: "rgba(212,175,55,0.08)", borderRadius: "12px", padding: "1.25rem", textAlign: "center", border: "1px solid rgba(212,175,55,0.3)" }}>
                <div style={{ color: "#8A8A9E", fontSize: "0.78rem", marginBottom: "0.4rem" }}>PKR {pkrAmount.toLocaleString()} equals approximately</div>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#D4AF37", fontFamily: "var(--font-heading)" }}>
                  {selectedCurr.flag} {Number(convertedAmount).toLocaleString()} {selectedCurrency}
                </div>
                <div style={{ color: "#8A8A9E", fontSize: "0.75rem", marginTop: "0.4rem" }}>Rate: 1 {selectedCurrency} ≈ PKR {selectedCurr.rate}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Buy Remotely */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Remote Buying Process</div>
            <h2>How to <span className="gold-text">Invest Remotely</span></h2>
            <div className="gold-line" />
            <p>A simple 5-step process designed for overseas Pakistani investors.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: 800, margin: "0 auto" }}>
            {steps.map((step) => (
              <div key={step.num} className="glass-card" style={{ padding: "1.5rem 2rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, width: 56, height: 56, borderRadius: "12px", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {step.icon}
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#D4AF37", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "0.35rem" }}>STEP {step.num}</div>
                  <h3 style={{ color: "#F5F5F7", fontSize: "1.05rem", marginBottom: "0.5rem" }}>{step.title}</h3>
                  <p style={{ color: "#8A8A9E", fontSize: "0.88rem", lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OFFICIAL INVESTMENT POSTERS ===== */}
      <section className="section" style={{ background: "rgba(10,10,22,0.8)", borderTop: "1px solid rgba(212,175,55,0.15)", borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">Proven Performance</div>
            <h2>Official Investment <span className="gold-text">Posters &amp; Rate Growth</span></h2>
            <div className="gold-line" />
            <p>Every AHH Brothers project delivers consistent compounding returns — outpacing inflation and conventional savings.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {[
              { title: "Monthly Profit Plan (1-5 Yrs)", desc: "Rs 40,000 to 45,000/mo per 1 Million PKR investment. Full payment post-dated cheque security.", image: MEDIA.posterInvestmentOpportunity },
              { title: "Interest-Free Growth Record", desc: "Proven track record across 4 active projects delivering up to 212%+ peak return.", image: MEDIA.posterInterestFreeGrowth },
              { title: "AHH City Rate Growth & Terms", desc: "Scheme 45, Northern Bypass. 60 Yds (Rs 2 Lacs → Rs 3.5 Lacs) & 120 Yds (Rs 3.5 Lacs → Rs 5 Lacs).", image: MEDIA.posterAhhCityGrowthTerms },
              { title: "Hooria Villas Payment Plan", desc: "120 Sq Yd Res (Rs 10 Lacs total) & 150 Sq Yd Comm (Rs 15 Lacs total). 2.5x growth in 2 yrs.", image: MEDIA.posterHooriaVillasPaymentPlan },
            ].map((p, idx) => (
              <div key={idx} className="glass-card" style={{ padding: "1.25rem", borderRadius: "12px", border: "1px solid rgba(212,175,55,0.2)" }}>
                <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "1rem" }}>
                  <Image src={p.image} alt={p.title} width={500} height={650} style={{ width: "100%", height: "auto", maxHeight: "350px", objectFit: "contain", background: "#0D0D1A" }} />
                </div>
                <h3 style={{ color: "#D4AF37", fontSize: "1.05rem", marginBottom: "0.4rem" }}>{p.title}</h3>
                <p style={{ color: "#8A8A9E", fontSize: "0.85rem", lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="section" id="inquiry-form">
        <div className="container" style={{ maxWidth: 680 }}>
          <div className="section-header">
            <div className="section-label">Get Started</div>
            <h2>Overseas <span className="gold-text">Investment Inquiry</span></h2>
            <div className="gold-line" />
            <p>Fill in your details and our dedicated overseas team will reach out within 24 hours.</p>
          </div>

          {submitted ? (
            <div className="glass-card" style={{ padding: "2.5rem", textAlign: "center", border: "1px solid rgba(212,175,55,0.3)" }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" style={{ margin: "0 auto 1rem" }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" fill="rgba(212,175,55,0.1)"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <h3 style={{ color: "#D4AF37", fontSize: "1.4rem", marginBottom: "0.5rem" }}>Inquiry Submitted!</h3>
              <p style={{ color: "#8A8A9E" }}>Your WhatsApp inquiry was sent. Our overseas team will contact you within 24 hours.</p>
              <Link href="/" className="btn-gold" style={{ display: "inline-flex", marginTop: "1.5rem" }}>Back to Home</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "Muhammad Ahmed" },
                { label: "WhatsApp / Phone", key: "phone", type: "tel", placeholder: "+971 50 123 4567" },
                { label: "Email Address", key: "email", type: "email", placeholder: "m.ahmed@email.com" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ display: "block", color: "#8A8A9E", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    required
                    value={(formData as Record<string, string>)[key]}
                    onChange={(e) => setFormData((p) => ({ ...p, [key]: e.target.value }))}
                    style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#F5F5F7", fontSize: "0.95rem", outline: "none" }}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: "block", color: "#8A8A9E", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Country of Residence</label>
                <select
                  required
                  value={formData.country}
                  onChange={(e) => setFormData((p) => ({ ...p, country: e.target.value }))}
                  style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(14,14,30,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#F5F5F7", fontSize: "0.95rem", outline: "none" }}
                >
                  <option value="">Select your country</option>
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", color: "#8A8A9E", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Project Interest</label>
                <select
                  value={formData.project}
                  onChange={(e) => setFormData((p) => ({ ...p, project: e.target.value }))}
                  style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(14,14,30,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#F5F5F7", fontSize: "0.95rem", outline: "none" }}
                >
                  <option value="">Select project (optional)</option>
                  <option>Hooria Villas</option>
                  <option>Summer Farm Houses</option>
                  <option>Labour City</option>
                  <option>AHH-City</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", color: "#8A8A9E", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Message</label>
                <textarea
                  rows={3}
                  placeholder="I am interested in investing from abroad..."
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#F5F5F7", fontSize: "0.95rem", outline: "none", resize: "vertical" }}
                />
              </div>
              <button type="submit" className="btn-gold" style={{ justifyContent: "center" }}>
                Send via WhatsApp
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
