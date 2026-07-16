import { ArrowUpRight, Compass, Globe, Heart, Layers, LineChart, Sparkles, Users } from 'lucide-react'
import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { globalContent } from '@/editable/content/global.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export default function AboutPage() {
  const C = globalContent.collections
  const stats = [
    { value: '10K+', label: `${C.itemPlural} in the library` },
    { value: '350+', label: `${C.memberPlural}` },
    { value: '40+', label: `${C.plural}` },
    { value: '95%', label: 'Return visitors' },
  ]
  const values = [
    { icon: Sparkles, title: 'Quality over quantity', body: `Every ${C.itemSingular.toLowerCase()} is reviewed before it goes live. Nothing gets in for the sake of filling a shelf.` },
    { icon: Users, title: 'Community first', body: `Real people, real taste. Our ${C.memberPlural.toLowerCase()} write for other humans, not for search engines.` },
    { icon: Compass, title: 'Easy to explore', body: `Clear categories, calm layout, no infinite scroll. You should be able to find what you need in seconds.` },
    { icon: Heart, title: 'Made with care', body: `We take pride in the details — from the typography you're reading to the way results are ranked.` },
    { icon: LineChart, title: 'Always improving', body: `We ship updates every week based on what people actually use, ask for, and get stuck on.` },
    { icon: Globe, title: 'Open to the web', body: `Reading the library will always be free. Sign in only when you want to publish or save your own picks.` },
  ]
  const journey = [
    { year: '2022', title: 'The idea', body: `A shared doc of favourite links turned into something worth building.` },
    { year: '2023', title: 'First shelves', body: `Ten ${C.plural.toLowerCase()} went live with a handful of trusted ${C.memberPlural.toLowerCase()}.` },
    { year: '2024', title: 'Open doors', body: `We opened submissions to the public and welcomed hundreds of new contributors.` },
    { year: '2025', title: 'Today', body: `A calm home for curated ${C.itemPlural.toLowerCase()} — read by thousands every week.` },
  ]

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-25 blur-[130px]"
            style={{ background: 'radial-gradient(circle, var(--slot4-accent) 0%, transparent 65%)' }}
            aria-hidden="true"
          />
          <div className={`relative ${dc.container} pb-20 pt-24 sm:pt-28 lg:pb-24 lg:pt-32`}>
            <EditableReveal index={0}>
              <p className={dc.type.eyebrow}>{pagesContent.about.badge}</p>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className={`mt-8 max-w-4xl ${dc.type.heroTitle}`}>
                Built to help you find the good stuff, faster.
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className={`mt-8 max-w-2xl ${dc.type.body}`}>{pagesContent.about.description}</p>
            </EditableReveal>
            <EditableReveal index={3}>
              <div className="mt-12 grid grid-cols-2 gap-8 border-t border-[var(--editable-border)] pt-10 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="editable-display text-4xl font-medium tracking-[-0.03em] text-[var(--slot4-accent)] sm:text-5xl">{s.value}</div>
                    <div className="mt-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">{s.label}</div>
                  </div>
                ))}
              </div>
            </EditableReveal>
          </div>
        </section>

        {/* STORY */}
        <section className={`border-y border-[var(--editable-border)] ${dc.container} ${dc.shell.sectionY}`}>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <EditableReveal index={0}>
              <div>
                <p className={dc.type.eyebrow}>Our story</p>
                <h2 className={`mt-6 ${dc.type.sectionTitle}`}>Why we built {SITE_CONFIG.name}.</h2>
              </div>
            </EditableReveal>
            <EditableReveal index={1}>
              <div className="space-y-6 text-[17px] leading-[1.85] text-[var(--slot4-muted-text)]">
                {pagesContent.about.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </EditableReveal>
          </div>
        </section>

        {/* MISSION BAND */}
        <section className={`border-b border-[var(--editable-border)] bg-[var(--slot4-cream-bg)] text-[var(--slot4-cream-text)]`}>
          <div className={`${dc.container} ${dc.shell.sectionY}`}>
            <EditableReveal index={0}>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-on-accent)]/60">Our mission</p>
            </EditableReveal>
            <EditableReveal index={1}>
              <h2 className="editable-display mt-6 max-w-4xl text-balance text-[2.25rem] font-medium leading-[1.05] tracking-[-0.035em] sm:text-[3rem] lg:text-[3.75rem]">
                Make the web feel like a well-organised bookshelf again — a place you actually want to spend time in.
              </h2>
            </EditableReveal>
            <EditableReveal index={2}>
              <div className="mt-12 grid gap-8 border-t border-black/10 pt-10 sm:grid-cols-3">
                {[
                  { title: 'For readers', body: `Skip the feed. Open a shelf. Find something worth saving.` },
                  { title: 'For creators', body: `Publish work you're proud of alongside people whose taste you trust.` },
                  { title: 'For the web', body: `Send traffic back to sites that deserve it — small blogs, indie tools, deep archives.` },
                ].map((b) => (
                  <div key={b.title}>
                    <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-on-accent)]/60">{b.title}</div>
                    <p className="mt-3 text-[15px] leading-[1.65] text-[var(--slot4-on-accent)]/80">{b.body}</p>
                  </div>
                ))}
              </div>
            </EditableReveal>
          </div>
        </section>

        {/* VALUES */}
        <section className={`border-b border-[var(--editable-border)] ${dc.container} ${dc.shell.sectionY}`}>
          <EditableReveal index={0}>
            <p className={dc.type.eyebrow}>What we believe</p>
            <h2 className={`mt-6 max-w-3xl ${dc.type.sectionTitle}`}>Six principles that shape everything we ship.</h2>
          </EditableReveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, i) => (
              <EditableReveal key={value.title} index={i}>
                <div className={`${dc.surface.soft} h-full p-7`}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                    <value.icon className="h-5 w-5" />
                  </span>
                  <h3 className="editable-display mt-6 text-xl font-medium tracking-[-0.02em]">{value.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.65] text-[var(--slot4-muted-text)]">{value.body}</p>
                </div>
              </EditableReveal>
            ))}
          </div>
        </section>

        {/* JOURNEY / TIMELINE */}
        <section className={`border-b border-[var(--editable-border)] ${dc.container} ${dc.shell.sectionY}`}>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <EditableReveal index={0}>
              <div>
                <p className={dc.type.eyebrow}>The journey</p>
                <h2 className={`mt-6 ${dc.type.sectionTitle}`}>From a shared doc to a public library.</h2>
                <p className="mt-6 max-w-md text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">
                  A short history of how we got here — and where we&rsquo;re headed next.
                </p>
              </div>
            </EditableReveal>
            <div className="grid gap-0 border-l border-[var(--editable-border)]">
              {journey.map((step, i) => (
                <EditableReveal key={step.year} index={i}>
                  <div className="relative py-7 pl-8">
                    <span className="absolute left-[-5px] top-9 h-2.5 w-2.5 rounded-full bg-[var(--slot4-accent)]" />
                    <div className="editable-mono text-xs uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">{step.year}</div>
                    <h3 className="editable-display mt-3 text-xl font-medium tracking-[-0.02em]">{step.title}</h3>
                    <p className="mt-2 max-w-lg text-[15px] leading-[1.65] text-[var(--slot4-muted-text)]">{step.body}</p>
                  </div>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={`${dc.container} ${dc.shell.sectionY}`}>
          <EditableReveal index={0}>
            <div className={`relative overflow-hidden ${dc.surface.dark} border border-[var(--editable-border)] p-10 sm:p-14 lg:p-16`}>
              <div
                className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full opacity-30 blur-[110px]"
                style={{ background: 'radial-gradient(circle, var(--slot4-accent) 0%, transparent 65%)' }}
                aria-hidden="true"
              />
              <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                <div>
                  <p className={dc.type.eyebrow}>Join in</p>
                  <h3 className="editable-display mt-4 max-w-2xl text-3xl font-medium tracking-[-0.03em] sm:text-4xl lg:text-[3rem]">
                    Ready to add your first {C.itemSingular.toLowerCase()}?
                  </h3>
                  <p className="mt-5 max-w-xl text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">
                    Whether you want to read, publish, or just say hello — the door is open.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/signup" className={dc.button.primary}>
                    Create an account <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link href="/contact" className={dc.button.secondary}>
                    Get in touch
                  </Link>
                </div>
              </div>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}

// Silence unused-import warnings.
export const _icons = { Layers }
