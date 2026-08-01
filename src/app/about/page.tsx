"use client";

import Image from "next/image";
import Link from "next/link";
import { MEDIA } from "@/lib/media";

const directors = [
  {
    name: "Haroon Ansari",
    title: "Director & Partner",
    initials: "H",
    image: MEDIA.haroonAnsari,
    objectPosition: "center 10%",
    desc: "A visionary leader with a passion for real estate development, Haroon has been instrumental in shaping AHH Brothers' strategic direction. His entrepreneurial drive and deep understanding of Karachi's property market have been key to the firm's continued expansion and success.",
    gradient: "linear-gradient(135deg, #D4AF37, #B8942E)",
  },
  {
    name: "Hassan Memon",
    title: "Director & Partner",
    initials: "HM",
    image: MEDIA.hassaanMemon,
    objectPosition: "center top",
    desc: "Hassan Memon brings unparalleled expertise in construction management and project execution to AHH Brothers. His hands-on approach ensures every project meets the highest standards of engineering integrity and timely delivery, earning the trust of hundreds of families.",
    gradient: "linear-gradient(135deg, #C5A028, #9A7820)",
  },
  {
    name: "Abbas Malik",
    title: "Director & Partner",
    initials: "A",
    image: MEDIA.abbasMalik,
    objectPosition: "center top",
    desc: "Abbas leads the strategic marketing vision and brand expansion for AHH Brothers. He spearheads innovative marketing strategies, data-driven promotional campaigns, and target market positioning that accelerate project outreach, drive investor engagement, and strengthen the company's presence across Karachi's real estate sector.",
    gradient: "linear-gradient(135deg, #E8CC6E, #D4AF37)",
  },
];

const managers = [
  {
    name: "Khawaja Naqeeb Uddin",
    title: "Manager Operations",
    initials: "KN",
    desc: "Khawaja Naqeeb Uddin is the operational backbone of AHH Brothers, coordinating day-to-day site activities, vendor relations, and project workflows. His systematic approach ensures every development phase runs smoothly from groundbreaking to handover.",
    color: "#D4AF37",
  },
  {
    name: "Mirza Adeel Baig",
    title: "Sales & Marketing Manager",
    initials: "MA",
    desc: "Mirza Adeel Baig drives the sales strategy and marketing campaigns that have positioned AHH Brothers as a trusted name in Karachi real estate. His customer-first philosophy and deep market knowledge help buyers find the right investment every time.",
    color: "#C5A028",
  },
  {
    name: "Mirza Khalil Baig",
    title: "Sales & Accounts Manager",
    initials: "MK",
    desc: "Mirza Khalil Baig manages the financial records, installment plans, and sales accounts with precision and integrity. His transparent handling of transactions gives buyers and investors complete peace of mind throughout the purchase process.",
    color: "#E8CC6E",
  },
];

const timelineEvents = [
  {
    year: "2018",
    title: "AHH Brothers Established",
    desc: "Founded as a professional builders and developers firm in Karachi, bringing together a team united by a shared vision: delivering quality, affordable real estate for every family.",
  },
  {
    year: "2019",
    title: "First Delivered Projects",
    desc: "Successfully delivered ANBAN Mega City and City Housing Society, establishing our reputation for on-time delivery and reliable development.",
  },
  {
    year: "2021",
    title: "Vertical Expansion",
    desc: "Launched Gul Heights — our first high-rise residential project in Nazimabad — marking our entry into the vertical development segment of Karachi's real estate market.",
  },
  {
    year: "2022",
    title: "Four Seasons Farm Houses",
    desc: "Successfully delivered Phase 1 of Four Seasons Farm Houses in Gadap Town, offering premium countryside living to discerning buyers.",
  },
  {
    year: "2024",
    title: "Hooria Villas & Mega Pipeline",
    desc: "Launched Hooria Villas near Gulshan-e-Maymar and unveiled the AHH-City mega township — our most ambitious project to date, offering 120–500 sq yard plots with world-class amenities.",
  },
];

const values = [
  {
    title: "Unity",
    desc: "Consistent with our motto 'Our Power Is Our Unity', we work cohesively to deliver excellence.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    title: "Quality Construction",
    desc: "No compromise on building materials, infrastructure development, and engineering integrity.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" fill="rgba(212,175,55,0.1)"/>
        <path d="M9 22v-4h6v4"/>
        <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" strokeWidth="2.5"/>
      </svg>
    ),
  },
  {
    title: "Commitment",
    desc: "We stay true to our promises on delivery schedules, documentation, and pricing plans.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="rgba(212,175,55,0.1)"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
];

export default function About() {
  return (
    <>
      {/* Page Hero Banner */}
      <div className="page-hero">
        <h1 className="text-gradient-gold">About Our Company</h1>
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>About Us</span>
        </div>
      </div>

      {/* ===== ATTRACTIVE INTRO SECTION ===== */}
      <section className="section">
        <div className="container">
          <div className="about-details-grid">
            <div className="about-details-text">
              <div className="section-label">Who We Are</div>
              <h2 className="section-title">
                AHH Brothers —{" "}
                <span className="text-gradient-gold">Builders & Developers</span>
              </h2>
              <div className="gold-line-left" />
              <p className="intro-text">
                AHH Brothers Builders &amp; Developers was founded in 2018 with a singular
                mission: to make premium real estate accessible and highly profitable for every family and investor in Karachi.
                We specialize in <strong>Interest-Free Business</strong> investments and high-yield residential/commercial property developments.
              </p>
              <p className="normal-text">
                Guided by our motto — <strong style={{ color: "#D4AF37" }}>&ldquo;Our Power Is Our Unity&rdquo;</strong> —
                every project we execute delivers consistent, compounding returns that outpace inflation and conventional savings. Across our <strong>4 Active Projects</strong>, we have established a proven track record of up to <strong>212%+ Peak Return</strong> (Summer Farm Houses +212%, Hooria Villas +122%, Labour City +200%, AHH City +133%).
              </p>
              <p className="normal-text" style={{ marginTop: "1rem" }}>
                For investors seeking steady passive income, we offer short-term investment plans (1 to 5 years) with fixed monthly profit returns of <strong>PKR 40,000 to 45,000 per month on 1 Million PKR</strong>. All principal amounts are backed by legally binding contracts signed directly with AHH Brothers and backed by <strong>Full-Payment Post-Dated Cheques</strong> as ultimate security.
              </p>
              <div style={{ display: "flex", gap: "2rem", marginTop: "2rem", flexWrap: "wrap" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#D4AF37", fontFamily: "var(--font-heading)" }}>2018</div>
                  <div style={{ fontSize: "0.85rem", color: "#8A8A9E", textTransform: "uppercase", letterSpacing: "0.1em" }}>Founded</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#D4AF37", fontFamily: "var(--font-heading)" }}>4+</div>
                  <div style={{ fontSize: "0.85rem", color: "#8A8A9E", textTransform: "uppercase", letterSpacing: "0.1em" }}>Delivered Projects</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#D4AF37", fontFamily: "var(--font-heading)" }}>500+</div>
                  <div style={{ fontSize: "0.85rem", color: "#8A8A9E", textTransform: "uppercase", letterSpacing: "0.1em" }}>Happy Families</div>
                </div>
              </div>
            </div>
            <div className="about-details-logo glass-card" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
              {/* Decorative emblem */}
              <div style={{
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.05))",
                border: "2px solid rgba(212,175,55,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 40px rgba(212, 175, 55, 0.2)",
              }}>
                <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" fill="rgba(212,175,55,0.15)"/>
                  <path d="M9 22v-4h6v4"/>
                  <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" strokeWidth="2.5"/>
                </svg>
              </div>
              <div style={{ textAlign: "center" }}>
                <h3 style={{ color: "#D4AF37", fontSize: "1.4rem", fontFamily: "var(--font-heading)", marginBottom: "0.5rem" }}>AHH Brothers</h3>
                <p style={{ color: "#8A8A9E", fontSize: "0.9rem" }}>Builders & Developers</p>
                <p style={{ color: "#D4AF37", fontSize: "0.85rem", marginTop: "0.75rem", fontStyle: "italic" }}>&ldquo;Our Power Is Our Unity&rdquo;</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MISSION / VALUES ===== */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Our Mission & <span className="gold-text">Core Values</span></h2>
            <div className="gold-line" />
            <p>Our foundational principles that drive every project we undertake.</p>
          </div>

          <div className="grid-3">
            {values.map((v, index) => (
              <div className="glass-card value-card" key={index}>
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DIRECTORS SECTION ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Leadership</div>
            <h2>Meet Our <span className="gold-text">Directors</span></h2>
            <div className="gold-line" />
            <p>The visionary partners who guide AHH Brothers&apos; strategy, growth, and values.</p>
          </div>

          <div className="grid-3">
            {directors.map((d, i) => (
              <div key={i} className="glass-card" style={{ padding: "2rem", textAlign: "center", transition: "transform 0.3s, box-shadow 0.3s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 60px rgba(212,175,55,0.15)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}
              >
                <div style={{
                  width: 110, height: 110, borderRadius: "50%",
                  margin: "0 auto 1.25rem",
                  position: "relative",
                  overflow: "hidden",
                  border: "3px solid #D4AF37",
                  boxShadow: "0 8px 30px rgba(212,175,55,0.3)",
                  background: d.gradient,
                }}>
                  {d.image ? (
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      sizes="110px"
                      style={{ objectFit: "cover", objectPosition: d.objectPosition || "center top" }}
                    />
                  ) : (
                    <div style={{
                      width: "100%", height: "100%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.8rem", fontWeight: 800, color: "#0A0A0A",
                      fontFamily: "var(--font-heading)",
                    }}>
                      {d.initials}
                    </div>
                  )}
                </div>
                <h3 style={{ color: "#F5F5F7", fontSize: "1.2rem", marginBottom: "0.4rem" }}>{d.name}</h3>
                <span style={{
                  display: "inline-block", padding: "0.3rem 1rem",
                  background: "rgba(212,175,55,0.1)", color: "#D4AF37",
                  borderRadius: "20px", fontSize: "0.78rem",
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  border: "1px solid rgba(212,175,55,0.2)",
                  marginBottom: "1rem",
                }}>
                  {d.title}
                </span>
                <p style={{ color: "#8A8A9E", fontSize: "0.9rem", lineHeight: 1.7 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MANAGERS SECTION ===== */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Our Team</div>
            <h2>Our <span className="gold-text">Management Team</span></h2>
            <div className="gold-line" />
            <p>The dedicated professionals who execute our vision and serve our clients every day.</p>
          </div>

          <div className="grid-3">
            {managers.map((m, i) => (
              <div key={i} className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem", transition: "transform 0.3s, box-shadow 0.3s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 60px rgba(212,175,55,0.12)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "14px",
                    background: `linear-gradient(135deg, ${m.color}33, ${m.color}11)`,
                    border: `1px solid ${m.color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1rem", fontWeight: 700,
                    color: m.color,
                    fontFamily: "var(--font-heading)",
                    flexShrink: 0,
                  }}>
                    {m.initials}
                  </div>
                  <div>
                    <h3 style={{ color: "#F5F5F7", fontSize: "1rem", marginBottom: "0.2rem", lineHeight: 1.3 }}>{m.name}</h3>
                    <span style={{
                      display: "inline-block", padding: "0.2rem 0.75rem",
                      background: `${m.color}15`, color: m.color,
                      borderRadius: "20px", fontSize: "0.72rem",
                      textTransform: "uppercase", letterSpacing: "0.07em",
                      border: `1px solid ${m.color}30`,
                    }}>
                      {m.title}
                    </span>
                  </div>
                </div>
                <p style={{ color: "#8A8A9E", fontSize: "0.88rem", lineHeight: 1.7, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem" }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TIMELINE SECTION ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our <span className="gold-text">Journey Timeline</span></h2>
            <div className="gold-line" />
            <p>A look at the milestones that define our growth and legacy over the years.</p>
          </div>

          <div className="timeline-container">
            {timelineEvents.map((event, index) => (
              <div className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`} key={index}>
                <div className="timeline-content glass-card">
                  <div className="timeline-year">{event.year}</div>
                  <h3>{event.title}</h3>
                  <p>{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
