const companies = [
  'ShopFlow', 'Zendara', 'Pipecraft', 'NovaMed', 'Stackly',
  'Roverix', 'Lightbase', 'Orbitly', 'Fendrix', 'Claratech',
]

export default function SocialProof() {
  const doubled = [...companies, ...companies]

  return (
    <div
      className="py-7 overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-center gap-0 max-w-[1200px] mx-auto px-6">
        {/* Fixed label */}
        <p
          className="text-[12px] font-semibold uppercase tracking-[0.1em] shrink-0 pr-8 mr-4"
          style={{
            color: '#334155',
            borderRight: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          Trusted by
        </p>

        {/* Scrolling track */}
        <div
          className="flex-1 overflow-hidden"
          style={{
            maskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          <div className="animate-marquee flex items-center gap-0 w-max">
            {doubled.map((name, i) => (
              <span key={i} className="inline-flex items-center">
                <span
                  className="text-[13px] font-bold font-sora tracking-wide select-none px-8"
                  style={{ color: '#2D4060' }}
                >
                  {name}
                </span>
                <span style={{ color: '#1A2D45', fontSize: '8px' }}>◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
