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
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="rgba(212,175,55,0.1)"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <h3>Office Address</h3>
              <p>Near Gulshan-e-Maymar, Northern Bypass, Karachi, Pakistan</p>
            </div>
          </div>

          <div className="glass-card contact-detail-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="rgba(212,175,55,0.1)"/>
              </svg>
            </div>
            <div>
              <h3>UAN & Support</h3>
              <p>
                <a href="tel:+923111123160" className="hover-gold">03111-123-160</a>
              </p>
              <p style={{ fontSize: "0.8rem", color: "#8A8A9E", marginTop: "0.25rem" }}>UAN — Mon to Sat, 9am–6pm</p>
            </div>
          </div>

          <div className="glass-card contact-detail-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="rgba(212,175,55,0.1)"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div>
              <h3>Email Queries</h3>
              <p>
                <a href="mailto:ahhbrothers.developers@gmail.com" className="hover-gold">ahhbrothers.developers@gmail.com</a>
              </p>
            </div>
          </div>

          <div className="glass-card contact-detail-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="rgba(37,211,102,0.15)"/>
              </svg>
            </div>
            <div>
              <h3>WhatsApp Chat</h3>
              <p>
                <a href="https://wa.me/923111123160" target="_blank" rel="noopener noreferrer" className="hover-gold text-green">
                  Open WhatsApp Chat
                </a>
              </p>
            </div>
          </div>

          <div className="glass-card contact-detail-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" fill="rgba(212,175,55,0.1)"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <div>
              <h3>Website</h3>
              <p>
                <a href="https://www.ahhbrothers.com" target="_blank" rel="noopener noreferrer" className="hover-gold">www.ahhbrothers.com</a>
              </p>
            </div>
          </div>

          <div className="glass-card contact-detail-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="rgba(212,175,55,0.1)"/>
              </svg>
            </div>
            <div>
              <h3>Facebook Page</h3>
              <p>
                <a href="https://www.facebook.com/profile.php?id=61567886021312" target="_blank" rel="noopener noreferrer" className="hover-gold">
                  AHH Brothers Builders &amp; Developers
                </a>
              </p>
            </div>
          </div>

          <div className="glass-card contact-detail-card" style={{ borderColor: "rgba(239,68,68,0.25)" }}>
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="rgba(239,68,68,0.15)"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div>
              <h3 style={{ color: "#ef4444" }}>Complaint No.</h3>
              <p>
                <a href="tel:+9203701335365" className="hover-gold" style={{ color: "#ef4444" }}>0370-1335365</a>
              </p>
              <p style={{ fontSize: "0.8rem", color: "#8A8A9E", marginTop: "0.25rem" }}>For complaints &amp; escalations only</p>
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
      </section>
    </>
  );
}
