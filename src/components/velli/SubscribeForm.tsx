'use client'

import { useState, type FormEvent } from 'react'
import { themes, type ThemeKey } from '@/lib/themes'

export interface SubscribeFormProps {
  pageId: string
  theme: ThemeKey
  /** Builder-preview mode: renders the real UI but never calls the network. */
  preview?: boolean
  onSubscribed?: () => void
}

export default function SubscribeForm({ pageId, theme, preview = false, onSubscribed }: SubscribeFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [email, setEmail] = useState('')
  const palette = themes[theme].announce

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (preview) return
    if (status === 'sending' || status === 'sent') return

    setStatus('sending')
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, email }),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
      onSubscribed?.()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <p className="text-center text-xs" style={{ color: palette.text.countdownLabel }}>
        Check your inbox to confirm your subscription.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[280px] gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="min-w-0 flex-1 rounded-full px-4 py-2.5 text-xs outline-none backdrop-blur-md transition"
        style={{
          background: palette.btn.bg,
          border: `1px solid ${palette.btn.border}`,
          color: palette.text.title,
          caretColor: palette.accent,
          boxShadow: `inset 0 1px 0 ${palette.heroRim}, inset 0 -6px 12px rgba(0,0,0,0.18)`,
        }}
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="shrink-0 rounded-full px-4 py-2.5 text-xs tracking-wide backdrop-blur-md transition hover:brightness-125 disabled:opacity-50"
        style={{
          background: `linear-gradient(140deg, ${palette.btn.border}, ${palette.btn.bg})`,
          border: `1px solid ${palette.btn.border}`,
          color: palette.btn.text,
          boxShadow: `inset 0 1px 0 ${palette.heroRim}, 0 4px 14px ${palette.glow}`,
        }}
      >
        {status === 'sending' ? '…' : status === 'error' ? 'Retry' : 'Notify me'}
      </button>
    </form>
  )
}
