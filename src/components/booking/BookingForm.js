import React, { useState, useEffect } from 'react';
import { Save, Eraser, Trash2, Download, Upload, Compass, Info, FileText, Printer, Calendar, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { formatDateDDMMYY } from '@/lib/dateUtils';
import { numberToWords } from '@/lib/numberToWords';

export default function BookingForm({
  appMode,
  selectedPlotId,
  plots,
  bookings,
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

  // New states for Amount in Words, Installment Mode, and Full Payment Popup
  const [amountInWords, setAmountInWords] = useState('');
  const [installmentMonth, setInstallmentMonth] = useState('');
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [showFullPaymentModal, setShowFullPaymentModal] = useState(false);

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
    const total = parseFloat(totalPrice) || 0;
    let paid = parseFloat(paidAmount) || 0;
    if (existingBooking && installmentAmount) {
      paid += (parseFloat(installmentAmount) || 0);
    }
    const rem = Math.max(0, total - paid);
    setBalance(rem);
  }, [totalPrice, paidAmount, installmentAmount, existingBooking]);

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
      const isFullyPaid = newTotalPaid >= (parseFloat(totalPrice) || 0);
      const newStatus = isFullyPaid ? 'Fully Booked' : existingBooking.status;

      const updatedInstallments = numInst > 0
        ? [...(existingBooking.installments || []), { month: installmentMonth, amount: numInst, date: bookingDate, paymentMode, bankName }]
        : (existingBooking.installments || []);

      return {
        ...existingBooking,
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
        totalPrice: parseFloat(totalPrice) || 0,
        paidAmount: newTotalPaid,
        date: bookingDate,
        tokenExpiryDate: newStatus === 'Token Received' ? tokenExpiryDate : '',
        amountInWords: numInst > 0 ? numberToWords(numInst) : (amountInWords || numberToWords(newTotalPaid)),
        installmentMonth: numInst > 0 ? installmentMonth : (existingBooking.installmentMonth || ''),
        installments: updatedInstallments
      };
    }

    const numericPaid = parseFloat(paidAmount) || 0;
    const numericTotal = parseFloat(totalPrice) || 0;
    const isFullyPaid = numericPaid >= numericTotal && numericTotal > 0;
    const finalStatus = isFullyPaid ? 'Fully Booked' : status;

    return {
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
      totalPrice: numericTotal,
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

    // Check if total amount is fully paid (balance == 0)
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
    if (newType === 'Residential 60SQY') { setTotalPrice(200000); setPaidAmount(50000); setAmountInWords(numberToWords(50000)); }
    else if (newType === 'Residential 120SQY') { setTotalPrice(350000); setPaidAmount(100000); setAmountInWords(numberToWords(100000)); }
    else if (newType === 'Commercial Shop 100SQFT') { setTotalPrice(350000); setPaidAmount(200000); setAmountInWords(numberToWords(200000)); }
    else if (newType === 'Residential 150SQY') { setTotalPrice(1000000); setPaidAmount(200000); setAmountInWords(numberToWords(200000)); }
    else if (newType === 'Commercial 150SQY') { setTotalPrice(1500000); setPaidAmount(300000); setAmountInWords(numberToWords(300000)); }
    const resolvedId = resolveTargetPlotId(plotIdInput, newType);
    if (onFormPreviewChange) onFormPreviewChange(resolvedId ? { plotId: resolvedId, status } : null);
  };

  const handlePaidAmountChange = (e) => {
    const amt = e.target.value;
    setPaidAmount(amt);
    const numAmt = parseFloat(amt) || 0;
    setAmountInWords(numberToWords(numAmt));

    const totalP = parseFloat(totalPrice) || 0;
    if (totalP > 0 && numAmt >= totalP) {
      setStatus('Fully Booked');
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
    const totalP = parseFloat(totalPrice) || 0;
    const newTotal = prevPaid + numInst;

    setAmountInWords(numberToWords(numInst));

    if (totalP > 0 && newTotal >= totalP) {
      setStatus('Fully Booked');
      setShowFullPaymentModal(true);
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onImportLayout(file);
    e.target.value = '';
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">

      {/* PANEL A: BOOKING DETAILS FORM */}
      {appMode === 'booking' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 backdrop-blur-lg flex flex-col">
          <h2 className="text-lg font-bold text-white pb-3 border-b border-slate-800 flex items-center justify-between gap-2 mb-4">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span>{existingBooking ? 'Add Plot Installment Entry' : 'Booking Details Form'}</span>
            </span>
            {existingBooking && (
              <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800/60 px-2.5 py-0.5 rounded-full font-bold">
                🗓️ Installment Mode
              </span>
            )}
          </h2>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Date (dd/mm/yy)</label>
                <span className="text-[11px] font-mono font-bold text-blue-400 bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 rounded">
                  📅 {formatDateDDMMYY(bookingDate)}
                </span>
              </div>
              <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-sm text-white transition-all outline-none" required />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Plot Number</label>
                {resolvedPreviewId && (() => {
                  const isMapped = plots.some(p => p.id === resolvedPreviewId);
                  if (!isMapped) return (<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">⚠ Not On Map</span>);
                  if (existingBooking?.status === 'Fully Booked') return (<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 animate-pulse">🟢 Fully Booked (Green)</span>);
                  if (existingBooking?.status === 'Token Received') return (<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-950/60 text-yellow-400 border border-yellow-800/50 animate-pulse">🟡 Token Received (Yellow)</span>);
                  return (<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">⚪ Available (Unbooked)</span>);
                })()}
              </div>
              <input type="text" value={plotIdInput} onChange={handlePlotInputChange}
                className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-sm text-white transition-all outline-none focus:ring-1 ${(() => {
                  if (!resolvedPreviewId) return 'border-slate-800 focus:border-blue-500 focus:ring-blue-500';
                  if (status === 'Fully Booked') return 'border-emerald-600/60 focus:border-emerald-500 focus:ring-emerald-500';
                  if (status === 'Token Received') return 'border-yellow-600/60 focus:border-yellow-500 focus:ring-yellow-500';
                  return 'border-slate-800 focus:border-blue-500 focus:ring-blue-500';
                })()}`}
                placeholder="Click plot or type number (e.g. 8, 120-8, SR-1)" required />

              {/* INSTALLMENT MODE SUMMARY BANNER */}
              {existingBooking && (
                <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-500/60 text-blue-200 text-xs flex flex-col gap-1 shadow-lg mt-2">
                  <div className="font-bold flex items-center justify-between text-blue-300">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>Existing Plot Record Found &mdash; Adding Installment</span>
                    </span>
                    <span className="font-mono text-[10px] text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded">
                      Paid: Rs {parseInt(existingBooking.paidAmount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-blue-300/90 mt-0.5">
                    Client: <strong>{existingBooking.clientName}</strong> | Total Price: <strong>Rs {parseInt(existingBooking.totalPrice || 0).toLocaleString()}</strong>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Client Full Name</label>
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-sm text-white transition-all outline-none"
                placeholder="e.g. Muhammad Ali" required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Father / Husband Name</label>
                <input type="text" value={relativeName} onChange={(e) => setRelativeName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-sm text-white transition-all outline-none"
                  placeholder="e.g. Muhammad Usman" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Block</label>
                <input type="text" value={block} onChange={(e) => setBlock(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-sm text-white transition-all outline-none"
                  placeholder="e.g. Block A" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Client CNIC</label>
                <input type="text" value={cnic} onChange={(e) => setCnic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-sm text-white transition-all outline-none"
                  placeholder="42101-XXXXXXX-X" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Contact No.</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-sm text-white transition-all outline-none"
                  placeholder="e.g. 0300-1234567" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-sm text-white transition-all outline-none"
                  placeholder="name@mail.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Payment Mode</label>
                <select value={paymentMode} onChange={(e) => { setPaymentMode(e.target.value); setBankName(''); }}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-sm text-white cursor-pointer transition-all outline-none font-medium">
                  <option value="Cash">💵 Cash</option>
                  <option value="Cheque">🏦 Cheque</option>
                  <option value="Online">📱 Online Transfer</option>
                </select>
              </div>
            </div>

            {paymentMode !== 'Cash' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Bank Name</label>
                <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-sm text-white transition-all outline-none"
                  placeholder={paymentMode === 'Cheque' ? 'e.g. HBL, MCB, Allied Bank' : 'e.g. Meezan Bank, UBL'} />
              </div>
            )}

            {/* DYNAMIC FIELD: IF EXISTING BOOKING, SHOW INSTALLMENT MONTH & DISAPPEAR TOKEN/FULLY BOOKED DROPDOWN */}
            {existingBooking ? (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>Installment for the Month of</span>
                </label>
                <input
                  type="text"
                  value={installmentMonth}
                  onChange={(e) => setInstallmentMonth(e.target.value)}
                  className="w-full bg-slate-950 border border-blue-600/60 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-sm text-blue-300 font-semibold transition-all outline-none"
                  placeholder="e.g. August 2026, September 2026"
                  required
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Plot Dimension</label>
                  <select value={plotType} onChange={handlePlotTypeChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-sm text-white cursor-pointer transition-all outline-none">
                    <option value="Residential 60SQY">Res. 60 SQY (Total: Rs 200,000)</option>
                    <option value="Residential 120SQY">Res. 120 SQY (Total: Rs 350,000)</option>
                    <option value="Commercial Shop 100SQFT">Comm. Shop 100 SQFT (Total: Rs 350,000)</option>
                    <option value="Residential 150SQY">Res. 150 SQY (Total: Rs 1,000,000)</option>
                    <option value="Commercial 150SQY">Comm. 150 SQY (Total: Rs 1,500,000)</option>
                    <option value="Custom Size">Other / Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Plot Status Color</label>
                  <select value={status} onChange={handleStatusChange}
                    className={`w-full bg-slate-950 border focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer transition-all outline-none ${
                      status === 'Token Received' ? 'border-yellow-600/60 text-yellow-400 focus:border-yellow-500' : 'border-emerald-600/60 text-emerald-400 focus:border-emerald-500'
                    }`}>
                    <option value="Token Received" className="text-yellow-400 font-semibold">🟡 Token Received (Yellow)</option>
                    <option value="Fully Booked" className="text-emerald-400 font-semibold">🟢 Fully Booked (Green)</option>
                  </select>
                </div>
              </div>
            )}

            {!existingBooking && status === 'Token Received' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-yellow-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Token Expires On (dd/mm/yy)</span>
                  </label>
                  <span className="text-[11px] font-mono font-bold text-yellow-400 bg-yellow-950/60 border border-yellow-800/40 px-2 py-0.5 rounded">
                    📅 {formatDateDDMMYY(tokenExpiryDate)}
                  </span>
                </div>
                <input
                  type="date"
                  value={tokenExpiryDate}
                  onChange={(e) => setTokenExpiryDate(e.target.value)}
                  className="w-full bg-slate-950 border border-yellow-600/60 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 rounded-lg px-3 py-2 text-sm text-yellow-300 font-medium transition-all outline-none"
                  required={status === 'Token Received'}
                />
              </div>
            )}

            {/* DYNAMIC PAYMENT / INSTALLMENT AMOUNT & TOTAL PRICE */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Total Plot Price</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">Rs</span>
                  <input type="number" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg pl-8 pr-3 py-2 text-sm text-white transition-all outline-none"
                    placeholder="0" min="0" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  {existingBooking ? 'New Installment Amount' : 'Token / Paid Amount'}
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">Rs</span>
                  {existingBooking ? (
                    <input type="number" value={installmentAmount} onChange={handleInstallmentAmountChange}
                      className="w-full bg-slate-950 border border-emerald-600/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg pl-8 pr-3 py-2 text-sm text-white font-bold transition-all outline-none"
                      placeholder="0" min="0" required />
                  ) : (
                    <input type="number" value={paidAmount} onChange={handlePaidAmountChange}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg pl-8 pr-3 py-2 text-sm text-white transition-all outline-none"
                      placeholder="0" min="0" required />
                  )}
                </div>
              </div>
            </div>

            {/* AUTOMATIC AMOUNT IN WORDS FIELD */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Amount in Words</label>
              <input
                type="text"
                value={amountInWords}
                onChange={(e) => setAmountInWords(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/80 focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-blue-400 font-medium italic transition-all outline-none"
                placeholder="Automatically generated in words..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Remaining Balance</label>
              <div className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-sm font-bold ${
                balance <= 0 ? 'border-emerald-600/60 text-emerald-400' : 'border-slate-800/40 text-slate-300'
              }`}>
                {balance <= 0 ? 'Rs 0 (FULL PAYMENT RECEIVED)' : `Rs ${balance.toLocaleString()}`}
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-emerald-600/20 active:scale-[0.98]"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    if (e) e.preventDefault();
                    if (existingBooking && !installmentAmount) {
                      if (onPrintReceipt) onPrintReceipt(existingBooking);
                    } else {
                      handleFormSubmit(e, true);
                    }
                  }}
                  className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-blue-600/20 active:scale-[0.98]"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => { clearFields(true); onClearFormSelection(); }}
                className="w-full py-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Clear Form</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* POPUP MODAL: TOTAL PLOT AMOUNT RECEIVED (BALANCE ZERO) */}
      {showFullPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border-2 border-emerald-500 rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-4 relative animate-bounce-short">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 animate-pulse" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-full">
                🎉 Full Payment Received
              </span>
              <h3 className="text-xl font-black text-white mt-3 font-outfit">Total Plot Amount Received</h3>
              <p className="text-xs text-slate-300 mt-1">
                Plot <strong className="text-emerald-400">#{resolvedPreviewId || plotIdInput}</strong> is now completely paid off! The remaining balance is <strong>Rs 0</strong> and plot status color is set to <strong>Fully Booked (Green)</strong>.
              </p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1 text-left">
              <div className="flex justify-between text-slate-400"><span>Client Name:</span> <strong className="text-white">{clientName}</strong></div>
              <div className="flex justify-between text-slate-400"><span>Total Plot Price:</span> <strong className="text-white">Rs {parseInt(totalPrice || 0).toLocaleString()}</strong></div>
              <div className="flex justify-between text-slate-400"><span>Total Amount Received:</span> <strong className="text-emerald-400">Rs {parseInt(totalPrice || 0).toLocaleString()}</strong></div>
              <div className="flex justify-between text-slate-400"><span>Remaining Balance:</span> <strong className="text-emerald-400">Rs 0 (FULLY PAID)</strong></div>
            </div>
            <button
              onClick={() => setShowFullPaymentModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all cursor-pointer shadow-lg shadow-emerald-600/30"
            >
              Dismiss & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
