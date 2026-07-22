"use client";

import Image from "next/image";
import Link from "next/link";


const timelineEvents = [
  {
    year: "1977",
    title: "Foundation of AHH Brothers",
    desc: "Established as a family-run construction and contracting firm in Karachi, laying the groundwork for decades of quality building.",
  },
  {
    year: "1995",
    title: "Expanding to Land Development",
    desc: "Began acquiring and developing prime land residential societies, expanding our role from builders to full-scale developers.",
  },
  {
    year: "2010",
    title: "Affordable Housing Milestone",
    desc: "Launched several residential plot initiatives aimed at providing low-cost, high-value living options for families in Karachi.",
  },
  {
    year: "2024",
    title: "Hooria Villas & Modern Projects",
    desc: "Initiated key residential plot schemes like Hooria Villas near Gulshan-e-Maymar, incorporating modern design layouts and speedy development.",
  },
];

const values = [
  {
    title: "Unity",
    desc: "Consistent with our motto 'Our Power Is Our Unity', we work cohesively to deliver excellence.",
    icon: "🤝",
  },
  {
    title: "Quality Construction",
    desc: "No compromise on building materials, infrastructure development, and engineering integrity.",
    icon: "🏗️",
  },
  {
    title: "Commitment",
    desc: "We stay true to our promises on delivery schedules, documentation, and pricing plans.",
    icon: "📜",
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

      {/* Legacy / History Section */}
      <section className="section">
        <div className="container">
          <div className="about-details-grid">
            <div className="about-details-text">
              <h2 className="section-title">
                Building Trust Since <span className="text-gradient-gold">1977</span>
              </h2>
              <div className="gold-line-left" />
              <p className="intro-text">
                AHH Brothers & Developers is a close-knit family of housebuilders, developers, and contractors. 
                With the unique ability to wear multiple hats – developer and contractor – we bring flexibility, 
                uncompromising quality, and deep-seated commitment to every project.
              </p>
              <p className="normal-text">
                Over the past four decades, we have established ourselves as one of the trusted names in {"Karachi's"} 
                real estate landscape. Our primary focus is creating secure, premium, yet highly affordable 
                residential developments where families can live safely and investors can grow their capital.
              </p>
            </div>
            <div className="about-details-logo glass-card">
              <Image
                src="/ahh-logo.jpg"
                alt="AHH Brothers Logo Logo"
                width={300}
                height={300}
                className="about-large-logo"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values Section */}
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

      {/* Timeline Section */}
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

      <style>{`
        .about-details-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 4rem;
          align-items: center;
        }
        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .intro-text {
          color: var(--white);
          font-size: 1.15rem;
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }
        .normal-text {
          color: var(--gray-400);
          font-size: 1rem;
          line-height: 1.7;
        }
        .about-details-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
        }
        :global(.about-large-logo) {
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        }
        
        /* Value Card */
        .value-card {
          padding: 2.5rem 2rem;
          text-align: center;
        }
        .value-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .value-card h3 {
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--white);
          margin-bottom: 0.75rem;
        }
        .value-card p {
          color: var(--gray-400);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        /* Timeline styling */
        .timeline-container {
          position: relative;
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 0;
        }
        .timeline-container::after {
          content: '';
          position: absolute;
          width: 2px;
          background: linear-gradient(180deg, var(--gold) 0%, transparent 100%);
          top: 0;
          bottom: 0;
          left: 50%;
          margin-left: -1px;
        }
        .timeline-item {
          padding: 10px 40px;
          position: relative;
          background-color: inherit;
          width: 50%;
        }
        .timeline-item::after {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          right: -8px;
          background-color: var(--black);
          border: 3px solid var(--gold);
          top: 30px;
          border-radius: 50%;
          z-index: 1;
        }
        .left {
          left: 0;
        }
        .right {
          left: 50%;
        }
        .right::after {
          left: -8px;
        }
        .timeline-content {
          padding: 2rem;
          position: relative;
        }
        .timeline-year {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--gold);
          margin-bottom: 0.5rem;
        }
        .timeline-content h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .timeline-content p {
          color: var(--gray-400);
          font-size: 0.92rem;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .about-details-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .timeline-container::after {
            left: 31px;
          }
          .timeline-item {
            width: 100%;
            padding-left: 70px;
            padding-right: 25px;
          }
          .timeline-item::after {
            left: 23px;
            right: auto;
          }
          .left, .right {
            left: 0;
          }
        }
      `}</style>
    </>
  );
}
