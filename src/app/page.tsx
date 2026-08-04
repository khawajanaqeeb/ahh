"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ============================================
   DATA
   ============================================ */

const stats = [
  {
    number: 6,
    suffix: "+",
    label: "Years of Excellence",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" stroke="#D4AF37" fill="rgba(212,175,55,0.12)"/>
        <path d="M9 22v-4h6v4" stroke="#D4AF37"/>
        <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" stroke="#D4AF37" strokeWidth="2.5"/>
      </svg>
    ),
  },
  {
    number: 4,
    suffix: "+",
    label: "Active Projects",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.7C17.3 17 20 13 20 9a8 8 0 1 0-16 0c0 4 2.7 8 8 12.7z" stroke="#D4AF37" fill="rgba(212,175,55,0.12)"/>
        <circle cx="12" cy="9" r="3" stroke="#D4AF37"/>
      </svg>
    ),
  },
  {
    number: 500,
    suffix: "+",
    label: "Happy Families",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#D4AF37" fill="rgba(212,175,55,0.12)"/>
        <polyline points="9 22 9 12 15 12 15 22" stroke="#D4AF37"/>
      </svg>
    ),
  },
  {
    number: 10000,
    suffix: "+",
    label: "Sq Yards Developed",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D4AF37" fill="rgba(212,175,55,0.12)"/>
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" stroke="#D4AF37" strokeWidth="1"/>
      </svg>
    ),
  },
];

const projects = [
  {
    id: "hooria-villas",
    name: "Hooria Villas",
    location: "Northern Bypass, Near Gulshan-e-Maymar (Survey 395, 396, 397)",
    type: "Residential & Commercial Plots",
    size: "120 & 150 Sq Yards",
    status: "Active Development",
    badge: "active",
    payment: "Res 120 YDS: Rs 10 Lacs | Comm 150 YDS: Rs 15 Lacs",
    image: MEDIA.hooriaVillasLogo,
    description: "2.5x growth in 2 years (+122% Return). 120 Sq Yd Res plots at Rs 10 Lacs total cost & 150 Sq Yd Commercial plots at Rs 15 Lacs total cost.",
  },
  {
    id: "ahh-city",
    name: "AHH-City",
    location: "Scheme 45, Northern Bypass (Survey 297)",
    type: "Residential & Commercial Units",
    size: "60 & 120 Sq Yards | Commercial Shops 100 Sq Ft",
    status: "Rapid Site Development",
    badge: "active",
    payment: "60 YDS: Rs 2 Lacs Total (Today Rate Rs 3.5 Lacs)",
    image: MEDIA.ahhCityLogo,
    description: "+133% Growth in 2 Months! 60 Sq Yds total cost Rs 2 Lacs (Today Rate Rs 3.5 Lacs). 120 Sq Yds total cost Rs 3.5 Lacs (Today Rate Rs 5 Lacs).",
  },
  {
    id: "labour-city",
    name: "Labour City",
    location: "Industrial Corridor, Karachi",
    type: "Affordable Housing & Commercial",
    size: "80 Sq Yards (Residential) & 150 Sq Yards (Commercial)",
    status: "Now Booking",
    badge: "active",
    payment: "3x Growth in 1 Year (+200% Return)",
    image: MEDIA.labourCityLogo,
    description: "80 Sq Yards Residential & 150 Sq Yards Commercial. Affordable housing for working professionals. Price grew 3x in 1 year (+200%).",
  },
  {
    id: "summer-farm-houses",
    name: "Summer Farmhouses",
    location: "Scheme 45, Northern Bypass, Karachi",
    type: "Farm House Land & Community",
    size: "Farm House Land (1000 Sq Yds)",
    status: "Govt Registered Project",
    badge: "active",
    payment: "Cash Price: Rs 25 Lacs | Booking: Rs 10 Lacs | 5 Monthly: Rs 1 Lac",
    image: MEDIA.summerFarmhousesLogo,
    description: "Government Registered Project at Scheme 45, Northern Bypass. Farm House Land with easy installment plan (Booking Rs 10 Lacs, 5 monthly of Rs 1 Lac) or Cash Price Rs 25 Lacs.",
  },
];

const features = [
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20"/><path d="M5 20V8.5L12 3l7 5.5V20"/><path d="M9 20v-6h6v6"/>
      </svg>
    ),
    title: "Quality Construction",
    desc: "Built with the finest materials and industry-best construction practices for lasting durability.",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "Timely Delivery",
    desc: "We honor our commitments with on-time project delivery backed by 47+ years of trust.",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    title: "Prime Locations",
    desc: "Strategically located projects near major landmarks with excellent connectivity.",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Transparent Deals",
    desc: "Fully documented and legal transactions with complete transparency at every step.",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
    title: "Flexible Payments",
    desc: "Easy installment plans starting from 8% down payment with up to 36-month durations.",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    title: "Legal Documentation",
    desc: "Complete legal documentation and NOC approvals ensuring your investment is secure.",
  },
];

const testimonials = [
  {
    name: "Muhammad Ahmed",
    role: "Hooria Villas Buyer",
    text: "AHH Brothers made our dream of owning a plot a reality. Their transparent process and affordable payment plans were exactly what our family needed. Highly recommended!",
  },
  {
    name: "Fatima Hassan",
    role: "Property Investor",
    text: "I have invested in multiple projects with AHH Brothers. Their commitment to quality and timely delivery is unmatched in Karachi. A trustworthy developer with decades of experience.",
  },
  {
    name: "Abdul Rehman",
    role: "Home Owner",
    text: "From the very first meeting to possession, AHH Brothers maintained complete professionalism. The location of their projects and the construction quality speak for themselves.",
  },
];

/* ============================================
   COUNTER ANIMATION HOOK
   ============================================ */

function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return { count, ref };
}

/* ============================================
   SCROLL ANIMATION HOOK
   ============================================ */

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

import { MEDIA } from "@/lib/media";

const officeImages = [
  MEDIA.off1,
  MEDIA.off2,
  MEDIA.off3,
  MEDIA.off4,
  MEDIA.off5,
  MEDIA.off6,
  MEDIA.off7,
];

/* ============================================
   HOME PAGE
   ============================================ */

export default function Home() {
  const statsSection = useScrollReveal();
  const aboutSection = useScrollReveal();
  const projectsSection = useScrollReveal();
  const featuresSection = useScrollReveal();
  const testimonialsSection = useScrollReveal();

  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % officeImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-bg" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {officeImages.map((src, index) => (
            <div
              key={src}
              style={{
                position: "absolute",
                inset: 0,
                opacity: index === currentBgIndex ? 1 : 0,
                transition: "opacity 1.5s ease-in-out, transform 6s ease-out",
                transform: index === currentBgIndex ? "scale(1.06)" : "scale(1)",
                pointerEvents: "none",
              }}
            >
              <Image
                src={src}
                alt={`AHH Brothers Office Picture ${index + 1}`}
                fill
                sizes="100vw"
                style={{ objectFit: "cover" }}
                priority={index === 0}
                quality={90}
              />
            </div>
          ))}
          <div className="hero-overlay" style={{ zIndex: 2 }} />

          {/* Slideshow Progress Dots */}
          <div
            style={{
              position: "absolute",
              bottom: "2rem",
              right: "2.5rem",
              zIndex: 10,
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            {officeImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBgIndex(idx)}
                aria-label={`Switch to office background picture ${idx + 1}`}
                style={{
                  width: idx === currentBgIndex ? "28px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  backgroundColor: idx === currentBgIndex ? "#D4AF37" : "rgba(255, 255, 255, 0.35)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: idx === currentBgIndex ? "0 0 10px rgba(212, 175, 55, 0.6)" : "none",
                }}
              />
            ))}
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span>Established 2018</span>
          </div>
          <h1 className="hero-title">
            Building <span className="text-gradient-gold">Dreams</span>
            <br />Into Reality
          </h1>
          <p className="hero-subtitle">
            AHH Brothers — Builders &amp; Developers. Delivering premium residential
            and commercial projects across Karachi since 2018.
          </p>
          <div className="hero-tagline">&ldquo;Our Power Is Our Unity&rdquo;</div>
          <div className="hero-buttons">
            <Link href="/current-projects" className="btn-gold">
              View Projects
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
            <Link href="/contact" className="btn-outline">
              Contact Us
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="scroll-indicator">
            <div className="scroll-mouse">
              <div className="scroll-dot" />
            </div>
            <span>Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="section section-alt" ref={statsSection.ref}>
        <div className="container">
          <div className="stats-grid" style={{ opacity: statsSection.visible ? 1 : 0, transition: "opacity 0.8s" }}>
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} delay={i * 0.15} visible={statsSection.visible} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT PREVIEW ===== */}
      <section className="section" ref={aboutSection.ref}>
        <div className="container">
          <div
            className="about-grid"
            style={{
              opacity: aboutSection.visible ? 1 : 0,
              transform: aboutSection.visible ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.8s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <div className="about-image-col">
              <div className="about-image-wrapper glass-card-static">
                <Image
                  src={MEDIA.ahhLogoPng}
                  alt="AHH Brothers Logo"
                  width={400}
                  height={400}
                  style={{ borderRadius: "12px", objectFit: "cover", width: "100%", height: "auto" }}
                />
              </div>
              <div className="about-exp-badge">
                <span className="exp-number">6+</span>
                <span className="exp-label">Years of<br/>Excellence</span>
              </div>
            </div>
            <div className="about-text-col">
              <div className="section-label">About Us</div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 700, marginBottom: "0.75rem" }}>
                A Legacy of Trust &<br /><span className="text-gradient-gold">Building Excellence</span>
              </h2>
              <div className="gold-line-left" />
              <p style={{ color: "#C5C5D3", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "1.25rem" }}>
                Founded in 2018, AHH Brothers Builders &amp; Developers is a premier real estate developer operating across strategic locations in Karachi. We specialize in <strong>Interest-Free Business</strong> investments and high-yield property developments, delivering consistent compounding returns that outpace inflation.
              </p>
              <p style={{ color: "#8A8A9E", fontSize: "0.95rem", lineHeight: 1.8, marginBottom: "1.25rem" }}>
                With a proven track record across <strong>4 Active Projects</strong> (achieving up to <strong>212%+ Peak Return</strong>), we offer short-term investment opportunities (1 to 5 years) with fixed monthly profit returns of <strong>PKR 40,000 to 45,000 per month on 1 Million PKR</strong>.
              </p>
              <div style={{ background: "rgba(212, 175, 55, 0.08)", borderLeft: "3px solid #D4AF37", padding: "0.85rem 1rem", borderRadius: "0 8px 8px 0", marginBottom: "1.75rem" }}>
                <span style={{ color: "#D4AF37", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>🔒 Financial Guarantee & Security</span>
                <span style={{ color: "#F5F5F7", fontSize: "0.88rem" }}>Official legally binding contract signed directly with AHH Brothers + Full-Payment Post-Dated Cheque delivered as ultimate security for your principal.</span>
              </div>
              <Link href="/about" className="btn-gold">
                Learn More About Us
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMPANY INVESTMENT SHOWCASE ===== */}
      <section className="section" style={{ background: "linear-gradient(180deg, rgba(10,10,22,0.98), rgba(20,20,38,0.95))", borderTop: "1px solid rgba(212,175,55,0.2)", borderBottom: "1px solid rgba(212,175,55,0.2)" }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">High-Yield Returns</div>
            <h2>Invest in <span className="gold-text">Interest-Free Business</span></h2>
            <div className="gold-line" />
            <p>Every AHH Brothers project delivers consistent compounding returns — outpacing inflation and conventional savings.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", alignItems: "stretch" }}>
            {/* Poster 1: Investment Opportunity */}
            <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(212,175,55,0.3)", display: "flex", flexDirection: "column" }}>
              <div style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(212,175,55,0.2)", marginBottom: "1.25rem" }}>
                <Image
                  src={MEDIA.posterInvestmentOpportunity}
                  alt="Investment Opportunity — 1 Year Plan"
                  width={600}
                  height={600}
                  style={{ width: "100%", height: "auto", maxHeight: "380px", objectFit: "contain", background: "#080812" }}
                />
              </div>
              <span className="p-type" style={{ color: "#D4AF37" }}>1 to 5 Years Short-Term Plan</span>
              <h3 style={{ color: "#F5F5F7", fontSize: "1.2rem", margin: "0.4rem 0 0.6rem" }}>1-Year Investment Plan (Monthly Profit)</h3>
              <p style={{ color: "#8A8A9E", fontSize: "0.9rem", lineHeight: 1.6, flexGrow: 1 }}>
                Earn <strong>PKR 40,000 to 45,000 PER MONTH</strong> on a 1 Million PKR minimum investment. Backed by a legally binding contract signed directly with AHH Brothers and a <strong>Full-Payment Post-Dated Cheque</strong>.
              </p>
              <a href="https://wa.me/923111123160?text=Hello%20AHH%20Brothers%2C%20I%20am%20interested%20in%20the%201-Year%20Investment%20Plan." target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ width: "100%", textAlign: "center", justifyContent: "center", marginTop: "1rem" }}>
                Inquire About 1-Year Plan
              </a>
            </div>

            {/* Poster 2: Interest Free Growth */}
            <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(212,175,55,0.3)", display: "flex", flexDirection: "column" }}>
              <div style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(212,175,55,0.2)", marginBottom: "1.25rem" }}>
                <Image
                  src={MEDIA.posterInterestFreeGrowth}
                  alt="Invest in Interest-Free Business Growth Record"
                  width={600}
                  height={600}
                  style={{ width: "100%", height: "auto", maxHeight: "380px", objectFit: "contain", background: "#080812" }}
                />
              </div>
              <span className="p-type" style={{ color: "#D4AF37" }}>Proven Growth Record</span>
              <h3 style={{ color: "#F5F5F7", fontSize: "1.2rem", margin: "0.4rem 0 0.6rem" }}>Project-Wise Price Growth Record</h3>
              <p style={{ color: "#8A8A9E", fontSize: "0.9rem", lineHeight: 1.6, flexGrow: 1 }}>
                Proven track record across 4 active projects in Karachi. <strong>Summer Farm Houses (+212%)</strong>, <strong>Hooria Villas (+122%)</strong>, <strong>Labour City (+200%)</strong>, and <strong>AHH City (+133%)</strong>.
              </p>
              <Link href="/current-projects" className="btn-outline" style={{ width: "100%", textAlign: "center", justifyContent: "center", marginTop: "1rem" }}>
                Explore Active Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROJECTS SECTION ===== */}
      <section className="section section-alt" ref={projectsSection.ref}>
        <div className="container">
          <div className="section-header">
            <h2>
              Our <span className="gold-text">Projects</span>
            </h2>
            <div className="gold-line" />
            <p>Explore our portfolio of premium residential and commercial developments across Karachi.</p>
          </div>

          <div
            className="projects-grid"
            style={{
              opacity: projectsSection.visible ? 1 : 0,
              transform: projectsSection.visible ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s",
            }}
          >
            {projects.map((project, i) => (
              <div
                key={project.id}
                className="project-card"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="card-image">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "contain", padding: "1.25rem", background: "linear-gradient(135deg, rgba(20,20,25,0.95), rgba(10,10,12,0.98))" }}
                  />
                  <span className={`card-badge badge-${project.badge}`}>
                    {project.status}
                  </span>
                </div>
                <div className="card-content">
                  <h3>{project.name}</h3>
                  <div className="card-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {project.location}
                  </div>
                  <div className="card-details" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                      {project.type}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18" strokeWidth="1"/></svg>
                      {project.size}
                    </span>
                  </div>
                  <p style={{ color: "#8A8A9E", fontSize: "0.88rem", marginBottom: "1rem", lineHeight: 1.6 }}>
                    {project.description}
                  </p>
                  <div style={{ fontSize: "0.82rem", color: "#D4AF37", marginBottom: "1rem", padding: "0.5rem 0.75rem", background: "rgba(212,175,55,0.06)", borderRadius: "8px", borderLeft: "3px solid #D4AF37", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    {project.payment}
                  </div>
                  <Link href={`/current-projects#${project.id}`} className="card-link">
                    View Details
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Link href="/current-projects" className="btn-outline">
              View All Projects
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="section" ref={featuresSection.ref}>
        <div className="container">
          <div className="section-header">
            <h2>
              Why Choose <span className="gold-text">AHH Brothers</span>
            </h2>
            <div className="gold-line" />
            <p>Decades of trust, quality, and commitment to building your future.</p>
          </div>

          <div
            className="features-grid"
            style={{
              opacity: featuresSection.visible ? 1 : 0,
              transform: featuresSection.visible ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s",
            }}
          >
            {features.map((feature, i) => (
              <div key={feature.title} className="glass-card feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section section-alt" ref={testimonialsSection.ref}>
        <div className="container">
          <div className="section-header">
            <h2>
              What Our <span className="gold-text">Clients Say</span>
            </h2>
            <div className="gold-line" />
            <p>Hear from families and investors who trusted AHH Brothers.</p>
          </div>

          <div
            className="testimonials-grid"
            style={{
              opacity: testimonialsSection.visible ? 1 : 0,
              transform: testimonialsSection.visible ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s",
            }}
          >
            {testimonials.map((t, i) => (
              <div key={t.name} className="glass-card testimonial-card" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="testimonial-quote">&ldquo;</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="testimonial-name">{t.name}</h4>
                    <p className="testimonial-role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <div className="cta-overlay" />
        <div className="container cta-content">
          <h2>Start Your Journey<br /><span className="text-gradient-gold">With AHH Brothers</span></h2>
          <p>Ready to invest in your future? Get in touch with us today for the best residential and commercial opportunities in Karachi.</p>
          <div className="cta-buttons">
            <Link href="/contact" className="btn-gold">
              Schedule a Consultation
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
            <a href="https://wa.me/923111123160" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ borderColor: "#25D366", color: "#25D366" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

/* ============================================
   STAT CARD COMPONENT
   ============================================ */

function StatCard({ stat, delay, visible }: { stat: typeof stats[0]; delay: number; visible: boolean }) {
  const { count, ref } = useCountUp(stat.number, 2000);

  return (
    <div
      ref={ref}
      className="glass-card stat-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}s`,
      }}
    >
      <div className="stat-icon">{stat.icon}</div>
      <div className="stat-number">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
}
