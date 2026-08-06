"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { MEDIA } from "@/lib/media";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  {
    name: "Projects",
    href: "/projects",
    dropdown: [
      { name: "Current Projects", href: "/current-projects" },
      { name: "Delivered Projects", href: "/delivered-projects" },
      { name: "Construction Updates", href: "/construction-updates" },
    ],
  },
  {
    name: "Investors",
    href: "/overseas-investors",
    dropdown: [
      { name: "Overseas Investors Hub", href: "/overseas-investors" },
      { name: "Payment Calculator", href: "/calculator" },
      { name: "Legal Buyer's Guide", href: "/legal-compliance" },
      { name: "Schedule Site Visit", href: "/site-visit" },
    ],
  },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const pathname = usePathname();
  // Keep deprecated alias for single dropdown check compatibility
  const dropdownOpen = openDropdown !== null;

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
    setMobileDropdownOpen(null);
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
          {/* Admin Panel Trigger — left of logo */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-admin-panel'))}
            className="navbar-admin-icon-btn cursor-pointer"
            title="Open Admin Panel"
            aria-label="Open Admin Panel"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <div className="logo-img-wrapper">
              <Image
                src={MEDIA.ahhLogoPng}
                alt="AHH Brothers"
                width={64}
                height={64}
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
                onMouseEnter={() => link.dropdown && setOpenDropdown(link.name)}
                onMouseLeave={() => link.dropdown && setOpenDropdown(null)}
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
                      className={`dropdown-arrow ${openDropdown === link.name ? "arrow-rotate" : ""}`}
                    >
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    {/* Dropdown Menu */}
                    <div className={`dropdown-menu-glass ${openDropdown === link.name ? "dropdown-visible" : ""}`}>
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Image
              src={MEDIA.ahhLogoPng}
              alt="AHH Brothers"
              width={38}
              height={38}
              className="navbar-logo-img"
            />
            <div className="navbar-logo-text">
              <span className="logo-title" style={{ fontSize: "1.15rem" }}>AHH Brothers</span>
              <span className="logo-subtitle" style={{ fontSize: "0.58rem" }}>Builders & Developers</span>
            </div>
          </div>
          <button
            className="mobile-drawer-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <ul className="mobile-links">
          {navLinks.map((link) => (
            <li key={link.name}>
              {link.dropdown ? (
                <div className="mobile-accordion">
                  <button
                    className={`mobile-link mobile-link-toggle ${isLinkActive(link.href, link.dropdown) ? "mobile-link-active" : ""}`}
                    onClick={() => setMobileDropdownOpen(mobileDropdownOpen === link.name ? null : link.name)}
                  >
                    <span>{link.name}</span>
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 10 6"
                      fill="none"
                      className={`accordion-arrow ${mobileDropdownOpen === link.name ? "arrow-rotate" : ""}`}
                    >
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <div className={`mobile-accordion-content ${mobileDropdownOpen === link.name ? "accordion-open" : ""}`}>
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
          <Link href="/booking" className={`mobile-link ${pathname === '/booking' ? 'mobile-link-active' : ''}`}
            onClick={() => setMobileOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="rgba(212,175,55,0.1)"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Booking Receipt — AHH City
          </Link>
          <Link href="/contact" className="btn-gold" onClick={() => setMobileOpen(false)} style={{ width: "100%", justifyContent: "center" }}>
            Get In Touch
          </Link>
          <div className="mobile-contact">
            <a href="tel:+923111123160">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              03111-123-160
            </a>
            <a href="mailto:ahhbrothers.developers@gmail.com">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              ahhbrothers.developers@gmail.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
