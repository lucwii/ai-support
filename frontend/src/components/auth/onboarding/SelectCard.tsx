interface SelectCardProps<T extends string> {
  options: { value: T; label: string; icon?: string }[]
  value: T | ''
  onChange: (v: T) => void
  columns?: 2 | 3
}

export default function SelectCard<T extends string>({
  options,
  value,
  onChange,
  columns = 2,
}: SelectCardProps<T>) {
  const gridClass = columns === 3 ? 'grid-cols-3' : 'grid-cols-2'

  return (
    <div className={`grid ${gridClass} gap-2`}>
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-all duration-150"
            style={{
              background: active ? 'rgba(99,102,241,0.12)' : '#0A0F1E',
              border: `1px solid ${active ? '#6366F1' : 'rgba(255,255,255,0.06)'}`,
              color: active ? '#A5B4FC' : '#64748B',
              boxShadow: active ? '0 0 0 1px rgba(99,102,241,0.2) inset' : 'none',
            }}
          >
            {opt.icon && <span className="text-[15px] leading-none">{opt.icon}</span>}
            <span>{opt.label}</span>
            {active && (
              <span className="ml-auto text-[10px] font-bold" style={{ color: '#6366F1' }}>✓</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
