// src/components/booking/BookingReceiptModal.js
'use client';

import React, { useState } from 'react';
import { ArrowLeft, X, Printer, Calendar, AlertTriangle, AlertOctagon, CheckCircle2, Trash2 } from 'lucide-react';
import { formatDateDDMMYY } from '@/lib/dateUtils';
import { numberToWords } from '@/lib/numberToWords';

function getExpiryStatus(tokenExpiryDate) {
  if (!tokenExpiryDate) return { isExpired: false, isExpiringSoon: false, text: '' };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(tokenExpiryDate);
  exp.setHours(0, 0, 0, 0);
  const diffTime = exp.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      isExpired: true,
      isExpiringSoon: false,
      text: 'TOKEN EXPIRED — Token validity has passed. Please enter a new expiry date or cancel the token.'
    };
  }
  if (diffDays === 0 || diffDays === 1) {
    return {
      isExpired: false,
      isExpiringSoon: true,
      text: 'Token will be expired tomorrow.'
    };
  }
  return {
    isExpired: false,
    isExpiringSoon: false,
    text: `Token Valid until ${formatDateDDMMYY(tokenExpiryDate)}`
  };
}

// Build raw HTML string for the printable receipt (no React, pure HTML+CSS)
function buildReceiptHTML(booking) {
  const remaining = (parseFloat(booking.totalPrice) || 0) - (parseFloat(booking.paidAmount) || 0);
  const receiptNo = `REC-${booking.plotId}-${booking.date?.replace(/-/g, '') || '01'}`;
  const statusLabel = remaining <= 0 || booking.status === 'Fully Booked' ? 'FULLY BOOKED' : 'TOKEN RECEIVED';
  const statusColor = remaining <= 0 || booking.status === 'Fully Booked' ? '#15803d' : '#b45309';
  const statusBg = remaining <= 0 || booking.status === 'Fully Booked' ? '#f0fdf4' : '#fffbeb';
  const statusBorder = remaining <= 0 || booking.status === 'Fully Booked' ? '#bbf7d0' : '#fde68a';

  const paymentModeLabel = booking.paymentMode === 'Cash'
    ? '💵 Cash'
    : booking.paymentMode === 'Cheque'
    ? `🏦 Cheque ${booking.bankName ? `(${booking.bankName})` : ''}`
    : `📱 Online Transfer ${booking.bankName ? `(${booking.bankName})` : ''}`;

  const amountInWordsText = booking.amountInWords || numberToWords(booking.paidAmount);

  const expiryHTML = booking.status === 'Token Received' && booking.tokenExpiryDate ? `
    <div style="font-size:10px;color:#b45309;font-family:monospace;margin-top:2px;font-weight:bold;">
      📅 Token Expires: ${formatDateDDMMYY(booking.tokenExpiryDate)}
    </div>
  ` : '';

  const installmentHTML = booking.installmentMonth ? `
    <div style="font-size:10px;color:#1e3a8a;font-family:sans-serif;margin-top:2px;font-weight:bold;">
      🗓️ Installment Month: ${booking.installmentMonth}
    </div>
  ` : '';

  const voucherHTML = (copyType, badgeColor, badgeBg, badgeBorder) => `
    <div class="voucher">
      <!-- Header -->
      <div class="header-box">
        <div>
          <div class="brand-name">AHH CITY</div>
          <div class="brand-sub">AHH Brothers Builders &amp; Developers</div>
          <div class="brand-tag">Survey No. 297 &mdash; Master Planned Housing Scheme</div>
        </div>
        <div style="text-align:right;">
          <span class="copy-badge" style="background:${badgeBg};color:${badgeColor};border:1.5px solid ${badgeBorder};">${copyType}</span>
          <div class="meta-row" style="margin-top:4px;">Receipt #: <strong>${receiptNo}</strong></div>
          <div class="meta-row">Date: <strong>${formatDateDDMMYY(booking.date)}</strong></div>
          ${expiryHTML}
          ${installmentHTML}
        </div>
      </div>

      <!-- Plot Info Row -->
      <div class="plot-box">
        <div>
          <span class="plot-id">PLOT ${booking.plotId}</span>
          <span class="plot-type">(${booking.plotType || 'N/A'})</span>
        </div>
        <span class="status-badge" style="background:${statusBg};color:${statusColor};border:1.5px solid ${statusBorder};">${statusLabel}</span>
      </div>

      <!-- Applicant Details Table -->
      <table class="details-table">
        <tr>
          <td class="lbl">Applicant Name:</td>
          <td class="val">${booking.clientName || 'N/A'}</td>
          <td class="lbl" style="padding-left:14px;">Father / Husband:</td>
          <td class="val">${booking.relativeName || 'N/A'}</td>
        </tr>
        <tr>
          <td class="lbl">CNIC Number:</td>
          <td class="val" style="font-family:monospace;">${booking.cnic || 'N/A'}</td>
          <td class="lbl" style="padding-left:14px;">Contact No:</td>
          <td class="val">${booking.phone || 'N/A'}</td>
        </tr>
        <tr>
          <td class="lbl">Block:</td>
          <td class="val">${booking.block || 'N/A'}</td>
          <td class="lbl" style="padding-left:14px;">Payment Method:</td>
          <td class="val" style="color:#1e3a8a;font-weight:bold;">${paymentModeLabel}</td>
        </tr>
        ${amountInWordsText ? `
        <tr>
          <td class="lbl">Amount in Words:</td>
          <td class="val" colspan="3" style="font-style:italic;color:#0f172a;font-weight:700;">${amountInWordsText}</td>
        </tr>
        ` : ''}
      </table>

      <!-- Financial Summary Box -->
      <div class="summary-box">
        <div class="summary-col">
          <div class="sum-lbl">Total Price</div>
          <div class="sum-val" style="color:#0f172a;">Rs ${parseInt(booking.totalPrice || 0).toLocaleString()}</div>
        </div>
        <div class="summary-col" style="border-left:1px solid #cbd5e1; border-right:1px solid #cbd5e1;">
          <div class="sum-lbl">Total Paid Amount</div>
          <div class="sum-val" style="color:#15803d;">Rs ${parseInt(booking.paidAmount || 0).toLocaleString()}</div>
        </div>
        <div class="summary-col">
          <div class="sum-lbl">Remaining Balance</div>
          <div class="sum-val" style="color:${remaining > 0 ? '#b45309' : '#15803d'};">${remaining <= 0 ? 'Rs 0 (FULLY PAID)' : `Rs ${parseInt(remaining).toLocaleString()}`}</div>
        </div>
      </div>

      <!-- Signatures Footer -->
      <div class="sig-row">
        <div class="sig-col"><div class="sig-line"></div><div class="sig-label">Accounts Signature</div></div>
        <div class="sig-col"><div class="sig-line"></div><div class="sig-label">Manager Signature</div></div>
        <div class="sig-col"><div class="sig-line"></div><div class="sig-label">Authorized Signature</div></div>
      </div>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>AHH CITY Booking Receipt - ${booking.plotId}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      width: 210mm;
      height: 297mm;
      background: #ffffff;
      font-family: Arial, Helvetica, sans-serif;
      color: #0f172a;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page-container {
      width: 210mm;
      height: 297mm;
      padding: 6mm 8mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
      background: #ffffff;
      overflow: hidden;
    }
    .voucher {
      flex: 1 1 0%;
      height: calc(50% - 6mm);
      max-height: calc(50% - 6mm);
      box-sizing: border-box;
      border: 2px solid #0f172a;
      border-radius: 4px;
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #ffffff;
      position: relative;
    }
    .cut-line {
      height: 6mm;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin: 1mm 0;
    }
    .cut-line::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      border-top: 1.5px dashed #64748b;
    }
    .cut-label {
      position: relative;
      background: #ffffff;
      padding: 0 12px;
      font-size: 9.5px;
      color: #475569;
      font-family: monospace;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: bold;
      z-index: 1;
    }
    .header-box {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 6px;
    }
    .brand-name {
      font-size: 22px;
      font-weight: 900;
      color: #1e3a8a;
      letter-spacing: -0.5px;
      line-height: 1;
    }
    .brand-sub {
      font-size: 10px;
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }
    .brand-tag {
      font-size: 9px;
      color: #64748b;
      margin-top: 1px;
    }
    .copy-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 3px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .meta-row {
      font-size: 9.5px;
      color: #475569;
      font-family: monospace;
    }
    .plot-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 4px;
      padding: 6px 12px;
      margin-top: 4px;
      margin-bottom: 4px;
    }
    .plot-id {
      font-size: 20px;
      font-weight: 900;
      color: #1e3a8a;
      letter-spacing: -0.5px;
    }
    .plot-type {
      font-size: 10.5px;
      color: #475569;
      font-weight: 700;
      margin-left: 6px;
    }
    .status-badge {
      font-size: 9.5px;
      font-weight: 800;
      padding: 3px 10px;
      border-radius: 999px;
      letter-spacing: 0.5px;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 2px;
      margin-bottom: 4px;
    }
    .details-table .lbl {
      font-size: 10px;
      color: #64748b;
      padding: 3px 4px;
      width: 22%;
      font-weight: 600;
    }
    .details-table .val {
      font-size: 10.5px;
      font-weight: 700;
      color: #0f172a;
      padding: 3px 4px;
      border-bottom: 1px solid #e2e8f0;
      width: 28%;
    }
    .summary-box {
      display: flex;
      background: #f1f5f9;
      border: 1.5px solid #cbd5e1;
      border-radius: 4px;
      padding: 6px 10px;
      text-align: center;
      margin-top: 2px;
      margin-bottom: 4px;
    }
    .summary-col {
      flex: 1;
      padding: 0 6px;
    }
    .sum-lbl {
      font-size: 9px;
      color: #475569;
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 1px;
    }
    .sum-val {
      font-size: 15px;
      font-weight: 800;
    }
    .sig-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
      margin-top: auto;
      padding-top: 2px;
    }
    .sig-col {
      text-align: center;
    }
    .sig-line {
      border-bottom: 1.5px solid #64748b;
      height: 24px;
    }
    .sig-label {
      font-size: 9px;
      color: #475569;
      margin-top: 2px;
      font-weight: 600;
    }
    @media print {
      html, body {
        width: 210mm;
        height: 297mm;
        margin: 0;
        padding: 0;
      }
      .page-container {
        width: 210mm;
        height: 297mm;
        padding: 6mm 8mm;
      }
    }
  </style>
</head>
<body>
  <div class="page-container">
    ${voucherHTML('CUSTOMER COPY', '#1e40af', '#dbeafe', '#93c5fd')}
    <div class="cut-line"><span class="cut-label">✂ &nbsp; Cut Here &mdash; Office Copy Below &nbsp; ✂</span></div>
    ${voucherHTML('OFFICE COPY', '#92400e', '#fef3c7', '#fde68a')}
  </div>
  <script>
    window.onload = function() {
      window.focus();
      window.print();
      window.onafterprint = function() { window.close(); };
    };
  <\/script>
</body>
</html>`;
}

function ReceiptPreview({ booking, copyType, badgeBg, badgeColor, badgeBorder }) {
  const remaining = (parseFloat(booking.totalPrice) || 0) - (parseFloat(booking.paidAmount) || 0);
  const receiptNo = `REC-${booking.plotId}-${booking.date?.replace(/-/g, '') || '01'}`;
  const isFullyPaid = remaining <= 0 || booking.status === 'Fully Booked';

  const paymentModeLabel = booking.paymentMode === 'Cash'
    ? '💵 Cash'
    : booking.paymentMode === 'Cheque'
    ? `🏦 Cheque ${booking.bankName ? `(${booking.bankName})` : ''}`
    : `📱 Online Transfer ${booking.bankName ? `(${booking.bankName})` : ''}`;

  const amountInWordsText = booking.amountInWords || numberToWords(booking.paidAmount);

  return (
    <div className="border-2 border-slate-900 rounded-md p-3.5 bg-white space-y-2 text-[11px] flex flex-col justify-between shadow-sm">
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-2">
        <div>
          <div className="text-xl font-black text-blue-900 tracking-tight">AHH CITY</div>
          <p className="text-[9px] text-slate-700 font-bold uppercase tracking-wider">AHH Brothers Builders & Developers</p>
          <p className="text-[8px] text-slate-500">Survey No. 297 — Master Planned Housing Scheme</p>
        </div>
        <div className="text-right">
          <span className="inline-block font-extrabold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider border"
            style={{ background: badgeBg, color: badgeColor, borderColor: badgeBorder || badgeColor }}>
            {copyType}
          </span>
          <p className="text-[9px] font-mono text-slate-700 mt-1">Receipt #: <strong className="text-slate-900">{receiptNo}</strong></p>
          <p className="text-[9px] text-slate-600">Date: <span className="font-semibold text-slate-900">{formatDateDDMMYY(booking.date)}</span></p>
          {booking.status === 'Token Received' && booking.tokenExpiryDate && (
            <p className="text-[9px] font-bold text-amber-700 font-mono mt-0.5">Token Expires: {formatDateDDMMYY(booking.tokenExpiryDate)}</p>
          )}
          {booking.installmentMonth && (
            <p className="text-[9px] font-bold text-blue-900 font-sans mt-0.5">Installment: {booking.installmentMonth}</p>
          )}
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 flex justify-between items-center">
        <div>
          <span className="text-lg font-black text-blue-950">PLOT {booking.plotId}</span>
          <span className="text-[9.5px] text-slate-600 font-bold ml-2">({booking.plotType})</span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
          isFullyPaid ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-yellow-100 text-yellow-800 border-yellow-300'
        }`}>
          {isFullyPaid ? 'FULLY BOOKED' : 'TOKEN RECEIVED'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
        {[
          ['Applicant Name', booking.clientName],
          ['Father / Husband Name', booking.relativeName || 'N/A'],
          ['CNIC', booking.cnic || 'N/A'],
          ['Contact', booking.phone || 'N/A'],
          ['Block', booking.block || 'N/A'],
          ['Payment Method', paymentModeLabel],
        ].map(([label, val]) => (
          <div key={label} className="flex justify-between border-b border-slate-100 py-0.5">
            <span className="text-slate-500 font-medium">{label}:</span>
            <span className="font-bold text-slate-900 ml-1 truncate max-w-[130px]">{val}</span>
          </div>
        ))}
        {amountInWordsText && (
          <div className="col-span-2 flex justify-between border-b border-slate-100 py-0.5">
            <span className="text-slate-500 font-medium">Amount in Words:</span>
            <span className="font-bold text-slate-900 italic">{amountInWordsText}</span>
          </div>
        )}
      </div>

      <div className="bg-slate-100 border border-slate-300 text-slate-900 rounded p-2 grid grid-cols-3 gap-2 text-center text-[10px]">
        <div className="border-r border-slate-300 pr-1">
          <div className="text-slate-500 text-[8.5px] uppercase font-bold">Total Price</div>
          <div className="font-extrabold text-slate-900">Rs {parseInt(booking.totalPrice || 0).toLocaleString()}</div>
        </div>
        <div className="border-r border-slate-300 pr-1">
          <div className="text-slate-500 text-[8.5px] uppercase font-bold">Total Paid</div>
          <div className="font-extrabold text-emerald-700">Rs {parseInt(booking.paidAmount || 0).toLocaleString()}</div>
        </div>
        <div>
          <div className="text-slate-500 text-[8.5px] uppercase font-bold">Remaining</div>
          <div className={`font-extrabold ${remaining > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
            {remaining <= 0 ? 'Rs 0 (FULLY PAID)' : `Rs ${parseInt(remaining).toLocaleString()}`}
          </div>
        </div>
      </div>

      <div className="pt-1 grid grid-cols-3 gap-4 text-center text-[9.5px]">
        <div><div className="border-b border-slate-400 min-h-[20px]"></div><span className="text-slate-600 font-semibold">Accounts Signature</span></div>
        <div><div className="border-b border-slate-400 min-h-[20px]"></div><span className="text-slate-600 font-semibold">Manager Signature</span></div>
        <div><div className="border-b border-slate-400 min-h-[20px]"></div><span className="text-slate-600 font-semibold">Authorized Signature</span></div>
      </div>
    </div>
  );
}

export default function BookingReceiptModal({ booking, onSaveBooking, onDeleteBooking, onClose }) {
  const [editExpiryMode, setEditExpiryMode] = useState(false);
  const [newExpiryInput, setNewExpiryInput] = useState(booking?.tokenExpiryDate || '');

  if (!booking) return null;

  const expiryInfo = booking.status === 'Token Received' ? getExpiryStatus(booking.tokenExpiryDate) : null;

  const handlePrint = () => {
    const html = buildReceiptHTML(booking);
    const printWindow = window.open('', '_blank', 'width=850,height=1050,toolbar=0,scrollbars=1,status=0');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
    }
  };

  const handleUpdateExpiryDate = () => {
    if (!newExpiryInput) return;
    const updated = { ...booking, tokenExpiryDate: newExpiryInput };
    if (onSaveBooking) onSaveBooking(updated);
    setEditExpiryMode(false);
  };

  const handleCancelToken = () => {
    if (confirm(`Cancel token entry for Plot #${booking.plotId}? The yellow plot color will vanish on the map canvas and count as an Available plot again.`)) {
      if (onDeleteBooking) onDeleteBooking(booking.plotId);
      onClose();
    }
  };

  const handleMarkFullyBooked = () => {
    if (confirm(`Mark Plot #${booking.plotId} as Fully Booked? The plot color will turn GREEN on the map canvas.`)) {
      const updated = {
        ...booking,
        status: 'Fully Booked',
        paidAmount: booking.totalPrice,
        tokenExpiryDate: ''
      };
      if (onSaveBooking) onSaveBooking(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md flex justify-center items-start">
      <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative my-auto">

        {/* Top Action Header */}
        <div className="flex justify-between items-center pb-3 mb-4 border-b border-slate-200 gap-2">
          <button type="button" onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" /><span>Return to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handlePrint}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition-all shadow-md cursor-pointer">
              <Printer className="w-4 h-4" /><span>Print A4 (2 Copies)</span>
            </button>
            <button type="button" onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer font-bold transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOKEN EXPIRY ALERTS & ACTIONS */}
        {booking.status === 'Token Received' && (
          <div className="mb-4 space-y-2">
            {expiryInfo?.isExpiringSoon && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between gap-2 shadow-sm">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Token will be expired tomorrow.</span>
                </div>
                <span className="text-[11px] font-mono font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  Expires: {formatDateDDMMYY(booking.tokenExpiryDate)}
                </span>
              </div>
            )}

            {expiryInfo?.isExpired && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs flex flex-col gap-2 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-red-800">
                  <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
                  <span>TOKEN EXPIRED — Please enter a new expiry date or cancel the token.</span>
                </div>
                <div className="text-[11px] text-red-700">
                  Expired on: <strong>{formatDateDDMMYY(booking.tokenExpiryDate)}</strong>. If cancelled, the plot color will vanish and count in available plots again. If customer paid remaining booking amount, mark as Fully Booked to turn green.
                </div>
              </div>
            )}

            {/* EXPIRY MANAGEMENT BUTTON BAR */}
            <div className="p-3 rounded-xl bg-slate-900 text-white text-xs space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
                  <Calendar className="w-4 h-4" />
                  <span>Token Expires On: {formatDateDDMMYY(booking.tokenExpiryDate)}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => setEditExpiryMode(!editExpiryMode)}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors">
                    <Calendar className="w-3.5 h-3.5 text-yellow-400" />
                    <span>{editExpiryMode ? 'Cancel Edit' : 'Edit Expiry Date'}</span>
                  </button>
                  <button type="button" onClick={handleMarkFullyBooked}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Paid & Fully Booked (Turn Green)</span>
                  </button>
                  <button type="button" onClick={handleCancelToken}
                    className="px-3 py-1 rounded-lg bg-red-950 border border-red-800/80 hover:bg-red-900 text-red-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Cancel Token (Vanish Plot Color)</span>
                  </button>
                </div>
              </div>

              {editExpiryMode && (
                <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="date"
                    value={newExpiryInput}
                    onChange={(e) => setNewExpiryInput(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-yellow-500"
                  />
                  <button type="button" onClick={handleUpdateExpiryDate}
                    className="px-4 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors">
                    Save New Expiry Date
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 text-center font-semibold">
          Preview — Both copies will print on 1 A4 sheet
        </p>

        <div className="space-y-2">
          <ReceiptPreview booking={booking} copyType="CUSTOMER COPY" badgeBg="#dbeafe" badgeColor="#1e40af" />
          <div className="relative flex items-center justify-center border-t-2 border-dashed border-slate-300 my-1">
            <span className="absolute bg-white px-3 text-[9.5px] text-slate-400 font-mono uppercase tracking-wider">
              ✂ Cut Here for Office Records ✂
            </span>
          </div>
          <ReceiptPreview booking={booking} copyType="OFFICE COPY" badgeBg="#fef3c7" badgeColor="#92400e" />
        </div>

        <div className="pt-4 mt-4 border-t border-slate-200 flex justify-between items-center">
          <button type="button" onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors">
            <ArrowLeft className="w-4 h-4" /><span>Return to Dashboard</span>
          </button>
          <button type="button" onClick={handlePrint}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-1.5 rounded-xl transition-all shadow-md cursor-pointer">
            <Printer className="w-4 h-4" /><span>Print Both Copies</span>
          </button>
        </div>
      </div>
    </div>
  );
}

