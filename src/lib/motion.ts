import { useLayoutEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger }

export interface MotionApi {
  /** true od 768 px wzwyż (pinning i cięższe efekty tylko tutaj) */
  desktop: boolean
  root: HTMLElement
  q: <T extends Element = HTMLElement>(selector: string) => T[]
}

/**
 * Uruchamia animacje sekcji w gsap.matchMedia — wyłącznie gdy użytkownik nie prosi
 * o ograniczenie ruchu. Wszystko jest automatycznie sprzątane przy odmontowaniu
 * lub zmianie breakpointu.
 */
export function useMotion(
  scope: RefObject<HTMLElement | null>,
  setup: (api: MotionApi) => void | (() => void),
) {
  useLayoutEffect(() => {
    const root = scope.current
    if (!root) return
    const mm = gsap.matchMedia()
    mm.add(
      {
        desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
      },
      (ctx) => {
        const desktop = Boolean(ctx.conditions?.desktop)
        const q = <T extends Element = HTMLElement>(s: string) =>
          Array.from(root.querySelectorAll<T>(s))
        return setup({ desktop, root, q })
      },
      root,
    )
    return () => mm.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

/** Odsłonięcie linii tekstu (overflow hidden + przesunięcie) reagujące w obie strony. */
export function revealLines(
  targets: Element[],
  trigger: Element,
  opts: { start?: string; stagger?: number; duration?: number; delay?: number } = {},
) {
  if (!targets.length) return
  gsap.fromTo(
    targets,
    { yPercent: 110 },
    {
      yPercent: 0,
      duration: opts.duration ?? 1.1,
      ease: 'expo.out',
      stagger: opts.stagger ?? 0.09,
      delay: opts.delay ?? 0,
      scrollTrigger: { trigger, start: opts.start ?? 'top 78%', toggleActions: 'play none none reverse' },
    },
  )
}
