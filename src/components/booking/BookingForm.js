// src/components/booking/BookingForm.js
// Comprehensive Rebuilt Booking Detail Form for All 4 Projects
// Enforces Section Order: 1. Transaction Basics -> 2. Client Profile -> 3. Payment Configuration -> 4. Financial Summary

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Save, Eraser, Printer, Calendar, AlertCircle, CheckCircle2, 
  Lock, FileText, ShieldCheck, Tag, DollarSign, User, Phone, 
  CreditCard, Sparkles, Building2, MapPin
} from 'lucide-react';
import { formatDateDDMMYY } from '@/lib/dateUtils';
import { numberToWords } from '@/lib/numberToWords';
import { formatCNIC } from '@/lib/db';

export default function BookingForm({
  appMode = 'booking',
  selectedPlotId = '',
  plots = [],
  bookings = [],
  currentProject = {},
  onSaveBooking,
  onClearFormSelection,
  onDeletePlot,
  onClearLayout,
  onExportLayout,
  onImportLayout,
  onFormPreviewChange,
  onPrintReceipt
}) {
  // --- SECTION 1: TRANSACTION BASICS STATE ---
  const [bookingDate, setBookingDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [plotNo, setPlotNo] = useState('');
  const [block, setBlock] = useState('');
  const [plotDimensions, setPlotDimensions] = useState('');

  // --- SECTION 2: CLIENT PROFILE STATE ---
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [cnic, setCnic] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');

  // --- SECTION 3: PAYMENT CONFIGURATION STATE ---
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [bankName, setBankName] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Token Received');
  const [tokenExpiryDate, setTokenExpiryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().substring(0, 10);
  });

  // --- SECTION 4: FINANCIAL SUMMARY STATE ---
  const [costOfPlot, setCostOfPlot] = useState('');
  const [extraCharges, setExtraCharges] = useState('');
  const [processingCharges, setProcessingCharges] = useState('');
  const [developmentCharges, setDevelopmentCharges] = useState('');
  const [amountReceived, setAmountReceived] = useState('');
  const [amountInWords, setAmountInWords] = useState('');
  const [installmentMonth, setInstallmentMonth] = useState(() => {
    return new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  });

  // UI / Validation State
  const [validationError, setValidationError] = useState('');
  const [showZeroBalanceModal, setShowZeroBalanceModal] = useState(false);

  // --- PROJECT REFERENCE OPTIONS ---
  const projectBlocks = useMemo(() => {
    if (!currentProject) return [];
    return currentProject.blocks || [];
  }, [currentProject]);

  const hasBlocks = projectBlocks.length > 0;

  const projectDimensionOptions = useMemo(() => {
    if (!currentProject) return [];
    if (currentProject.dimensions && currentProject.dimensions.length > 0) {
      return currentProject.dimensions;
    }
    if (currentProject.plotTypes && currentProject.plotTypes.length > 0) {
      return currentProject.plotTypes.map(pt => pt.label);
    }
    return ['60 Sq Yd', '80 Sq Yd', '120 Sq Yd', '150 Sq Yd', '240 Sq Yd', 'Custom Size'];
  }, [currentProject]);

  // Set defaults when project changes
  useEffect(() => {
    if (!hasBlocks) {
      setBlock('N/A');
    } else if (!block && projectBlocks.length > 0) {
      setBlock(projectBlocks[0]);
    }

    if (!plotDimensions && projectDimensionOptions.length > 0) {
      setPlotDimensions(projectDimensionOptions[0]);
    }
  }, [currentProject, hasBlocks, projectBlocks, projectDimensionOptions]);

  // --- RESOLVE MATCHING PLOT & HISTORY ---
  const resolvedPlotId = useMemo(() => {
    if (!plotNo || !plotNo.trim()) return '';
    const trimmed = plotNo.trim().toUpperCase();

    // Check direct plot match
    const directMatch = plots.find(p => p.id === trimmed || p.label === trimmed);
    if (directMatch) return directMatch.id;

    // Check with block or dimension prefix matching
    const prefixedMatch = plots.find(p => p.id.endsWith(`-${trimmed}`) || p.id.includes(trimmed));
    if (prefixedMatch) return prefixedMatch.id;

    return trimmed;
  }, [plotNo, plots]);

  // Check if plot has prior booking record in Supabase / state
  const existingBooking = useMemo(() => {
    if (!resolvedPlotId) return null;
    return bookings.find(b => {
      const bPlotId = (b.plotId || b.plot_no || '').toString().toUpperCase();
      return bPlotId === resolvedPlotId.toUpperCase() || bPlotId.endsWith(`-${resolvedPlotId.toUpperCase()}`);
    });
  }, [resolvedPlotId, bookings]);

  const isReturningPlot = Boolean(existingBooking);

  // Sync when plot selected from SVG map canvas
  useEffect(() => {
    if (selectedPlotId) {
      setPlotNo(selectedPlotId);
      const matched = plots.find(p => p.id === selectedPlotId);
      if (matched && matched.type) {
        setPlotDimensions(matched.type);
      }
    }
  }, [selectedPlotId, plots]);

  // Sync existing booking data if selected or matching
  useEffect(() => {
    if (existingBooking) {
      setFullName(existingBooking.clientName || existingBooking.fullName || '');
      setFatherName(existingBooking.fatherName || existingBooking.relativeName || '');
      setCnic(existingBooking.cnic ? formatCNIC(existingBooking.cnic) : '');
      setContactNo(existingBooking.phone || existingBooking.contactNo || '');
      setEmail(existingBooking.email || '');
      setBlock(existingBooking.block || (hasBlocks ? projectBlocks[0] : 'N/A'));
      setPlotDimensions(existingBooking.plotDimensions || existingBooking.plotType || projectDimensionOptions[0] || '');

      // Cost fields
      const pol = existingBooking.costOfPlot || existingBooking.costOfLand || 0;
      const ext = existingBooking.extraCharges || 0;
      const proc = existingBooking.processingCharges || 0;
      const dev = existingBooking.developmentCharges || 0;
      
      setCostOfPlot(pol > 0 ? pol : '');
      setExtraCharges(ext > 0 ? ext : '');
      setProcessingCharges(proc > 0 ? proc : '');
      setDevelopmentCharges(dev > 0 ? dev : '');

      // Status
      const st = existingBooking.paymentStatus || existingBooking.status || 'Booking Received';
      setPaymentStatus(st === 'Token Received' ? 'Booking Received' : st);
    }
  }, [existingBooking]);

  // Adjust Payment Status options depending on first-time vs returning plot
  useEffect(() => {
    if (isReturningPlot) {
      if (paymentStatus === 'Token Received') {
        setPaymentStatus('Booking Received');
      }
    }
  }, [isReturningPlot]);

  // Auto-populate cost of plot from project presets if dimensions change
  const handleDimensionsChange = (e) => {
    const newDim = e.target.value;
    setPlotDimensions(newDim);

    if (currentProject?.plotTypes) {
      const preset = currentProject.plotTypes.find(pt => 
        pt.label.toLowerCase().includes(newDim.toLowerCase()) || 
        newDim.toLowerCase().includes(pt.label.toLowerCase())
      );
      if (preset) {
        if (preset.costOfLand > 0) setCostOfPlot(preset.costOfLand);
        if (preset.extraCharges > 0) setExtraCharges(preset.extraCharges);
        if (preset.processingCharges > 0) setProcessingCharges(preset.processingCharges);
        if (preset.developmentCharges > 0) setDevelopmentCharges(preset.developmentCharges);
        if (preset.paid > 0 && !amountReceived) {
          setAmountReceived(preset.paid);
          setAmountInWords(numberToWords(preset.paid));
        }
      }
    }

    if (onFormPreviewChange && resolvedPlotId) {
      onFormPreviewChange({ plotId: resolvedPlotId, status: paymentStatus, block, dimensions: newDim });
    }
  };

  // --- FINANCIAL CALCULATIONS ---
  const totalPayable = useMemo(() => {
    const cop = parseFloat(costOfPlot) || 0;
    const ext = parseFloat(extraCharges) || 0;
    const proc = parseFloat(processingCharges) || 0;
    const dev = parseFloat(developmentCharges) || 0;
    return cop + ext + proc + dev;
  }, [costOfPlot, extraCharges, processingCharges, developmentCharges]);

  const totalReceivable = totalPayable; // Replaces old "Total Plot Price"

  // Calculate prior received amounts from DB
  const priorReceivedTotal = useMemo(() => {
    if (!existingBooking) return 0;
    return parseFloat(existingBooking.paidAmount || existingBooking.amountReceived) || 0;
  }, [existingBooking]);

  const currentTransactionAmount = parseFloat(amountReceived) || 0;
  const totalReceivedToDate = priorReceivedTotal + currentTransactionAmount;
  const remainingBalance = Math.max(0, totalReceivable - totalReceivedToDate);

  // Live conversion to words
  const handleAmountReceivedChange = (e) => {
    const val = e.target.value;
    setAmountReceived(val);
    const num = parseFloat(val) || 0;
    setAmountInWords(num > 0 ? numberToWords(num) : '');
  };

  // Live CNIC masking
  const handleCnicChange = (e) => {
    const raw = e.target.value;
    setCnic(formatCNIC(raw));
  };

  // Live preview broadcast to map canvas
  useEffect(() => {
    if (resolvedPlotId && onFormPreviewChange) {
      onFormPreviewChange({
        plotId: resolvedPlotId,
        status: paymentStatus,
        block,
        dimensions: plotDimensions
      });
    }
  }, [resolvedPlotId, paymentStatus, block, plotDimensions]);

  // Gating rule: Plot No. + Plot Dimensions required to unlock Sections 2-4
  const isGated = !plotNo.trim() || !plotDimensions;

  // Clear form helper
  const clearForm = () => {
    setPlotNo('');
    setBlock(hasBlocks ? projectBlocks[0] : 'N/A');
    setPlotDimensions(projectDimensionOptions[0] || '');
    setFullName('');
    setFatherName('');
    setCnic('');
    setContactNo('');
    setEmail('');
    setPaymentMode('Cash');
    setBankName('');
    setPaymentStatus('Token Received');
    setCostOfPlot('');
    setExtraCharges('');
    setProcessingCharges('');
    setDevelopmentCharges('');
    setAmountReceived('');
    setAmountInWords('');
    setValidationError('');
    if (onFormPreviewChange) onFormPreviewChange(null);
    if (onClearFormSelection) onClearFormSelection();
  };

  // Submit Handler with Form Submit Guard Validation
  const handleSubmit = (e, andPrintReceipt = false) => {
    if (e) e.preventDefault();
    setValidationError('');

    // Validation Rules
    if (!plotNo.trim()) { setValidationError('Please enter a plot number.'); return; }
    if (hasBlocks && (!block || block === '')) { setValidationError('Please select a block.'); return; }
    if (!plotDimensions) { setValidationError('Please select plot dimensions.'); return; }
    if (!bookingDate) { setValidationError('Booking date is required.'); return; }
    if (!fullName.trim()) { setValidationError('Full name is required.'); return; }
    if (!fatherName.trim()) { setValidationError('Father name is required.'); return; }
    if (!cnic.trim()) { setValidationError('CNIC is required.'); return; }
    if (!contactNo.trim()) { setValidationError('Contact number is required.'); return; }
    if (!paymentMode) { setValidationError('Please select a payment mode.'); return; }
    if (!paymentStatus) { setValidationError('Please select a payment status.'); return; }
    if (paymentStatus === 'Token Received' && !tokenExpiryDate) {
      setValidationError('Token expiry date is required when Token Received is selected.');
      return;
    }
    if (currentTransactionAmount <= 0) { setValidationError('Amount received must be greater than zero.'); return; }
    if ((parseFloat(costOfPlot) || 0) <= 0) { setValidationError('Cost of plot is required and must be greater than zero.'); return; }

    // Standardized Payload
    const payload = {
      projectId: currentProject?.id || 'ahh-city',
      plotId: resolvedPlotId || plotNo.trim().toUpperCase(),
      plot_no: plotNo.trim().toUpperCase(),
      block: hasBlocks ? block : 'N/A',
      plotDimensions,
      plotType: plotDimensions,
      clientName: fullName.trim(),
      fatherName: fatherName.trim(),
      relativeName: fatherName.trim(),
      cnic: cnic.trim(),
      phone: contactNo.trim(),
      email: email.trim(),
      paymentMode,
      bankName: paymentMode !== 'Cash' ? bankName.trim() : '',
      paymentStatus,
      status: paymentStatus,
      tokenExpiryDate: paymentStatus === 'Token Received' ? tokenExpiryDate : '',
      costOfPlot: parseFloat(costOfPlot) || 0,
      costOfLand: parseFloat(costOfPlot) || 0,
      extraCharges: parseFloat(extraCharges) || 0,
      processingCharges: parseFloat(processingCharges) || 0,
      developmentCharges: parseFloat(developmentCharges) || 0,
      totalPayable,
      totalPrice: totalPayable,
      amountReceived: currentTransactionAmount,
      paidAmount: totalReceivedToDate,
      date: bookingDate,
      amountInWords: amountInWords || numberToWords(currentTransactionAmount),
      installmentMonth
    };

    onSaveBooking(payload);

    if (remainingBalance <= 0 && totalPayable > 0) {
      setShowZeroBalanceModal(true);
    }

    if (andPrintReceipt && onPrintReceipt) {
      onPrintReceipt(payload);
    }

    clearForm();
  };

  /* ── Input Styling Tokens ── */
  const inputBase = 'w-full bg-slate-950 border border-slate-700/80 rounded-none px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all font-medium';
  const labelBase = 'block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between';

  return (
    <div className="w-full h-full flex flex-col gap-6">
      
      {/* BOOKING DETAILS FORM CONTAINER */}
      {appMode === 'booking' && (
        <div className="p-6 sm:p-8 rounded-none bg-slate-900/95 border border-slate-800/90 shadow-2xl backdrop-blur-xl flex flex-col gap-0">
          
          {/* Header */}
          <header className="mb-8 pb-6 border-b border-slate-800 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white font-outfit tracking-tight flex items-center gap-2.5 mb-1">
                <FileText className="w-6 h-6 text-amber-500 shrink-0" />
                Booking Detail Form — {currentProject?.name || 'AHH Portal'}
              </h2>
              <p className="text-slate-400 text-xs font-mono">
                {isReturningPlot 
                  ? `Recording payment for returning plot #${resolvedPlotId} (${fullName || 'Existing Client'})`
                  : 'Enter plot & transaction details to register booking into Supabase ledger.'}
              </p>
            </div>
            {isReturningPlot && (
              <span className="shrink-0 text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-3 py-1.5 rounded-none font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Returning Plot Entry
              </span>
            )}
          </header>

          {/* Validation Alert */}
          {validationError && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-none flex items-center gap-3 text-red-400 text-xs font-bold animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">

            {/* ════════════════════════════════════════════════════════════ */}
            {/* 1. TRANSACTION BASICS (MANDATORY SECTION 1)                  */}
            {/* ════════════════════════════════════════════════════════════ */}
            <section className="space-y-5 p-5 bg-slate-950/60 border border-slate-800 rounded-none relative">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-2">
                <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-none bg-amber-500 inline-block"></span>
                  1. Transaction Basics
                </h3>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold">Master Controlling Section</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Booking Date */}
                <div>
                  <label className={labelBase}>
                    <span>Booking Date <span className="text-red-400">*</span></span>
                    <span className="text-amber-400 font-mono text-[10px] font-bold">
                      {formatDateDDMMYY(bookingDate)}
                    </span>
                  </label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={bookingDate} 
                      onChange={(e) => setBookingDate(e.target.value)}
                      className={inputBase} 
                      required 
                    />
                  </div>
                </div>

                {/* Plot No. (Free-text input) */}
                <div>
                  <label className={labelBase}>
                    <span>Plot Number <span className="text-red-400">*</span></span>
                    {resolvedPlotId && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {isReturningPlot ? '🟢 Existing Plot' : '⚪ New Entry'}
                      </span>
                    )}
                  </label>
                  <input 
                    type="text" 
                    value={plotNo} 
                    onChange={(e) => setPlotNo(e.target.value.toUpperCase())}
                    placeholder="e.g. A-101, 205, SR-1" 
                    className={`${inputBase} font-bold font-mono tracking-wider ${plotNo ? 'border-amber-500/60' : ''}`}
                    required 
                  />
                </div>

                {/* Block Dropdown */}
                {hasBlocks ? (
                  <div>
                    <label className={labelBase}>
                      <span>Block <span className="text-red-400">*</span></span>
                    </label>
                    <select 
                      value={block} 
                      onChange={(e) => setBlock(e.target.value)}
                      className={`${inputBase} cursor-pointer`}
                      required
                    >
                      {projectBlocks.map((blk, idx) => (
                        <option key={`blk-${idx}`} value={blk}>{blk}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className={labelBase}>
                      <span>Block</span>
                    </label>
                    <input 
                      type="text" 
                      value="N/A (No Blocks in AHH City)" 
                      disabled 
                      className={`${inputBase} opacity-50 cursor-not-allowed text-slate-500`} 
                    />
                  </div>
                )}

                {/* Plot Dimensions Dropdown */}
                <div>
                  <label className={labelBase}>
                    <span>Plot Dimensions <span className="text-red-400">*</span></span>
                  </label>
                  <select 
                    value={plotDimensions} 
                    onChange={handleDimensionsChange}
                    className={`${inputBase} cursor-pointer`}
                    required
                  >
                    {projectDimensionOptions.map((dim, idx) => (
                      <option key={`dim-${idx}`} value={dim}>{dim}</option>
                    ))}
                  </select>
                </div>

              </div>
            </section>


            {/* Gating Overlay for Sections 2-4 */}
            {isGated ? (
              <div className="p-8 bg-slate-950/80 border border-amber-500/30 rounded-none text-center space-y-3">
                <div className="w-12 h-12 rounded-none bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Sections 2, 3 & 4 Locked</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Please enter a valid <strong className="text-amber-400">Plot Number</strong> and select <strong className="text-amber-400">Plot Dimensions</strong> in Section 1 to unlock Client Profile &amp; Payment Configuration.
                </p>
              </div>
            ) : (
              <>
                {/* ════════════════════════════════════════════════════════════ */}
                {/* 2. CLIENT PROFILE (MANDATORY SECTION 2)                    */}
                {/* ════════════════════════════════════════════════════════════ */}
                <section className="space-y-5 p-5 bg-slate-950/40 border border-slate-800 rounded-none animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-2">
                    <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-violet-400">
                      <span className="w-2.5 h-2.5 rounded-none bg-violet-500 inline-block"></span>
                      2. Client Profile
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label className={labelBase}>Full Name <span className="text-red-400">*</span></label>
                      <input 
                        type="text" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Muhammad Ali Khan" 
                        className={inputBase} 
                        required 
                      />
                    </div>

                    {/* Father Name */}
                    <div>
                      <label className={labelBase}>Father / Husband Name <span className="text-red-400">*</span></label>
                      <input 
                        type="text" 
                        value={fatherName} 
                        onChange={(e) => setFatherName(e.target.value)}
                        placeholder="e.g. Muhammad Usman" 
                        className={inputBase} 
                        required 
                      />
                    </div>

                    {/* CNIC */}
                    <div>
                      <label className={labelBase}>CNIC Number <span className="text-red-400">*</span></label>
                      <input 
                        type="text" 
                        value={cnic} 
                        onChange={handleCnicChange}
                        placeholder="42101-1234567-1" 
                        className={`${inputBase} font-mono`} 
                        maxLength={15}
                        required 
                      />
                    </div>

                    {/* Contact No */}
                    <div>
                      <label className={labelBase}>Contact No. <span className="text-red-400">*</span></label>
                      <input 
                        type="tel" 
                        value={contactNo} 
                        onChange={(e) => setContactNo(e.target.value)}
                        placeholder="0300-1234567" 
                        className={inputBase} 
                        required 
                      />
                    </div>

                    {/* Email (Optional) */}
                    <div className="sm:col-span-2">
                      <label className={labelBase}>
                        <span>Email Address</span>
                        <span className="text-slate-600 normal-case tracking-normal font-normal text-[10px]">(Optional)</span>
                      </label>
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="client@example.com" 
                        className={inputBase} 
                      />
                    </div>
                  </div>
                </section>

                {/* ════════════════════════════════════════════════════════════ */}
                {/* 3. PAYMENT CONFIGURATION (MANDATORY SECTION 3)              */}
                {/* ════════════════════════════════════════════════════════════ */}
                <section className="space-y-5 p-5 bg-slate-950/40 border border-slate-800 rounded-none animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-2">
                    <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-yellow-400">
                      <span className="w-2.5 h-2.5 rounded-none bg-yellow-500 inline-block"></span>
                      3. Payment Configuration
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Payment Mode */}
                    <div>
                      <label className={labelBase}>Payment Mode <span className="text-red-400">*</span></label>
                      <select 
                        value={paymentMode} 
                        onChange={(e) => { setPaymentMode(e.target.value); setBankName(''); }}
                        className={`${inputBase} cursor-pointer`}
                        required
                      >
                        <option value="Cash">💵 Cash</option>
                        <option value="Cheque">🏦 Cheque</option>
                        <option value="Bank Transfer">🏛️ Bank Transfer</option>
                        <option value="Online Transfer">📱 Online Transfer</option>
                      </select>
                    </div>

                    {/* Bank Name if non-cash */}
                    {paymentMode !== 'Cash' ? (
                      <div>
                        <label className={labelBase}>Bank Name</label>
                        <input 
                          type="text" 
                          value={bankName} 
                          onChange={(e) => setBankName(e.target.value)}
                          placeholder="e.g. Meezan Bank, HBL, MCB" 
                          className={inputBase} 
                        />
                      </div>
                    ) : <div />}

                    {/* Payment Status Dropdown (Smart Dropdown Logic) */}
                    <div className="sm:col-span-2">
                      <label className={labelBase}>
                        <span>Payment Status <span className="text-red-400">*</span></span>
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">
                          {isReturningPlot ? 'Returning Plot Mode' : 'First-time Entry Mode'}
                        </span>
                      </label>
                      
                      <select 
                        value={paymentStatus} 
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        className={`${inputBase} cursor-pointer font-bold ${
                          paymentStatus === 'Token Received' 
                            ? 'border-yellow-500 text-yellow-400' 
                            : 'border-emerald-500 text-emerald-400'
                        }`}
                        required
                      >
                        {!isReturningPlot && (
                          <option value="Token Received">🟡 Token Received</option>
                        )}
                        <option value="Booking Received">🟢 Booking Received</option>
                        {isReturningPlot && (
                          <option value="Installment Received">🟢 Installment Received</option>
                        )}
                        <option value="Full Amount Received">🟢 Full Amount Received</option>
                      </select>
                    </div>

                    {/* Conditional Token Expiry Date */}
                    {!isReturningPlot && paymentStatus === 'Token Received' && (
                      <div className="sm:col-span-2 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-none transition-all duration-300">
                        <label className={labelBase}>
                          <span className="text-yellow-400 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" /> Token Expiry Date <span className="text-red-400">*</span>
                          </span>
                          <span className="text-yellow-300 font-mono text-[10px] font-bold">
                            {formatDateDDMMYY(tokenExpiryDate)}
                          </span>
                        </label>
                        <input 
                          type="date" 
                          value={tokenExpiryDate} 
                          onChange={(e) => setTokenExpiryDate(e.target.value)}
                          className={`${inputBase} border-yellow-500/50 text-yellow-300 focus:border-yellow-400 mt-2`}
                          required 
                        />
                      </div>
                    )}

                  </div>
                </section>

                {/* ════════════════════════════════════════════════════════════ */}
                {/* 4. FINANCIAL SUMMARY (MANDATORY SECTION 4)                   */}
                {/* ════════════════════════════════════════════════════════════ */}
                <section className="space-y-5 p-5 bg-slate-950/40 border border-slate-800 rounded-none animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-2">
                    <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-none bg-emerald-500 inline-block"></span>
                      4. Financial Summary
                    </h3>
                  </div>

                  <div className="space-y-5">
                    
                    {/* Cost Breakdown Inputs */}
                    <div className="border border-slate-800 bg-slate-950/80 p-4 space-y-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block border-b border-slate-800 pb-2">
                        📋 Cost Breakdown (Inputs)
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Cost of Plot */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                            Cost of Plot <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">Rs</span>
                            <input 
                              type="number" 
                              value={costOfPlot} 
                              onChange={(e) => setCostOfPlot(e.target.value)}
                              placeholder="0" 
                              min="0"
                              className="w-full bg-slate-900 border border-slate-700 rounded-none pl-9 pr-3 py-2.5 text-sm text-white focus:border-emerald-500 outline-none font-mono"
                              required
                            />
                          </div>
                        </div>

                        {/* Extra Charges */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Extra Charges</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">Rs</span>
                            <input 
                              type="number" 
                              value={extraCharges} 
                              onChange={(e) => setExtraCharges(e.target.value)}
                              placeholder="0" 
                              min="0"
                              className="w-full bg-slate-900 border border-slate-700 rounded-none pl-9 pr-3 py-2.5 text-sm text-white focus:border-emerald-500 outline-none font-mono"
                            />
                          </div>
                        </div>

                        {/* Processing & Doc */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Processing &amp; Doc</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">Rs</span>
                            <input 
                              type="number" 
                              value={processingCharges} 
                              onChange={(e) => setProcessingCharges(e.target.value)}
                              placeholder="0" 
                              min="0"
                              className="w-full bg-slate-900 border border-slate-700 rounded-none pl-9 pr-3 py-2.5 text-sm text-white focus:border-emerald-500 outline-none font-mono"
                            />
                          </div>
                        </div>

                        {/* Development Charges (NEW FIELD) */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Development Charges</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">Rs</span>
                            <input 
                              type="number" 
                              value={developmentCharges} 
                              onChange={(e) => setDevelopmentCharges(e.target.value)}
                              placeholder="0" 
                              min="0"
                              className="w-full bg-slate-900 border border-slate-700 rounded-none pl-9 pr-3 py-2.5 text-sm text-white focus:border-emerald-500 outline-none font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Calculated Fields & Totals */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      
                      {/* Total Receivable */}
                      <div>
                        <label className={labelBase}>Total Receivable (Total Payable)</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 text-sm font-bold">Rs</span>
                          <input 
                            type="text" 
                            value={totalReceivable.toLocaleString()} 
                            readOnly 
                            className={`${inputBase} pl-9 bg-emerald-950/30 border-emerald-800/60 text-emerald-400 font-black text-base cursor-not-allowed`} 
                          />
                        </div>
                      </div>

                      {/* Amount Received */}
                      <div>
                        <label className={labelBase}>Amount Received (Current Entry) <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">Rs</span>
                          <input 
                            type="number" 
                            value={amountReceived} 
                            onChange={handleAmountReceivedChange}
                            placeholder="0" 
                            min="0"
                            className={`${inputBase} pl-9 border-emerald-500/60 font-black text-base text-white focus:border-emerald-400`} 
                            required 
                          />
                        </div>
                      </div>

                    </div>

                    {/* Amount in Words */}
                    <div>
                      <label className={labelBase}>Amount in Words</label>
                      <input 
                        type="text" 
                        value={amountInWords} 
                        readOnly
                        placeholder="Auto-generated in words..." 
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-none px-4 py-3 text-xs text-amber-300 font-mono italic outline-none cursor-not-allowed" 
                      />
                    </div>

                    {/* Total Received To Date & Remaining Balance */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-none space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Received (All Transactions)</span>
                        <span className="text-lg font-black text-emerald-400 font-mono">
                          Rs {totalReceivedToDate.toLocaleString()}
                        </span>
                      </div>

                      <div className={`p-4 rounded-none border space-y-1 ${
                        remainingBalance <= 0 
                          ? 'bg-emerald-950/40 border-emerald-500/60' 
                          : 'bg-slate-950 border-slate-800'
                      }`}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                          remainingBalance <= 0 ? 'text-emerald-400' : 'text-slate-500'
                        }`}>
                          Remaining Balance
                        </span>
                        <span className={`text-lg font-black font-mono ${
                          remainingBalance <= 0 ? 'text-emerald-400' : 'text-slate-200'
                        }`}>
                          Rs {remainingBalance.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Inline Zero Balance Message */}
                    {remainingBalance <= 0 && totalReceivable > 0 && (
                      <div className="p-4 bg-emerald-950/60 border border-emerald-500/60 rounded-none flex items-center gap-3 text-emerald-400 animate-in fade-in duration-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="text-xs font-black uppercase tracking-wider">
                          ✅ All dues cleared — Full amount received.
                        </span>
                      </div>
                    )}

                  </div>
                </section>

                {/* ════════════════════════════════════════════════════════════ */}
                {/* ACTION BUTTONS                                               */}
                {/* ════════════════════════════════════════════════════════════ */}
                <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button 
                      type="submit"
                      className="py-4 px-6 rounded-none bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xl shadow-emerald-950/40 min-h-[48px]"
                    >
                      <Save className="w-4 h-4" />
                      Save Booking Entry
                    </button>

                    <button 
                      type="button"
                      onClick={(e) => handleSubmit(e, true)}
                      className="py-4 px-6 rounded-none bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xl shadow-amber-950/40 min-h-[48px]"
                    >
                      <Printer className="w-4 h-4" />
                      Save &amp; Print Receipt
                    </button>
                  </div>

                  <button 
                    type="button"
                    onClick={clearForm}
                    className="w-full py-3 rounded-none border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Eraser className="w-4 h-4 text-amber-500/80" />
                    Clear Form Fields
                  </button>
                </div>
              </>
            )}

          </form>
        </div>
      )}

      {/* ZERO BALANCE POPUP MODAL */}
      {showZeroBalanceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative z-10 w-full max-w-md bg-slate-900 border-2 border-emerald-500 rounded-none shadow-2xl p-6 sm:p-8 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8 animate-pulse" />
            </div>
            
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-none inline-block mb-2">
                🎉 Full Amount Received
              </span>
              <h3 className="text-xl font-black text-white font-outfit">All Dues Cleared!</h3>
              <p className="text-xs text-slate-300 mt-2">
                Plot <strong className="text-emerald-400">#{resolvedPlotId || plotNo}</strong> has been completely paid off. Total receivable of <strong>Rs {totalReceivable.toLocaleString()}</strong> is fully cleared!
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-none text-xs space-y-2 text-left font-mono">
              <div className="flex justify-between text-slate-400"><span>Client Name:</span> <strong className="text-white">{fullName}</strong></div>
              <div className="flex justify-between text-slate-400"><span>Total Receivable:</span> <strong className="text-white">Rs {totalReceivable.toLocaleString()}</strong></div>
              <div className="flex justify-between text-slate-400"><span>Total Received:</span> <strong className="text-emerald-400">Rs {totalReceivedToDate.toLocaleString()}</strong></div>
              <div className="flex justify-between text-slate-400"><span>Remaining Balance:</span> <strong className="text-emerald-400">Rs 0 (FULLY PAID)</strong></div>
            </div>

            <button
              onClick={() => setShowZeroBalanceModal(false)}
              className="w-full py-3.5 rounded-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
            >
              Dismiss &amp; Continue
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
