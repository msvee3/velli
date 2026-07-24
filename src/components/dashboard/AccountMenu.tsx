'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Image from 'next/image'

type Props = {
  name?: string | null
  email?: string | null
  image?: string | null
  signOutAction: () => Promise<void>
}

export default function AccountMenu({ name, email, image, signOutAction }: Props) {
  const [open, setOpen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition hover:bg-neutral-100"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {image ? (
          <Image src={image} alt={name ?? 'Account'} width={28} height={28} className="rounded-full" />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium text-neutral-600">
            {(name ?? email ?? '?').charAt(0).toUpperCase()}
          </span>
        )}
        <span className="hidden text-sm text-neutral-500 sm:inline">{name}</span>
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-neutral-400">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setFeedbackOpen(true)
              setOpen(false)
            }}
            className="block w-full px-4 py-2 text-left text-sm text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
          >
            Feedback
          </button>
          <form action={signOutAction}>
            <button
              type="submit"
              role="menuitem"
              className="block w-full px-4 py-2 text-left text-sm text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
            >
              Sign out
            </button>
          </form>
        </div>
      )}

      {feedbackOpen && (
        <FeedbackModal
          defaultName={name ?? ''}
          defaultEmail={email ?? ''}
          onClose={() => setFeedbackOpen(false)}
        />
      )}
    </div>
  )
}

function FeedbackModal({
  defaultName,
  defaultEmail,
  onClose,
}: {
  defaultName: string
  defaultEmail: string
  onClose: () => void
}) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    if (data.get('company')) {
      setStatus('sent')
      return
    }

    setStatus('sending')
    setError(null)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          message: data.get('message'),
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Something went wrong')
      }
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 px-6"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-neutral-900">Send feedback</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 transition hover:text-neutral-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {status === 'sent' ? (
          <p className="mt-6 text-sm text-neutral-500">Thank you — your message has been sent.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />
            <input
              type="text"
              name="name"
              required
              maxLength={60}
              defaultValue={defaultName}
              placeholder="Your name"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
            />
            <input
              type="email"
              name="email"
              required
              defaultValue={defaultEmail}
              placeholder="Your email"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
            />
            <textarea
              name="message"
              required
              maxLength={1000}
              rows={3}
              placeholder="Your message"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-full bg-neutral-900 px-5 py-2 text-sm text-white transition hover:bg-neutral-700 disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending…' : 'Send Feedback'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
