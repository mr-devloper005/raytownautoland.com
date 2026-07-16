'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Bookmark, CheckCircle2, FileText, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { globalContent, isUiHiddenTask } from '@/editable/content/global.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  sbm: Bookmark,
  article: FileText,
  listing: FileText,
  classified: FileText,
  image: FileText,
  pdf: FileText,
  profile: FileText,
}

const fieldClass =
  'w-full rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-accent)]'
const areaClass =
  'w-full rounded-[var(--editable-radius-md)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-4 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-accent)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const C = globalContent.collections
  // Hide profile (and any other hidden task) from the create picker.
  const enabledTasks = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled && !isUiHiddenTask(task.key)),
    [],
  )
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'sbm') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
          <section className={`${dc.container} grid min-h-[calc(100vh-12rem)] items-center gap-14 py-20 lg:grid-cols-[0.9fr_1.1fr]`}>
            <div className="flex h-full min-h-72 items-center justify-center rounded-[var(--editable-radius-lg)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-accent)]">
              <Lock className="h-16 w-16" />
            </div>
            <div>
              <p className={dc.type.eyebrow}>{pagesContent.create.locked.badge}</p>
              <h1 className={`mt-8 max-w-xl ${dc.type.sectionTitle}`}>{pagesContent.create.locked.title}</h1>
              <p className={`mt-6 max-w-lg ${dc.type.body}`}>{pagesContent.create.locked.description}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/login" className={dc.button.primary}>
                  Login <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/signup" className={dc.button.secondary}>
                  Sign up
                </Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.container} py-20 sm:py-24`}>
          <EditableReveal index={0}>
            <p className={dc.type.eyebrow}>{pagesContent.create.hero.badge}</p>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className={`mt-8 max-w-3xl ${dc.type.heroTitle}`}>Add a {C.itemSingular.toLowerCase()} to the library.</h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className={`mt-8 max-w-2xl ${dc.type.body}`}>{pagesContent.create.hero.description}</p>
          </EditableReveal>

          <div className="mt-16 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <aside>
              <p className={dc.type.eyebrow}>Choose type</p>
              <div className="mt-6 grid gap-3">
                {enabledTasks.map((item) => {
                  const Icon = taskIcon[item.key] || FileText
                  const active = item.key === task
                  const label = item.key === 'sbm' ? C.itemSingular : item.label
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTask(item.key)}
                      className={`flex items-start gap-4 rounded-[var(--editable-radius-lg)] border p-5 text-left transition-all duration-300 ${
                        active
                          ? 'border-[var(--slot4-accent)] bg-[var(--slot4-accent-soft)]'
                          : 'border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] hover:border-[var(--slot4-accent)]'
                      }`}
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${active ? 'bg-[var(--slot4-accent)] text-[var(--slot4-on-accent)]' : 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]'}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <span className="editable-display block text-lg font-medium tracking-[-0.02em]">{label}</span>
                        <span className="mt-1 block text-sm text-[var(--slot4-muted-text)]">{item.description}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </aside>

            <form onSubmit={submit} className={`${dc.surface.soft} p-6 sm:p-8`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className={dc.type.eyebrow}>Create {activeTask?.key === 'sbm' ? C.itemSingular : activeTask?.label || 'post'}</p>
                  <h2 className="editable-display mt-3 text-2xl font-medium tracking-[-0.025em]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="rounded-full border border-[var(--editable-border)] px-4 py-2 text-xs font-medium text-[var(--slot4-muted-text)]">
                  {session.name}
                </span>
              </div>

              <div className="mt-8 grid gap-4">
                <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`${C.itemSingular} title`} required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(e) => setCategory(e.target.value)} placeholder={C.singular} />
                  <input className={fieldClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Resource URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(e) => setImage(e.target.value)} placeholder="Preview image URL (optional)" />
                <textarea className={`${areaClass} min-h-24`} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="One-line summary" required />
                <textarea className={`${areaClass} min-h-48`} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Why did you save this? Add notes, context, links." required />
              </div>

              {created ? (
                <div className="mt-5 flex items-start gap-3 rounded-[var(--editable-radius-md)] border border-[var(--slot4-accent)]/40 bg-[var(--slot4-accent-soft)] p-4 text-[var(--slot4-accent)]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{pagesContent.create.successTitle}</p>
                    <p className="mt-1 text-sm opacity-80">{created.title}</p>
                  </div>
                </div>
              ) : null}

              <button type="submit" className={`mt-8 w-full justify-center ${dc.button.primary}`}>
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
