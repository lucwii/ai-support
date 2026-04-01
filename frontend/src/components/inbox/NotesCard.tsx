'use client'

import { useState } from 'react'
import { StickyNote, Plus, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { useTicketNotes } from '@/hooks/useTicketNotes'
import AddNoteModal from './AddNoteModal'

interface NotesCardProps {
  ticketId: string
}

export default function NotesCard({ ticketId }: NotesCardProps) {
  const { notes, loading, submitting, error, addNote } = useTicketNotes(ticketId)
  const [modalOpen, setModalOpen] = useState(false)

  const handleSubmit = async (content: string) => {
    const ok = await addNote(content)
    if (ok) setModalOpen(false)
  }

  return (
    <>
      <div data-testid="notes-card" className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <StickyNote className="w-3.5 h-3.5 text-[#475569]" />
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#334155]">
              Internal Notes
            </p>
          </div>
          <button
            data-testid="add-note-button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all duration-150"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Note
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center gap-2 py-4 text-[#334155]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <p className="text-xs">Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div data-testid="notes-empty-state" className="flex flex-col items-center justify-center py-6 gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/[0.06] border border-amber-500/[0.12] flex items-center justify-center">
              <StickyNote className="w-4 h-4 text-amber-500/50" />
            </div>
            <p className="text-xs text-[#334155]">No internal notes yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notes.map((note) => (
              <div
                key={note.id}
                data-testid="note-item"
                className="bg-amber-500/[0.04] border border-amber-500/[0.10] rounded-xl px-4 py-3"
              >
                <p className="text-sm text-[#CBD5E1] whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[8px] font-bold text-amber-400 uppercase">
                      {note.author_name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#475569]">
                    {note.author_name}
                  </p>
                  <span className="text-[#2D3F55]">·</span>
                  <p className="text-[11px] text-[#334155]">
                    {format(new Date(note.created_at), 'MMM d, yyyy · HH:mm')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddNoteModal
        open={modalOpen}
        submitting={submitting}
        error={error}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  )
}
