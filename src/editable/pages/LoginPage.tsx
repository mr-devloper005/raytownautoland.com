import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Bookmark, Clock, KeyRound, ShieldCheck, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { pagesContent } from '@/editable/content/pages.content'
import { globalContent } from '@/editable/content/global.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { SITE_CONFIG } from '@/lib/site-config'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Sign in', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  const C = globalContent.collections
  const perks = [
    { icon: Bookmark, title: 'Save what you love', body: `Bookmark ${C.itemPlural.toLowerCase()} to open again later. Your list stays yours, forever.` },
    { icon: Sparkles, title: 'Publish your own', body: `Add ${C.itemPlural.toLowerCase()} to the library and start shaping a ${C.singular.toLowerCase()} of your own.` },
    { icon: ShieldCheck, title: 'Private by default', body: `We ask for the minimum — an email and a password. Nothing gets sold or shared.` },
  ]

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-20 blur-[130px]"
            style={{ background: 'radial-gradient(circle, var(--slot4-accent) 0%, transparent 65%)' }}
            aria-hidden="true"
          />
          <div className={`relative ${dc.container} grid min-h-[calc(100vh-8rem)] items-center gap-14 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24`}>
            {/* Left column */}
            <div>
              <EditableReveal index={0}>
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                  <KeyRound className="h-3.5 w-3.5" />
                  {pagesContent.auth.login.badge}
                </div>
              </EditableReveal>
              <EditableReveal index={1}>
                <h1 className={`mt-8 max-w-xl ${dc.type.heroTitle}`}>Welcome back.</h1>
              </EditableReveal>
              <EditableReveal index={2}>
                <p className={`mt-6 max-w-lg ${dc.type.body}`}>{pagesContent.auth.login.description}</p>
              </EditableReveal>

              <div className="mt-12 grid gap-4">
                {perks.map((p, i) => (
                  <EditableReveal key={p.title} index={i}>
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                        <p.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="editable-display text-lg font-medium tracking-[-0.02em]">{p.title}</h3>
                        <p className="mt-1 text-sm leading-[1.65] text-[var(--slot4-muted-text)]">{p.body}</p>
                      </div>
                    </div>
                  </EditableReveal>
                ))}
              </div>

              <EditableReveal index={4}>
                <div className="mt-12 flex items-center gap-3 rounded-[var(--editable-radius-md)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-3 text-xs text-[var(--slot4-muted-text)]">
                  <Clock className="h-4 w-4 text-[var(--slot4-accent)]" />
                  Signing in takes less than a minute.
                </div>
              </EditableReveal>
            </div>

            {/* Right column — form card */}
            <EditableReveal index={2}>
              <div className={`${dc.surface.soft} p-8 sm:p-10`}>
                <div className="flex items-center justify-between">
                  <h2 className="editable-display text-2xl font-medium tracking-[-0.02em]">{pagesContent.auth.login.formTitle}</h2>
                  <span className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">
                    /sign-in
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">
                  Use the email and password you signed up with.
                </p>
                <EditableLocalLoginForm />
                <div className="mt-8 rounded-[var(--editable-radius-md)] border border-dashed border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-4 text-sm">
                  <p className="text-[var(--slot4-page-text)]">
                    New to {SITE_CONFIG.name}?{' '}
                    <Link href="/signup" className="font-medium text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                      {pagesContent.auth.login.createCta}
                    </Link>
                  </p>
                  <p className="mt-2 text-xs text-[var(--slot4-muted-text)]">
                    It&rsquo;s free — no credit card, no strings attached.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs text-[var(--slot4-muted-text)]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[var(--slot4-accent)]" />
                  Protected by rate limits &amp; standard security practices.
                </div>
              </div>
            </EditableReveal>
          </div>
        </section>

        {/* Support strip */}
        <section className={`border-t border-[var(--editable-border)] ${dc.container} py-10`}>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-[var(--slot4-muted-text)]">
              Trouble signing in? We&rsquo;re happy to help.
            </p>
            <Link href="/contact" className={dc.button.ghost}>
              Contact support <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
