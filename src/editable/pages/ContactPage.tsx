'use client'

import Link from 'next/link'
import { ArrowUpRight, Bookmark, Clock, HelpCircle, Library, LifeBuoy, MapPin, Minus, Plus, Send, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { globalContent } from '@/editable/content/global.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { SITE_CONFIG } from '@/lib/site-config'

export default function ContactPage() {
  const C = globalContent.collections

  const lanes = [
    { icon: Bookmark, title: `Submit a ${C.itemSingular.toLowerCase()}`, body: `Point us at a link, tool or reference that belongs on a shelf. Tell us which ${C.singular.toLowerCase()} it fits and why.` },
    { icon: Library, title: `Start a new ${C.singular.toLowerCase()}`, body: `Have a whole area of expertise? Pitch a new ${C.singular.toLowerCase()} and become the ${C.memberSingular.toLowerCase()} for it.` },
    { icon: Sparkles, title: `${C.memberSingular} support`, body: `Publishing, editing, or organising your shelf — reach the small team behind the library.` },
    { icon: LifeBuoy, title: 'Something else', body: 'Feedback, partnerships, quiet corrections — anything that keeps the library good.' },
  ]

  const channels = [
    { icon: Send, label: 'Contact form', value: 'Fastest way to reach us' },
    { icon: Clock, label: 'Response time', value: 'Within 1–2 business days' },
    { icon: MapPin, label: 'Where we are', value: 'Fully remote · worldwide' },
    { icon: LifeBuoy, label: 'Support hours', value: 'Mon–Fri · 9am–6pm' },
  ]

  const faqs = [
    { q: 'How long does it take to hear back?', a: 'We reply to every message within one or two business days. Complex requests may take a little longer while we route them to the right person.' },
    { q: `Can I submit multiple ${C.itemPlural.toLowerCase()} at once?`, a: `Absolutely. Send them in one message and mention which ${C.singular.toLowerCase()} each one fits. We'll review them together.` },
    { q: 'Do you accept sponsorships or paid placement?', a: `No. Everything on the shelf is chosen on merit by real ${C.memberPlural.toLowerCase()}. Ads are clearly labelled and never influence what gets curated.` },
    { q: 'How do I report a broken or dead link?', a: `Send us the URL and a short note. We'll remove it from the shelf and, where possible, replace it with a working alternative.` },
    { q: 'Can we partner with your team?', a: `Send a short intro and what you have in mind. We're a small team, so we can't take on everything, but we do read every pitch.` },
  ]

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[720px] rounded-full opacity-25 blur-[130px]"
            style={{ background: 'radial-gradient(circle, var(--slot4-accent) 0%, transparent 65%)' }}
            aria-hidden="true"
          />
          <div className={`relative ${dc.container} pb-16 pt-24 sm:pt-28 lg:pt-32`}>
            <EditableReveal index={0}>
              <p className={dc.type.eyebrow}>{pagesContent.contact.eyebrow}</p>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className={`mt-8 max-w-3xl ${dc.type.heroTitle}`}>Let&rsquo;s talk.</h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className={`mt-8 max-w-2xl ${dc.type.body}`}>{pagesContent.contact.description}</p>
            </EditableReveal>
          </div>
        </section>

        {/* CHANNELS BAR */}
        <section className="border-y border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
          <div className={`${dc.container} grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4`}>
            {channels.map((ch, i) => (
              <EditableReveal key={ch.label} index={i}>
                <div className="border-l border-[var(--slot4-accent)] pl-5">
                  <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">
                    <ch.icon className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {ch.label}
                  </div>
                  <div className="mt-3 text-[15px] text-[var(--slot4-page-text)]">{ch.value}</div>
                </div>
              </EditableReveal>
            ))}
          </div>
        </section>

        {/* LANES + FORM */}
        <section className={`${dc.container} ${dc.shell.sectionY}`}>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <EditableReveal index={0}>
                <p className={dc.type.eyebrow}>Pick a lane</p>
                <h2 className={`mt-6 ${dc.type.sectionTitle}`}>What&rsquo;s this about?</h2>
                <p className="mt-6 max-w-md text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">
                  Choose the lane that fits and we&rsquo;ll route your message to the right ${C.memberSingular.toLowerCase()}.
                </p>
              </EditableReveal>
              <div className="mt-10 grid gap-4">
                {lanes.map((lane, i) => (
                  <EditableReveal key={lane.title} index={i}>
                    <div className={`${dc.surface.soft} p-6`}>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                        <lane.icon className="h-5 w-5" />
                      </span>
                      <h3 className="editable-display mt-5 text-xl font-medium tracking-[-0.02em]">{lane.title}</h3>
                      <p className="mt-2.5 text-[15px] leading-[1.6] text-[var(--slot4-muted-text)]">{lane.body}</p>
                    </div>
                  </EditableReveal>
                ))}
              </div>
            </div>

            <EditableReveal index={0}>
              <div className={`${dc.surface.card} p-8 sm:p-10 lg:sticky lg:top-24`}>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--slot4-accent)] text-[var(--slot4-on-accent)]">
                    <Send className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">Contact form</p>
                    <h2 className="editable-display mt-1 text-2xl font-medium tracking-[-0.02em]">{pagesContent.contact.formTitle}</h2>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-[1.65] text-[var(--slot4-muted-text)]">
                  A short message is enough. If we need more, we&rsquo;ll ask.
                </p>
                <EditableContactLeadForm />
              </div>
            </EditableReveal>
          </div>
        </section>

        {/* FAQ */}
        <section className={`border-t border-[var(--editable-border)] ${dc.container} ${dc.shell.sectionY}`}>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <EditableReveal index={0}>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                  <HelpCircle className="h-3.5 w-3.5" /> FAQ
                </div>
                <h2 className={`mt-6 ${dc.type.sectionTitle}`}>Common questions.</h2>
                <p className="mt-6 max-w-md text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">
                  Quick answers to the things people ask most. Still stuck? The form above goes straight to us.
                </p>
                <Link href="/about" className={`mt-8 ${dc.button.secondary}`}>
                  About the library <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </EditableReveal>
            <EditableReveal index={1}>
              <div className="divide-y divide-[var(--editable-border)] border-y border-[var(--editable-border)]">
                {faqs.map((it, i) => (
                  <details key={it.q} className="group py-6" open={i === 0}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                      <span className="editable-display text-lg font-medium tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-xl">{it.q}</span>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)] transition-colors group-hover:border-[var(--slot4-accent)] group-hover:text-[var(--slot4-accent)]">
                        <Plus className="h-4 w-4 group-open:hidden" />
                        <Minus className="hidden h-4 w-4 group-open:block" />
                      </span>
                    </summary>
                    <p className="mt-4 max-w-2xl text-[15px] leading-[1.75] text-[var(--slot4-muted-text)]">{it.a}</p>
                  </details>
                ))}
              </div>
            </EditableReveal>
          </div>
        </section>

        {/* SIGN-OFF */}
        <section className={`${dc.container} pb-24`}>
          <EditableReveal index={0}>
            <div className="rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 text-center sm:p-12">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">We read every message</p>
              <h3 className="editable-display mt-4 text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                A small team from {SITE_CONFIG.name} reviews every submission.
              </h3>
              <p className="mx-auto mt-5 max-w-md text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">
                Use the form above and we&rsquo;ll get back to you within one or two business days.
              </p>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
