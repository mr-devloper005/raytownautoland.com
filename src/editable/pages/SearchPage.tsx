import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Bookmark, Globe, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { toPlainText } from '@/editable/cards/PostCards'
import { pagesContent } from '@/editable/content/pages.content'
import { globalContent, isUiHiddenTask } from '@/editable/content/global.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (v: string) => v.replace(/<[^>]*>/g, ' ')
const compactText = (v: unknown) => (typeof v === 'string' ? stripHtml(v).replace(/\s+/g, ' ').trim().toLowerCase() : '')
const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const compactRaw = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

const summaryOf = (post: SitePost) => {
  const c = getContent(post)
  return toPlainText(
    (typeof post.summary === 'string' && post.summary) ||
      compactRaw(c.description) ||
      compactRaw(c.excerpt) ||
      compactRaw(c.body) ||
      '',
  )
}
const getDomain = (post: SitePost) => {
  const c = getContent(post)
  const url = compactRaw(c.website) || compactRaw(c.url) || compactRaw(c.link) || ''
  if (!url) return ''
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '')
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  }
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const c = getContent(post)
  const typeText = compactText(c.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  // Never surface hidden-task results.
  if (derivedTask && isUiHiddenTask(derivedTask)) return false
  if (task && derivedTask !== task) return false
  const categoryText = compactText(c.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, c.description, c.body, c.excerpt, c.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post }: { post: SitePost }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'sbm'}`}/${post.slug}`
  const summary = summaryOf(post)
  const domain = getDomain(post)
  const taskLabel = task === 'sbm' ? globalContent.collections.singular : SITE_CONFIG.tasks.find((i) => i.key === task)?.label || 'Post'

  return (
    <Link
      href={href}
      className="group flex h-full flex-col justify-between rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--slot4-accent)]"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
            <Bookmark className="h-4 w-4" />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-accent)]">{taskLabel}</span>
        </div>
        <h2 className="editable-display mt-6 line-clamp-3 text-2xl font-medium leading-tight tracking-[-0.025em]">{post.title}</h2>
        {summary ? <p className="mt-3 line-clamp-3 text-[15px] leading-[1.6] text-[var(--slot4-muted-text)]">{summary}</p> : null}
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--editable-border)] pt-5">
        <span className="editable-mono flex items-center gap-1.5 text-xs text-[var(--slot4-muted-text)]">
          <Globe className="h-3 w-3" /> {domain || 'in library'}
        </span>
        <ArrowUpRight className="h-4 w-4 text-[var(--slot4-accent)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const rawTask = (resolved.task || '').trim().toLowerCase()
  // Ignore any attempt to filter by a hidden task from the URL.
  const task = rawTask && !isUiHiddenTask(rawTask) ? rawTask : ''
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined,
  )
  const seed = feed?.posts?.length
    ? feed.posts
    : useMaster
      ? []
      : SITE_CONFIG.tasks.filter((i) => i.enabled && !isUiHiddenTask(i.key)).flatMap((i) => getMockPostsForTask(i.key))
  const results = seed.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  // Hide any hidden-task option from the task picker.
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled && !isUiHiddenTask(item.key))
  const footerAdSize = pickRandom(getSlotSizes('footer') || getSlotSizes('anchor') || ['728x90'])

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.container} py-20 sm:py-24 lg:py-28`}>
          <EditableReveal index={0}>
            <p className={dc.type.eyebrow}>{pagesContent.search.hero.badge}</p>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className={`mt-6 max-w-3xl ${dc.type.heroTitle}`}>{pagesContent.search.hero.title}</h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className={`mt-8 max-w-2xl ${dc.type.body}`}>{pagesContent.search.hero.description}</p>
          </EditableReveal>

          <EditableReveal index={3}>
            <form action="/search" className="mt-12 rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-4 sm:p-5">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-5 py-3">
                <Search className="h-5 w-5 text-[var(--slot4-accent)]" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder={pagesContent.search.hero.placeholder}
                  className="min-w-0 flex-1 bg-transparent text-base font-medium text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]"
                />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  name="category"
                  defaultValue={category}
                  placeholder={`Filter by ${globalContent.collections.singular.toLowerCase()}`}
                  className="rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-5 py-3 text-sm font-medium text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]"
                />
                <select
                  name="task"
                  defaultValue={task}
                  className="rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-5 py-3 text-sm font-medium text-[var(--slot4-page-text)] outline-none"
                >
                  <option value="">All content</option>
                  {enabledTasks.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.key === 'sbm' ? globalContent.collections.plural : item.label}
                    </option>
                  ))}
                </select>
                <button type="submit" className={dc.button.primary}>
                  Search <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </EditableReveal>

          <EditableReveal index={4}>
            <div className="mt-14 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="editable-mono text-xs text-[var(--slot4-muted-text)]">{String(results.length).padStart(2, '0')} results</p>
                <h2 className="editable-display mt-3 text-3xl font-medium tracking-[-0.03em]">
                  {query ? <>Results for &ldquo;{query}&rdquo;</> : pagesContent.search.resultsTitle}
                </h2>
              </div>
            </div>
          </EditableReveal>

          {results.length ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, i) => (
                <EditableReveal key={post.id || post.slug} index={i}>
                  <SearchResultCard post={post} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[var(--editable-radius-lg)] border border-dashed border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-14 text-center">
              <p className="editable-display text-2xl font-medium tracking-[-0.02em]">No matches yet.</p>
              <p className="mt-3 text-sm leading-[1.6] text-[var(--slot4-muted-text)]">Try a different keyword or {globalContent.collections.singular.toLowerCase()}.</p>
            </div>
          )}

          {/* Exactly one ad, in the footer of Search */}
          <div className="mt-16">
            <Ads slot="footer" size={footerAdSize} showLabel className="mx-auto w-full" />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
