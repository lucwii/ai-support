'use client'

import { useState } from 'react'
import { Loader2, Trash2, UserPlus, Clock } from 'lucide-react'
import { useMembers } from '@/hooks/useMembers'
import type { OrgMember, OrgPendingInvite, MemberRole } from '@/lib/types'

// ── Role badge ─────────────────────────────────────────────────────────────

const ROLE_STYLES: Record<MemberRole, string> = {
  owner: 'bg-[#6366F1]/10 text-[#6366F1]',
  admin: 'bg-amber-500/10 text-amber-400',
  agent: 'bg-white/[0.06] text-[#475569]',
}

function RoleBadge({ role }: { role: MemberRole }) {
  return (
    <span className={`text-[11px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md ${ROLE_STYLES[role]}`}>
      {role}
    </span>
  )
}

// ── Avatar ─────────────────────────────────────────────────────────────────

function Avatar({ email }: { email: string | null }) {
  const initials = email ? email.slice(0, 2).toUpperCase() : '??'
  return (
    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
      <span className="text-xs font-semibold text-indigo-400">{initials}</span>
    </div>
  )
}

// ── Member row ─────────────────────────────────────────────────────────────

function MemberRow({ member, onRemove }: { member: OrgMember; onRemove: (userId: string) => void }) {
  const [removing, setRemoving] = useState(false)

  const handleRemove = async () => {
    setRemoving(true)
    try {
      await onRemove(member.user_id)
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/[0.06] last:border-0">
      <Avatar email={member.email} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#F1F5F9] truncate">{member.full_name || member.email || '—'}</p>
        {member.full_name && (
          <p className="text-xs text-[#475569] truncate">{member.email}</p>
        )}
      </div>
      <RoleBadge role={member.role} />
      {member.role !== 'owner' && (
        <button
          onClick={handleRemove}
          disabled={removing}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#334155] hover:text-red-400 hover:bg-red-400/10 transition-colors duration-150 disabled:opacity-40 shrink-0"
          title="Remove member"
        >
          {removing
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Trash2 className="w-3.5 h-3.5" />
          }
        </button>
      )}
      {member.role === 'owner' && <div className="w-7 shrink-0" />}
    </div>
  )
}

// ── Pending invite row ─────────────────────────────────────────────────────

function PendingInviteRow({ invite }: { invite: OrgPendingInvite }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/[0.06] last:border-0">
      <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
        <Clock className="w-3.5 h-3.5 text-amber-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#94A3B8] truncate italic">{invite.email}</p>
        <p className="text-xs text-[#334155]">Invite pending</p>
      </div>
      <span className="text-[11px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400">
        {invite.role}
      </span>
      <div className="w-7 shrink-0" />
    </div>
  )
}

// ── Invite form ────────────────────────────────────────────────────────────

function InviteForm({ onInvite }: { onInvite: (email: string, role: 'agent' | 'admin') => Promise<void> }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'agent' | 'admin'>('agent')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes('@')) return
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      await onInvite(email.trim(), role)
      setEmail('')
      setSuccess(true)
    } catch {
      setError('Failed to send invite. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-5 pt-5 border-t border-white/[0.06]">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[#475569] mb-3">
        Invite member
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setSuccess(false) }}
          placeholder="colleague@company.com"
          className="flex-1 bg-[#060D1A] border border-white/[0.06] rounded-xl text-sm text-[#F1F5F9] placeholder-[#334155] px-4 py-2.5 focus:outline-none focus:border-[#6366F1]/50 transition-colors duration-150"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'agent' | 'admin')}
          className="bg-[#060D1A] border border-white/[0.06] rounded-xl text-sm text-[#F1F5F9] px-3 py-2.5 focus:outline-none focus:border-[#6366F1]/50 transition-colors duration-150 appearance-none cursor-pointer"
        >
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={handleSubmit}
          disabled={loading || !email.trim()}
          className="inline-flex items-center gap-2 bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-150 hover:-translate-y-px disabled:hover:translate-y-0 shrink-0"
        >
          {loading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <UserPlus className="w-4 h-4" />
          }
          Invite
        </button>
      </div>
      {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
      {success && <p className="text-sm text-emerald-400 mt-2">Invite sent successfully</p>}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function TeamSection() {
  const { members, pendingInvites, loading, error, invite, remove } = useMembers()

  const totalCount = members.length + pendingInvites.length

  return (
    <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-[#F1F5F9]">Team</h2>
          <p className="text-sm text-[#475569] mt-0.5">Manage members and invitations.</p>
        </div>
        {!loading && (
          <span className="text-xs text-[#475569] bg-white/[0.04] px-2.5 py-1 rounded-lg">
            {totalCount} {totalCount === 1 ? 'member' : 'members'}
          </span>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-[#475569] py-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading team...</span>
        </div>
      )}

      {error && <p className="text-sm text-red-400 py-4">{error}</p>}

      {!loading && !error && (
        <>
          {members.map((m) => (
            <MemberRow key={m.id} member={m} onRemove={remove} />
          ))}
          {pendingInvites.map((inv) => (
            <PendingInviteRow key={inv.id} invite={inv} />
          ))}
          {totalCount === 0 && (
            <p className="text-sm text-[#334155] py-4">No members yet.</p>
          )}
          <InviteForm onInvite={invite} />
        </>
      )}
    </div>
  )
}
