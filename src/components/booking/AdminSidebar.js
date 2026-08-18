// src/components/booking/AdminSidebar.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2, Home, Factory, Trees, ChevronRight, ChevronLeft,
  PieChart, DollarSign, Layers, Shield, FileSpreadsheet, Trash2,
  CheckCircle, Clock, ExternalLink, Sparkles, RefreshCw
} from 'lucide-react';
import { PROJECTS } from '@/lib/projectsData';

export default function AdminSidebar({
  currentProjectId = 'ahh-city',
  bookings = [],
  plots = [],
  onClearProjectBookings,
  onExportCSV,
  allBookingsMap = {}
}) {
  const [isOpen, setIsOpen] = useState(true);

  // Compute stats for current project
  const totalPlotsCount = plots.length;
  const currentProjectBookings = bookings.filter(b => !b.projectId || b.projectId === currentProjectId);
  const tokenCount = currentProjectBookings.filter(b => b.status === 'Token Received').length;
  const bookedCount = currentProjectBookings.filter(b => b.status === 'Booking Received').length;
  const totalRevenue = currentProjectBookings.reduce((sum, b) => sum + (parseFloat(b.paidAmount) || 0), 0);

  const activeProject = PROJECTS.find(p => p.id === currentProjectId) || PROJECTS[0];

  return (
    <>
      {/* Right Edge Toggle Button (When Sidebar Collapsed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-24 right-0 z-50 bg-slate-900 border-l border-t border-b border-blue-500/60 text-blue-400 font-bold text-xs px-3 py-2.5 rounded-none shadow-2xl flex items-center gap-2 hover:bg-slate-800 transition-all cursor-pointer group"
          title="Open Admin Dashboard"
        >
          <ChevronLeft className="w-4 h-4 text-blue-400 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-outfit uppercase tracking-wider font-extrabold text-[11px] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Admin Dashboard</span>
          </span>
        </button>
      )}

      {/* Extreme Right Admin Dashboard Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-screen bg-slate-950/95 border-l border-slate-800 text-white backdrop-blur-2xl z-40 transition-transform duration-300 flex flex-col shadow-2xl ${
          isOpen ? 'translate-x-0 w-80 sm:w-96' : 'translate-x-full w-80 sm:w-96'
        }`}
      >
        {/* Admin Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-none bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shadow-inner">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white font-outfit tracking-tight flex items-center gap-1.5">
                <span>ADMIN DASHBOARD</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                AHH Brothers Central Control
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-none text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Collapse Sidebar"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Admin Content Body */}
        <div className="flex-grow overflow-y-auto p-4 space-y-6 custom-scrollbar">

          {/* PROJECT SELECTOR TABS */}
          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-extrabold tracking-widest text-slate-400">
              📂 Select Project Booking Portal
            </label>

            <div className="grid grid-cols-1 gap-2">
              {PROJECTS.map((proj) => {
                const isActive = proj.id === currentProjectId;
                const projBookings = (allBookingsMap[proj.id] || []).concat(
                  proj.id === currentProjectId ? currentProjectBookings : []
                );
                const projRevenue = projBookings.reduce((sum, b) => sum + (parseFloat(b.paidAmount) || 0), 0);

                return (
                  <Link
                    key={proj.id}
                    href={proj.route}
                    className={`p-4 rounded-none border text-left transition-all flex items-center justify-between cursor-pointer group ${
                      isActive
                        ? 'bg-slate-900 border-blue-500 shadow-lg shadow-blue-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 p-1 rounded-none bg-white border border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform overflow-hidden shadow-sm">
                        <img src={proj.logo} alt={`${proj.name} logo`} className="w-full h-full object-contain" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs font-bold font-outfit ${isActive ? 'text-blue-400' : 'text-slate-200'}`}>
                            {proj.name}
                          </h4>
                          {isActive && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-none bg-blue-950 text-blue-400 border border-blue-800/60">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate max-w-[170px]">
                          {proj.survey}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-blue-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-300'}`} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ACTIVE PROJECT STATS CARD */}
          <div className="p-4 rounded-none bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <span className="w-6 h-6 p-0.5 rounded bg-white border border-slate-700 flex items-center justify-center overflow-hidden">
                  <img src={activeProject.logo} alt={`${activeProject.name} logo`} className="w-full h-full object-contain" />
                </span>
                <span>{activeProject.name} Live Overview</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-none ${activeProject.badgeBg} ${activeProject.badgeText} ${activeProject.badgeBorder} border`}>
                Live Ledger
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-none bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Mapped Plots</span>
                <span className="text-sm font-bold font-outfit text-white">{totalPlotsCount}</span>
              </div>
              <div className="p-2.5 rounded-none bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tokens Recv</span>
                <span className="text-sm font-bold font-outfit text-yellow-400">{tokenCount}</span>
              </div>
              <div className="p-2.5 rounded-none bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Bookings Recv</span>
                <span className="text-sm font-bold font-outfit text-emerald-400">{bookedCount}</span>
              </div>
              <div className="p-2.5 rounded-none bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Funds</span>
                <span className="text-xs font-extrabold font-outfit text-emerald-400">Rs {totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* PROJECT MANAGEMENT QUICK ACTIONS */}
          <div className="p-4 rounded-none bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 block mb-1">
              🛠️ Project Quick Actions
            </span>

            <button
              onClick={onExportCSV}
              className="w-full py-3 px-3 rounded-none bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export {activeProject.name} Ledger (Excel)</span>
            </button>
          </div>

        </div>

        {/* Admin Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 text-center shrink-0">
          <p className="text-[10px] text-slate-500 font-mono">
            AHH BROTHERS • PROPERTY PORTAL V2.5
          </p>
        </div>
      </div>
    </>
  );
}
