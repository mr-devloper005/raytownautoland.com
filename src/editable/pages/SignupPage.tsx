import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Bookmark, CheckCircle2, Sparkles, UserPlus, Zap } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { pagesContent } from '@/editable/content/pages.content'
import { globalContent } from '@/editable/content/global.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { SITE_CONFIG } from '@/lib/site-config'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Create an account', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  const C = globalContent.collections
  const benefits = [
    `Publish ${C.itemPlural.toLowerCase()} to any ${C.singular.toLowerCase()}`,
    `Save favourites to your personal shelf`,
    `Follow the ${C.memberPlural.toLowerCase()} whose taste maps to yours`,
    `Get notified when a ${C.singular.toLowerCase()} you like gets new picks`,
    `No ads in your account area, ever`,
    `Delete your account with one click — we mean it`,
  ]

  const steps = [
    { n: '01', title: 'Create your account', body: 'Email and a password. Takes under a minute.' },
    { n: '02', title: `Pick a ${C.singular.toLowerCase()}`, body: `Follow shelves that match what you're into.` },
    { n: '03', title: `Add your first ${C.itemSingular.toLowerCase()}`, body: `Save something worth sharing. It goes live after a quick review.` },
  ]

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[720px] rounded-full opacity-25 blur-[130px]"
            style={{ background: 'radial-gradient(circle, var(--slot4-accent) 0%, transparent 65%)' }}
            aria-hidden="true"
          />
          <div className={`relative ${dc.container} grid min-h-[calc(100vh-8rem)] items-center gap-14 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:py-24`}>
            {/* Left column — form card */}
            <EditableReveal index={2}>
              <div className={`${dc.surface.soft} order-2 p-8 sm:p-10 lg:order-1`}>
                <div className="flex items-center justify-between">
                  <h1 className="editable-display text-2xl font-medium tracking-[-0.02em]">{pagesContent.auth.signup.formTitle}</h1>
                  <span className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">/join</span>
                </div>
                <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">
                  Free forever. Cancel any time. No card required.
                </p>
                <EditableLocalSignupForm />
                <div className="mt-8 rounded-[var(--editable-radius-md)] border border-dashed border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-4 text-sm">
                  <p className="text-[var(--slot4-page-text)]">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                      {pagesContent.auth.signup.loginCta}
                    </Link>
                  </p>
                </div>
                <p className="mt-6 text-xs leading-[1.65] text-[var(--slot4-muted-text)]">
                  By creating an account you agree to our terms of use and privacy policy. We only email you about your account — never marketing.
                </p>
              </div>
            </EditableReveal>

            {/* Right column */}
            <div className="order-1 lg:order-2">
              <EditableReveal index={0}>
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                  <UserPlus className="h-3.5 w-3.5" />
                  {pagesContent.auth.signup.badge}
                </div>
              </EditableReveal>
              <EditableReveal index={1}>
                <h2 className={`mt-8 max-w-xl ${dc.type.heroTitle}`}>Join the library.</h2>
              </EditableReveal>
              <EditableReveal index={2}>
                <p className={`mt-6 max-w-lg ${dc.type.body}`}>{pagesContent.auth.signup.description}</p>
              </EditableReveal>

              <EditableReveal index={3}>
                <ul className="mt-10 grid gap-3">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-[15px] leading-[1.6] text-[var(--slot4-page-text)]">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent)] text-[var(--slot4-on-accent)]">
                        <CheckCircle2 className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </EditableReveal>

              <EditableReveal index={4}>
                <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3">
                  <div className="flex -space-x-2">
                    {['A', 'M', 'R'].map((letter) => (
                      <span key={letter} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--slot4-page-bg)] bg-[var(--slot4-accent)] text-xs font-medium text-[var(--slot4-on-accent)]">
                        {letter}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-[var(--slot4-muted-text)]">
                    Join <span className="font-medium text-[var(--slot4-page-text)]">350+ {C.memberPlural.toLowerCase()}</span> already publishing.
                  </p>
                </div>
              </EditableReveal>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className={`border-t border-[var(--editable-border)] ${dc.container} ${dc.shell.sectionY}`}>
          <EditableReveal index={0}>
            <p className={dc.type.eyebrow}>Getting started</p>
            <h2 className={`mt-6 max-w-3xl ${dc.type.sectionTitle}`}>Three steps from account to first {C.itemSingular.toLowerCase()}.</h2>
          </EditableReveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <EditableReveal key={s.n} index={i}>
                <div className={`${dc.surface.soft} h-full p-7`}>
                  <span className="editable-mono text-xs uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{s.n}</span>
                  <h3 className="editable-display mt-4 text-xl font-medium tracking-[-0.02em]">{s.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.65] text-[var(--slot4-muted-text)]">{s.body}</p>
                </div>
              </EditableReveal>
            ))}
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className={`border-y border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] ${dc.container} py-12`}>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { icon: Sparkles, title: 'Curated, not ranked', body: `Real ${C.memberPlural.toLowerCase()} pick what goes in — never an algorithm.` },
              { icon: Bookmark, title: 'Yours to keep', body: `Everything you save stays private unless you publish it.` },
              { icon: Zap, title: 'Fast and quiet', body: `A calm interface, no popups, no dark patterns.` },
            ].map((t) => (
              <div key={t.title} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                  <t.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="editable-display text-lg font-medium tracking-[-0.02em]">{t.title}</h3>
                  <p className="mt-1 text-sm leading-[1.65] text-[var(--slot4-muted-text)]">{t.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sign-off */}
        <section className={`${dc.container} py-16`}>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-[var(--slot4-muted-text)]">
              Prefer to browse first? {SITE_CONFIG.name} is free to read without an account.
            </p>
            <Link href="/sbm" className={dc.button.ghost}>
              Explore the library <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
