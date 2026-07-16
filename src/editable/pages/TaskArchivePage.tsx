import Link from 'next/link'
import { ArrowUpRight, Bookmark, ChevronDown, Globe, Search } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { globalContent } from '@/editable/content/global.content'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const stripHtml = (v: string) =>
  v
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const getSummary = (post: SitePost) =>
  stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const c = getContent(post)
  for (const k of keys) {
    const v = asText(c[k])
    if (v) return v
  }
  return ''
}
const getDomain = (url: string) => {
  if (!url) return ''
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '')
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  }
}
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback

function pageHref(basePath: string, category: string, page: number) {
  const p = new URLSearchParams()
  if (category && category !== 'all') p.set('category', category)
  if (page > 1) p.set('page', String(page))
  const q = p.toString()
  return q ? `${basePath}?${q}` : basePath
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const C = globalContent.collections
  const categoryLabel = category === 'all' ? `All ${C.plural.toLowerCase()}` : CATEGORY_OPTIONS.find((i) => i.slug === category)?.name || category
  const showAd = task === 'sbm'
  const inFeedAdSize = showAd ? pickRandom(getSlotSizes('feature')) : ''

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {/* Premium shelf header */}
        <header className="relative overflow-hidden border-b border-[var(--tk-line)]">
          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
            style={{ background: 'radial-gradient(circle, var(--tk-accent) 0%, transparent 65%)' }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-6 py-24 sm:py-28 lg:px-10 lg:py-32">
            <EditableReveal index={0}>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">{theme.kicker}</p>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-8 max-w-4xl text-balance text-[2.75rem] font-medium leading-[1.02] tracking-[-0.035em] sm:text-[3.75rem] lg:text-[5rem]">
                {voice?.headline || `Browse ${C.plural}`}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="mt-8 max-w-2xl text-[17px] leading-[1.65] text-[var(--tk-muted)]">{voice?.description || theme.note}</p>
            </EditableReveal>
            <EditableReveal index={3}>
              <div className="mt-14 flex flex-col gap-6 border-t border-[var(--tk-line)] pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[var(--tk-muted)]">
                  <span className="editable-mono font-medium text-[var(--tk-text)]">
                    {String(posts.length).padStart(2, '0')}
                  </span>{' '}
                  {C.itemPlural.toLowerCase()} · {categoryLabel}
                </p>
                <form action={basePath} className="flex items-center gap-3">
                  <div className="relative">
                    <select
                      name="category"
                      defaultValue={category}
                      className="h-11 appearance-none rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] pl-5 pr-11 text-sm font-medium text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-accent)]"
                      aria-label={voice?.filterLabel || `Filter ${C.plural.toLowerCase()}`}
                    >
                      <option value="all">All {C.plural.toLowerCase()}</option>
                      {CATEGORY_OPTIONS.map((item) => (
                        <option key={item.slug} value={item.slug}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                  </div>
                  <button className="inline-flex h-11 items-center rounded-full bg-[var(--tk-accent)] px-6 text-sm font-medium text-[var(--tk-on-accent)] transition hover:opacity-90">
                    Apply
                  </button>
                </form>
              </div>
            </EditableReveal>
          </div>
        </header>

        <section className="mx-auto max-w-[var(--editable-container)] px-6 py-20 sm:py-24 lg:px-10">
          {posts.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post, i) => {
                const href = `${basePath}/${post.slug}`
                if (task === 'sbm') {
                  return (
                    <EditableReveal key={post.id || post.slug} index={i}>
                      <BookmarkShelfCard post={post} href={href} index={i} />
                    </EditableReveal>
                  )
                }
                return (
                  <EditableReveal key={post.id || post.slug} index={i}>
                    <BookmarkShelfCard post={post} href={href} index={i} />
                  </EditableReveal>
                )
              })}
              {/* Exactly one in-feed ad on SBM archive */}
              {showAd ? (
                <div className="md:col-span-2 xl:col-span-3">
                  <Ads slot="feature" size={inFeedAdSize} showLabel className="mx-auto w-full" />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-[var(--tk-radius)] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] px-8 py-20 text-center">
              <Search className="mx-auto h-8 w-8 text-[var(--tk-muted)]" />
              <h2 className="editable-display mt-6 text-2xl font-medium tracking-[-0.02em]">The shelf is empty here.</h2>
              <p className="mt-3 text-sm leading-[1.6] text-[var(--tk-muted)]">
                Try another {C.singular.toLowerCase()}, or come back — new {C.itemPlural.toLowerCase()} arrive weekly.
              </p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-20 flex items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? (
                <Link
                  href={pageHref(basePath, category, page - 1)}
                  className="rounded-full border border-[var(--tk-line)] px-5 py-2.5 font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-accent)]"
                >
                  Previous
                </Link>
              ) : null}
              <span className="editable-mono rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-5 py-2.5 text-xs font-medium text-[var(--tk-muted)]">
                {String(page).padStart(2, '0')} / {String(pagination.totalPages || 1).padStart(2, '0')}
              </span>
              {pagination.hasNextPage ? (
                <Link
                  href={pageHref(basePath, category, page + 1)}
                  className="rounded-full border border-[var(--tk-line)] px-5 py-2.5 font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-accent)]"
                >
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

/*
  BookmarkShelfCard — one shelf tile per curated resource.
  Domain chip · title · summary · category · arrow. Verified glyph if data hints at it.
*/
function BookmarkShelfCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  const domain = getDomain(website)
  const category = getCategory(post, globalContent.collections.singular)
  return (
    <Link
      href={href}
      className="group flex h-full flex-col justify-between rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--tk-accent)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
            <Bookmark className="h-5 w-5" />
          </span>
          <span className="editable-mono text-xs text-[var(--tk-muted)]">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-accent)]">{category}</p>
        <h2 className="editable-display mt-3 line-clamp-3 text-2xl font-medium leading-tight tracking-[-0.025em]">{post.title}</h2>
        <p className="mt-4 line-clamp-3 text-[15px] leading-[1.6] text-[var(--tk-muted)]">{getSummary(post)}</p>
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-[var(--tk-line)] pt-5">
        <span className="editable-mono flex items-center gap-1.5 text-xs text-[var(--tk-muted)]">
          <Globe className="h-3 w-3" /> {domain || 'in library'}
        </span>
        <ArrowUpRight className="h-4 w-4 text-[var(--tk-accent)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}
