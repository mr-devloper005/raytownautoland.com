import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowUpRight,
  AtSign,
  Bookmark,
  Globe,
  Hash,
  Home,
  Mail,
  Quote,
  ShieldCheck,
  Slash,
  Sparkles,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { globalContent } from '@/editable/content/global.content'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = task === 'profile' ? [] : (await fetchTaskPosts(task, 8)).filter((item) => item.slug !== post.slug).slice(0, 6)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

/* -------------------------- data helpers -------------------------- */
const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const isUrl = (v: string) => v.startsWith('/') || /^https?:\/\//i.test(v)
const getField = (post: SitePost, keys: string[]) => {
  const c = getContent(post)
  for (const k of keys) {
    const v = asText(c[k])
    if (v) return v
  }
  return ''
}
const getImages = (post: SitePost) => {
  const c = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((m) => m?.url).filter((u): u is string => typeof u === 'string' && isUrl(u)) : []
  const images = Array.isArray(c.images) ? (c.images.filter((u): u is string => typeof u === 'string' && isUrl(u)) as string[]) : []
  const single = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar', 'cover'].map((k) => asText(c[k])).filter((u) => u && isUrl(u))
  return [...media, ...images, ...single].filter(Boolean).slice(0, 12)
}
const getBody = (post: SitePost) => {
  const c = getContent(post)
  return asText(c.body) || asText(c.description) || asText(c.details) || post.summary || ''
}
const escapeHtml = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const safeUrl = (v: string) => (/^https?:\/\//i.test(v) ? v : '#')
const linkifyMd = (v: string) =>
  v.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_m, l, u) => `<a href="${safeUrl(u)}" target="_blank" rel="nofollow noopener noreferrer">${l}</a>`)
const linkifyText = (v: string) =>
  linkifyMd(v).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_m, p, u) => `${p}<a href="${safeUrl(u)}" target="_blank" rel="nofollow noopener noreferrer">${u}</a>`)
const hardenLinks = (h: string) =>
  h.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_m, attrs) => {
    let n = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(n)) n += ' target="_blank"'
    if (!/\srel=/i.test(n)) n += ' rel="nofollow noopener noreferrer"'
    return `<a ${n}>`
  })
const sanitizeHtml = (h: string) =>
  hardenLinks(
    h
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'),
  )
const formatBody = (raw: string) => {
  const v = raw.trim()
  if (!v) return ''
  if (/<[a-z][\s\S]*>/i.test(v)) return sanitizeHtml(linkifyMd(v))
  return v
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}
const stripHtml = (v: string) => v.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getDomain = (url: string) => {
  if (!url) return ''
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '')
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  }
}
const summaryOf = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const readMinutesOf = (post: SitePost) => {
  const body = stripHtml(getBody(post))
  const words = body ? body.split(/\s+/).length : 0
  return Math.max(1, Math.round(words / 220)) || 2
}

const C = globalContent.collections

export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'profile' ? (
          <ProfileDetail post={post} />
        ) : (
          <BookmarkDetail post={post} related={related} article={task === 'article'} comments={comments} />
        )}
      </main>
    </EditableSiteShell>
  )
}

/* ================================================================ */
/*                    SBM / RESOURCE DETAIL — v2                    */
/*  Editorial magazine layout. No hero image, no date.              */
/*                                                                  */
/*  1. Breadcrumb ribbon (Home › Collections › {category})          */
/*  2. Split hero: giant title (L) + browser-preview card (R)       */
/*     with Domain chip + oversized "Visit resource" CTA            */
/*  3. Full-width spec bar: Collection · Domain · Verified · Read   */
/*  4. Curator pull-quote highlight band                            */
/*  5. Reading column body + tag chips                              */
/*  6. Inline ad break (sidebar slot inline for reading rhythm)     */
/*  7. Horizontal rail: "In this collection"                        */
/*  8. Closing "return to the shelf" cinematic band                 */
/* ================================================================ */
function BookmarkDetail({
  post,
  related,
  article,
  comments = [],
}: {
  post: SitePost
  related: SitePost[]
  article?: boolean
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const theme = getTaskTheme('sbm')
  const website = getField(post, ['website', 'url', 'link'])
  const domain = getDomain(website)
  const collection = categoryOf(post, C.singular)
const bodyRaw = getBody(post)
  const body = formatBody(bodyRaw)
  const verified = Boolean(getField(post, ['verified', 'featured']) || website)
  const summary = stripHtml(summaryOf(post))
  const readMins = readMinutesOf(post)
  const collectionsHref = getTaskConfig('sbm')?.route || '/sbm'
  const categorySlug = collection.toLowerCase().replace(/\s+/g, '-')
  const adSize = pickRandom(getSlotSizes('sidebar'))

  return (
    <>
      {/* 1 — BREADCRUMB RIBBON */}
      <div className="border-b border-[var(--tk-line)]">
        <nav className="mx-auto flex max-w-[var(--editable-container)] items-center gap-2 px-6 py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)] lg:px-10">
          <Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--tk-text)]">
            <Home className="h-3 w-3" /> Home
          </Link>
          <Slash className="h-3 w-3 opacity-40" />
          <Link href={collectionsHref} className="transition-colors hover:text-[var(--tk-text)]">
            {C.plural}
          </Link>
          <Slash className="h-3 w-3 opacity-40" />
          <Link href={`${collectionsHref}?category=${categorySlug}`} className="text-[var(--tk-accent)]">
            {collection}
          </Link>
        </nav>
      </div>

      {/* 2 — SPLIT HERO */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-32 right-0 h-[520px] w-[720px] rounded-full opacity-25 blur-[130px]"
          style={{ background: 'radial-gradient(circle, var(--tk-accent) 0%, transparent 65%)' }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[var(--editable-container)] px-6 pb-24 pt-20 sm:pt-24 lg:px-10 lg:pb-28 lg:pt-28">
          <div className="min-w-0">
            <EditableReveal index={0}>
              <div className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">
                <Bookmark className="h-3.5 w-3.5" />
                {theme.kicker}
                <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)] opacity-50" />
                <span className="editable-mono text-[var(--tk-muted)]">
                  {String(readMins).padStart(2, '0')} min read
                </span>
              </div>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-10 max-w-4xl text-balance text-[2.75rem] font-medium leading-[0.98] tracking-[-0.038em] sm:text-[4rem] lg:text-[5.5rem]">
                {post.title}
              </h1>
            </EditableReveal>
          </div>

        </div>
      </section>

      {/* 3 — SPEC BAR */}
      <section className="border-y border-[var(--tk-line)] bg-[var(--tk-surface)]">
        <div className="mx-auto grid max-w-[var(--editable-container)] gap-y-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-14 lg:px-10 lg:py-12">
          <SpecCell label={C.singular} value={collection} accent />
          <SpecCell label="Domain" value={domain || '—'} mono />
          <SpecCell label="Status" value={verified ? 'Verified' : 'Pending'} accent={verified} />
          <SpecCell label="Reading" value={`${readMins} min`} mono />
        </div>
      </section>

      {/* 4 — PULL QUOTE (curator's take) — only when distinct from body */}
      {summary && stripHtml(bodyRaw).replace(/\s+/g, ' ').trim() !== summary.replace(/\s+/g, ' ').trim() ? (
        <section className="mx-auto max-w-[var(--editable-container)] px-6 pb-4 pt-24 lg:px-10 lg:pt-28">
          <EditableReveal index={0}>
            <blockquote className="mx-auto max-w-4xl border-l-4 border-[var(--tk-accent)] pl-8">
              <Quote className="h-8 w-8 text-[var(--tk-accent)]" />
              <p className="editable-display mt-6 text-balance text-3xl font-medium leading-[1.15] tracking-[-0.025em] text-[var(--tk-text)] sm:text-4xl lg:text-[2.75rem]">
                {summary.length > 260 ? `${summary.slice(0, 260).trim()}…` : summary}
              </p>
              <footer className="mt-6 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                <span className="h-px w-8 bg-[var(--tk-accent)]" />
                {C.memberSingular}&rsquo;s take
              </footer>
            </blockquote>
          </EditableReveal>
        </section>
      ) : null}

      {/* 5 — READING COLUMN + TAGS */}
      <section className="mx-auto max-w-[var(--editable-container)] px-6 pb-24 pt-20 lg:px-10 lg:pb-28">
        <article className="mx-auto max-w-3xl">
          <EditableReveal index={0}>
            <div className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-accent)]">
              <Sparkles className="h-3.5 w-3.5" />
              Curator notes
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <h2 className="editable-display mt-6 text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
              Why this made the {C.singular.toLowerCase()}
            </h2>
          </EditableReveal>
          {body ? (
            <EditableReveal index={2}>
              <div
                className="article-content mt-10 max-w-none text-[17px] leading-[1.85] text-[var(--tk-text)]"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            </EditableReveal>
          ) : (
            <EditableReveal index={2}>
              <p className="mt-10 text-[17px] leading-[1.85] text-[var(--tk-muted)]">
                A {C.memberSingular.toLowerCase()} hasn&rsquo;t added notes yet — but the resource is worth opening on its own.
              </p>
            </EditableReveal>
          )}

          {article ? <EditableArticleComments slug={post.slug} comments={comments} /> : null}
        </article>
      </section>

      {/* 6 — INLINE AD BREAK (single sidebar-sized ad, inline for reading rhythm) */}
      <section className="border-t border-[var(--tk-line)] bg-[var(--tk-surface)]">
        <div className="mx-auto flex max-w-[var(--editable-container)] justify-center px-6 py-14 lg:px-10">
          <Ads slot="sidebar" size={adSize} showLabel className="mx-auto" />
        </div>
      </section>

      {/* 7 — IN THIS COLLECTION — horizontal rail */}
      {related.length ? (
        <section className="border-t border-[var(--tk-line)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-6 pb-16 pt-20 lg:px-10 lg:pt-24">
            <EditableReveal index={0}>
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">More in {collection}</p>
                  <h2 className="editable-display mt-4 text-3xl font-medium tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                    Keep reading the {C.singular.toLowerCase()}.
                  </h2>
                </div>
                <Link
                  href={`${collectionsHref}?category=${categorySlug}`}
                  className="hidden items-center gap-1.5 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-sm font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)] sm:inline-flex"
                >
                  All of {collection} <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </EditableReveal>
          </div>
          <div className="pb-24">
            <div className="mx-auto max-w-[var(--editable-container)] px-6 lg:px-10">
              <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {related.map((item, i) => (
                  <EditableReveal key={item.id || item.slug} index={i}>
                    <RailTile post={item} index={i} />
                  </EditableReveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 8 — CLOSING BAND */}
      <section className="border-t border-[var(--tk-line)]">
        <div className="mx-auto max-w-[var(--editable-container)] px-6 py-20 lg:px-10 lg:py-24">
          <EditableReveal index={0}>
            <div className="relative overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-10 sm:p-14 lg:p-16">
              <div
                className="pointer-events-none absolute -bottom-40 -left-20 h-[420px] w-[520px] rounded-full opacity-30 blur-[110px]"
                style={{ background: 'radial-gradient(circle, var(--tk-accent) 0%, transparent 65%)' }}
                aria-hidden="true"
              />
              <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">Return to the shelf</p>
                  <h3 className="editable-display mt-4 max-w-2xl text-3xl font-medium tracking-[-0.03em] sm:text-4xl lg:text-[2.75rem]">
                    Browse every {C.singular.toLowerCase()} in the library.
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={collectionsHref}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition hover:scale-[1.02]"
                  >
                    All {C.plural.toLowerCase()} <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-6 py-3 text-sm font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]"
                  >
                    Search resources
                  </Link>
                </div>
              </div>
            </div>
          </EditableReveal>
        </div>
      </section>
    </>
  )
}

function SpecCell({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">{label}</div>
      <div
        className={`mt-3 text-xl font-medium tracking-[-0.02em] ${accent ? 'text-[var(--tk-accent)]' : 'text-[var(--tk-text)]'} ${mono ? 'editable-mono' : 'editable-display'}`}
      >
        {value}
      </div>
    </div>
  )
}

function RailTile({ post, index }: { post: SitePost; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  const domain = getDomain(website)
  const href = `${getTaskConfig('sbm')?.route || '/sbm'}/${post.slug}`
  return (
    <Link
      href={href}
      className="group flex w-[320px] shrink-0 snap-start flex-col justify-between rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--tk-accent)] sm:w-[360px]"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
            <Bookmark className="h-4 w-4" />
          </span>
          <span className="editable-mono text-xs text-[var(--tk-muted)]">/ {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h3 className="editable-display mt-6 line-clamp-3 text-xl font-medium leading-snug tracking-[-0.02em]">{post.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-[1.55] text-[var(--tk-muted)]">{stripHtml(summaryOf(post))}</p>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--tk-line)] pt-5">
        <span className="editable-mono flex items-center gap-1.5 text-xs text-[var(--tk-muted)]">
          <Globe className="h-3 w-3" /> {domain || 'in library'}
        </span>
        <ArrowUpRight className="h-4 w-4 text-[var(--tk-accent)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

/* ================================================================ */
/*                    PROFILE DETAIL — v2                           */
/*  Hidden from UI; direct-URL only.                                */
/*  No date, no back-to-archive, no related-profiles strip.         */
/*                                                                  */
/*  1. Cover-less identity slab: giant name (L) + portrait tile (R) */
/*  2. Three-column numbered spec sheet (Name/Role/Based/Since)     */
/*  3. Bio band on darker panel with manifesto pull-quote           */
/*  4. Elsewhere: link rows with domain glyphs                      */
/*  5. Contributions card: search their content                     */
/*  6. Contact card row (bottom)                                    */
/* ================================================================ */
function ProfileDetail({ post }: { post: SitePost }) {
  const images = getImages(post)
  const avatar = images.find((u) => u && !u.includes('placeholder')) || ''
  const role = getField(post, ['role', 'designation', 'title', 'company'])
  const bio = getBody(post) || summaryOf(post)
  const website = getField(post, ['website', 'url', 'link'])
  const twitter = getField(post, ['twitter', 'x'])
  const github = getField(post, ['github'])
  const email = getField(post, ['email'])
  const location = getField(post, ['location', 'city', 'address'])
  const since = getField(post, ['since', 'joined', 'founded']) || String(new Date().getFullYear())
  const domain = getDomain(website)
  const initials = (post.title || '?')
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const tags = Array.isArray(post.tags) ? post.tags.slice(0, 8) : []
  const firstName = (post.title || 'they').split(/\s+/)[0]

  const specs = [
    { label: 'Name', value: post.title || '—', mono: false },
    { label: 'Role', value: role || `${C.memberSingular}`, mono: false },
    { label: 'Based', value: location || 'The library', mono: false },
    { label: 'Since', value: since, mono: true },
  ]

  const links: Array<{ icon: typeof Globe; label: string; href: string; text: string }> = []
  if (website) links.push({ icon: Globe, label: 'Home', href: website, text: domain || website })
  if (twitter) {
    const handle = twitter.replace(/^@/, '')
    links.push({ icon: AtSign, label: 'On X', href: twitter.startsWith('http') ? twitter : `https://x.com/${handle}`, text: `@${handle}` })
  }
  if (github) {
    const handle = github.replace(/^@/, '')
    links.push({ icon: Hash, label: 'On GitHub', href: github.startsWith('http') ? github : `https://github.com/${handle}`, text: `github.com/${handle}` })
  }

  return (
    <>
      {/* 1 — IDENTITY SLAB */}
      <section className="border-b border-[var(--tk-line)]">
        <div className="mx-auto grid max-w-[var(--editable-container)] gap-16 px-6 pb-20 pt-20 lg:grid-cols-[1.55fr_0.45fr] lg:gap-20 lg:px-10 lg:pb-28 lg:pt-28">
          <div className="min-w-0">
            <EditableReveal index={0}>
              <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--tk-accent)]">
                <span className="editable-mono">/{C.memberSingular.toLowerCase()}</span>
                <span className="h-px flex-1 bg-[var(--tk-line)]" />
                <span className="editable-mono text-[var(--tk-muted)]">on {SITE_CONFIG.name}</span>
              </div>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-14 text-balance text-[3rem] font-medium leading-[0.96] tracking-[-0.04em] sm:text-[4.5rem] lg:text-[6.5rem]">
                {post.title}
              </h1>
            </EditableReveal>
            {role ? (
              <EditableReveal index={2}>
                <p className="mt-8 text-xl text-[var(--tk-text)]/85 sm:text-2xl">
                  {role}
                  {location ? <span className="text-[var(--tk-muted)]"> · {location}</span> : null}
                </p>
              </EditableReveal>
            ) : null}
            {tags.length ? (
              <EditableReveal index={3}>
                <div className="mt-10 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] px-3 py-1.5 text-xs font-medium text-[var(--tk-text)]"
                    >
                      <Hash className="h-3 w-3 opacity-60" /> {tag}
                    </span>
                  ))}
                </div>
              </EditableReveal>
            ) : null}
          </div>

          {/* Portrait tile */}
          <EditableReveal index={4}>
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="aspect-square overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-raised)] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                {avatar ? (
                  <img src={avatar} alt={post.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[var(--tk-surface)]">
                    <span className="editable-display text-[6rem] font-medium tracking-[-0.04em] text-[var(--tk-accent)] sm:text-[7rem]">
                      {initials}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Verified
                </span>
                <span className="editable-mono">est. {since}</span>
              </div>
            </div>
          </EditableReveal>
        </div>
      </section>

      {/* 2 — SPEC SHEET */}
      <section className="border-b border-[var(--tk-line)] bg-[var(--tk-surface)]">
        <div className="mx-auto grid max-w-[var(--editable-container)] gap-y-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-14 lg:px-10 lg:py-16">
          {specs.map((s, i) => (
            <div key={s.label} className="border-l border-[var(--tk-accent)] pl-5">
              <div className="editable-mono flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                <span className="text-[var(--tk-accent)]">{String(i + 1).padStart(2, '0')}</span>
                {s.label}
              </div>
              <div className={`mt-4 text-xl font-medium tracking-[-0.02em] text-[var(--tk-text)] ${s.mono ? 'editable-mono' : 'editable-display'}`}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 — BIO BAND — single reading column, no duplicated pull-quote */}
      {bio ? (
        <section className="border-b border-[var(--tk-line)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-6 py-24 lg:px-10 lg:py-28">
            <EditableReveal index={0}>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">About {firstName}</p>
            </EditableReveal>
            <EditableReveal index={1}>
              <div
                className="article-content mt-10 max-w-3xl text-[19px] leading-[1.85] text-[var(--tk-text)]"
                dangerouslySetInnerHTML={{ __html: formatBody(bio) }}
              />
            </EditableReveal>
          </div>
        </section>
      ) : null}

      {/* 4 — ELSEWHERE */}
      {links.length ? (
        <section className="border-b border-[var(--tk-line)] bg-[var(--tk-surface)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-6 py-20 lg:px-10 lg:py-24">
            <EditableReveal index={0}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">Elsewhere</p>
                  <h2 className="editable-display mt-4 text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
                    Find {firstName} on the open web.
                  </h2>
                </div>
              </div>
            </EditableReveal>
            <div className="mt-10 grid gap-3 md:grid-cols-2">
              {links.map((link, i) => (
                <EditableReveal key={link.href} index={i}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noreferrer nofollow"
                    className="group flex items-center justify-between gap-4 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-bg)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--tk-accent)]"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
                        <link.icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">{link.label}</div>
                        <div className="editable-mono mt-1 truncate text-[15px] text-[var(--tk-text)]">{link.text}</div>
                      </div>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-[var(--tk-muted)] transition-colors group-hover:text-[var(--tk-accent)]" />
                  </Link>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* 5 — THEIR CONTRIBUTIONS */}
      <section className="border-b border-[var(--tk-line)]">
        <div className="mx-auto max-w-[var(--editable-container)] px-6 py-24 lg:px-10 lg:py-28">
          <EditableReveal index={0}>
            <div className="relative overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-10 sm:p-14">
              <div
                className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[520px] rounded-full opacity-30 blur-[110px]"
                style={{ background: 'radial-gradient(circle, var(--tk-accent) 0%, transparent 65%)' }}
                aria-hidden="true"
              />
              <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                <div className="max-w-2xl">
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">Their {C.plural.toLowerCase()}</p>
                  <h2 className="editable-display mt-4 text-3xl font-medium tracking-[-0.03em] sm:text-4xl lg:text-[3rem]">
                    What {firstName} keeps on the shelf.
                  </h2>
                  <p className="mt-6 text-[15px] leading-[1.7] text-[var(--tk-muted)]">
                    Every {C.itemSingular.toLowerCase()} this {C.memberSingular.toLowerCase()} has contributed to the library.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/search?q=${encodeURIComponent(post.title || '')}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition hover:scale-[1.02]"
                  >
                    Open their contributions <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </EditableReveal>
        </div>
      </section>

      {/* 6 — CONTACT ROW */}
      {email ? (
        <section>
          <div className="mx-auto max-w-[var(--editable-container)] px-6 py-20 lg:px-10">
            <EditableReveal index={0}>
              <div className="flex flex-col justify-between gap-6 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 sm:flex-row sm:items-center sm:p-10">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">Write directly</div>
                    <div className="editable-mono mt-1 text-[15px] text-[var(--tk-text)]">{email}</div>
                  </div>
                </div>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition hover:scale-[1.02]"
                >
                  Send an email <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </EditableReveal>
          </div>
        </section>
      ) : null}
    </>
  )
}
