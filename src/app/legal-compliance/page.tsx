"use client";

import Link from "next/link";
import { useState } from "react";

const legalSteps = [
  {
    num: "01",
    title: "Application & Token",
    desc: "Submit a booking application form with your CNIC, along with a token payment to reserve the plot. AHH Brothers issues you a Token Receipt (payment proof).",
    docs: ["CNIC (original + copy)", "Passport-size photos", "Token payment receipt"],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="rgba(212,175,55,0.1)"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "Allotment Letter",
    desc: "Upon down payment completion, AHH Brothers issues an official Allotment Letter specifying your plot number, block, size, total price, and payment schedule.",
    docs: ["Allotment Letter (company letterhead)", "Down payment receipts", "Plot No. & Block details"],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" fill="rgba(212,175,55,0.1)"/>
        <path d="M9 9h6M9 12h6M9 15h4"/>
      </svg>
    ),
  },
  {
    num: "03",
    title: "Installment Payments",
    desc: "Follow the agreed payment schedule. Each installment is acknowledged with a dated receipt. Maintain all payment proofs — they form your legal chain of ownership.",
    docs: ["Stamped payment receipts per installment", "Bank transfer slips (if applicable)", "Payment ledger copy"],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" fill="rgba(212,175,55,0.1)"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    num: "04",
    title: "NOC & Possession",
    desc: "After full payment, AHH Brothers initiates your No Objection Certificate (NOC) from the relevant authority (SBCA/LDA). This certifies your legal right to the land.",
    docs: ["NOC from SBCA / LDA", "Possession letter from developer", "Final payment clearance certificate"],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(212,175,55,0.1)"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    num: "05",
    title: "Registry & Transfer",
    desc: "The final ownership registration is executed at the Sub-Registrar's office. The property is legally transferred to your name with a stamped Deed of Sale.",
    docs: ["Deed of Sale (stamp paper)", "Sub-Registrar stamp & registration", "CNIC of both parties", "Witness signatures"],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" stroke="#D4AF37"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" fill="rgba(212,175,55,0.1)"/>
      </svg>
    ),
  },
];

const faqs = [
  {
    q: "What is a NOC and why do I need it?",
    a: "A No Objection Certificate (NOC) is issued by Sindh Building Control Authority (SBCA) or relevant local authority. It confirms that the development is legally approved, and your plot is free from encumbrances. Always insist on an NOC before final payment.",
  },
  {
    q: "What is an Allotment Letter?",
    a: "An Allotment Letter is the developer's official document confirming your specific plot has been reserved for you. It includes plot number, block, size, price, and payment plan. It's your primary legal document until the registry is done.",
  },
  {
    q: "Can I resell the plot before possession?",
    a: "Yes. Plots can be transferred (with a Transfer Letter from the developer) to another buyer before possession. AHH Brothers facilitates such transfers upon written request and payment of a transfer fee.",
  },
  {
    q: "What is the difference between Registry and Allotment?",
    a: "Allotment is the developer's internal documentation giving you rights to a specific plot. Registry is the government-recognized legal ownership transfer at the Sub-Registrar office. Registry is the strongest proof of ownership.",
  },
  {
    q: "What happens if I miss an installment?",
    a: "A grace period of 30 days is typically allowed. After that, a late payment surcharge may apply. AHH Brothers is flexible with genuine hardship cases — simply contact us in advance to renegotiate your schedule.",
  },
  {
    q: "Is AHH Brothers legally registered?",
    a: "Yes. AHH Brothers is a registered real estate developer operating in Karachi since 2018 with all projects maintaining required SBCA approvals and legal compliances. We provide all documentation transparently.",
  },
];

export default function LegalCompliance() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <div className="page-hero">
        <h1 className="text-gradient-gold">Legal Buyer&apos;s Guide</h1>
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Legal &amp; Compliance</span>
        </div>
      </div>

      {/* Trust Badges */}
      <section style={{ padding: "2rem 0", borderBottom: "1px solid rgba(212,175,55,0.1)" }}>
        <div className="container">
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2.5rem" }}>
            {[
              { icon: "🏛️", label: "Est. 2018", sublabel: "6+ Years in Karachi" },
              { icon: "🏘️", label: "4+ Projects", sublabel: "Successfully Delivered" },
              { icon: "👨‍👩‍👧‍👦", label: "500+ Families", sublabel: "Trusted Investors" },
              { icon: "📋", label: "SBCA Approved", sublabel: "All Projects" },
            ].map(({ icon, label, sublabel }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.35rem" }}>{icon}</div>
                <div style={{ color: "#D4AF37", fontWeight: 700, fontSize: "1.05rem" }}>{label}</div>
                <div style={{ color: "#8A8A9E", fontSize: "0.8rem" }}>{sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Steps */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Know Your Rights</div>
            <h2>The <span className="gold-text">Legal Buying Process</span></h2>
            <div className="gold-line" />
            <p>Understand every stage of the property purchase process — so you&apos;re always informed and protected.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: 840, margin: "0 auto" }}>
            {legalSteps.map((step) => (
              <div key={step.num} className="glass-card" style={{ padding: "1.75rem 2rem", display: "grid", gridTemplateColumns: "64px 1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "12px", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {step.icon}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#D4AF37", fontWeight: 800, letterSpacing: "0.12em" }}>STEP {step.num}</div>
                </div>
                <div>
                  <h3 style={{ color: "#F5F5F7", fontSize: "1.1rem", marginBottom: "0.6rem" }}>{step.title}</h3>
                  <p style={{ color: "#8A8A9E", fontSize: "0.87rem", lineHeight: 1.7, marginBottom: "1rem" }}>{step.desc}</p>
                  <div style={{ background: "rgba(212,175,55,0.05)", borderRadius: "8px", padding: "0.75rem 1rem", border: "1px solid rgba(212,175,55,0.12)" }}>
                    <div style={{ fontSize: "0.7rem", color: "#D4AF37", letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.5rem" }}>Documents at this stage</div>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      {step.docs.map((doc) => (
                        <li key={doc} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#C5C5D3", fontSize: "0.82rem" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section section-alt">
        <div className="container" style={{ maxWidth: 780 }}>
          <div className="section-header">
            <div className="section-label">Frequently Asked</div>
            <h2>Legal <span className="gold-text">FAQs</span></h2>
            <div className="gold-line" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="glass-card"
                style={{ padding: 0, border: openFaq === i ? "1px solid rgba(212,175,55,0.35)" : "1px solid rgba(255,255,255,0.06)", transition: "border 0.25s" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", padding: "1.25rem 1.5rem", background: "transparent", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", gap: "1rem" }}
                >
                  <span style={{ color: "#F5F5F7", fontSize: "0.95rem", fontWeight: 500 }}>{faq.q}</span>
                  <svg
                    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"
                    style={{ flexShrink: 0, transform: openFaq === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s" }}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 1.5rem 1.25rem", color: "#8A8A9E", fontSize: "0.87rem", lineHeight: 1.75, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ paddingTop: "1rem" }}>{faq.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
            <p style={{ color: "#8A8A9E", marginBottom: "1.25rem" }}>Have a legal question not listed here? Our team is happy to help.</p>
            <Link href="/contact" className="btn-gold" style={{ display: "inline-flex" }}>
              Speak to Our Team
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
