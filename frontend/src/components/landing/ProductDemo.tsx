'use client'

import { useState } from 'react'
import ScrollReveal from '@/components/ui/ScrollReveal'

const sampleTickets = [
  { id: '#1041', content: 'Where is my order? It\'s been 5 days since I placed it.', status: 'auto_answered', confidence: 96, time: '2m ago' },
  { id: '#1040', content: 'Can I get a refund for a product I bought last week?', status: 'auto_answered', confidence: 91, time: '14m ago' },
  { id: '#1039', content: 'How do I reset my password? I\'m locked out of my account.', status: 'pending_agent', confidence: 72, time: '1h ago' },
  { id: '#1038', content: 'What are your business hours for customer support?', status: 'auto_answered', confidence: 98, time: '2h ago' },
]

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  auto_answered: { label: 'Auto Answered', color: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
  pending_agent: { label: 'Pending Review', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
}

function ConfBadge({ value }: { value: number }) {
  const color = value >= 80 ? '#10B981' : value >= 60 ? '#F59E0B' : '#EF4444'
  return <span className="font-semibold text-[13px]" style={{ color }}>{value}%</span>
}

function TicketDashboard() {
  return (
    <div className="p-4 sm:p-5">
      {/* Stats row — 2 cols on mobile, 4 on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total', value: '248', color: '#F1F5F9' },
          { label: 'Auto Resolved', value: '194', color: '#10B981' },
          { label: 'Pending Review', value: '31', color: '#F59E0B' },
          { label: 'Avg. Confidence', value: '89%', color: '#6366F1' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-3" style={{ background: '#0A0F1E', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[10px] sm:text-[11px] mb-1 leading-tight" style={{ color: '#475569' }}>{s.label}</p>
            <p className="text-[18px] sm:text-[20px] font-sora font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table — horizontally scrollable on mobile */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="overflow-x-auto">
          <div style={{ minWidth: '480px' }}>
            {/* Header */}
            <div
              className="grid grid-cols-[2fr_4fr_1fr_1fr] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest"
              style={{ background: '#0A0F1E', color: '#64748B', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              <span>Status</span>
              <span>Message</span>
              <span>Conf.</span>
              <span>Time</span>
            </div>

            {sampleTickets.map((ticket, i) => (
              <div
                key={ticket.id}
                className="grid grid-cols-[2fr_4fr_1fr_1fr] px-4 py-3 items-center transition-colors duration-150 cursor-pointer"
                style={{
                  borderBottom: i < sampleTickets.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#1E293B' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
              >
                <div>
                  <span
                    className="text-[10px] sm:text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md whitespace-nowrap"
                    style={{
                      background: statusConfig[ticket.status].bg,
                      border: `1px solid ${statusConfig[ticket.status].border}`,
                      color: statusConfig[ticket.status].color,
                    }}
                  >
                    {statusConfig[ticket.status].label}
                  </span>
                </div>
                <p className="text-[12px] sm:text-[13px] pr-4 truncate" style={{ color: '#CBD5E1' }}>{ticket.content}</p>
                <ConfBadge value={ticket.confidence} />
                <span className="text-[11px] sm:text-[12px]" style={{ color: '#475569' }}>{ticket.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AIResponseView() {
  return (
    <div className="p-4 sm:p-5 grid md:grid-cols-[60%_40%] gap-4">
      {/* Left */}
      <div className="flex flex-col gap-4">
        <div className="rounded-xl p-4" style={{ background: '#0A0F1E', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#475569' }}>Customer Question</p>
          <p className="text-[13px] leading-relaxed" style={{ color: '#CBD5E1' }}>
            &quot;Hi, I placed an order 5 days ago and it still hasn&apos;t arrived. The tracking hasn&apos;t updated either. Can you help?&quot;
          </p>
        </div>
        <div className="rounded-xl p-4" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#6366F1' }}>AI Suggested Response</p>
            <span className="text-[13px] font-bold" style={{ color: '#10B981' }}>96%</span>
          </div>
          <p className="text-[13px] leading-relaxed" style={{ color: '#CBD5E1' }}>
            Hi! I&apos;m sorry to hear about the delay. Based on your order date, your package is expected to arrive within 2 more business days. Our shipping partners occasionally experience delays, but your order is on its way. I&apos;ve flagged your order for priority review.
          </p>
        </div>
      </div>
      {/* Right */}
      <div className="rounded-xl p-4" style={{ background: '#0A0F1E', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Ticket Info</p>
        {[
          ['Status', 'Auto Answered'],
          ['Confidence', '96%'],
          ['Source', 'shipping-policy.txt'],
          ['Created', '2 min ago'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="text-[12px]" style={{ color: '#475569' }}>{k}</span>
            <span className="text-[12px] font-medium" style={{ color: '#CBD5E1' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function KnowledgeView() {
  return (
    <div className="p-4 sm:p-5">
      <div className="rounded-xl p-4 mb-4" style={{ background: '#0A0F1E', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Add Knowledge</p>
        <div
          className="rounded-lg p-3 font-jb text-[12px] mb-3 h-[80px]"
          style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.06)', color: '#94A3B8', resize: 'none' as const }}
        >
          Paste your documentation, FAQs, policies...
        </div>
        <div
          className="text-center py-2.5 rounded-lg text-[13px] font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
        >
          Upload to Knowledge Base
        </div>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[14px] font-semibold" style={{ color: '#F1F5F9' }}>Knowledge Base</span>
        <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold" style={{ background: 'rgba(99,102,241,0.15)', color: '#818CF8' }}>142 chunks</span>
      </div>
      {['Our return policy allows returns within 30 days of purchase...', 'Shipping typically takes 3-5 business days for standard delivery...', 'To reset your password, go to Settings → Security → Reset Password...'].map((chunk, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-2" style={{ background: '#0A0F1E', border: '1px solid rgba(255,255,255,0.04)' }}>
          <span className="text-[11px] font-jb shrink-0" style={{ color: '#475569' }}>#{i + 1}</span>
          <p className="text-[12px] truncate" style={{ color: '#94A3B8' }}>{chunk}</p>
        </div>
      ))}
    </div>
  )
}

const TABS = ['Ticket Dashboard', 'AI Response', 'Knowledge Base'] as const
type Tab = typeof TABS[number]

export default function ProductDemo() {
  const [active, setActive] = useState<Tab>('Ticket Dashboard')

  return (
    <section className="py-16 md:py-[120px] relative overflow-hidden" style={{ background: 'var(--bg-navy)' }}>
      {/* Glow behind browser */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '5%', left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 400,
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-10 md:mb-12">
          <p className="text-[12px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: '#6366F1' }}>
            Product Demo
          </p>
          <h2
            className="font-sora font-bold mb-4"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.02em', color: '#FFFFFF' }}
          >
            See exactly how your team
            <br />
            will use Kleo
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          {/* Tab switcher */}
          <div className="flex gap-2 mb-4 justify-center flex-wrap px-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className="text-[12px] sm:text-[13px] font-medium px-4 sm:px-5 py-2 rounded-lg transition-all duration-150"
                style={{
                  background: active === tab ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'transparent',
                  color: active === tab ? '#FFFFFF' : '#64748B',
                  border: `1px solid ${active === tab ? 'transparent' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Browser chrome */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 0 0 1px rgba(99,102,241,0.1), 0 32px 80px rgba(0,0,0,0.6)',
            }}
          >
            {/* Browser bar */}
            <div
              className="flex items-center gap-3 px-4 sm:px-5 py-3"
              style={{ background: '#0F172A', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ background: '#EF4444' }} />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ background: '#F59E0B' }} />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ background: '#10B981' }} />
              </div>
              <div
                className="flex-1 mx-2 sm:mx-4 py-1.5 px-3 rounded-md font-jb text-[11px] sm:text-[12px] text-center truncate"
                style={{ background: '#1E293B', color: '#475569' }}
              >
                app.supportai.io/dashboard
              </div>
            </div>

            {/* Content */}
            <div style={{ background: '#080C18', minHeight: 280 }}>
              {active === 'Ticket Dashboard' && <TicketDashboard />}
              {active === 'AI Response' && <AIResponseView />}
              {active === 'Knowledge Base' && <KnowledgeView />}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
