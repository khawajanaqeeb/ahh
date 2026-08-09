'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { login } from './actions'
import { MEDIA } from '@/lib/media'
import { Shield, Mail, Lock, ArrowRight, AlertCircle, Loader2, Info } from 'lucide-react'

function LoginForm() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const redirectUrl = searchParams.get('redirect')

  useEffect(() => {
    const urlError = searchParams.get('error')
    if (urlError) {
      setError(urlError)
    } else if (redirectUrl === '/my-plots') {
      setNotice('Please log in or register to view your booked plots.')
    }
  }, [searchParams, redirectUrl])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const formData = new FormData(e.currentTarget)
      if (redirectUrl) {
        formData.append('redirect', redirectUrl)
      }
      const result = await login(formData)
      
      if (result?.error) {
        setError(result.error)
        setLoading(false)
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

      <form className="space-y-9" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-none p-4 flex items-center justify-center gap-3 text-center">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-sm text-red-400 font-medium">{error}</p>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-3 text-center">
          <label className="block text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Mail className="h-6 w-6 text-amber-500/70" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full pl-14 pr-5 py-5 bg-slate-950/90 border border-slate-800 rounded-none text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all text-base text-center font-medium min-h-[60px]"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-3 text-center">
          <label className="block text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Lock className="h-6 w-6 text-amber-500/70" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full pl-14 pr-5 py-5 bg-slate-950/90 border border-slate-800 rounded-none text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all text-base text-center font-medium min-h-[60px]"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-center pt-2">
          <label htmlFor="remember-me" className="flex items-center gap-3 text-sm sm:text-base text-slate-400 cursor-pointer hover:text-slate-200 transition-colors">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-5 w-5 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500/30"
            />
            <span>Remember me on this device</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-3 py-5 px-8 rounded-none shadow-xl shadow-amber-950/20 text-base font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-amber-500 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider min-h-[62px]"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="mt-11 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs sm:text-sm">
          <span className="px-4 bg-slate-900 text-slate-500 uppercase tracking-widest font-semibold">
            New to AHH Brothers?
          </span>
        </div>
      </div>

      {/* Create Account Link */}
      <div className="mt-8 text-center">
        <Link
          href={`/signup${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
          className="w-full flex justify-center items-center gap-2 py-4.5 px-6 border border-slate-800 rounded-none bg-slate-950/60 text-base font-bold text-amber-400 hover:bg-slate-800 hover:text-amber-300 transition-all hover:border-amber-500/30 min-h-[56px]"
        >
          Create a New Account
        </Link>
      </div>

      {/* Security badge */}
      <div className="mt-10 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500">
        <Shield className="w-4 h-4 text-emerald-500/80" />
        <span>Protected with SSL 256-bit Supabase Authentication</span>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg space-y-10 text-center relative z-10">
        {/* Header Section */}
        <Link href="/" className="inline-flex flex-col items-center justify-center group">
          <div className="w-28 h-28 rounded-none bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 shadow-2xl flex items-center justify-center p-4 group-hover:scale-105 group-hover:border-amber-500/50 transition-all">
            <Image
              src={MEDIA.ahhLogoPng}
              alt="AHH Brothers Logo"
              width={88}
              height={88}
              className="object-contain"
            />
          </div>
          <h1 className="mt-7 text-center text-4xl sm:text-5xl font-black tracking-tight text-white font-outfit">
            Welcome Back
          </h1>
        </Link>

        {/* Form Container */}
        <Suspense fallback={
          <div className="bg-slate-900/90 p-12 rounded-none text-center text-slate-400 flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <span>Loading login portal...</span>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
