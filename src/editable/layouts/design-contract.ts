import type { CSSProperties } from 'react'

/*
  Slot 5 design contract — Klyro-inspired premium editorial.
  Dark canvas with lime accent, cream light band, Geist typography,
  1440px container, 120px section rhythm, generous negative letter-spacing.
  Every visible surface reads these variables, never hard-coded values.
*/
export const editableRootStyle = {
  // Palette:
  //   #2C3947  navy canvas       #E8EDF2  light surface / on-dark text
  //   #547A95  slate secondary   #C2A56D  gold accent
  '--slot4-page-bg': '#2C3947',
  '--slot4-page-text': '#E8EDF2',
  '--slot4-panel-bg': '#253240',
  '--slot4-surface-bg': '#34424F',
  '--slot4-raised-bg': '#3D4C5B',
  '--slot4-muted-text': '#547A95',
  '--slot4-soft-muted-text': '#7C97AE',
  '--slot4-accent': '#C2A56D',
  '--slot4-accent-fill': '#C2A56D',
  '--slot4-accent-soft': 'rgba(194,165,109,0.14)',
  '--slot4-on-accent': '#2C3947',
  '--slot4-dark-bg': '#2C3947',
  '--slot4-dark-text': '#E8EDF2',
  '--slot4-cream-bg': '#E8EDF2',
  '--slot4-cream-text': '#2C3947',
  '--slot4-media-bg': '#3D4C5B',
  '--slot4-body-gradient': 'none',

  '--editable-page-bg': '#2C3947',
  '--editable-page-text': '#E8EDF2',
  '--editable-container': '1440px',
  '--editable-border': '#3D4C5B',
  '--editable-border-soft': 'rgba(232,237,242,0.10)',
  '--editable-nav-bg': 'rgba(44,57,71,0.86)',
  '--editable-nav-text': '#E8EDF2',
  '--editable-nav-active': '#C2A56D',
  '--editable-nav-active-text': '#2C3947',
  '--editable-cta-bg': '#C2A56D',
  '--editable-cta-text': '#2C3947',
  '--editable-search-bg': '#34424F',
  '--editable-footer-bg': '#2C3947',
  '--editable-footer-text': '#E8EDF2',

  '--editable-radius-sm': '6px',
  '--editable-radius-md': '12px',
  '--editable-radius-lg': '20px',
  '--editable-radius-xl': '28px',
  '--editable-radius-pill': '9999px',

  '--editable-section-y': 'clamp(72px, 10vw, 120px)',
  '--editable-hero-y': 'clamp(120px, 14vw, 195px)',

  '--ease-premium': 'cubic-bezier(0.22, 1, 0.36, 1)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  raisedBg: 'bg-[var(--slot4-raised-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  creamBg: 'bg-[var(--slot4-cream-bg)]',
  creamText: 'text-[var(--slot4-cream-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  warmBg: 'bg-[var(--slot4-panel-bg)]',
  lavenderBg: 'bg-[var(--slot4-panel-bg)]',
  grayBg: 'bg-[var(--slot4-surface-bg)]',
  border: 'border-[var(--editable-border)]',
  softBorder: 'border-[var(--editable-border-soft)]',
  darkBorder: 'border-[var(--editable-border)]',
  shadow: 'shadow-[0_2px_10px_rgba(0,0,0,0.35)]',
  shadowStrong: 'shadow-[0_30px_70px_rgba(0,0,0,0.55)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(12,12,12,0.05),rgba(12,12,12,0.85))]',
} as const

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-6 sm:px-8 lg:px-10'

export const editableDesignContract = {
  container,
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: container,
    sectionY: 'py-[var(--editable-section-y)]',
    sectionYSm: 'py-16 sm:py-20 lg:py-24',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    eyebrow: 'text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]',
    heroTitle: 'editable-display text-balance text-[3rem] leading-[1.02] tracking-[-0.045em] sm:text-[4rem] lg:text-[5.5rem] xl:text-[6.25rem]',
    sectionTitle: 'editable-display text-balance text-[2.25rem] leading-[1.05] tracking-[-0.035em] sm:text-[3rem] lg:text-[3.75rem]',
    subTitle: 'editable-display text-2xl leading-tight tracking-[-0.025em] sm:text-[1.75rem]',
    body: 'text-base leading-[1.65] text-[var(--slot4-muted-text)] sm:text-[17px]',
    label: 'text-xs font-medium uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]',
  },
  surface: {
    card: `rounded-[var(--editable-radius-lg)] border ${editablePalette.border} ${editablePalette.panelBg}`,
    soft: `rounded-[var(--editable-radius-lg)] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `rounded-[var(--editable-radius-lg)] ${editablePalette.darkBg} ${editablePalette.darkText}`,
    cream: `rounded-[var(--editable-radius-lg)] ${editablePalette.creamBg} ${editablePalette.creamText}`,
  },
  button: {
    primary:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-medium tracking-[-0.005em] text-[var(--slot4-on-accent)] transition-all duration-300 hover:scale-[1.02] hover:brightness-[1.05] active:scale-[0.98]',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] bg-transparent px-6 py-3 text-sm font-medium tracking-[-0.005em] text-[var(--slot4-page-text)] transition-all duration-300 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] active:scale-[0.98]',
    ghost:
      'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-[var(--slot4-page-text)] transition-colors duration-300 hover:text-[var(--slot4-accent)]',
    onCream:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-6 py-3 text-sm font-medium text-[var(--slot4-dark-text)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]',
  },
  media: {
    frame: `relative overflow-hidden rounded-[var(--editable-radius-md)] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
    ratioSquare: 'aspect-square',
    ratioWide: 'aspect-[16/9]',
  },
  motion: {
    lift: 'transition-all duration-500 hover:-translate-y-1',
    fade: 'transition-opacity duration-300 hover:opacity-85',
    imgHover: 'transition-transform duration-[700ms] group-hover:scale-[1.04]',
  },
} as const

export const aiLayoutRules = [
  'Read all colors, radii, fonts, and section rhythm from the CSS variables in editableRootStyle. Never hardcode #hex values in JSX.',
  'Wrap every homepage section in <EditableReveal> with a stagger index so the page reveals as the viewer scrolls.',
  'Public discovery is centred on curated Collections / Resources — never write generic SaaS copy.',
  'The profile task must never appear in navbar, footer, home, search filter, or create picker. Enforce via isUiHiddenTask().',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() so task-specific routes keep working.',
] as const
