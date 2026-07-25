'use client'

import type { HeroShapeProps } from './index'
import MaskedShape from './MaskedShape'

/**
 * The paw *is* the silhouette, lit by the palette gradient.
 *
 * The previous version painted near-black pads on top of a dark badge, so at
 * swatch size it collapsed into a featureless disc — inverting it to a lit
 * paw on open background is what makes it legible.
 */
// Main pad + four toes, sized so the whole print fills the 100x100 box.
const PAD = 'M50 96c-16 0-27-9.5-27-21 0-10.5 10-18.5 27-18.5S77 64.5 77 75c0 11.5-11 21-27 21Z'
const TOES = [
  'M20 52c-7 0-12-6.5-12-14.5S13 22 20 22s12 7 12 15.5S27 52 20 52Z',
  'M38.5 34c-7.5 0-13-7.5-13-16.5S31 2 38.5 2s13 7 13 16S46 34 38.5 34Z',
  'M61.5 34c-7.5 0-13-7-13-16s5.5-16 13-16 13 6.5 13 15.5-5.5 16.5-13 16.5Z',
  'M80 52c-7 0-12-6-12-14.5S73 22 80 22s12 7.5 12 15.5S87 52 80 52Z',
].join('')

export default function PawBadgeShape({ palette, size, dim }: HeroShapeProps) {
  return <MaskedShape path={`${PAD}${TOES}`} palette={palette} size={size} dim={dim} />
}
