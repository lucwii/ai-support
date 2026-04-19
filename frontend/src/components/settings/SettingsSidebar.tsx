import { Building2, Users, Bell, Code2, Globe, LucideIcon } from 'lucide-react'

export type SettingsSection = 'support' | 'general' | 'team' | 'notifications' | 'embed'

interface Section {
  id: SettingsSection
  label: string
  icon: LucideIcon
  description: string
}

const SECTIONS: Section[] = [
  { id: 'support',       label: 'Support Page',  icon: Globe,     description: 'Your public link' },
  { id: 'general',       label: 'General',       icon: Building2, description: 'Organization profile' },
  { id: 'team',          label: 'Team',           icon: Users,     description: 'Members & invites' },
  { id: 'notifications', label: 'Notifications',  icon: Bell,      description: 'Email preferences' },
  { id: 'embed',         label: 'Embed',          icon: Code2,     description: 'Integration info' },
]

interface Props {
  active: SettingsSection
  onChange: (section: SettingsSection) => void
}

export default function SettingsSidebar({ active, onChange }: Props) {
  return (
    <>
      {/* Desktop: vertical sidebar */}
      <aside className="hidden lg:block w-52 shrink-0">
        <nav className="flex flex-col gap-0.5">
          {SECTIONS.map(({ id, label, icon: Icon, description }) => {
            const isActive = active === id
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                className={`
                  flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150
                  ${isActive
                    ? 'bg-white/[0.06] text-[#F1F5F9]'
                    : 'text-[#475569] hover:text-[#94A3B8] hover:bg-white/[0.03]'
                  }
                `}
              >
                <div className={`
                  w-7 h-7 rounded-lg flex items-center justify-center shrink-0
                  ${isActive ? 'bg-[#6366F1]/20' : 'bg-white/[0.04]'}
                `}>
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#6366F1]' : 'text-[#475569]'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none mb-0.5">{label}</p>
                  <p className={`text-[11px] leading-none ${isActive ? 'text-[#475569]' : 'text-[#334155]'}`}>
                    {description}
                  </p>
                </div>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Mobile: horizontal scrollable tab bar */}
      <nav className="lg:hidden flex overflow-x-auto gap-1 pb-1 mb-4 scrollbar-none">
        {SECTIONS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`
                flex items-center gap-2 shrink-0 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-[#6366F1]/15 text-[#818CF8] border border-[#6366F1]/25'
                  : 'text-[#475569] hover:text-[#94A3B8] bg-white/[0.03] border border-transparent hover:border-white/[0.06]'
                }
              `}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#818CF8]' : 'text-[#475569]'}`} />
              <span className="whitespace-nowrap">{label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
