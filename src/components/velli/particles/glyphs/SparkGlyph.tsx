import type { GlyphProps } from '../index'

/** A four-point sparkle — rocket-exhaust glints and ambient stars for `liftoff`. */
export default function SparkGlyph({ size, color }: GlyphProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: color,
        clipPath: 'polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%)',
      }}
    />
  )
}
