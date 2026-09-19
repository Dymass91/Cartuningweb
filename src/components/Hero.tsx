import { useRef } from 'react'
import { gsap, useMotion } from '../lib/motion'
import { scrollToHash } from '../lib/scroll'
import VideoClip from './VideoClip'
import Line from './Line'

export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ q, root }) => {
    // Krótkie otwarcie, niezależne od ładowania filmu: poster jest widoczny od razu,
    // lekka zasłona opada w ~1 s, a typografia wjeżdża natychmiast.
    const tl = gsap.timeline()
    tl.to(q('.hero__veil'), { opacity: 0, duration: 1.2, ease: 'power2.out' }, 0)
      .fromTo(q('.hero__eyebrow .line__in'), { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: 'expo.out' }, 0.05)
      .fromTo(q('.hero__title .line__in'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 0.1)
      .fromTo(q('.hero__rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.inOut' }, 0.3)
      .fromTo(q('.hero__sub .line__in'), { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: 'expo.out', stagger: 0.08 }, 0.4)
      .fromTo(q('.hero__cue'), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.9)

    const video = root.querySelector('video')
    // Gdy klatka się zatrzyma, a napisy są gotowe — strona sama przewija się do treści.
    // Anuluje się, gdy użytkownik zacznie przewijać sam lub wszedł na adres z kotwicą.
    let videoDone = false
    let textDone = false
    let cancelled = location.hash.length > 1
    let scrollTimer = 0

    // Autoplay zablokowany: pokazujemy końcową klatkę (kadr kompletny) i nie przewijamy strony.
    const stalled = window.setTimeout(() => {
      if (video && video.paused && video.currentTime === 0 && video.readyState >= 2 && video.duration) {
        cancelled = true
        video.currentTime = Math.max(0, video.duration - 0.05)
      }
    }, 2500)
    const maybeScroll = () => {
      if (!videoDone || !textDone || cancelled) return
      scrollTimer = window.setTimeout(() => {
        if (!cancelled && window.scrollY < 10) scrollToHash('#manifest')
      }, 0)
    }
    const cancel = () => {
      cancelled = true
      window.clearTimeout(scrollTimer)
    }
    // przewinięcie rusza na sekundę przed końcem filmu
    const onTime = () => {
      if (videoDone || !video || !video.duration) return
      if (video.currentTime >= video.duration - 1) {
        videoDone = true
        maybeScroll()
      }
    }
    tl.eventCallback('onComplete', () => {
      textDone = true
      maybeScroll()
    })
    video?.addEventListener('timeupdate', onTime)
    const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
    inputs.forEach((e) => window.addEventListener(e, cancel, { passive: true, once: true }))

    return () => {
      window.clearTimeout(stalled)
      window.clearTimeout(scrollTimer)
      tl.kill()
      video?.removeEventListener('timeupdate', onTime)
      inputs.forEach((e) => window.removeEventListener(e, cancel))
    }
  })

  return (
    <section ref={root} id="top" className="hero" data-nav="dark" aria-labelledby="hero-title">
      <VideoClip name="hero" eager threshold={0.1} position="56% 55%" positionMobile="44% 55%" />
      <div className="hero__scrim" />
      <div className="hero__veil" aria-hidden="true" />
      <div className="hero__content">
        <p className="hero__eyebrow eyebrow">
          <Line>NORTHLINE ATELIER</Line>
        </p>
        <h1 id="hero-title" className="hero__title">
          <Line>PERFORMANCE,</Line>
          <Line>REFINED.</Line>
        </h1>
        <span className="hero__rule" aria-hidden="true" />
        <p className="hero__sub">
          <Line>Engineering presence.</Line>
          <Line>Building character.</Line>
        </p>
      </div>
      <a className="hero__cue" href="#manifest">
        <span className="hero__cue-line" aria-hidden="true" />
        Scroll to enter
      </a>
    </section>
  )
}
