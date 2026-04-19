'use client'

import { useState, useRef, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import type { PublicOrganization } from '@/lib/types'

interface Props {
  org: PublicOrganization
  onSubmit: (data: { email: string; content: string }) => void
  loading?: boolean
  error?: string
  autoFocus?: boolean
}

const MAX_CHARS = 2000
const WARN_CHARS = 1800
const MIN_CONTENT = 10

export default function TicketForm({ org, onSubmit, loading, error, autoFocus = false }: Props) {
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (autoFocus) {
      textareaRef.current?.focus()
    }
  }, [autoFocus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    if (content.trim().length < MIN_CONTENT) {
      setValidationError('Please describe your issue in more detail (at least 10 characters)')
      return
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('Please enter a valid email address')
      return
    }

    onSubmit({ email, content })
  }

  const charsLeft = content.length
  const isOverWarn = charsLeft > WARN_CHARS
  const isDisabled = loading || content.trim().length < MIN_CONTENT

  const focusRingStyle = {
    '--focus-color': org.brand_color,
  } as React.CSSProperties

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Headline */}
      <h1
        className="font-sora font-bold text-slate-900 tracking-tight mb-2"
        style={{ fontSize: 'clamp(20px, 4vw, 28px)', letterSpacing: '-0.02em' }}
      >
        {org.support_page_headline}
      </h1>
      <p className="text-sm text-slate-500 mb-7 leading-relaxed">
        Our AI will answer instantly. A human will follow up if needed.
      </p>

      <div className="flex flex-col gap-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Your email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full h-12 border border-[#E2E8F0] rounded-[10px] px-4 text-[15px] text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            style={focusRingStyle}
            onFocus={(e) => (e.target.style.borderColor = org.brand_color)}
            onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
          />
        </div>

        {/* Question */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Your question <span className="text-red-400">*</span>
          </label>
          <textarea
            ref={textareaRef}
            id="content"
            required
            placeholder="Describe your issue or question in detail..."
            value={content}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                setContent(e.target.value)
                if (validationError) setValidationError(null)
              }
            }}
            disabled={loading}
            maxLength={MAX_CHARS}
            className="w-full border border-[#E2E8F0] rounded-[10px] p-4 text-[15px] text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none transition-all duration-150 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: 140, ...focusRingStyle }}
            onFocus={(e) => (e.target.style.borderColor = org.brand_color)}
            onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
          />

          <div className="flex items-start justify-between mt-1.5 gap-2">
            <div>
              {validationError && (
                <p className="text-xs text-red-500" role="alert">{validationError}</p>
              )}
            </div>
            <span className={`text-xs shrink-0 ${isOverWarn ? 'text-amber-500' : 'text-slate-400'}`}>
              {charsLeft} / {MAX_CHARS}
            </span>
          </div>
        </div>

        {/* API error */}
        {error && (
          <div
            className="bg-red-50 border border-red-200 rounded-xl px-4 py-3"
            role="alert"
          >
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isDisabled}
          className="w-full h-[52px] rounded-xl text-[15px] font-semibold text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: org.brand_color,
            filter: isDisabled ? undefined : undefined,
          }}
          onMouseEnter={(e) => {
            if (!isDisabled) (e.currentTarget.style.filter = 'brightness(0.92)')
          }}
          onMouseLeave={(e) => {
            (e.currentTarget.style.filter = '')
          }}
          onMouseDown={(e) => {
            if (!isDisabled) (e.currentTarget.style.transform = 'translateY(0)')
          }}
          onMouseUp={(e) => {
            if (!isDisabled) (e.currentTarget.style.transform = 'translateY(-1px)')
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </span>
          ) : (
            'Send Question'
          )}
        </button>
      </div>
    </form>
  )
}
