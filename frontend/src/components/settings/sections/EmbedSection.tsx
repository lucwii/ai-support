'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import type { Organization } from '@/lib/types'

function CopyField({ label, description, value }: { label: string; description: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="py-4 border-b border-white/[0.06] last:border-0">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[#475569] mb-1">{label}</p>
      <p className="text-xs text-[#334155] mb-2">{description}</p>
      <div className="flex items-center gap-2">
        <code className="flex-1 bg-[#060D1A] border border-white/[0.06] rounded-xl text-xs text-[#94A3B8] px-4 py-2.5 truncate font-mono">
          {value}
        </code>
        <button
          onClick={handleCopy}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#475569] hover:text-[#F1F5F9] transition-colors duration-150"
          title="Copy to clipboard"
        >
          {copied
            ? <Check className="w-3.5 h-3.5 text-emerald-400" />
            : <Copy className="w-3.5 h-3.5" />
          }
        </button>
      </div>
    </div>
  )
}

interface Props {
  organization: Organization
}

export default function EmbedSection({ organization }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const submitUrl = organization.slug
    ? `${baseUrl}/submit/${organization.slug}`
    : `${baseUrl}/submit/${organization.id}`

  return (
    <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-6">
      <h2 className="text-base font-semibold text-[#F1F5F9] mb-1">Embed & Integration</h2>
      <p className="text-sm text-[#475569] mb-5">
        Use these values to connect Kleo to your website or external tools.
      </p>

      <CopyField
        label="Submit link"
        description="Share this link with customers so they can submit support tickets."
        value={submitUrl}
      />
      <CopyField
        label="Organization ID"
        description="Use this ID when integrating with third-party tools or webhooks."
        value={organization.id}
      />
    </div>
  )
}
