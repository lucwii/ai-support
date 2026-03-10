import ScrollReveal from '@/components/ui/ScrollReveal'
import CountUp from '@/components/ui/CountUp'

const stats = [
  { target: '90', suffix: '%', label: 'of tickets resolved automatically', prefix: '' },
  { target: '2',  suffix: 's', label: 'average AI response time', prefix: '<' },
  { target: '10', suffix: 'x', label: 'faster than human-only support', prefix: '' },
  { target: '200', suffix: '+', label: 'businesses powered by SupportAI', prefix: '' },
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
          background: 'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 100}>
              <div
                className="glass-card p-7 text-center"
              >
                <div
                  className="font-sora font-extrabold mb-2 gradient-text"
                  style={{ fontSize: 'clamp(44px, 5vw, 64px)', letterSpacing: '-0.03em', lineHeight: 1 }}
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
