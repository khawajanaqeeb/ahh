"use client";

import Link from "next/link";


export default function ProjectsRedirect() {
  return (
    <>
      <div className="page-hero">
        <h1 className="text-gradient-gold">Our Projects</h1>
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Projects</span>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: "800px" }}>
          <div className="section-header">
            <h2>Select Project <span className="gold-text">Status</span></h2>
            <div className="gold-line" />
            <p>Explore our active construction bookings or view our completed and delivered societies.</p>
          </div>

          <div className="grid-2">
            <div className="glass-card project-choice-card">
              <div className="choice-icon">🏗️</div>
              <h3>Current Projects</h3>
              <p>Explore Hooria Villas, Summer Farm Houses, Labour City, and AHH-City. Active booking slots and development details.</p>
              <Link href="/current-projects" className="btn-gold" style={{ marginTop: "1rem" }}>
                View Active Bookings
              </Link>
            </div>

            <div className="glass-card project-choice-card">
              <div className="choice-icon">✅</div>
              <h3>Delivered Projects</h3>
              <p>Browse our successfully completed enclaves, transferred societies, and past resident community highlights.</p>
              <Link href="/delivered-projects" className="btn-outline" style={{ marginTop: "1rem" }}>
                View Completed Schemes
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .project-choice-card {
          padding: 3rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }
        .choice-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          width: 70px;
          height: 70px;
          background: rgba(212, 175, 55, 0.08);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .project-choice-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--white-pure);
          margin-bottom: 0.75rem;
        }
        .project-choice-card p {
          color: var(--gray-400);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
      `}</style>
    </>
  );
}
