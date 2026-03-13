import { User, Zap, HeadphonesIcon } from 'lucide-react'
import { Ticket } from '@/lib/types'

interface ConversationThreadProps {
  ticket: Ticket
}

interface BubbleProps {
  icon: React.ReactNode
  label: string
  text: string
  variant: 'customer' | 'ai' | 'agent'
}

const VARIANT_STYLES = {
  customer: {
    wrapper: 'bg-white/[0.04] border border-white/[0.06]',
    label: 'text-[#475569]',
    text: 'text-[#CBD5E1]',
    icon: 'bg-white/[0.06] text-[#475569]',
  },
  ai: {
    wrapper: 'bg-indigo-500/[0.08] border border-indigo-500/20',
    label: 'text-indigo-400',
    text: 'text-[#A5B4FC]',
    icon: 'bg-indigo-500/15 text-indigo-400',
  },
  agent: {
    wrapper: 'bg-emerald-500/[0.07] border border-emerald-500/20',
    label: 'text-emerald-400',
    text: 'text-emerald-200',
    icon: 'bg-emerald-500/15 text-emerald-400',
  },
}

function MessageBubble({ icon, label, text, variant }: BubbleProps) {
  const styles = VARIANT_STYLES[variant]

  return (
    <div className={`rounded-xl p-4 ${styles.wrapper}`}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
          {icon}
        </div>
        <span className={`text-xs font-semibold uppercase tracking-wider ${styles.label}`}>
          {label}
        </span>
      </div>
      <p className={`text-sm leading-relaxed whitespace-pre-wrap ${styles.text}`}>{text}</p>
    </div>
  )
}

export default function ConversationThread({ ticket }: ConversationThreadProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Customer question */}
      <MessageBubble
        variant="customer"
        icon={<User className="w-3.5 h-3.5" />}
        label="Customer"
        text={ticket.content}
      />

      {/* AI response */}
      {ticket.ai_response && (
        <MessageBubble
          variant="ai"
          icon={<Zap className="w-3.5 h-3.5" />}
          label="AI Response"
          text={ticket.ai_response}
        />
      )}

      {/* Agent response */}
      {ticket.agent_response && (
        <MessageBubble
          variant="agent"
          icon={<HeadphonesIcon className="w-3.5 h-3.5" />}
          label="Agent Response"
          text={ticket.agent_response}
        />
      )}
    </div>
  )
}
