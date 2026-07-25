import type { GlyphProps } from '../index'

/** A single leaf — the `trailhead` ambient/burst glyph. */
export default function LeafGlyph({ size, color }: GlyphProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: color,
        borderRadius: '0% 100% 0% 100%',
        transform: 'rotate(45deg)',
      }}
    />
  )
}
