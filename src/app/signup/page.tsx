'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { signup } from '../login/actions'
import { MEDIA } from '@/lib/media'
import { Shield, Mail, Lock, ArrowRight, User, Phone, IdCard, AlertCircle, CheckCircle2, Loader2, Info } from 'lucide-react'

function SignupForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [cnic, setCnic] = useState('')

  const redirectUrl = searchParams.get('redirect')

  useEffect(() => {
    const urlError = searchParams.get('error')
    if (urlError) {
      setError(urlError)
    } else if (redirectUrl === '/my-plots') {
      setNotice('Please log in or register to view your booked plots.')
    }
  }, [searchParams, redirectUrl])

  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (raw.length <= 13) {
      let formatted = raw
      if (raw.length > 5 && raw.length <= 12) {
        formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`
      } else if (raw.length > 12) {
        formatted = `${raw.slice(0, 5)}-${raw.slice(5, 12)}-${raw.slice(12)}`
      }
      setCnic(formatted)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)
    
    try {
      const formData = new FormData(e.currentTarget)
      const password = formData.get('password') as string
      const confirmPassword = formData.get('confirmPassword') as string

      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify your password.')
        setLoading(false)
        return
      }

      const result = await signup(formData)
      
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else if (result?.requiresConfirmation) {
        setSuccessMessage(result.message || 'Account created! Please check your email to confirm your account before logging in.')
        setLoading(false)
      } else {
        router.push(redirectUrl && redirectUrl.startsWith('/') ? redirectUrl : '/')
      }
    } catch (err: any) {
      if (err?.message?.includes('NEXT_REDIRECT')) {
        return
      }
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-900/90 backdrop-blur-2xl py-12 px-8 sm:px-12 shadow-2xl rounded-none border border-slate-800/90 relative z-10 w-full">
      {notice && !error && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-none p-4 flex items-center justify-center gap-3 text-center">
          <Info className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-300 font-medium">{notice}</p>
        </div>
      )}

      {successMessage ? (
        <div className="space-y-8 text-center py-6">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/40 rounded-none flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-950/40">
            <Mail className="w-10 h-10" />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-extrabold text-white font-outfit">Check Your Email</h3>
            <p className="text-base text-slate-300 leading-relaxed max-w-sm mx-auto">
              {successMessage}
            </p>
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-none text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">💡 Next Steps:</p>
              <p>Open your email inbox and click the verification link.</p>
              <p className="text-slate-500">If you don't see it, check your Spam or Junk folder.</p>
            </div>
          </div>
          <div className="pt-2">
            <Link
              href={`/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
              className="w-full flex justify-center items-center gap-2 py-5 px-8 rounded-none shadow-xl shadow-emerald-950/20 text-base font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 transition-all uppercase tracking-wider min-h-[60px]"
            >
              Go to Login Page
            </Link>
          </div>
        </div>
      ) : (
        <form className="space-y-8" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-none p-4 flex items-center justify-center gap-3 text-center">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-3 text-center">
            <label className="block text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <User className="h-6 w-6 text-emerald-500/70" />
              </div>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                className="block w-full pl-14 pr-5 py-5 bg-slate-950/90 border border-slate-800 rounded-none text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all text-base text-center font-medium min-h-[60px]"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-3 text-center">
            <label className="block text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300">
              Phone Number <span className="text-[10px] font-normal normal-case tracking-normal text-slate-500">(optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Phone className="h-6 w-6 text-emerald-500/70" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className="block w-full pl-14 pr-5 py-5 bg-slate-950/90 border border-slate-800 rounded-none text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all text-base text-center font-medium min-h-[60px]"
                placeholder="+92 300 1234567"
              />
            </div>
          </div>

          {/* CNIC Field */}
          <div className="space-y-3 text-center">
            <label className="block text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300">
              CNIC Number <span className="text-[10px] font-normal normal-case tracking-normal text-slate-500">(optional for plot search)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <IdCard className="h-6 w-6 text-emerald-500/70" />
              </div>
              <input
                id="cnic"
                name="cnic"
                type="text"
                value={cnic}
                onChange={handleCnicChange}
                maxLength={15}
                className="block w-full pl-14 pr-5 py-5 bg-slate-950/90 border border-slate-800 rounded-none text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all text-base text-center font-medium min-h-[60px]"
                placeholder="42101-1234567-1"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-3 text-center">
            <label className="block text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Mail className="h-6 w-6 text-emerald-500/70" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full pl-14 pr-5 py-5 bg-slate-950/90 border border-slate-800 rounded-none text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all text-base text-center font-medium min-h-[60px]"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-3 text-center">
            <label className="block text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Lock className="h-6 w-6 text-emerald-500/70" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full pl-14 pr-5 py-5 bg-slate-950/90 border border-slate-800 rounded-none text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all text-base text-center font-medium min-h-[60px]"
                placeholder="••••••••"
              />
            </div>
            <p className="text-xs text-slate-500 pt-1">
              Must be at least 6 characters long
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-3 text-center">
            <label className="block text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Lock className="h-6 w-6 text-emerald-500/70" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full pl-14 pr-5 py-5 bg-slate-950/90 border border-slate-800 rounded-none text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all text-base text-center font-medium min-h-[60px]"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-3 py-5 px-8 rounded-none shadow-xl shadow-emerald-950/20 text-base font-bold text-white bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-emerald-500 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider min-h-[62px]"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {!successMessage && (
        <>
          {/* Divider */}
          <div className="mt-11 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-4 bg-slate-900 text-slate-500 uppercase tracking-widest font-semibold">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Sign in link */}
          <div className="mt-8 text-center">
            <Link
              href={`/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
              className="w-full flex justify-center items-center gap-2 py-4.5 px-6 border border-slate-800 rounded-none bg-slate-950/60 text-base font-bold text-emerald-400 hover:bg-slate-800 hover:text-emerald-300 transition-all hover:border-emerald-500/30 min-h-[56px]"
            >
              Sign In Instead
            </Link>
          </div>
        </>
      )}
      
      {/* Security badge */}
      <div className="mt-10 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500">
        <Shield className="w-4 h-4 text-emerald-500/80" />
        <span>Information is encrypted and secure</span>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/3 w-[450px] h-[450px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg space-y-10 text-center relative z-10">
        
        {/* Header Section */}
        <Link href="/" className="inline-flex flex-col items-center justify-center group">
          <div className="w-28 h-28 rounded-none bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 shadow-2xl flex items-center justify-center p-4 group-hover:scale-105 group-hover:border-emerald-500/50 transition-all">
            <Image
              src={MEDIA.ahhLogoPng}
              alt="AHH Brothers Logo"
              width={88}
              height={88}
              className="object-contain"
            />
          </div>
          <h1 className="mt-7 text-center text-4xl sm:text-5xl font-black tracking-tight text-white font-outfit">
            Create an Account
          </h1>
        </Link>

        {/* Card Form */}
        <Suspense fallback={
          <div className="bg-slate-900/90 p-12 rounded-none text-center text-slate-400 flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
            <span>Loading registration portal...</span>
          </div>
        }>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  )
}
