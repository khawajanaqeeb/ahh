"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function ContactFormSection() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    project: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const projectParam = searchParams.get("project");
    if (projectParam) {
      setFormData((prev) => ({ ...prev, project: projectParam }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API Submission
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", project: "", message: "" });
    }, 800);
  };

  return (
    <div className="contact-container container">
      {/* Left Column - Contact Details */}
      <div className="contact-info-col">
        <h2 className="section-title">Get in Touch with Our <span className="text-gradient-gold">Property Experts</span></h2>
        <div className="gold-line-left" />
        <p className="contact-subtitle">
          Have questions about our payment options, plot availability, or site visits? Drop us a message and our team will get back to you within 24 hours.
        </p>

        <div className="contact-info-cards">
          <div className="glass-card contact-detail-card">
            <div className="card-icon">📍</div>
            <div>
              <h3>Office Address</h3>
              <p>Near Gulshan-e-Maymar, Northern Bypass, Karachi, Pakistan</p>
            </div>
          </div>

          <div className="glass-card contact-detail-card">
            <div className="card-icon">📞</div>
            <div>
              <h3>Call & Support</h3>
              <p>
                <a href="tel:+923701335365" className="hover-gold">0370-1335365</a>
              </p>
            </div>
          </div>

          <div className="glass-card contact-detail-card">
            <div className="card-icon">✉️</div>
            <div>
              <h3>Email Queries</h3>
              <p>
                <a href="mailto:info@ahhbrothers.com" className="hover-gold">info@ahhbrothers.com</a>
              </p>
            </div>
          </div>

          <div className="glass-card contact-detail-card">
            <div className="card-icon">💬</div>
            <div>
              <h3>WhatsApp Chat</h3>
              <p>
                <a href="https://wa.me/923701335365" target="_blank" rel="noopener noreferrer" className="hover-gold text-green">
                  Open WhatsApp Chat
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Inquiry Form */}
      <div className="contact-form-col glass-card">
        {submitted ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>Thank You!</h3>
            <p>Your inquiry has been successfully sent. A representative from AHH Brothers & Developers will contact you shortly.</p>
            <button className="btn-gold" onClick={() => setSubmitted(false)}>Send Another Message</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="form-title">Submit an Inquiry</h3>
            <p className="form-sub">We will answer all your property questions.</p>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="Enter your full name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone / WhatsApp Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                placeholder="e.g., 0300-1234567"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address (Optional)</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="e.g., name@domain.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="project">Project of Interest</label>
              <select
                id="project"
                name="project"
                className="form-input"
                required
                value={formData.project}
                onChange={handleChange}
              >
                <option value="">Select a Project</option>
                <option value="Hooria Villas">Hooria Villas</option>
                <option value="Summer Farm Houses">Summer Farm Houses</option>
                <option value="Labour City">Labour City</option>
                <option value="AHH-City">AHH-City</option>
                <option value="Other / General Query">Other / General Query</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                className="form-input"
                placeholder="Write your questions or details here..."
                required
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn-gold" style={{ width: "100%", justifyContent: "center" }}>
              Submit Booking Inquiry
            </button>
          </form>
        )}
      </div>

      <style>{`
        .contact-container {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
        }
        .section-title {
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .contact-subtitle {
          color: var(--gray-400);
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }
        .contact-info-cards {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .contact-detail-card {
          display: flex;
          gap: 1.25rem;
          padding: 1.5rem;
          align-items: center;
          transition: all var(--transition-base);
        }
        .contact-detail-card:hover {
          transform: translateX(5px);
          border-color: var(--glass-border-gold);
        }
        .card-icon {
          font-size: 2rem;
          width: 50px;
          height: 50px;
          background: rgba(212, 175, 55, 0.08);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .contact-detail-card h3 {
          font-size: 1.05rem;
          color: var(--white-pure);
          margin-bottom: 0.25rem;
          font-weight: 600;
        }
        .contact-detail-card p {
          color: var(--gray-400);
          font-size: 0.9rem;
        }
        .hover-gold {
          transition: color 0.2s;
        }
        .hover-gold:hover {
          color: var(--gold);
        }
        .text-green {
          color: #25D366;
        }

        /* Form styling */
        .contact-form-col {
          padding: 3rem 2.5rem;
        }
        .form-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 0.25rem;
        }
        .form-sub {
          color: var(--gray-400);
          font-size: 0.88rem;
          margin-bottom: 2rem;
        }
        
        /* Success Message styling */
        .success-message {
          text-align: center;
          padding: 2rem 1rem;
        }
        .success-icon {
          width: 60px;
          height: 60px;
          background: var(--green);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          margin: 0 auto 1.5rem;
          box-shadow: 0 4px 15px var(--green-glow);
        }
        .success-message h3 {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
          color: var(--white);
        }
        .success-message p {
          color: var(--gray-400);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        @media (max-width: 900px) {
          .contact-container {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .contact-form-col {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default function Contact() {
  return (
    <>
      <div className="page-hero">
        <h1 className="text-gradient-gold">Contact Us</h1>
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Contact</span>
        </div>
      </div>

      <section className="section">
        <Suspense fallback={<div className="container text-center py-10">Loading inquiry form...</div>}>
          <ContactFormSection />
        </Suspense>
      </section>

      {/* Embedded Map Section */}
      <section className="section section-alt" style={{ padding: 0 }}>
        <div className="map-iframe-container">
          {/* Real Estate office map location (G-Maymar Northern Bypass Karachi area mockup map) */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14461.353381674488!2d67.11234907147743!3d25.022588145293223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb34668ba4497e5%3A0xc154eb27a29dc88a!2sGulshan-e-Maymar%2C%20Karachi%2C%20Karachi%20City%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1689728471923!5m2!1sen!2s"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <style>{`
          .map-iframe-container {
            width: 100%;
            height: 450px;
            filter: grayscale(1) invert(0.9) contrast(1.2);
            opacity: 0.85;
            transition: all 0.5s;
          }
          .map-iframe-container:hover {
            filter: none;
            opacity: 1;
          }
        `}</style>
      </section>
    </>
  );
}
