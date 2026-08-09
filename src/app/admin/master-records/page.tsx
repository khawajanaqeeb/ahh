'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Database, Search, Download, Filter, ChevronLeft, ChevronRight, 
  ArrowLeft, RefreshCw, Layers, Shield, FileSpreadsheet, Building 
} from 'lucide-react'
import { MEDIA } from '@/lib/media'
import { PROJECTS } from '@/lib/projectsData'
import { fetchMasterBookings } from '@/lib/db'
import { logout } from '@/app/login/actions'

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
  created_at: string
}

export default function AdminMasterRecordsPage() {
  const [records, setRecords] = useState<MasterBookingRecord[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState('ALL')
  const [selectedBlock, setSelectedBlock] = useState('ALL')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 25

  useEffect(() => {
    async function loadData() {
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
    loadData()
  }, [])

  // Extract unique blocks for dropdown
  const availableBlocks = useMemo(() => {
    const blocks = new Set<string>()
    records.forEach(r => {
      if (r.block && r.block.trim()) {
        if (selectedProject === 'ALL' || r.project_name === selectedProject) {
          blocks.add(r.block.trim())
        }
      }
    })
    return Array.from(blocks).sort()
  }, [records, selectedProject])

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      // Project filter
      if (selectedProject !== 'ALL' && r.project_name !== selectedProject) {
        return false
      }
      // Block filter
      if (selectedBlock !== 'ALL' && (r.block || '').trim() !== selectedBlock) {
        return false
      }
      // Search query (CNIC or Client Name)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = (r.client_name || '').toLowerCase().includes(q)
        const matchCnic = (r.cnic || '').toLowerCase().includes(q)
        const matchPlot = (r.plot_no || '').toLowerCase().includes(q)
        const matchPhone = (r.phone || '').toLowerCase().includes(q)
        return matchName || matchCnic || matchPlot || matchPhone
      }
      return true
    })
  }, [records, selectedProject, selectedBlock, searchQuery])

  // Pagination calculation
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage) || 1
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage
    return filteredRecords.slice(start, start + recordsPerPage)
  }, [filteredRecords, currentPage])

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedProject, selectedBlock])

  // CSV Export handler
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) return

    const headers = ['Client Name', 'CNIC', 'Phone', 'Project Name', 'Plot No', 'Block', 'Nominee', 'Booking Date']
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
        `"${(r.booking_date || '').replace(/"/g, '""')}"`
      ]
      csvRows.push(row.join(','))
    })

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `master_bookings_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="flex items-center gap-2 px-3 py-1.5 rounded-none bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin</span>
            </Link>
            <div className="h-6 w-[1px] bg-slate-800" />
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-amber-400" />
              <h1 className="font-outfit font-black text-lg text-white">Master Booking Records</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              disabled={filteredRecords.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-none bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative z-10">
        
        {/* Controls & Filter Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-none p-6 shadow-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Search Client or CNIC
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Client Name, CNIC, or Plot No..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-none text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Filter by Project */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Filter by Project
              </label>
              <select
                value={selectedProject}
                onChange={(e) => {
                  setSelectedProject(e.target.value)
                  setSelectedBlock('ALL')
                }}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-none text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-medium cursor-pointer"
              >
                <option value="ALL">All Projects ({records.length})</option>
                {PROJECTS.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Filter by Block */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Filter by Block
              </label>
              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-none text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-medium cursor-pointer"
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
        <div className="bg-slate-900/90 border border-slate-800 rounded-none overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900">
            <div className="text-xs text-slate-400 font-mono">
              Showing <span className="text-white font-bold">{filteredRecords.length > 0 ? (currentPage - 1) * recordsPerPage + 1 : 0}</span> to <span className="text-white font-bold">{Math.min(currentPage * recordsPerPage, filteredRecords.length)}</span> of <span className="text-amber-400 font-bold">{filteredRecords.length}</span> records
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-none bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
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
                className="p-2 rounded-none bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
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
                  <th className="py-4 px-5 font-bold">Project</th>
                  <th className="py-4 px-5 font-bold">Plot No.</th>
                  <th className="py-4 px-5 font-bold">Block</th>
                  <th className="py-4 px-5 font-bold">Nominee</th>
                  <th className="py-4 px-5 font-bold">Booking Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-3">
                        <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
                        <span>Loading master database records...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      No matching records found in master database.
                    </td>
                  </tr>
                ) : (
                  paginatedRecords.map((r, idx) => (
                    <tr key={r.id || idx} className="hover:bg-slate-850/60 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-white font-outfit">{r.client_name}</td>
                      <td className="py-3.5 px-5 text-amber-300 font-mono font-medium">{r.cnic || 'N/A'}</td>
                      <td className="py-3.5 px-5 text-slate-300 font-mono">{r.phone || 'N/A'}</td>
                      <td className="py-3.5 px-5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-blue-500/10 border border-blue-500/30 text-blue-400">
                          {r.project_name}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-bold text-white font-outfit">{r.plot_no}</td>
                      <td className="py-3.5 px-5 text-slate-300">{r.block || 'Main'}</td>
                      <td className="py-3.5 px-5 text-slate-300">{r.nominee || 'N/A'}</td>
                      <td className="py-3.5 px-5 text-slate-400 font-mono text-xs">{r.booking_date || 'N/A'}</td>
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
