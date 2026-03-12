import { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: { label: string; onClick: () => void; icon?: LucideIcon }
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6 lg:mb-8 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[#F1F5F9] tracking-tight font-sora">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-[#475569] mt-1">{subtitle}</p>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150 hover:-translate-y-px"
        >
          {action.icon && <action.icon className="w-4 h-4" />}
          {action.label}
        </button>
      )}
    </div>
  )
}
