import { useRef } from 'react'
import { gsap, useMotion } from '../lib/motion'
import { reducedMotion } from '../lib/env'
import VideoClip from './VideoClip'
import Line from './Line'

export default function Arrival() {
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  useMotion(root, ({ q, desktop, root }) => {
    const v = video.current
    // Film startuje dopiero, gdy jasna maska jest już w połowie rozsunięta.
    const sync = (progress: number, openAt: number) => {
      root.dataset.nav = progress > openAt ? 'dark' : 'light'
      if (!v) return
      if (progress > openAt) {
        if (v.paused && !v.ended) v.play().catch(() => undefined)
      } else if (progress < 0.02 && (v.currentTime > 0 || !v.paused)) {
        v.pause()
        v.currentTime = 0
      }
    }

    const mask = q('.arrival__mask')
    const words = q('.arrival__title .line__in')

    if (desktop) {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root, start: 'top top', end: '+=170%', scrub: 0.8, pin: true, anticipatePin: 1,
          onUpdate: (self) => sync(self.progress, 0.14),
        },
      })
      tl.fromTo(mask, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 50% 0% 50%)', duration: 0.34 }, 0)
        .fromTo(q('.arrival__mask-label'), { opacity: 1 }, { opacity: 0, duration: 0.12 }, 0)
        .fromTo(q('.arrival__media'), { scale: 1.12 }, { scale: 1, duration: 1 }, 0)
        .fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: 0.14, stagger: 0.1, ease: 'power2.out' }, 0.45)
    } else {
      gsap.fromTo(
        mask,
        { clipPath: 'inset(0% 0% 0% 0%)' },
        { clipPath: 'inset(0% 50% 0% 50%)', ease: 'none',
          scrollTrigger: {
            trigger: root, start: 'top 80%', end: 'top 5%', scrub: 0.5,
            onUpdate: (self) => sync(self.progress, 0.55),
          } },
      )
      gsap.fromTo(
        words,
        { yPercent: 110 },
        { yPercent: 0, duration: 1, stagger: 0.12, ease: 'expo.out',
          scrollTrigger: { trigger: root, start: 'top 25%', toggleActions: 'play none none reverse' } },
      )
    }
    return () => {
      root.dataset.nav = 'light'
    }
  })

  // bez ruchu nie ma jasnej maski — nawigacja od początku biała
  const initialNav = reducedMotion() ? 'dark' : 'light'

  return (
    <section ref={root} id="arrival" className="film arrival" data-nav={initialNav} aria-label="Arrival">
      <div className="film__media arrival__media">
        <VideoClip ref={video} name="arrival" manual position="60% 55%" positionMobile="62% 55%" />
      </div>
      <div className="film__shade" />
      <h2 className="arrival__title caption-xl">
        <Line>LOWER.</Line>
        <Line>WIDER.</Line>
        <Line>SHARPER.</Line>
      </h2>
      <div className="arrival__mask" aria-hidden="true">
        <span className="arrival__mask-label">05 / Arrival</span>
      </div>
    </section>
  )
}
