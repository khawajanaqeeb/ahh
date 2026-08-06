'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { login } from './actions'
import { MEDIA } from '@/lib/constants'
import { Shield, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex flex-col items-center justify-center cursor-pointer group">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl flex items-center justify-center p-3 group-hover:scale-105 transition-transform">
            <Image
              src={MEDIA.ahhLogoPng}
              alt="AHH Brothers Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-white font-outfit">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Sign in to your AHH Brothers account
          </p>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-slate-800/80">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400 font-medium">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-600/30"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-900/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-blue-500 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign in <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-slate-900/80 text-slate-500 uppercase tracking-widest font-semibold">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/signup"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-slate-700 rounded-xl shadow-sm bg-slate-950 text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
              >
                Create a new account
              </Link>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure authentication via Supabase</span>
          </div>
        </div>
      </div>
    </div>
  )
}
