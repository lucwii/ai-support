const benefits = [
  {
    title: 'Agents stay in control',
    description: 'Edit and approve every AI-suggested response before it goes out. You decide what gets sent.',
  },
  {
    title: 'AI learns continuously',
    description: 'Every ticket improves future suggestions. The more you use it, the smarter it gets.',
  },
  {
    title: 'Reduce response times',
    description: 'Resolve 30–50% of tickets automatically with high-confidence AI responses.',
  },
  {
    title: 'Grounded in your knowledge base',
    description: 'No hallucinations — answers are always based on your own documents and data.',
  },
]

export default function Solution() {
  return (
    <section id="solution" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Left – copy */}
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            The Solution
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-5">
            Automate routine tickets with AI
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            TicketPilot AI uses your company's own knowledge base to generate accurate response suggestions — keeping your team in control while cutting response times in half.
          </p>
          <ul className="flex flex-col gap-4">
            {benefits.map((b) => (
              <li key={b.title} className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{b.title}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{b.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right – visual */}
        <div className="bg-blue-50 rounded-3xl p-8 flex flex-col gap-4">
          {/* Knowledge base card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Knowledge Base</p>
            <div className="flex flex-col gap-2">
              {['product-faq.pdf', 'shipping-policy.txt', 'return-process.csv'].map((file) => (
                <div key={file} className="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="text-xs font-medium text-gray-700">{file}</span>
                  <span className="ml-auto text-xs text-blue-600 font-medium">Indexed</span>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
          </div>

          {/* AI response card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">AI Suggestion Generated</p>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              "Our return policy allows returns within 30 days of purchase. To initiate a return, visit your order history and click 'Return Item'."
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Sources: return-process.csv</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">97% confidence</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
