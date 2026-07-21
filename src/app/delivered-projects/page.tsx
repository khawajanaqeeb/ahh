"use client";

import Image from "next/image";
import Link from "next/link";

const deliveredProjects = [
  {
    id: "maymar-villas-alt",
    name: "Maymar Area Residency Plots",
    location: "Sector Y, Gulshan-e-Maymar, Karachi",
    type: "Residential Townhouse Project",
    size: "120 & 240 Sq Yards",
    deliveryYear: "2018",
    status: "100% Delivered / Handed Over",
    image: "/h2.jpg",
    description: "A successfully delivered residential plot project that has now grown into a flourishing neighborhood with beautiful townhouses built by our happy clients. Features fully underground electricity cabling, high pressure water networks, and fully functional streetlights.",
    stats: { families: "150+ Families Resident", parks: "2 Public Parks" },
  },
  {
    id: "gadap-agricultural-plots",
    name: "Gadap Agri Enclave",
    location: "Gadap Town, Karachi Outskirts",
    type: "Agricultural & Farm Land plots",
    size: "1 to 4 Acres",
    deliveryYear: "2021",
    status: "Delivered & Transferred",
    image: "/h1.jpg",
    description: "Developed and demarcated clean agricultural farmland plots equipped with high flow tube wells and basic boundary protection. Over 80% of buyers have set up customized private weekend getaways, organic orchards, and small dairy farms.",
    stats: { families: "80+ Owners", parks: "1 Community Lake" },
  },
];

export default function DeliveredProjects() {
  return (
    <>
      <div className="page-hero">
        <h1 className="text-gradient-gold">Delivered Projects</h1>
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Delivered Projects</span>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>A Legacy of <span className="gold-text">Successful Delivery</span></h2>
            <div className="gold-line" />
            <p>We pride ourselves on turning map blueprints into real physical living communities with successful handovers.</p>
          </div>

          <div className="grid-2">
            {deliveredProjects.map((p) => (
              <div key={p.id} className="project-card flex flex-col justify-between">
                <div className="card-image">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                  <span className="card-badge badge-completed">
                    {p.status}
                  </span>
                </div>
                <div className="card-content flex-grow flex flex-col justify-between" style={{ padding: "2rem" }}>
                  <div>
                    <span className="d-type">{p.type}</span>
                    <h3 style={{ fontSize: "1.6rem", margin: "0.5rem 0" }}>{p.name}</h3>
                    
                    <div className="d-meta">
                      <div>📍 {p.location}</div>
                      <div>📏 Size: {p.size}</div>
                      <div>📅 Delivered Year: {p.deliveryYear}</div>
                    </div>

                    <p style={{ color: "var(--gray-400)", fontSize: "0.92rem", margin: "1rem 0 1.5rem", lineHeight: 1.6 }}>
                      {p.description}
                    </p>
                  </div>

                  <div className="d-stats-row">
                    <div className="d-stat">
                      <strong>👨‍👩‍👧‍👦 {p.stats.families}</strong>
                    </div>
                    <div className="d-stat">
                      <strong>🌳 {p.stats.parks}</strong>
                    </div>
                  </div>

                  <div style={{ marginTop: "1.5rem" }}>
                    <Link
                      href="/contact"
                      className="btn-outline"
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      Inquire About Past Resales
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .d-type {
          font-size: 0.8rem;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 600;
        }
        .d-meta {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-size: 0.85rem;
          color: var(--gray-200);
          margin-top: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.75rem;
        }
        .d-stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          background: rgba(212, 175, 55, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.1);
          padding: 0.75rem;
          border-radius: 8px;
          text-align: center;
        }
        .d-stat {
          font-size: 0.85rem;
          color: var(--gold-light);
        }
      `}</style>
    </>
  );
}
