"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Settings, UserCircle, LogOut, LogIn } from "lucide-react";

import { MEDIA } from "@/lib/media";
import { logout } from "@/app/login/actions";
import { createClient } from "@/utils/supabase/client";
import AdminLoginModal from "@/components/AdminLoginModal";
import { isEmailAdmin } from "@/lib/constants";
import type { User } from "@supabase/supabase-js";

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

export default function Navbar({ isAdmin = false, user = null }: { isAdmin?: boolean, user?: User | null }) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(user);
  const [currentIsAdmin, setCurrentIsAdmin] = useState<boolean>(isAdmin);

  const pathname = usePathname();
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentUser(user);
    setCurrentIsAdmin(isAdmin);
  }, [user, isAdmin]);

  // Client-side authentication & role sync with Supabase
  useEffect(() => {
    const supabase = createClient();

    async function syncAuth() {
      try {
        const { data: { user: activeUser } } = await supabase.auth.getUser();
        if (activeUser) {
          setCurrentUser(activeUser);
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', activeUser.id)
            .maybeSingle();

          const hasAdminEmail = isEmailAdmin(activeUser.email);
          const hasAdminRole = profile?.role === 'admin' || profile?.role === 'accounts' || hasAdminEmail || activeUser.user_metadata?.role === 'admin';
          
          if (hasAdminRole) {
            setCurrentIsAdmin(true);
          }
        }
      } catch (err) {
        console.error("Client auth sync notice:", err);
      }
    }

    syncAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();

        const hasAdminEmail = isEmailAdmin(session.user.email);
        const hasAdminRole = profile?.role === 'admin' || profile?.role === 'accounts' || hasAdminEmail || session.user.user_metadata?.role === 'admin';
        setCurrentIsAdmin(hasAdminRole);
      } else {
        setCurrentUser(null);
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
    setUserDropdownOpen(false);
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

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userDropdownOpen]);

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

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href === '/my-plots' && !currentUser) {
      e.preventDefault();
      router.push('/login?error=' + encodeURIComponent('Please log in or register to view your booked plots.') + '&redirect=/my-plots');
    }
  };

  const handleUserIconClick = () => {
    if (currentUser) {
      setUserDropdownOpen((prev) => !prev);
    } else {
      router.push('/login');
    }
  };

  // Display name: prefer full_name from metadata, fallback to email prefix
  const displayName = currentUser?.user_metadata?.full_name
    || currentUser?.email?.split('@')[0]
    || 'User';

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
              <span className="logo-subtitle">Builders & Developers</span>
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
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`nav-link ${isLinkActive(link.href) ? "nav-link-active" : ""}`}
                  >
                    {link.name}
                    <span className="nav-underline" />
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Right-side — User Login Icon only (Admin is on the left) */}
          <div className="flex items-center gap-2">

            {/* User Icon Button — always visible, extreme right */}
            <div className="relative" ref={userDropdownRef}>
              <button
                type="button"
                id="navbar-user-btn"
                onClick={handleUserIconClick}
                className="relative group p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer flex items-center justify-center border border-slate-700/50 bg-slate-900/60"
                aria-label={currentUser ? `Logged in as ${displayName}` : "Login"}
                title={currentUser ? displayName : "Login"}
              >
                <UserCircle
                  className={`w-5 h-5 transition-colors ${currentUser ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'}`}
                />
                {/* Online pulse dot when logged in */}
                {currentUser && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                )}
                {/* Tooltip */}
                <span className="absolute right-0 top-full mt-2 px-2 py-1 bg-slate-900 border border-slate-700 text-slate-200 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                  {currentUser ? displayName : 'Login / Register'}
                </span>
              </button>

              {/* User Dropdown — only when logged in */}
              {currentUser && userDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-700/80 shadow-2xl z-50 overflow-hidden"
                  style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
                >
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-slate-800">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Signed In</span>
                    </div>
                    <p className="text-xs font-bold text-white truncate">{displayName}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser.email}</p>
                    {currentIsAdmin && (
                      <span className="inline-block mt-1.5 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Admin
                      </span>
                    )}
                  </div>

                  {/* Quick nav */}
                  <div className="py-1">
                    <Link
                      href="/my-plots"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                      My Plots
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-800 p-2">
                    <form action={logout}>
                      <button
                        type="submit"
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

          </div>

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

        {/* Mobile user info banner */}
        {currentUser ? (
          <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <UserCircle className="w-8 h-8 text-emerald-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{displayName}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
              </div>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors flex-shrink-0"
                onClick={() => setMobileOpen(false)}
              >
                <LogOut className="w-3 h-3" />
                Sign Out
              </button>
            </form>
          </div>
        ) : (
          <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800">
            <Link
              href="/login"
              className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <LogIn className="w-4 h-4 text-slate-400" />
              Login / Register
            </Link>
          </div>
        )}

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
                  onClick={(e) => {
                    handleNavClick(e, link.href);
                    setMobileOpen(false);
                  }}
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
