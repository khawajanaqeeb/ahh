"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { MEDIA } from "@/lib/media";

const galleryItems = [
  // Office & Team
  { src: MEDIA.off1, title: "AHH Brothers Office", category: "Office", size: "wide" },
  { src: MEDIA.off2, title: "Office Meeting Room", category: "Office", size: "normal" },
  { src: MEDIA.off3, title: "Sales & Operations Floor", category: "Office", size: "normal" },
  { src: MEDIA.off4, title: "Executive Office Setup", category: "Office", size: "normal" },
  { src: MEDIA.off5, title: "Office Entrance & Reception", category: "Office", size: "wide" },
  { src: MEDIA.off6, title: "Team Discussion Area", category: "Office", size: "normal" },
  { src: MEDIA.off7, title: "Administration Wing", category: "Office", size: "normal" },
  // Projects
  { src: MEDIA.h1, title: "Hooria Villas Site Plan Overview", category: "Projects", size: "wide" },
  { src: MEDIA.h2, title: "Summer Farm Houses Aerial View", category: "Projects", size: "normal" },
  { src: MEDIA.h1, title: "AHH-City Master Layout", category: "Projects", size: "normal" },
  { src: MEDIA.h2, title: "Labour City Plot Layout", category: "Projects", size: "normal" },
  // Construction
  { src: MEDIA.off1, title: "Boundary Wall Construction", category: "Construction", size: "normal" },
  { src: MEDIA.off2, title: "Road Leveling Work", category: "Construction", size: "wide" },
  { src: MEDIA.off3, title: "Site Machinery Deployment", category: "Construction", size: "normal" },
  { src: MEDIA.off4, title: "Plot Demarcation Process", category: "Construction", size: "normal" },
  // Official Posters
  { src: MEDIA.posterAhhCityGrowthTerms, title: "AHH City Plot Rate Growth & Terms Poster", category: "Posters", size: "wide" },
  { src: MEDIA.posterInvestmentOpportunity, title: "1-Year Investment Plan (40k-45k/mo Profit)", category: "Posters", size: "normal" },
  { src: MEDIA.posterInterestFreeGrowth, title: "Invest in Interest-Free Business Growth Record", category: "Posters", size: "normal" },
  { src: MEDIA.posterHooriaVillasPaymentPlan, title: "Hooria Villas Payment Plan & Rates Poster", category: "Posters", size: "wide" },
  { src: MEDIA.posterLabourCity, title: "Labour City Residential Home Town Poster", category: "Posters", size: "wide" },
  { src: MEDIA.posterLabourCityPaymentPlan, title: "Labour City Payment Plan (80 Yds Res & 150 Yds Comm)", category: "Posters", size: "normal" },
  { src: MEDIA.posterSummerFarmhousesPaymentPlan, title: "Summer Farmhouses Official Payment Schedule Poster", category: "Posters", size: "wide" },
  { src: MEDIA.posterAhhCityPaymentPlan, title: "AHH City Official Combined Payment Plan Poster", category: "Posters", size: "wide" },
];

const categories = ["All", "Posters", "Office", "Projects", "Construction", "Delivered"];

const videos = [
  {
    thumbnail: MEDIA.off1,
    title: "Hooria Villas — Site Walkthrough",
    description: "A guided video tour of the Hooria Villas development site, showcasing the complete boundary wall, road infrastructure, and plot demarcation.",
    ytId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
    duration: "3:42",
  },
  {
    thumbnail: MEDIA.off5,
    title: "AHH Brothers Office Tour",
    description: "Take a look inside the AHH Brothers headquarters — our professional workspace where we manage all your property investments.",
    ytId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
    duration: "2:18",
  },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");

  const filtered = activeCategory === "All"
    ? galleryItems
    : galleryItems.filter((g) => g.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
  }, [lightboxIndex, filtered.length]);

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filtered.length);
  }, [lightboxIndex, filtered.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  return (
    <>
      <div className="page-hero">
        <h1 className="text-gradient-gold">Media Gallery</h1>
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Gallery</span>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Visualizing Excellence</div>
            <h2>Photos &amp; <span className="gold-text">Videos</span></h2>
            <div className="gold-line" />
            <p>Real photos from our offices, active construction sites, and successfully delivered projects.</p>
          </div>

          {/* Photo / Video Tabs */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginBottom: "2rem" }}>
            {(["photos", "videos"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "0.6rem 1.75rem",
                  borderRadius: "50px",
                  border: `1.5px solid ${activeTab === tab ? "#D4AF37" : "rgba(255,255,255,0.08)"}`,
                  background: activeTab === tab ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.03)",
                  color: activeTab === tab ? "#D4AF37" : "#8A8A9E",
                  fontWeight: activeTab === tab ? 700 : 500,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  textTransform: "capitalize",
                  transition: "all 0.25s",
                  letterSpacing: "0.04em",
                }}
              >
                {tab === "photos" ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    Photos
                  </span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                    Videos
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* PHOTOS TAB */}
          {activeTab === "photos" && (
            <>
              {/* Category Filter */}
              <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: "0.45rem 1.1rem",
                      borderRadius: "50px",
                      border: `1px solid ${activeCategory === cat ? "#D4AF37" : "rgba(255,255,255,0.08)"}`,
                      background: activeCategory === cat ? "rgba(212,175,55,0.12)" : "transparent",
                      color: activeCategory === cat ? "#D4AF37" : "#8A8A9E",
                      fontWeight: activeCategory === cat ? 600 : 400,
                      cursor: "pointer",
                      fontSize: "0.82rem",
                      transition: "all 0.2s",
                    }}
                  >
                    {cat} {activeCategory === cat && <span style={{ fontSize: "0.7rem" }}>({filtered.length})</span>}
                  </button>
                ))}
              </div>

              {/* Masonry Grid */}
              <div style={{ columns: "3 280px", gap: "1rem" }}>
                {filtered.map((item, i) => (
                  <div
                    key={`${item.src}-${i}`}
                    onClick={() => openLightbox(i)}
                    style={{
                      breakInside: "avoid",
                      marginBottom: "1rem",
                      borderRadius: "12px",
                      overflow: "hidden",
                      cursor: "pointer",
                      position: "relative",
                      border: "1px solid rgba(255,255,255,0.06)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    className="gallery-masonry-item"
                  >
                    <Image
                      src={item.src}
                      alt={item.title}
                      width={500}
                      height={item.size === "wide" ? 320 : 260}
                      style={{ width: "100%", height: "auto", display: "block" }}
                    />
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
                      padding: "1rem 1rem 0.75rem",
                      transform: "translateY(100%)",
                      transition: "transform 0.3s ease",
                    }} className="gallery-caption">
                      <span style={{ fontSize: "0.65rem", color: "#D4AF37", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>{item.category}</span>
                      <p style={{ color: "#F5F5F7", fontSize: "0.85rem", fontWeight: 600, marginTop: "0.2rem" }}>{item.title}</p>
                    </div>
                    <div style={{
                      position: "absolute", inset: 0, background: "rgba(212,175,55,0.04)",
                      opacity: 0, transition: "opacity 0.3s",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }} className="gallery-zoom-icon">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* VIDEOS TAB */}
          {activeTab === "videos" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
              {videos.map((video, i) => (
                <div key={i} className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
                  <div style={{ position: "relative", cursor: "pointer" }}
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${video.ytId}`, "_blank")}
                  >
                    <Image src={video.thumbnail} alt={video.title} width={500} height={280} style={{ width: "100%", height: 220, objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(212,175,55,0.9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px rgba(212,175,55,0.5)" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#0E0E1E"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      </div>
                    </div>
                    <div style={{ position: "absolute", bottom: "0.75rem", right: "0.75rem", background: "rgba(0,0,0,0.7)", color: "#D4AF37", fontSize: "0.78rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                      {video.duration}
                    </div>
                  </div>
                  <div style={{ padding: "1.25rem" }}>
                    <h3 style={{ color: "#F5F5F7", fontSize: "1rem", marginBottom: "0.4rem" }}>{video.title}</h3>
                    <p style={{ color: "#8A8A9E", fontSize: "0.83rem", lineHeight: 1.6 }}>{video.description}</p>
                  </div>
                </div>
              ))}

              {/* Add More Videos Note */}
              <div className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", border: "1px dashed rgba(212,175,55,0.3)", minHeight: 200 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5" style={{ marginBottom: "0.75rem" }}>
                  <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
                  <line x1="8" y1="11" x2="8" y2="13"/><line x1="7" y1="12" x2="9" y2="12"/>
                </svg>
                <p style={{ color: "#8A8A9E", fontSize: "0.88rem", marginBottom: "0.5rem" }}>More videos coming soon</p>
                <p style={{ color: "#8A8A9E", fontSize: "0.78rem" }}>Follow us on WhatsApp for latest site walkthrough videos</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="poster-modal-overlay" onClick={closeLightbox}>
          {/* Close */}
          <button
            className="poster-modal-close"
            onClick={closeLightbox}
            aria-label="Close photo view"
          >
            ✕ Close
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="Previous photo"
            style={{ position: "fixed", left: "1rem", top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", background: "rgba(212,175,55,0.25)", border: "1px solid rgba(212,175,55,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#D4AF37", zIndex: 10000, boxShadow: "0 4px 20px rgba(0,0,0,0.6)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          {/* Image */}
          <div
            className="poster-modal-content"
            style={{ flexDirection: "column", padding: "3.5rem 0.5rem 2rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].title}
              width={1600}
              height={2200}
              priority
              className="poster-modal-img"
            />
            <div style={{ textAlign: "center", marginTop: "1rem", padding: "0 1rem" }}>
              <div style={{ color: "#D4AF37", fontSize: "0.78rem", letterSpacing: "0.12em", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.25rem" }}>{filtered[lightboxIndex].category}</div>
              <div style={{ color: "#F5F5F7", fontSize: "1.1rem", fontWeight: 700 }}>{filtered[lightboxIndex].title}</div>
              <div style={{ color: "#8A8A9E", fontSize: "0.82rem", marginTop: "0.3rem" }}>{lightboxIndex + 1} / {filtered.length}</div>
            </div>
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="Next photo"
            style={{ position: "fixed", right: "1rem", top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", background: "rgba(212,175,55,0.25)", border: "1px solid rgba(212,175,55,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#D4AF37", zIndex: 10000, boxShadow: "0 4px 20px rgba(0,0,0,0.6)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      )}

      {/* Gallery Hover CSS */}
      <style>{`
        .gallery-masonry-item:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(212,175,55,0.15); }
        .gallery-masonry-item:hover .gallery-caption { transform: translateY(0); }
        .gallery-masonry-item:hover .gallery-zoom-icon { opacity: 1; }
      `}</style>
    </>
  );
}
