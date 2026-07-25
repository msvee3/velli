'use client'

import { useState, type FormEvent } from 'react'

export default function SiteFooter() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const year = new Date().getFullYear()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    // Honeypot — bots tend to fill every field they see.
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
      form.reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <footer className="border-t border-black/10 bg-white px-6 py-16 font-[family-name:var(--font-dashboard)] text-neutral-900">
      <div className="mx-auto max-w-md">
        <h2 className="text-lg font-medium">We&apos;d Love to Hear From You</h2>

        {status === 'sent' ? (
          <p className="mt-6 text-sm text-neutral-500">
            Thank you — your message has been sent.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
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
              placeholder="Your name"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
            />
            <input
              type="email"
              name="email"
              required
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
              className="rounded-full bg-neutral-900 px-5 py-2 text-sm text-white transition hover:bg-neutral-700 disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending…' : 'Send Feedback'}
            </button>
          </form>
        )}

        <div className="mt-12 text-center text-xs text-neutral-400">
          <p>© {year} velli. All rights reserved.</p>
          <p>Designed and Developed by oodhwe.</p>
        </div>
      </div>
    </footer>
  )
}
