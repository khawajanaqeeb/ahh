"use client";

import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      {/* Gold top line */}
      <div className="footer-gold-line" />

      <div className="footer-main">
        <div className="footer-grid">
          {/* Column 1 - Company Info */}
          <div className="footer-col footer-brand">
            <div className="footer-logo-row">
              <Image
                src="/ahh-logo.jpg"
                alt="AHH Brothers"
                width={55}
                height={55}
                className="footer-logo-img"
              />
              <div>
                <h3 className="footer-brand-name">AHH Brothers</h3>
                <p className="footer-brand-sub">Builders & Developers</p>
              </div>
            </div>
            <p className="footer-brand-tagline">&ldquo;Our Power Is Our Unity&rdquo;</p>
            <p className="footer-description">
              Since 1977, AHH Brothers has been delivering quality residential and
              commercial projects across Karachi. We are a family of housebuilders,
              developers, and contractors committed to excellence.
            </p>
            {/* Social Icons */}
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://wa.me/923701335365" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="social-icon social-whatsapp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/current-projects">Current Projects</Link></li>
              <li><Link href="/delivered-projects">Delivered Projects</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3 - Our Projects */}
          <div className="footer-col">
            <h4 className="footer-heading">Our Projects</h4>
            <ul className="footer-links">
              <li><Link href="/current-projects#hooria-villas">Hooria Villas</Link></li>
              <li><Link href="/current-projects#summer-farm-houses">Summer Farm Houses</Link></li>
              <li><Link href="/current-projects#labour-city">Labour City</Link></li>
              <li><Link href="/current-projects#ahh-city">AHH-City</Link></li>
            </ul>
          </div>

          {/* Column 4 - Contact Info */}
          <div className="footer-col">
            <h4 className="footer-heading">Contact Us</h4>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <div>
                  <p>Near Gulshan-e-Maymar,</p>
                  <p>Northern Bypass, Karachi</p>
                </div>
              </div>
              <div className="footer-contact-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <a href="tel:+923701335365">0370-1335365</a>
              </div>
              <div className="footer-contact-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <a href="mailto:info@ahhbrothers.com">info@ahhbrothers.com</a>
              </div>
              <div className="footer-contact-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <a href="https://wa.me/923701335365" target="_blank" rel="noopener noreferrer">WhatsApp Chat</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>&copy; {currentYear} AHH Brothers — Builders & Developers. All rights reserved.</p>
          <button
            className="back-to-top"
            onClick={() => typeof window !== "undefined" && window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 15-6-6-6 6"/>
            </svg>
            Back to Top
          </button>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: #0A0A0A;
          position: relative;
          overflow: hidden;
        }
        .site-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.03) 0%, transparent 70%);
          pointer-events: none;
        }
        .footer-gold-line {
          height: 3px;
          background: linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%);
        }
        .footer-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 4rem 1.5rem 3rem;
          position: relative;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: 3rem;
        }
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .footer-logo-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        :global(.footer-logo-img) {
          border-radius: 10px;
        }
        .footer-brand-name {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 700;
          color: #D4AF37;
          line-height: 1.2;
        }
        .footer-brand-sub {
          font-size: 0.72rem;
          color: #8A8A9E;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .footer-brand-tagline {
          color: #D4AF37;
          font-style: italic;
          font-family: var(--font-heading);
          font-size: 1rem;
        }
        .footer-description {
          color: #8A8A9E;
          font-size: 0.9rem;
          line-height: 1.7;
        }
        .footer-socials {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8A8A9E;
          transition: all 0.3s;
        }
        .social-icon:hover {
          background: rgba(212, 175, 55, 0.15);
          border-color: rgba(212, 175, 55, 0.3);
          color: #D4AF37;
          transform: translateY(-3px);
        }
        .social-whatsapp:hover {
          background: rgba(37, 211, 102, 0.15);
          border-color: rgba(37, 211, 102, 0.3);
          color: #25D366;
        }

        /* Column Headings */
        .footer-heading {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: #F5F5F5;
          margin-bottom: 1.5rem;
          position: relative;
          padding-bottom: 0.75rem;
        }
        .footer-heading::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #D4AF37, #E8CC6E);
          border-radius: 2px;
        }

        /* Links */
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .footer-links a {
          color: #8A8A9E;
          font-size: 0.92rem;
          transition: all 0.25s;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }
        .footer-links a::before {
          content: '›';
          color: #D4AF37;
          font-size: 1.2rem;
          opacity: 0;
          transform: translateX(-5px);
          transition: all 0.25s;
        }
        .footer-links a:hover {
          color: #D4AF37;
          padding-left: 0.25rem;
        }
        .footer-links a:hover::before {
          opacity: 1;
          transform: translateX(0);
        }

        /* Contact Items */
        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .footer-contact-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          color: #8A8A9E;
          font-size: 0.9rem;
          line-height: 1.6;
        }
        .footer-contact-item svg {
          flex-shrink: 0;
          color: #D4AF37;
          margin-top: 3px;
        }
        .footer-contact-item a {
          color: #8A8A9E;
          transition: color 0.2s;
        }
        .footer-contact-item a:hover {
          color: #D4AF37;
        }

        /* Bottom Bar */
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(0, 0, 0, 0.3);
        }
        .footer-bottom-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1.25rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-bottom p {
          color: #4A4A5E;
          font-size: 0.85rem;
        }
        .back-to-top {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: none;
          border: 1px solid rgba(212, 175, 55, 0.2);
          color: #D4AF37;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.82rem;
          font-weight: 500;
          font-family: inherit;
          transition: all 0.3s;
        }
        .back-to-top:hover {
          background: rgba(212, 175, 55, 0.1);
          border-color: #D4AF37;
          transform: translateY(-2px);
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
          }
        }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .footer-main {
            padding: 3rem 1.25rem 2rem;
          }
          .footer-bottom-inner {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
