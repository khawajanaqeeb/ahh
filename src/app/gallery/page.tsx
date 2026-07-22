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
    </>
  );
}
