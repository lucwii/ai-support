import Link from 'next/link'

function TicketMockup() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Stats row */}
      <div className="flex gap-3 mb-3">
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Open Tickets</p>
          <p className="text-2xl font-bold text-gray-900">24</p>
        </div>
        <div className="flex-1 bg-blue-600 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-blue-200 mb-1">AI Resolved</p>
          <p className="text-2xl font-bold text-white">68%</p>
        </div>
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Avg. Response</p>
          <p className="text-2xl font-bold text-gray-900">4s</p>
        </div>
      </div>

      {/* Main ticket card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400">#1042</span>
            <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full">Open</span>
          </div>
          <span className="text-xs text-gray-400">2 min ago</span>
        </div>

        <p className="text-sm font-medium text-gray-800 mb-4">
          "How do I reset my password? I can't find the option in the settings."
        </p>

        {/* AI suggestion box */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
                <path d="M12 8v4l3 3" />
              </svg>
              <span className="text-xs font-semibold text-blue-700">AI Suggestion</span>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">94% confidence</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            "To reset your password, go to <strong>Settings → Security → Reset Password</strong>. Enter your email and we'll send a reset link within 2 minutes."
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 text-xs font-medium border border-gray-200 text-gray-600 py-2 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors">
            Edit Response
          </button>
          <button className="flex-1 text-xs font-medium bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Left – copy */}
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Now in Early Access
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            AI-powered support that scales with your team
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            TicketPilot AI reads your company's knowledge base and suggests accurate responses to customer tickets — so your agents can focus on complex problems, not repetitive questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Get Early Access
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-medium hover:border-blue-600 hover:text-blue-600 transition-colors duration-200"
            >
              Request a Demo
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-3">No credit card required</p>
        </div>

        {/* Right – mockup */}
        <div className="hidden md:block animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <TicketMockup />
        </div>
      </div>
    </section>
  )
}
