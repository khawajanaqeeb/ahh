"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ============================================
   DATA
   ============================================ */

const stats = [
  { number: 47, suffix: "+", label: "Years of Experience", icon: "🏗️" },
  { number: 4, suffix: "+", label: "Active Projects", icon: "📐" },
  { number: 500, suffix: "+", label: "Happy Families", icon: "🏠" },
  { number: 10000, suffix: "+", label: "Sq Yards Developed", icon: "📏" },
];

const projects = [
  {
    id: "hooria-villas",
    name: "Hooria Villas",
    location: "Northern Bypass, Near Gulshan-e-Maymar",
    type: "Residential Plots",
    size: "120 Sq Yards",
    status: "Under Development",
    badge: "active",
    payment: "8% Down Payment | 36 Monthly Installments",
    image: "/h1.jpg",
    description: "Premium residential plots at a prime location with speedy development work underway.",
  },
  {
    id: "summer-farm-houses",
    name: "Summer Farm Houses",
    location: "Karachi, Sindh",
    type: "Farm Houses",
    size: "Various Sizes",
    status: "Now Booking",
    badge: "active",
    payment: "Flexible Payment Plans Available",
    image: "/h2.jpg",
    description: "Escape to your own countryside retreat with our premium farm house community.",
  },
  {
    id: "labour-city",
    name: "Labour City",
    location: "Karachi, Sindh",
    type: "Affordable Housing",
    size: "80-120 Sq Yards",
    status: "Now Booking",
    badge: "upcoming",
    payment: "Easy Installment Plans",
    image: "/h2.jpg",
    description: "Affordable residential plots designed for the working class with easy payment options.",
  },
  {
    id: "ahh-city",
    name: "AHH-City",
    location: "Karachi, Sindh",
    type: "Mega Township",
    size: "120-500 Sq Yards",
    status: "Coming Soon",
    badge: "upcoming",
    payment: "Launching Soon — Register Interest",
    image: "/h1.jpg",
    description: "A complete township with residential, commercial, and recreational facilities.",
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

/* ============================================
   HOME PAGE
   ============================================ */

export default function Home() {
  const statsSection = useScrollReveal();
  const aboutSection = useScrollReveal();
  const projectsSection = useScrollReveal();
  const featuresSection = useScrollReveal();
  const testimonialsSection = useScrollReveal();

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-bg">
          <Image
            src="/h2.jpg"
            alt="AHH Brothers Premium Development"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
            quality={90}
          />
          <div className="hero-overlay" />
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span>Established 1977</span>
          </div>
          <h1 className="hero-title">
            Building <span className="text-gradient-gold">Dreams</span>
            <br />Into Reality
          </h1>
          <p className="hero-subtitle">
            AHH Brothers — Builders & Developers. Delivering premium residential
            and commercial projects across Karachi for over 47 years.
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

        <style jsx>{`
          .hero {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          .hero-bg {
            position: absolute;
            inset: 0;
            z-index: 0;
          }
          .hero-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(10,10,10,0.65) 0%, rgba(13,13,26,0.88) 100%);
          }
          .hero-content {
            position: relative;
            z-index: 1;
            text-align: center;
            padding: 2rem 1.5rem;
            max-width: 850px;
            animation: fadeInUp 1s ease-out;
          }
          .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.4rem 1.25rem;
            background: rgba(212, 175, 55, 0.1);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 30px;
            margin-bottom: 2rem;
            animation: fadeInDown 0.8s ease-out;
          }
          .hero-badge span {
            color: #D4AF37;
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          .hero-title {
            font-family: var(--font-heading);
            font-size: clamp(3rem, 7vw, 5.5rem);
            font-weight: 800;
            line-height: 1.08;
            margin-bottom: 1.5rem;
            color: #FFFFFF;
          }
          .hero-subtitle {
            font-size: clamp(1rem, 2vw, 1.2rem);
            color: #C5C5D3;
            max-width: 650px;
            margin: 0 auto 1rem;
            line-height: 1.7;
          }
          .hero-tagline {
            font-family: var(--font-heading);
            font-style: italic;
            color: #D4AF37;
            font-size: 1.15rem;
            margin-bottom: 2.5rem;
            opacity: 0.9;
          }
          .hero-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
          }
          .scroll-indicator {
            position: absolute;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            animation: float 2.5s ease-in-out infinite;
          }
          .scroll-indicator span {
            color: #4A4A5E;
            font-size: 0.75rem;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          .scroll-mouse {
            width: 24px;
            height: 38px;
            border: 2px solid rgba(212, 175, 55, 0.3);
            border-radius: 12px;
            display: flex;
            justify-content: center;
            padding-top: 6px;
          }
          .scroll-dot {
            width: 4px;
            height: 8px;
            background: #D4AF37;
            border-radius: 2px;
            animation: scrollAnim 1.8s infinite;
          }
          @keyframes scrollAnim {
            0% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(14px); }
          }
          @media (max-width: 640px) {
            .hero { min-height: 90vh; }
            .scroll-indicator { display: none; }
          }
        `}</style>
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

        <style jsx>{`
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }
          @media (max-width: 1024px) {
            .stats-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 480px) {
            .stats-grid { grid-template-columns: 1fr; }
          }
        `}</style>
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
                  src="/ahh-logo.jpg"
                  alt="AHH Brothers Logo"
                  width={400}
                  height={400}
                  style={{ borderRadius: "12px", objectFit: "cover", width: "100%", height: "auto" }}
                />
              </div>
              <div className="about-exp-badge">
                <span className="exp-number">47+</span>
                <span className="exp-label">Years of<br/>Excellence</span>
              </div>
            </div>
            <div className="about-text-col">
              <div className="section-label">About Us</div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 700, marginBottom: "0.75rem" }}>
                A Legacy of Trust &<br /><span className="text-gradient-gold">Building Excellence</span>
              </h2>
              <div className="gold-line-left" />
              <p style={{ color: "#C5C5D3", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                Established in 1977, AHH Brothers & Developers is a close-knit family of
                housebuilders, developers, and contractors. With the unique ability to wear
                multiple hats — developer and contractor — we bring flexibility to every project.
              </p>
              <p style={{ color: "#8A8A9E", fontSize: "0.95rem", lineHeight: 1.8, marginBottom: "2rem" }}>
                From affordable housing to premium villas and mega townships, we are committed
                to delivering exceptional living spaces that families can call home. Our power
                is our unity — and our unity builds your future.
              </p>
              <Link href="/about" className="btn-gold">
                Learn More About Us
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <style jsx>{`
          .about-grid {
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            gap: 4rem;
            align-items: center;
          }
          .about-image-col {
            position: relative;
          }
          .about-image-wrapper {
            padding: 1.5rem;
            position: relative;
          }
          .about-exp-badge {
            position: absolute;
            bottom: -20px;
            right: -20px;
            background: linear-gradient(135deg, #D4AF37 0%, #B8942E 100%);
            color: #0A0A0A;
            padding: 1.25rem;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 8px 30px rgba(212, 175, 55, 0.3);
          }
          .exp-number {
            display: block;
            font-family: var(--font-heading);
            font-size: 2.5rem;
            font-weight: 800;
            line-height: 1;
          }
          .exp-label {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .section-label {
            color: #D4AF37;
            font-weight: 600;
            font-size: 0.88rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 0.75rem;
          }
          @media (max-width: 768px) {
            .about-grid {
              grid-template-columns: 1fr;
              gap: 2.5rem;
            }
            .about-exp-badge {
              right: 10px;
              bottom: -15px;
            }
          }
        `}</style>
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
                    style={{ objectFit: "cover" }}
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
                  <div className="card-details">
                    <span>🏷️ {project.type}</span>
                    <span>📐 {project.size}</span>
                  </div>
                  <p style={{ color: "#8A8A9E", fontSize: "0.88rem", marginBottom: "1rem", lineHeight: 1.6 }}>
                    {project.description}
                  </p>
                  <div style={{ fontSize: "0.82rem", color: "#D4AF37", marginBottom: "1rem", padding: "0.5rem 0.75rem", background: "rgba(212,175,55,0.06)", borderRadius: "8px", borderLeft: "3px solid #D4AF37" }}>
                    💳 {project.payment}
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

        <style jsx>{`
          .projects-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
          @media (max-width: 768px) {
            .projects-grid { grid-template-columns: 1fr; }
          }
        `}</style>
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

        <style jsx>{`
          .features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
          .feature-card {
            padding: 2rem;
            text-align: center;
            cursor: default;
          }
          .feature-icon {
            width: 72px;
            height: 72px;
            margin: 0 auto 1.25rem;
            border-radius: 16px;
            background: rgba(212, 175, 55, 0.08);
            border: 1px solid rgba(212, 175, 55, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
            transition: all 0.3s;
          }
          .feature-card:hover .feature-icon {
            background: rgba(212, 175, 55, 0.15);
            transform: scale(1.08);
          }
          .feature-title {
            font-family: var(--font-heading);
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            color: #F5F5F5;
          }
          .feature-desc {
            color: #8A8A9E;
            font-size: 0.9rem;
            line-height: 1.7;
          }
          @media (max-width: 1024px) {
            .features-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 640px) {
            .features-grid { grid-template-columns: 1fr; }
          }
        `}</style>
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

        <style jsx>{`
          .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
          }
          .testimonial-card {
            padding: 2rem;
            cursor: default;
            position: relative;
          }
          .testimonial-quote {
            font-family: var(--font-heading);
            font-size: 4rem;
            color: #D4AF37;
            line-height: 1;
            opacity: 0.3;
            position: absolute;
            top: 12px;
            left: 20px;
          }
          .testimonial-text {
            color: #C5C5D3;
            font-size: 0.95rem;
            line-height: 1.8;
            margin-bottom: 1.5rem;
            margin-top: 1.5rem;
            font-style: italic;
          }
          .testimonial-author {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            border-top: 1px solid rgba(255,255,255,0.06);
            padding-top: 1rem;
          }
          .testimonial-avatar {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: linear-gradient(135deg, #D4AF37, #B8942E);
            color: #0A0A0A;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.85rem;
            flex-shrink: 0;
          }
          .testimonial-name {
            font-family: var(--font-heading);
            font-size: 1rem;
            font-weight: 600;
            color: #F5F5F5;
          }
          .testimonial-role {
            font-size: 0.82rem;
            color: #D4AF37;
          }
          @media (max-width: 1024px) {
            .testimonials-grid { grid-template-columns: 1fr; max-width: 600px; margin: 0 auto; }
          }
        `}</style>
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
            <a href="https://wa.me/923701335365" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ borderColor: "#25D366", color: "#25D366" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <style jsx>{`
          .cta-section {
            position: relative;
            padding: 6rem 1.5rem;
            background: linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(13,13,26,1) 50%, rgba(45,140,60,0.05) 100%);
            overflow: hidden;
            text-align: center;
          }
          .cta-overlay {
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 70%);
            pointer-events: none;
          }
          .cta-content {
            position: relative;
            z-index: 1;
          }
          .cta-content h2 {
            font-family: var(--font-heading);
            font-size: clamp(2rem, 4vw, 3rem);
            font-weight: 700;
            margin-bottom: 1.25rem;
          }
          .cta-content p {
            color: #8A8A9E;
            font-size: 1.1rem;
            max-width: 600px;
            margin: 0 auto 2.5rem;
            line-height: 1.7;
          }
          .cta-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
          }
        `}</style>
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

      <style jsx>{`
        .stat-card {
          padding: 2rem;
          text-align: center;
          cursor: default;
        }
        .stat-icon {
          font-size: 2rem;
          margin-bottom: 0.75rem;
        }
        .stat-number {
          font-family: var(--font-heading);
          font-size: 2.75rem;
          font-weight: 800;
          color: #D4AF37;
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .stat-label {
          color: #8A8A9E;
          font-size: 0.9rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
