'use client'

import { CalendarDays, LogIn, Ticket } from 'lucide-react'
import type { UserProfile } from '@/lib/types'

interface Props {
  profile: UserProfile
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function formatProvider(provider: string) {
  return provider === 'google' ? 'Google' : 'Email'
}

export default function AccountInfoSection({ profile }: Props) {
  return (
    <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-6">
      <h2 className="text-base font-semibold text-[#F1F5F9] mb-5">Account Info</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InfoCard
          icon={<CalendarDays className="w-4 h-4" />}
          label="Member since"
          value={formatDate(profile.created_at)}
        />
        <InfoCard
          icon={<LogIn className="w-4 h-4" />}
          label="Login method"
          value={formatProvider(profile.provider)}
        />
        <InfoCard
          icon={<Ticket className="w-4 h-4" />}
          label="Tickets created"
          value={String(profile.ticket_count)}
        />
      </div>
    </div>
  )
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-[#060D1A] border border-white/[0.06] rounded-xl p-4">
      <div className="flex items-center gap-2 text-[#475569] mb-2">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-sm font-medium text-[#F1F5F9]">{value}</p>
    </div>
  )
}
