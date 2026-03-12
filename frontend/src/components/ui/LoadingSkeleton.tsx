interface LoadingSkeletonProps {
  type?: 'stat' | 'table' | 'block'
  rows?: number
}

function Shimmer({ className }: { className: string }) {
  return (
    <div
      className={`animate-shimmer rounded ${className}`}
      style={{
        background:
          'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 75%)',
        backgroundSize: '200% 100%',
      }}
    />
  )
}

export default function LoadingSkeleton({ type = 'block', rows = 5 }: LoadingSkeletonProps) {
  if (type === 'stat') {
    return (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-[#0F172A] border border-white/[0.06] rounded-2xl p-6">
            <Shimmer className="w-10 h-10 rounded-xl" />
            <Shimmer className="w-16 h-8 mt-4 rounded" />
            <Shimmer className="w-24 h-4 mt-2 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (type === 'table') {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3.5 px-4">
            <Shimmer className="w-20 h-4 rounded" />
            <Shimmer className="flex-1 h-4 rounded" />
            <Shimmer className="w-28 h-6 rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  return <Shimmer className="w-full h-20 rounded-2xl" />
}
