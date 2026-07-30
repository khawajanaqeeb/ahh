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
              <h3>UAN & Support</h3>
              <p>
                <a href="tel:+923111123160" className="hover-gold">03111-123-160</a>
              </p>
              <p style={{ fontSize: "0.8rem", color: "#8A8A9E", marginTop: "0.25rem" }}>UAN — Mon to Sat, 9am–6pm</p>
            </div>
          </div>

          <div className="glass-card contact-detail-card">
            <div className="card-icon">✉️</div>
            <div>
              <h3>Email Queries</h3>
              <p>
                <a href="mailto:ahhbrothers.developers@gmail.com" className="hover-gold">ahhbrothers.developers@gmail.com</a>
              </p>
            </div>
          </div>

          <div className="glass-card contact-detail-card">
            <div className="card-icon">💬</div>
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
            <div className="card-icon">🌐</div>
            <div>
              <h3>Website</h3>
              <p>
                <a href="https://www.ahhbrothers.com" target="_blank" rel="noopener noreferrer" className="hover-gold">www.ahhbrothers.com</a>
              </p>
            </div>
          </div>

          <div className="glass-card contact-detail-card">
            <div className="card-icon">👍</div>
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
            <div className="card-icon">🚨</div>
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
