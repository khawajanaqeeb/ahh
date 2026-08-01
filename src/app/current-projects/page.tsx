"use client";

import Image from "next/image";
import Link from "next/link";
import { MEDIA } from "@/lib/media";

const currentProjects = [
  {
    id: "hooria-villas",
    name: "Hooria Villas",
    location: "Northern Bypass, Near Gulshan-e-Maymar, Karachi",
    type: "Residential Plots",
    size: "120 Sq Yards",
    status: "Under Development",
    badge: "active",
    payment: "8% Down Payment | 36 Monthly Installments",
    image: MEDIA.hooriaVillasLogo,
    description: "Premium residential plots located at a highly sought-after location in Northern Bypass. Features speedy development work, wide paved roads, boundary walls, sewage lines, electricity, and clean water networks. Highly secure investment opportunity with legal NOC clearance.",
    amenities: ["Gated Community", "24/7 Security", "Wide Asphalt Roads", "Mosque", "Public Park & Play Area", "Commercial Zone"],
  },
  {
    id: "summer-farm-houses",
    name: "Summer Farm Houses",
    location: "Malir / Gadap Area, Karachi, Sindh",
    type: "Farm Houses",
    size: "2000 to 4000 Sq Yards",
    status: "Now Booking",
    badge: "active",
    payment: "15% Down Payment | 24 Month Installment Plan",
    image: MEDIA.summerFarmhousesLogo,
    description: "A luxury escape from the hustle and bustle of Karachi city. Summer Farm Houses offers scenic natural views, private spaces, custom swimming pool construction options, modern fencing, and fully integrated utilities. The perfect farmhouse retreat for your family weekends.",
    amenities: ["Fruit Orchards", "Private Swimming Pools", "Boundary Wall Security", "Lush Green Landscapes", "Continuous Electricity Backup", "Modern Club House"],
  },
  {
    id: "labour-city",
    name: "Labour City",
    location: "Industrial Corridor, Karachi",
    type: "Affordable Housing Plots",
    size: "80 & 120 Sq Yards",
    status: "Now Booking",
    badge: "active",
    payment: "Easy Monthly Installments from PKR 6,000/month",
    image: MEDIA.labourCityLogo,
    description: "Designed specifically to bring affordable land and housing within reach of Karachi's hardworking professionals. Labour City features highly subsidised down payments, easy verification systems, and simple monthly payment terms. Located near industrial hubs for easy daily commutes.",
    amenities: ["Proximity to Industrial Area", "Public Transport Links", "Primary School", "Medical Clinic", "Community Center", "Basic Utilities Guarantee"],
  },
  {
    id: "ahh-city",
    name: "AHH-City",
    location: "Karachi Highway, Near Toll Plaza",
    type: "Mega Township Scheme",
    size: "120, 240 & 500 Sq Yards",
    status: "Launching Soon / Coming Soon",
    badge: "upcoming",
    payment: "Pre-Launch Bookings Open - Register Interest",
    image: MEDIA.ahhCityLogo,
    description: "Our flagship mega township vision features high-end infrastructure, multi-lane main avenues, smart waste management, modern security towers, school divisions, medical hospitals, and custom commercial centers. Register your interest today for premium pre-launch rates.",
    amenities: ["Smart City Infrastructure", "International Schools", "Hospital & Emergency Care", "Theme Park", "Modern Sports Complex", "Dedicated Utility Stations"],
  },
];

export default function CurrentProjects() {
  return (
    <>
      <div className="page-hero">
        <h1 className="text-gradient-gold">Current Projects</h1>
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Current Projects</span>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Active Developments & <span className="gold-text">Bookings</span></h2>
            <div className="gold-line" />
            <p>Select a project to explore layouts, sizes, payment schedules, and premium infrastructure amenities.</p>
          </div>

          <div className="project-detail-list">
            {currentProjects.map((p) => (
              <div key={p.id} id={p.id} className="project-detail-row glass-card">
                <div className="p-image-side">
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={600}
                    height={400}
                    className="p-detail-img"
                    style={{ objectFit: "contain", padding: "1.5rem", background: "linear-gradient(135deg, rgba(20,20,25,0.95), rgba(10,10,12,0.98))", borderRadius: "12px", width: "100%", height: "auto", maxHeight: "320px" }}
                  />
                  <div className={`p-badge p-badge-${p.badge}`}>{p.status}</div>
                </div>
                <div className="p-content-side">
                  <span className="p-type">{p.type}</span>
                  <h2>{p.name}</h2>
                  
                  <div className="p-meta">
                    <div className="p-meta-item" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <strong>Location:</strong> {p.location}
                    </div>
                    <div className="p-meta-item" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18" strokeWidth="1"/></svg>
                      <strong>Plot Sizes:</strong> {p.size}
                    </div>
                  </div>

                  <p className="p-desc">{p.description}</p>

                  <div className="p-payment-highlight" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    <strong>Payment Terms:</strong> {p.payment}
                  </div>

                  <div className="p-amenities">
                    <h4 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/></svg>
                      Included Amenities:
                    </h4>
                    <div className="amenity-grid">
                      {p.amenities.map((a, i) => (
                        <span key={i} className="amenity-tag">✓ {a}</span>
                      ))}
                    </div>
                  </div>

                  <div className="p-action-row">
                    <Link
                      href={`/contact?project=${encodeURIComponent(p.name)}`}
                      className="btn-gold"
                    >
                      Book Now / Inquiry
                    </Link>
                    <a
                      href={`https://wa.me/923111123160?text=Hello%20AHH%20Brothers%2C%20I%20am%20interested%20in%20booking%20a%20plot%20in%20${encodeURIComponent(p.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline"
                      style={{ color: "#25D366", borderColor: "#25D366", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="rgba(37,211,102,0.15)"/></svg>
                      WhatsApp Inquiry
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
