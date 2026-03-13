'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Inbox,
  ListChecks,
  BookOpen,
  Plug2,
  Settings,
  Zap,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import SidebarNavItem from './SidebarNavItem'
import { useOrganization } from '@/hooks/useOrganization'
import { useTickets } from '@/hooks/useTickets'

const navSections = (pendingCount: number) => [
  {
    label: 'GENERAL',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', exact: true },
      { label: 'Inbox', icon: Inbox, href: '/dashboard/inbox', badge: pendingCount },
      { label: 'All Tickets', icon: ListChecks, href: '/dashboard/tickets' },
    ],
  },
  {
    label: 'TOOLS',
    items: [
      { label: 'Knowledge Base', icon: BookOpen, href: '/dashboard/knowledge' },
      { label: 'Integrations', icon: Plug2, href: '/dashboard/integrations' },
    ],
  },
  {
    label: 'SUPPORT',
    items: [
      { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
    ],
  },
]

export default function Sidebar() {
  const router = useRouter()
  const supabase = createClient()
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')

  const { organization } = useOrganization()
  const { tickets } = useTickets(organization?.id)

  const pendingCount = tickets.filter((t) => t.status === 'pending_agent').length

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email ?? '')
        const meta = user.user_metadata
        setUserName(meta?.full_name ?? meta?.name ?? user.email?.split('@')[0] ?? '')
      }
    })
  }, [supabase.auth])

  const initials = userName
    ? userName
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : userEmail.slice(0, 2).toUpperCase()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <aside className="w-60 flex-shrink-0 h-screen flex flex-col bg-[#0D1117] border-r border-white/[0.06] px-3 py-5">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center flex-shrink-0">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-base font-bold text-[#F1F5F9] font-sora">SupportAI</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {navSections(pendingCount).map((section) => (
          <div key={section.label}>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#475569] px-3 mt-6 mb-1">
              {section.label}
            </p>
            {section.items.map((item) => (
              <SidebarNavItem key={item.href} {...item} />
            ))}
          </div>
        ))}
      </nav>

      {/* User area */}
      <div className="border-t border-white/[0.06] pt-4 mt-4">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-indigo-400">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#F1F5F9] truncate">{userName || '—'}</p>
            <p className="text-xs text-[#475569] truncate">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-[#475569] hover:text-[#94A3B8] transition-colors duration-150 flex-shrink-0"
            title="Sign out"
          >
            <LogOut className="w-[15px] h-[15px]" />
          </button>
        </div>
      </div>
    </aside>
  )
}
