import Link from 'next/link'
import { ArrowUpRight, Globe } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function toPlainText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
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
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}…` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Collection'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

function getDomain(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const url =
    (typeof content.website === 'string' && content.website) ||
    (typeof content.url === 'string' && content.url) ||
    (typeof content.link === 'string' && content.link) ||
    ''
  if (!url) return ''
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '')
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  }
}

/*
  EditorialFeatureCard — one oversized dark card, cover image bleeding to
  edges with a deep gradient and lime CTA. Used for a hero-adjacent feature.
*/
export function EditorialFeatureCard({ post, href, label = 'Featured collection' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group relative block overflow-hidden ${dc.surface.dark} ${dc.motion.lift}`}>
      <div className="relative min-h-[520px] p-8 sm:p-10 lg:min-h-[620px]">
        <img src={getEditablePostImage(post)} alt={post.title} className={`absolute inset-0 h-full w-full object-cover opacity-60 ${dc.motion.imgHover}`} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, color-mix(in oklab, var(--slot4-dark-bg) 15%, transparent), var(--slot4-dark-bg))' }} />
        <div className="relative z-10 flex h-full min-h-[460px] flex-col justify-end lg:min-h-[560px]">
          <span className={dc.type.eyebrow}>{label}</span>
          <h3 className="editable-display mt-6 max-w-3xl text-4xl font-medium leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">{post.title}</h3>
          <p className="mt-5 max-w-2xl text-[15px] leading-[1.7] text-white/75 sm:text-base">{getEditableExcerpt(post, 190)}</p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-6 py-3 text-sm font-medium text-[var(--slot4-on-accent)]">
            Open collection <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/*
  RailPostCard — a portrait tile used in horizontal rails. Cover image top,
  domain chip and title bottom. Hover lifts the card and scales the media.
*/
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const domain = getDomain(post)
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} aspect-[4/3]`}>
        <img src={getEditablePostImage(post)} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.imgHover}`} />
      </div>
      <div className="p-6">
        <p className={dc.type.eyebrow}>{String(index + 1).padStart(2, '0')} · {getEditableCategory(post)}</p>
        <h3 className="editable-display mt-3 line-clamp-2 text-2xl font-medium leading-[1.1] tracking-[-0.025em]">{post.title}</h3>
        <p className={`mt-3 line-clamp-2 text-[15px] leading-[1.6] ${pal.mutedText}`}>{getEditableExcerpt(post, 120)}</p>
        {domain ? (
          <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-[var(--slot4-muted-text)]">
            <Globe className="h-3.5 w-3.5" /> {domain}
          </p>
        ) : null}
      </div>
    </Link>
  )
}

/*
  CompactIndexCard — a numbered list item used inside sidebars/dense grids.
*/
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 ${dc.surface.soft} p-5 ${dc.motion.lift}`}>
      <div className="flex items-start gap-4">
        <span className="editable-mono flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border)] text-xs font-medium text-[var(--slot4-accent)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className={dc.type.eyebrow}>{getEditableCategory(post)}</p>
          <h3 className="editable-display mt-2 line-clamp-2 text-lg font-medium leading-tight tracking-[-0.02em]">{post.title}</h3>
          <p className={`mt-2 line-clamp-2 text-sm leading-[1.55] ${pal.mutedText}`}>{getEditableExcerpt(post, 100)}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--slot4-muted-text)] transition-colors group-hover:text-[var(--slot4-accent)]" />
      </div>
    </Link>
  )
}

/*
  ArticleListCard — a wide horizontal record with a square thumb.
*/
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid min-w-0 gap-6 overflow-hidden ${dc.surface.card} p-4 ${dc.motion.lift} sm:grid-cols-[220px_minmax(0,1fr)]`}>
      <div className={`${dc.media.frame} aspect-[4/3] sm:aspect-square`}>
        <img src={getEditablePostImage(post)} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.imgHover}`} />
      </div>
      <div className="min-w-0 p-2 sm:py-4 sm:pr-6">
        <p className={dc.type.eyebrow}>{String(index + 1).padStart(2, '0')} · {getEditableCategory(post)}</p>
        <h2 className="editable-display mt-3 line-clamp-2 text-2xl font-medium leading-tight tracking-[-0.025em] sm:text-[1.75rem]">{post.title}</h2>
        <p className={`mt-3 line-clamp-2 text-[15px] leading-[1.6] ${pal.mutedText}`}>{getEditableExcerpt(post, 160)}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-accent)]">
          Open <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
