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
    wrapper: 'bg-white/[0.03] border border-white/[0.07]',
    header: 'bg-white/[0.03] border-b border-white/[0.05]',
    label: 'text-[#4A6080]',
    text: 'text-[#9CB0C5]',
    icon: 'bg-white/[0.06] text-[#4A6080]',
    accent: '',
  },
  ai: {
    wrapper: 'bg-indigo-500/[0.06] border border-indigo-500/[0.18]',
    header: 'bg-indigo-500/[0.05] border-b border-indigo-500/[0.12]',
    label: 'text-indigo-400',
    text: 'text-[#A5B4FC]',
    icon: 'bg-indigo-500/15 text-indigo-400',
    accent: '',
  },
  agent: {
    wrapper: 'bg-emerald-500/[0.06] border border-emerald-500/[0.18]',
    header: 'bg-emerald-500/[0.05] border-b border-emerald-500/[0.10]',
    label: 'text-emerald-400',
    text: 'text-emerald-200/80',
    icon: 'bg-emerald-500/15 text-emerald-400',
    accent: '',
  },
}

function MessageBubble({ icon, label, text, variant }: BubbleProps) {
  const styles = VARIANT_STYLES[variant]

  return (
    <div data-testid={`${variant}-message-bubble`} className={`rounded-xl overflow-hidden ${styles.wrapper}`}>
      <div className={`flex items-center gap-2.5 px-4 py-2.5 ${styles.header}`}>
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
          {icon}
        </div>
        <span className={`text-[11px] font-bold uppercase tracking-wider ${styles.label}`}>
          {label}
        </span>
      </div>
      <p className={`px-4 py-3.5 text-sm leading-relaxed whitespace-pre-wrap break-all ${styles.text}`}>
        {text}
      </p>
    </div>
  )
}

export default function ConversationThread({ ticket }: ConversationThreadProps) {
  return (
    <div className="flex flex-col gap-3">
      <MessageBubble
        variant="customer"
        icon={<User className="w-3 h-3" />}
        label="Customer"
        text={ticket.content}
      />

      {ticket.ai_response && (
        <MessageBubble
          variant="ai"
          icon={<Zap className="w-3 h-3" />}
          label="AI Response"
          text={ticket.ai_response}
        />
      )}

      {ticket.agent_response && (
        <MessageBubble
          variant="agent"
          icon={<HeadphonesIcon className="w-3 h-3" />}
          label="Agent Response"
          text={ticket.agent_response}
        />
      )}
    </div>
  )
}
