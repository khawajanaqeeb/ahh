'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  X, Mail, Lock, User, Phone, IdCard,
  AlertCircle, Loader2, LogIn, UserPlus, CheckCircle2, Shield
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  /** Called after a successful login or registration so the parent can reload data */
  onAuthSuccess: () => void
  /** Which tab to show first (default: 'login') */
  initialTab?: 'login' | 'register'
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCnic(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 13)
  if (digits.length > 12) return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`
  return digits
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InputField({
  id, name, type = 'text', label, placeholder, value, onChange,
  icon: Icon, required = false, hint, autoComplete,
}: {
  id: string; name: string; type?: string; label: string; placeholder: string
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  icon: React.ElementType; required?: boolean; hint?: string; autoComplete?: string
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[11px] font-bold uppercase tracking-widest text-slate-400">
        {label}{required && <span className="text-amber-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-amber-500/60" />
        </div>
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="block w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-none text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-medium"
        />
      </div>
      {hint && <p className="text-[10px] text-slate-600">{hint}</p>}
    </div>
  )
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialTab = 'login' }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  // Login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register fields
  const [regName, setRegName] = useState('')
  const [regCnic, setRegCnic] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')

  // Reset state when modal opens/closes or tab changes
  useEffect(() => {
    if (!isOpen) {
      setError(null); setSuccess(null); setLoading(false)
      setLoginEmail(''); setLoginPassword('')
      setRegName(''); setRegCnic(''); setRegPhone('')
      setRegEmail(''); setRegPassword(''); setRegConfirm('')
    }
  }, [isOpen])

  useEffect(() => {
    setError(null); setSuccess(null)
  }, [tab])

  // Prevent body scroll while open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleCnicChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (raw.length <= 13) setRegCnic(formatCnic(raw))
  }, [])

  // ─── Login Handler ─────────────────────────────────────────────────────────

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)

    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      })

      if (authError || !data.user) {
        const msg = authError?.message || ''
        if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('credentials')) {
          setError('Invalid email or password. Please check your credentials.')
        } else if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('no user')) {
          setError('No account found with this email. Please register first.')
        } else {
          setError(msg || 'Something went wrong. Please try again.')
        }
        setLoading(false)
        return
      }

      // Fetch profile for notification details
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, cnic, phone')
        .eq('id', data.user.id)
        .maybeSingle()

      // Fire-and-forget login activity log & notification
      fetch('/api/log-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'login' }),
      }).catch(() => {/* fire-and-forget */ })

      const loginTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }) + ' (PKT)'
      fetch('/api/notify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: profile?.full_name || data.user.user_metadata?.full_name || 'N/A',
          email: data.user.email,
          phone: profile?.phone || data.user.user_metadata?.phone || '',
          cnic: profile?.cnic || data.user.user_metadata?.cnic || '',
          loginTime,
        }),
      }).catch(() => {/* fire-and-forget */ })

      onClose()
      onAuthSuccess()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  // ─── Register Handler ──────────────────────────────────────────────────────

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Client-side validation
    const cnicDigits = regCnic.replace(/\D/g, '')
    if (cnicDigits.length !== 13) {
      setError('Please enter a valid 13-digit CNIC (e.g. 42101-1234567-1).')
      return
    }
    if (regPassword !== regConfirm) {
      setError('Passwords do not match.')
      return
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      // Check if CNIC is already registered
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('cnic', regCnic)
        .maybeSingle()

      if (existing) {
        setError('This CNIC is already registered. Please log in.')
        setLoading(false)
        return
      }

      // Sign up
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: regEmail.trim(),
        password: regPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: regName.trim(),
            phone: regPhone.trim(),
            cnic: regCnic,
          },
        },
      })

      if (signUpError) {
        const msg = signUpError.message || ''
        if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists')) {
          setError('An account with this email already exists. Please log in.')
        } else {
          setError(msg || 'Something went wrong. Please try again.')
        }
        setLoading(false)
        return
      }

      if (!data.user) {
        setError('Registration failed. Please try again.')
        setLoading(false)
        return
      }

      // Fire-and-forget registration notification — runs regardless of email confirmation setting
      const registrationTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }) + ' (PKT)'
      fetch('/api/notify-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regName.trim(),
          email: regEmail.trim(),
          phone: regPhone.trim(),
          cnic: regCnic,
          registrationTime,
        }),
      }).catch(() => {/* fire-and-forget */ })

      // If email confirmation is ON, session will be null
      if (!data.session) {
        setSuccess('Account created! Please check your email to confirm, then log in.')
        setLoading(false)
        return
      }

      // Upsert into profiles (in case DB trigger didn't fire or has stale data)
      await supabase.from('profiles').upsert(
        {
          id: data.user.id,
          email: data.user.email || regEmail.trim(),
          full_name: regName.trim(),
          phone: regPhone.trim(),
          cnic: regCnic,
          role: 'user',
        },
        { onConflict: 'id' }
      )

      onClose()
      onAuthSuccess()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Authentication Modal"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-150"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Panel */}
      <div className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white font-outfit tracking-tight">
                AHH Brothers Portal
              </h2>
              <p className="text-[10px] text-slate-500 font-mono">Client Account Access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          <button
            id="auth-tab-login"
            onClick={() => setTab('login')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
              tab === 'login'
                ? 'text-amber-400 border-b-2 border-amber-500 bg-amber-500/5'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Login
          </button>
          <button
            id="auth-tab-register"
            onClick={() => setTab('register')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
              tab === 'register'
                ? 'text-amber-400 border-b-2 border-amber-500 bg-amber-500/5'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Register
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">

          {/* Success message */}
          {success && (
            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-300 font-medium">{success}</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* ── LOGIN TAB ── */}
          {tab === 'login' && !success && (
            <form onSubmit={handleLogin} className="space-y-4">
              <InputField
                id="login-email" name="email" type="email" label="Email Address"
                placeholder="you@example.com" value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                icon={Mail} required autoComplete="email"
              />
              <InputField
                id="login-password" name="password" type="password" label="Password"
                placeholder="••••••••" value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                icon={Lock} required autoComplete="current-password"
              />
              <button
                type="submit"
                disabled={loading}
                id="auth-modal-login-submit"
                className="w-full mt-2 flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-950/20 transition-all uppercase tracking-wider disabled:opacity-60 cursor-pointer min-h-[48px]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><LogIn className="w-4 h-4" /> Sign In</>}
              </button>
              <p className="text-center text-xs text-slate-500 pt-1">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                >
                  Register here
                </button>
              </p>
            </form>
          )}

          {/* ── REGISTER TAB ── */}
          {tab === 'register' && !success && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <InputField
                id="reg-name" name="fullName" type="text" label="Full Name"
                placeholder="Muhammad Ali" value={regName}
                onChange={(e) => setRegName(e.target.value)}
                icon={User} required autoComplete="name"
              />

              <div className="space-y-1.5">
                <label htmlFor="reg-cnic" className="block text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  CNIC Number <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IdCard className="h-5 w-5 text-amber-500/60" />
                  </div>
                  <input
                    id="reg-cnic"
                    name="cnic"
                    type="text"
                    value={regCnic}
                    onChange={handleCnicChange}
                    maxLength={15}
                    placeholder="42101-1234567-1"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-none text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-mono font-bold tracking-wider"
                  />
                </div>
                <p className="text-[10px] text-slate-600">Format: 42101-1234567-1 (13 digits)</p>
              </div>

              <InputField
                id="reg-phone" name="phone" type="tel" label="Phone Number"
                placeholder="+92 300 1234567" value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                icon={Phone} required autoComplete="tel"
              />
              <InputField
                id="reg-email" name="email" type="email" label="Email Address"
                placeholder="you@example.com" value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                icon={Mail} required autoComplete="email"
              />
              <InputField
                id="reg-password" name="password" type="password" label="Password"
                placeholder="••••••••" value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                icon={Lock} required autoComplete="new-password"
                hint="Minimum 6 characters"
              />
              <InputField
                id="reg-confirm" name="confirmPassword" type="password" label="Confirm Password"
                placeholder="••••••••" value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
                icon={Lock} required autoComplete="new-password"
              />

              <button
                type="submit"
                disabled={loading}
                id="auth-modal-register-submit"
                className="w-full mt-1 flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-950/20 transition-all uppercase tracking-wider disabled:opacity-60 cursor-pointer min-h-[48px]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UserPlus className="w-4 h-4" /> Create Account</>}
              </button>
              <p className="text-center text-xs text-slate-500 pt-1">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-center gap-2">
          <Shield className="w-3 h-3 text-slate-600" />
          <p className="text-[10px] text-slate-600">Secured with Supabase — your data is encrypted</p>
        </div>
      </div>
    </div>
  )
}
