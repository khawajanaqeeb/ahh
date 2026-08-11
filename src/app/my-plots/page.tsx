'use client'

import React, { useState, useCallback } from 'react'
import {
  IdCard, Search, Printer, FileText, Loader2, AlertCircle, RefreshCw
} from 'lucide-react'
import { fetchMasterBookings, formatCNIC } from '@/lib/db'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface BookingRecord {
  id: string
  project_name: string
  client_name: string
  cnic: string
  phone: string
  plot_no: string
  block: string
  nominee: string
  booking_date: string
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function MyPlotsPage() {
  // Plot search state
  const [cnicInput, setCnicInput] = useState('')
  const [results, setResults] = useState<BookingRecord[]>([])
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  // ─── Plot search ────────────────────────────────────────────────────────────

  const runSearch = useCallback(async (cnic: string) => {
    const digits = cnic.replace(/\D/g, '')
    if (digits.length !== 13) return

    setSearching(true)
    setSearchError(null)
    try {
      const data = await fetchMasterBookings(cnic)
      setResults(data || [])
      setSearched(true)
    } catch (err) {
      console.error('Search error:', err)
      setSearchError('An error occurred while fetching your plot bookings. Please try again.')
    } finally {
      setSearching(false)
    }
  }, [])

  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (raw.length <= 13) {
      let formatted = raw
      if (raw.length > 12) formatted = `${raw.slice(0, 5)}-${raw.slice(5, 12)}-${raw.slice(12)}`
      else if (raw.length > 5) formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`
      setCnicInput(formatted)
      setSearchError(null)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const digits = cnicInput.replace(/\D/g, '')
    if (digits.length !== 13) {
      setSearchError('Please enter a valid 13-digit CNIC number.')
      return
    }
    runSearch(cnicInput)
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 flex flex-col items-center">

      <div className="max-w-2xl w-full px-4 sm:px-6">

        {/* ── Header Banner ── */}
        <div className="text-center space-y-4 pt-32 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <IdCard className="w-4 h-4" />
            <span>Client Booking Portal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-outfit tracking-tight">
            My Booked Plots
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Enter your CNIC to view your registered plot records across all AHH Brothers projects.
          </p>
        </div>

        {/* ── CNIC Search Card ── */}
        <div className="space-y-6 pb-16">
          <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl">
            <div className="space-y-1">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Search by CNIC</h2>
              <p className="text-xs text-slate-500">
                Enter your 13-digit National Identity Card number to find your booked plots.
              </p>
            </div>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <IdCard className="h-6 w-6 text-amber-500/80" />
                  </div>
                  <input
                    type="text"
                    required
                    value={cnicInput}
                    onChange={handleCnicChange}
                    maxLength={15}
                    placeholder="XXXXX-XXXXXXX-X"
                    className="block w-full pl-14 pr-5 py-5 bg-slate-950 border border-slate-800 rounded-none text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all text-lg font-mono text-center font-bold tracking-widest min-h-[60px]"
                  />
                </div>
                <p className="text-[11px] text-slate-500 text-center">Format: 42101-1234567-1</p>
              </div>

              {searchError && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 flex items-center justify-center gap-3 text-center">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <p className="text-xs sm:text-sm text-red-400 font-medium">{searchError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={searching}
                id="my-plots-search-btn"
                className="w-full flex items-center justify-center gap-3 py-5 px-8 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-base shadow-xl shadow-amber-950/20 transition-all transform active:scale-[0.98] uppercase tracking-wider cursor-pointer min-h-[60px] disabled:opacity-60"
              >
                {searching ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Search Booked Plots</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          {searched && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-outfit">
                    Search Results ({results.length})
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Showing records matching CNIC:{' '}
                    <span className="text-amber-400 font-bold">{formatCNIC(cnicInput)}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 print:hidden">
                  <button
                    onClick={() => runSearch(cnicInput)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                  </button>
                  {results.length > 0 && (
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 hover:text-amber-300 text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Statement</span>
                    </button>
                  )}
                </div>
              </div>

              {results.length === 0 ? (
                <div className="p-12 bg-slate-900/60 border border-slate-800 text-center space-y-4">
                  <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white font-outfit">No Bookings Found</h3>
                    <p className="text-xs text-slate-400">
                      No plot bookings found for CNIC{' '}
                      <span className="text-amber-400 font-mono font-bold">{cnicInput}</span>.
                      Please verify the number or contact our support team.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                      <thead className="bg-slate-950 text-slate-400 uppercase tracking-widest font-mono text-[11px] border-b border-slate-800">
                        <tr>
                          <th className="py-4 px-5 font-bold">#</th>
                          <th className="py-4 px-5 font-bold">Client Name</th>
                          <th className="py-4 px-5 font-bold">Phone</th>
                          <th className="py-4 px-5 font-bold">Project</th>
                          <th className="py-4 px-5 font-bold">Plot No.</th>
                          <th className="py-4 px-5 font-bold">Block</th>
                          <th className="py-4 px-5 font-bold">Nominee</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {results.map((item, idx) => (
                          <tr key={item.id || idx} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-4 px-5 font-bold text-slate-500 font-mono">{idx + 1}</td>
                            <td className="py-4 px-5 font-bold text-white font-outfit">{item.client_name}</td>
                            <td className="py-4 px-5 text-slate-300 font-mono">{item.phone || 'N/A'}</td>
                            <td className="py-4 px-5">
                              <span className="px-2.5 py-1 text-[11px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300">
                                {item.project_name}
                              </span>
                            </td>
                            <td className="py-4 px-5 font-extrabold text-amber-400 font-outfit">{item.plot_no}</td>
                            <td className="py-4 px-5 text-slate-300">{item.block || 'Main'}</td>
                            <td className="py-4 px-5 text-slate-300">{item.nominee || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
