import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22l-4-9-9-4 20-7z" />
              </svg>
              TicketPilot AI
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              AI-powered support that scales with your team. Built for SaaS and e-commerce.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-white text-sm font-semibold mb-4">Product</p>
            <ul className="flex flex-col gap-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors duration-200">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors duration-200">How It Works</a></li>
              <li><a href="#solution" className="hover:text-white transition-colors duration-200">Solution</a></li>
              <li><Link href="/auth/register" className="hover:text-white transition-colors duration-200">Get Early Access</Link></li>
            </ul>
          </div>

          {/* Trust */}
          <div>
            <p className="text-white text-sm font-semibold mb-4">Trust & Security</p>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                GDPR compliant
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                Secure data isolation
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                Easy to integrate
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                We respect your data
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>&copy; {new Date().getFullYear()} TicketPilot AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
