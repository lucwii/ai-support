'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(8,12,24,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-sora font-700 text-[17px] text-white">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="font-sora font-semibold">SupportAI</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-7 text-[14px] font-medium" style={{ color: '#94A3B8' }}>
          <a href="#how-it-works" className="hover:text-white transition-colors duration-150">How it Works</a>
          <a href="#features" className="hover:text-white transition-colors duration-150">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors duration-150">Pricing</a>
          <a href="#testimonials" className="hover:text-white transition-colors duration-150">Customers</a>
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-[14px] font-medium px-4 py-2 rounded-lg transition-colors duration-150 hover:text-white"
            style={{ color: '#94A3B8', border: '1px solid transparent' }}
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="text-[14px] font-semibold text-white px-5 py-2 rounded-lg transition-all duration-150 hover:brightness-110 hover:-translate-y-px"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
          >
            Start Free Trial
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors duration-150"
          style={{ color: '#94A3B8' }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-6 py-5 flex flex-col gap-4"
          style={{ background: 'rgba(8,12,24,0.98)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          {['how-it-works', 'features', 'pricing', 'testimonials'].map((id, i) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setOpen(false)}
              className="text-[14px] font-medium capitalize transition-colors hover:text-white"
              style={{ color: '#94A3B8' }}
            >
              {['How it Works', 'Features', 'Pricing', 'Customers'][i]}
            </a>
          ))}
          <hr style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
          <Link href="/auth/login" className="text-[14px] font-medium" style={{ color: '#94A3B8' }}>Sign In</Link>
          <Link
            href="/auth/register"
            className="text-[14px] font-semibold text-white px-5 py-3 rounded-lg text-center"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
          >
            Start Free Trial
          </Link>
        </div>
      )}
    </nav>
  )
}
