import type { GlyphProps } from '../index'

/** A glowing rivet/spark dot — the `forge` ambient/burst glyph. */
export default function RivetGlyph({ size, color }: GlyphProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 ${size}px ${color}`,
      }}
    />
  )
}
