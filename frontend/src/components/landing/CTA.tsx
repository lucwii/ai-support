import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-24 bg-blue-600">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Start saving your team hours every week
        </h2>
        <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto">
          Join early access to see how AI can transform your support workflow.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-7 py-3.5 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-200"
          >
            Get Early Access
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <a
            href="mailto:demo@ticketpilot.ai"
            className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-7 py-3.5 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Book a Demo
          </a>
        </div>
        <p className="text-blue-200 text-xs mt-6">No credit card required · GDPR compliant · Easy to integrate</p>
      </div>
    </section>
  )
}
