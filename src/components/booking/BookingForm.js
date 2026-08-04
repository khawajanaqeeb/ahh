// src/components/booking/BookingForm.js
'use client';

import React, { useState, useEffect } from 'react';
import { Save, Eraser, Trash2, Download, Upload, Compass, Info, FileText, Printer, Calendar, AlertTriangle, AlertOctagon } from 'lucide-react';
import { formatDateDDMMYY } from '@/lib/dateUtils';

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

  useEffect(() => {
    if (selectedPlotId) {
      setPlotIdInput(selectedPlotId);
      const matchedPlot = plots.find(p => p.id === selectedPlotId);
      if (matchedPlot?.type) setPlotType(matchedPlot.type);
      const existing = bookings.find(b => b.plotId === selectedPlotId);
      if (existing) {
        setClientName(existing.clientName);
        setRelativeName(existing.relativeName || '');
        setCnic(existing.cnic || '');
        setPhone(existing.phone || '');
        setEmail(existing.email || '');
        setBlock(existing.block || '');
        setPaymentMode(existing.paymentMode || 'Cash');
        setBankName(existing.bankName || '');
        setPlotType(existing.plotType);
        setStatus(existing.status);
        setTotalPrice(existing.totalPrice);
        setPaidAmount(existing.paidAmount);
        setBookingDate(existing.date);
        setTokenExpiryDate(existing.tokenExpiryDate || getDefaultExpiryDate());
        if (onFormPreviewChange) onFormPreviewChange({ plotId: selectedPlotId, status: existing.status });
      } else {
        clearFields(false);
      }
    } else {
      setPlotIdInput('');
      clearFields(true);
    }
  }, [selectedPlotId, bookings, plots]);

  useEffect(() => {
    const total = parseFloat(totalPrice) || 0;
    const paid = parseFloat(paidAmount) || 0;
    setBalance(Math.max(0, total - paid));
  }, [totalPrice, paidAmount]);

  useEffect(() => {
    setBookingDate(new Date().toISOString().substring(0, 10));
    setTokenExpiryDate(getDefaultExpiryDate());
  }, []);

  const clearFields = (clearPlotId = true) => {
    if (clearPlotId) setPlotIdInput('');
    setClientName(''); setRelativeName(''); setCnic(''); setPhone(''); setEmail('');
    setBlock(''); setPaymentMode('Cash'); setBankName('');
    setPlotType('Residential 120SQY'); setStatus('Token Received');
    setTotalPrice(''); setPaidAmount('');
    setBookingDate(new Date().toISOString().substring(0, 10));
    setTokenExpiryDate(getDefaultExpiryDate());
    if (onFormPreviewChange) onFormPreviewChange(null);
  };

  const buildBookingPayload = () => {
    const resolvedPlotId = resolveTargetPlotId(plotIdInput, plotType);
    if (!resolvedPlotId) return null;
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
      status,
      totalPrice: parseFloat(totalPrice) || 0,
      paidAmount: parseFloat(paidAmount) || 0,
      date: bookingDate,
      tokenExpiryDate: status === 'Token Received' ? tokenExpiryDate : ''
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
    if (newType === 'Residential 60SQY') { setTotalPrice(200000); setPaidAmount(50000); }
    else if (newType === 'Residential 120SQY') { setTotalPrice(350000); setPaidAmount(100000); }
    else if (newType === 'Commercial Shop 100SQFT') { setTotalPrice(350000); setPaidAmount(200000); }
    else if (newType === 'Residential 150SQY') { setTotalPrice(1000000); setPaidAmount(200000); }
    else if (newType === 'Commercial 150SQY') { setTotalPrice(1500000); setPaidAmount(300000); }
    const resolvedId = resolveTargetPlotId(plotIdInput, newType);
    if (onFormPreviewChange) onFormPreviewChange(resolvedId ? { plotId: resolvedId, status } : null);
  };

  const handlePaidAmountChange = (e) => {
    const amt = e.target.value;
    setPaidAmount(amt);
    const resolvedId = resolveTargetPlotId(plotIdInput, plotType);
    if (onFormPreviewChange && resolvedId) onFormPreviewChange({ plotId: resolvedId, status });
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onImportLayout(file);
    e.target.value = '';
  };

  const resolvedPreviewId = resolveTargetPlotId(plotIdInput, plotType);

  return (
    <div className="w-full h-full flex flex-col gap-6">

      {/* PANEL A: BOOKING DETAILS FORM */}
      {appMode === 'booking' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 backdrop-blur-lg flex flex-col">
          <h2 className="text-lg font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-500" />
            <span>Booking Details Form</span>
          </h2>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Booking Date (dd/mm/yy)</label>
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
                  const existingBooking = bookings.find(b => b.plotId === resolvedPreviewId);
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

              {resolvedPreviewId && (() => {
                const existingBooking = bookings.find(b => b.plotId === resolvedPreviewId);
                if (!existingBooking) return null;
                if (existingBooking.status === 'Token Received') {
                  return (
                    <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/80 text-amber-300 text-xs flex flex-col gap-1 shadow-lg mt-2">
                      <div className="font-bold flex items-center gap-1.5 text-amber-200">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Token Received Status Conflict</span>
                      </div>
                      <div>
                        Plot <strong>#{existingBooking.plotId}</strong> already has a <strong>Token Received</strong> entry!
                        {existingBooking.tokenExpiryDate && (
                          <span className="block mt-0.5 text-[11px] text-amber-200 font-mono">
                            📅 Token Expires On: <strong>{formatDateDDMMYY(existingBooking.tokenExpiryDate)}</strong>
                          </span>
                        )}
                        <span className="block mt-1 text-[10px] text-amber-400/90">
                          Client: {existingBooking.clientName} | Paid Token: Rs {parseInt(existingBooking.paidAmount || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                }
                if (existingBooking.status === 'Fully Booked') {
                  return (
                    <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-300 text-xs flex flex-col gap-1 shadow-lg mt-2">
                      <div className="font-bold flex items-center gap-1.5 text-emerald-200">
                        <AlertOctagon className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Fully Booked Plot Alert</span>
                      </div>
                      <div>
                        Plot <strong>#{existingBooking.plotId}</strong> is already <strong>Fully Booked (Green)</strong>.
                        <span className="block mt-1 text-[10px] text-emerald-300/90">
                          Client: {existingBooking.clientName} | Total Paid: Rs {parseInt(existingBooking.paidAmount || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
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

            {status === 'Token Received' && (
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Total Price</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">Rs</span>
                  <input type="number" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg pl-8 pr-3 py-2 text-sm text-white transition-all outline-none"
                    placeholder="0" min="0" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Token / Paid Amount</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">Rs</span>
                  <input type="number" value={paidAmount} onChange={handlePaidAmountChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg pl-8 pr-3 py-2 text-sm text-white transition-all outline-none"
                    placeholder="0" min="0" required />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Balance</label>
              <div className="w-full bg-slate-950 border border-slate-800/40 rounded-lg px-3 py-2 text-sm text-slate-400">
                Rs {balance.toLocaleString()}
              </div>
            </div>

            {(() => {
              const existingBooking = bookings.find(b => b.plotId === resolvedPreviewId);
              if (!existingBooking) return null;
              return (
                <div className="pt-2">
                  <button type="button" onClick={() => onPrintReceipt && onPrintReceipt(existingBooking)}
                    className="w-full py-2 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/60 hover:bg-blue-900/60 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md">
                    <Printer className="w-4 h-4" />
                    <span>View & Print Receipt for Plot {existingBooking.plotId}</span>
                  </button>
                </div>
              );
            })()}

            <div className="pt-2 space-y-2">
              <button type="button" onClick={(e) => handleFormSubmit(e, true)}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-blue-500/20">
                <Printer className="w-4 h-4" />
                <span>Save & Print Receipt</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button type="submit" className="py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <Save className="w-3.5 h-3.5" /><span>Save Entry Only</span>
                </button>
                <button type="button" onClick={() => { clearFields(true); onClearFormSelection(); }}
                  className="py-2 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <Eraser className="w-3.5 h-3.5" /><span>Clear</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* PANEL B: LAYOUT CONFIGURATOR (Mapper Mode) */}
      {appMode === 'mapper' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 backdrop-blur-lg flex flex-col h-full max-h-[500px]">
          <h2 className="text-lg font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2 mb-4">
            <Compass className="w-5 h-5 text-purple-500" />
            <span>Layout Configurator</span>
          </h2>
          <div className="p-3 bg-purple-950/20 border border-purple-800/30 rounded-xl text-[11px] text-slate-300 mb-4 flex gap-2">
            <Info className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <strong>Drawing Instructions:</strong>
              <ul className="list-disc pl-3.5 mt-1 space-y-1">
                <li>Click <strong>Draw buttons</strong> above map.</li>
                <li>Click map canvas to place coordinates.</li>
                <li>For polygon, double-click to close.</li>
              </ul>
            </div>
          </div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mapped Plots ({plots.length})</h3>
          <div className="flex-grow overflow-y-auto border border-slate-800 bg-slate-950/60 rounded-xl min-h-[120px] max-h-[180px]">
            {plots.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">No plot outlines mapped yet.</div>
            ) : (
              <div className="divide-y divide-slate-800/40">
                {plots.map((plot, idx) => (
                  <div key={`plot-cfg-${plot.id}-${idx}`} className="flex justify-between items-center px-3.5 py-2 hover:bg-slate-800/20 text-xs transition-colors">
                    <span className="font-bold text-blue-400">Plot {plot.label || plot.id}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">
                      {plot.type === 'rect' ? 'Rectangle' : 'Polygon'} ({plot.coords.length} pts)
                    </span>
                    <button onClick={() => { if (confirm(`Delete coordinates outline for Plot ${plot.label || plot.id}?`)) onDeletePlot(plot.id); }}
                      className="text-slate-500 hover:text-red-500 cursor-pointer transition-colors" title="Delete outline">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
            <button onClick={onExportLayout}
              className="w-full py-2 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
              <Download className="w-3.5 h-3.5" /><span>Export Layout JSON</span>
            </button>
            <button onClick={() => document.getElementById('next-import-file').click()}
              className="w-full py-2 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" /><span>Import Layout JSON</span>
            </button>
            <input type="file" id="next-import-file" className="hidden" accept=".json" onChange={handleImportFile} />
            <button onClick={() => { if (confirm("CRITICAL: Delete ALL plot outlines? Bookings won't be lost.")) onClearLayout(); }}
              className="w-full py-2 rounded-lg bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-900/20 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all">
              <Trash2 className="w-3.5 h-3.5" /><span>Clear All Outlines</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
