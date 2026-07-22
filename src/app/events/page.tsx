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
                    <div>ðŸ•’ {ev.time}</div>
                    <div>ðŸ“ {ev.location}</div>
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
    </>
  );
}
