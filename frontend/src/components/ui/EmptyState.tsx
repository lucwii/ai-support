import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Icon className="w-12 h-12 text-[#1E293B]" />
      <p className="text-sm font-medium text-[#475569] mt-4">{title}</p>
      {description && <p className="text-xs text-[#334155] mt-1">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
