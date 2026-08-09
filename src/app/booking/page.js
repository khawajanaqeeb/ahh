// src/app/booking/page.js
'use client';

import React, { useState, useEffect } from 'react';
import {
  Building, CheckCircle, Clock, Wallet,
  Search, FileSpreadsheet, Eye, DraftingCompass,
  Trash2, Edit, AlertTriangle, Printer, Layers, Shield
} from 'lucide-react';

import MapCanvas from '@/components/booking/MapCanvas';
import BookingForm from '@/components/booking/BookingForm';
import BookingReceiptModal from '@/components/booking/BookingReceiptModal';
import { formatDateDDMMYY } from '@/lib/dateUtils';
import {
  fetchPlots, savePlotToDb, deletePlotFromDb, clearAllPlotsFromDb,
  fetchBookings, saveBookingToDb, deleteBookingFromDb, clearAllBookingsFromDb
} from '@/lib/db';
import { MASTER_SITE_PLAN_JSON, generatePlotsFromMasterJson } from '@/lib/sitePlanData';
import { PROJECTS, getProjectById, getPlaceholderPlotsForProject } from '@/lib/projectsData';

export default function BookingPage({ projectId = 'ahh-city' }) {
  const activeProject = getProjectById(projectId);

  const [appMode, setAppMode] = useState('booking'); // 'booking' | 'mapper'
  const [plots, setPlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedPlotId, setSelectedPlotId] = useState(null);

  // Printable Receipt Modal State
  const [activeReceiptBooking, setActiveReceiptBooking] = useState(null);

  // Map Image details
  const [imageSrc, setImageSrc] = useState('ahh_city_map.jpg');
  const [imageLoaded, setImageLoaded] = useState(false);

  // Table Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Stats Counters
  const [stats, setStats] = useState({ total: 0, available: 0, token: 0, booked: 0, revenue: 0 });

  // Custom Toast alerts state
  const [toast, setToast] = useState({ show: false, text: '', isError: false });

  // Live form preview state: { plotId, status } or null
  const [formPreview, setFormPreview] = useState(null);

  // All bookings map for Admin Sidebar summary
  const [allBookingsMap, setAllBookingsMap] = useState({});

  // Load project data
  useEffect(() => {
    async function loadProjectData() {
      // Fetch bookings for active project
      const allDbBookings = await fetchBookings();

      // Organize bookings by project
      const projectBookingsMap = {};
      PROJECTS.forEach(p => {
        projectBookingsMap[p.id] = allDbBookings.filter(b => (b.projectId || 'ahh-city') === p.id);
      });
      setAllBookingsMap(projectBookingsMap);

      const filteredBookings = allDbBookings.filter(b => (b.projectId || 'ahh-city') === projectId);
      setBookings(filteredBookings);

      // Fetch plots
      let dbPlots = await fetchPlots();

      if (projectId === 'ahh-city') {
        const hasDuplicateIds = dbPlots && dbPlots.length > 0 && dbPlots.some((plot, idx) => dbPlots.findIndex(p => p.id === plot.id) !== idx);
        if (!dbPlots || dbPlots.length === 0 || hasDuplicateIds) {
          await clearAllPlotsFromDb();
          const masterPlots = generatePlotsFromMasterJson(MASTER_SITE_PLAN_JSON);
          for (const plot of masterPlots) {
            await savePlotToDb(plot);
          }
          dbPlots = masterPlots;
        }
        setPlots(dbPlots);
      } else {
        // For new projects (Hooria Villas, Labour City, Summer Farm Houses)
        const projPlots = dbPlots.filter(p => p.projectId === projectId);
        if (projPlots && projPlots.length > 0) {
          setPlots(projPlots);
        } else {
          // Fallback placeholder plot boundaries (reserving exact same map area)
          setPlots(getPlaceholderPlotsForProject(projectId));
        }
      }

      // Check for raster overlay image
      try {
        const res = await fetch('/api/upload-map');
        const data = await res.json();
        if (data.exists && data.url) {
          setImageSrc(`${data.url}?t=${Date.now()}`);
          setImageLoaded(true);
        }
      } catch {
        setImageLoaded(false);
      }
    }
    loadProjectData();
  }, [projectId]);

  // Compute stats dashboard values
  useEffect(() => {
    const totalMapped = plots.length;
    const token = bookings.filter(b => b.status === 'Token Received').length;
    const booked = bookings.filter(b => b.status === 'Booking Received').length;
    const available = Math.max(0, totalMapped - (token + booked));
    const revenue = bookings.reduce((sum, b) => sum + (parseFloat(b.paidAmount) || 0), 0);
    setStats({ total: totalMapped, available, token, booked, revenue });
  }, [plots, bookings]);

  // Toast Helper
  const triggerToast = (text, isError = false) => {
    setToast({ show: true, text, isError });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // Callback: Handle Site Plan Image Upload
  const handleImageUploaded = async (file) => {
    const previewUrl = URL.createObjectURL(file);
    setImageSrc(previewUrl);
    setImageLoaded(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload-map', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.success && data.url) {
        setImageSrc(`${data.url}?t=${Date.now()}`);
        triggerToast(`Site plan raster overlay saved! (${data.sizeKB} KB)`);
      } else {
        triggerToast(data.error || 'Upload failed — image shown locally only.', true);
      }
    } catch (err) {
      console.error('Upload API error:', err);
      triggerToast('Server upload failed — image shown locally only.', true);
    }
  };

  // Callback: Save Plot Coordinates
  const handleSavePlot = async (newPlot) => {
    const plotWithProject = { ...newPlot, projectId };
    const success = await savePlotToDb(plotWithProject);
    if (success) {
      setPlots(prev => [...prev.filter(p => p.id !== newPlot.id), plotWithProject]);
      triggerToast(`Plot ${newPlot.id} successfully mapped!`);
    } else {
      triggerToast('Error saving plot coordinates.', true);
    }
  };

  // Callback: Delete Plot Coordinates
  const handleDeletePlot = async (plotId) => {
    const success = await deletePlotFromDb(plotId);
    if (success) {
      setPlots(prev => prev.filter(p => p.id !== plotId));
      if (bookings.some(b => b.plotId === plotId)) {
        await deleteBookingFromDb(plotId);
        setBookings(prev => prev.filter(b => b.plotId !== plotId));
      }
      triggerToast(`Plot ${plotId} coordinate outline removed.`);
    } else {
      triggerToast('Error deleting plot coordinates.', true);
    }
  };

  // Callback: Clear All Layout Maps
  const handleClearLayout = async () => {
    const success = await clearAllPlotsFromDb();
    if (success) {
      setPlots([]);
      triggerToast('All plot coordinate boundaries cleared.', true);
    }
  };

  // Callback: Save Booking
  const handleSaveBooking = async (booking) => {
    const bookingWithProject = { ...booking, projectId };
    const success = await saveBookingToDb(bookingWithProject);
    if (success) {
      setBookings(prev => {
        const filtered = prev.filter(b => b.plotId === booking.plotId);
        return [...filtered.filter(b => b.plotId !== booking.plotId), bookingWithProject];
      });
      triggerToast(`Booking saved for ${activeProject.name} — Plot ${booking.plotId}!`);
    } else {
      triggerToast('Error saving booking details.', true);
    }
  };

  // Callback: Delete Booking
  const handleDeleteBooking = async (plotId) => {
    if (confirm(`Cancel booking/token entry for Plot ${plotId}? Plot returns to unbooked.`)) {
      const success = await deleteBookingFromDb(plotId);
      if (success) {
        setBookings(prev => prev.filter(b => b.plotId !== plotId));
        triggerToast(`Booking for Plot ${plotId} deleted from local & database.`);
        if (selectedPlotId === plotId) setSelectedPlotId(null);
      }
    }
  };

  // Callback: Clear All Bookings for Active Project
  const handleClearAllBookings = async () => {
    if (confirm(`Are you sure you want to clear ALL bookings and receipts for ${activeProject.name}? This will delete records from both Local Storage and Database!`)) {
      const success = await clearAllBookingsFromDb();
      if (success) {
        setBookings([]);
        setSelectedPlotId(null);
        triggerToast(`All receipts cleared for ${activeProject.name}!`, true);
      }
    }
  };

  // Callback: Export Layout Coordinates to JSON file
  const handleExportLayout = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(plots, null, 2));
    const anchor = document.createElement('a');
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", `${activeProject.id}_site_plan_layout.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    triggerToast(`Exported ${plots.length} plot coordinates JSON!`);
  };

  // Callback: Import Layout Coordinates from JSON file
  const handleImportLayout = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        const plotsToImport = importedData.plots ? importedData.plots : (Array.isArray(importedData) ? importedData : null);

        if (plotsToImport && Array.isArray(plotsToImport)) {
          const taggedPlots = plotsToImport.map(p => ({ ...p, projectId }));
          for (const plot of taggedPlots) {
            await savePlotToDb(plot);
          }
          setPlots(taggedPlots);
          triggerToast(`${activeProject.name} site plan layout imported successfully!`);
        } else {
          triggerToast('Invalid JSON site plan format.', true);
        }
      } catch (err) {
        triggerToast('Error parsing layout JSON file.', true);
      }
    };
    reader.readAsText(file);
  };

  // Callback: Export ledger entries to CSV (Excel)
  const handleExportCSV = () => {
    if (bookings.length === 0) {
      triggerToast('Ledger is empty for this project.', true);
      return;
    }
    const headers = [
      'Project', 'Plot No', 'Status', 'Client Name', 'Father/Husband Name',
      'CNIC', 'Contact No', 'Email', 'Payment Mode', 'Plot Dimension',
      'Cost of Land (Rs)', 'Extra Charges (Rs)', 'Processing (Rs)',
      'Total Receivable (Rs)', 'Paid Amount (Rs)', 'Balance (Rs)', 'Booking Date'
    ];
    const rows = bookings.map(b => {
      const computedTotal = ((parseFloat(b.costOfLand) || 0) + (parseFloat(b.extraCharges) || 0) + (parseFloat(b.processingCharges) || 0)) || (parseFloat(b.totalPrice) || 0);
      const rem = computedTotal - (parseFloat(b.paidAmount) || 0);
      return [
        activeProject.name, b.plotId, b.status, b.clientName, b.relativeName || 'N/A',
        b.cnic || 'N/A', b.phone, b.email || 'N/A', b.paymentMode || 'Cash', b.plotType,
        b.costOfLand || 0, b.extraCharges || 0, b.processingCharges || 0,
        computedTotal, b.paidAmount, rem, b.date
      ];
    });

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    rows.forEach(row => {
      const escaped = row.map(val => {
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      });
      csvContent += escaped.join(",") + "\n";
    });

    const encoded = encodeURI(csvContent);
    const anchor = document.createElement('a');
    anchor.setAttribute("href", encoded);
    anchor.setAttribute("download", `${activeProject.name.replace(/\s+/g, '_')}_Ledger_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    triggerToast(`Excel CSV ledger exported for ${activeProject.name}.`);
  };

  // Filtered Bookings list for Table
  const filteredBookings = bookings.filter(b => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      b.plotId.toLowerCase().includes(query) ||
      b.clientName.toLowerCase().includes(query) ||
      (b.relativeName && b.relativeName.toLowerCase().includes(query)) ||
      (b.cnic && b.cnic.toLowerCase().includes(query)) ||
      (b.phone && b.phone.toLowerCase().includes(query));
    const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">

      <div className="flex flex-col gap-6 max-w-[1700px] w-full mx-auto p-4 sm:p-6 pb-20">

        {/* Header Panel */}
        <header className="flex flex-col md:flex-row justify-between items-center px-6 py-4 rounded-none bg-slate-900/80 border border-slate-800 backdrop-blur-md gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 p-1.5 bg-white rounded-none shadow-lg shadow-blue-500/20 flex items-center justify-center overflow-hidden border border-slate-200">
              <img src={activeProject.logo} alt={`${activeProject.name} logo`} className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-white font-outfit uppercase">
                  {activeProject.name}
                </h1>
                <span className="text-xs bg-blue-950 text-blue-400 border border-blue-800/60 px-2.5 py-0.5 rounded-none font-bold">
                  {activeProject.survey}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mt-0.5">
                {activeProject.tagline} • Booking Ledger & Receipt System
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 items-center">
            <span className="text-xs bg-blue-950/80 text-blue-400 border border-blue-800/60 px-3.5 py-1.5 rounded-none font-bold flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-blue-400" />
              <span>{activeProject.name} Dashboard</span>
            </span>
          </div>
        </header>

        {/* Stats Counter Banner */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-none bg-slate-900 border border-slate-800/80 flex items-center gap-3 shadow-md">
            <div className="w-12 h-12 rounded-none bg-blue-950/40 text-blue-400 border border-blue-800/30 flex items-center justify-center"><Building className="w-6 h-6" /></div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Total Mapped</span>
              <span className="text-xl font-bold font-outfit text-white">{stats.total}</span>
            </div>
          </div>
          <div className="p-4 rounded-none bg-slate-900 border border-slate-800/80 flex items-center gap-3 shadow-md">
            <div className="w-12 h-12 rounded-none bg-emerald-950/40 text-emerald-400 border border-emerald-800/30 flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Available</span>
              <span className="text-xl font-bold font-outfit text-white">{stats.available}</span>
            </div>
          </div>
          <div className="p-4 rounded-none bg-slate-900 border border-slate-800/80 flex items-center gap-3 shadow-md">
            <div className="w-12 h-12 rounded-none bg-yellow-950/40 text-yellow-400 border border-yellow-800/30 flex items-center justify-center"><Clock className="w-6 h-6" /></div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Tokens Recv</span>
              <span className="text-xl font-bold font-outfit text-white">{stats.token}</span>
            </div>
          </div>
          <div className="p-4 rounded-none bg-slate-900 border border-slate-800/80 flex items-center gap-3 shadow-md">
            <div className="w-12 h-12 rounded-none bg-emerald-950/40 text-emerald-400 border border-emerald-800/30 flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Booking Recv</span>
              <span className="text-xl font-bold font-outfit text-white">{stats.booked}</span>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 p-4 rounded-none bg-slate-900 border border-slate-800/80 flex items-center gap-3 shadow-md">
            <div className="w-12 h-12 rounded-none bg-purple-950/40 text-purple-400 border border-purple-800/30 flex items-center justify-center"><Wallet className="w-6 h-6" /></div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Funds Collected</span>
              <span className="text-lg font-bold font-outfit text-white">Rs {stats.revenue.toLocaleString()}</span>
            </div>
          </div>
        </section>

        {/* Main Workspace split screen */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* LEFT 7 COLS: INTERACTIVE SITE PLAN MAP CANVAS (SAME SIZE SPACE RESERVED FOR ALL PROJECTS) */}
          <div className="lg:col-span-7 h-[680px] min-h-[680px]">
            <MapCanvas
              appMode={appMode}
              plots={plots}
              bookings={bookings}
              selectedPlotId={selectedPlotId}
              currentProject={activeProject}
              onSelectPlot={(plotId) => setSelectedPlotId(plotId)}
              onSavePlot={handleSavePlot}
              onDeletePlot={handleDeletePlot}
              imageSrc={imageSrc}
              imageLoaded={imageLoaded}
              formPreview={formPreview}
            />
          </div>

          {/* RIGHT 5 COLS: BOOKING DETAILS & INSTALLMENT ENTRY FORM */}
          <div className="lg:col-span-5 h-[680px] min-h-[680px] overflow-y-auto custom-scrollbar">
            <BookingForm
              appMode={appMode}
              selectedPlotId={selectedPlotId}
              plots={plots}
              bookings={bookings}
              currentProject={activeProject}
              onSaveBooking={handleSaveBooking}
              onClearFormSelection={() => setSelectedPlotId(null)}
              onDeletePlot={handleDeletePlot}
              onClearLayout={handleClearLayout}
              onExportLayout={handleExportLayout}
              onImportLayout={handleImportLayout}
              onFormPreviewChange={(previewData) => setFormPreview(previewData)}
              onPrintReceipt={(bookingPayload) => setActiveReceiptBooking(bookingPayload)}
            />
          </div>

        </main>

        {/* BOTTOM SECTION: LEDGER TABLE & SEARCH */}
        <section className="mt-4 p-6 rounded-none bg-slate-900 border border-slate-800 backdrop-blur-lg space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-8 h-8 p-1 rounded-none bg-white border border-slate-700 flex items-center justify-center overflow-hidden">
                  <img src={activeProject.logo} alt={`${activeProject.name} logo`} className="w-full h-full object-contain" />
                </span>
                <span>{activeProject.name} Customer Booking Ledger</span>
              </h2>
              <p className="text-xs text-slate-400">
                Complete transaction ledger of token payments, bookings, and installment histories for {activeProject.name}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative flex-grow md:flex-grow-0 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search plot #, name, cnic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-none pl-9 pr-3 py-1.5 text-xs text-white outline-none"
                />
              </div>

              {/* Filter Status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-none px-3 py-1.5 text-xs text-slate-300 outline-none cursor-pointer"
              >
                <option value="ALL">Show All Listings</option>
                <option value="Token Received">Token Received</option>
                <option value="Booking Received">Booking Received</option>
              </select>

              {/* Export CSV */}
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-none bg-blue-600 hover:bg-blue-500 text-white cursor-pointer transition-colors shadow-md shadow-blue-500/10 w-full sm:w-auto justify-center"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export to Excel</span>
              </button>

              {/* Clear All Bookings */}
              <button
                onClick={handleClearAllBookings}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-none bg-red-950/80 border border-red-800/60 hover:bg-red-900 text-red-300 cursor-pointer transition-colors w-full sm:w-auto justify-center"
                title="Wipe all bookings and receipts for active project"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear {activeProject.name} Receipts</span>
              </button>
            </div>
          </div>

          {/* Ledger grid table */}
          <div className="overflow-x-auto border border-slate-800 bg-slate-950/30 rounded-none">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80">
                  <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">Plot No</th>
                  <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">Client Details</th>
                  <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">CNIC</th>
                  <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">Contact No</th>
                  <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">Payment Mode</th>
                  <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">Plot Dimension</th>
                  <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">Total Price</th>
                  <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">Paid Amount</th>
                  <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">Remaining</th>
                  <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">Booking Date</th>
                  <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="px-4 py-8 text-center text-slate-500 font-medium">
                      No bookings logged matching your filters for {activeProject.name}.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b, idx) => {
                    const computedTotal = ((parseFloat(b.costOfLand) || 0) + (parseFloat(b.extraCharges) || 0) + (parseFloat(b.processingCharges) || 0)) || (parseFloat(b.totalPrice) || 0);
                    const rem = computedTotal - b.paidAmount;
                    return (
                      <tr key={`ledger-${b.plotId}-${idx}`} className="hover:bg-slate-800/10 transition-colors">
                        <td className="px-4 py-3 font-bold text-blue-400">Plot {b.plotId}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold border ${
                            b.status === 'Booking Received'
                              ? 'bg-emerald-950/30 text-emerald-400 border-emerald-800/30'
                              : 'bg-yellow-950/30 text-yellow-400 border-yellow-800/30'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white">{b.clientName}</div>
                          {b.relativeName && <div className="text-[10px] text-slate-400">S/O {b.relativeName}</div>}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-300">{b.cnic || 'N/A'}</td>
                        <td className="px-4 py-3 text-slate-300">{b.phone}</td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-blue-400">{b.paymentMode || 'Cash'}</span>
                          {b.bankName && <span className="text-[10px] text-slate-400 block">({b.bankName})</span>}
                        </td>
                        <td className="px-4 py-3 text-slate-300">{b.plotType}</td>
                        <td className="px-4 py-3 font-semibold text-white">Rs {parseInt(computedTotal).toLocaleString()}</td>
                        <td className="px-4 py-3 font-bold text-emerald-400">Rs {parseInt(b.paidAmount || 0).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`font-bold ${rem <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {rem <= 0 ? 'Rs 0 (FULL PAID)' : `Rs ${parseInt(rem).toLocaleString()}`}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 font-mono">{formatDateDDMMYY(b.date)}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setActiveReceiptBooking(b)}
                              className="p-1.5 rounded-none bg-blue-950 border border-blue-800/60 hover:bg-blue-900 text-blue-400 transition-colors cursor-pointer"
                              title="Print A4 Receipt Voucher"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(b.plotId)}
                              className="p-1.5 rounded-none bg-red-950 border border-red-800/60 hover:bg-red-900 text-red-400 transition-colors cursor-pointer"
                              title="Delete Receipt Entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* PRINTABLE RECEIPT MODAL */}
        {activeReceiptBooking && (
          <BookingReceiptModal
            booking={activeReceiptBooking}
            onSaveBooking={handleSaveBooking}
            onDeleteBooking={handleDeleteBooking}
            onClose={() => setActiveReceiptBooking(null)}
          />
        )}

        {/* TOAST ALERTS */}
        {toast.show && (
          <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-none font-bold text-xs shadow-2xl flex items-center gap-2 border animate-bounce ${
            toast.isError ? 'bg-red-950 text-red-200 border-red-800' : 'bg-emerald-950 text-emerald-200 border-emerald-800'
          }`}>
            <span>{toast.isError ? '⚠️' : '✅'}</span>
            <span>{toast.text}</span>
          </div>
        )}

      </div>
    </div>
  );
}
