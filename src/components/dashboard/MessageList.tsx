'use client'

import { useState } from 'react'
import type { ThemeKey } from '@/lib/themes'
import type { TickerMessage } from '@/types'
import TickerBand from '@/components/velli/TickerBand'

const MAX_MESSAGES = 10
const MAX_LENGTH = 80

export default function MessageList({
  pageId,
  theme,
  phase,
  initialMessages,
}: {
  pageId: string
  theme: ThemeKey
  phase: 'announce' | 'reveal'
  initialMessages: TickerMessage[]
}) {
  const [messages, setMessages] = useState(initialMessages)
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function post() {
    const trimmed = text.trim()
    if (!trimmed || messages.length >= MAX_MESSAGES) return
    setPosting(true)
    setError(null)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, text: trimmed }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not post message')
      setMessages((prev) => [...prev, data])
      setText('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not post message')
    } finally {
      setPosting(false)
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/messages/${id}?pageId=${pageId}`, { method: 'DELETE' })
    if (res.ok) setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-neutral-200" style={{ background: '#0a0810', height: 60 }}>
        <div className="relative h-full w-full">
          <TickerBand theme={theme} phase={phase} messages={messages} />
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-neutral-900">Post a message</h2>
          <span className="text-xs text-neutral-400">{messages.length}/{MAX_MESSAGES}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
            placeholder="So excited for you both ✦"
            disabled={messages.length >= MAX_MESSAGES}
            className="min-w-0 flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400 disabled:bg-neutral-50"
          />
          <button
            type="button"
            onClick={post}
            disabled={posting || !text.trim() || messages.length >= MAX_MESSAGES}
            className="shrink-0 rounded-full bg-neutral-900 px-4 py-2 text-sm text-white transition hover:bg-neutral-700 disabled:opacity-40"
          >
            Post
          </button>
        </div>
        <p className="mt-1 text-right text-[11px] text-neutral-400">{text.length}/{MAX_LENGTH}</p>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {messages.length >= MAX_MESSAGES && (
          <p className="mt-1 text-xs text-neutral-400">Delete a message below to post a new one.</p>
        )}

        <ul className="mt-4 divide-y divide-neutral-100">
          {messages.map((m) => (
            <li key={m.id} className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-neutral-700">{m.text}</span>
              <button
                type="button"
                onClick={() => remove(m.id)}
                className="text-xs text-neutral-400 transition hover:text-red-500"
              >
                Delete
              </button>
            </li>
          ))}
          {messages.length === 0 && <li className="py-4 text-sm text-neutral-400">No messages yet.</li>}
        </ul>
      </div>
    </div>
  )
}
