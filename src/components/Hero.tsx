import { useRef } from 'react'
import { gsap, useMotion } from '../lib/motion'
import { scrollToHash } from '../lib/scroll'
import VideoClip from './VideoClip'
import Line from './Line'

export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ q, root }) => {
    const tl = gsap.timeline({ paused: true })
    tl.to(q('.hero__veil'), { opacity: 0, duration: 1.6, ease: 'power2.inOut' }, 0.1)
      .fromTo(q('.hero__flash'), { opacity: 0 }, { opacity: 0.32, duration: 0.22, ease: 'power2.out' }, 0.25)
      .to(q('.hero__flash'), { opacity: 0, duration: 1.1, ease: 'power2.inOut' }, 0.47)
      .fromTo(q('.hero__eyebrow .line__in'), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, 0.55)
      .fromTo(q('.hero__title .line__in'), { yPercent: 110 }, { yPercent: 0, duration: 1.25, ease: 'expo.out', stagger: 0.12 }, 0.7)
      .fromTo(q('.hero__rule'), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'expo.inOut' }, 0.9)
      .fromTo(q('.hero__lede'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 1.25)
      .fromTo(q('.hero__cue'), { opacity: 0 }, { opacity: 1, duration: 1 }, 1.9)

    // Sekwencja rusza razem z filmem (lub po krótkim czasie, gdy autoplay jest wstrzymany).
    const video = root.querySelector('video')
    let started = false
    const go = () => {
      if (started) return
      started = true
      tl.play()
    }
    video?.addEventListener('playing', go, { once: true })
    const timer = window.setTimeout(go, 1600)

    // Gdy klatka się zatrzyma, a napisy są gotowe — strona sama przewija się do treści.
    // Anuluje się, jeśli użytkownik zacznie przewijać samodzielnie.
    let videoDone = false
    let textDone = false
    let cancelled = false
    let scrollTimer = 0
    const maybeScroll = () => {
      if (!videoDone || !textDone || cancelled) return
      scrollTimer = window.setTimeout(() => {
        if (!cancelled && window.scrollY < 10) scrollToHash('#manifest')
      }, 700)
    }
    const cancel = () => {
      cancelled = true
      window.clearTimeout(scrollTimer)
    }
    const onVideoEnd = () => {
      videoDone = true
      maybeScroll()
    }
    tl.eventCallback('onComplete', () => {
      textDone = true
      maybeScroll()
    })
    video?.addEventListener('ended', onVideoEnd, { once: true })
    const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
    inputs.forEach((e) => window.addEventListener(e, cancel, { passive: true, once: true }))

    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(scrollTimer)
      video?.removeEventListener('playing', go)
      video?.removeEventListener('ended', onVideoEnd)
      inputs.forEach((e) => window.removeEventListener(e, cancel))
    }
  })

  return (
    <section ref={root} id="top" className="hero" data-nav="dark" aria-labelledby="hero-title">
      <VideoClip name="hero" eager rate={0.85} threshold={0.1} position="30% 55%" positionMobile="28% 55%" />
      <div className="hero__scrim" />
      <div className="hero__flash" aria-hidden="true" />
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
        <p className="hero__lede">Budujemy samochody, których nie da się pomylić z żadnymi innymi.</p>
      </div>
      <a className="hero__cue" href="#manifest">
        <span className="hero__cue-line" aria-hidden="true" />
        Scroll to enter
      </a>
    </section>
  )
}
