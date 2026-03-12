interface SelectCardProps<T extends string> {
  options: { value: T; label: string }[]
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
  const gridClass = columns === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'

  return (
    <div className={`grid ${gridClass} gap-2`}>
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-all duration-150"
            style={{
              background: active ? 'rgba(99,102,241,0.12)' : '#0A0F1E',
              border: `1px solid ${active ? '#6366F1' : 'rgba(255,255,255,0.06)'}`,
              color: active ? '#A5B4FC' : '#64748B',
            }}
          >
            <span>{opt.label}</span>
            {active && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 ml-1">
                <path d="M2 6l3 3 5-5" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        )
      })}
    </div>
  )
}
