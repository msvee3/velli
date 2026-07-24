'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Gender, PageReveal, Sibling } from '@/types'

export interface RevealFormProps {
  pageId: string
  subscriberCount: number
  initialReveal: PageReveal
  initialSiblings: Sibling[]
  maxSiblings: number
  /** True when the page is already revealed — this becomes an edit, not a first publish. */
  alreadyRevealed?: boolean
}

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'boy', label: 'Boy' },
  { value: 'girl', label: 'Girl' },
  { value: 'surprise', label: 'Prefer not to say' },
]

export default function RevealForm({ pageId, subscriberCount, initialReveal, initialSiblings, maxSiblings, alreadyRevealed = false }: RevealFormProps) {
  const router = useRouter()
  const [reveal, setReveal] = useState<PageReveal>(initialReveal)
  const [nameLater, setNameLater] = useState(!initialReveal.babyName)
  const [siblings, setSiblings] = useState<Sibling[]>(initialSiblings)
  const [uploading, setUploading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function patch(p: Partial<PageReveal>) {
    setReveal((r) => ({ ...r, ...p }))
  }

  function setSiblingName(i: number, name: string) {
    setSiblings((prev) => {
      const next = [...prev]
      while (next.length <= i) next.push({ name: '' })
      next[i] = { name }
      return next
    })
  }

  async function handlePhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 5 - reveal.photoUrls.length)
    if (files.length === 0) return
    setUploading(true)
    setError(null)
    try {
      const urls: string[] = []
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Upload failed')
        urls.push(data.url)
      }
      patch({ photoUrls: [...reveal.photoUrls, ...urls].slice(0, 5) })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function removePhoto(url: string) {
    patch({ photoUrls: reveal.photoUrls.filter((u) => u !== url) })
  }

  const canPublish = Boolean(reveal.dateOfBirth) && !publishing

  async function publish() {
    if (!canPublish) return
    if (!alreadyRevealed) {
      const confirmed = window.confirm(
        `This will notify ${subscriberCount} subscriber${subscriberCount === 1 ? '' : 's'} by email. Once published, the page becomes the reveal. Are you sure?`
      )
      if (!confirmed) return
    }

    setPublishing(true)
    setError(null)
    try {
      const res = await fetch(`/api/pages/${pageId}/reveal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reveal,
          babyName: nameLater ? null : reveal.babyName,
          siblings,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not publish the reveal')
      router.push(`/dashboard/${pageId}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not publish the reveal')
      setPublishing(false)
    }
  }

  return (
    <div className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6">
      <section>
        <label className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
          Baby name
        </label>
        <input
          value={reveal.babyName ?? ''}
          onChange={(e) => patch({ babyName: e.target.value })}
          disabled={nameLater}
          maxLength={60}
          placeholder="Baby's name"
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400 disabled:bg-neutral-50"
        />
        <label className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
          <input type="checkbox" checked={nameLater} onChange={(e) => setNameLater(e.target.checked)} />
          Reveal the name later — keep it hidden for now
        </label>
      </section>

      <section>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">Gender</p>
        <div className="flex gap-2">
          {GENDER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => patch({ gender: opt.value })}
              className={`rounded-full px-3 py-1.5 text-xs transition ${
                reveal.gender === opt.value ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <section>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">Date of birth</p>
          <input
            type="date"
            value={reveal.dateOfBirth ? reveal.dateOfBirth.slice(0, 10) : ''}
            onChange={(e) => patch({ dateOfBirth: e.target.value ? new Date(e.target.value).toISOString() : null })}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </section>
        <section>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
            Time of birth <span className="text-neutral-300">(optional)</span>
          </p>
          <input
            type="time"
            value={reveal.timeOfBirth ?? ''}
            onChange={(e) => patch({ timeOfBirth: e.target.value || null })}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </section>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <section>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
            Weight <span className="text-neutral-300">(optional)</span>
          </p>
          <input
            value={reveal.weight ?? ''}
            onChange={(e) => patch({ weight: e.target.value || null })}
            placeholder="3.2 kg"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </section>
        <section>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
            Height <span className="text-neutral-300">(optional)</span>
          </p>
          <input
            value={reveal.height ?? ''}
            onChange={(e) => patch({ height: e.target.value || null })}
            placeholder="51 cm"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </section>
      </div>

      <section>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
          Message from parents <span className="text-neutral-300">(optional)</span>
        </p>
        <textarea
          value={reveal.message ?? ''}
          onChange={(e) => patch({ message: e.target.value || null })}
          rows={3}
          maxLength={500}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
      </section>

      {maxSiblings > 0 && (
        <section>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
            Siblings <span className="text-neutral-300">(shown in the reveal credit line)</span>
          </p>
          <div className="space-y-2">
            {Array.from({ length: maxSiblings }).map((_, i) => (
              <input
                key={i}
                value={siblings[i]?.name ?? ''}
                onChange={(e) => setSiblingName(i, e.target.value)}
                maxLength={24}
                placeholder={`Sibling ${i + 1} name (optional)`}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
          Photos <span className="text-neutral-300">(up to 5)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {reveal.photoUrls.map((url) => (
            <div key={url} className="group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-16 w-16 rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(url)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[10px] text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {reveal.photoUrls.length < 5 && (
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handlePhotos} disabled={uploading} className="mt-2 text-sm" />
        )}
        {uploading && <p className="mt-1 text-xs text-neutral-400">Uploading…</p>}
      </section>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="button"
        onClick={publish}
        disabled={!canPublish}
        className="w-full rounded-full bg-neutral-900 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {publishing ? 'Saving…' : alreadyRevealed ? 'Save changes' : 'Publish reveal'}
      </button>
    </div>
  )
}
