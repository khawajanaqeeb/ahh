// src/app/booking/page.js
'use client';

import React, { useState, useEffect } from 'react';
import {
  Building, CheckCircle, Clock, Wallet,
  Search, FileSpreadsheet, Eye, DraftingCompass,
  Trash2, Edit, AlertTriangle, Printer
} from 'lucide-react';

import MapCanvas from '@/components/booking/MapCanvas';
import BookingForm from '@/components/booking/BookingForm';
import BookingReceiptModal from '@/components/booking/BookingReceiptModal';
import { formatDateDDMMYY } from '@/lib/dateUtils';
import {
  fetchPlots, savePlotToDb, deletePlotFromDb, clearAllPlotsFromDb,
  fetchBookings, saveBookingToDb, deleteBookingFromDb
} from '@/lib/db';
import { MASTER_SITE_PLAN_JSON, generatePlotsFromMasterJson } from '@/lib/sitePlanData';

export default function BookingPage() {
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

  // Initial load
  useEffect(() => {
    async function loadInitialData() {
      // 1. Fetch plots & bookings from DB
      let dbPlots = await fetchPlots();
      const dbBookings = await fetchBookings();

      // Check if dbPlots has duplicate IDs
      const hasDuplicateIds = dbPlots && dbPlots.length > 0 && dbPlots.some((plot, idx) => dbPlots.findIndex(p => p.id === plot.id) !== idx);

      // If no plots or duplicate IDs found, load master layout from JSON
      if (!dbPlots || dbPlots.length === 0 || hasDuplicateIds) {
        await clearAllPlotsFromDb();
        const masterPlots = generatePlotsFromMasterJson(MASTER_SITE_PLAN_JSON);
        for (const plot of masterPlots) {
          await savePlotToDb(plot);
        }
        dbPlots = masterPlots;
      }

      setPlots(dbPlots);
      setBookings(dbBookings);

      // Check if raster overlay image exists
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
    loadInitialData();
  }, []);

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

  // Reset to Master JSON Layout
  const handleResetToMasterJson = async () => {
    if (confirm('Reset site plan plot boundaries to the original Master JSON specification (Survey No. 297)?')) {
      await clearAllPlotsFromDb();
      const masterPlots = generatePlotsFromMasterJson(MASTER_SITE_PLAN_JSON);
      for (const plot of masterPlots) {
        await savePlotToDb(plot);
      }
      setPlots(masterPlots);
      triggerToast('Reset to Master JSON Layout Specification successfully!');
    }
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

  // Callback: Add Plot Coordinates
  const handleAddPlot = async (id, type, coords) => {
    const rawCoords = coords.map(p => `${p.x},${p.y}`).join(' ');
    const newPlot = { id, type, coords, rawCoords };
    const success = await savePlotToDb(newPlot);
    if (success) {
      setPlots(prev => [...prev.filter(p => p.id !== id), newPlot]);
      triggerToast(`Plot ${id} successfully mapped!`);
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
    const success = await saveBookingToDb(booking);
    if (success) {
      setBookings(prev => {
        const filtered = prev.filter(b => b.plotId !== booking.plotId);
        return [...filtered, booking];
      });
      triggerToast(`Booking saved for Plot ${booking.plotId}!`);
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
        triggerToast(`Booking for Plot ${plotId} deleted.`);
        if (selectedPlotId === plotId) setSelectedPlotId(null);
      }
    }
  };

  // Callback: Export Layout Coordinates to JSON file
  const handleExportLayout = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(MASTER_SITE_PLAN_JSON, null, 2));
    const anchor = document.createElement('a');
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", "ahh_city_survey_297_master_layout.json");
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    triggerToast('Master JSON specification exported.');
  };

  // Callback: Import Layout Coordinates from JSON
  const handleImportLayout = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.residential_plots || Array.isArray(imported)) {
          let plotsToImport = [];
          if (imported.residential_plots) {
            plotsToImport = generatePlotsFromMasterJson(imported);
          } else if (Array.isArray(imported)) {
            plotsToImport = imported;
          }
          for (const plot of plotsToImport) {
            await savePlotToDb(plot);
          }
          setPlots(plotsToImport);
          triggerToast('Master JSON site plan layout imported successfully!');
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
      triggerToast('Ledger is empty.', true);
      return;
    }
    const headers = [
      'Plot No', 'Status', 'Client Name', 'Relation', 'Father/Husband Name',
      'CNIC', 'Contact No', 'Email', 'Payment Mode', 'Plot Dimension',
      'Total Price (Rs)', 'Paid Token (Rs)', 'Balance (Rs)', 'Booking Date'
    ];
    const rows = bookings.map(b => [
      b.plotId, b.status, b.clientName, b.relationType || 'S/O', b.relativeName || 'N/A',
      b.cnic || 'N/A', b.phone, b.email || 'N/A', b.paymentMode || 'Cash', b.plotType,
      b.totalPrice, b.paidAmount, b.totalPrice - b.paidAmount, b.date
    ]);

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
    anchor.setAttribute("download", `AHH_City_Ledger_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    triggerToast('Excel CSV ledger exported successfully.');
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
    <div className="flex flex-col gap-6 max-w-[1850px] w-full mx-auto p-6 min-h-screen">

      {/* Header Panel */}
      <header className="flex flex-col md:flex-row justify-between items-center px-6 py-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <Building className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white font-outfit">AHH CITY</h1>
              <span className="text-xs bg-blue-950 text-blue-400 border border-blue-800/60 px-2.5 py-0.5 rounded-full font-bold">
                Survey No. 297
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mt-0.5">
              Master Architectural Site Plan & Booking Ledger System • AHH Brothers
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 items-center">
          <span className="text-xs bg-blue-950/80 text-blue-400 border border-blue-800/60 px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-blue-400" />
            <span>Booking App Dashboard</span>
          </span>
        </div>
      </header>

      {/* Stats Counter Banner */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center gap-3 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-blue-950/40 text-blue-400 border border-blue-800/30 flex items-center justify-center"><Building className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Total Mapped</span>
            <span className="text-xl font-bold font-outfit text-white">{stats.total}</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center gap-3 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-800/30 flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Available</span>
            <span className="text-xl font-bold font-outfit text-white">{stats.available}</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center gap-3 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-yellow-950/40 text-yellow-400 border border-yellow-800/30 flex items-center justify-center"><Clock className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Tokens Received</span>
            <span className="text-xl font-bold font-outfit text-white">{stats.token}</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center gap-3 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-800/30 flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Booking Received</span>
            <span className="text-xl font-bold font-outfit text-white">{stats.booked}</span>
          </div>
        </div>
        <div className="col-span-2 md:col-span-1 p-4 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center gap-3 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-purple-950/40 text-purple-400 border border-purple-800/30 flex items-center justify-center"><Wallet className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Funds Collected</span>
            <span className="text-lg font-bold font-outfit text-white">Rs {stats.revenue.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Main Workspace split screen */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Left Side: Map viewport container */}
        <div className="lg:col-span-8 h-full min-h-[550px]">
          <MapCanvas
            plots={plots}
            bookings={bookings}
            appMode={appMode}
            selectedPlotId={selectedPlotId}
            onSelectPlot={setSelectedPlotId}
            onAddPlot={handleAddPlot}
            imageSrc={imageSrc}
            onUploadImage={handleImageUploaded}
            imageLoaded={imageLoaded}
            setImageLoaded={setImageLoaded}
            formPreview={formPreview}
          />
        </div>

        {/* Right Side: sidebar panels */}
        <div className="lg:col-span-4 h-full">
          <BookingForm
            appMode={appMode}
            selectedPlotId={selectedPlotId}
            plots={plots}
            bookings={bookings}
            onSaveBooking={handleSaveBooking}
            onClearFormSelection={() => setSelectedPlotId(null)}
            onDeletePlot={handleDeletePlot}
            onClearLayout={handleClearLayout}
            onExportLayout={handleExportLayout}
            onImportLayout={handleImportLayout}
            onFormPreviewChange={setFormPreview}
            onPrintReceipt={(booking) => setActiveReceiptBooking(booking)}
          />
        </div>

      </main>

      {/* Bottom Panel: Ledger Directory Table */}
      <footer className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col gap-4">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-500" />
            <span>AHH City Booking Ledger Directory</span>
          </h2>

          <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
            {/* Search */}
            <div className="relative shrink-0 w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Client, CNIC, Plot..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white outline-none"
              />
            </div>

            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none cursor-pointer"
            >
              <option value="ALL">Show All Listings</option>
              <option value="Token Received">Token Received</option>
              <option value="Booking Received">Booking Received</option>
            </select>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white cursor-pointer transition-colors shadow-md shadow-blue-500/10 w-full sm:w-auto justify-center"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export to Excel</span>
            </button>
          </div>
        </div>

        {/* Ledger grid table */}
        <div className="overflow-x-auto border border-slate-800 bg-slate-950/30 rounded-xl">
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
                <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">Token Amount</th>
                <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">Remaining</th>
                <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">Booking Date</th>
                <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">Token Expiry</th>
                <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="13" className="px-4 py-8 text-center text-slate-500 font-medium">
                    No bookings logged matching your filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b, idx) => {
                  const rem = b.totalPrice - b.paidAmount;
                  return (
                    <tr key={`ledger-${b.plotId}-${idx}`} className="hover:bg-slate-800/10 transition-colors">
                      <td className="px-4 py-3 font-bold text-blue-400">Plot {b.plotId}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          b.status === 'Booking Received'
                            ? 'bg-emerald-950/30 text-emerald-400 border-emerald-800/30'
                            : 'bg-yellow-950/30 text-yellow-400 border-yellow-800/30'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-200">
                        <div>{b.clientName}</div>
                        {b.relativeName && (
                          <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                            <span className="font-semibold text-blue-400">{b.relationType || 'S/O'}</span> {b.relativeName}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-300 font-mono text-[11px]">{b.cnic || 'N/A'}</td>
                      <td className="px-4 py-3 text-slate-400">{b.phone}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-medium">
                          {b.paymentMode === 'Cheque' ? '🏦 Cheque' : b.paymentMode === 'Online' ? '📱 Online' : '💵 Cash'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{b.plotType}</td>
                      <td className="px-4 py-3 text-slate-300">Rs {parseInt(b.totalPrice).toLocaleString()}</td>
                      <td className="px-4 py-3 text-emerald-400 font-medium">Rs {parseInt(b.paidAmount).toLocaleString()}</td>
                      <td className={`px-4 py-3 font-medium ${rem > 0 ? 'text-yellow-500' : 'text-slate-500'}`}>
                        Rs {parseInt(rem).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-slate-300 font-mono text-xs">{formatDateDDMMYY(b.date)}</td>
                      <td className="px-4 py-3 text-amber-400 font-mono text-xs font-semibold">
                        {b.status === 'Token Received' ? formatDateDDMMYY(b.tokenExpiryDate) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5 justify-center items-center">
                          <button
                            onClick={() => setActiveReceiptBooking(b)}
                            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                            title="View & Print Official Receipt"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Receipt</span>
                          </button>
                          <button
                            onClick={() => { setAppMode('booking'); setSelectedPlotId(b.plotId); }}
                            className="p-1 rounded bg-slate-800 text-blue-400 border border-slate-700 hover:bg-slate-700 cursor-pointer transition-colors"
                            title="Edit Booking"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(b.plotId)}
                            className="p-1 rounded bg-red-950/40 text-red-400 border border-red-800/40 hover:bg-red-900/40 cursor-pointer transition-colors"
                            title="Delete Booking"
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

      </footer>

      {/* PRINTABLE RECEIPT MODAL */}
      {activeReceiptBooking && (
        <BookingReceiptModal
          booking={activeReceiptBooking}
          onSaveBooking={handleSaveBooking}
          onDeleteBooking={handleDeleteBooking}
          onClose={() => setActiveReceiptBooking(null)}
        />
      )}

      {/* Floating custom Toast Alert */}
      {toast.show && (
        <div className={`fixed bottom-6 left-6 z-50 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 backdrop-blur-md text-sm border font-semibold animate-bounce ${
          toast.isError
            ? 'bg-red-950/90 text-red-400 border-red-800/40'
            : 'bg-slate-900/90 text-emerald-400 border-slate-800'
        }`}>
          {toast.isError ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          <span>{toast.text}</span>
        </div>
      )}

    </div>
  );
}
