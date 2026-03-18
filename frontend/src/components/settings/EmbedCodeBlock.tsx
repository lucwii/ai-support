'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface Props {
  orgId: string
  accentColor: string
  position: 'bottom-right' | 'bottom-left'
  placeholderText: string
  buttonText: string
}

export default function EmbedCodeBlock({ orgId, accentColor, position, placeholderText, buttonText }: Props) {
  const [copied, setCopied] = useState(false)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const code = `<script
  src="${appUrl}/widget.js"
  data-org="${orgId}"
  data-color="${accentColor}"
  data-position="${position}"
  data-placeholder="${placeholderText}"
  data-button-text="${buttonText}"
></script>`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#475569]">Embed code</p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#475569] hover:text-[#F1F5F9] transition-colors duration-150"
        >
          {copied
            ? <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied!</span></>
            : <><Copy className="w-3 h-3" />Copy</>
          }
        </button>
      </div>
      <pre className="bg-[#060D1A] border border-white/[0.06] rounded-xl text-xs text-[#94A3B8] px-4 py-3.5 font-mono overflow-x-auto leading-relaxed whitespace-pre">
        {code}
      </pre>
      <p className="text-xs text-[#334155] mt-2">
        Paste this snippet before the closing <code className="text-[#475569]">&lt;/body&gt;</code> tag on your website.
      </p>
    </div>
  )
}
