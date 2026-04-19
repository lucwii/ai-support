'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Zap } from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'

function AnimatedMenuToggle({ toggle, isOpen }: { toggle: () => void; isOpen: boolean }) {
  return (
    <button onClick={toggle} aria-label="Toggle menu" className="focus:outline-none">
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 0.3 }}
        style={{ color: '#94A3B8' }}
      >
        <motion.path
          fill="transparent"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
          variants={{
            closed: { d: 'M 2 5 L 22 5' },
            open:   { d: 'M 3 18 L 18 3' },
          }}
        />
        <motion.path
          fill="transparent"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
          variants={{
            closed: { d: 'M 2 12 L 22 12', opacity: 1 },
            open:   { d: 'M 2 12 L 22 12', opacity: 0 },
          }}
          transition={{ duration: 0.15 }}
        />
        <motion.path
          fill="transparent"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
          variants={{
            closed: { d: 'M 2 19 L 22 19' },
            open:   { d: 'M 3 3 L 18 18' },
          }}
        />
      </motion.svg>
    </button>
  )
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <div className="flex h-screen overflow-hidden bg-[#080C18]">
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar — motion slide on mobile, always visible on desktop */}
      <motion.div
        className="fixed inset-y-0 left-0 z-40 lg:relative lg:z-auto"
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        style={{ x: undefined }}
        // On lg+ always show via CSS, ignore motion x
        data-sidebar
      >
        {/* CSS override: always visible on desktop regardless of motion state */}
        <style>{`@media (min-width: 1024px) { [data-sidebar] { transform: none !important; } }`}</style>
        <Sidebar />
      </motion.div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-[#0D1117] flex-shrink-0">
          <AnimatedMenuToggle toggle={() => setSidebarOpen((v) => !v)} isOpen={sidebarOpen} />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold text-[#F1F5F9] font-sora">Kleo</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
