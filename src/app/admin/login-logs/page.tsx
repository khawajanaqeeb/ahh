'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { 
  Clock, Search, Download, Filter, RefreshCw, 
  UserCheck, LogOut, LogIn, Shield, ArrowLeft, 
  ChevronLeft, ChevronRight, Monitor, Globe, Calendar, AlertCircle, Loader2
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface ActivityLog {
  id: string
  user_id: string | null
  user_email: string
  user_role: string
  event_type: 'login' | 'logout'
  timestamp: string
  ip_address: string | null
  user_agent: string | null
}

const ITEMS_PER_PAGE = 50

export default function AdminLoginLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters & Pagination State
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [eventFilter, setEventFilter] = useState('ALL')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(50)

  const fetchLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/activity-logs')
      const json = await res.json()

      if (!res.ok) {
        console.error('Fetch activity logs error:', json.error)
        if (res.status === 401 || res.status === 403) {
          setError('Access denied. You must be logged in as an Admin or Accounts user to view this page.')
        } else {
          setError(json.error || 'Failed to fetch activity logs. Please try again.')
        }
      } else {
        setLogs(json.data || [])
      }
    } catch (err) {
      console.error('Unexpected error fetching logs:', err)
      setError('An unexpected error occurred while loading activity logs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Search filter
      const matchesSearch = 
        !searchQuery ||
        log.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.ip_address && log.ip_address.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.user_agent && log.user_agent.toLowerCase().includes(searchQuery.toLowerCase()))

      // Role filter
      const matchesRole = 
        roleFilter === 'ALL' || 
        log.user_role.toLowerCase() === roleFilter.toLowerCase()

      // Event filter
      const matchesEvent = 
        eventFilter === 'ALL' || 
        log.event_type.toLowerCase() === eventFilter.toLowerCase()

      // Date filter (YYYY-MM-DD)
      const matchesDate = 
        !dateFilter || 
        (log.timestamp && log.timestamp.startsWith(dateFilter))

      return matchesSearch && matchesRole && matchesEvent && matchesDate
    })
  }, [logs, searchQuery, roleFilter, eventFilter, dateFilter])

  // Summary statistics
  const totalLogins = useMemo(() => logs.filter(l => l.event_type === 'login').length, [logs])
  const totalLogouts = useMemo(() => logs.filter(l => l.event_type === 'logout').length, [logs])

  // Pagination calculation
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredLogs.slice(start, start + itemsPerPage)
  }, [filteredLogs, currentPage, itemsPerPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, roleFilter, eventFilter, dateFilter, itemsPerPage])

  // Format PKT timestamp
  const formatTimestampPKT = (isoString?: string) => {
    if (!isoString) return 'N/A'
    try {
      const date = new Date(isoString)
      return date.toLocaleString('en-PK', {
        timeZone: 'Asia/Karachi',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }) + ' PKT'
    } catch {
      return isoString
    }
  }

  // Parse browser/OS snippet from User Agent
  const getDeviceSnippet = (uaStr?: string | null) => {
    if (!uaStr) return 'Unknown Device'
    if (uaStr.includes('Windows')) return 'Windows PC'
    if (uaStr.includes('Macintosh') || uaStr.includes('Mac OS')) return 'Mac'
    if (uaStr.includes('iPhone')) return 'iPhone (iOS)'
    if (uaStr.includes('iPad')) return 'iPad (iOS)'
    if (uaStr.includes('Android')) return 'Android Mobile'
    if (uaStr.includes('Linux')) return 'Linux Device'
    return 'Web Client'
  }

  // Export CSV Helper
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return

    const headers = ['ID', 'Timestamp (PKT)', 'User Email', 'Role', 'Event Type', 'IP Address', 'User Agent']
    
    const csvRows = filteredLogs.map(log => [
      `"${log.id}"`,
      `"${formatTimestampPKT(log.timestamp)}"`,
      `"${log.user_email}"`,
      `"${log.user_role}"`,
      `"${log.event_type.toUpperCase()}"`,
      `"${log.ip_address || 'N/A'}"`,
      `"${(log.user_agent || 'N/A').replace(/"/g, '""')}"`
    ])

    const csvContent = [headers.join(','), ...csvRows.map(r => r.join(','))].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `user_activity_logs_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8 selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-none p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link 
              href="/admin" 
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold mb-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Control Center</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-none text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-outfit tracking-tight">
                User Login Activity Logs
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Audit trail of authentication events across all clients and administrators.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-none text-xs font-bold transition-all border border-slate-700/60 cursor-pointer"
            title="Refresh Logs"
          >
            <RefreshCw className={`w-4 h-4 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={filteredLogs.length === 0}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-none text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-amber-950/30 disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-none flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Recorded Entries</span>
            <span className="text-2xl font-black text-white font-outfit">{logs.length}</span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-none flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Logins</span>
            <span className="text-2xl font-black text-emerald-400 font-outfit">{totalLogins}</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <LogIn className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-none flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Logouts</span>
            <span className="text-2xl font-black text-slate-300 font-outfit">{totalLogouts}</span>
          </div>
          <div className="p-3 bg-slate-800 text-slate-400 border border-slate-700">
            <LogOut className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Controls Card */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-none p-5 sm:p-6 backdrop-blur-lg space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search email, IP, agent..."
              className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-none text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-none text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all appearance-none cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="admin">Admin</option>
              <option value="accounts">Accounts</option>
              <option value="user">User / Client</option>
            </select>
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* Event Type Filter */}
          <div className="relative">
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-none text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all appearance-none cursor-pointer"
            >
              <option value="ALL">All Events (Login & Logout)</option>
              <option value="login">Login Only</option>
              <option value="logout">Logout Only</option>
            </select>
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-none text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all cursor-pointer"
            />
            {dateFilter && (
              <button 
                onClick={() => setDateFilter('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs px-1"
                title="Clear date"
              >
                ✕
              </button>
            )}
          </div>

          {/* Items Per Page Selector */}
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-none text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all appearance-none cursor-pointer"
            >
              <option value={50}>Show 50 per page</option>
              <option value={100}>Show 100 per page</option>
              <option value={250}>Show 250 per page</option>
              <option value={500}>Show 500 per page</option>
              <option value={10000}>Show All Entries</option>
            </select>
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>

        </div>

        {/* Counter Bar */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60 gap-2">
          <span>
            Showing <strong className="text-white">{filteredLogs.length}</strong> of <strong className="text-amber-400">{logs.length}</strong> total activity record{logs.length === 1 ? '' : 's'} from beginning
          </span>
          {(searchQuery || roleFilter !== 'ALL' || eventFilter !== 'ALL' || dateFilter) && (
            <button
              onClick={() => {
                setSearchQuery('')
                setRoleFilter('ALL')
                setEventFilter('ALL')
                setDateFilter('')
              }}
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-none overflow-hidden shadow-2xl backdrop-blur-xl">
        {loading ? (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Loading user activity logs...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-red-400 font-medium">{error}</p>
            <div className="max-w-lg p-4 bg-slate-950 border border-red-500/20 rounded-none text-left">
              <p className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-wider">Fix: Run this SQL in Supabase SQL Editor</p>
              <pre className="text-[10px] text-emerald-400 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">{`CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL DEFAULT 'Unknown',
  user_role TEXT NOT NULL DEFAULT 'user',
  event_type TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read activity logs"
  ON public.user_activity_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'accounts')
  ));

CREATE POLICY "Allow insert activity logs"
  ON public.user_activity_logs FOR INSERT
  WITH CHECK (true);`}</pre>
            </div>
          </div>
        ) : paginatedLogs.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Clock className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-base text-slate-300 font-bold">No Activity Logs Found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No matching authentication logs found. Try adjusting your search criteria or date filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-6">Timestamp (PKT)</th>
                  <th className="py-4 px-6">User Email</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Event Type</th>
                  <th className="py-4 px-6">IP Address</th>
                  <th className="py-4 px-6">Device / Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {paginatedLogs.map((log) => {
                  const isLogin = log.event_type === 'login'
                  const roleUpper = (log.user_role || 'user').toUpperCase()

                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      
                      {/* Timestamp */}
                      <td className="py-4 px-6 font-mono text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
                          <span>{formatTimestampPKT(log.timestamp)}</span>
                        </div>
                      </td>

                      {/* User Email */}
                      <td className="py-4 px-6 font-bold text-white whitespace-nowrap">
                        {log.user_email}
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          roleUpper === 'ADMIN'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : roleUpper === 'ACCOUNTS'
                            ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          <Shield className="w-3 h-3" />
                          <span>{roleUpper}</span>
                        </span>
                      </td>

                      {/* Event Type Badge */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                          isLogin
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {isLogin ? (
                            <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <LogOut className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>{log.event_type}</span>
                        </span>
                      </td>

                      {/* IP Address */}
                      <td className="py-4 px-6 font-mono text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{log.ip_address || 'Unknown'}</span>
                        </div>
                      </td>

                      {/* Device / Agent */}
                      <td className="py-4 px-6 text-slate-400 max-w-xs truncate" title={log.user_agent || undefined}>
                        <div className="flex items-center gap-2">
                          <Monitor className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="font-semibold text-slate-300">{getDeviceSnippet(log.user_agent)}</span>
                          <span className="text-[10px] text-slate-500 truncate hidden xl:inline">({log.user_agent})</span>
                        </div>
                      </td>

                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-slate-950/80 border-t border-slate-800 text-xs">
            <div className="text-slate-400">
              Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 rounded-none border border-slate-800 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, idx, arr) => (
                    <React.Fragment key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-slate-600">...</span>}
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 rounded-none font-bold transition-all cursor-pointer ${
                          currentPage === p
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 rounded-none border border-slate-800 transition-all cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
