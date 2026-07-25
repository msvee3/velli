import { notFound, redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { getById } from '@/lib/cosmos'
import type { Page } from '@/types'
import PageBuilder from '@/components/dashboard/PageBuilder'

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  const { id } = await params

  const page = await getById<Page>('pages', id)
  if (!page) notFound()
  if (page.ownerId !== user.id) redirect('/dashboard')

  return <PageBuilder pageId={page.id} initialTheme={page.theme} initialAnnouncement={page.announcement} />
}
