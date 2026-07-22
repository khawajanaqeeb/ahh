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
    </>
  );
};

export default Navbar;
