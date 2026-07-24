import QRCode from 'qrcode'
import type { ThemeKey } from '@/lib/themes'
import { themes } from '@/lib/themes'

/**
 * Renders a QR code as a data URL, themed to the page's own palette
 * (foreground = the theme's title colour, transparent background)
 * so the download matches the page it links to instead of default black-on-white.
 */
export async function themedQrDataUrl(url: string, theme: ThemeKey): Promise<string> {
  const dark = themes[theme].announce.text.title
  return QRCode.toDataURL(url, {
    margin: 1,
    width: 512,
    color: { dark, light: '#00000000' },
  })
}
