'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  Shield, FileText, Database, Clock, Users, LogOut, 
  ExternalLink, ChevronRight, Layers, ArrowRight, Building, CheckCircle
} from 'lucide-react'
import { MEDIA } from '@/lib/media'
import { PROJECTS } from '@/lib/projectsData'
import { createClient } from '@/utils/supabase/client'
import { logout } from '@/app/login/actions'
import { isEmailAdmin } from '@/lib/constants'

export default function AdminPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function loadUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUserEmail(user.email || null)
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle()
          
          setUserRole(profile?.role || (isEmailAdmin(user.email) ? 'admin' : 'user'))
        }
      } catch (err) {
        console.error('Error fetching admin user:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-none bg-slate-800 border border-slate-700 p-1 flex items-center justify-center group-hover:border-amber-500/50 transition-all">
                <Image
                  src={MEDIA.ahhLogoPng}
                  alt="AHH Brothers"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-outfit font-black text-lg text-white block leading-none">AHH BROTHERS</span>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block mt-0.5">Admin Control Center</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {userEmail && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 font-medium">{userEmail}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {userRole || 'Admin'}
                </span>
              </div>
            )}

            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 rounded-none bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative z-10">
        {/* Welcome Banner */}
        <div className="p-8 rounded-none bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800/80 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Verified Role: {userRole || 'Admin / Accounts'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-outfit tracking-tight">
              Management Dashboard
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Welcome to the central control panel for AHH Brothers Builders & Developers. Access project booking portals, master databases, and user activity logs.
            </p>
          </div>
        </div>

        {/* Quick Nav Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Module 1: Project Booking Portals */}
          <div className="p-6 rounded-none bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-none bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-outfit">Booking Receipts</h3>
              <p className="text-xs text-slate-400 mt-1">Manage interactive booking receipts across 4 main project sites.</p>
            </div>
            <div className="pt-2 space-y-2">
              {PROJECTS.map((proj) => (
                <Link
                  key={proj.id}
                  href={proj.route}
                  className="flex items-center justify-between p-2.5 rounded-none bg-slate-950 border border-slate-800 hover:border-amber-500/40 hover:text-amber-300 transition-all text-xs font-medium text-slate-300 group"
                >
                  <span className="truncate">{proj.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          {/* Module 2: Consolidated & Individual Project Plots Record Sheets */}
          <div className="p-6 rounded-none bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-none bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-outfit">Plots Record Sheets</h3>
                <p className="text-xs text-slate-400 mt-1">Consolidated & individual project plot record sheets with CNIC search, filter, and CSV exports.</p>
              </div>
            </div>
            <Link
              href="/admin/master-records"
              className="w-full py-3 px-4 rounded-none bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
            >
              <span>View Record Sheets</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Module 3: User Activity Logs */}
          <div className="p-6 rounded-none bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-outfit">User Activity Logs</h3>
                <p className="text-xs text-slate-400 mt-1">Audit log tracking all user login and logout events with timestamps.</p>
              </div>
            </div>
            <Link
              href="/admin/login-logs"
              className="w-full py-3 px-4 rounded-none bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-700"
            >
              <span>View Activity Logs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 text-center text-xs text-slate-500">
        <p>© 2026 AHH Brothers Builders & Developers. Authorized Admin Access Only.</p>
      </footer>
    </div>
  )
}
