import type { ComponentType } from 'react'
import type { PhaseShared, ThemeKey } from '@/lib/themes'
import RocketShape from './RocketShape'
import RecordShape from './RecordShape'
import ChipShape from './ChipShape'
import ReelShape from './ReelShape'
import GearShape from './GearShape'
import PawBadgeShape from './PawBadgeShape'
import CompassShape from './CompassShape'

export interface HeroShapeProps {
  palette: PhaseShared
  /** Pixel size of the shape's bounding box — used for proportional math (blur radii, tooth length), the box itself is sized by its parent via 100%/100%. */
  size: number
  dim?: boolean
}

export const heroShapes: Record<ThemeKey, ComponentType<HeroShapeProps>> = {
  liftoff: RocketShape,
  encore: RecordShape,
  circuit: ChipShape,
  premiere: ReelShape,
  forge: GearShape,
  pounce: PawBadgeShape,
  trailhead: CompassShape,
}
