"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Settings } from "lucide-react";

import { MEDIA } from "@/lib/media";
import { createClient } from "@/utils/supabase/client";
import AdminLoginModal from "@/components/AdminLoginModal";
import { isEmailAdmin } from "@/lib/constants";

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
  { name: "My Plots", href: "/my-plots" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const [currentIsAdmin, setCurrentIsAdmin] = useState<boolean>(isAdmin);

  const pathname = usePathname();

  useEffect(() => {
    setCurrentIsAdmin(isAdmin);
  }, [isAdmin]);

  // Client-side admin role sync with Supabase (admin gear routing only)
  useEffect(() => {
    const supabase = createClient();

    async function syncAdminRole() {
      try {
        const { data: { user: activeUser } } = await supabase.auth.getUser();
        if (activeUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', activeUser.id)
            .maybeSingle();

          const hasAdminEmail = isEmailAdmin(activeUser.email);
          const hasAdminRole =
            profile?.role === 'admin' ||
            profile?.role === 'accounts' ||
            hasAdminEmail ||
            activeUser.user_metadata?.role === 'admin';

          if (hasAdminRole) {
            setCurrentIsAdmin(true);
          }
        }
      } catch (err) {
        console.error("Admin role sync notice:", err);
      }
    }

    syncAdminRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();

        const hasAdminEmail = isEmailAdmin(session.user.email);
        const hasAdminRole =
          profile?.role === 'admin' ||
          profile?.role === 'accounts' ||
          hasAdminEmail ||
          session.user.user_metadata?.role === 'admin';
        setCurrentIsAdmin(hasAdminRole);
      } else {
        setCurrentIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  const handleAdminGearClick = () => {
    if (currentIsAdmin) {
      router.push('/admin');
    } else {
      setIsAdminModalOpen(true);
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="navbar-inner">
          {/* Admin Gear — Extreme Left, always visible, before logo */}
          <button
            type="button"
            id="navbar-admin-btn"
            onClick={handleAdminGearClick}
            className="relative group p-2 text-amber-400 hover:bg-slate-800/80 transition-all cursor-pointer flex items-center justify-center border border-amber-500/30 bg-slate-900/60 mr-1"
            aria-label="Admin"
            title="Admin"
          >
            <Settings className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
            <span className="absolute left-0 top-full mt-2 px-2 py-1 bg-slate-900 border border-slate-700 text-amber-300 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
              Admin
            </span>
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
              <span className="logo-subtitle">Builders &amp; Developers</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
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
              <span className="logo-subtitle" style={{ fontSize: "0.58rem" }}>Builders &amp; Developers</span>
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
          {/* Admin access in Mobile Drawer */}
          <li>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                handleAdminGearClick();
              }}
              className="mobile-link flex items-center gap-3 text-amber-400 font-bold"
            >
              <Settings className="w-5 h-5 text-amber-400" />
              <span>Admin Portal Access</span>
            </button>
          </li>

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
                  onClick={() => setMobileOpen(false)}
                  className={`mobile-link ${isLinkActive(link.href) ? "mobile-link-active" : ""}`}
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

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </>
  );
};
