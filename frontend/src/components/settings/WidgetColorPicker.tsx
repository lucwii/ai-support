'use client'

const PRESETS = [
  '#6366F1', // indigo (default)
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#10B981', // emerald
  '#F59E0B', // amber
  '#3B82F6', // blue
]

interface Props {
  value: string
  onChange: (color: string) => void
}

export default function WidgetColorPicker({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {PRESETS.map((color) => (
        <button
          key={color}
          onClick={() => onChange(color)}
          className="w-7 h-7 rounded-lg transition-transform duration-100 hover:scale-110 focus:outline-none"
          style={{
            backgroundColor: color,
            boxShadow: value === color ? `0 0 0 2px #0F172A, 0 0 0 4px ${color}` : undefined,
          }}
        />
      ))}

      {/* Custom color input */}
      <label
        className="w-7 h-7 rounded-lg border border-white/[0.12] bg-[#060D1A] flex items-center justify-center cursor-pointer hover:border-white/30 transition-colors duration-150 overflow-hidden relative"
        title="Custom color"
      >
        <span className="text-[10px] text-[#475569]">+</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </label>

      {/* Hex value display */}
      <code className="text-xs text-[#475569] font-mono ml-1">{value}</code>
    </div>
  )
}
