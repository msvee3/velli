import Image from 'next/image'

export interface VelliLogoProps {
  size?: number
  /** Hairline ring — use on dark celebration surfaces so the tile's edge reads. */
  ring?: string
  className?: string
  priority?: boolean
}

/**
 * The velli brand tile.
 *
 * The source art is a filled square (dark blue plate, wordmark baked in), not
 * a transparent wordmark — so it's always rendered as a contained rounded tile
 * rather than laid over a themed gradient. It already contains the word
 * "velli", so call sites shouldn't repeat it as text alongside.
 *
 * Points at the pre-cropped 256px square rather than the 781x802 original,
 * which is both off-square and 667KB.
 */
export default function VelliLogo({ size = 32, ring, className = '', priority = false }: VelliLogoProps) {
  return (
    <Image
      src="/velli_mark.png"
      alt="velli"
      width={size}
      height={size}
      priority={priority}
      className={`shrink-0 rounded-[24%] object-cover ${className}`}
      style={ring ? { boxShadow: `0 0 0 1px ${ring}` } : undefined}
    />
  )
}
