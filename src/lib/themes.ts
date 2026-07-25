export type ThemeKey = 'liftoff' | 'encore' | 'circuit' | 'premiere' | 'forge' | 'pounce' | 'trailhead'

/** Tokens shared by both phases — the depth/lighting layer of a palette. */
export interface PhaseShared {
  pageBg: string // layered gradient stack for the full-screen bg
  heroGradient: string // multi-stop gradient for the hero shape's body fill
  ringColor: string // concentric ring strokes
  glow: string // ambient bloom cast behind the hero shape
  heroRim: string // rim-light picked up on the hero shape's lower edge
  vignette: string // overlay that darkens the edges for depth
  accent: string // ornaments, hairline rules, dividers
  titleGradient: string // background-clip gradient for display type
  ticker: { bg: string; border: string; text: string }
  btn: { bg: string; border: string; text: string }
}

export interface ThemePalette {
  announce: PhaseShared & {
    particleColor: string // ambient particle colour (stars, notes, pulses, motes...)
    text: {
      tag: string // small uppercase label above hero shape
      title: string // main title (solid fallback / caret colour)
      couple: string // couple name (muted)
      countdown: string // countdown numbers
      countdownLabel: string // "days" / "hrs" labels
    }
  }
  reveal: PhaseShared & {
    burstColors: string[] // six colours for the reveal-burst particles
    text: {
      tag: string // "has arrived"
      name: string // baby name (solid fallback)
      stat: string // DOB, weight, height (muted)
    }
  }
  /** Some accent fonts (handwritten/script faces) have no real italic cut — forcing CSS italic synthesizes an ugly oblique. */
  accentFontStyle: 'italic' | 'normal'
  preview: { from: string; to: string } // two-tone swatch for the theme picker
  label: string
}

const VIGNETTE = (rgba: string) =>
  `radial-gradient(ellipse 85% 62% at 50% 40%, transparent 28%, ${rgba} 100%)`

export const themes: Record<ThemeKey, ThemePalette> = {
  liftoff: {
    label: 'Liftoff',
    preview: { from: '#2b6cff', to: '#ff6a2e' },
    accentFontStyle: 'italic',
    announce: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #14306e 0%, #0a1836 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #0d2450 0%, transparent 60%),' +
        'linear-gradient(180deg, #060e26 0%, #030713 55%, #010308 100%)',
      heroGradient:
        'linear-gradient(160deg, #fdfeff 0%, #d9e6ff 12%, #9db9f2 32%, #4a72ea 56%, #21408f 76%, #0d1e4a 92%, #040a1e 100%)',
      ringColor: 'rgba(120,170,255,0.20)',
      glow: 'rgba(70,130,255,0.45)',
      heroRim: 'rgba(180,210,255,0.40)',
      vignette: VIGNETTE('rgba(3,6,16,0.58)'),
      accent: '#8fb8ff',
      titleGradient: 'linear-gradient(135deg, #ffffff 0%, #dce8ff 38%, #7fa8ff 100%)',
      particleColor: '#a8c8ff',
      ticker: { bg: 'rgba(4,8,22,0.55)', border: 'rgba(120,170,255,0.16)', text: 'rgba(190,210,255,0.62)' },
      text: {
        tag: 'rgba(143,184,255,0.78)',
        title: '#eaf1ff',
        couple: 'rgba(190,210,255,0.52)',
        countdown: '#eaf1ff',
        countdownLabel: 'rgba(120,170,255,0.50)',
      },
      btn: { bg: 'rgba(70,130,255,0.12)', border: 'rgba(120,170,255,0.30)', text: 'rgba(210,224,255,0.75)' },
    },
    reveal: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #c2440f 0%, #6b2206 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #5a1c02 0%, transparent 60%),' +
        'linear-gradient(180deg, #3d1503 0%, #170701 55%, #0a0200 100%)',
      heroGradient:
        'linear-gradient(160deg, #fffdf4 0%, #ffe2b0 14%, #ffb15f 34%, #ff7a2e 56%, #d24e0c 76%, #7a2604 92%, #341001 100%)',
      ringColor: 'rgba(255,150,90,0.20)',
      glow: 'rgba(255,110,40,0.50)',
      heroRim: 'rgba(255,200,140,0.45)',
      vignette: VIGNETTE('rgba(12,4,0,0.58)'),
      accent: '#ffab63',
      titleGradient: 'linear-gradient(135deg, #fffaf3 0%, #ffdcae 38%, #ff9a4d 100%)',
      burstColors: ['#ff9a4d', '#ffb15f', '#ffd484', '#ff7a2e', '#ffcf8a', '#f2650f'],
      ticker: { bg: 'rgba(16,5,0,0.55)', border: 'rgba(255,150,90,0.18)', text: 'rgba(255,205,160,0.62)' },
      text: { tag: 'rgba(255,171,99,0.80)', name: '#fff7ee', stat: 'rgba(255,208,164,0.58)' },
      btn: { bg: 'rgba(255,110,40,0.13)', border: 'rgba(255,150,90,0.30)', text: 'rgba(255,208,164,0.80)' },
    },
  },

  encore: {
    label: 'Encore',
    preview: { from: '#e0349b', to: '#ffce3d' },
    accentFontStyle: 'normal',
    announce: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #7a1f66 0%, #3b0d34 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #4a1042 0%, transparent 60%),' +
        'linear-gradient(180deg, #250a20 0%, #12030f 55%, #070106 100%)',
      heroGradient:
        'radial-gradient(circle at 34% 27%, #2a1224 0%, #3a1830 22%, #591f4a 44%, #7a276a 66%, #4a1440 84%, #1c0718 100%)',
      ringColor: 'rgba(230,110,200,0.20)',
      glow: 'rgba(220,70,180,0.45)',
      heroRim: 'rgba(255,190,230,0.40)',
      vignette: VIGNETTE('rgba(7,1,6,0.58)'),
      accent: '#f0a8dd',
      titleGradient: 'linear-gradient(135deg, #ffffff 0%, #ffd9f2 38%, #f086d8 100%)',
      particleColor: '#f5b8e8',
      ticker: { bg: 'rgba(12,3,10,0.55)', border: 'rgba(230,110,200,0.16)', text: 'rgba(240,190,225,0.62)' },
      text: {
        tag: 'rgba(240,168,221,0.78)',
        title: '#fdeefa',
        couple: 'rgba(240,196,228,0.52)',
        countdown: '#fdeefa',
        countdownLabel: 'rgba(230,110,200,0.50)',
      },
      btn: { bg: 'rgba(220,70,180,0.12)', border: 'rgba(230,110,200,0.30)', text: 'rgba(250,210,238,0.75)' },
    },
    reveal: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #a8791a 0%, #5c3f0a 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #4a3105 0%, transparent 60%),' +
        'linear-gradient(180deg, #382504 0%, #150e01 55%, #090500 100%)',
      heroGradient:
        'radial-gradient(circle at 34% 27%, #3a2c08 0%, #4f3c0a 22%, #7a5c10 44%, #d4a325 66%, #ffce3d 84%, #8a6614 100%)',
      ringColor: 'rgba(255,214,110,0.20)',
      glow: 'rgba(255,196,60,0.48)',
      heroRim: 'rgba(255,236,180,0.45)',
      vignette: VIGNETTE('rgba(9,5,0,0.58)'),
      accent: '#ffd66e',
      titleGradient: 'linear-gradient(135deg, #fffdf5 0%, #ffedbc 38%, #ffce3d 100%)',
      burstColors: ['#ffce3d', '#ffe08a', '#f0a8dd', '#ffdc6e', '#e074c2', '#ffe9b0'],
      ticker: { bg: 'rgba(14,9,0,0.55)', border: 'rgba(255,214,110,0.18)', text: 'rgba(255,228,160,0.62)' },
      text: { tag: 'rgba(255,214,110,0.80)', name: '#fffaef', stat: 'rgba(255,226,164,0.58)' },
      btn: { bg: 'rgba(255,196,60,0.13)', border: 'rgba(255,214,110,0.30)', text: 'rgba(255,232,180,0.80)' },
    },
  },

  circuit: {
    label: 'Circuit',
    preview: { from: '#00e0a8', to: '#2b6cff' },
    accentFontStyle: 'italic',
    announce: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #0b3a34 0%, #071c1e 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #082a28 0%, transparent 60%),' +
        'linear-gradient(180deg, #030f0e 0%, #020807 55%, #010403 100%)',
      heroGradient:
        'linear-gradient(155deg, #eafff8 0%, #a8f5dc 14%, #4de6b4 32%, #0fbf8c 54%, #0a8a68 74%, #054a3a 90%, #021c16 100%)',
      ringColor: 'rgba(60,230,180,0.20)',
      glow: 'rgba(30,220,170,0.45)',
      heroRim: 'rgba(150,255,220,0.40)',
      vignette: VIGNETTE('rgba(1,4,3,0.58)'),
      accent: '#7af0c8',
      titleGradient: 'linear-gradient(135deg, #ffffff 0%, #d0ffee 38%, #5aeec0 100%)',
      particleColor: '#7af0c8',
      ticker: { bg: 'rgba(2,14,12,0.55)', border: 'rgba(60,230,180,0.16)', text: 'rgba(150,240,210,0.62)' },
      text: {
        tag: 'rgba(122,240,200,0.78)',
        title: '#e8fff6',
        couple: 'rgba(160,238,210,0.52)',
        countdown: '#e8fff6',
        countdownLabel: 'rgba(60,230,180,0.50)',
      },
      btn: { bg: 'rgba(30,220,170,0.12)', border: 'rgba(60,230,180,0.30)', text: 'rgba(198,248,226,0.75)' },
    },
    reveal: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #123a8f 0%, #081b42 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #0c2560 0%, transparent 60%),' +
        'linear-gradient(180deg, #050f2a 0%, #020712 55%, #010208 100%)',
      heroGradient:
        'linear-gradient(155deg, #f4faff 0%, #cfe4ff 14%, #7fb4ff 32%, #2e86ff 54%, #1257c4 74%, #0a2f74 90%, #030f2e 100%)',
      ringColor: 'rgba(120,180,255,0.20)',
      glow: 'rgba(60,140,255,0.48)',
      heroRim: 'rgba(200,226,255,0.45)',
      vignette: VIGNETTE('rgba(1,3,10,0.58)'),
      accent: '#8fc4ff',
      titleGradient: 'linear-gradient(135deg, #ffffff 0%, #dcecff 38%, #6fb0ff 100%)',
      burstColors: ['#6fb0ff', '#7af0c8', '#a8d4ff', '#2e86ff', '#bdf5e2', '#4fc9ff'],
      ticker: { bg: 'rgba(3,7,20,0.55)', border: 'rgba(120,180,255,0.18)', text: 'rgba(190,220,255,0.62)' },
      text: { tag: 'rgba(143,196,255,0.80)', name: '#f2f9ff', stat: 'rgba(200,226,255,0.58)' },
      btn: { bg: 'rgba(60,140,255,0.13)', border: 'rgba(120,180,255,0.30)', text: 'rgba(214,232,255,0.80)' },
    },
  },

  premiere: {
    label: 'Premiere',
    preview: { from: '#7c1f3d', to: '#e8b84b' },
    accentFontStyle: 'italic',
    announce: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #6b1530 0%, #38091b 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #470f24 0%, transparent 60%),' +
        'linear-gradient(180deg, #250810 0%, #100307 55%, #060103 100%)',
      heroGradient:
        'radial-gradient(circle at 34% 27%, #efe3d8 0%, #c9a892 12%, #8a5646 30%, #4d2620 50%, #2a120f 70%, #150807 87%, #060303 100%)',
      ringColor: 'rgba(220,150,170,0.20)',
      glow: 'rgba(190,40,80,0.42)',
      heroRim: 'rgba(240,190,205,0.42)',
      vignette: VIGNETTE('rgba(6,1,3,0.58)'),
      accent: '#e8a0b8',
      titleGradient: 'linear-gradient(135deg, #fffafb 0%, #f6d9e3 38%, #e089a6 100%)',
      particleColor: '#e8b0c0',
      ticker: { bg: 'rgba(10,2,5,0.55)', border: 'rgba(220,150,170,0.16)', text: 'rgba(240,192,208,0.62)' },
      text: {
        tag: 'rgba(232,160,184,0.78)',
        title: '#fdeef2',
        couple: 'rgba(238,190,205,0.52)',
        countdown: '#fdeef2',
        countdownLabel: 'rgba(220,150,170,0.50)',
      },
      btn: { bg: 'rgba(190,40,80,0.12)', border: 'rgba(220,150,170,0.30)', text: 'rgba(248,208,222,0.75)' },
    },
    reveal: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #a87a1a 0%, #5c3f0a 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #46300a 0%, transparent 60%),' +
        'linear-gradient(180deg, #2a1c05 0%, #120b02 55%, #080400 100%)',
      heroGradient:
        'radial-gradient(circle at 34% 27%, #fffaf0 0%, #f6e2b0 14%, #e8c168 32%, #d4a02c 54%, #8a6416 74%, #4a3308 90%, #201802 100%)',
      ringColor: 'rgba(246,212,148,0.20)',
      glow: 'rgba(224,176,60,0.48)',
      heroRim: 'rgba(253,238,203,0.45)',
      vignette: VIGNETTE('rgba(8,5,0,0.58)'),
      accent: '#e8c168',
      titleGradient: 'linear-gradient(135deg, #fffdf6 0%, #fbeccb 38%, #e6bd6a 100%)',
      burstColors: ['#e6bd6a', '#f6d494', '#e8a0b8', '#d4a02c', '#f0cb85', '#c9997a'],
      ticker: { bg: 'rgba(12,8,1,0.55)', border: 'rgba(246,212,148,0.18)', text: 'rgba(250,225,175,0.62)' },
      text: { tag: 'rgba(232,193,104,0.80)', name: '#fffaf0', stat: 'rgba(250,224,172,0.58)' },
      btn: { bg: 'rgba(224,176,60,0.13)', border: 'rgba(246,212,148,0.30)', text: 'rgba(252,232,190,0.80)' },
    },
  },

  forge: {
    label: 'Forge',
    preview: { from: '#8a8f98', to: '#ff7a24' },
    accentFontStyle: 'italic',
    announce: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #3a3d44 0%, #1b1d22 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #2a1f10 0%, transparent 60%),' +
        'linear-gradient(180deg, #16171a 0%, #0a0a0c 55%, #040404 100%)',
      heroGradient:
        'linear-gradient(160deg, #f4f5f6 0%, #d6d9dc 14%, #a6acb2 32%, #767c83 52%, #4c5057 72%, #26282c 88%, #0c0d0e 100%)',
      ringColor: 'rgba(226,198,110,0.20)',
      glow: 'rgba(230,140,40,0.42)',
      heroRim: 'rgba(255,210,150,0.42)',
      vignette: VIGNETTE('rgba(4,4,4,0.58)'),
      accent: '#f0b060',
      titleGradient: 'linear-gradient(135deg, #ffffff 0%, #ececec 38%, #d0b06a 100%)',
      particleColor: '#ffb060',
      ticker: { bg: 'rgba(10,10,11,0.55)', border: 'rgba(226,198,110,0.16)', text: 'rgba(220,210,190,0.62)' },
      text: {
        tag: 'rgba(240,176,96,0.78)',
        title: '#f4f4f2',
        couple: 'rgba(214,206,192,0.52)',
        countdown: '#f4f4f2',
        countdownLabel: 'rgba(226,198,110,0.50)',
      },
      btn: { bg: 'rgba(230,140,40,0.12)', border: 'rgba(226,198,110,0.30)', text: 'rgba(244,230,180,0.75)' },
    },
    reveal: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #c0440f 0%, #6b2408 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #501a04 0%, transparent 60%),' +
        'linear-gradient(180deg, #341203 0%, #150701 55%, #090300 100%)',
      heroGradient:
        'radial-gradient(circle at 34% 27%, #fff8ec 0%, #ffd9a0 12%, #ff9d4a 30%, #f0631a 50%, #a83c0a 70%, #5c1e04 87%, #241000 100%)',
      ringColor: 'rgba(255,165,90,0.20)',
      glow: 'rgba(255,120,35,0.50)',
      heroRim: 'rgba(255,222,186,0.45)',
      vignette: VIGNETTE('rgba(9,3,0,0.58)'),
      accent: '#ffb977',
      titleGradient: 'linear-gradient(135deg, #fffcf7 0%, #ffe5c6 38%, #ffa15c 100%)',
      burstColors: ['#ffa15c', '#f0631a', '#ffc48f', '#e0630f', '#ff9440', '#d6d9dc'],
      ticker: { bg: 'rgba(12,4,0,0.55)', border: 'rgba(255,165,90,0.18)', text: 'rgba(255,200,155,0.62)' },
      text: { tag: 'rgba(255,185,119,0.80)', name: '#fff7ee', stat: 'rgba(255,204,160,0.58)' },
      btn: { bg: 'rgba(255,120,35,0.13)', border: 'rgba(255,165,90,0.30)', text: 'rgba(255,222,186,0.80)' },
    },
  },

  pounce: {
    label: 'Pounce',
    preview: { from: '#2b3a67', to: '#ffce54' },
    accentFontStyle: 'normal',
    announce: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #24346e 0%, #101a3c 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #182852 0%, transparent 60%),' +
        'linear-gradient(180deg, #0a1128 0%, #050814 55%, #02040a 100%)',
      heroGradient:
        'radial-gradient(circle at 34% 27%, #f2f4ff 0%, #c3cdf2 10%, #6e7cd4 28%, #37429c 48%, #202a6e 68%, #10163f 86%, #05071a 100%)',
      ringColor: 'rgba(255,210,110,0.20)',
      glow: 'rgba(255,190,80,0.38)',
      heroRim: 'rgba(255,230,180,0.42)',
      vignette: VIGNETTE('rgba(2,4,10,0.58)'),
      accent: '#ffce6b',
      titleGradient: 'linear-gradient(135deg, #ffffff 0%, #dbe0ff 38%, #8f9de6 100%)',
      particleColor: '#ffd98a',
      ticker: { bg: 'rgba(6,9,22,0.55)', border: 'rgba(255,210,110,0.16)', text: 'rgba(210,216,250,0.62)' },
      text: {
        tag: 'rgba(255,206,107,0.78)',
        title: '#eef0fb',
        couple: 'rgba(200,208,244,0.52)',
        countdown: '#eef0fb',
        countdownLabel: 'rgba(255,210,110,0.50)',
      },
      btn: { bg: 'rgba(255,190,80,0.12)', border: 'rgba(255,210,110,0.30)', text: 'rgba(248,230,190,0.75)' },
    },
    reveal: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #b58316 0%, #6b4a08 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #4a3204 0%, transparent 60%),' +
        'linear-gradient(180deg, #362403 0%, #150e01 55%, #090500 100%)',
      heroGradient:
        'radial-gradient(circle at 34% 27%, #fffdf2 0%, #ffefb8 12%, #ffd766 30%, #f0b62a 50%, #a87c14 70%, #5c4406 87%, #241a01 100%)',
      ringColor: 'rgba(255,214,110,0.20)',
      glow: 'rgba(240,182,42,0.48)',
      heroRim: 'rgba(255,240,200,0.45)',
      vignette: VIGNETTE('rgba(9,6,0,0.58)'),
      accent: '#ffd766',
      titleGradient: 'linear-gradient(135deg, #fffdf5 0%, #ffefc0 38%, #f0b62a 100%)',
      burstColors: ['#ffd766', '#37429c', '#ffe9a0', '#6e7cd4', '#f0b62a', '#c3cdf2'],
      ticker: { bg: 'rgba(14,9,0,0.55)', border: 'rgba(255,214,110,0.18)', text: 'rgba(255,228,160,0.62)' },
      text: { tag: 'rgba(240,182,42,0.80)', name: '#fffaef', stat: 'rgba(255,226,164,0.58)' },
      btn: { bg: 'rgba(240,182,42,0.13)', border: 'rgba(255,214,110,0.30)', text: 'rgba(255,232,180,0.80)' },
    },
  },

  trailhead: {
    label: 'Trailhead',
    preview: { from: '#1f8a5c', to: '#e8b23a' },
    accentFontStyle: 'normal',
    announce: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #0e5c3e 0%, #082e20 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #0a3a26 0%, transparent 60%),' +
        'linear-gradient(180deg, #051f14 0%, #03100b 55%, #010805 100%)',
      heroGradient:
        'radial-gradient(circle at 34% 27%, #fff8e8 0%, #f0dca0 12%, #d4ac54 30%, #b8862c 50%, #8a621a 70%, #4a340c 87%, #1e1504 100%)',
      ringColor: 'rgba(120,220,160,0.20)',
      glow: 'rgba(40,180,120,0.42)',
      heroRim: 'rgba(180,240,200,0.42)',
      vignette: VIGNETTE('rgba(1,6,4,0.58)'),
      accent: '#8be8b8',
      titleGradient: 'linear-gradient(135deg, #ffffff 0%, #d9fbe6 38%, #7ee0ac 100%)',
      particleColor: '#a0eec0',
      ticker: { bg: 'rgba(3,15,10,0.55)', border: 'rgba(120,220,160,0.16)', text: 'rgba(180,238,204,0.62)' },
      text: {
        tag: 'rgba(139,232,184,0.78)',
        title: '#eafff2',
        couple: 'rgba(180,238,204,0.52)',
        countdown: '#eafff2',
        countdownLabel: 'rgba(120,220,160,0.50)',
      },
      btn: { bg: 'rgba(40,180,120,0.12)', border: 'rgba(120,220,160,0.30)', text: 'rgba(198,246,220,0.75)' },
    },
    reveal: {
      pageBg:
        'radial-gradient(ellipse 130% 85% at 50% -5%, #b5811a 0%, #6b4c0a 32%, transparent 68%),' +
        'radial-gradient(ellipse 90% 60% at 12% 105%, #4a3305 0%, transparent 60%),' +
        'linear-gradient(180deg, #362403 0%, #150e01 55%, #090500 100%)',
      heroGradient:
        'radial-gradient(circle at 34% 27%, #fffaf0 0%, #f6dfa0 12%, #e8b854 30%, #d49a2c 50%, #8a641a 70%, #4a3708 87%, #1e1802 100%)',
      ringColor: 'rgba(246,212,148,0.20)',
      glow: 'rgba(212,154,44,0.46)',
      heroRim: 'rgba(253,236,203,0.45)',
      vignette: VIGNETTE('rgba(9,6,0,0.58)'),
      accent: '#e8b854',
      titleGradient: 'linear-gradient(135deg, #fffdf5 0%, #fbe9c0 38%, #e0b25a 100%)',
      burstColors: ['#e0b25a', '#8be8b8', '#f6dfa0', '#4fbf88', '#d49a2c', '#bdf0d4'],
      ticker: { bg: 'rgba(12,8,1,0.55)', border: 'rgba(246,212,148,0.18)', text: 'rgba(250,225,175,0.62)' },
      text: { tag: 'rgba(212,154,44,0.80)', name: '#fffaf0', stat: 'rgba(250,224,172,0.58)' },
      btn: { bg: 'rgba(212,154,44,0.13)', border: 'rgba(246,212,148,0.30)', text: 'rgba(252,232,190,0.80)' },
    },
  },
}

export const themeKeys = Object.keys(themes) as ThemeKey[]

/** Old theme keys, retired — mapped to the nearest new theme by mood/palette family. */
const LEGACY_ALIASES: Record<string, ThemeKey> = {
  stellar: 'liftoff',
  nebula: 'circuit',
  bloom: 'trailhead',
  dusk: 'premiere',
  ember: 'forge',
}

/**
 * Resolves any theme key coming from persisted data (Cosmos) to a currently
 * valid `ThemeKey` — handles pages still carrying a retired key so every
 * registry lookup (`themes[...]`, `heroShapes[...]`, `themeFonts[...]`)
 * downstream stays safe without a blocking data migration.
 */
export function resolveTheme(key: string | null | undefined): ThemeKey {
  if (key && themeKeys.includes(key as ThemeKey)) return key as ThemeKey
  if (key && key in LEGACY_ALIASES) return LEGACY_ALIASES[key]
  return 'liftoff'
}

export function ordinalTag(birthOrder: number): string {
  if (birthOrder <= 1) return 'Our first'
  const words: Record<number, string> = { 2: 'two', 3: 'three', 4: 'four' }
  return `Baby number ${words[birthOrder] ?? birthOrder}`
}
