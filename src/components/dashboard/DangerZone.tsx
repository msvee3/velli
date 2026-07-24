'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DangerZone({ pageId }: { pageId: string }) {
  const router = useRouter()
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (confirmText !== pageId) return
    setDeleting(true)
    const res = await fetch(`/api/pages/${pageId}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/dashboard')
      router.refresh()
    } else {
      setDeleting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
      <h2 className="text-sm font-medium text-red-700">Danger zone</h2>
      <p className="mt-1 text-xs text-red-500">
        Deleting this page removes it and all its subscribers and messages permanently.
      </p>
      <p className="mt-3 text-xs text-neutral-500">
        Type <span className="font-mono font-medium text-neutral-700">{pageId}</span> to confirm.
      </p>
      <div className="mt-2 flex gap-2">
        <input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-red-400"
        />
        <button
          type="button"
          onClick={handleDelete}
          disabled={confirmText !== pageId || deleting}
          className="shrink-0 rounded-full bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {deleting ? 'Deleting…' : 'Delete page'}
        </button>
      </div>
    </div>
  )
}
