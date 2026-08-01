"use client";

import Link from "next/link";
import { useState } from "react";

const projects = [
  { id: "hooria-villas", name: "Hooria Villas", size: "120 Sq Yards", location: "Northern Bypass, Near Gulshan-e-Maymar" },
  { id: "summer-farm-houses", name: "Summer Farm Houses", size: "Various Sizes", location: "Karachi, Sindh" },
  { id: "labour-city", name: "Labour City", size: "80–120 Sq Yards", location: "Karachi, Sindh" },
  { id: "ahh-city", name: "AHH-City", size: "120–500 Sq Yards", location: "Karachi, Sindh" },
];

const timeSlots = [
  "9:00 AM – 10:00 AM",
  "10:00 AM – 11:00 AM",
  "11:00 AM – 12:00 PM",
  "12:00 PM – 1:00 PM",
  "2:00 PM – 3:00 PM",
  "3:00 PM – 4:00 PM",
  "4:00 PM – 5:00 PM",
];

export default function SiteVisit() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    projects: [] as string[],
    date: "",
    timeSlot: "",
    message: "",
    transport: "self",
  });
  const [submitted, setSubmitted] = useState(false);

  const toggleProject = (id: string) => {
    setForm((p) => ({
      ...p,
      projects: p.projects.includes(id) ? p.projects.filter((x) => x !== id) : [...p.projects, id],
    }));
  };

  const selectedProjectNames = form.projects
    .map((id) => projects.find((p) => p.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hello AHH Brothers! I would like to schedule a site visit.\n\n` +
      `👤 Name: ${form.name}\n📞 Phone: ${form.phone}\n📧 Email: ${form.email}\n\n` +
      `🏗️ Projects: ${selectedProjectNames || "Not specified"}\n` +
      `📅 Preferred Date: ${form.date || "Flexible"}\n` +
      `⏰ Preferred Time: ${form.timeSlot || "Flexible"}\n` +
      `🚗 Transport: ${form.transport === "pickup" ? "Please arrange pickup" : "I will come myself"}\n\n` +
      `Message: ${form.message}`
    );
    window.open(`https://wa.me/923111123160?text=${msg}`, "_blank");
    setSubmitted(true);
  };

  return (
    <>
      <div className="page-hero">
        <h1 className="text-gradient-gold">Schedule a Site Visit</h1>
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Site Visit</span>
        </div>
      </div>

      {/* Benefits Section */}
      <section style={{ padding: "2.5rem 0", borderBottom: "1px solid rgba(212,175,55,0.1)" }}>
        <div className="container">
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2.5rem" }}>
            {[
              { icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8"><circle cx="12" cy="12" r="10" fill="rgba(212,175,55,0.1)"/><polyline points="12 6 12 12 16 14"/></svg>), label: "1–2 Hours", sublabel: "Guided tour duration" },
              { icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8"><rect x="1" y="3" width="15" height="13" fill="rgba(212,175,55,0.1)"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>), label: "Free Pickup", sublabel: "From Gulshan-e-Maymar" },
              { icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="rgba(212,175,55,0.1)"/><circle cx="9" cy="7" r="4" fill="rgba(212,175,55,0.1)"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>), label: "Expert Guide", sublabel: "Senior sales executive" },
              { icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(212,175,55,0.1)"/></svg>), label: "Zero Commitment", sublabel: "No pressure booking" },
            ].map(({ icon, label, sublabel }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <div style={{ width: 52, height: 52, borderRadius: "12px", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {icon}
                </div>
                <div>
                  <div style={{ color: "#D4AF37", fontWeight: 700, fontSize: "1rem" }}>{label}</div>
                  <div style={{ color: "#8A8A9E", fontSize: "0.8rem" }}>{sublabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="section">
        <div className="site-visit-container container" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "3rem", alignItems: "start" }}>
          {/* Form */}
          <div>
            <div className="section-label">Book Your Visit</div>
            <h2 style={{ marginBottom: "0.5rem" }}>Request a <span className="gold-text">Free Site Tour</span></h2>
            <div className="gold-line-left" style={{ marginBottom: "2rem" }} />

            {submitted ? (
              <div className="glass-card" style={{ padding: "2.5rem", textAlign: "center", border: "1px solid rgba(212,175,55,0.3)" }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" style={{ margin: "0 auto 1rem" }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" fill="rgba(212,175,55,0.1)"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <h3 style={{ color: "#D4AF37", fontSize: "1.4rem", marginBottom: "0.5rem" }}>Visit Booked!</h3>
                <p style={{ color: "#8A8A9E", marginBottom: "1.5rem" }}>Your WhatsApp inquiry was sent. Our team will confirm within a few hours.</p>
                <Link href="/" className="btn-gold" style={{ display: "inline-flex" }}>Back to Home</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Contact Info */}
                <div className="glass-card" style={{ padding: "1.5rem" }}>
                  <h3 style={{ color: "#D4AF37", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Your Details</h3>
                  <div className="form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", color: "#8A8A9E", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Full Name *</label>
                      <input
                        type="text" placeholder="Muhammad Ahmed" required
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        style={{ width: "100%", padding: "0.7rem 0.9rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#F5F5F7", fontSize: "0.9rem", outline: "none" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", color: "#8A8A9E", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>WhatsApp / Phone *</label>
                      <input
                        type="tel" placeholder="+92 311 1234567" required
                        value={form.phone}
                        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                        style={{ width: "100%", padding: "0.7rem 0.9rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#F5F5F7", fontSize: "0.9rem", outline: "none" }}
                      />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", color: "#8A8A9E", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Email (optional)</label>
                      <input
                        type="email" placeholder="m.ahmed@email.com"
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        style={{ width: "100%", padding: "0.7rem 0.9rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#F5F5F7", fontSize: "0.9rem", outline: "none" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Project Selection */}
                <div className="glass-card" style={{ padding: "1.5rem" }}>
                  <h3 style={{ color: "#D4AF37", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Projects to Visit</h3>
                  <div className="project-btn-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                    {projects.map((p) => (
                      <label
                        key={p.id}
                        style={{
                          display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.85rem 1rem",
                          borderRadius: "10px", cursor: "pointer",
                          border: `1.5px solid ${form.projects.includes(p.id) ? "#D4AF37" : "rgba(255,255,255,0.07)"}`,
                          background: form.projects.includes(p.id) ? "rgba(212,175,55,0.08)" : "rgba(255,255,255,0.02)",
                          transition: "all 0.2s",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={form.projects.includes(p.id)}
                          onChange={() => toggleProject(p.id)}
                          style={{ accentColor: "#D4AF37", marginTop: "2px" }}
                        />
                        <div>
                          <div style={{ color: form.projects.includes(p.id) ? "#D4AF37" : "#F5F5F7", fontWeight: 600, fontSize: "0.88rem" }}>{p.name}</div>
                          <div style={{ color: "#8A8A9E", fontSize: "0.74rem", marginTop: "0.2rem" }}>{p.size}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="glass-card" style={{ padding: "1.5rem" }}>
                  <h3 style={{ color: "#D4AF37", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Preferred Schedule</h3>
                  <div className="form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", color: "#8A8A9E", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Date</label>
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={form.date}
                        onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                        style={{ width: "100%", padding: "0.7rem 0.9rem", background: "rgba(14,14,30,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#F5F5F7", fontSize: "0.9rem", outline: "none", colorScheme: "dark" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", color: "#8A8A9E", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Time Slot</label>
                      <select
                        value={form.timeSlot}
                        onChange={(e) => setForm((p) => ({ ...p, timeSlot: e.target.value }))}
                        style={{ width: "100%", padding: "0.7rem 0.9rem", background: "rgba(14,14,30,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#F5F5F7", fontSize: "0.9rem", outline: "none" }}
                      >
                        <option value="">Any time</option>
                        {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginTop: "1rem" }}>
                    <label style={{ display: "block", color: "#8A8A9E", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Transport</label>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      {[{ id: "self", label: "I'll come myself" }, { id: "pickup", label: "Request pickup" }].map(({ id, label }) => (
                        <label
                          key={id}
                          style={{
                            flex: 1, display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.7rem 1rem", borderRadius: "8px", cursor: "pointer",
                            border: `1.5px solid ${form.transport === id ? "#D4AF37" : "rgba(255,255,255,0.07)"}`,
                            background: form.transport === id ? "rgba(212,175,55,0.08)" : "rgba(255,255,255,0.02)",
                            transition: "all 0.2s",
                          }}
                        >
                          <input type="radio" name="transport" value={id} checked={form.transport === id} onChange={() => setForm((p) => ({ ...p, transport: id })) } style={{ accentColor: "#D4AF37" }} />
                          <span style={{ color: form.transport === id ? "#D4AF37" : "#8A8A9E", fontSize: "0.85rem", fontWeight: form.transport === id ? 600 : 400 }}>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: "block", color: "#8A8A9E", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Additional Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Any specific requirements or questions..."
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#F5F5F7", fontSize: "0.9rem", outline: "none", resize: "vertical" }}
                  />
                </div>

                <button type="submit" className="btn-gold" style={{ justifyContent: "center", fontSize: "1rem" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  Book Site Visit via WhatsApp
                </button>
              </form>
            )}
          </div>

          {/* Info Panel */}
          <div className="site-visit-layout" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", position: "sticky", top: "6rem" }}>
            <div className="glass-card" style={{ padding: "1.5rem", border: "1px solid rgba(212,175,55,0.25)" }}>
              <h3 style={{ color: "#D4AF37", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Visit Information</h3>
              {[
                { icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>), label: "Site Location", value: "Northern Bypass, Near Gulshan-e-Maymar, Karachi" },
                { icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>), label: "Visit Days", value: "Saturday – Thursday\n(Closed on Friday)" },
                { icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>), label: "Visit Hours", value: "9:00 AM – 5:00 PM" },
                { icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 9.81a2 2 0 0 1 2-2.18h3"/></svg>), label: "Call Us", value: "+92 311 1123160\n+92 321 2345678" },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: "flex", gap: "0.85rem", marginBottom: "1rem", alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ color: "#D4AF37", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{label}</div>
                    <div style={{ color: "#C5C5D3", fontSize: "0.85rem", lineHeight: 1.5, whiteSpace: "pre-line" }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card" style={{ padding: "1.25rem", background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)" }}>
              <p style={{ color: "#D4AF37", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.4rem" }}>💡 Pro Tip</p>
              <p style={{ color: "#8A8A9E", fontSize: "0.82rem", lineHeight: 1.6 }}>
                Bring your CNIC and confirm your slot a day before. We can arrange a complimentary pickup from Gulshan-e-Maymar bus stop.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
