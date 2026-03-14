'use client'

import { useState, FormEvent } from 'react'
import { Mail, MessageSquare, Loader2, Send } from 'lucide-react'
import { useSubmitTicket, SubmitTicketResult } from '@/hooks/useSubmitTicket'

interface SubmitTicketFormProps {
  orgId: string
  onSuccess: (result: SubmitTicketResult) => void
}

export default function SubmitTicketForm({ orgId, onSuccess }: SubmitTicketFormProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const { submit, loading, error } = useSubmitTicket()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const result = await submit({
      organization_id: orgId,
      content: message,
      customer_email: email || undefined,
    })
    if (result) onSuccess(result)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-widest text-[#475569]">
          Your email <span className="normal-case font-normal text-[#334155]">(optional)</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#334155]" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-[#CBD5E1] placeholder-[#2D3F55] outline-none focus:border-indigo-500/50 focus:bg-indigo-500/[0.04] transition-colors duration-150"
          />
        </div>
        <p className="text-[11px] text-[#334155]">
          We&apos;ll send the answer to this address if AI resolves it automatically.
        </p>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-widest text-[#475569]">
          Your question <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-[#334155]" />
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your issue or question..."
            rows={5}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-[#CBD5E1] placeholder-[#2D3F55] outline-none focus:border-indigo-500/50 focus:bg-indigo-500/[0.04] transition-colors duration-150 resize-none"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 bg-red-500/[0.07] border border-red-500/20 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !message.trim()}
        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl px-5 py-3 transition-colors duration-150"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit ticket
          </>
        )}
      </button>
    </form>
  )
}
