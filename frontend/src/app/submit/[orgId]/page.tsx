'use client'

import { useState } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { CheckCircle, ExternalLink, Zap } from 'lucide-react'
import { SubmitTicketResult } from '@/hooks/useSubmitTicket'
import SubmitTicketForm from '@/components/public/SubmitTicketForm'

interface PageProps {
  params: Promise<{ orgId: string }>
}

export default function SubmitTicketPage({ params }: PageProps) {
  const { orgId } = use(params)
  const [result, setResult] = useState<SubmitTicketResult | null>(null)

  if (result) {
    return <SuccessView result={result} />
  }

  return (
    <PublicLayout>
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-xl font-semibold text-[#E2E8F0]">Submit a support ticket</h1>
        <p className="text-sm text-[#475569]">
          Describe your issue and our AI will try to resolve it instantly.
        </p>
      </div>

      <SubmitTicketForm orgId={orgId} onSuccess={setResult} />
    </PublicLayout>
  )
}

function SuccessView({ result }: { result: SubmitTicketResult }) {
  return (
    <PublicLayout>
      <div className="flex flex-col items-center text-center gap-6 py-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-emerald-400" />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-[#E2E8F0]">Ticket submitted!</h2>
          <p className="text-sm text-[#475569] max-w-xs">
            {result.message}
          </p>
        </div>

        <div className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-left">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#334155] mb-1">
            Ticket ID
          </p>
          <p className="text-sm font-mono text-[#94A3B8]">#{result.ticket.id.slice(0, 8)}</p>
        </div>

        <Link
          href={`/ticket/${result.ticket.id}`}
          className="flex items-center gap-2 w-full justify-center bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl px-5 py-3 transition-colors duration-150"
        >
          <ExternalLink className="w-4 h-4" />
          Track your ticket
        </Link>
      </div>
    </PublicLayout>
  )
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060D1A] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-sm font-semibold text-[#94A3B8]">Support</span>
        </div>

        <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.5)] p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
