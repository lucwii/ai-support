'use client'

import { useState } from 'react'
import { CheckCircle2, Sparkles } from 'lucide-react'

interface Props {
  answer: string
  confidence: number
  brandColor: string
  onNewQuestion: () => void
}

type Feedback = 'none' | 'yes' | 'no'

export default function SuccessAutoAnswered({ answer, confidence, brandColor, onNewQuestion }: Props) {
  const [feedback, setFeedback] = useState<Feedback>('none')

  const confidenceColor =
    confidence >= 90 ? 'text-emerald-600' :
    confidence >= 70 ? 'text-indigo-600' :
    'text-amber-600'

  const confidenceBarColor =
    confidence >= 90 ? 'bg-emerald-500' :
    confidence >= 70 ? 'bg-indigo-500' :
    'bg-amber-500'

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <p className="text-base font-semibold text-slate-900 leading-tight">Here is your answer</p>
          <p className="text-xs text-slate-400 mt-0.5">Answered instantly by AI</p>
        </div>
      </div>

      {/* Answer block */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-4">
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{answer}</p>
      </div>

      {/* Confidence row */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-slate-400" />
          <span className="text-xs text-slate-400">AI confidence</span>
        </div>
        <span className={`text-xs font-semibold ${confidenceColor}`}>{confidence}%</span>
      </div>
      <div className="h-1 rounded-full bg-slate-100 mb-5 overflow-hidden">
        <div
          className={`h-1 rounded-full transition-all duration-700 ${confidenceBarColor}`}
          style={{ width: `${confidence}%` }}
        />
      </div>

      {/* Helpful feedback */}
      <div className="mt-5">
        <p className="text-sm text-slate-500 mb-3">Was this helpful?</p>
        {feedback === 'none' && (
          <div className="flex gap-2">
            <button
              onClick={() => setFeedback('yes')}
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 cursor-pointer"
            >
              Yes, thanks!
            </button>
            <button
              onClick={() => setFeedback('no')}
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 cursor-pointer"
            >
              No, I need more help
            </button>
          </div>
        )}
        {feedback === 'yes' && (
          <p className="text-sm text-emerald-600 font-medium">✓ Glad we could help!</p>
        )}
        {feedback === 'no' && (
          <p className="text-sm text-slate-500">A human agent will follow up on your email soon.</p>
        )}
      </div>

      {/* New question */}
      <div className="mt-7 pt-6 border-t border-slate-100 text-center">
        <button
          onClick={onNewQuestion}
          className="text-sm text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors duration-150 cursor-pointer"
        >
          Ask another question
        </button>
      </div>
    </div>
  )
}
