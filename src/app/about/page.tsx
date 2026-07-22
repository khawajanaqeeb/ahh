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
    icon: "ðŸ¤",
  },
  {
    title: "Quality Construction",
    desc: "No compromise on building materials, infrastructure development, and engineering integrity.",
    icon: "ðŸ—ï¸",
  },
  {
    title: "Commitment",
    desc: "We stay true to our promises on delivery schedules, documentation, and pricing plans.",
    icon: "ðŸ“œ",
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
                With the unique ability to wear multiple hats â€“ developer and contractor â€“ we bring flexibility, 
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
    </>
  );
}
