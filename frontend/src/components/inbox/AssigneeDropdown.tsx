'use client'

import { useState } from 'react'
import { User, ChevronDown, Check, X } from 'lucide-react'
import { useMembers } from '@/hooks/useMembers'
import { useAssignTicket } from '@/hooks/useAssignTicket'
import type { OrgMember } from '@/lib/types'

interface AssigneeDropdownProps {
  ticketId: string
  assignedTo: string | null
  onAssigned: (assignedTo: string | null) => void
}

export default function AssigneeDropdown({ ticketId, assignedTo, onAssigned }: AssigneeDropdownProps) {
  const [open, setOpen] = useState(false)
  const { members } = useMembers()
  const { assign, loading } = useAssignTicket()

  const currentMember: OrgMember | null = members.find((m) => m.user_id === assignedTo) ?? null

  const handleSelect = async (userId: string | null) => {
    setOpen(false)
    const updated = await assign(ticketId, userId)
    if (updated) onAssigned(userId)
  }

  return (
    <div className="relative">
      <button
        data-testid="assignee-dropdown"
        onClick={() => setOpen((prev) => !prev)}
        disabled={loading}
        className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors duration-150 disabled:opacity-50"
      >
        <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
          <User className="w-3 h-3 text-indigo-400" />
        </div>
        <span
          data-testid="assignee-display"
          className="text-sm text-[#7A95B0] flex-1 truncate"
        >
          {currentMember
            ? (currentMember.full_name ?? currentMember.email ?? 'Agent')
            : 'Unassigned'}
        </span>
        <ChevronDown className={`w-3 h-3 text-[#3D5570] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-[#0A1628] border border-white/[0.08] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Unassigned option */}
          <button
            data-testid="assignee-option-unassigned"
            onClick={() => handleSelect(null)}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-[#7A95B0] hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-3.5 h-3.5 text-[#3D5570]" />
            <span>Unassigned</span>
            {assignedTo === null && <Check className="w-3.5 h-3.5 text-indigo-400 ml-auto" />}
          </button>

          {/* Member options */}
          {members.map((member) => (
            <button
              key={member.user_id}
              data-testid={`assignee-option`}
              onClick={() => handleSelect(member.user_id)}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-[#7A95B0] hover:bg-white/[0.05] transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-semibold text-indigo-400">
                  {(member.full_name ?? member.email ?? 'A').slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="truncate">{member.full_name ?? member.email ?? 'Agent'}</span>
              {assignedTo === member.user_id && (
                <Check className="w-3.5 h-3.5 text-indigo-400 ml-auto" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}