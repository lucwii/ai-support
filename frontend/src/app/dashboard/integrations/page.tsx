'use client'

import PageHeader from '@/components/ui/PageHeader'
import WidgetColorPicker from '@/components/settings/WidgetColorPicker'
import WidgetPreview from '@/components/settings/WidgetPreview'
import EmbedCodeBlock from '@/components/settings/EmbedCodeBlock'
import Toast from '@/components/ui/Toast'
import { useOrganization } from '@/hooks/useOrganization'
import { useWidgetSettings } from '@/hooks/useWidgetSettings'
import { useToast } from '@/hooks/useToast'

export default function IntegrationsPage() {
  const { organization, loading } = useOrganization()
  const { settings, setField, saving, save } = useWidgetSettings(organization)
  const { toasts, addToast, removeToast } = useToast()

  const handleSave = async () => {
    try {
      await save()
      addToast('Widget settings saved', 'success')
    } catch {
      addToast('Failed to save settings', 'error')
    }
  }

  return (
    <div>
      <PageHeader
        title="Integrations"
        subtitle="Embed SupportAI on your website with a customizable chat widget"
      />

      {loading && (
        <div className="h-64 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-[#6366F1] border-t-transparent animate-spin" />
        </div>
      )}

      {!loading && organization && (
        <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-6">
          <h2 className="text-base font-semibold text-[#F1F5F9] mb-1">Chat Widget</h2>
          <p className="text-sm text-[#475569] mb-6">
            Customize the widget and paste the embed code on your website.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left — config */}
            <div className="flex flex-col gap-5">

              <Field label="Accent color">
                <WidgetColorPicker
                  value={settings.accent_color}
                  onChange={(color) => setField('accent_color', color)}
                />
              </Field>

              <Field label="Position">
                <div className="flex gap-2">
                  {(['bottom-right', 'bottom-left'] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setField('position', pos)}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-colors duration-150 ${
                        settings.position === pos
                          ? 'bg-[#6366F1]/10 border-[#6366F1]/50 text-[#6366F1]'
                          : 'bg-[#060D1A] border-white/[0.06] text-[#475569] hover:text-[#94A3B8]'
                      }`}
                    >
                      {pos === 'bottom-right' ? 'Bottom right' : 'Bottom left'}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Opening message">
                <input
                  type="text"
                  value={settings.placeholder_text}
                  onChange={(e) => setField('placeholder_text', e.target.value)}
                  placeholder="How can we help you today?"
                  className={inputClass}
                  maxLength={100}
                />
              </Field>

              <Field label="Submit button text">
                <input
                  type="text"
                  value={settings.button_text}
                  onChange={(e) => setField('button_text', e.target.value)}
                  placeholder="Send message"
                  className={inputClass}
                  maxLength={30}
                />
              </Field>

              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-2 self-start px-5 py-2 rounded-xl text-sm font-medium bg-[#6366F1] text-white hover:bg-[#4F46E5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>

            {/* Right — preview */}
            <WidgetPreview
              orgName={organization.name}
              accentColor={settings.accent_color}
              position={settings.position}
              placeholderText={settings.placeholder_text}
              buttonText={settings.button_text}
            />
          </div>

          {/* Embed code */}
          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <EmbedCodeBlock
              orgId={organization.id}
              accentColor={settings.accent_color}
              position={settings.position}
              placeholderText={settings.placeholder_text}
              buttonText={settings.button_text}
            />
          </div>
        </div>
      )}

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#475569] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full bg-[#060D1A] border border-white/[0.06] rounded-xl text-sm text-[#F1F5F9] placeholder-[#334155] px-4 py-2.5 focus:outline-none focus:border-[#6366F1]/50 transition-colors duration-150'
