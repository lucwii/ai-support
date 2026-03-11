export type Industry = 'saas' | 'ecommerce' | 'healthcare' | 'fintech' | 'education' | 'other'
export type TeamSize = '1-10' | '11-50' | '51-200' | '201-500' | '500+'
export type MonthlyTickets = '<100' | '100-500' | '500-2000' | '2000+'
export type PrimaryLanguage = 'english' | 'bschr' | 'german' | 'french' | 'spanish' | 'other'

export interface OnboardingFormData {
  name: string
  industry: Industry | ''
  primary_language: PrimaryLanguage | ''
  team_size: TeamSize | ''
  monthly_tickets: MonthlyTickets | ''
  website: string
}

export interface StepMeta {
  title: string
  description: string
}

export interface SelectOption<T extends string> {
  value: T
  label: string
  icon?: string
}
