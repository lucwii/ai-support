'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'

interface SidebarNavItemProps {
  label: string
  icon: LucideIcon
  href: string
  badge?: number
  exact?: boolean
}

export default function SidebarNavItem({ label, icon: Icon, href, badge, exact = false }: SidebarNavItemProps) {
  const pathname = usePathname()
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 h-9 rounded-xl px-3 text-sm font-medium transition-all duration-150 ${
        isActive
          ? 'text-[#818CF8] bg-[rgba(99,102,241,0.12)] border-l-2 border-[#6366F1]'
          : 'text-[#64748B] hover:bg-white/[0.04] hover:text-[#CBD5E1] border-l-2 border-transparent'
      }`}
    >
      <Icon
        className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#6366F1]' : ''}`}
      />
      <span className="flex-1 truncate">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto bg-[rgba(99,102,241,0.2)] text-[#818CF8] text-[11px] font-semibold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  )
}
