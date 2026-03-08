const steps = [
  {
    number: '01',
    title: 'Upload your documents',
    description:
      'PDFs, TXT, CSV — your internal knowledge base becomes AI-readable. Upload once, always up to date.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'AI reads and indexes',
    description:
      'Vector embeddings let TicketPilot understand context and retrieve relevant information instantly from your knowledge base.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Suggest responses',
    description:
      'When a ticket arrives, AI generates an accurate, grounded response suggestion with a confidence score.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Agent review & send',
    description:
      'Confidence above 90% → auto-send. Below 90% → agent edits and sends. Full control, always.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase border border-blue-100">
            How It Works
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            From question to answer in seconds
          </h2>
          <p className="text-lg text-gray-600">
            Four simple steps. Zero extra overhead for your team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl p-7 border border-gray-100 hover:-translate-y-1 transition-transform duration-300 relative"
            >
              {/* Connector line – visible only on lg */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 right-0 w-6 h-px bg-blue-200 translate-x-full z-10" />
              )}
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  {step.icon}
                </div>
                <span className="text-3xl font-bold text-blue-100">{step.number}</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
