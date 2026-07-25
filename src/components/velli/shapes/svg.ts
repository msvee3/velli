import type { CSSProperties } from 'react'

/**
 * Shape silhouettes are authored as SVG paths and applied as a CSS mask over a
 * div carrying the palette's `heroGradient`.
 *
 * Why masking rather than an <svg fill="...">: `heroGradient` is a CSS gradient
 * *string*, which cannot fill an SVG path (that needs an inline <linearGradient>
 * def). Masking keeps the palette contract in themes.ts exactly as-is while
 * giving crisp, complex geometry that survives being scaled down to a 56px
 * picker swatch — the old div-stack shapes lost all their detail there.
 *
 * All holes rely on `fill-rule: evenodd`: an inner subpath punches through the
 * outer one, so the alpha mask genuinely cuts out rather than painting black
 * (a black fill would still be opaque, i.e. still visible).
 */

const n = (v: number) => Number(v.toFixed(3))

/** A circle as a standalone subpath, for composing cutouts via evenodd. */
export function circleSub(cx: number, cy: number, r: number): string {
  return `M${n(cx - r)},${n(cy)}a${n(r)},${n(r)} 0 1,0 ${n(r * 2)},0a${n(r)},${n(r)} 0 1,0 ${n(-r * 2)},0Z`
}

/** A cog outline: `teeth` flat-topped teeth swept between root and outer radius. */
export function gearSub(cx: number, cy: number, teeth: number, rRoot: number, rOuter: number): string {
  const step = (Math.PI * 2) / teeth
  const tipHalf = step * 0.19
  const rootHalf = step * 0.33
  const pt = (angle: number, r: number) => `${n(cx + r * Math.cos(angle))},${n(cy + r * Math.sin(angle))}`

  const points: string[] = []
  for (let i = 0; i < teeth; i++) {
    const a = i * step - Math.PI / 2
    points.push(pt(a - rootHalf, rRoot), pt(a - tipHalf, rOuter), pt(a + tipHalf, rOuter), pt(a + rootHalf, rRoot))
  }
  return `M${points.join('L')}Z`
}

/** Turns a path into the CSS mask properties that clip an element to it. */
export function svgMask(path: string, viewBox = '0 0 100 100'): CSSProperties {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><path d="${path}" fill="#fff" fill-rule="evenodd"/></svg>`
  const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  return {
    maskImage: url,
    WebkitMaskImage: url,
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
  }
}
