'use client'

import { useEffect, useRef, useState } from 'react'
import { themes, type ThemeKey } from '@/lib/themes'

export default function OodhweMark({ theme, phase = 'announce' }: { theme: ThemeKey; phase?: 'announce' | 'reveal' }) {
  const [expanded, setExpanded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const palette = themes[theme][phase].ticker

  useEffect(() => {
    if (!expanded) return
    const collapse = () => setExpanded(false)
    const timer = setTimeout(collapse, 4000)
    function onOutside(e: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) collapse()
    }
    document.addEventListener('click', onOutside)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', onOutside)
    }
  }, [expanded])

  return (
    <div
      ref={ref}
      className="absolute z-20"
      style={{
        right: 'max(14px, env(safe-area-inset-right))',
        bottom: 'calc(48px + env(safe-area-inset-bottom))',
      }}
    >
      <a
        href="https://oodhwe.in"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (!expanded) {
            e.preventDefault()
            setExpanded(true)
          }
        }}
        className="flex items-center overflow-hidden rounded-full backdrop-blur-sm transition-all duration-300"
        style={{
          background: palette.bg,
          border: `1px solid ${palette.border}`,
          color: palette.text,
          height: 28,
          width: expanded ? 118 : 28,
          justifyContent: expanded ? 'flex-start' : 'center',
          paddingLeft: expanded ? 10 : 0,
        }}
        aria-label="Built by oodhwe"
      >
        <span className="shrink-0 text-[11px] leading-none">✦</span>
        <span
          className="ml-1.5 whitespace-nowrap text-[10px] transition-opacity duration-200"
          style={{ opacity: expanded ? 1 : 0 }}
        >
          built by oodhwe
        </span>
      </a>
    </div>
  )
}
