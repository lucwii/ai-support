'use client'

import { useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'

interface UploadResult {
  totalChunks: number
  savedChunks: number
}

interface KnowledgeUploadFormProps {
  onUpload: (content: string) => Promise<UploadResult>
}

export default function KnowledgeUploadForm({ onUpload }: KnowledgeUploadFormProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (content.trim().length < 10) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await onUpload(content.trim())
      setResult(res)
      setContent('')
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const charCount = content.length

  return (
    <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-6">
      <h2 className="text-base font-semibold text-[#F1F5F9] mb-4">Add Knowledge</h2>

      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
          setResult(null)
          setError(null)
        }}
        placeholder="Paste your text here — product descriptions, FAQs, policies, guides..."
        rows={8}
        className="w-full bg-[#060D1A] border border-white/[0.06] rounded-xl text-sm text-[#F1F5F9] placeholder-[#334155] p-4 resize-none focus:outline-none focus:border-[#6366F1]/50 transition-colors duration-150"
      />

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-[#334155]">
          {charCount > 0 ? (
            <span className={charCount < 10 ? 'text-amber-500/70' : 'text-[#475569]'}>
              {charCount} characters
            </span>
          ) : (
            <span>Minimum 10 characters</span>
          )}
        </span>

        <button
          onClick={handleSubmit}
          disabled={loading || charCount < 10}
          className="inline-flex items-center gap-2 bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150 hover:-translate-y-px disabled:hover:translate-y-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="mt-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <p className="text-sm text-emerald-400 font-medium">
            Uploaded — {result.savedChunks} chunk{result.savedChunks !== 1 ? 's' : ''} created
          </p>
        </div>
      )}

      {error && (
        <div className="mt-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}
