import ScrollReveal from '@/components/ui/ScrollReveal'

const testimonials = [
  {
    quote: 'We went from 200 daily tickets to 40 that actually need human attention. Our team now focuses on real problems instead of answering the same questions all day.',
    name: 'Sarah K.',
    role: 'Head of Support',
    company: 'ShopFlow',
    initials: 'SK',
    stars: 5,
  },
  {
    quote: 'The confidence scoring is a game-changer. We trust the AI responses that come through because we know when it\'s unsure — and it routes them to us automatically.',
    name: 'Marcus T.',
    role: 'CTO',
    company: 'Pipecraft',
    initials: 'MT',
    stars: 5,
  },
  {
    quote: 'Setup took 20 minutes. We pasted our docs, connected it, and by the next morning 70% of overnight tickets were already resolved. Genuinely incredible.',
    name: 'Priya M.',
    role: 'Operations Lead',
    company: 'Zendara',
    initials: 'PM',
    stars: 5,
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-[120px]" style={{ background: 'var(--bg-navy)' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <p className="text-[12px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: '#6366F1' }}>
            Customers
          </p>
          <h2
            className="font-sora font-bold"
            style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.02em', color: '#FFFFFF' }}
          >
            Support teams love SupportAI
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 100}>
              <div className="glass-card p-7 h-full flex flex-col">
                {/* Quote mark */}
                <div
                  className="font-sora font-extrabold mb-4 leading-none select-none"
                  style={{ fontSize: '64px', lineHeight: 0.7, color: 'rgba(99,102,241,0.25)' }}
                >
                  &ldquo;
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <svg key={j} width="15" height="15" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[15px] leading-[1.75] flex-1 mb-6" style={{ color: '#CBD5E1' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold" style={{ color: '#F1F5F9' }}>{t.name}</p>
                    <p className="text-[12px]" style={{ color: '#64748B' }}>{t.role}, {t.company}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
