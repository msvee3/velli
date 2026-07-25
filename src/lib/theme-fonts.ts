import {
  Orbitron,
  Space_Mono,
  Righteous,
  Caveat,
  Chakra_Petch,
  JetBrains_Mono,
  Bebas_Neue,
  Playfair_Display,
  Oswald,
  IBM_Plex_Mono,
  Bungee,
  Kalam,
  Baloo_2,
  Patrick_Hand,
} from 'next/font/google'
import type { ThemeKey } from './themes'

// Kept out of app/layout.tsx deliberately: declaring all 14 of these in the
// root layout would preload every one of them on every route (next/font
// injects a <link rel="preload"> per call in the root layout regardless of
// which theme is actually active). `preload: false` here means the font
// files are only ever fetched by the browser once a page actually paints
// text in that family — exactly the themed pages that need them.
//
// Every display font below reuses the `--font-celebration` variable name,
// every accent font reuses `--font-accent` — the same CSS vars declared by
// the default Fraunces/Cormorant fonts in app/layout.tsx. Applying one
// theme's `.variable` className on a phase's outer wrapper div locally
// overrides those vars for that subtree only, so none of the existing
// `font-[family-name:var(--font-celebration)]` call sites need to change.

const liftoffDisplay = Orbitron({ variable: '--font-celebration', subsets: ['latin'], preload: false })
const liftoffAccent = Space_Mono({
  variable: '--font-accent',
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  preload: false,
})

const encoreDisplay = Righteous({ variable: '--font-celebration', subsets: ['latin'], weight: '400', preload: false })
const encoreAccent = Caveat({ variable: '--font-accent', subsets: ['latin'], preload: false })

const circuitDisplay = Chakra_Petch({
  variable: '--font-celebration',
  subsets: ['latin'],
  weight: '600',
  preload: false,
})
const circuitAccent = JetBrains_Mono({
  variable: '--font-accent',
  subsets: ['latin'],
  style: 'italic',
  preload: false,
})

const premiereDisplay = Bebas_Neue({ variable: '--font-celebration', subsets: ['latin'], weight: '400', preload: false })
const premiereAccent = Playfair_Display({
  variable: '--font-accent',
  subsets: ['latin'],
  style: 'italic',
  preload: false,
})

const forgeDisplay = Oswald({ variable: '--font-celebration', subsets: ['latin'], preload: false })
const forgeAccent = IBM_Plex_Mono({
  variable: '--font-accent',
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  preload: false,
})

const pounceDisplay = Bungee({ variable: '--font-celebration', subsets: ['latin'], weight: '400', preload: false })
const pounceAccent = Kalam({ variable: '--font-accent', subsets: ['latin'], weight: '400', preload: false })

const trailheadDisplay = Baloo_2({ variable: '--font-celebration', subsets: ['latin'], preload: false })
const trailheadAccent = Patrick_Hand({
  variable: '--font-accent',
  subsets: ['latin'],
  weight: '400',
  preload: false,
})

export const themeFonts: Record<ThemeKey, { display: { variable: string }; accent: { variable: string } }> = {
  liftoff: { display: liftoffDisplay, accent: liftoffAccent },
  encore: { display: encoreDisplay, accent: encoreAccent },
  circuit: { display: circuitDisplay, accent: circuitAccent },
  premiere: { display: premiereDisplay, accent: premiereAccent },
  forge: { display: forgeDisplay, accent: forgeAccent },
  pounce: { display: pounceDisplay, accent: pounceAccent },
  trailhead: { display: trailheadDisplay, accent: trailheadAccent },
}

/** Convenience className string for a theme's phase-root wrapper div. */
export function themeFontClassName(theme: ThemeKey): string {
  const fonts = themeFonts[theme]
  return `${fonts.display.variable} ${fonts.accent.variable}`
}
