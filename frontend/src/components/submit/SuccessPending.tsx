'use client'

import { Clock, Check, Mail } from 'lucide-react'

interface Props {
  onNewQuestion: () => void
}

export default function SuccessPending({ onNewQuestion }: Props) {
  return (
    <div className="text-center">
      {/* Icon */}
      <div className="flex justify-center mb-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
          <Clock className="w-7 h-7 text-indigo-500" />
        </div>
      </div>

      <h2 className="font-sora text-xl font-bold text-slate-900 mb-2">
        We received your question
      </h2>
      <p className="text-sm text-slate-500 leading-relaxed max-w-[320px] mx-auto mb-7">
        Our team will review your question and get back to you as soon as possible.
      </p>

      <div className="border-t border-slate-100 my-6" />

      {/* Steps */}
      <div className="text-left space-y-3 mb-8">
        {[
          { icon: Check, text: 'Your question has been received', color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { icon: Clock, text: 'Our team is reviewing it', color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { icon: Mail, text: 'You will receive a reply by email', color: 'text-slate-400', bg: 'bg-slate-50' },
        ].map(({ icon: Icon, text, color, bg }, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-3.5 h-3.5 ${color}`} />
            </div>
            <span className="text-sm text-slate-600">{text}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onNewQuestion}
        className="text-sm text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors duration-150 cursor-pointer"
      >
        Ask another question
      </button>
    </div>
  )
}
