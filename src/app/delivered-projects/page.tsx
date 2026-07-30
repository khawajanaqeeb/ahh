"use client";

import Image from "next/image";
import Link from "next/link";

const deliveredProjects = [
  {
    id: "anban-mega-city",
    name: "ANBAN Mega City",
    location: "Sujani Town, Near W-11 Last Bus Stop, Karachi",
    type: "Mega Residential Township",
    status: "100% Delivered",
    badge: "completed",
    icon: "🏙️",
    description:
      "A landmark mega residential city project successfully delivered at Sujani Town near the W-11 last bus stop. ANBAN Mega City provided affordable plot options in a fully planned community with proper infrastructure, road networks, and essential utilities.",
    highlights: ["Fully Developed Roads", "Underground Utilities", "Complete Handover"],
  },
  {
    id: "city-housing-society",
    name: "City Housing Society",
    location: "Ahsanabad, Gulshan-e-Maymar, Karachi",
    type: "Residential Housing Society",
    status: "100% Delivered",
    badge: "completed",
    icon: "🏘️",
    description:
      "City Housing Society in Ahsanabad, Gulshan-e-Maymar was developed as a well-planned residential society offering secure, legally documented plots. All units were successfully handed over to satisfied owners who have since built thriving homes in this vibrant community.",
    highlights: ["Prime Gulshan-e-Maymar Location", "Legal Documentation", "Fully Handed Over"],
  },
  {
    id: "gul-heights",
    name: "Gul Heights",
    location: "Nazimabad, Karachi",
    type: "High-Rise Residential Project",
    status: "Delivered",
    badge: "completed",
    icon: "🏢",
    description:
      "Gul Heights stands as AHH Brothers' prestigious high-rise residential project in the heart of Nazimabad. This vertical development delivered modern apartments with quality finishes, offering families a premium urban living experience in one of Karachi's most sought-after neighborhoods.",
    highlights: ["High-Rise Construction", "Modern Finishes", "Central Nazimabad Location"],
  },
  {
    id: "four-seasons-farm-houses-phase1",
    name: "Four Seasons Farm Houses — Phase 1",
    location: "Gadap Town, Karachi",
    type: "Farm House Community",
    status: "Phase 1 Delivered",
    badge: "completed",
    image: "/four-seasons-farmhouses-logo.png",
    icon: "🌿",
    description:
      "Four Seasons Farm Houses Phase 1 in Gadap Town brought the dream of countryside living to Karachi. With spacious farmhouse plots surrounded by greenery, buyers enjoyed a serene escape from the city. Phase 1 was fully developed and handed over, with buyers customizing their own private retreats.",
    highlights: ["Gadap Town Green Belt", "Spacious Farm Plots", "Phase 1 Complete"],
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
            <p>
              Since our founding in 2018, AHH Brothers has successfully delivered 4 major
              projects — turning blueprints into thriving communities across Karachi.
            </p>
          </div>

          {/* Stats bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "1.5rem",
              marginBottom: "4rem",
            }}
          >
            {[
              { num: "4", label: "Projects Delivered" },
              { num: "500+", label: "Happy Families" },
              { num: "100%", label: "On-Time Handover" },
              { num: "2018", label: "Founded" },
            ].map((s) => (
              <div
                key={s.label}
                className="glass-card"
                style={{ padding: "1.5rem", textAlign: "center" }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#D4AF37",
                    fontFamily: "var(--font-heading)",
                    lineHeight: 1,
                    marginBottom: "0.5rem",
                  }}
                >
                  {s.num}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#8A8A9E", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Projects grid */}
          <div className="grid-2">
            {deliveredProjects.map((p) => (
              <div
                key={p.id}
                className="glass-card"
                style={{
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 24px 64px rgba(212,175,55,0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                }}
              >
                {/* Card header */}
                <div
                  style={{
                    background: "linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))",
                    borderBottom: "1px solid rgba(212,175,55,0.15)",
                    padding: "2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "16px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(212,175,55,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.8rem",
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={60}
                        height={60}
                        style={{ objectFit: "contain", width: "100%", height: "100%", padding: "4px" }}
                      />
                    ) : (
                      <span>{p.icon}</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.25rem 0.75rem",
                        background: "rgba(34,197,94,0.1)",
                        color: "#22c55e",
                        borderRadius: "20px",
                        fontSize: "0.72rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        border: "1px solid rgba(34,197,94,0.25)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      ✓ {p.status}
                    </span>
                    <h3 style={{ color: "#F5F5F7", fontSize: "1.2rem", marginBottom: "0.25rem", lineHeight: 1.3 }}>{p.name}</h3>
                    <p style={{ color: "#8A8A9E", fontSize: "0.82rem" }}>{p.type}</p>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: "1.75rem", flex: 1, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span style={{ color: "#C5C5D3", fontSize: "0.88rem" }}>{p.location}</span>
                  </div>

                  <p style={{ color: "#8A8A9E", fontSize: "0.9rem", lineHeight: 1.75, flex: 1 }}>{p.description}</p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {p.highlights.map((h) => (
                      <span
                        key={h}
                        style={{
                          padding: "0.3rem 0.75rem",
                          background: "rgba(212,175,55,0.08)",
                          border: "1px solid rgba(212,175,55,0.2)",
                          borderRadius: "20px",
                          fontSize: "0.75rem",
                          color: "#D4AF37",
                        }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/contact"
                    className="btn-outline"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    Inquire About This Project
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
