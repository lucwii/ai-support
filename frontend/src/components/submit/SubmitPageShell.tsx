'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import TicketForm from './TicketForm'
import SuccessAutoAnswered from './SuccessAutoAnswered'
import SuccessPending from './SuccessPending'
import { submitTicket } from '@/lib/api/public'
import type { PublicOrganization } from '@/lib/types'

type PageState =
  | { type: 'idle' }
  | { type: 'submitting' }
  | { type: 'success_auto'; answer: string; confidence: number }
  | { type: 'success_pending' }
  | { type: 'error'; message: string }

interface Props {
  organization: PublicOrganization
}

function CompanyHeader({ org }: { org: PublicOrganization }) {
  const [logoError, setLogoError] = useState(false)

  return (
    <div className="flex flex-col items-center mb-6">
      {org.logo_url && !logoError && (
        <div className="mb-3 relative" style={{ height: 48, maxWidth: 160 }}>
          <img
            src={org.logo_url}
            alt={org.name}
            onError={() => setLogoError(true)}
            className="h-12 w-auto max-w-[160px] object-contain"
          />
        </div>
      )}
      <p className="font-sora text-xl font-bold text-slate-900 text-center">{org.name}</p>
    </div>
  )
}

function PoweredByKleo() {
  return (
    <div className="text-center mt-5">
      <span className="text-xs text-slate-400">Powered by </span>
      <Link
        href="/"
        className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors duration-150 no-underline"
      >
        Kleo
      </Link>
    </div>
  )
}

export default function SubmitPageShell({ organization }: Props) {
  const [state, setState] = useState<PageState>({ type: 'idle' })

  const handleSubmit = async (data: { email: string; content: string }) => {
    setState({ type: 'submitting' })
    try {
      const result = await submitTicket({
        organization_id: organization.id,
        content: data.content,
        customer_email: data.email || undefined,
      })

      if (result.status === 'auto_answered' && result.ai_response) {
        setState({
          type: 'success_auto',
          answer: result.ai_response,
          confidence: result.confidence ?? 85,
        })
      } else {
        setState({ type: 'success_pending' })
      }
    } catch {
      setState({
        type: 'error',
        message: 'Something went wrong. Please try again.',
      })
    }
  }

  const handleReset = () => setState({ type: 'idle' })

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[480px]">
        <CompanyHeader org={organization} />

        {/* Card */}
        <div
          className="bg-white border border-[#E2E8F0] rounded-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.08),_0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-300"
          style={{ padding: 'clamp(24px, 5vw, 40px)' }}
        >
          {(state.type === 'idle' || state.type === 'submitting' || state.type === 'error') && (
            <TicketForm
              org={organization}
              onSubmit={handleSubmit}
              loading={state.type === 'submitting'}
              error={state.type === 'error' ? state.message : undefined}
              autoFocus={true}
            />
          )}

          {state.type === 'success_auto' && (
            <SuccessAutoAnswered
              answer={state.answer}
              confidence={state.confidence}
              brandColor={organization.brand_color}
              onNewQuestion={handleReset}
            />
          )}

          {state.type === 'success_pending' && (
            <SuccessPending onNewQuestion={handleReset} />
          )}
        </div>

        <PoweredByKleo />
      </div>
    </main>
  )
}
