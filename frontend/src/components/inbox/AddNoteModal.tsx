'use client'

import { useState, useEffect, useRef } from 'react'
import { X, StickyNote, Loader2, Plus } from 'lucide-react'

interface AddNoteModalProps {
  open: boolean
  submitting: boolean
  error: string | null
  onClose: () => void
  onSubmit: (content: string) => Promise<void>
}

export default function AddNoteModal({ open, submitting, error, onClose, onSubmit }: AddNoteModalProps) {
  const [content, setContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open) {
      setContent('')
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  const handleSubmit = async () => {
    if (!content.trim() || submitting) return
    await onSubmit(content.trim())
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#0F172A] border border-white/[0.08] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.6)] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <StickyNote className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#F1F5F9]">Add Internal Note</p>
              <p className="text-[11px] text-[#475569]">Only visible to agents</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#475569] hover:text-[#94A3B8] hover:bg-white/[0.06] transition-all duration-150"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your internal note here..."
          rows={5}
          maxLength={5000}
          className="w-full bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.12] focus:border-amber-500/40 focus:outline-none focus:ring-1 focus:ring-amber-500/20 rounded-xl px-4 py-3 text-sm text-[#CBD5E1] placeholder:text-[#334155] resize-none transition-colors duration-150"
        />

        <div className="flex items-center justify-between mt-1.5 mb-4">
          {error ? (
            <p className="text-xs text-red-400">{error}</p>
          ) : (
            <span />
          )}
          <p className="text-[11px] text-[#334155]">{content.length}/5000</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-white/[0.04] border border-white/[0.08] text-[#94A3B8] hover:bg-white/[0.07] hover:text-[#F1F5F9] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !content.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-amber-500/10 border border-amber-500/25 text-amber-300 hover:bg-amber-500/20 hover:-translate-y-px transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Add Note
          </button>
        </div>
      </div>
    </div>
  )
}
