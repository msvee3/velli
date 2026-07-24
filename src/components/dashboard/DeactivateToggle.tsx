'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeactivateToggle({ pageId, active }: { pageId: string; active: boolean }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function toggle() {
    setPending(true)
    try {
      const res = await fetch(`/api/pages/${pageId}/deactivate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active }),
      })
      if (res.ok) router.refresh()
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className={`rounded-full px-4 py-2 text-sm transition disabled:opacity-50 ${
        active ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200' : 'bg-neutral-900 text-white hover:bg-neutral-700'
      }`}
    >
      {pending ? '…' : active ? 'Deactivate page' : 'Reactivate page'}
    </button>
  )
}
