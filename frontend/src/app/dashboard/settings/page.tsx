'use client'

import { useState } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import SettingsSidebar, { type SettingsSection } from '@/components/settings/SettingsSidebar'
import GeneralSection from '@/components/settings/sections/GeneralSection'
import TeamSection from '@/components/settings/sections/TeamSection'
import NotificationsSection from '@/components/settings/sections/NotificationsSection'
import EmbedSection from '@/components/settings/sections/EmbedSection'
import { useOrganization } from '@/hooks/useOrganization'
import type { Organization } from '@/lib/types'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general')
  const { organization: initialOrg, loading } = useOrganization()
  const [organization, setOrganization] = useState<Organization | null>(null)

  // Sync local state once the org loads
  if (initialOrg && !organization) {
    setOrganization(initialOrg)
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage your organization, team, and preferences"
      />

      {loading && (
        <div className="h-64 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-[#6366F1] border-t-transparent animate-spin" />
        </div>
      )}

      {!loading && organization && (
        <div className="flex gap-6 items-start">
          <SettingsSidebar active={activeSection} onChange={setActiveSection} />

          <div className="flex-1 min-w-0">
            {activeSection === 'general' && (
              <GeneralSection organization={organization} onUpdated={setOrganization} />
            )}
            {activeSection === 'team' && <TeamSection />}
            {activeSection === 'notifications' && <NotificationsSection />}
            {activeSection === 'embed' && <EmbedSection organization={organization} />}
          </div>
        </div>
      )}
    </div>
  )
}
