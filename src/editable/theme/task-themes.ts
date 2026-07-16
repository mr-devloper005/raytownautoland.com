import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Slot 5 — every task shares the Klyro dark editorial system.
  sbm (Collections) and profile (hidden) are the two live surfaces;
  the rest inherit the same tokens so any future re-enable is visually cohesive.
  Tokens flow through --tk-* CSS vars.
*/
export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const GEIST = "'Geist', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: true,
  fontDisplay: GEIST,
  fontBody: GEIST,
  bg: '#2C3947',
  surface: '#253240',
  raised: '#3D4C5B',
  text: '#E8EDF2',
  muted: '#547A95',
  line: '#3D4C5B',
  accent: '#C2A56D',
  accentSoft: 'rgba(194,165,109,0.14)',
  onAccent: '#2C3947',
  glow: 'rgba(194,165,109,0.18)',
  radius: '20px',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  sbm: { ...base, kicker: 'Collections', note: 'Hand-picked resources, tools and references — organised into browsable collections.' },
  profile: { ...base, kicker: 'Curator', note: 'A single curator space with their contributed collections and resources.' },
  article: { ...base, kicker: 'Reading', note: 'Long-form notes and writeups from the collection.' },
  listing: { ...base, kicker: 'Directory', note: 'Organised entries with practical detail.' },
  classified: { ...base, kicker: 'Notices', note: 'Time-sensitive posts.' },
  image: { ...base, kicker: 'Gallery', note: 'Visual pieces from the archive.' },
  pdf: { ...base, kicker: 'Documents', note: 'Downloadable references.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.sbm
}

/** All `--tk-*` tokens for a task surface. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
