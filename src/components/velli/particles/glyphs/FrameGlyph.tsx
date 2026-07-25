import type { GlyphProps } from '../index'

/** A miniature film frame — the `premiere` ambient/burst glyph. */
export default function FrameGlyph({ size, color }: GlyphProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `${Math.max(1, size * 0.18)}px solid ${color}`,
        borderRadius: size * 0.15,
        boxSizing: 'border-box',
      }}
    />
  )
}
