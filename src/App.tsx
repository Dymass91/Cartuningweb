import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './lib/motion'
import { reducedMotion } from './lib/env'
import { scrollToHash, setLenis } from './lib/scroll'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Manifest from './components/Manifest'
import Stance from './components/Stance'
import Services from './components/Services'
import Arrival from './components/Arrival'
import Process from './components/Process'
import Inside from './components/Inside'
import Featured from './components/Featured'
import Departure from './components/Departure'
import Contact from './components/Contact'

export default function App() {
  useEffect(() => {
    // Wszystkie ScrollTriggery dzieci są już utworzone (efekty dzieci biegną przed rodzicem).
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
      const hash = a.getAttribute('href')!
      if (hash.length < 2) return
      e.preventDefault()
      scrollToHash(hash)
      history.replaceState(null, '', hash)
    }
    document.addEventListener('click', onClick)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    refresh()

    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('load', refresh)
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
        <Stance />
        <Services />
        <Arrival />
        <Process />
        <Inside />
        <Featured />
        <Departure />
        <Contact />
      </main>
    </>
  )
}
