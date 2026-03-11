import type { Industry, TeamSize, MonthlyTickets, PrimaryLanguage, StepMeta, SelectOption } from './types'

export const STEPS: StepMeta[] = [
  {
    title: 'Company Info',
    description: 'Tell us about your business',
  },
  {
    title: 'Team & Volume',
    description: 'Help us tailor your AI experience',
  },
]

export const INDUSTRIES: SelectOption<Industry>[] = [
  { value: 'saas',       label: 'SaaS',        icon: '⚡' },
  { value: 'ecommerce',  label: 'E-commerce',   icon: '🛍️' },
  { value: 'healthcare', label: 'Healthcare',   icon: '🏥' },
  { value: 'fintech',    label: 'Fintech',      icon: '💳' },
  { value: 'education',  label: 'Education',    icon: '🎓' },
  { value: 'other',      label: 'Other',        icon: '🏢' },
]

export const TEAM_SIZES: SelectOption<TeamSize>[] = [
  { value: '1-10',    label: '1–10 people' },
  { value: '11-50',   label: '11–50 people' },
  { value: '51-200',  label: '51–200 people' },
  { value: '201-500', label: '201–500 people' },
  { value: '500+',    label: '500+ people' },
]

export const MONTHLY_TICKETS: SelectOption<MonthlyTickets>[] = [
  { value: '<100',      label: 'Less than 100' },
  { value: '100-500',   label: '100 – 500' },
  { value: '500-2000',  label: '500 – 2,000' },
  { value: '2000+',     label: '2,000+' },
]

export const LANGUAGES: (SelectOption<PrimaryLanguage> & { flag: string })[] = [
  { value: 'english', label: 'English',                       flag: '🇬🇧' },
  { value: 'bschr',   label: 'Bosnian / Serbian / Croatian',  flag: '🇧🇦' },
  { value: 'german',  label: 'German',                        flag: '🇩🇪' },
  { value: 'french',  label: 'French',                        flag: '🇫🇷' },
  { value: 'spanish', label: 'Spanish',                       flag: '🇪🇸' },
  { value: 'other',   label: 'Other',                         flag: '🌐' },
]
