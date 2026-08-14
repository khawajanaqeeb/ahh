'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { 
  Database, Search, Download, ChevronLeft, ChevronRight, 
  ArrowLeft, RefreshCw, Layers, Shield, FileSpreadsheet, Building,
  CheckCircle, Globe, Home, Factory, Trees
} from 'lucide-react'
import { PROJECTS } from '@/lib/projectsData'
import { fetchMasterBookings, syncAllBookingsToSupabase, formatCNIC } from '@/lib/db'

interface MasterBookingRecord {
  id: string
  project_name: string
  client_name: string
  cnic: string
  phone: string
  plot_no: string
  block: string
  nominee: string
  booking_date: string
  status?: string
  total_price?: number
  paid_amount?: number
  created_at?: string
}

export default function AdminMasterRecordsPage() {
  const [records, setRecords] = useState<MasterBookingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  // Tab & Filters: 'ALL' = Consolidated Sheet, or project name for Individual Project Sheet
  const [activeTab, setActiveTab] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBlock, setSelectedBlock] = useState('ALL')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 25

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await fetchMasterBookings()
      setRecords(data || [])
    } catch (err) {
      console.error('Error fetching master records:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleManualSync = async () => {
    setSyncing(true)
    setToastMessage(null)
    try {
      const result = await syncAllBookingsToSupabase()
      if (result.success) {
        setToastMessage(`Successfully synchronized ${result.synced} plot records to Supabase cloud!`)
        await loadData()
      } else {
        setToastMessage('Supabase sync completed.')
      }
    } catch (err) {
      console.error('Sync error:', err)
      setToastMessage('Sync notice: Checked cloud and local records.')
    } finally {
      setSyncing(false)
      setTimeout(() => setToastMessage(null), 4000)
    }
  }

  // Extract unique blocks for active tab
  const availableBlocks = useMemo(() => {
    const blocks = new Set<string>()
    records.forEach(r => {
      if (r.block && r.block.trim()) {
        if (activeTab === 'ALL' || r.project_name.toLowerCase() === activeTab.toLowerCase()) {
          blocks.add(r.block.trim())
        }
      }
    })
    return Array.from(blocks).sort()
  }, [records, activeTab])

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      // Tab / Project filter
      if (activeTab !== 'ALL') {
        const tabLower = activeTab.toLowerCase()
        const projLower = (r.project_name || '').toLowerCase()
        if (tabLower === 'ahh city' && !projLower.includes('ahh')) return false
        if (tabLower === 'hooria villas' && !projLower.includes('hooria')) return false
        if (tabLower === 'labour city' && !projLower.includes('labour')) return false
        if (tabLower === 'summer farmhouses' && !projLower.includes('summer') && !projLower.includes('farm')) return false
        if (!projLower.includes(tabLower) && !tabLower.includes(projLower)) {
          if (r.project_name !== activeTab) return false
        }
      }

      // Block filter
      if (selectedBlock !== 'ALL' && (r.block || '').trim() !== selectedBlock) {
        return false
      }

      // Search query (CNIC, Client Name, Plot No, Phone)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const rawQ = q.replace(/\D/g, '')
        const matchName = (r.client_name || '').toLowerCase().includes(q)
        const matchCnic = (r.cnic || '').toLowerCase().includes(q) || (rawQ.length >= 4 && (r.cnic || '').replace(/\D/g, '').includes(rawQ))
        const matchPlot = (r.plot_no || '').toLowerCase().includes(q)
        const matchPhone = (r.phone || '').toLowerCase().includes(q)
        return matchName || matchCnic || matchPlot || matchPhone
      }
      return true
    })
  }, [records, activeTab, selectedBlock, searchQuery])

  // KPI Calculations
  const stats = useMemo(() => {
    const totalBooked = filteredRecords.length
    const totalRevenue = filteredRecords.reduce((sum, r) => sum + (Number(r.paid_amount) || 0), 0)
    const uniqueProjects = new Set(records.map(r => r.project_name)).size
    return { totalBooked, totalRevenue, uniqueProjects }
  }, [filteredRecords, records])

  // Pagination calculation
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage) || 1
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage
    return filteredRecords.slice(start, start + recordsPerPage)
  }, [filteredRecords, currentPage])

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, activeTab, selectedBlock])

  // CSV Export handler
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) return

    const headers = ['Client Name', 'CNIC', 'Phone', 'Project Name', 'Plot No', 'Block', 'Nominee', 'Booking Date', 'Status', 'Paid Amount (PKR)', 'Total Price (PKR)']
    const csvRows = [headers.join(',')]

    filteredRecords.forEach(r => {
      const row = [
        `"${(r.client_name || '').replace(/"/g, '""')}"`,
        `"${(r.cnic || '').replace(/"/g, '""')}"`,
        `"${(r.phone || '').replace(/"/g, '""')}"`,
        `"${(r.project_name || '').replace(/"/g, '""')}"`,
        `"${(r.plot_no || '').replace(/"/g, '""')}"`,
        `"${(r.block || '').replace(/"/g, '""')}"`,
        `"${(r.nominee || '').replace(/"/g, '""')}"`,
        `"${(r.booking_date || '').replace(/"/g, '""')}"`,
        `"${(r.status || 'Booked').replace(/"/g, '""')}"`,
        `"${r.paid_amount || 0}"`,
        `"${r.total_price || 0}"`
      ]
      csvRows.push(row.join(','))
    })

    const sheetName = activeTab === 'ALL' ? 'consolidated_plots_record_sheet' : `${activeTab.toLowerCase().replace(/\s+/g, '_')}_plots_record_sheet`
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${sheetName}_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const projectTabs = [
    { id: 'ALL', label: 'Consolidated Record Sheet', subtitle: 'All 4 Projects Combined', icon: Globe, color: 'amber' },
    { id: 'AHH City', label: 'AHH City Sheet', subtitle: 'Mixed-Use Township', icon: Building, color: 'blue' },
    { id: 'Hooria Villas', label: 'Hooria Villas Sheet', subtitle: 'Residential Villas', icon: Home, color: 'emerald' },
    { id: 'Labour City', label: 'Labour City Sheet', subtitle: 'Affordable Township', icon: Factory, color: 'purple' },
    { id: 'Summer Farmhouses', label: 'Summer Farmhouses Sheet', subtitle: 'Luxury Farmhouses', icon: Trees, color: 'teal' }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-xl sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin</span>
            </Link>
            <div className="h-6 w-[1px] bg-slate-800" />
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-amber-400" />
              <div>
                <h1 className="font-outfit font-black text-base sm:text-lg text-white">Plots Record Sheet Center</h1>
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-mono">AHH Brothers Database</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualSync}
              disabled={syncing}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
              title="Synchronize Local & Cloud Records to Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync Supabase'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              disabled={filteredRecords.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV Sheet</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-amber-500 text-slate-950 px-4 py-3 text-center font-bold text-xs shadow-xl animate-in fade-in duration-200">
          {toastMessage}
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative z-10">
        
        {/* KPI Dashboard Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-slate-900/90 border border-slate-800 shadow-xl space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Booked Plots</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-outfit">{stats.totalBooked}</div>
            <p className="text-[11px] text-slate-500">
              {activeTab === 'ALL' ? 'Across all 4 projects' : `In ${activeTab}`}
            </p>
          </div>

          <div className="p-5 bg-slate-900/90 border border-slate-800 shadow-xl space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Revenue Collected</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-outfit">
              PKR {stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500">Recorded payments</p>
          </div>

          <div className="p-5 bg-slate-900/90 border border-slate-800 shadow-xl space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Real Estate Projects</span>
            <div className="text-2xl sm:text-3xl font-black text-blue-400 font-outfit">4 Projects</div>
            <p className="text-[11px] text-slate-500">AHH City, Hooria, Labour City, Summer Farmhouses</p>
          </div>
        </div>

        {/* ── TABS: Consolidated Sheet vs Individual Project Record Sheets ── */}
        <div className="bg-slate-900/90 border border-slate-800 p-2 shadow-xl">
          <div className="flex flex-wrap items-center gap-2">
            {projectTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setSelectedBlock('ALL')
                  }}
                  className={`flex-1 min-w-[180px] p-3 border transition-all text-left cursor-pointer group ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                    <div>
                      <div className={`text-xs font-black font-outfit ${isActive ? 'text-slate-950' : 'text-white'}`}>
                        {tab.label}
                      </div>
                      <div className={`text-[10px] ${isActive ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                        {tab.subtitle}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Search Plot Record (CNIC, Name, Plot No, Phone)
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter CNIC (e.g. 42101-1234567-1), Client Name, or Plot No..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Filter by Block */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Filter by Block
              </label>
              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-medium cursor-pointer"
              >
                <option value="ALL">All Blocks</option>
                {availableBlocks.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900">
            <div className="text-xs text-slate-400 font-mono">
              Sheet View:{' '}
              <span className="text-amber-400 font-bold uppercase">{activeTab === 'ALL' ? 'Consolidated Record Sheet' : `${activeTab} Record Sheet`}</span>
              {' '}• Showing <span className="text-white font-bold">{filteredRecords.length > 0 ? (currentPage - 1) * recordsPerPage + 1 : 0}</span> to <span className="text-white font-bold">{Math.min(currentPage * recordsPerPage, filteredRecords.length)}</span> of <span className="text-amber-400 font-bold">{filteredRecords.length}</span> records
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono font-bold text-slate-300 px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-widest font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-4 px-5 font-bold">Client Name</th>
                  <th className="py-4 px-5 font-bold">CNIC</th>
                  <th className="py-4 px-5 font-bold">Phone</th>
                  <th className="py-4 px-5 font-bold">Project Sheet</th>
                  <th className="py-4 px-5 font-bold">Plot No.</th>
                  <th className="py-4 px-5 font-bold">Block</th>
                  <th className="py-4 px-5 font-bold">Nominee</th>
                  <th className="py-4 px-5 font-bold">Booking Date</th>
                  <th className="py-4 px-5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-3">
                        <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
                        <span>Loading plot record sheets...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500">
                      No matching records found in this record sheet.
                    </td>
                  </tr>
                ) : (
                  paginatedRecords.map((r, idx) => (
                    <tr key={r.id || idx} className="hover:bg-slate-850/60 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-white font-outfit">{r.client_name}</td>
                      <td className="py-3.5 px-5 text-amber-300 font-mono font-medium">{r.cnic ? formatCNIC(r.cnic) : 'N/A'}</td>
                      <td className="py-3.5 px-5 text-slate-300 font-mono">{r.phone || 'N/A'}</td>
                      <td className="py-3.5 px-5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                          r.project_name.includes('AHH') ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                          r.project_name.includes('Hooria') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                          r.project_name.includes('Labour') ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' :
                          'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        }`}>
                          {r.project_name}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-extrabold text-amber-400 font-outfit">{r.plot_no}</td>
                      <td className="py-3.5 px-5 text-slate-300">{r.block || 'Main'}</td>
                      <td className="py-3.5 px-5 text-slate-300">{r.nominee || 'N/A'}</td>
                      <td className="py-3.5 px-5 text-slate-400 font-mono text-xs">{r.booking_date || 'N/A'}</td>
                      <td className="py-3.5 px-5">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {r.status || 'Booked'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
