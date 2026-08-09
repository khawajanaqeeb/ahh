'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Mail, Lock, X, Loader2, AlertCircle, ArrowRight } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { isEmailAdmin } from '@/lib/constants'

interface AdminLoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setEmail('')
      setPassword('')
      setError(null)
      setLoading(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // 1. Authenticate user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError || !authData.user) {
        setError('Invalid email or password.')
        setLoading(false)
        return
      }

      // 2. Fetch role from public.profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .maybeSingle()

      const userRole = profile?.role
      const isAuthorized = userRole === 'admin' || userRole === 'accounts' || isEmailAdmin(authData.user.email) || authData.user.user_metadata?.role === 'admin'

      if (!isAuthorized) {
        setError('Access Denied — Insufficient permissions')
        setLoading(false)
        return
      }

      // 3. Success -> Close modal and navigate to /admin
      onClose()
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      console.error('Admin modal auth error:', err)
      setError('Invalid email or password.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Backdrop overlay click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-none shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-outfit tracking-tight">Admin Authentication</h2>
              <p className="text-[11px] text-slate-400 font-mono">AHH Brothers Internal Portal</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-none text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Admin Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inline Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-none p-4 flex items-center gap-3 text-center">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-xs text-red-400 font-bold">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4 text-amber-500/70" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ahhbrothers.com"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-none text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4 text-amber-500/70" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-none text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 py-4 px-6 rounded-none bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-950/20 transition-all uppercase tracking-wider disabled:opacity-60 cursor-pointer min-h-[48px]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Access Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-500">
          Only pre-approved admin & accounts users can log in to the admin panel.
        </p>
      </div>
    </div>
  )
}
