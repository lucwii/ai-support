'use client'

import { useState } from 'react'
import { Flag, ChevronDown, Check } from 'lucide-react'
import { useSetPriority } from '@/hooks/useSetPriority'
import type { TicketPriority } from '@/lib/types'

interface PriorityOption {
  value: TicketPriority
  label: string
  dotClass: string
  textClass: string
}

const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 'low',    label: 'Low',    dotClass: 'bg-slate-400',  textClass: 'text-slate-400' },
  { value: 'medium', label: 'Medium', dotClass: 'bg-amber-400',  textClass: 'text-amber-400' },
  { value: 'high',   label: 'High',   dotClass: 'bg-orange-400', textClass: 'text-orange-400' },
  { value: 'urgent', label: 'Urgent', dotClass: 'bg-red-500',    textClass: 'text-red-400' },
]

interface PriorityDropdownProps {
  ticketId: string
  priority: TicketPriority
  onChanged: (priority: TicketPriority) => void
}

export default function PriorityDropdown({ ticketId, priority, onChanged }: PriorityDropdownProps) {
  const [open, setOpen] = useState(false)
  const { setPriority, loading } = useSetPriority()

  const current = PRIORITY_OPTIONS.find((o) => o.value === priority) ?? PRIORITY_OPTIONS[1]

  const handleSelect = async (value: TicketPriority) => {
    setOpen(false)
    if (value === priority) return
    const updated = await setPriority(ticketId, value)
    if (updated) onChanged(value)
  }

  return (
    <div className="relative">
      <button
        data-testid="priority-dropdown"
        onClick={() => setOpen((prev) => !prev)}
        disabled={loading}
        className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors duration-150 disabled:opacity-50"
      >
        <div className="w-5 h-5 rounded-full bg-white/[0.05] flex items-center justify-center flex-shrink-0">
          <Flag className={`w-3 h-3 ${current.textClass}`} />
        </div>
        <span
          data-testid="priority-display"
          className={`text-sm flex-1 ${current.textClass}`}
        >
          {current.label}
        </span>
        <ChevronDown className={`w-3 h-3 text-[#3D5570] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-[#0A1628] border border-white/[0.08] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
          {PRIORITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              data-testid={`priority-option-${option.value}`}
              onClick={() => handleSelect(option.value)}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-[#7A95B0] hover:bg-white/[0.05] transition-colors"
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${option.dotClass}`} />
              <span className={option.textClass}>{option.label}</span>
              {priority === option.value && (
                <Check className="w-3.5 h-3.5 text-indigo-400 ml-auto" />
            )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
