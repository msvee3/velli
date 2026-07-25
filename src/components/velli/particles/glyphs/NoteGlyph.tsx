import type { GlyphProps } from '../index'

/** A floating eighth note — the `encore` ambient/burst glyph. */
export default function NoteGlyph({ size, color }: GlyphProps) {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: size * 0.62,
          height: size * 0.62,
          borderRadius: '50%',
          background: color,
          transform: 'rotate(-16deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: size * 0.08,
          top: size * 0.02,
          width: Math.max(1, size * 0.12),
          height: size * 0.85,
          background: color,
          borderRadius: 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: size * 0.08,
          top: size * 0.02,
          width: size * 0.4,
          height: size * 0.22,
          background: color,
          borderRadius: '0 999px 999px 0',
        }}
      />
    </div>
  )
}
