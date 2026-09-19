import type Lenis from 'lenis'

let instance: Lenis | null = null

export const setLenis = (l: Lenis | null) => {
  instance = l
}
export const getLenis = () => instance

/** Przewija do kotwicy — przez Lenis, a przy reduced-motion natywnie. */
export const scrollToHash = (hash: string) => {
  const target = hash === '#top' ? 0 : document.querySelector<HTMLElement>(hash)
  if (target === null) return
  if (instance) instance.scrollTo(target, { duration: 1.6, offset: 0 })
  else if (typeof target === 'number') window.scrollTo({ top: 0 })
  else target.scrollIntoView()
}
