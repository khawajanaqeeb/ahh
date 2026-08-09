'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Search, Printer, IdCard, Building, Shield, CheckCircle2, 
  AlertCircle, Loader2, ArrowLeft, RefreshCw, FileText
} from 'lucide-react'
import { MEDIA } from '@/lib/media'
import { fetchMasterBookings, formatCNIC } from '@/lib/db'

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

export default function MyPlotsPage() {
  const [cnicInput, setCnicInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<BookingRecord[]>([])

  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (raw.length <= 13) {
      let formatted = raw
      if (raw.length > 5 && raw.length <= 12) {
        formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`
      } else if (raw.length > 12) {
        formatted = `${raw.slice(0, 5)}-${raw.slice(5, 12)}-${raw.slice(12)}`
      }
      setCnicInput(formatted)
      setError(null)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const digitsOnly = cnicInput.replace(/\D/g, '')
    if (digitsOnly.length !== 13) {
      setError('Please enter a valid 13-digit CNIC number (e.g. 42101-1234567-1).')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await fetchMasterBookings(cnicInput)
      setResults(data || [])
      setSearched(true)
    } catch (err) {
      console.error('Search error:', err)
      setError('An error occurred while fetching your plot bookings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32 space-y-10">
        
        {/* Header Banner */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <IdCard className="w-4 h-4" />
            <span>Client Booking Portal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-outfit tracking-tight">
            My Booked Plots
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Enter your 13-digit CNIC number to search and view your registered plot records across all AHH Brothers projects.
          </p>
        </div>

        {/* Search Card */}
        <div className="max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 rounded-none p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300">
                CNIC Number
              </label>
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

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-none p-4 flex items-center justify-center gap-3 text-center">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-xs sm:text-sm text-red-400 font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-5 px-8 rounded-none bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-base shadow-xl shadow-amber-950/20 transition-all transform active:scale-[0.98] uppercase tracking-wider cursor-pointer min-h-[60px]"
            >
              {loading ? (
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

        {/* Results Section */}
        {searched && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-outfit">
                  Search Results ({results.length})
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Showing records matching CNIC: <span className="text-amber-400 font-bold">{cnicInput}</span>
                </p>
              </div>

              {results.length > 0 && (
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-none bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 hover:text-amber-300 text-xs font-bold transition-all shadow-md cursor-pointer print:hidden"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Search Statement</span>
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <div className="p-12 rounded-none bg-slate-900/60 border border-slate-800 text-center space-y-4 max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-none bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-outfit">No Bookings Found</h3>
                  <p className="text-xs text-slate-400">
                    No bookings found for this CNIC ({cnicInput}). Please check the number or contact customer support for assistance.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/90 border border-slate-800 rounded-none overflow-hidden shadow-2xl">
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
                        <tr key={item.id || idx} className="hover:bg-slate-850/60 transition-colors">
                          <td className="py-4 px-5 font-bold text-slate-500 font-mono">{idx + 1}</td>
                          <td className="py-4 px-5 font-bold text-white font-outfit">{item.client_name}</td>
                          <td className="py-4 px-5 text-slate-300 font-mono">{item.phone || 'N/A'}</td>
                          <td className="py-4 px-5">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300">
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

      </main>
    </div>
  )
}
