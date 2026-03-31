'use client'

import { Search, X } from 'lucide-react'

interface InboxSearchProps {
  value: string
  onChange: (value: string) => void
}

export default function InboxSearch({ value, onChange }: InboxSearchProps) {
  return (
    <div className="px-4 py-3 border-b border-white/[0.06]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#334155] pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by message or email..."
          className="w-full bg-[#060D1A] border border-white/[0.06] rounded-xl text-sm text-[#F1F5F9] placeholder:text-[#334155] pl-9 pr-9 py-2.5 focus:outline-none focus:border-[#6366F1]/50 transition-colors duration-150"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#334155] hover:text-[#94A3B8] transition-colors duration-150"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
