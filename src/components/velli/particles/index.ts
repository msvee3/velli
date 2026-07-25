import type { ThemeKey } from '@/lib/themes'
import SparkGlyph from './glyphs/SparkGlyph'
import NoteGlyph from './glyphs/NoteGlyph'
import PulseGlyph from './glyphs/PulseGlyph'
import FrameGlyph from './glyphs/FrameGlyph'
import RivetGlyph from './glyphs/RivetGlyph'
import PawGlyph from './glyphs/PawGlyph'
import LeafGlyph from './glyphs/LeafGlyph'

export interface GlyphProps {
  size: number
  color: string
}

export type GlyphRenderer = (props: GlyphProps) => React.ReactNode

export const particleGlyphs: Record<ThemeKey, GlyphRenderer> = {
  liftoff: SparkGlyph,
  encore: NoteGlyph,
  circuit: PulseGlyph,
  premiere: FrameGlyph,
  forge: RivetGlyph,
  pounce: PawGlyph,
  trailhead: LeafGlyph,
}
