import type Lenis from 'lenis'

let instance: Lenis | null = null
/** Każde nowe przewinięcie unieważnia poprzednie (autoprzewijanie hero, weryfikacje, ponowienia). */
let token = 0
/** Do kiedy trwa przewijanie programowe (nagłówek nie powinien wtedy się chować). */
let programmaticUntil = 0
export const isProgrammaticScroll = () => performance.now() < programmaticUntil

export const setLenis = (l: Lenis | null) => {
  instance = l
}
export const getLenis = () => instance

/** Stały nagłówek jest przezroczysty, a sekcje mają własny górny padding, więc cel = górna krawędź sekcji. */
const HEADER_OFFSET = 0

/**
 * Pozycja sekcji w dokumencie. Sekcje przypięte przez ScrollTrigger są przenoszone do
 * .pin-spacer, więc mierzymy opakowanie — jego położenie nie zależy od stanu pinu.
 */
const sectionY = (el: HTMLElement) => {
  const host = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el
  return Math.max(0, Math.round(host.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET))
}

/** Anuluje trwające i oczekujące przewinięcia programowe (np. przy ręcznym scrollu). */
export const cancelProgrammaticScroll = () => {
  token += 1
}

/**
 * Przewija dokładnie do sekcji. Po zakończeniu ruchu sprawdza, czy layout (piny, fonty,
 * filmy) nie przesunął celu, i w razie potrzeby koryguje pozycję. Nowsze wywołanie
 * zawsze wygrywa ze starszym.
 */
export function scrollToHash(hash: string, immediate = false) {
  const el = hash === '#top' ? null : document.querySelector<HTMLElement>(hash)
  if (hash !== '#top' && !el) return
  const target = () => (el ? sectionY(el) : 0)
  const mine = ++token

  const go = (attempt: number, instant: boolean) => {
    if (mine !== token) return
    programmaticUntil = performance.now() + (attempt === 0 ? 1900 : 700)
    // Lenis liczy limit przewijania w ResizeObserverze — po zmianie layoutu bywa nieaktualny
    instance?.resize()
    const y = target()
    const verify = () => {
      if (mine !== token) return
      if (attempt < 2 && Math.abs(target() - window.scrollY) > 3) go(attempt + 1, true)
    }
    if (instance) {
      instance.scrollTo(y, {
        immediate: instant,
        force: true,
        duration: attempt === 0 ? 1.5 : 0.4,
        onComplete: verify,
      })
      if (instant) window.requestAnimationFrame(verify)
    } else {
      window.scrollTo({ top: y, behavior: 'auto' })
      window.requestAnimationFrame(verify)
    }
  }
  go(0, immediate)
}
