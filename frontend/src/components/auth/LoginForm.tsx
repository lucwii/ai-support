'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loginWithEmail } from '@/lib/auth/actions'
import GoogleLoginButton from './GoogleLoginButton'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await loginWithEmail(email, password)

    if (error) {
      setError(error)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="w-full max-w-[420px]">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-7">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="font-sora font-semibold text-[18px] text-white">SupportAI</span>
        </Link>
        <h1 className="font-sora font-bold text-[26px] mb-2" style={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Welcome back
        </h1>
        <p className="text-[14px]" style={{ color: '#64748B' }}>
          Sign in to your workspace
        </p>
      </div>

      {/* Card */}
      <div
        className="glass-card p-8"
        style={{ background: 'rgba(15,23,42,0.85)' }}
      >
        {/* Google login */}
        <GoogleLoginButton />

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <span className="text-[12px] font-medium" style={{ color: '#475569' }}>or continue with email</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-[13px] font-medium mb-1.5" style={{ color: '#94A3B8' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-lg px-4 py-2.5 text-[14px] outline-none transition-all duration-150"
              style={{
                background: '#1E293B',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#F1F5F9',
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid #6366F1'
                e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid rgba(255,255,255,0.08)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-[13px] font-medium" style={{ color: '#94A3B8' }}>
                Password
              </label>
              <Link href="/auth/forgot-password" className="text-[12px] transition-colors duration-150 hover:text-indigo-400" style={{ color: '#6366F1' }}>
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg px-4 py-2.5 text-[14px] outline-none transition-all duration-150"
              style={{
                background: '#1E293B',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#F1F5F9',
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid #6366F1'
                e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid rgba(255,255,255,0.08)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {error && (
            <div
              className="rounded-lg px-4 py-3 text-[13px]"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5' }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-semibold py-3 rounded-lg text-[14px] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-px mt-1"
            style={{
              background: loading ? '#4F46E5' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>

      {/* Footer link */}
      <p className="text-center text-[14px] mt-6" style={{ color: '#64748B' }}>
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="font-medium transition-colors duration-150 hover:text-indigo-400" style={{ color: '#6366F1' }}>
          Sign up
        </Link>
      </p>
    </div>
  )
}
