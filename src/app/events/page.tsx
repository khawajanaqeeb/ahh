"use client";

import Link from "next/link";
import Image from "next/image";

const events = [
  {
    title: "Hooria Villas Site Visit & Launch Ceremony",
    date: "August 15, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Hooria Villas Site, Northern Bypass",
    desc: "Join us for an exclusive on-site launching ceremony, layout presentation, and a guided tour of current speedy development progress.",
    image: "/h1.jpg",
  },
  {
    title: "Karachi Property Expo 2026",
    date: "September 05-07, 2026",
    time: "11:00 AM - 8:00 PM",
    location: "Expo Center, Karachi (Hall 2, Booth A4)",
    desc: "Meet our executive team at the Karachi Property Expo to explore exclusive pre-launch booking rates for AHH-City and Labour City.",
    image: "/h2.jpg",
  },
];

export default function Events() {
  return (
    <>
      <div className="page-hero">
        <h1 className="text-gradient-gold">Upcoming Events</h1>
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Events</span>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Connect <span className="gold-text">With Us</span></h2>
            <div className="gold-line" />
            <p>Attend our site visits, corporate launch ceremonies, and property expos to see our development work firsthand.</p>
          </div>

          <div className="event-list">
            {events.map((ev, i) => (
              <div key={i} className="event-row glass-card">
                <div className="event-img-side">
                  <Image
                    src={ev.image}
                    alt={ev.title}
                    width={400}
                    height={250}
                    className="event-img"
                  />
                </div>
                <div className="event-text-side">
                  <span className="event-date-badge">{ev.date}</span>
                  <h3>{ev.title}</h3>
                  <div className="event-details">
                    <div>🕒 {ev.time}</div>
                    <div>📍 {ev.location}</div>
                  </div>
                  <p>{ev.desc}</p>
                  <Link href="/contact" className="btn-gold" style={{ marginTop: "1rem", alignSelf: "flex-start" }}>
                    Register for Event
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .event-list {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          max-width: 900px;
          margin: 0 auto;
        }
        .event-row {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          overflow: hidden;
          border-radius: var(--radius-md);
        }
        .event-img-side {
          height: 100%;
          min-height: 220px;
        }
        :global(.event-img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .event-text-side {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .event-date-badge {
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid var(--gold);
          color: var(--gold);
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.78rem;
          font-weight: 600;
          align-self: flex-start;
          margin-bottom: 0.75rem;
        }
        .event-text-side h3 {
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--white-pure);
          margin-bottom: 0.5rem;
        }
        .event-details {
          display: flex;
          gap: 1.5rem;
          font-size: 0.85rem;
          color: var(--gray-200);
          margin-bottom: 1rem;
        }
        .event-text-side p {
          color: var(--gray-400);
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        @media (max-width: 640px) {
          .event-row {
            grid-template-columns: 1fr;
          }
          .event-img-side {
            min-height: 180px;
          }
          .event-text-side {
            padding: 1.5rem;
          }
          .event-details {
            flex-direction: column;
            gap: 0.35rem;
          }
        }
      `}</style>
    </>
  );
}
