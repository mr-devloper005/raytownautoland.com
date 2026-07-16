'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { globalContent, isUiHiddenTask } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Klyro-style footer. Discovery lives here: a "Collections" column that
  deep-links into /sbm?category=<slug>. Never lists task links for hidden
  tasks (profile). Big oversized brand mark at the bottom.
*/
export function EditableFooter() {
  const { session, logout } = useEditableLocalAuthSession()
  const year = new Date().getFullYear()
  // Use the same category source as the archive page's filter so links
  // in the footer always match what's browsable on /sbm.
  const collections = CATEGORY_OPTIONS.slice(0, 8).map((cat) => ({ label: cat.name, slug: cat.slug }))
  const collectionsHref = SITE_CONFIG.taskViews.sbm || '/sbm'
  const collectionsEnabled = SITE_CONFIG.tasks.some((t) => t.key === 'sbm' && t.enabled && !isUiHiddenTask(t.key))

  return (
    <footer className="mt-24 border-t border-[var(--editable-border)] bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-10 lg:py-24">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center  bg-[var(--slot4-accent)] text-[var(--slot4-on-accent)]">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
            </span>
            <span className="editable-display text-2xl font-medium tracking-[-0.02em]">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-6 max-w-md text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">
            {globalContent.footer.description}
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-5 py-2.5 text-sm font-medium text-[var(--slot4-page-text)] transition-colors duration-300 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
          >
            Submit a resource <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {collectionsEnabled ? (
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
              {globalContent.footer.collectionsHeading}
            </h3>
            <ul className="mt-6 grid gap-3">
              {collections.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`${collectionsHref}?category=${cat.slug}`}
                    className="group inline-flex items-center gap-2 text-[15px] text-[var(--slot4-muted-text)] transition-colors duration-300 hover:text-[var(--slot4-page-text)]"
                  >
                    {cat.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={collectionsHref}
                  className="group mt-2 inline-flex items-center gap-2 text-[15px] font-medium text-[var(--slot4-accent)]"
                >
                  All {globalContent.footer.collectionsHeading.toLowerCase()} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        ) : null}

        <div>
          {globalContent.footer.columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{col.title}</h3>
              <ul className="mt-6 grid gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-[var(--slot4-muted-text)] transition-colors duration-300 hover:text-[var(--slot4-page-text)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                {session ? (
                  <>
                    <li>
                      <Link href="/create" className="text-[15px] text-[var(--slot4-muted-text)] transition-colors duration-300 hover:text-[var(--slot4-page-text)]">
                        Create
                      </Link>
                    </li>
                    <li>
                      <button type="button" onClick={logout} className="text-left text-[15px] text-[var(--slot4-muted-text)] transition-colors duration-300 hover:text-[var(--slot4-page-text)]">
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/login" className="text-[15px] text-[var(--slot4-muted-text)] transition-colors duration-300 hover:text-[var(--slot4-page-text)]">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link href="/signup" className="text-[15px] text-[var(--slot4-muted-text)] transition-colors duration-300 hover:text-[var(--slot4-page-text)]">
                        Sign up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--editable-border)]">
        <div className="mx-auto max-w-[var(--editable-container)] px-6 py-10 sm:px-8 lg:px-10">
          <div
            className="editable-display select-none text-center font-medium leading-none tracking-[-0.05em] text-[var(--slot4-page-text)] opacity-[0.06]"
            style={{ fontSize: 'clamp(72px, 18vw, 220px)' }}
            aria-hidden="true"
          >
            {SITE_CONFIG.name}
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-3 text-xs text-[var(--slot4-muted-text)] sm:flex-row">
            <p>© {year} {SITE_CONFIG.name}. {globalContent.footer.bottomNote}</p>
            <p className="editable-mono">{globalContent.site.domain}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
