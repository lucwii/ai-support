interface ConfidenceBarProps {
  confidence: number
  showLabel?: boolean
  compact?: boolean
}

function getColor(confidence: number) {
  if (confidence >= 90) return 'bg-emerald-500'
  if (confidence >= 70) return 'bg-[#6366F1]'
  if (confidence >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}

function getTextColor(confidence: number) {
  if (confidence >= 90) return 'text-emerald-400'
  if (confidence >= 70) return 'text-[#818CF8]'
  if (confidence >= 50) return 'text-amber-400'
  return 'text-red-400'
}

export default function ConfidenceBar({
  confidence,
  showLabel = true,
  compact = false,
}: ConfidenceBarProps) {
  const fill = getColor(confidence)
  const textColor = getTextColor(confidence)
  const barHeight = compact ? 'h-1' : 'h-1.5'

  return (
    <div className="flex items-center gap-2">
      {showLabel && !compact && (
        <span className={`text-sm font-semibold ${textColor} w-10 text-right`}>
          {confidence}%
        </span>
      )}
      <div
        className={`bg-white/[0.06] rounded-full flex-1 ${barHeight}`}
        style={compact ? { width: 60 } : undefined}
      >
        <div
          className={`${fill} ${barHeight} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(confidence, 100)}%` }}
        />
      </div>
      {compact && (
        <span className="text-[10px] text-[#475569]">{confidence}%</span>
      )}
    </div>
  )
}
