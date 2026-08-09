import React, { useState, useEffect } from 'react';
import { Save, Eraser, Trash2, Download, Upload, Compass, Info, FileText, Printer, Calendar, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { formatDateDDMMYY } from '@/lib/dateUtils';
import { numberToWords } from '@/lib/numberToWords';

export default function BookingForm({
  appMode,
  selectedPlotId,
  plots,
  bookings,
  currentProject,
  onSaveBooking,
  onClearFormSelection,
  onDeletePlot,
  onClearLayout,
  onExportLayout,
  onImportLayout,
  onFormPreviewChange,
  onPrintReceipt
}) {
  const [plotIdInput, setPlotIdInput] = useState('');
  const [clientName, setClientName] = useState('');
  const [relativeName, setRelativeName] = useState('');
  const [cnic, setCnic] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [block, setBlock] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [bankName, setBankName] = useState('');
  const [plotType, setPlotType] = useState('Residential 120SQY');
  const [status, setStatus] = useState('Token Received');
  const [totalPrice, setTotalPrice] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [tokenExpiryDate, setTokenExpiryDate] = useState('');
  const [balance, setBalance] = useState(0);

  const [costOfLand, setCostOfLand] = useState('');
  const [extraCharges, setExtraCharges] = useState('');
  const [processingCharges, setProcessingCharges] = useState('');

  const [amountInWords, setAmountInWords] = useState('');
  const [installmentMonth, setInstallmentMonth] = useState('');
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [showFullPaymentModal, setShowFullPaymentModal] = useState(false);

  const totalReceivableAmount = (parseFloat(costOfLand) || 0) + (parseFloat(extraCharges) || 0) + (parseFloat(processingCharges) || 0);

  const getCurrentMonthYear = () => {
    const d = new Date();
    return d.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const getDefaultExpiryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().substring(0, 10);
  };

  const resolveTargetPlotId = (input, selectedType) => {
    if (!input) return '';
    const trimmed = input.trim().toUpperCase();
    const sameTypePlots = plots.filter(p => p.type === selectedType);
    if (sameTypePlots.some(p => p.id === trimmed)) return trimmed;
    if (selectedType === 'Residential 120SQY' && !trimmed.startsWith('120-')) {
      const prefixed = `120-${trimmed}`;
      if (sameTypePlots.some(p => p.id === prefixed)) return prefixed;
    }
    if (sameTypePlots.some(p => p.id === trimmed)) return trimmed;
    if (plots.some(p => p.id === trimmed)) return trimmed;
    return trimmed;
  };

  const resolvedPreviewId = resolveTargetPlotId(plotIdInput, plotType);
  const existingBooking = bookings.find(b => b.plotId === resolvedPreviewId);

  useEffect(() => {
    const targetId = selectedPlotId || resolvedPreviewId;
    if (targetId) {
      if (selectedPlotId && plotIdInput !== selectedPlotId) {
        setPlotIdInput(selectedPlotId);
      }
      const matchedPlot = plots.find(p => p.id === targetId);
      if (matchedPlot?.type) setPlotType(matchedPlot.type);

      const existing = bookings.find(b => b.plotId === targetId);
      if (existing) {
        setClientName(existing.clientName || '');
        setRelativeName(existing.relativeName || '');
        setCnic(existing.cnic || '');
        setPhone(existing.phone || '');
        setEmail(existing.email || '');
        setBlock(existing.block || '');
        setPlotType(existing.plotType || 'Residential 120SQY');
        setStatus(existing.status || 'Token Received');
        setTotalPrice(existing.totalPrice || '');
        setPaidAmount(existing.paidAmount || '');
        setCostOfLand(existing.costOfLand || '');
        setExtraCharges(existing.extraCharges || '');
        setProcessingCharges(existing.processingCharges || '');
        setBookingDate(existing.date || new Date().toISOString().substring(0, 10));
        setTokenExpiryDate(existing.tokenExpiryDate || getDefaultExpiryDate());
        setPaymentMode('Cash');
        setBankName('');
        setInstallmentMonth(getCurrentMonthYear());
        setInstallmentAmount('');
        setAmountInWords('');
        if (onFormPreviewChange) onFormPreviewChange({ plotId: targetId, status: existing.status });
      }
    }
  }, [selectedPlotId, resolvedPreviewId, bookings, plots]);

  useEffect(() => {
    const total = totalReceivableAmount > 0 ? totalReceivableAmount : (parseFloat(totalPrice) || 0);
    let paid = parseFloat(paidAmount) || 0;
    if (existingBooking && installmentAmount) {
      paid += (parseFloat(installmentAmount) || 0);
    }
    const rem = Math.max(0, total - paid);
    setBalance(rem);
  }, [totalPrice, paidAmount, installmentAmount, existingBooking, totalReceivableAmount]);

  useEffect(() => {
    setBookingDate(new Date().toISOString().substring(0, 10));
    setTokenExpiryDate(getDefaultExpiryDate());
    setInstallmentMonth(getCurrentMonthYear());
  }, []);

  const clearFields = (clearPlotId = true) => {
    if (clearPlotId) setPlotIdInput('');
    setClientName(''); setRelativeName(''); setCnic(''); setPhone(''); setEmail('');
    setBlock(''); setPaymentMode('Cash'); setBankName('');
    setPlotType('Residential 120SQY'); setStatus('Token Received');
    setTotalPrice(''); setPaidAmount(''); setAmountInWords('');
    setCostOfLand(''); setExtraCharges(''); setProcessingCharges('');
    setInstallmentMonth(getCurrentMonthYear()); setInstallmentAmount('');
    setBookingDate(new Date().toISOString().substring(0, 10));
    setTokenExpiryDate(getDefaultExpiryDate());
    if (onFormPreviewChange) onFormPreviewChange(null);
  };

  const buildBookingPayload = () => {
    const resolvedPlotId = resolveTargetPlotId(plotIdInput, plotType);
    if (!resolvedPlotId) return null;

    if (existingBooking) {
      const numInst = parseFloat(installmentAmount) || 0;
      const prevPaid = parseFloat(existingBooking.paidAmount) || 0;
      const newTotalPaid = numInst > 0 ? (prevPaid + numInst) : prevPaid;
      const computedTotal = totalReceivableAmount > 0 ? totalReceivableAmount : (parseFloat(totalPrice) || 0);
      const isFullyPaid = computedTotal > 0 && newTotalPaid >= computedTotal;
      const newStatus = isFullyPaid ? 'Booking Received' : existingBooking.status;

      const updatedInstallments = numInst > 0
        ? [...(existingBooking.installments || []), { month: installmentMonth, amount: numInst, date: bookingDate, paymentMode, bankName }]
        : (existingBooking.installments || []);

      return {
        ...existingBooking,
        projectId: currentProject?.id || 'ahh-city',
        plotId: resolvedPlotId,
        clientName: clientName.trim(),
        relativeName: relativeName.trim(),
        cnic: cnic.trim(),
        phone: phone.trim(),
        email: email.trim(),
        block: block.trim(),
        paymentMode,
        bankName: paymentMode !== 'Cash' ? bankName.trim() : '',
        plotType,
        status: newStatus,
        costOfLand: parseFloat(costOfLand) || existingBooking.costOfLand || 0,
        extraCharges: parseFloat(extraCharges) || existingBooking.extraCharges || 0,
        processingCharges: parseFloat(processingCharges) || existingBooking.processingCharges || 0,
        totalPrice: computedTotal > 0 ? computedTotal : (parseFloat(totalPrice) || 0),
        paidAmount: newTotalPaid,
        date: bookingDate,
        tokenExpiryDate: newStatus === 'Token Received' ? tokenExpiryDate : '',
        amountInWords: numInst > 0 ? numberToWords(numInst) : (amountInWords || numberToWords(newTotalPaid)),
        installmentMonth: numInst > 0 ? installmentMonth : (existingBooking.installmentMonth || ''),
        installments: updatedInstallments
      };
    }

    const numericPaid = parseFloat(paidAmount) || 0;
    const computedTotal = totalReceivableAmount > 0 ? totalReceivableAmount : (parseFloat(totalPrice) || 0);
    const isFullyPaid = computedTotal > 0 && numericPaid >= computedTotal;
    const finalStatus = isFullyPaid ? 'Booking Received' : status;

    return {
      projectId: currentProject?.id || 'ahh-city',
      plotId: resolvedPlotId,
      clientName: clientName.trim(),
      relativeName: relativeName.trim(),
      cnic: cnic.trim(),
      phone: phone.trim(),
      email: email.trim(),
      block: block.trim(),
      paymentMode,
      bankName: paymentMode !== 'Cash' ? bankName.trim() : '',
      plotType,
      status: finalStatus,
      costOfLand: parseFloat(costOfLand) || 0,
      extraCharges: parseFloat(extraCharges) || 0,
      processingCharges: parseFloat(processingCharges) || 0,
      totalPrice: computedTotal > 0 ? computedTotal : (parseFloat(totalPrice) || 0),
      paidAmount: numericPaid,
      date: bookingDate,
      tokenExpiryDate: finalStatus === 'Token Received' ? tokenExpiryDate : '',
      amountInWords: amountInWords || numberToWords(numericPaid),
      installmentMonth: '',
      installments: []
    };
  };

  const handleFormSubmit = (e, andPrintReceipt = false) => {
    if (e) e.preventDefault();
    const payload = buildBookingPayload();
    if (!payload) return;

    const isMapped = plots.some(p => p.id === payload.plotId);
    if (!isMapped) {
      const proceed = confirm(`WARNING: Plot "${payload.plotId}" is not drawn on the site plan map. It will be added to the ledger but won't be highlighted on the SVG layout.\n\nDo you want to proceed?`);
      if (!proceed) return;
    }

    onSaveBooking(payload);

    const rem = (parseFloat(payload.totalPrice) || 0) - (parseFloat(payload.paidAmount) || 0);
    if (rem <= 0 && payload.totalPrice > 0) {
      setShowFullPaymentModal(true);
    }

    if (andPrintReceipt && onPrintReceipt) onPrintReceipt(payload);
    if (onFormPreviewChange) onFormPreviewChange(null);
    clearFields(true);
    onClearFormSelection();
  };

  const handlePlotInputChange = (e) => {
    const val = e.target.value.toUpperCase();
    setPlotIdInput(val);
    const resolvedId = resolveTargetPlotId(val, plotType);
    if (onFormPreviewChange) onFormPreviewChange(resolvedId ? { plotId: resolvedId, status } : null);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    const resolvedId = resolveTargetPlotId(plotIdInput, plotType);
    if (onFormPreviewChange) onFormPreviewChange(resolvedId ? { plotId: resolvedId, status: newStatus } : null);
  };

  const handlePlotTypeChange = (e) => {
    const newType = e.target.value;
    setPlotType(newType);

    const preset = currentProject?.plotTypes?.find(pt => pt.label === newType);
    if (preset) {
      setCostOfLand(preset.costOfLand > 0 ? preset.costOfLand : '');
      setExtraCharges(preset.extraCharges > 0 ? preset.extraCharges : '');
      setProcessingCharges(preset.processingCharges > 0 ? preset.processingCharges : '');
      setTotalPrice(preset.total > 0 ? preset.total : '');
      setPaidAmount(preset.paid > 0 ? preset.paid : '');
      setAmountInWords(preset.paid > 0 ? numberToWords(preset.paid) : '');
    } else {
      if (newType === 'Residential 60SQY') { setCostOfLand(200000); setExtraCharges(''); setProcessingCharges(''); setTotalPrice(200000); setPaidAmount(50000); setAmountInWords(numberToWords(50000)); }
      else if (newType === 'Residential 120SQY') { setCostOfLand(350000); setExtraCharges(''); setProcessingCharges(''); setTotalPrice(350000); setPaidAmount(100000); setAmountInWords(numberToWords(100000)); }
      else if (newType === 'Commercial Shop 100SQFT') { setCostOfLand(350000); setExtraCharges(''); setProcessingCharges(''); setTotalPrice(350000); setPaidAmount(200000); setAmountInWords(numberToWords(200000)); }
      else if (newType === 'Residential 150SQY') { setCostOfLand(1000000); setExtraCharges(''); setProcessingCharges(''); setTotalPrice(1000000); setPaidAmount(200000); setAmountInWords(numberToWords(200000)); }
      else if (newType === 'Commercial 150SQY') { setCostOfLand(1500000); setExtraCharges(''); setProcessingCharges(''); setTotalPrice(1500000); setPaidAmount(300000); setAmountInWords(numberToWords(300000)); }
    }

    const resolvedId = resolveTargetPlotId(plotIdInput, newType);
    if (onFormPreviewChange) onFormPreviewChange(resolvedId ? { plotId: resolvedId, status } : null);
  };

  const handlePaidAmountChange = (e) => {
    const amt = e.target.value;
    setPaidAmount(amt);
    const numAmt = parseFloat(amt) || 0;
    setAmountInWords(numberToWords(numAmt));

    const totalP = totalReceivableAmount > 0 ? totalReceivableAmount : (parseFloat(totalPrice) || 0);
    if (totalP > 0 && numAmt >= totalP) {
      setStatus('Booking Received');
      setShowFullPaymentModal(true);
    }

    const resolvedId = resolveTargetPlotId(plotIdInput, plotType);
    if (onFormPreviewChange && resolvedId) onFormPreviewChange({ plotId: resolvedId, status });
  };

  const handleInstallmentAmountChange = (e) => {
    const amt = e.target.value;
    setInstallmentAmount(amt);
    const numInst = parseFloat(amt) || 0;
    const prevPaid = existingBooking ? (parseFloat(existingBooking.paidAmount) || 0) : 0;
    const totalP = totalReceivableAmount > 0 ? totalReceivableAmount : (parseFloat(totalPrice) || 0);
    const newTotal = prevPaid + numInst;

    setAmountInWords(numberToWords(numInst));

    if (totalP > 0 && newTotal >= totalP) {
      setStatus('Booking Received');
      setShowFullPaymentModal(true);
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onImportLayout(file);
    e.target.value = '';
  };

  /* ─── shared input className helpers ─── */
  const inputBase = 'w-full bg-slate-950 border border-slate-700/80 rounded-none px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors';
  const labelBase = 'block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2';

  return (
    <div className="w-full h-full flex flex-col gap-6">

      {/* PANEL A: BOOKING DETAILS FORM */}
      {appMode === 'booking' && (
        <div className="p-7 rounded-none bg-slate-900 border border-slate-800/80 shadow-2xl flex flex-col gap-0">

          {/* ── Form Header ── */}
          <header className="mb-8 pb-6 border-b border-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2.5 mb-1">
                  <FileText className="w-6 h-6 text-blue-500 shrink-0" />
                  {existingBooking ? 'Add Installment Entry' : 'Booking Details Form'}
                </h2>
                <p className="text-slate-500 text-xs">
                  {existingBooking
                    ? 'Record a new installment payment against an existing ledger entry.'
                    : 'Fill in all required fields to register a new plot booking.'}
                </p>
              </div>
              {existingBooking && (
                <span className="shrink-0 text-[10px] bg-purple-950 text-purple-300 border border-purple-800/60 px-2.5 py-1 rounded-none font-bold uppercase tracking-wider">
                  🗓️ Installment Mode
                </span>
              )}
            </div>
          </header>

          <form onSubmit={handleFormSubmit} className="space-y-8">

            {/* ══ SECTION 1: TRANSACTION BASICS ══ */}
            <section>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                Transaction Basics
              </h3>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={labelBase}>
                    Date
                    <span className="ml-auto float-right text-blue-400 font-mono normal-case tracking-normal font-bold">
                      {formatDateDDMMYY(bookingDate)}
                    </span>
                  </label>
                  <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)}
                    className={inputBase} required />
                </div>
                <div>
                  <label className={labelBase}>
                    Plot Number
                    {resolvedPreviewId && (() => {
                      const isMapped = plots.some(p => p.id === resolvedPreviewId);
                      if (!isMapped) return <span className="float-right ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 normal-case tracking-normal">⚠ Not on map</span>;
                      if (existingBooking?.status === 'Booking Received') return <span className="float-right ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800/50 normal-case tracking-normal animate-pulse">🟢 Booked</span>;
                      if (existingBooking?.status === 'Token Received') return <span className="float-right ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-yellow-950/70 text-yellow-400 border border-yellow-800/50 normal-case tracking-normal animate-pulse">🟡 Token</span>;
                      return <span className="float-right ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 normal-case tracking-normal">⚪ Available</span>;
                    })()}
                  </label>
                  <input type="text" value={plotIdInput} onChange={handlePlotInputChange}
                    className={`${inputBase} ${resolvedPreviewId && existingBooking?.status === 'Token Received' ? 'border-yellow-600/50 focus:border-yellow-500' : resolvedPreviewId && existingBooking?.status === 'Booking Received' ? 'border-emerald-600/50 focus:border-emerald-500' : ''}`}
                    placeholder="e.g. 8, 120-8, SR-1" required />
                </div>
              </div>

              {/* Installment mode banner */}
              {existingBooking && (
                <div className="mt-4 p-3.5 rounded-none bg-blue-950/70 border border-blue-500/50 text-blue-200 text-xs flex flex-col gap-1.5">
                  <div className="font-bold flex items-center justify-between text-blue-300">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                      Existing Record — Adding Installment
                    </span>
                    <span className="font-mono text-[10px] bg-blue-900/60 px-2 py-0.5 rounded">
                      Paid: Rs {parseInt(existingBooking.paidAmount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-blue-300/80">
                    Client: <strong>{existingBooking.clientName}</strong> &mdash; Total: <strong>Rs {parseInt(existingBooking.totalPrice || 0).toLocaleString()}</strong>
                  </div>
                </div>
              )}
            </section>

            {/* ══ SECTION 2: CLIENT PROFILE ══ */}
            <section>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
                <span className="w-2 h-2 rounded-full bg-violet-500 inline-block"></span>
                Client Profile
              </h3>
              <div className="space-y-5">
                <div>
                  <label className={labelBase}>Full Name</label>
                  <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)}
                    className={inputBase} placeholder="e.g. Muhammad Ali Khan" required />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className={labelBase}>Father / Husband Name</label>
                    <input type="text" value={relativeName} onChange={(e) => setRelativeName(e.target.value)}
                      className={inputBase} placeholder="e.g. Muhammad Usman" />
                  </div>
                  <div>
                    <label className={labelBase}>Block</label>
                    <input type="text" value={block} onChange={(e) => setBlock(e.target.value)}
                      className={inputBase} placeholder="e.g. Block A" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className={labelBase}>CNIC Number</label>
                    <input type="text" value={cnic} onChange={(e) => setCnic(e.target.value)}
                      className={`${inputBase} font-mono`} placeholder="42101-XXXXXXX-X" />
                  </div>
                  <div>
                    <label className={labelBase}>Contact No.</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      className={inputBase} placeholder="0300-1234567" required />
                  </div>
                </div>
                <div>
                  <label className={labelBase}>Email Address <span className="text-slate-600 normal-case tracking-normal font-normal text-[10px]">(optional)</span></label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className={inputBase} placeholder="client@example.com" />
                </div>
              </div>
            </section>

            {/* ══ SECTION 3: BOOKING CONFIGURATION ══ */}
            <section>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
                <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
                Payment Configuration
              </h3>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className={labelBase}>Payment Mode</label>
                    <select value={paymentMode} onChange={(e) => { setPaymentMode(e.target.value); setBankName(''); }}
                      className={`${inputBase} cursor-pointer`}>
                      <option value="Cash">💵 Cash</option>
                      <option value="Cheque">🏦 Cheque</option>
                      <option value="Online">📱 Online Transfer</option>
                    </select>
                  </div>
                  {paymentMode !== 'Cash' ? (
                    <div>
                      <label className={labelBase}>Bank Name</label>
                      <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)}
                        className={inputBase}
                        placeholder={paymentMode === 'Cheque' ? 'e.g. HBL, MCB' : 'e.g. Meezan Bank, UBL'} />
                    </div>
                  ) : <div />}
                </div>

                {existingBooking ? (
                  <div>
                    <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-blue-400 mb-2">
                      <Calendar className="w-3.5 h-3.5" /> Installment Month
                    </label>
                    <input type="text" value={installmentMonth} onChange={(e) => setInstallmentMonth(e.target.value)}
                      className={`${inputBase} border-blue-600/50 focus:border-blue-500 text-blue-300 font-semibold`}
                      placeholder="e.g. August 2026" required />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className={labelBase}>Plot Dimension</label>
                      <select value={plotType} onChange={handlePlotTypeChange}
                        className={`${inputBase} cursor-pointer`}>
                        {(currentProject?.plotTypes || [
                          { label: 'Residential 60SQY' }, { label: 'Residential 120SQY' },
                          { label: 'Commercial Shop 100SQFT' }, { label: 'Residential 150SQY' },
                          { label: 'Commercial 150SQY' }, { label: 'Custom Size' }
                        ]).map((pt, idx) => (
                          <option key={`pt-${idx}`} value={pt.label}>
                            {pt.label} {pt.total > 0 ? `(Rs ${pt.total.toLocaleString()})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelBase}>Plot Status</label>
                      <select value={status} onChange={handleStatusChange}
                        className={`${inputBase} cursor-pointer font-semibold ${
                          status === 'Token Received'
                            ? 'border-yellow-600/50 text-yellow-400 focus:border-yellow-500'
                            : 'border-emerald-600/50 text-emerald-400 focus:border-emerald-500'
                        }`}>
                        <option value="Token Received">🟡 Token Received</option>
                        <option value="Booking Received">🟢 Booking Received</option>
                      </select>
                    </div>
                  </div>
                )}

                {!existingBooking && status === 'Token Received' && (
                  <div>
                    <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-yellow-400 mb-2">
                      <Calendar className="w-3.5 h-3.5" /> Token Expiry Date
                      <span className="ml-auto text-[10px] font-mono font-bold bg-yellow-950/60 border border-yellow-800/40 px-2 py-0.5 rounded normal-case tracking-normal">
                        {formatDateDDMMYY(tokenExpiryDate)}
                      </span>
                    </label>
                    <input type="date" value={tokenExpiryDate} onChange={(e) => setTokenExpiryDate(e.target.value)}
                      className={`${inputBase} border-yellow-600/50 text-yellow-300 focus:border-yellow-500`}
                      required />
                  </div>
                )}
              </div>
            </section>

            {/* ══ SECTION 4: FINANCIAL SUMMARY ══ */}
            <section>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                Financial Summary
              </h3>
              <div className="space-y-5">

                {/* Cost Breakdown card */}
                <div className="rounded-none border border-slate-800 overflow-hidden">
                  <div className="bg-slate-800/30 px-4 py-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-500">📋 Cost Breakdown</span>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Cost of Land', val: costOfLand, set: setCostOfLand },
                        { label: 'Extra Charges', val: extraCharges, set: setExtraCharges },
                        { label: 'Processing & Doc', val: processingCharges, set: setProcessingCharges }
                      ].map(({ label, val, set }) => (
                        <div key={label}>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">{label}</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">Rs</span>
                            <input type="number" value={val} onChange={(e) => set(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700/80 rounded-none pl-8 pr-2 py-2.5 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                              placeholder="0" min="0" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-800/40 rounded-none px-4 py-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Total Receivable</span>
                      <span className="text-base font-black text-emerald-400">
                        Rs {(totalReceivableAmount > 0 ? totalReceivableAmount : (parseFloat(totalPrice) || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & Paid row */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className={labelBase}>Total Plot Price</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">Rs</span>
                      <input type="number"
                        value={totalReceivableAmount > 0 ? totalReceivableAmount : totalPrice}
                        onChange={(e) => { if (totalReceivableAmount <= 0) setTotalPrice(e.target.value); }}
                        className={`${inputBase} pl-9 ${totalReceivableAmount > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        placeholder="0" min="0" readOnly={totalReceivableAmount > 0} required />
                    </div>
                  </div>
                  <div>
                    <label className={labelBase}>
                      {existingBooking ? 'Installment Amount' : 'Token / Paid Amount'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">Rs</span>
                      {existingBooking ? (
                        <input type="number" value={installmentAmount} onChange={handleInstallmentAmountChange}
                          className={`${inputBase} pl-9 border-emerald-600/50 font-bold focus:border-emerald-500`}
                          placeholder="0" min="0" required />
                      ) : (
                        <input type="number" value={paidAmount} onChange={handlePaidAmountChange}
                          className={`${inputBase} pl-9`}
                          placeholder="0" min="0" required />
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount in words */}
                <div>
                  <label className={labelBase}>Amount in Words</label>
                  <input type="text" value={amountInWords} onChange={(e) => setAmountInWords(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800/50 rounded-none px-4 py-3 text-xs text-blue-400/80 italic placeholder:text-slate-700 outline-none"
                    placeholder="Auto-generated in words..." />
                </div>

                {/* Remaining balance */}
                <div className={`flex items-center justify-between rounded-none px-4 py-3.5 border ${
                  balance <= 0
                    ? 'bg-emerald-950/30 border-emerald-800/50'
                    : 'bg-slate-950/40 border-slate-700/50'
                }`}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${balance <= 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                    Remaining Balance
                  </span>
                  <span className={`font-extrabold ${balance <= 0 ? 'text-emerald-400 text-sm' : 'text-slate-200 text-sm'}`}>
                    {balance <= 0 ? '✓ Fully Paid — Rs 0' : `Rs ${balance.toLocaleString()}`}
                  </span>
                </div>
              </div>
            </section>

            {/* ══ ACTION BUTTONS ══ */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <button type="submit"
                  className="py-3.5 rounded-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-emerald-900/25 active:scale-[0.98]">
                  <Save className="w-4 h-4" />
                  Save Booking
                </button>
                <button type="button"
                  onClick={(e) => {
                    if (e) e.preventDefault();
                    if (existingBooking && !installmentAmount) {
                      if (onPrintReceipt) onPrintReceipt(existingBooking);
                    } else {
                      handleFormSubmit(e, true);
                    }
                  }}
                  className="py-3.5 rounded-none bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-blue-900/25 active:scale-[0.98]">
                  <Printer className="w-4 h-4" />
                  Save & Print
                </button>
              </div>
              <button type="button"
                onClick={() => { clearFields(true); onClearFormSelection(); }}
                className="w-full py-2.5 rounded-none border border-slate-700/50 bg-transparent hover:bg-slate-800/50 text-slate-500 hover:text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                <Eraser className="w-3.5 h-3.5" />
                Clear Form
              </button>
            </div>

          </form>
        </div>
      )}

      {/* POPUP MODAL: FULL AMOUNT RECEIVED (BALANCE ZERO) */}
      {showFullPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border-2 border-emerald-500 rounded-none max-w-md w-full p-6 shadow-2xl text-center space-y-4 relative animate-bounce-short">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 animate-pulse" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-none">
                🎉 Full Amount Received
              </span>
              <h3 className="text-xl font-black text-white mt-3 font-outfit">Total Plot Amount Received</h3>
              <p className="text-xs text-slate-300 mt-1">
                Plot <strong className="text-emerald-400">#{resolvedPreviewId || plotIdInput}</strong> is now completely paid off! The remaining balance is <strong>Rs 0</strong> and plot status color is set to <strong>Booking Received (Green)</strong>.
              </p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-none text-xs space-y-1 text-left">
              <div className="flex justify-between text-slate-400"><span>Client Name:</span> <strong className="text-white">{clientName}</strong></div>
              <div className="flex justify-between text-slate-400"><span>Total Receivable Amount:</span> <strong className="text-white">Rs {(totalReceivableAmount > 0 ? totalReceivableAmount : parseInt(totalPrice || 0)).toLocaleString()}</strong></div>
              <div className="flex justify-between text-slate-400"><span>Total Amount Received:</span> <strong className="text-emerald-400">Rs {(totalReceivableAmount > 0 ? totalReceivableAmount : parseInt(totalPrice || 0)).toLocaleString()}</strong></div>
              <div className="flex justify-between text-slate-400"><span>Remaining Balance:</span> <strong className="text-emerald-400">Rs 0 (FULL AMOUNT RECEIVED)</strong></div>
            </div>
            <button
              onClick={() => setShowFullPaymentModal(false)}
              className="w-full py-2.5 rounded-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all cursor-pointer shadow-lg shadow-emerald-600/30"
            >
              Dismiss &amp; Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
