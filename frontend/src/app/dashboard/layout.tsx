import DashboardShell from '@/components/layout/DashboardShell'

// Sve dashboard stranice zahtijevaju autentikaciju i dinamicke podatke.
// Onemogucava staticki prerender tokom builda (Next.js bi inace pokusao
// prerendovati stranicu bez env varijabli, sto uzrokuje Supabase crash).
export const dynamic = 'force-dynamic'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
