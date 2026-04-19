import { Metadata } from 'next'
import SubmitPageShell from '@/components/submit/SubmitPageShell'
import NotFound from '@/components/submit/NotFound'
import type { PublicOrganization } from '@/lib/types'

interface Props {
  params: Promise<{ slug: string }>
}

async function getOrganization(slug: string): Promise<PublicOrganization | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/organizations/public/${slug}`,
      { next: { revalidate: 60 } },
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const org = await getOrganization(slug)
  return {
    title: org ? `${org.name} Support` : 'Support',
    description: org?.support_page_headline ?? 'Submit a support request',
  }
}

export default async function SubmitPage({ params }: Props) {
  const { slug } = await params
  const org = await getOrganization(slug)

  if (!org) {
    return <NotFound />
  }

  return <SubmitPageShell organization={org} />
}
