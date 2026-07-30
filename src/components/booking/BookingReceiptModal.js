// src/components/booking/BookingReceiptModal.js
'use client';

import React from 'react';
import { ArrowLeft, X, Printer } from 'lucide-react';

// Build raw HTML string for the printable receipt (no React, pure HTML+CSS)
function buildReceiptHTML(booking) {
  const remaining = (parseFloat(booking.totalPrice) || 0) - (parseFloat(booking.paidAmount) || 0);
  const receiptNo = `REC-${booking.plotId}-${booking.date?.replace(/-/g, '') || '01'}`;
  const statusLabel = booking.status === 'Fully Booked' ? 'FULLY BOOKED' : 'TOKEN RECEIVED';
  const statusColor = booking.status === 'Fully Booked' ? '#16a34a' : '#ca8a04';
  const statusBg = booking.status === 'Fully Booked' ? '#dcfce7' : '#fef9c3';

  const voucherHTML = (copyType, badgeColor, badgeBg) => `
    <div class="voucher">
      <!-- Header -->
      <div class="section-header">
        <div>
          <div class="brand-name">AHH CITY</div>
          <div class="brand-sub">AHH Brothers Builders &amp; Developers</div>
          <div class="brand-tagline">Survey No. 297 &mdash; Master Planned Gated Housing Scheme</div>
        </div>
        <div style="text-align:right;">
          <span class="copy-badge" style="background:${badgeBg};color:${badgeColor};border:1.5px solid ${badgeColor};">${copyType}</span>
          <div class="receipt-meta">Receipt #: <strong>${receiptNo}</strong></div>
          <div class="receipt-meta" style="color:#94a3b8;">Date: <strong style="color:#1e293b;">${booking.date || 'N/A'}</strong></div>
        </div>
      </div>

      <!-- Plot & Status -->
      <div class="plot-row">
        <div>
          <span class="plot-id">Plot ${booking.plotId}</span>
          <span class="plot-type">(${booking.plotType || 'N/A'})</span>
        </div>
        <span class="status-badge" style="background:${statusBg};color:${statusColor};border:1.5px solid ${statusColor};">${statusLabel}</span>
      </div>

      <!-- Applicant Details -->
      <table class="info-table">
        <tr>
          <td class="label">Applicant Name:</td>
          <td class="value">${booking.clientName || 'N/A'}</td>
          <td class="label" style="padding-left:20px;">Father / Husband Name:</td>
          <td class="value">${booking.relativeName || 'N/A'}</td>
        </tr>
        <tr>
          <td class="label">CNIC Number:</td>
          <td class="value" style="font-family:monospace;">${booking.cnic || 'N/A'}</td>
          <td class="label" style="padding-left:20px;">Contact No:</td>
          <td class="value">${booking.phone || 'N/A'}</td>
        </tr>
        <tr>
          <td class="label">Block:</td>
          <td class="value">${booking.block || 'N/A'}</td>
          <td class="label" style="padding-left:20px;">Email:</td>
          <td class="value">${booking.email || 'N/A'}</td>
        </tr>
      </table>

      <!-- Financial Summary -->
      <div class="finance-box">
        <div class="finance-col" style="border-right:1px solid #334155;">
          <div class="finance-label">Total Price</div>
          <div class="finance-value" style="color:#fff;">Rs ${parseInt(booking.totalPrice || 0).toLocaleString()}</div>
        </div>
        <div class="finance-col" style="border-right:1px solid #334155;">
          <div class="finance-label">${booking.paymentMode === 'Cash' ? 'Received Cash' : `${booking.paymentMode} — ${booking.bankName || 'N/A'}`}</div>
          <div class="finance-value" style="color:#4ade80;">Rs ${parseInt(booking.paidAmount || 0).toLocaleString()}</div>
        </div>
        <div class="finance-col">
          <div class="finance-label">Remaining Balance</div>
          <div class="finance-value" style="color:${remaining > 0 ? '#facc15' : '#94a3b8'};">Rs ${parseInt(remaining).toLocaleString()}</div>
        </div>
      </div>

      <!-- Signatures -->
      <div class="sig-row">
        <div class="sig-block"><div class="sig-line"></div><div class="sig-label">Accounts</div></div>
        <div class="sig-block"><div class="sig-line"></div><div class="sig-label">Manager</div></div>
        <div class="sig-block"><div class="sig-line"></div><div class="sig-label">Approved By</div></div>
      </div>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>AHH CITY Booking Receipt</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: A4 portrait; margin: 8mm 10mm; }
    html, body { width: 210mm; height: 297mm; background: #fff; font-family: Arial, Helvetica, sans-serif; }
    .page { width: 100%; height: 297mm; display: flex; flex-direction: column; padding: 4mm 6mm; }
    .voucher { flex: 1; display: flex; flex-direction: column; border: 2px solid #cbd5e1; border-radius: 10px; padding: 16px 20px; background: #fff; gap: 10px; }
    .cut-line { flex-shrink: 0; display: flex; align-items: center; justify-content: center; position: relative; height: 18px; margin: 3mm 0; }
    .cut-line::before { content: ''; position: absolute; left: 0; right: 0; border-top: 2px dashed #94a3b8; }
    .cut-label { position: relative; background: #fff; padding: 0 12px; font-size: 10px; color: #94a3b8; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px; z-index: 1; }
    .section-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5px solid #1e293b; padding-bottom: 10px; }
    .brand-name { font-size: 26px; font-weight: 900; color: #1e3a8a; letter-spacing: -0.5px; line-height: 1; }
    .brand-sub { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 3px; }
    .brand-tagline { font-size: 10px; color: #94a3b8; margin-top: 2px; }
    .copy-badge { display: inline-block; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
    .receipt-meta { font-size: 10px; color: #64748b; margin-top: 5px; font-family: monospace; }
    .plot-row { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 10px 16px; }
    .plot-id { font-size: 26px; font-weight: 900; color: #1e3a8a; }
    .plot-type { font-size: 12px; color: #64748b; font-weight: 600; margin-left: 10px; }
    .status-badge { font-size: 11px; font-weight: 800; padding: 5px 14px; border-radius: 999px; }
    .info-table { width: 100%; border-collapse: collapse; }
    .info-table .label { font-size: 11px; color: #64748b; padding: 5px 6px; width: 24%; }
    .info-table .value { font-size: 11px; font-weight: 700; color: #0f172a; padding: 5px 6px; text-align: right; border-bottom: 1px solid #f1f5f9; width: 26%; }
    .finance-box { display: flex; background: #0f172a; color: #fff; border-radius: 10px; padding: 14px 16px; text-align: center; }
    .finance-col { flex: 1; padding: 0 10px; }
    .finance-label { font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 5px; }
    .finance-value { font-size: 18px; font-weight: 800; }
    .sig-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-top: auto; padding-top: 8px; }
    .sig-block { text-align: center; }
    .sig-line { border-bottom: 1.5px solid #94a3b8; height: 36px; }
    .sig-label { font-size: 10px; color: #64748b; margin-top: 4px; }
    @media print { html, body { margin: 0; } .page { padding: 0; } }
  </style>
</head>
<body>
  <div class="page">
    ${voucherHTML('CUSTOMER COPY', '#1e40af', '#dbeafe')}
    <div class="cut-line"><span class="cut-label">✂ &nbsp; Cut Here — Office Copy Below &nbsp; ✂</span></div>
    ${voucherHTML('OFFICE COPY', '#713f12', '#fef3c7')}
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

function ReceiptPreview({ booking, copyType, badgeBg, badgeColor }) {
  const remaining = (parseFloat(booking.totalPrice) || 0) - (parseFloat(booking.paidAmount) || 0);
  const receiptNo = `REC-${booking.plotId}-${booking.date?.replace(/-/g, '') || '01'}`;

  return (
    <div className="border border-slate-300 rounded-xl p-3.5 bg-white space-y-2 text-[11px]">
      <div className="flex justify-between items-start border-b border-slate-800 pb-2">
        <div>
          <div className="text-lg font-black text-blue-900 tracking-tight">AHH CITY</div>
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">AHH Brothers Builders & Developers</p>
        </div>
        <div className="text-right">
          <span className="inline-block font-extrabold text-[9px] px-2.5 py-0.5 rounded uppercase tracking-wider border"
            style={{ background: badgeBg, color: badgeColor, borderColor: badgeColor }}>
            {copyType}
          </span>
          <p className="text-[9px] font-mono text-slate-600 mt-1">Receipt #: <strong className="text-slate-900">{receiptNo}</strong></p>
          <p className="text-[9px] text-slate-500">Date: <span className="font-semibold text-slate-800">{booking.date}</span></p>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex justify-between items-center">
        <div>
          <span className="text-base font-black text-blue-950">Plot {booking.plotId}</span>
          <span className="text-[9px] text-slate-600 font-semibold ml-2">({booking.plotType})</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
          booking.status === 'Fully Booked' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-yellow-100 text-yellow-800 border-yellow-300'
        }`}>
          {booking.status === 'Fully Booked' ? 'FULLY BOOKED' : 'TOKEN RECEIVED'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px]">
        {[
          ['Applicant Name', booking.clientName],
          ['Father / Husband Name', booking.relativeName || 'N/A'],
          ['CNIC', booking.cnic || 'N/A'],
          ['Contact', booking.phone || 'N/A'],
          ['Block', booking.block || 'N/A'],
          ['Email', booking.email || 'N/A'],
        ].map(([label, val]) => (
          <div key={label} className="flex justify-between border-b border-slate-100 py-0.5">
            <span className="text-slate-500">{label}:</span>
            <span className="font-bold text-slate-900 ml-1 truncate max-w-[100px]">{val}</span>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 text-white rounded-lg p-2 grid grid-cols-3 gap-2 text-center text-[9.5px]">
        <div className="border-r border-slate-700 pr-1">
          <div className="text-slate-400 text-[8.5px] uppercase font-semibold">Total</div>
          <div className="font-bold text-white">Rs {parseInt(booking.totalPrice || 0).toLocaleString()}</div>
        </div>
        <div className="border-r border-slate-700 pr-1">
          <div className="text-slate-400 text-[8.5px] uppercase font-semibold">
            {booking.paymentMode === 'Cash' ? 'Received Cash' : `${booking.paymentMode} — ${booking.bankName || 'N/A'}`}
          </div>
          <div className="font-bold text-emerald-400">Rs {parseInt(booking.paidAmount || 0).toLocaleString()}</div>
        </div>
        <div>
          <div className="text-slate-400 text-[8.5px] uppercase font-semibold">Remaining</div>
          <div className={`font-bold ${remaining > 0 ? 'text-yellow-400' : 'text-slate-400'}`}>Rs {parseInt(remaining).toLocaleString()}</div>
        </div>
      </div>

      <div className="pt-1 grid grid-cols-3 gap-4 text-center text-[9.5px]">
        <div><div className="border-b border-slate-400 min-h-[18px]"></div><span className="text-slate-500">Accounts</span></div>
        <div><div className="border-b border-slate-400 min-h-[18px]"></div><span className="text-slate-500">Manager</span></div>
        <div><div className="border-b border-slate-400 min-h-[18px]"></div><span className="text-slate-500">Approved By</span></div>
      </div>
    </div>
  );
}

export default function BookingReceiptModal({ booking, onClose }) {
  if (!booking) return null;

  const handlePrint = () => {
    const html = buildReceiptHTML(booking);
    const printWindow = window.open('', '_blank', 'width=850,height=1050,toolbar=0,scrollbars=1,status=0');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md flex justify-center items-start">
      <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative my-auto">

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
