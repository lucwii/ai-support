'use client'

import { MessageCircle, X, Send } from 'lucide-react'

interface Props {
  orgName: string
  accentColor: string
  position: 'bottom-right' | 'bottom-left'
  placeholderText: string
  buttonText: string
}

export default function WidgetPreview({ orgName, accentColor, position, placeholderText, buttonText }: Props) {
  const isRight = position === 'bottom-right'

  return (
    <div className="relative w-full h-[340px] bg-[#060D1A] rounded-xl border border-white/[0.06] overflow-hidden select-none">
      {/* Fake website background */}
      <div className="absolute inset-0 p-5 opacity-20">
        <div className="h-3 w-24 bg-white/20 rounded mb-3" />
        <div className="h-2 w-full bg-white/10 rounded mb-2" />
        <div className="h-2 w-5/6 bg-white/10 rounded mb-2" />
        <div className="h-2 w-4/6 bg-white/10 rounded mb-5" />
        <div className="h-2 w-full bg-white/10 rounded mb-2" />
        <div className="h-2 w-3/4 bg-white/10 rounded" />
      </div>

      {/* Chat window */}
      <div
        className={`absolute bottom-14 w-[220px] rounded-2xl overflow-hidden shadow-2xl flex flex-col`}
        style={{
          right: isRight ? 12 : undefined,
          left: isRight ? undefined : 12,
          background: '#0F172A',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5" style={{ backgroundColor: accentColor }}>
          <div>
            <p className="text-white text-[11px] font-semibold leading-tight">{orgName || 'Your Company'}</p>
            <p className="text-white/70 text-[9px]">Support</p>
          </div>
          <X className="w-3 h-3 text-white/70" />
        </div>

        {/* Body */}
        <div className="p-3 flex flex-col gap-2">
          <p className="text-[#94A3B8] text-[10px] leading-relaxed">{placeholderText || 'How can we help you today?'}</p>

          <input
            readOnly
            placeholder="your@email.com"
            className="w-full bg-[#060D1A] border border-white/[0.08] rounded-lg text-[10px] text-[#475569] placeholder-[#334155] px-2.5 py-1.5 focus:outline-none cursor-default"
          />
          <textarea
            readOnly
            placeholder="Describe your issue..."
            rows={2}
            className="w-full bg-[#060D1A] border border-white/[0.08] rounded-lg text-[10px] text-[#475569] placeholder-[#334155] px-2.5 py-1.5 focus:outline-none resize-none cursor-default"
          />

          {/* Submit button */}
          <button
            className="w-full flex items-center justify-center gap-1.5 text-white text-[10px] font-medium py-1.5 rounded-lg transition-none"
            style={{ backgroundColor: accentColor }}
          >
            <Send className="w-2.5 h-2.5" />
            {buttonText || 'Send message'}
          </button>
        </div>
      </div>

      {/* Float button */}
      <button
        className="absolute bottom-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg"
        style={{
          right: isRight ? 12 : undefined,
          left: isRight ? undefined : 12,
          backgroundColor: accentColor,
        }}
      >
        <MessageCircle className="w-4 h-4 text-white" />
      </button>

      {/* Preview label */}
      <div className="absolute top-2 left-0 right-0 flex justify-center">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-[#334155]">Preview</span>
      </div>
    </div>
  )
}
