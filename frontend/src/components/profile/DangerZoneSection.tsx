'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  onDelete: () => Promise<void>
}

export default function DangerZoneSection({ onDelete }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setError(null)
    setLoading(true)
    try {
      await onDelete()
      router.push('/auth/login')
    } catch {
      setError('Failed to delete account. Please try again.')
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setConfirm('')
    setError(null)
  }

  return (
    <>
      <div className="bg-[#0F172A] border border-red-500/20 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-6">
        <h2 className="text-base font-semibold text-red-400 mb-1">Danger Zone</h2>
        <p className="text-sm text-[#475569] mb-5">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium px-4 py-2 rounded-xl border border-red-500/20 transition-colors duration-150"
        >
          <Trash2 className="w-4 h-4" />
          Delete account
        </button>
      </div>

      {/* Confirmation modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] p-6 w-full max-w-md mx-4">
            <h3 className="text-base font-semibold text-[#F1F5F9] mb-2">Delete your account?</h3>
            <p className="text-sm text-[#475569] mb-5">
              This will permanently delete your account and cannot be undone.
              Type <span className="text-red-400 font-mono font-semibold">DELETE</span> to confirm.
            </p>

            <input
              type="text"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full bg-[#060D1A] border border-white/[0.06] rounded-xl text-sm text-[#F1F5F9] placeholder-[#334155] px-4 py-2.5 focus:outline-none focus:border-red-500/50 transition-colors duration-150 mb-4"
            />

            {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                disabled={loading}
                className="text-sm text-[#475569] hover:text-[#F1F5F9] px-4 py-2 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={confirm !== 'DELETE' || loading}
                className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
