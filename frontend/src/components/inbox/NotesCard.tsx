'use client'

import { useState } from 'react'
import { PenLine, Plus, Loader2, StickyNote, Trash2, AlertTriangle, Pencil } from 'lucide-react'
import { format } from 'date-fns'
import { useTicketNotes } from '@/hooks/useTicketNotes'
import AddNoteModal from './AddNoteModal'

interface NotesCardProps {
  ticketId: string
}

export default function NotesCard({ ticketId }: NotesCardProps) {
  const { notes, loading, submitting, error, addNote, deleteNote, updateNote } = useTicketNotes(ticketId)
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState<string | null>(null)

  const handleSubmit = async (content: string) => {
    const ok = await addNote(content)
    if (ok) setModalOpen(false)
  }

  const handleDelete = async (noteId: string) => {
    setDeleting(noteId)
    await deleteNote(noteId)
    setDeleting(null)
    setConfirmDeleteId(null)
  }

  const openEdit = (noteId: string, currentContent: string) => {
    setConfirmDeleteId(null)
    setEditingId(noteId)
    setEditContent(currentContent)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditContent('')
  }

  const handleUpdate = async (noteId: string) => {
    if (!editContent.trim() || saving) return
    setSaving(noteId)
    const ok = await updateNote(noteId, editContent.trim())
    setSaving(null)
    if (ok) cancelEdit()
  }

  return (
    <>
      <div
        data-testid="notes-card"
        className="bg-[#0A1628] border border-amber-500/[0.14] rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col"
        style={{ minHeight: '220px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-amber-500/[0.08]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <PenLine className="w-3 h-3 text-amber-400/70" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-500/50">
              Internal Notes
            </p>
          </div>
          <button
            data-testid="add-note-button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/35 hover:-translate-y-px transition-all duration-150"
          >
            <Plus className="w-3 h-3" />
            Add Note
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: '320px' }}>
          {loading ? (
            <div className="flex items-center gap-2 px-5 py-6 text-[#334155]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <p className="text-xs">Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div
              data-testid="notes-empty-state"
              className="flex flex-col items-center justify-center py-10 px-5 gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/[0.06] border border-amber-500/[0.12] flex items-center justify-center">
                <StickyNote className="w-4.5 h-4.5 text-amber-500/40" />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-[#2D4060]">No notes yet</p>
                <p className="text-[11px] text-[#1E3050] mt-0.5">Visible only to agents</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-amber-500/[0.06]">
              {notes.map((note) => (
                <div
                  key={note.id}
                  data-testid="note-item"
                  className="group px-5 py-4 hover:bg-amber-500/[0.02] transition-colors duration-100"
                >
                  {editingId === note.id ? (
                    /* ── Edit mode ── */
                    <div>
                      <textarea
                        data-testid="edit-note-textarea"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        maxLength={5000}
                        autoFocus
                        className="w-full bg-white/[0.03] border border-amber-500/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/20 rounded-xl px-3 py-2.5 text-sm text-[#C8D8E8] placeholder:text-[#334155] resize-none transition-colors duration-150"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-[#2D4060]">{editContent.length}/5000</span>
                        <div className="flex items-center gap-2">
                          <button
                            data-testid="cancel-edit-button"
                            onClick={cancelEdit}
                            className="px-3 py-1 rounded-lg text-[11px] font-medium bg-white/[0.04] border border-white/[0.08] text-[#475569] hover:text-[#94A3B8] transition-all duration-100"
                          >
                            Cancel
                          </button>
                          <button
                            data-testid="save-note-button"
                            onClick={() => handleUpdate(note.id)}
                            disabled={saving === note.id || !editContent.trim()}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/10 border border-amber-500/25 text-amber-300 hover:bg-amber-500/20 transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {saving === note.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : null}
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ── View mode ── */
                    <>
                      <p className="text-sm text-[#C8D8E8] whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="w-5 h-5 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                          <span className="text-[9px] font-bold text-amber-400 uppercase">
                            {note.author_name.charAt(0)}
                          </span>
                        </div>
                        <p className="text-[11px] font-medium text-[#3D5570]">
                          {note.author_name}
                        </p>
                        <span className="text-[#1E3050]">·</span>
                        <p className="text-[11px] text-[#2D4060]">
                          {format(new Date(note.created_at), 'MMM d · HH:mm')}
                        </p>

                        {/* Action buttons — appear on hover */}
                        <div className="ml-auto flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          {confirmDeleteId === note.id ? (
                            <>
                              <span className="flex items-center gap-1 text-[10px] text-red-400/80">
                                <AlertTriangle className="w-3 h-3" />
                                Delete?
                              </span>
                              <button
                                data-testid="confirm-delete-yes"
                                onClick={() => handleDelete(note.id)}
                                disabled={deleting === note.id}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/15 border border-red-500/25 text-red-400 hover:bg-red-500/25 transition-all duration-100 disabled:opacity-50"
                              >
                                {deleting === note.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  'Yes'
                                )}
                              </button>
                              <button
                                data-testid="confirm-delete-no"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/[0.05] border border-white/[0.08] text-[#475569] hover:text-[#94A3B8] transition-all duration-100"
                              >
                                No
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                data-testid="edit-note-button"
                                onClick={() => openEdit(note.id, note.content)}
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-[#2D4060] hover:text-amber-400 hover:bg-amber-500/10 transition-all duration-150"
                                title="Edit note"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                data-testid="delete-note-button"
                                onClick={() => setConfirmDeleteId(note.id)}
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-[#2D4060] hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
                                title="Delete note"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
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
