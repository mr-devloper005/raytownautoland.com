'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/*
  Scroll-reveal wrapper. IntersectionObserver adds `.is-visible` once the
  element enters the viewport; CSS in editable-global.css handles the fade
  and slide. The `hidden` starting state is only applied after mount so
  server-rendered HTML remains crawlable and screen-reader friendly if JS
  never runs. `index` staggers siblings for a wave effect.
*/
export function EditableReveal({
  children,
  index = 0,
  as: Tag = 'div',
  className = '',
  style,
  delay,
  once = true,
}: {
  children: ReactNode
  index?: number
  as?: 'div' | 'section' | 'article' | 'header' | 'footer'
  className?: string
  style?: CSSProperties
  delay?: number
  once?: boolean
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) io.disconnect()
          } else if (!once) {
            setVisible(false)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [once])

  const stagger = delay ?? Math.min(index, 8) * 90
  const combined: CSSProperties = { ...(style || {}), ['--reveal-delay' as string]: `${stagger}ms` }
  const cls = mounted ? `editable-reveal ${visible ? 'is-visible' : ''} ${className}` : className

  const Element = Tag as 'div'
  return (
    <Element ref={ref} className={cls} style={combined}>
      {children}
    </Element>
  )
}
