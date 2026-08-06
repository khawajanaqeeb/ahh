// src/components/AdminLeftSidebar.js
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield, FileText, ChevronDown, ChevronRight, X,
  Building, Home, Factory, Trees, Layers, Sparkles, Settings
} from 'lucide-react';
import { PROJECTS } from '@/lib/projectsData';

export default function AdminLeftSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingDropdownOpen, setBookingDropdownOpen] = useState(true);
  const pathname = usePathname();

  // Listen for global custom event to open admin panel from Navbar or elsewhere
  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener('open-admin-panel', handleOpenEvent);
    return () => window.removeEventListener('open-admin-panel', handleOpenEvent);
  }, []);

  // Auto-expand booking dropdown if currently on a booking page
  useEffect(() => {
    if (pathname && pathname.startsWith('/booking')) {
      setBookingDropdownOpen(true);
    }
  }, [pathname]);

  return (
    <>
      {/* Backdrop overlay when Admin Panel is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* LEFT SIDE ADMIN PANEL SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-slate-950/95 border-r border-slate-800 text-white backdrop-blur-2xl z-50 transition-transform duration-300 flex flex-col shadow-2xl ${
          isOpen ? 'translate-x-0 w-80 sm:w-84' : '-translate-x-full w-80 sm:w-84'
        }`}
      >
        {/* Admin Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shadow-inner">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white font-outfit tracking-tight flex items-center gap-2">
                <span>ADMIN PANEL</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                AHH Brothers Management
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Admin Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">

          {/* MAIN MODULE 1: BOOKING RECEIPTS TAB & DROPDOWN MENU */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 overflow-hidden shadow-md">
            {/* Tab Header / Trigger */}
            <button
              onClick={() => setBookingDropdownOpen(!bookingDropdownOpen)}
              className="w-full p-3.5 flex items-center justify-between bg-slate-900 hover:bg-slate-850 transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/50">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white font-outfit block">
                    Booking Receipts
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    4 Project Booking Portals
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  bookingDropdownOpen ? 'rotate-180 text-blue-400' : ''
                }`}
              />
            </button>

            {/* DROPDOWN MENU WITH 4 SEPARATE BOOKING RECEIPT PAGES */}
            {bookingDropdownOpen && (
              <div className="p-2 space-y-1.5 border-t border-slate-800/60 bg-slate-950/80">
                {PROJECTS.map((proj) => {
                  const isActive = pathname === proj.route;
                  return (
                    <Link
                      key={proj.id}
                      href={proj.route}
                      onClick={() => setIsOpen(false)}
                      className={`p-2.5 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer group ${
                        isActive
                          ? 'bg-blue-950/80 border-blue-500/80 text-white shadow-md'
                          : 'bg-slate-900/40 border-slate-800/60 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 p-1 rounded-md bg-white border border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden shadow-sm">
                          <img src={proj.logo} alt={`${proj.name} logo`} className="w-full h-full object-contain" />
                        </span>
                        <div>
                          <div className={`text-xs font-bold font-outfit ${isActive ? 'text-blue-400' : 'text-slate-200'}`}>
                            {proj.name}
                          </div>
                          <div className="text-[9.5px] text-slate-400 truncate max-w-[170px]">
                            {proj.tagline}
                          </div>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-blue-900 text-blue-200 border border-blue-700'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        Receipt Form
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* FUTURE ADMIN MODULES PLACEHOLDER */}
          <div className="p-4 rounded-xl border border-dashed border-slate-800/80 bg-slate-950/40 space-y-2 text-center">
            <Settings className="w-5 h-5 text-slate-500 mx-auto" />
            <div className="text-xs font-bold text-slate-400">Additional Admin Modules</div>
            <p className="text-[10px] text-slate-500">
              Future management modules (User Roles, Analytics, Auditing) will be added under this panel.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 text-center shrink-0">
          <p className="text-[10px] text-slate-500 font-mono">
            AHH BROTHERS • LEFT ADMIN PANEL
          </p>
        </div>
      </aside>
    </>
  );
}
