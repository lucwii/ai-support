'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, Save, Loader2, Link2, ExternalLink } from 'lucide-react'
import { useUpdateOrganization } from '@/hooks/useUpdateOrganization'
import type { Organization } from '@/lib/types'

interface Props {
  organization: Organization
  onUpdated: (org: Organization) => void
}

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://kleo.app'

const inputClass =
  'w-full bg-[#060D1A] border border-white/[0.06] rounded-xl text-sm text-[#F1F5F9] placeholder-[#334155] px-4 py-2.5 focus:outline-none focus:border-[#6366F1]/50 transition-colors duration-150'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#475569] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

export default function SupportLinkSection({ organization, onUpdated }: Props) {
  const [copied, setCopied] = useState(false)
  const [headline, setHeadline] = useState(organization.support_page_headline ?? 'How can we help you?')
  const [brandColor, setBrandColor] = useState(organization.brand_color ?? '#6366F1')
  const [hexInput, setHexInput] = useState(organization.brand_color ?? '#6366F1')
  const [logoUrl, setLogoUrl] = useState(organization.logo_url ?? '')
  const [logoPreviewError, setLogoPreviewError] = useState(false)
  const [success, setSuccess] = useState(false)
  const { update, loading, error } = useUpdateOrganization()

  const slug = organization.slug
  const supportUrl = slug ? `${BASE_URL}/submit/${slug}` : null

  useEffect(() => {
    setHeadline(organization.support_page_headline ?? 'How can we help you?')
    setBrandColor(organization.brand_color ?? '#6366F1')
    setHexInput(organization.brand_color ?? '#6366F1')
    setLogoUrl(organization.logo_url ?? '')
  }, [organization])

  const handleCopy = () => {
    if (!supportUrl) return
    navigator.clipboard.writeText(supportUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleColorPickerChange = (val: string) => {
    setBrandColor(val)
    setHexInput(val)
    setSuccess(false)
  }

  const handleHexChange = (val: string) => {
    setHexInput(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setBrandColor(val)
    }
    setSuccess(false)
  }

  const handleSave = async () => {
    try {
      const updated = await update({
        support_page_headline: headline,
        brand_color: brandColor,
        logo_url: logoUrl || undefined,
      })
      onUpdated(updated)
      setSuccess(true)
    } catch {
      // error shown via hook
    }
  }

  const showLogoPreview = logoUrl && !logoPreviewError

  return (
    <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-6 mb-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-7 h-7 rounded-lg bg-[#6366F1]/20 flex items-center justify-center shrink-0">
          <Link2 className="w-3.5 h-3.5 text-[#6366F1]" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[#F1F5F9] leading-none">Your Support Link</h2>
          <p className="text-[11px] text-[#475569] mt-0.5">
            Share this link with your customers
          </p>
        </div>
      </div>

      {/* Support URL row */}
      {slug ? (
        <div className="flex gap-2 mb-6">
          <input
            readOnly
            value={supportUrl ?? ''}
            className={`${inputClass} flex-1 cursor-default select-all`}
          />
          <button
            onClick={handleCopy}
            title="Copy link"
            className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#273344] border border-white/[0.06] text-[#94A3B8] hover:text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150 shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <a
            href={supportUrl ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new tab"
            className="flex items-center justify-center bg-[#1E293B] hover:bg-[#273344] border border-white/[0.06] text-[#94A3B8] hover:text-white px-3 py-2 rounded-xl transition-all duration-150"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      ) : (
        <div className="mb-6 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3">
          <p className="text-sm text-amber-400">
            Save your settings below to activate your support page link.
          </p>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-white/[0.04] mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#334155] mt-4 mb-4">
          Customize Your Page
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Headline */}
        <Field label="Page headline">
          <input
            type="text"
            value={headline}
            onChange={(e) => { setHeadline(e.target.value); setSuccess(false) }}
            placeholder="How can we help you?"
            className={inputClass}
          />
        </Field>

        {/* Brand color */}
        <Field label="Brand color">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <input
                type="color"
                value={brandColor}
                onChange={(e) => handleColorPickerChange(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div
                className="w-10 h-10 rounded-lg border-2 border-white/10 cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: brandColor }}
              />
            </div>
            <input
              type="text"
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="#6366F1"
              maxLength={7}
              className={`${inputClass} font-mono`}
            />
          </div>
        </Field>

        {/* Logo URL */}
        <Field label="Logo URL">
          <input
            type="url"
            value={logoUrl}
            onChange={(e) => {
              setLogoUrl(e.target.value)
              setLogoPreviewError(false)
              setSuccess(false)
            }}
            placeholder="https://yourcompany.com/logo.png"
            className={inputClass}
          />
          {showLogoPreview && (
            <div className="mt-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06] flex items-center gap-3">
              <img
                src={logoUrl}
                alt="Logo preview"
                onError={() => setLogoPreviewError(true)}
                className="h-8 w-auto max-w-[120px] object-contain"
              />
              <span className="text-[11px] text-[#475569]">Logo preview</span>
            </div>
          )}
        </Field>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.06]">
        <div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-emerald-400">Changes saved</p>}
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150 hover:-translate-y-px disabled:hover:translate-y-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </div>
  )
}
