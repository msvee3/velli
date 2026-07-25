import type { GlyphProps } from '../index'

/** A tiny paw print — the `pounce` ambient/burst glyph. */
export default function PawGlyph({ size, color }: GlyphProps) {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '60%',
          width: size * 0.62,
          height: size * 0.5,
          borderRadius: '45%',
          background: color,
          transform: 'translate(-50%,-50%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '30%',
          top: '24%',
          width: size * 0.28,
          height: size * 0.28,
          borderRadius: '50%',
          background: color,
          transform: 'translate(-50%,-50%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '70%',
          top: '24%',
          width: size * 0.28,
          height: size * 0.28,
          borderRadius: '50%',
          background: color,
          transform: 'translate(-50%,-50%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '10%',
          width: size * 0.3,
          height: size * 0.3,
          borderRadius: '50%',
          background: color,
          transform: 'translate(-50%,-50%)',
        }}
      />
    </div>
  )
}
