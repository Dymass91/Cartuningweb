import { useEffect, useState } from 'react'
import { ScrollTrigger } from '../lib/motion'
import { getLenis } from '../lib/scroll'

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Process' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  // dark = jasny tekst (nad filmem lub ciemną sekcją), light = ciemny tekst (jasna sekcja)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  // useEffect (nie layout) — wykonuje się po wszystkich pinach, więc pozycje są poprawne.
  useEffect(() => {
    const apply = (el: HTMLElement) => setTheme(el.dataset.nav === 'light' ? 'light' : 'dark')
    const triggers = Array.from(document.querySelectorAll<HTMLElement>('[data-nav]')).map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 44px',
        end: 'bottom 44px',
        onToggle: (self) => self.isActive && apply(el),
        onUpdate: (self) => self.isActive && apply(el),
      }),
    )
    const dir = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => setHidden(self.scroll() > 120 && self.direction === 1),
    })
    ScrollTrigger.refresh()
    return () => {
      triggers.forEach((t) => t.kill())
      dir.kill()
    }
  }, [])

  useEffect(() => {
    const lenis = getLenis()
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (open) lenis?.stop()
    else lenis?.start()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={`nav ${hidden && !open ? 'is-hidden' : ''} ${open ? 'is-open' : ''}`}
      data-theme={open ? 'dark' : theme}
      onFocus={() => setHidden(false)}
    >
      <a className="nav__brand" href="#top" onClick={() => setOpen(false)}>
        NORTHLINE
      </a>
      <nav id="site-nav" className="nav__links" aria-label="Main">
        <ul>
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <button
        type="button"
        className="nav__toggle"
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? 'Close' : 'Menu'}
      </button>
    </header>
  )
}
