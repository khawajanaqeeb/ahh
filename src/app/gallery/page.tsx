"use client";

import Link from "next/link";
import Image from "next/image";

const galleryImages = [
  { src: "/h1.jpg", title: "Hooria Villas Site Development", category: "Construction" },
  { src: "/h2.jpg", title: "Summer Farm Houses Elevation", category: "Renders" },
  { src: "/h1.jpg", title: "AHH-City Site Plan Area", category: "Infrastructure" },
  { src: "/h2.jpg", title: "Labour City Plot Demarcation", category: "Construction" },
  { src: "/h2.jpg", title: "Completed Townhouse Design", category: "Delivered" },
  { src: "/h1.jpg", title: "Machinery on site", category: "Construction" },
];

export default function Gallery() {
  return (
    <>
      <div className="page-hero">
        <h1 className="text-gradient-gold">Project Gallery</h1>
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Gallery</span>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Visualizing <span className="gold-text">Our Progress</span></h2>
            <div className="gold-line" />
            <p>Real photos of on-site development work, heavy machinery deployment, and simulated architectural renders.</p>
          </div>

          <div className="grid-3">
            {galleryImages.map((img, i) => (
              <div key={i} className="glass-card gallery-card">
                <div className="gallery-img-wrapper">
                  <Image
                    src={img.src}
                    alt={img.title}
                    width={400}
                    height={300}
                    className="gallery-img"
                  />
                  <span className="gallery-category">{img.category}</span>
                </div>
                <div className="gallery-content">
                  <h3>{img.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .gallery-card {
          overflow: hidden;
          border-radius: var(--radius-md);
        }
        .gallery-img-wrapper {
          position: relative;
          height: 220px;
          overflow: hidden;
        }
        :global(.gallery-img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .gallery-card:hover :global(.gallery-img) {
          transform: scale(1.08);
        }
        .gallery-category {
          position: absolute;
          top: 15px;
          left: 15px;
          background: rgba(10, 10, 26, 0.85);
          color: var(--gold);
          border: 1px solid var(--gold);
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .gallery-content {
          padding: 1.25rem;
        }
        .gallery-content h3 {
          font-size: 1rem;
          color: var(--white);
          font-weight: 500;
        }
      `}</style>
    </>
  );
}
