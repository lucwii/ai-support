const companies = ['ShopFlow', 'Zendara', 'Pipecraft', 'NovaMed', 'Stackly']

export default function SocialProof() {
  return (
    <div
      className="py-8"
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
        <p className="text-[13px] font-medium shrink-0" style={{ color: '#64748B' }}>
          Trusted by support teams at
        </p>
        <div className="flex items-center gap-8 flex-wrap justify-center">
          {companies.map((name) => (
            <span
              key={name}
              className="text-[14px] font-semibold font-sora tracking-wide select-none"
              style={{ color: '#94A3B8' }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
