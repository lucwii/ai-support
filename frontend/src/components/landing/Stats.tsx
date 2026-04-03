import ScrollReveal from '@/components/ui/ScrollReveal'
import CountUp from '@/components/ui/CountUp'

const stats = [
  {
    target: '90', suffix: '%', prefix: '',
    label: 'of tickets resolved automatically',
    color: '#10B981',
    glow: 'rgba(16,185,129,0.15)',
    border: 'rgba(16,185,129,0.2)',
  },
  {
    target: '2', suffix: 's', prefix: '<',
    label: 'average AI response time',
    color: '#6366F1',
    glow: 'rgba(99,102,241,0.15)',
    border: 'rgba(99,102,241,0.2)',
  },
  {
    target: '10', suffix: 'x', prefix: '',
    label: 'faster than human-only support',
    color: '#8B5CF6',
    glow: 'rgba(139,92,246,0.15)',
    border: 'rgba(139,92,246,0.2)',
  },
  {
    target: '200', suffix: '+', prefix: '',
    label: 'businesses powered by SupportAI',
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.15)',
    border: 'rgba(245,158,11,0.2)',
  },
]

export default function Stats() {
  return (
    <section
      className="py-[100px] relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0a0f1e 50%, #021630 100%)' }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 100}>
              <div
                className="glass-card p-7 text-center relative overflow-hidden"
                style={{
                  borderColor: stat.border,
                  boxShadow: `0 4px 32px rgba(0,0,0,0.4), 0 0 40px ${stat.glow}`,
                }}
              >
                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }}
                />

                <div
                  className="font-sora font-extrabold mb-2"
                  style={{
                    fontSize: 'clamp(44px, 5vw, 64px)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    color: stat.color,
                  }}
                >
                  <CountUp target={`${stat.prefix}${stat.target}${stat.suffix}`} />
                </div>
                <p className="text-[13px] leading-snug" style={{ color: '#94A3B8' }}>
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
