"use client";

import Link from "next/link";
import Image from "next/image";

const blogPosts = [
  {
    title: "Why Northern Bypass is the Next Big Real Estate Hub in Karachi",
    date: "July 12, 2026",
    summary: "An in-depth analysis of infrastructural developments, connecting corridors, and price trends surrounding Northern Bypass.",
    image: "/h1.jpg",
  },
  {
    title: "Buying Residential Plots vs. Built Villas: A Detailed Guide",
    date: "June 28, 2026",
    summary: "Understand the financial benefits, construction flexibilities, and timelines to make the best investment choice.",
    image: "/h2.jpg",
  },
  {
    title: "Understanding NOC Approvals and Legal Checks for Karachi Properties",
    date: "May 18, 2026",
    summary: "Important step-by-step checklist to verify SBCA, LDA, or MDA approvals before buying any residential plots.",
    image: "/h1.jpg",
  },
];

export default function Blogs() {
  return (
    <>
      <div className="page-hero">
        <h1 className="text-gradient-gold">Company News & Blogs</h1>
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Blogs</span>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Latest <span className="gold-text">Market Insights</span></h2>
            <div className="gold-line" />
            <p>Stay up to date with real estate trends, investment guides, and construction updates from Karachi.</p>
          </div>

          <div className="grid-3">
            {blogPosts.map((post, i) => (
              <div key={i} className="glass-card blog-card">
                <div className="blog-img-wrapper">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={400}
                    height={250}
                    className="blog-img"
                  />
                  <span className="blog-date">{post.date}</span>
                </div>
                <div className="blog-content">
                  <h3>{post.title}</h3>
                  <p>{post.summary}</p>
                  <Link href="/contact" className="read-more">
                    Read Full Article →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .blog-card {
          overflow: hidden;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .blog-img-wrapper {
          position: relative;
          height: 200px;
        }
        :global(.blog-img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .blog-date {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(10, 10, 26, 0.85);
          color: var(--white);
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
        }
        .blog-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex-grow: 1;
        }
        .blog-content h3 {
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--white-pure);
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }
        .blog-content p {
          color: var(--gray-400);
          font-size: 0.88rem;
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }
        .read-more {
          color: var(--gold);
          font-size: 0.9rem;
          font-weight: 600;
          transition: color 0.2s;
        }
        .read-more:hover {
          color: var(--gold-light);
        }
      `}</style>
    </>
  );
}
