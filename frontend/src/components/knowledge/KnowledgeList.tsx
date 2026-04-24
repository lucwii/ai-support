'use client'

import { useState } from 'react'
import { Trash2, BookOpen, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import EmptyState from '@/components/ui/EmptyState'
import { Knowledge } from '@/lib/types'

interface KnowledgeListProps {
  knowledge: Knowledge[]
  loading: boolean
  onDelete: (id: string) => Promise<void>
}

export default function KnowledgeList({ knowledge, loading, onDelete }: KnowledgeListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    setConfirmId(null)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div data-testid="knowledge-list-card" className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[#F1F5F9]">Knowledge Chunks</h2>
        {knowledge.length > 0 && (
          <span data-testid="knowledge-chunk-count" className="text-xs font-semibold text-[#475569] bg-white/[0.04] px-2.5 py-1 rounded-lg">
            {knowledge.length} chunk{knowledge.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : knowledge.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No knowledge yet"
          description="Upload some text above to get started"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.06]">
                <th className="text-left text-[11px] font-semibold uppercase tracking-widest text-[#475569] px-3 py-2.5">
                  #
                </th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-widest text-[#475569] px-3 py-2.5">
                  Preview
                </th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-widest text-[#475569] px-3 py-2.5 whitespace-nowrap">
                  Date
                </th>
                <th className="px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {knowledge.map((chunk, i) => (
                <tr
                  key={chunk.id}
                  data-testid="knowledge-chunk-row"
                  className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] transition-colors duration-150"
                >
                  <td className="px-3 py-3.5 text-xs text-[#475569] w-8">{i + 1}</td>
                  <td className="px-3 py-3.5 text-sm text-[#94A3B8] max-w-[420px]">
                    <span className="line-clamp-2 leading-relaxed">
                      {chunk.content}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-xs text-[#475569] whitespace-nowrap">
                    {format(new Date(chunk.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-3 py-3.5 text-right w-24">
                    {confirmId === chunk.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          data-testid="knowledge-cancel-delete"
                          onClick={() => setConfirmId(null)}
                          className="text-xs text-[#475569] hover:text-[#94A3B8] transition-colors duration-150"
                        >
                          Cancel
                        </button>
                        <button
                          data-testid="knowledge-confirm-delete"
                          onClick={() => handleDelete(chunk.id)}
                          className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors duration-150"
                        >
                          Delete
                        </button>
                      </div>
                    ) : deletingId === chunk.id ? (
                      <Loader2 data-testid="knowledge-deleting-spinner" className="w-4 h-4 animate-spin text-[#475569] ml-auto" />
                    ) : (
                      <button
                        data-testid="knowledge-delete-icon-button"
                        onClick={() => setConfirmId(chunk.id)}
                        className="p-1.5 text-[#334155] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-150 ml-auto flex"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
