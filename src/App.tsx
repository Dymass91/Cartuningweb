import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './lib/motion'
import { reducedMotion } from './lib/env'
import { cancelProgrammaticScroll, scrollToHash, setLenis } from './lib/scroll'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Manifest from './components/Manifest'
import Cockpit from './components/Cockpit'
import Services from './components/Services'
import Rolling from './components/Rolling'
import Process from './components/Process'
import Detail from './components/Detail'
import Intro from './components/Intro'
import Featured from './components/Featured'
import Smoke from './components/Smoke'
import Standstill from './components/Standstill'
import Craft from './components/Craft'
import RoadTest from './components/RoadTest'
import Departure from './components/Departure'
import Contact from './components/Contact'

export default function App() {
  useEffect(() => {
    // Efekty dzieci (ScrollTriggery, piny) są już utworzone — efekt rodzica biegnie ostatni.
    let lenis: Lenis | null = null
    let tick: ((t: number) => void) | null = null

    if (!reducedMotion()) {
      const instance = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95 })
      lenis = instance
      setLenis(instance)
      instance.on('scroll', ScrollTrigger.update)
      tick = (t) => instance.raf(t * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!a) return
      const hash = a.getAttribute('href') ?? ''
      if (hash.length < 2) return
      e.preventDefault()
      scrollToHash(hash)
      history.replaceState(null, '', hash)
    }
    document.addEventListener('click', onClick)

    // Kotwica w adresie: po przeliczeniu pinów przeskakujemy do sekcji.
    const gotoHash = () => {
      if (location.hash.length > 1) scrollToHash(location.hash, true)
    }
    window.addEventListener('hashchange', gotoHash)

    const refresh = () => ScrollTrigger.refresh()
    let metaTimer = 0
    const onMeta = () => {
      window.clearTimeout(metaTimer)
      metaTimer = window.setTimeout(refresh, 150)
    }
    document.addEventListener('loadedmetadata', onMeta, true)
    window.addEventListener('load', refresh)
    // Po zmianie rozmiaru okna Lenis i ScrollTrigger przeliczają pozycje (piny zmieniają wysokości).
    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        lenis?.resize()
        refresh()
      }, 200)
    }
    window.addEventListener('resize', onResize)
    const userScroll = ['wheel', 'touchstart', 'keydown'] as const
    userScroll.forEach((e) => window.addEventListener(e, cancelProgrammaticScroll, { passive: true }))
    // dociągane później podzbiory fontów (np. polskie znaki) zmieniają wysokości tekstu
    document.fonts?.addEventListener('loadingdone', onMeta)
    void document.fonts?.ready.then(refresh)
    refresh()
    // Adres z kotwicą: po każdym przeliczeniu layoutu w pierwszych sekundach (fonty, metadane
    // filmów, piny) korygujemy pozycję, dopóki użytkownik sam nie zacznie przewijać.
    const started = performance.now()
    let touched = false
    const settle = () => {
      if (!touched && performance.now() - started < 4000) gotoHash()
    }
    const stop = () => { touched = true }
    const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
    inputs.forEach((e) => window.addEventListener(e, stop, { passive: true, once: true }))
    ScrollTrigger.addEventListener('refresh', settle)
    const initial = window.setTimeout(() => {
      refresh()
      gotoHash()
    }, 250)

    return () => {
      window.clearTimeout(initial)
      ScrollTrigger.removeEventListener('refresh', settle)
      inputs.forEach((e) => window.removeEventListener(e, stop))
      window.clearTimeout(metaTimer)
      document.removeEventListener('click', onClick)
      document.removeEventListener('loadedmetadata', onMeta, true)
      window.removeEventListener('hashchange', gotoHash)
      window.removeEventListener('load', refresh)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      userScroll.forEach((e) => window.removeEventListener(e, cancelProgrammaticScroll))
      document.fonts?.removeEventListener('loadingdone', onMeta)
      if (tick) gsap.ticker.remove(tick)
      lenis?.destroy()
      setLenis(null)
    }
  }, [])

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <Manifest />
        <Cockpit />
        <Services />
        <Rolling />
        <Process />
        <Detail />
        <Intro />
        <Featured />
        <Smoke />
        <Standstill />
        <Craft />
        <RoadTest />
        <Departure />
        <Contact />
      </main>
    </>
  )
}
