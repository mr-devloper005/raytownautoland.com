import Link from 'next/link'
import { ArrowUpRight, Bookmark, Check, Globe, Layers, Library, Minus, Plus, Search, Sparkles, Star, Tag } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { globalContent } from '@/editable/content/global.content'
import { getEditablePostImage, postHref, toPlainText } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const C = globalContent.collections
const container = dc.container

function getExcerpt(post?: SitePost | null, limit = 130) {
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

function categoryOf(post?: SitePost | null, fallback = C.singular) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || fallback
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

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* ============================== HERO ============================== */
export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const featured = pool.slice(0, 3)
  const hero = pagesContent.home.hero
  const stats = [
    { value: String(pool.length || 128), label: `${C.itemPlural.toLowerCase()} curated` },
    { value: globalContent.footer.collectionCategories.length.toString(), label: `${C.plural.toLowerCase()}` },
    { value: '24/7', label: 'open library' },
  ]

  return (
    <section className="relative overflow-hidden border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(circle, var(--slot4-accent) 0%, transparent 65%)' }}
        aria-hidden="true"
      />
      <div className={`relative ${container} pb-24 pt-24 sm:pt-28 lg:pb-28 lg:pt-32`}>
        <EditableReveal index={0}>
          <p className={`${dc.type.eyebrow} inline-flex items-center gap-2`}>
            <Sparkles className="h-3.5 w-3.5" />
            {hero.badge || `A ${SITE_CONFIG.name} library`}
          </p>
        </EditableReveal>
        <EditableReveal index={1}>
          <h1 className={`mt-8 max-w-5xl ${dc.type.heroTitle}`}>
            {hero.title?.[0] || `The best ${C.itemPlural.toLowerCase()} on the web,`}{' '}
            <span className="text-[var(--slot4-accent)]">{hero.title?.[1] || `organised into ${C.plural.toLowerCase()}.`}</span>
          </h1>
        </EditableReveal>
        <EditableReveal index={2}>
          <p className={`mt-8 max-w-2xl ${dc.type.body}`}>{hero.description}</p>
        </EditableReveal>
        <EditableReveal index={3}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href={primaryRoute} className={dc.button.primary}>
              Explore {C.plural.toLowerCase()} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/search" className={dc.button.secondary}>
              <Search className="h-4 w-4" /> Search resources
            </Link>
          </div>
        </EditableReveal>

        <EditableReveal index={4}>
          <div className="mt-16 flex flex-wrap items-center gap-x-12 gap-y-4">
            {stats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-3">
                <span className="editable-display text-4xl font-medium tracking-[-0.03em] text-[var(--slot4-page-text)] sm:text-5xl">{s.value}</span>
                <span className={dc.type.label}>{s.label}</span>
              </div>
            ))}
          </div>
        </EditableReveal>

        {/* Product visual: a stack of three preview cards floating on the side */}
        {featured.length ? (
          <EditableReveal index={5}>
            <div className="mt-20 grid gap-5 md:grid-cols-3">
              {featured.map((post, i) => (
                <Link
                  key={post.id || post.slug}
                  href={postHref(primaryTask, post, primaryRoute)}
                  className={`group block overflow-hidden ${dc.surface.soft} ${dc.motion.lift}`}
                >
                  <div className={`${dc.media.frame} aspect-[4/3]`}>
                    <img src={getEditablePostImage(post)} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.imgHover}`} />
                    <span className="absolute left-4 top-4 rounded-full bg-[var(--slot4-page-bg)]/85 px-3 py-1 text-[11px] font-medium text-[var(--slot4-accent)] backdrop-blur">
                      Preview {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="p-6">
                    <p className={dc.type.eyebrow}>{categoryOf(post)}</p>
                    <h3 className="editable-display mt-3 line-clamp-2 text-xl font-medium leading-snug tracking-[-0.02em]">{post.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </EditableReveal>
        ) : null}
      </div>
    </section>
  )
}

/* =================== MARQUEE (collection categories) =================== */
export function EditableStoryRail({ primaryRoute }: HomeSectionProps) {
  const categories = globalContent.footer.collectionCategories
  if (!categories.length) return null
  // Duplicate for seamless marquee
  const marqueeItems = [...categories, ...categories]
  return (
    <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <EditableReveal index={0}>
        <div className="overflow-hidden py-10">
          <div className="editable-marquee gap-14 px-6 sm:px-8 lg:px-10">
            {marqueeItems.map((cat, i) => (
              <Link
                key={`${cat.slug}-${i}`}
                href={`${primaryRoute}?category=${cat.slug}`}
                className="group inline-flex shrink-0 items-center gap-3 text-[var(--slot4-muted-text)] transition-colors hover:text-[var(--slot4-page-text)]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent)]" />
                <span className="editable-display whitespace-nowrap text-2xl font-medium tracking-[-0.02em] sm:text-3xl">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </EditableReveal>
    </section>
  )
}

/* =================== ALTERNATING CHECKMARK FEATURES =================== */
function FeatureRow({
  index,
  eyebrow,
  title,
  bullets,
  image,
  reverse,
}: {
  index: number
  eyebrow: string
  title: string
  bullets: string[]
  image: string
  reverse?: boolean
}) {
  return (
    <EditableReveal index={index}>
      <div className={`grid items-center gap-14 lg:grid-cols-2 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <div>
          <p className={dc.type.eyebrow}>{eyebrow}</p>
          <h3 className="editable-display mt-6 text-3xl font-medium tracking-[-0.03em] sm:text-4xl lg:text-[2.75rem]">{title}</h3>
          <ul className="mt-8 grid gap-4">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[15px] leading-[1.65] text-[var(--slot4-page-text)]">
                <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent)] text-[var(--slot4-on-accent)]">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className={`${dc.media.frame} aspect-[4/3] overflow-hidden border ${pal.border}`}>
          <img src={image} alt="" className="h-full w-full object-cover" />
        </div>
      </div>
    </EditableReveal>
  )
}

export function EditableMagazineSplit({ posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const images = pool.map(getEditablePostImage).filter((u) => u && !u.includes('placeholder'))
  const fill = (i: number) => images[i % Math.max(images.length, 1)] || '/placeholder.svg?height=900&width=1200'

  const rows = [
    {
      eyebrow: 'What we do',
      title: `Every ${C.singular.toLowerCase()} is hand-picked by a real ${C.memberSingular.toLowerCase()}.`,
      bullets: [
        `Curated by ${C.memberPlural.toLowerCase()}, not algorithms`,
        `Every ${C.itemSingular.toLowerCase()} is verified and tagged`,
        `Grouped into themed ${C.plural.toLowerCase()} you can follow`,
        `Fresh finds surface at the top of each ${C.singular.toLowerCase()}`,
      ],
    },
    {
      eyebrow: 'How it works',
      title: `Save what you love, share it as a ${C.singular.toLowerCase()}.`,
      bullets: [
        `Bookmark a ${C.itemSingular.toLowerCase()} — it goes into your ${C.singular.toLowerCase()}`,
        'Add a note explaining why it matters',
        'Publish so other people can find it via search',
        `Get discovered as a ${C.memberSingular.toLowerCase()} in your topic`,
      ],
    },
  ]

  return (
    <section className={`border-b border-[var(--editable-border)] ${container} ${dc.shell.sectionY}`}>
      <div className="grid gap-24">
        {rows.map((row, i) => (
          <FeatureRow key={row.eyebrow} index={i} {...row} image={fill(i)} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  )
}

/* =================== COLLECTIONS GRID + FEATURED STATS =================== */
export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  if (!pool.length) return null

  const categories = globalContent.footer.collectionCategories
  const featured = pool.slice(0, 6)
  const rail = pool.slice(6, 18)

  return (
    <>
      {/* Collections grid */}
      <section className={`border-b border-[var(--editable-border)] ${container} ${dc.shell.sectionY}`}>
        <EditableReveal index={0}>
          <div className="flex items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className={dc.type.eyebrow}>Browse the library</p>
              <h2 className={`mt-6 ${dc.type.sectionTitle}`}>All {C.plural.toLowerCase()}, one calm surface.</h2>
            </div>
            <Link href={primaryRoute} className={`hidden ${dc.button.ghost} sm:inline-flex`}>
              See all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </EditableReveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <EditableReveal key={cat.slug} index={i}>
              <Link
                href={`${primaryRoute}?category=${cat.slug}`}
                className={`group flex h-full flex-col justify-between overflow-hidden ${dc.surface.soft} p-8 ${dc.motion.lift}`}
              >
                <div>
                  <span className="editable-mono text-xs text-[var(--slot4-muted-text)]">
                    {String(i + 1).padStart(2, '0')} / {String(categories.length).padStart(2, '0')}
                  </span>
                  <h3 className="editable-display mt-6 text-3xl font-medium tracking-[-0.025em]">{cat.label}</h3>
                  <p className="mt-3 text-[15px] leading-[1.6] text-[var(--slot4-muted-text)]">
                    {C.plural} of {C.itemPlural.toLowerCase()} for {cat.label.toLowerCase()} work — tools, references, reads.
                  </p>
                </div>
                <span className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-[var(--slot4-accent)]">
                  Open {C.singular.toLowerCase()} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </EditableReveal>
          ))}
        </div>
      </section>

      {/* Featured + stats band on cream */}
      {featured.length ? (
        <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-cream-bg)] text-[var(--slot4-cream-text)]">
          <div className={`${container} ${dc.shell.sectionY}`}>
            <EditableReveal index={0}>
              <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-on-accent)]/70">Featured this week</p>
                  <h2 className="editable-display mt-6 text-4xl font-medium tracking-[-0.035em] text-[var(--slot4-on-accent)] sm:text-5xl lg:text-[3.5rem]">
                    The {C.itemPlural.toLowerCase()} everyone bookmarked.
                  </h2>
                </div>
                <div className="grid grid-cols-3 gap-6 border-l border-black/10 pl-8">
                  {[
                    { v: `${pool.length}`, l: `live ${C.itemPlural.toLowerCase()}` },
                    { v: `${categories.length}`, l: `${C.plural.toLowerCase()}` },
                    { v: `${featured.length}`, l: 'featured' },
                  ].map((s) => (
                    <div key={s.l}>
                      <div className="editable-display text-3xl font-medium tracking-[-0.03em] text-[var(--slot4-on-accent)] sm:text-4xl">{s.v}</div>
                      <div className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[var(--slot4-on-accent)]/60">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </EditableReveal>
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((post, i) => {
                const domain = getDomain(post)
                return (
                  <EditableReveal key={post.id || post.slug} index={i}>
                    <Link
                      href={postHref(primaryTask, post, primaryRoute)}
                      className="group flex h-full flex-col justify-between rounded-[var(--editable-radius-lg)] border border-black/10 bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:border-black/30"
                    >
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-on-accent)]/60">{categoryOf(post)}</p>
                        <h3 className="editable-display mt-5 line-clamp-3 text-2xl font-medium leading-tight tracking-[-0.025em] text-[var(--slot4-on-accent)]">
                          {post.title}
                        </h3>
                        <p className="mt-4 line-clamp-2 text-sm leading-[1.6] text-[var(--slot4-on-accent)]/70">{getExcerpt(post, 130)}</p>
                      </div>
                      <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-5">
                        <span className="editable-mono flex items-center gap-1.5 text-xs text-[var(--slot4-on-accent)]/60">
                          <Globe className="h-3 w-3" /> {domain || 'in library'}
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-[var(--slot4-on-accent)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                  </EditableReveal>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* Dynamic bookmark grid + rail */}
      {rail.length ? (
        <section className={`border-b border-[var(--editable-border)] ${container} ${dc.shell.sectionY}`}>
          <EditableReveal index={0}>
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className={dc.type.eyebrow}>Recently curated</p>
                <h2 className={`mt-6 ${dc.type.sectionTitle}`}>Fresh {C.itemPlural.toLowerCase()} from the library.</h2>
              </div>
              <Link href={primaryRoute} className={`hidden ${dc.button.ghost} sm:inline-flex`}>
                All {C.itemPlural.toLowerCase()} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </EditableReveal>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rail.map((post, i) => {
              const domain = getDomain(post)
              return (
                <EditableReveal key={post.id || post.slug} index={i}>
                  <Link
                    href={postHref(primaryTask, post, primaryRoute)}
                    className={`group flex h-full flex-col justify-between overflow-hidden ${dc.surface.soft} p-6 ${dc.motion.lift}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                          <Bookmark className="h-4 w-4" />
                        </span>
                        <span className={dc.type.eyebrow}>{categoryOf(post)}</span>
                      </div>
                      <h3 className="editable-display mt-5 line-clamp-3 text-xl font-medium leading-snug tracking-[-0.02em]">{post.title}</h3>
                      <p className="mt-3 line-clamp-2 text-sm leading-[1.6] text-[var(--slot4-muted-text)]">{getExcerpt(post, 110)}</p>
                    </div>
                    {domain ? (
                      <p className="editable-mono mt-6 flex items-center gap-1.5 text-xs text-[var(--slot4-muted-text)]">
                        <Globe className="h-3 w-3" /> {domain}
                      </p>
                    ) : null}
                  </Link>
                </EditableReveal>
              )
            })}
          </div>
        </section>
      ) : null}

      <EditableSocialProof />
      <EditableFaq />
    </>
  )
}

/* =================== SOCIAL PROOF BAND =================== */
function EditableSocialProof() {
  const quotes = [
    { q: `The one place I actually trust for ${C.itemPlural.toLowerCase()} people vouched for.`, who: 'Product lead', where: 'Berlin' },
    { q: `I open a new tab, come here, and disappear into someone else's ${C.singular.toLowerCase()}.`, who: 'Designer', where: 'Lagos' },
    { q: `A whole workday of research replaced by one ${C.singular.toLowerCase()}.`, who: 'Engineer', where: 'Osaka' },
  ]
  return (
    <section className={`border-b border-[var(--editable-border)] ${container} ${dc.shell.sectionY}`}>
      <EditableReveal index={0}>
        <p className={dc.type.eyebrow}>Loved by readers</p>
        <h2 className={`mt-6 max-w-3xl ${dc.type.sectionTitle}`}>People bookmark this site itself.</h2>
      </EditableReveal>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {quotes.map((q, i) => (
          <EditableReveal key={q.who} index={i}>
            <blockquote className={`flex h-full flex-col justify-between ${dc.surface.soft} p-8`}>
              <div>
                <div className="flex gap-0.5 text-[var(--slot4-accent)]">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="editable-display mt-6 text-xl font-medium leading-snug tracking-[-0.02em]">“{q.q}”</p>
              </div>
              <footer className="mt-8 flex items-center gap-3 border-t border-[var(--editable-border)] pt-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-accent)] text-[var(--slot4-on-accent)]">
                  <UserGlyph />
                </span>
                <div>
                  <div className="text-sm font-medium text-[var(--slot4-page-text)]">{q.who}</div>
                  <div className="editable-mono text-xs text-[var(--slot4-muted-text)]">{q.where}</div>
                </div>
              </footer>
            </blockquote>
          </EditableReveal>
        ))}
      </div>
    </section>
  )
}

function UserGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  )
}

/* =================== FAQ =================== */
function EditableFaq() {
  const items = [
    { q: `What counts as a ${C.singular.toLowerCase()}?`, a: `A themed set of ${C.itemPlural.toLowerCase()} — links, tools, reads — grouped by a real ${C.memberSingular.toLowerCase()} around one topic.` },
    { q: `Who chooses what goes in?`, a: `${C.memberPlural} — the people who publish here. Nothing algorithmic, nothing paid.` },
    { q: `Can I submit a ${C.itemSingular.toLowerCase()}?`, a: `Yes. Send it through Contact and we'll route it to the right ${C.singular.toLowerCase()}.` },
    { q: `Is it free?`, a: `Reading the library is free. Contributors don't pay either — we ask for good taste, not money.` },
    { q: `How do I stay updated?`, a: `Bookmark a ${C.singular.toLowerCase()} you like — new ${C.itemPlural.toLowerCase()} show at the top when you come back.` },
  ]
  return (
    <section className={`border-b border-[var(--editable-border)] ${container} ${dc.shell.sectionY}`}>
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <EditableReveal index={0}>
          <div>
            <p className={dc.type.eyebrow}>Questions</p>
            <h2 className={`mt-6 ${dc.type.sectionTitle}`}>Everything you might ask.</h2>
            <p className="mt-6 max-w-md text-[15px] leading-[1.65] text-[var(--slot4-muted-text)]">
              Still curious? Reach out — the {C.memberPlural.toLowerCase()} answer directly.
            </p>
            <Link href="/contact" className={`mt-8 ${dc.button.secondary}`}>
              Ask a question <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </EditableReveal>
        <EditableReveal index={1}>
          <div className="divide-y divide-[var(--editable-border)] border-y border-[var(--editable-border)]">
            {items.map((it, i) => (
              <details key={it.q} className="group py-6" open={i === 0}>
                <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                  <span className="editable-display text-xl font-medium tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-2xl">{it.q}</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)] transition-colors group-hover:border-[var(--slot4-accent)] group-hover:text-[var(--slot4-accent)]">
                    <Plus className="h-4 w-4 group-open:hidden" />
                    <Minus className="hidden h-4 w-4 group-open:block" />
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">{it.a}</p>
              </details>
            ))}
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}

/* =================== CLOSING CTA BAND =================== */
export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  return (
    <section id="get-app" className="scroll-mt-24 border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`relative ${container} py-24 sm:py-28 lg:py-32`}>
        <EditableReveal index={0}>
          <div className={`relative overflow-hidden ${dc.surface.dark} border border-[var(--editable-border)] p-10 sm:p-16 lg:p-20`}>
            <div
              className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full opacity-40 blur-[110px]"
              style={{ background: 'radial-gradient(circle, var(--slot4-accent) 0%, transparent 65%)' }}
              aria-hidden="true"
            />
            <div className="relative">
              <p className={dc.type.eyebrow}>{cta.badge || 'Start browsing'}</p>
              <h2 className={`mt-6 max-w-3xl ${dc.type.sectionTitle}`}>{cta.title || `Find your next ${C.itemSingular.toLowerCase()}.`}</h2>
              <p className={`mt-6 max-w-xl ${dc.type.body}`}>{cta.description}</p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link href={cta.primaryCta?.href || '/sbm'} className={dc.button.primary}>
                  {cta.primaryCta?.label || `Open the library`} <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href={cta.secondaryCta?.href || '/contact'} className={dc.button.secondary}>
                  {cta.secondaryCta?.label || 'Contact us'}
                </Link>
              </div>
            </div>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}

// Silence unused-import warnings for the icon set we may swap in later.
export const _icons = { Layers, Library, Tag }
