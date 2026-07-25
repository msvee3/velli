import type { GlyphProps } from '../index'

/** A small diamond pulse — the `circuit` ambient/burst glyph. */
export default function PulseGlyph({ size, color }: GlyphProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: color,
        transform: 'rotate(45deg)',
        borderRadius: 2,
        boxShadow: `0 0 ${size * 0.8}px ${color}`,
      }}
    />
  )
}
