import Link from 'next/link'
import { SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div
          className="bg-white border border-[#E2E8F0] rounded-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.08),_0_4px_16px_rgba(0,0,0,0.04)] p-10 text-center"
        >
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <SearchX className="w-8 h-8 text-slate-300" />
            </div>
          </div>
          <h1 className="font-sora text-xl font-bold text-slate-900 mb-2">
            Page not found
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed mb-8">
            This support page does not exist or has been removed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-indigo-500 hover:text-indigo-600 font-medium transition-colors duration-150"
          >
            Learn about Kleo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="text-center mt-6">
          <span className="text-xs text-slate-400">Powered by </span>
          <Link href="/" className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors duration-150">
            Kleo
          </Link>
        </div>
      </div>
    </main>
  )
}
