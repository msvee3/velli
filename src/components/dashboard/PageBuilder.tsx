'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { themeKeys, type ThemeKey } from '@/lib/themes'
import type { PageAnnouncement } from '@/types'
import AnnouncementPhase from '@/components/velli/AnnouncementPhase'
import OrbThumb from './OrbThumb'

const ORDINALS = ['1st', '2nd', '3rd', '4th+']

const SAMPLE_MESSAGES = [
  { id: '1', pageId: 'preview', text: 'So excited for you both ✦', createdAt: '' },
  { id: '2', pageId: 'preview', text: 'Counting down the days', createdAt: '' },
]

const emptyAnnouncement: PageAnnouncement = {
  title: '',
  coupleName: '',
  fatherName: null,
  motherName: null,
  dueDate: '',
  message: '',
  photoUrl: null,
  revealNameOnAnnounce: false,
  birthOrder: 1,
  siblings: [],
  tagline: null,
}

function ProgressRing({ fraction, size = 36 }: { fraction: number; size?: number }) {
  const r = size / 2 - 3
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e5e5" strokeWidth={3} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#171717"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - fraction)}
        style={{ transition: 'stroke-dashoffset 0.4s ease' }}
      />
    </svg>
  )
}

export interface PageBuilderProps {
  /** Present when editing an already-published page instead of creating a new one. */
  pageId?: string
  initialTheme?: ThemeKey
  initialAnnouncement?: PageAnnouncement
}

export default function PageBuilder({ pageId, initialTheme, initialAnnouncement }: PageBuilderProps) {
  const router = useRouter()
  const isEdit = Boolean(pageId)
  const [theme, setTheme] = useState<ThemeKey>(initialTheme ?? 'stellar')
  const [announcement, setAnnouncement] = useState<PageAnnouncement>(initialAnnouncement ?? emptyAnnouncement)
  const [sheetExpanded, setSheetExpanded] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function patch(p: Partial<PageAnnouncement>) {
    setAnnouncement((a) => ({ ...a, ...p }))
  }

  function setBirthOrder(n: number) {
    const maxSiblings = Math.min(n - 1, 4)
    setAnnouncement((a) => ({ ...a, birthOrder: n, siblings: a.siblings.slice(0, maxSiblings) }))
  }

  function setSiblingName(i: number, name: string) {
    setAnnouncement((a) => {
      const siblings = [...a.siblings]
      while (siblings.length <= i) siblings.push({ name: '' })
      siblings[i] = { name }
      return { ...a, siblings }
    })
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      patch({ photoUrl: data.url })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const requiredFilled = [announcement.title.trim(), announcement.coupleName.trim(), announcement.dueDate].filter(
    Boolean
  ).length
  const fraction = requiredFilled / 3
  const canPublish = fraction === 1 && !publishing

  async function publish() {
    if (!canPublish) return
    setPublishing(true)
    setError(null)
    try {
      const res = await fetch(isEdit ? `/api/pages/${pageId}` : '/api/pages', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, ...announcement }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not publish')
      router.push(`/dashboard/${isEdit ? pageId : data.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not publish')
      setPublishing(false)
    }
  }

  const previewMessages = useMemo(() => SAMPLE_MESSAGES, [])

  return (
    <div className="md:grid md:grid-cols-[380px_1fr] md:items-start md:gap-8">
      {/* Live preview — the full-bleed background on mobile, a phone-framed pane on desktop */}
      <div className="fixed inset-0 z-30 md:sticky md:top-10 md:col-start-2 md:row-start-1 md:z-auto md:h-[720px] md:overflow-hidden md:rounded-[2.5rem] md:border md:border-neutral-200 md:shadow-2xl">
        <AnnouncementPhase
          pageId="preview"
          theme={theme}
          announcement={announcement}
          preview
          previewMessages={previewMessages}
          onEditField={patch}
        />
      </div>

      {/* Inputs — a bottom sheet on mobile, a static panel on desktop */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-3xl bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.18)] transition-[max-height] duration-300 md:static md:col-start-1 md:row-start-1 md:max-h-none md:rounded-2xl md:border md:border-neutral-200 md:shadow-sm ${
          sheetExpanded ? 'max-h-[82vh]' : 'max-h-[104px]'
        }`}
      >
        <button
          type="button"
          onClick={() => setSheetExpanded((v) => !v)}
          className="flex shrink-0 items-center justify-between px-6 py-4 md:hidden"
        >
          <span className="flex items-center gap-3">
            <ProgressRing fraction={fraction} size={28} />
            <span className="text-sm font-medium text-neutral-900">
              {sheetExpanded ? 'Editing your page' : 'Continue editing'}
            </span>
          </span>
          <span className="text-xs text-neutral-400">{sheetExpanded ? 'Collapse' : 'Expand'}</span>
        </button>

        <div className="flex-1 overflow-y-auto px-6 pb-8">
          <div className="mb-6 hidden items-center justify-between md:flex">
            <Link href="/dashboard" className="text-sm text-neutral-400 hover:text-neutral-700">
              ← Cancel
            </Link>
            <ProgressRing fraction={fraction} />
          </div>

          <div className="space-y-7">
            <section>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">Theme</p>
              <div className="flex gap-3">
                {themeKeys.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTheme(key)}
                    className="flex flex-col items-center gap-1.5"
                    aria-label={key}
                  >
                    <OrbThumb
                      theme={key}
                      size={36}
                      className={theme === key ? 'ring-2 ring-offset-2 ring-neutral-900' : ''}
                    />
                  </button>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">Title</p>
              <input
                value={announcement.title}
                onChange={(e) => patch({ title: e.target.value })}
                placeholder="e.g., Our baby is coming"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
              />
            </section>

            <section>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">Couple name</p>
              <input
                value={announcement.coupleName}
                onChange={(e) => patch({ coupleName: e.target.value })}
                placeholder="e.g., Priya & Rahul"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
              />
            </section>

            <section>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
                Parents <span className="text-neutral-300">(optional — shown on the reveal)</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={announcement.fatherName ?? ''}
                  onChange={(e) => patch({ fatherName: e.target.value || null })}
                  maxLength={40}
                  placeholder="Father"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
                <input
                  value={announcement.motherName ?? ''}
                  onChange={(e) => patch({ motherName: e.target.value || null })}
                  maxLength={40}
                  placeholder="Mother"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
              </div>
            </section>

            <section>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">Due date</p>
              <input
                type="date"
                value={announcement.dueDate ? announcement.dueDate.slice(0, 10) : ''}
                onChange={(e) => patch({ dueDate: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
              />
            </section>

            <section>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
                Message <span className="text-neutral-300">(optional)</span>
              </p>
              <textarea
                value={announcement.message}
                onChange={(e) => patch({ message: e.target.value })}
                placeholder="Share your excitement..."
                maxLength={300}
                rows={3}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400 resize-none"
              />
            </section>

            <section>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">Which child is this?</p>
              <div className="flex gap-2">
                {ORDINALS.map((label, i) => {
                  const n = i + 1
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setBirthOrder(n)}
                      className={`rounded-full px-3 py-1.5 text-xs transition ${
                        announcement.birthOrder === n
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
              {announcement.birthOrder > 1 && (
                <div className="mt-3 space-y-2">
                  {Array.from({ length: Math.min(announcement.birthOrder - 1, 4) }).map((_, i) => (
                    <input
                      key={i}
                      value={announcement.siblings[i]?.name ?? ''}
                      onChange={(e) => setSiblingName(i, e.target.value)}
                      maxLength={24}
                      placeholder={`Sibling ${i + 1} name (optional)`}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
                Custom tagline <span className="text-neutral-300">(optional)</span>
              </p>
              <input
                value={announcement.tagline ?? ''}
                onChange={(e) => patch({ tagline: e.target.value || null })}
                maxLength={60}
                placeholder={announcement.birthOrder === 1 ? 'Our first' : 'Baby number two'}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
              />
            </section>

            <section>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
                Photo <span className="text-neutral-300">(optional)</span>
              </p>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} disabled={uploading} className="text-sm" />
              {uploading && <p className="mt-1 text-xs text-neutral-400">Uploading…</p>}
            </section>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="button"
              onClick={publish}
              disabled={!canPublish}
              className="w-full rounded-full bg-neutral-900 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {publishing ? 'Saving…' : isEdit ? 'Save changes' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
