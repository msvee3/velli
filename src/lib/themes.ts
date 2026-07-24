export type ThemeKey = 'stellar' | 'bloom' | 'dusk' | 'nebula' | 'ember'

/** Tokens shared by both phases — the depth/lighting layer of a palette. */
interface PhaseShared {
  pageBg: string // layered gradient stack for the full-screen bg
  orbGradient: string // multi-stop radial for the orb body
  ringColor: string // concentric ring strokes
  glow: string // ambient bloom cast behind the orb
  orbRim: string // rim-light picked up on the orb's lower edge
  vignette: string // overlay that darkens the edges for depth
  accent: string // ornaments, hairline rules, dividers
  titleGradient: string // background-clip gradient for display type
  ticker: { bg: string; border: string; text: string }
  btn: { bg: string; border: string; text: string }
}

export interface ThemePalette {
  announce: PhaseShared & {
    sparkColor: string // rising particle colour
    text: {
      tag: string // small uppercase label above orb
      title: string // main title (solid fallback / caret colour)
      couple: string // couple name (muted)
      countdown: string // countdown numbers
      countdownLabel: string // "days" / "hrs" labels
    }
  }
  reveal: PhaseShared & {
    petalColors: string[] // six colours for the petal burst
    text: {
      tag: string // "has arrived"
      name: string // baby name (solid fallback)
      stat: string // DOB, weight, height (muted)
    }
  }
  preview: { from: string; to: string } // two-tone swatch for the theme picker
  label: string
}

const VIGNETTE = (rgba: string) =>
  `radial-gradient(ellipse 85% 62% at 50% 40%, transparent 28%, ${rgba} 100%)`

export const themes: Record<ThemeKey, ThemePalette> = {
  stellar: {
    label: 'Stellar',
    preview: { from: '#8a4ae8', to: '#ffa72e' },
    announce: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #5a32a8 0%, #2d1b5e 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #3a1a6e 0%, transparent 60%),' +
        'linear-gradient(180deg, #150a30 0%, #0a0518 55%, #040209 100%)',
      orbGradient:
        'radial-gradient(circle at 34% 27%, #fbf4ff 0%, #e3ccff 9%, #b98cff 26%, #8a4ae8 48%, #5417bd 70%, #2a0a6b 87%, #120433 100%)',
      ringColor: 'rgba(186,140,255,0.20)',
      glow: 'rgba(150,88,255,0.45)',
      orbRim: 'rgba(214,180,255,0.40)',
      vignette: VIGNETTE('rgba(4,2,10,0.58)'),
      accent: '#c9a4ff',
      titleGradient: 'linear-gradient(135deg, #ffffff 0%, #ead9ff 38%, #b98cff 100%)',
      sparkColor: '#cba8ff',
      ticker: { bg: 'rgba(10,5,24,0.55)', border: 'rgba(186,140,255,0.16)', text: 'rgba(214,190,255,0.62)' },
      text: {
        tag: 'rgba(201,164,255,0.78)',
        title: '#f3e9ff',
        couple: 'rgba(212,186,255,0.52)',
        countdown: '#f3e9ff',
        countdownLabel: 'rgba(186,140,255,0.50)',
      },
      btn: { bg: 'rgba(160,110,255,0.12)', border: 'rgba(186,140,255,0.30)', text: 'rgba(226,206,255,0.75)' },
    },
    reveal: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #c8811a 0%, #7c4a0a 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #6b2f00 0%, transparent 60%),' +
        'linear-gradient(180deg, #43230a 0%, #180a02 55%, #0a0300 100%)',
      orbGradient:
        'radial-gradient(circle at 34% 27%, #fffdf4 0%, #ffeec2 9%, #ffd076 26%, #ffa72e 48%, #e0730f 70%, #96400a 87%, #4a1c02 100%)',
      ringColor: 'rgba(255,190,90,0.20)',
      glow: 'rgba(255,160,40,0.50)',
      orbRim: 'rgba(255,224,160,0.45)',
      vignette: VIGNETTE('rgba(10,3,0,0.58)'),
      accent: '#ffc061',
      titleGradient: 'linear-gradient(135deg, #fffdf7 0%, #ffe9bc 38%, #ffbc55 100%)',
      petalColors: ['#ffbc55', '#f59220', '#ffd484', '#ff9d3d', '#e8760f', '#ffca6a'],
      ticker: { bg: 'rgba(16,6,0,0.55)', border: 'rgba(255,180,70,0.18)', text: 'rgba(255,214,150,0.62)' },
      text: { tag: 'rgba(255,196,110,0.80)', name: '#fff9ec', stat: 'rgba(255,216,158,0.58)' },
      btn: { bg: 'rgba(255,170,50,0.13)', border: 'rgba(255,180,70,0.30)', text: 'rgba(255,224,160,0.80)' },
    },
  },

  bloom: {
    label: 'Bloom',
    preview: { from: '#2fb877', to: '#f2589a' },
    announce: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #147a55 0%, #0d3b2e 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #0b4a33 0%, transparent 60%),' +
        'linear-gradient(180deg, #072418 0%, #03130c 55%, #010805 100%)',
      orbGradient:
        'radial-gradient(circle at 34% 27%, #f2fff8 0%, #c8f8de 9%, #7ae3ac 26%, #2fb877 48%, #157a4a 70%, #0a4429 87%, #041c11 100%)',
      ringColor: 'rgba(94,224,150,0.20)',
      glow: 'rgba(45,200,125,0.42)',
      orbRim: 'rgba(180,248,214,0.40)',
      vignette: VIGNETTE('rgba(1,8,5,0.58)'),
      accent: '#7ae3ac',
      titleGradient: 'linear-gradient(135deg, #ffffff 0%, #d5fce8 38%, #6fdfa6 100%)',
      sparkColor: '#8fecb8',
      ticker: { bg: 'rgba(2,14,9,0.55)', border: 'rgba(94,224,150,0.16)', text: 'rgba(178,240,208,0.62)' },
      text: {
        tag: 'rgba(122,227,172,0.78)',
        title: '#eafff4',
        couple: 'rgba(176,238,206,0.52)',
        countdown: '#eafff4',
        countdownLabel: 'rgba(94,224,150,0.50)',
      },
      btn: { bg: 'rgba(45,200,125,0.12)', border: 'rgba(94,224,150,0.30)', text: 'rgba(198,246,220,0.75)' },
    },
    reveal: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #b02a60 0%, #6b1a3a 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #5a0f2e 0%, transparent 60%),' +
        'linear-gradient(180deg, #3d0c22 0%, #17040d 55%, #090106 100%)',
      orbGradient:
        'radial-gradient(circle at 34% 27%, #fff8fb 0%, #ffd9e7 9%, #ffa3c2 26%, #f2589a 48%, #c22468 70%, #7d0f40 87%, #38041c 100%)',
      ringColor: 'rgba(255,150,190,0.20)',
      glow: 'rgba(245,90,150,0.48)',
      orbRim: 'rgba(255,205,225,0.45)',
      vignette: VIGNETTE('rgba(9,1,6,0.58)'),
      accent: '#ffa3c2',
      titleGradient: 'linear-gradient(135deg, #fffafc 0%, #ffdcea 38%, #ff92ba 100%)',
      petalColors: ['#ff92ba', '#f2589a', '#ffb3cd', '#e03d80', '#ff7aa8', '#ffc9dc'],
      ticker: { bg: 'rgba(14,2,8,0.55)', border: 'rgba(255,150,190,0.18)', text: 'rgba(255,190,215,0.62)' },
      text: { tag: 'rgba(255,166,198,0.80)', name: '#fff5f9', stat: 'rgba(255,192,216,0.58)' },
      btn: { bg: 'rgba(245,90,150,0.13)', border: 'rgba(255,150,190,0.30)', text: 'rgba(255,205,226,0.80)' },
    },
  },

  dusk: {
    label: 'Dusk',
    preview: { from: '#d05a7c', to: '#dfae5c' },
    announce: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #7e1f3e 0%, #3b0d1a 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #4a0f22 0%, transparent 60%),' +
        'linear-gradient(180deg, #2a0812 0%, #120309 55%, #070104 100%)',
      orbGradient:
        'radial-gradient(circle at 34% 27%, #fff4f7 0%, #fbd3de 9%, #ef9ab0 26%, #d05a7c 48%, #96284a 70%, #5c0f28 87%, #260510 100%)',
      ringColor: 'rgba(232,140,170,0.20)',
      glow: 'rgba(214,80,120,0.42)',
      orbRim: 'rgba(252,208,220,0.42)',
      vignette: VIGNETTE('rgba(7,1,4,0.58)'),
      accent: '#ef9ab0',
      titleGradient: 'linear-gradient(135deg, #fffafb 0%, #fbdae3 38%, #e78ba6 100%)',
      sparkColor: '#f0a8bd',
      ticker: { bg: 'rgba(12,3,7,0.55)', border: 'rgba(232,140,170,0.16)', text: 'rgba(246,192,208,0.62)' },
      text: {
        tag: 'rgba(239,154,176,0.78)',
        title: '#fdeef2',
        couple: 'rgba(240,190,205,0.52)',
        countdown: '#fdeef2',
        countdownLabel: 'rgba(232,140,170,0.50)',
      },
      btn: { bg: 'rgba(214,80,120,0.12)', border: 'rgba(232,140,170,0.30)', text: 'rgba(250,210,222,0.75)' },
    },
    reveal: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #b58330 0%, #6b4a1a 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #5a3a0c 0%, transparent 60%),' +
        'linear-gradient(180deg, #3d2809 0%, #170e02 55%, #0a0600 100%)',
      orbGradient:
        'radial-gradient(circle at 34% 27%, #fffdf6 0%, #fdeecb 9%, #f6d494 26%, #dfae5c 48%, #a97c2c 70%, #6d4c12 87%, #2e1f04 100%)',
      ringColor: 'rgba(246,212,148,0.20)',
      glow: 'rgba(224,176,90,0.45)',
      orbRim: 'rgba(253,238,203,0.45)',
      vignette: VIGNETTE('rgba(10,6,0,0.58)'),
      accent: '#f6d494',
      titleGradient: 'linear-gradient(135deg, #fffdf8 0%, #fbeccb 38%, #e6bd72 100%)',
      petalColors: ['#e6bd72', '#f6d494', '#c99a45', '#fbe3ac', '#d8ab58', '#f0cb85'],
      ticker: { bg: 'rgba(14,9,1,0.55)', border: 'rgba(246,212,148,0.18)', text: 'rgba(250,225,175,0.62)' },
      text: { tag: 'rgba(246,212,148,0.80)', name: '#fffaf0', stat: 'rgba(250,224,172,0.58)' },
      btn: { bg: 'rgba(224,176,90,0.13)', border: 'rgba(246,212,148,0.30)', text: 'rgba(252,232,190,0.80)' },
    },
  },

  nebula: {
    label: 'Nebula',
    preview: { from: '#4a72ea', to: '#a061ee' },
    announce: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #1e3a8f 0%, #0a1535 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #101f52 0%, transparent 60%),' +
        'linear-gradient(180deg, #060e26 0%, #030713 55%, #010308 100%)',
      orbGradient:
        'radial-gradient(circle at 34% 27%, #f4f8ff 0%, #cfdeff 9%, #90b0ff 26%, #4a72ea 48%, #1f3fbe 70%, #0e2070 87%, #040b2e 100%)',
      ringColor: 'rgba(122,158,255,0.20)',
      glow: 'rgba(70,110,255,0.45)',
      orbRim: 'rgba(196,216,255,0.42)',
      vignette: VIGNETTE('rgba(1,3,8,0.58)'),
      accent: '#90b0ff',
      titleGradient: 'linear-gradient(135deg, #ffffff 0%, #dbe6ff 38%, #86a8ff 100%)',
      sparkColor: '#a3bcff',
      ticker: { bg: 'rgba(3,7,20,0.55)', border: 'rgba(122,158,255,0.16)', text: 'rgba(186,206,255,0.62)' },
      text: {
        tag: 'rgba(144,176,255,0.78)',
        title: '#e9f0ff',
        couple: 'rgba(184,204,255,0.52)',
        countdown: '#e9f0ff',
        countdownLabel: 'rgba(122,158,255,0.50)',
      },
      btn: { bg: 'rgba(70,110,255,0.12)', border: 'rgba(122,158,255,0.30)', text: 'rgba(206,222,255,0.75)' },
    },
    reveal: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #6a2ab0 0%, #3d1a6b 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #2e0f58 0%, transparent 60%),' +
        'linear-gradient(180deg, #220d42 0%, #0d051c 55%, #05020c 100%)',
      orbGradient:
        'radial-gradient(circle at 34% 27%, #fdf8ff 0%, #eeddff 9%, #cfa6ff 26%, #a061ee 48%, #6d29c2 70%, #43117c 87%, #1c0538 100%)',
      ringColor: 'rgba(200,150,255,0.20)',
      glow: 'rgba(160,90,240,0.48)',
      orbRim: 'rgba(236,216,255,0.45)',
      vignette: VIGNETTE('rgba(5,2,12,0.58)'),
      accent: '#cfa6ff',
      titleGradient: 'linear-gradient(135deg, #fdfaff 0%, #eaddff 38%, #bb8bff 100%)',
      petalColors: ['#bb8bff', '#a061ee', '#d4b0ff', '#8a3fdc', '#c79aff', '#e6d0ff'],
      ticker: { bg: 'rgba(9,4,18,0.55)', border: 'rgba(200,150,255,0.18)', text: 'rgba(220,192,255,0.62)' },
      text: { tag: 'rgba(207,166,255,0.80)', name: '#faf5ff', stat: 'rgba(222,196,255,0.58)' },
      btn: { bg: 'rgba(160,90,240,0.13)', border: 'rgba(200,150,255,0.30)', text: 'rgba(232,212,255,0.80)' },
    },
  },

  ember: {
    label: 'Ember',
    preview: { from: '#c2a63e', to: '#f57f24' },
    announce: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #6b5410 0%, #2a2109 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #3d2f08 0%, transparent 60%),' +
        'linear-gradient(180deg, #1c1607 0%, #0b0904 55%, #040301 100%)',
      orbGradient:
        'radial-gradient(circle at 34% 27%, #fffdf0 0%, #f8eec0 9%, #e8d382 26%, #c2a63e 48%, #8a731f 70%, #55440e 87%, #211a04 100%)',
      ringColor: 'rgba(226,198,110,0.20)',
      glow: 'rgba(210,175,70,0.42)',
      orbRim: 'rgba(248,238,192,0.42)',
      vignette: VIGNETTE('rgba(4,3,1,0.58)'),
      accent: '#e8d382',
      titleGradient: 'linear-gradient(135deg, #fffef8 0%, #f8edc4 38%, #dbc063 100%)',
      sparkColor: '#e6d089',
      ticker: { bg: 'rgba(10,8,3,0.55)', border: 'rgba(226,198,110,0.16)', text: 'rgba(240,222,160,0.62)' },
      text: {
        tag: 'rgba(232,211,130,0.78)',
        title: '#f9f2da',
        couple: 'rgba(234,218,164,0.52)',
        countdown: '#f9f2da',
        countdownLabel: 'rgba(226,198,110,0.50)',
      },
      btn: { bg: 'rgba(210,175,70,0.12)', border: 'rgba(226,198,110,0.30)', text: 'rgba(244,230,180,0.75)' },
    },
    reveal: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #c04f10 0%, #6b2808 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #5a1d04 0%, transparent 60%),' +
        'linear-gradient(180deg, #3d1503 0%, #170701 55%, #0a0200 100%)',
      orbGradient:
        'radial-gradient(circle at 34% 27%, #fffaf2 0%, #ffe2bd 9%, #ffb977 26%, #f57f24 48%, #c4500b 70%, #7d2e04 87%, #341001 100%)',
      ringColor: 'rgba(255,165,90,0.20)',
      glow: 'rgba(255,120,35,0.50)',
      orbRim: 'rgba(255,222,186,0.45)',
      vignette: VIGNETTE('rgba(10,2,0,0.58)'),
      accent: '#ffb977',
      titleGradient: 'linear-gradient(135deg, #fffcf7 0%, #ffe5c6 38%, #ffa85c 100%)',
      petalColors: ['#ffa85c', '#f57f24', '#ffc48f', '#e0630f', '#ff9440', '#ffd4aa'],
      ticker: { bg: 'rgba(14,4,0,0.55)', border: 'rgba(255,165,90,0.18)', text: 'rgba(255,200,155,0.62)' },
      text: { tag: 'rgba(255,185,119,0.80)', name: '#fff7ee', stat: 'rgba(255,204,160,0.58)' },
      btn: { bg: 'rgba(255,120,35,0.13)', border: 'rgba(255,165,90,0.30)', text: 'rgba(255,222,186,0.80)' },
    },
  },
}

export const themeKeys = Object.keys(themes) as ThemeKey[]

export function ordinalTag(birthOrder: number): string {
  if (birthOrder <= 1) return 'Our first'
  const words: Record<number, string> = { 2: 'two', 3: 'three', 4: 'four' }
  return `Baby number ${words[birthOrder] ?? birthOrder}`
}
