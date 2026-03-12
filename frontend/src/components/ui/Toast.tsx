'use client'

import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { Toast as ToastType } from '@/hooks/useToast'

const config = {
  success: {
    icon: CheckCircle2,
    classes: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
  },
  error: {
    icon: XCircle,
    classes: 'bg-red-500/10 border-red-500/25 text-red-400',
  },
  info: {
    icon: Info,
    classes: 'bg-indigo-500/10 border-indigo-500/25 text-[#818CF8]',
  },
}

interface ToastProps {
  toast: ToastType
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastProps) {
  const { icon: Icon, classes } = config[toast.type]
  return (
    <div
      className={`flex items-center gap-3 border rounded-xl px-4 py-3 shadow-lg backdrop-blur-sm ${classes}`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm font-medium">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-auto opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastType[]
  onRemove: (id: string) => void
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 min-w-[280px]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}
