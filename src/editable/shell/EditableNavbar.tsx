'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, Menu, PlusCircle, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Klyro-style top nav. No task/category links — collections discovery lives
  in the footer and on the home surface. Only: brand · About · Contact ·
  search glyph → /search · auth actions. Mobile menu mirrors it exactly.
*/
export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links: Array<{ label: string; href: string }> = [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-500 ${
        scrolled
          ? 'border-[var(--editable-border)] bg-[var(--editable-nav-bg)] backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-[76px] w-full max-w-[var(--editable-container)] items-center gap-8 px-6 sm:px-8 lg:px-10">
        <Link href="/" className="group inline-flex shrink-0 items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center bg-[var(--slot4-accent)] text-[var(--slot4-on-accent)]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
          </span>
          <span className="editable-display text-lg font-medium tracking-[-0.02em] text-[var(--slot4-page-text)] transition-colors group-hover:text-[var(--slot4-accent)]">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium tracking-[-0.005em] transition-colors duration-300 ${
                isActive(link.href)
                  ? 'text-[var(--slot4-accent)]'
                  : 'text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/search"
            aria-label="Search"
            className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)] transition-colors duration-300 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
          >
            <Search className="h-4 w-4" />
          </Link>
          {session ? (
            <>
              <Link
                href="/create"
                className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--slot4-accent)] px-4 py-2 text-sm font-medium text-[var(--slot4-on-accent)] transition-all duration-300 hover:scale-[1.03]"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Create
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-full px-3 py-2 text-sm font-medium text-[var(--slot4-muted-text)] transition-colors duration-300 hover:text-[var(--slot4-page-text)]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-[var(--editable-border)] px-4 py-2 text-sm font-medium text-[var(--slot4-page-text)] transition-colors duration-300 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
              >
                <LogIn className="h-3.5 w-3.5" /> Login
              </Link>
              <Link
                href="/signup"
                className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-[var(--slot4-accent)] px-4 py-2 text-sm font-medium text-[var(--slot4-on-accent)] transition-all duration-300 hover:scale-[1.03]"
              >
                <UserPlus className="h-3.5 w-3.5" /> Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)] transition-colors hover:border-[var(--slot4-accent)] lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-6 py-6 lg:hidden">
          <div className="grid gap-1.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                  isActive(link.href)
                    ? 'border-[var(--slot4-accent)] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]'
                    : 'border-[var(--editable-border)] text-[var(--slot4-page-text)] hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="rounded-2xl border border-[var(--editable-border)] px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)] hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
            >
              <Search className="mr-2 inline h-4 w-4" /> Search
            </Link>
            {session ? (
              <>
                <Link
                  href="/create"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl bg-[var(--slot4-accent)] px-4 py-3 text-sm font-medium text-[var(--slot4-on-accent)]"
                >
                  <PlusCircle className="mr-2 inline h-4 w-4" /> Create
                </Link>
                <button
                  type="button"
                  onClick={() => { logout(); setOpen(false) }}
                  className="rounded-2xl border border-[var(--editable-border)] px-4 py-3 text-left text-sm font-medium text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-[var(--editable-border)] px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)] hover:border-[var(--slot4-accent)]"
                >
                  <LogIn className="mr-2 inline h-4 w-4" /> Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl bg-[var(--slot4-accent)] px-4 py-3 text-sm font-medium text-[var(--slot4-on-accent)]"
                >
                  <UserPlus className="mr-2 inline h-4 w-4" /> Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
