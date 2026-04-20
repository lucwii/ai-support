'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Features',     href: '#features' },
  { label: 'Pricing',      href: '#pricing' },
  { label: 'Customers',    href: '#testimonials' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastY, setLastY] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setVisible(y < lastY || y < 60)
      setLastY(y)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastY])

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-5"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <div
          className="flex items-center justify-between px-5 py-2.5 w-full max-w-[860px] rounded-full"
          style={{
            background: 'rgba(8,12,24,0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 4px 32px rgba(0,0,0,0.35)',
          }}
        >
          {/* Logo */}
          <Link href="/" data-testid="navbar-logo" className="flex items-center gap-2.5 shrink-0">
            <motion.div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
              whileHover={{ rotate: 8, scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </motion.div>
            <span className="font-semibold text-[15px] text-white tracking-tight">Kleo</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                whileHover={{ scale: 1.04 }}
              >
                <a
                  href={item.href}
                  className="text-[13px] font-medium transition-colors duration-150 hover:text-white"
                  style={{ color: '#94A3B8' }}
                >
                  {item.label}
                </a>
              </motion.div>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <motion.div
            className="hidden md:flex items-center gap-2"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Link
              href="/auth/login"
              data-testid="navbar-signin"
              className="text-[13px] font-medium px-4 py-2 rounded-full transition-colors duration-150 hover:text-white"
              style={{ color: '#94A3B8' }}
            >
              Sign In
            </Link>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/auth/register"
                data-testid="navbar-start-trial"
                className="text-[13px] font-semibold text-white px-5 py-2 rounded-full transition-all duration-150 hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
              >
                Start Free Trial
              </Link>
            </motion.div>
          </motion.div>

          {/* Mobile hamburger */}
          <motion.button
            className="md:hidden flex items-center justify-center p-1.5 rounded-lg"
            style={{ color: '#94A3B8' }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col pt-24 px-6 pb-8 md:hidden"
            style={{ background: 'rgba(6,9,20,0.98)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div className="flex flex-col gap-5">
              {NAV_LINKS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.07 + 0.05 }}
                >
                  <a
                    href={item.href}
                    className="text-[17px] font-medium hover:text-white transition-colors"
                    style={{ color: '#94A3B8' }}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                </motion.div>
              ))}

              <hr style={{ borderColor: 'rgba(255,255,255,0.06)', marginTop: 4 }} />

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ delay: 0.32 }}
                className="flex flex-col gap-3"
              >
                <Link
                  href="/auth/login"
                  className="text-[15px] font-medium text-center py-3 rounded-full border transition-colors hover:text-white"
                  style={{ color: '#94A3B8', borderColor: 'rgba(255,255,255,0.08)' }}
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="text-[15px] font-semibold text-white text-center py-3 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
                  onClick={() => setOpen(false)}
                >
                  Start Free Trial
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
