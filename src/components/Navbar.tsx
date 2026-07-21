"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  {
    name: "Projects",
    href: "/projects",
    dropdown: [
      { name: "Current Projects", href: "/current-projects" },
      { name: "Delivered Projects", href: "/delivered-projects" },
    ],
  },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileDropdownOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isLinkActive = (href: string, dropdownItems?: Array<{ href: string }>) => {
    if (pathname === href) return true;
    if (dropdownItems) {
      return dropdownItems.some((item) => pathname === item.href);
    }
    return false;
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <div className="logo-img-wrapper">
              <Image
                src="/ahh-logo.jpg"
                alt="AHH Brothers"
                width={46}
                height={46}
                className="navbar-logo-img"
                priority
              />
            </div>
            <div className="navbar-logo-text">
              <span className="logo-title">AHH Brothers</span>
              <span className="logo-subtitle">Builders & Developers</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li
                key={link.name}
                className={link.dropdown ? "dropdown-trigger" : ""}
                onMouseEnter={() => link.dropdown && setDropdownOpen(true)}
                onMouseLeave={() => link.dropdown && setDropdownOpen(false)}
              >
                {link.dropdown ? (
                  <div className="nav-link-with-icon">
                    <span className={`nav-link ${isLinkActive(link.href, link.dropdown) ? "nav-link-active" : ""}`}>
                      {link.name}
                      <span className="nav-underline" />
                    </span>
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      className={`dropdown-arrow ${dropdownOpen ? "arrow-rotate" : ""}`}
                    >
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    {/* Dropdown Menu */}
                    <div className={`dropdown-menu-glass ${dropdownOpen ? "dropdown-visible" : ""}`}>
                      {link.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`dropdown-item ${pathname === subItem.href ? "dropdown-item-active" : ""}`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className={`nav-link ${isLinkActive(link.href) ? "nav-link-active" : ""}`}
                  >
                    {link.name}
                    <span className="nav-underline" />
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <Link href="/contact" className="navbar-cta-pill">
            <span>Get In Touch</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Mobile hamburger */}
          <button
            className={`hamburger-pill ${mobileOpen ? "hamburger-active" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-overlay ${mobileOpen ? "mobile-overlay-open" : ""}`} onClick={() => setMobileOpen(false)} />

      {/* Mobile Menu Drawer */}
      <div className={`mobile-drawer ${mobileOpen ? "mobile-drawer-open" : ""}`}>
        <div className="mobile-drawer-header">
          <Image
            src="/ahh-logo.jpg"
            alt="AHH Brothers"
            width={40}
            height={40}
            className="navbar-logo-img"
          />
          <div className="navbar-logo-text">
            <span className="logo-title">AHH Brothers</span>
            <span className="logo-subtitle">Builders & Developers</span>
          </div>
        </div>

        <ul className="mobile-links">
          {navLinks.map((link) => (
            <li key={link.name}>
              {link.dropdown ? (
                <div className="mobile-accordion">
                  <button
                    className={`mobile-link mobile-link-toggle ${isLinkActive(link.href, link.dropdown) ? "mobile-link-active" : ""}`}
                    onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                  >
                    <span>{link.name}</span>
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 10 6"
                      fill="none"
                      className={`accordion-arrow ${mobileDropdownOpen ? "arrow-rotate" : ""}`}
                    >
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <div className={`mobile-accordion-content ${mobileDropdownOpen ? "accordion-open" : ""}`}>
                    {link.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`mobile-sub-link ${pathname === subItem.href ? "mobile-sub-link-active" : ""}`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={link.href}
                  className={`mobile-link ${isLinkActive(link.href) ? "mobile-link-active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="mobile-drawer-footer">
          <Link href="/contact" className="btn-gold" onClick={() => setMobileOpen(false)} style={{ width: "100%", justifyContent: "center" }}>
            Get In Touch
          </Link>
          <div className="mobile-contact">
            <a href="tel:+923701335365">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              0370-1335365
            </a>
            <a href="mailto:info@ahhbrothers.com">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              info@ahhbrothers.com
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          background: rgba(10, 10, 10, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          padding: 1.25rem 0;
        }
        
        .navbar-scrolled {
          background: rgba(10, 10, 20, 0.85);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          padding: 0.75rem 0;
        }

        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          text-decoration: none;
        }

        .logo-img-wrapper {
          position: relative;
          padding: 2px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 10px;
          background: rgba(10, 10, 10, 0.8);
          transition: border-color 0.3s;
        }
        
        .navbar-logo:hover .logo-img-wrapper {
          border-color: #D4AF37;
        }

        :global(.navbar-logo-img) {
          border-radius: 8px;
          object-fit: cover;
        }

        .navbar-logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-title {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          letter-spacing: 0.2px;
          transition: color 0.3s;
        }
        
        .navbar-logo:hover .logo-title {
          color: #D4AF37;
        }

        .logo-subtitle {
          font-size: 0.65rem;
          color: #8A8A9E;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 600;
          margin-top: 1px;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 1rem;
          list-style: none;
        }

        .nav-link-with-icon {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          cursor: pointer;
          position: relative;
        }

        .dropdown-arrow {
          color: #8A8A9E;
          transition: transform 0.3s ease, color 0.3s;
          margin-top: 2px;
        }

        .dropdown-trigger:hover .dropdown-arrow {
          transform: translateY(1px);
          color: #D4AF37;
        }

        .nav-link {
          position: relative;
          padding: 0.6rem 0.8rem;
          color: #C5C5D3;
          font-weight: 500;
          font-size: 0.95rem;
          letter-spacing: 0.3px;
          text-decoration: none;
          transition: color 0.3s;
          display: inline-flex;
          align-items: center;
        }

        .nav-link:hover {
          color: #ffffff;
        }

        .nav-link-active {
          color: #D4AF37;
          font-weight: 600;
        }

        .nav-underline {
          position: absolute;
          bottom: 2px;
          left: 0.8rem;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #D4AF37, #E8CC6E);
          border-radius: 2px;
          transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-link:hover .nav-underline,
        .nav-link-active .nav-underline {
          width: calc(100% - 1.6rem);
        }

        /* Dropdown Menu Glass styling */
        .dropdown-menu-glass {
          position: absolute;
          top: calc(100% + 15px);
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          background: rgba(13, 13, 26, 0.9);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(212, 175, 55, 0.15);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
          border-radius: 12px;
          padding: 0.75rem;
          width: 210px;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 100;
        }

        .dropdown-menu-glass::before {
          content: '';
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 10px;
          height: 10px;
          background: rgba(13, 13, 26, 0.9);
          border-left: 1px solid rgba(212, 175, 55, 0.15);
          border-top: 1px solid rgba(212, 175, 55, 0.15);
        }

        .dropdown-trigger:hover .dropdown-menu-glass,
        .dropdown-menu-glass.dropdown-visible {
          opacity: 1;
          pointer-events: all;
          transform: translateX(-50%) translateY(0);
        }

        .dropdown-item {
          display: block;
          padding: 0.75rem 1rem;
          color: #C5C5D3;
          font-size: 0.88rem;
          font-weight: 500;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .dropdown-item:hover {
          background: rgba(212, 175, 55, 0.1);
          color: #D4AF37;
          padding-left: 1.25rem;
        }

        .dropdown-item-active {
          background: rgba(212, 175, 55, 0.08);
          color: #D4AF37;
        }

        /* Luxury CTA Button Pill */
        .navbar-cta-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.6rem;
          background: transparent;
          border: 1.5px solid #D4AF37;
          color: #D4AF37;
          font-weight: 600;
          font-size: 0.88rem;
          letter-spacing: 0.5px;
          border-radius: 30px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .navbar-cta-pill::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #D4AF37 0%, #E8CC6E 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 0;
        }

        .navbar-cta-pill span, .navbar-cta-pill svg {
          position: relative;
          z-index: 1;
          transition: color 0.3s;
        }

        .navbar-cta-pill:hover {
          border-color: transparent;
          color: #0A0A0A;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
        }

        .navbar-cta-pill:hover::before {
          opacity: 1;
        }

        /* Hamburger Pill shape */
        .hamburger-pill {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
          padding: 0.75rem 0.85rem;
          border-radius: 12px;
          z-index: 60;
          transition: all 0.3s;
        }
        
        .hamburger-pill:hover {
          background: rgba(212, 175, 55, 0.08);
          border-color: rgba(212, 175, 55, 0.3);
        }

        .hamburger-pill span {
          display: block;
          width: 22px;
          height: 2px;
          background: #D4AF37;
          border-radius: 2px;
          transition: all 0.3s;
        }

        .hamburger-active span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .hamburger-active span:nth-child(2) {
          opacity: 0;
        }
        .hamburger-active span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        /* Mobile Drawer details */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          z-index: 45;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s;
        }
        .mobile-overlay-open {
          opacity: 1;
          pointer-events: all;
        }

        .mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 325px;
          max-width: 85vw;
          height: 100vh;
          background: rgba(10, 10, 20, 0.95);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-left: 1px solid rgba(212, 175, 55, 0.2);
          z-index: 55;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        
        .mobile-drawer-open {
          transform: translateX(0);
        }

        .mobile-drawer-header {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 2rem 1.5rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .mobile-links {
          list-style: none;
          padding: 1.5rem;
          flex: 1;
        }

        .mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          background: none;
          border: none;
          padding: 1rem 0;
          color: #C5C5D3;
          font-size: 1.1rem;
          font-weight: 500;
          text-align: left;
          text-decoration: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          transition: all 0.25s;
          cursor: pointer;
        }

        .mobile-link:hover,
        .mobile-link-active {
          color: #D4AF37;
          padding-left: 0.35rem;
        }

        /* Mobile accordion details */
        .mobile-accordion {
          width: 100%;
        }
        
        .mobile-link-toggle {
          border-bottom: none;
        }

        .accordion-arrow {
          color: #8A8A9E;
          transition: transform 0.3s;
        }
        
        .arrow-rotate {
          transform: rotate(180deg);
          color: #D4AF37;
        }

        .mobile-accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          padding-left: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }
        
        .accordion-open {
          max-height: 120px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          padding-bottom: 0.5rem;
        }

        .mobile-sub-link {
          display: block;
          padding: 0.75rem 0.5rem;
          color: #8A8A9E;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.2s;
        }

        .mobile-sub-link:hover,
        .mobile-sub-link-active {
          color: #D4AF37;
          padding-left: 0.75rem;
        }

        .mobile-drawer-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .mobile-contact {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .mobile-contact a {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: #8A8A9E;
          font-size: 0.9rem;
          text-decoration: none;
          transition: color 0.2s;
        }

        .mobile-contact a:hover {
          color: #D4AF37;
        }

        @media (max-width: 1024px) {
          .navbar-links { display: none; }
          .navbar-cta-pill { display: none; }
          .hamburger-pill { display: flex; }
          .navbar { padding: 1rem 0; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
