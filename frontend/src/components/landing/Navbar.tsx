'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : 'border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22l-4-9-9-4 20-7z" />
          </svg>
          TicketPilot AI
        </Link>

        {/* Nav links – desktop */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-blue-600 transition-colors duration-200">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors duration-200">How It Works</a>
          <a href="#solution" className="hover:text-blue-600 transition-colors duration-200">Solution</a>
        </div>

        {/* CTA buttons – desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-gray-600 px-4 py-2 rounded-full hover:text-blue-600 transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="text-sm font-medium bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
          >
            Get Started
          </Link>
        </div>

        {/* Hamburger – mobile */}
        <button
          className="md:hidden p-2 text-gray-600"
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
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          <a href="#features" onClick={() => setOpen(false)} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Features</a>
          <a href="#how-it-works" onClick={() => setOpen(false)} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
          <a href="#solution" onClick={() => setOpen(false)} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Solution</a>
          <hr className="border-gray-100" />
          <Link href="/auth/login" className="text-sm font-medium text-gray-600">Sign In</Link>
          <Link href="/auth/register" className="text-sm font-medium bg-blue-600 text-white px-5 py-2.5 rounded-full text-center hover:bg-blue-700 transition-colors">Get Started</Link>
        </div>
      )}
    </nav>
  )
}
