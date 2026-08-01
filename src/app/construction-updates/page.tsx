"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MEDIA } from "@/lib/media";

const projects = [
  {
    id: "hooria-villas",
    name: "Hooria Villas",
    status: "Active Development",
    overallProgress: 62,
    description: "120 Sq Yd residential plots in a gated township on Northern Bypass, Karachi.",
    image: MEDIA.off3,
    color: "#D4AF37",
    updates: [
      {
        month: "July 2025",
        image: MEDIA.off1,
        title: "Boundary Wall — 100% Complete",
        desc: "Entire perimeter boundary wall completed with main entrance gate structure erected.",
        milestones: ["Perimeter wall complete", "Main gate structure installed", "Security cabin established"],
      },
      {
        month: "May 2025",
        image: MEDIA.off2,
        title: "Road Infrastructure",
        desc: "Main boulevard and street road leveling completed. Drainage channels under progress.",
        milestones: ["Main boulevard leveled", "Street roads marked", "Drainage channels 40% done"],
      },
      {
        month: "March 2025",
        image: MEDIA.off4,
        title: "Site Clearing & Demarcation",
        desc: "Full site clearing completed. Plot demarcation and block division marked.",
        milestones: ["Site 100% cleared", "Blocks A–D demarcated", "Survey stones installed"],
      },
    ],
  },
  {
    id: "labour-city",
    name: "Labour City",
    status: "Foundation Phase",
    overallProgress: 38,
    description: "Affordable housing project for Karachi's workforce with easy installments.",
    image: MEDIA.off5,
    color: "#C5A028",
    updates: [
      {
        month: "July 2025",
        image: MEDIA.off6,
        title: "Approval & Registration",
        desc: "Sindh Building Control Authority (SBCA) registration completed. NOC received.",
        milestones: ["SBCA registration done", "NOC received", "Legal clearance obtained"],
      },
      {
        month: "April 2025",
        image: MEDIA.off7,
        title: "Land Acquisition",
        desc: "Complete land acquisition and title deed transfer completed. Site preparation begun.",
        milestones: ["Land acquisition complete", "Title deed transferred", "Survey completed"],
      },
    ],
  },
  {
    id: "ahh-city",
    name: "AHH-City",
    status: "Pre-Launch",
    overallProgress: 18,
    description: "Premium township with farmhouse, residential, and commercial components.",
    image: MEDIA.off2,
    color: "#E8CC6E",
    updates: [
      {
        month: "July 2025",
        image: MEDIA.off3,
        title: "Master Plan Approved",
        desc: "Full master plan design approved by architectural board. Environmental clearance pending.",
        milestones: ["Master plan approved", "Architect board sign-off", "Environmental clearance filed"],
      },
    ],
  },
];

export default function ConstructionUpdates() {
  const [activeProject, setActiveProject] = useState("hooria-villas");
  const project = projects.find((p) => p.id === activeProject)!;

  return (
    <>
      <div className="page-hero">
        <h1 className="text-gradient-gold">Construction Updates</h1>
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Construction Updates</span>
        </div>
      </div>

      {/* Project Selector */}
      <section className="section" style={{ paddingBottom: "1rem" }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">Live Progress</div>
            <h2>On-Site <span className="gold-text">Development Status</span></h2>
            <div className="gold-line" />
            <p>Real-time construction milestones and monthly photo updates for every active AHH Brothers project.</p>
          </div>

          {/* Project Tabs */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveProject(p.id)}
                style={{
                  padding: "0.75rem 1.75rem",
                  borderRadius: "50px",
                  border: `1.5px solid ${activeProject === p.id ? p.color : "rgba(255,255,255,0.08)"}`,
                  background: activeProject === p.id ? `rgba(212,175,55,0.15)` : "rgba(255,255,255,0.03)",
                  color: activeProject === p.id ? p.color : "#8A8A9E",
                  fontWeight: activeProject === p.id ? 700 : 500,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  transition: "all 0.25s",
                  letterSpacing: "0.03em",
                }}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Overall Progress Card */}
          <div className="glass-card" style={{ padding: "2rem", marginBottom: "2.5rem", border: `1px solid ${project.color}40` }}>
            <div className="progress-card-inner" style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "start", gap: "1.5rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.7rem", color: project.color, letterSpacing: "0.15em", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.4rem" }}>
                  {project.status}
                </div>
                <h2 style={{ color: "#F5F5F7", fontSize: "1.6rem", marginBottom: "0.5rem" }}>{project.name}</h2>
                <p style={{ color: "#8A8A9E", fontSize: "0.9rem", marginBottom: "1.5rem", maxWidth: 500 }}>{project.description}</p>

                <div style={{ marginBottom: "0.6rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#8A8A9E", fontSize: "0.82rem" }}>Overall Completion</span>
                  <span style={{ color: project.color, fontWeight: 700, fontSize: "1.1rem" }}>{project.overallProgress}%</span>
                </div>
                <div style={{ height: 10, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${project.overallProgress}%`, height: "100%", background: `linear-gradient(90deg, ${project.color}80, ${project.color})`, borderRadius: 99, transition: "width 1s ease" }} />
                </div>
              </div>

              <div style={{ flexShrink: 0, width: 140, height: 100, borderRadius: 12, overflow: "hidden", border: `1px solid ${project.color}40` }}>
                <Image src={project.image} alt={project.name} width={140} height={100} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
          </div>

          {/* Monthly Updates Timeline */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 28, top: 0, bottom: 0, width: 2, background: "rgba(212,175,55,0.15)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {project.updates.map((update, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: "1.5rem", alignItems: "flex-start" }}>
                  {/* Timeline Dot */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "1.5rem" }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: project.color, boxShadow: `0 0 12px ${project.color}80`, flexShrink: 0 }} />
                  </div>

                  {/* Card */}
                  <div className="glass-card" style={{ padding: "1.5rem" }}>
                    <div className="update-card-inner" style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: "1.5rem", alignItems: "start" }}>
                      <div>
                        <div style={{ fontSize: "0.72rem", color: project.color, letterSpacing: "0.12em", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.35rem" }}>{update.month}</div>
                        <h3 style={{ color: "#F5F5F7", fontSize: "1.1rem", marginBottom: "0.6rem" }}>{update.title}</h3>
                        <p style={{ color: "#8A8A9E", fontSize: "0.87rem", lineHeight: 1.7, marginBottom: "1rem" }}>{update.desc}</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                          {update.milestones.map((m, mi) => (
                            <div key={mi} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={project.color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                              <span style={{ color: "#C5C5D3", fontSize: "0.83rem" }}>{m}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="update-card-img" style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${project.color}30` }}>
                        <Image src={update.image} alt={update.title} width={180} height={130} style={{ width: "100%", height: 130, objectFit: "cover" }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Notify Me */}
      <section className="section section-alt">
        <div className="container" style={{ maxWidth: 600, textAlign: "center" }}>
          <div className="section-label">Stay Updated</div>
          <h2>Get <span className="gold-text">Monthly Updates</span> via WhatsApp</h2>
          <div className="gold-line" />
          <p style={{ color: "#8A8A9E", marginBottom: "2rem" }}>
            Join our construction update broadcast list and receive monthly progress photos, milestone notifications, and handover schedules directly on WhatsApp.
          </p>
          <a
            href="https://wa.me/923111123160?text=Hello%20AHH%20Brothers%21%20Please%20add%20me%20to%20your%20construction%20update%20broadcast%20list."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
            style={{ display: "inline-flex" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            Join WhatsApp Broadcast
          </a>
        </div>
      </section>
    </>
  );
}
