'use client'

import { BookOpen, Lightbulb } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import KnowledgeUploadForm from '@/components/knowledge/KnowledgeUploadForm'
import KnowledgeList from '@/components/knowledge/KnowledgeList'
import { useOrganization } from '@/hooks/useOrganization'
import { useKnowledge } from '@/hooks/useKnowledge'

export default function KnowledgePage() {
  const { organization } = useOrganization()
  const { knowledge, loading, upload, remove } = useKnowledge(organization?.id)

  return (
    <div>
      <PageHeader
        title="Knowledge Base"
        subtitle="Upload texts that the AI uses to answer customer questions"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mb-6">
        <KnowledgeUploadForm onUpload={upload} />

        {/* Tips card */}
        <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="text-base font-semibold text-[#F1F5F9]">Tips</h2>
          </div>

          <ul className="flex flex-col gap-3">
            {[
              'Paste FAQs, policies, product descriptions, or guides',
              'One topic per upload works best for accuracy',
              'Text is automatically split into ~800 character chunks',
              'More specific content = better AI answers',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] mt-1.5 shrink-0" />
                <span className="text-sm text-[#475569] leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-[#334155]" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#334155]">
                Stats
              </span>
            </div>
            <p className="text-2xl font-bold text-[#F1F5F9]">{knowledge.length}</p>
            <p className="text-xs text-[#475569] mt-0.5">
              chunk{knowledge.length !== 1 ? 's' : ''} in knowledge base
            </p>
          </div>
        </div>
      </div>

      <KnowledgeList knowledge={knowledge} loading={loading} onDelete={remove} />
    </div>
  )
}
