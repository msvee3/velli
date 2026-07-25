import { themes, type ThemeKey } from '@/lib/themes'
import VelliLogo from '@/components/ui/VelliLogo'

export default function DeactivatedScreen({ theme }: { theme: ThemeKey }) {
  const palette = themes[theme].announce

  return (
    <div
      className="flex h-[100dvh] w-full flex-col items-center justify-center px-6 text-center"
      style={{ background: palette.pageBg }}
    >
      <VelliLogo size={44} ring={`${palette.accent}59`} />
      <p className="mt-5 max-w-xs text-sm" style={{ color: palette.text.couple }}>
        This celebration page is no longer available.
      </p>
    </div>
  )
}
