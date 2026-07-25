import { themes, type ThemeKey } from '@/lib/themes'

export default function DeactivatedScreen({ theme }: { theme: ThemeKey }) {
  const palette = themes[theme].announce

  return (
    <div
      className="flex h-[100dvh] w-full flex-col items-center justify-center px-6 text-center"
      style={{ background: palette.pageBg }}
    >
      <p className="text-xs uppercase tracking-[0.3em]" style={{ color: palette.text.tag }}>
        velli
      </p>
      <p className="mt-4 max-w-xs text-sm" style={{ color: palette.text.couple }}>
        This celebration page is no longer available.
      </p>
    </div>
  )
}
