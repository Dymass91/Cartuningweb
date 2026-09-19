import { useRef } from 'react'
import { gsap, useMotion } from '../lib/motion'
import { reducedMotion } from '../lib/env'
import VideoClip, { playExclusive } from './VideoClip'
import Line from './Line'

export default function Rolling() {
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  useMotion(root, ({ q, desktop, root }) => {
    const v = video.current
    // Film startuje dopiero, gdy jasna maska jest już częściowo rozsunięta.
    const sync = (progress: number, openAt: number) => {
      root.dataset.nav = progress > openAt ? 'dark' : 'light'
      if (!v) return
      if (progress > openAt) {
        if (v.paused && !v.ended) void playExclusive(v)
      } else if (progress < 0.02 && (v.currentTime > 0 || !v.paused)) {
        v.pause()
        v.currentTime = 0
      }
    }

    const mask = q('.rolling__mask')
    const words = q('.cap__title .line__in')

    if (desktop) {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root, start: 'top top', end: '+=50%', scrub: 0.8, pin: true, anticipatePin: 1,
          onUpdate: (self) => sync(self.progress, 0.14),
        },
      })
      tl.fromTo(mask, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 50% 0% 50%)', duration: 0.4 }, 0)
        .fromTo(q('.rolling__mask-label'), { opacity: 1 }, { opacity: 0, duration: 0.15 }, 0)
        .fromTo(q('.film__media'), { scale: 1.08 }, { scale: 1, duration: 1 }, 0)
        .fromTo(q('.cap__idx'), { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.42)
        .fromTo(q('.cap__rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: 'power2.out' }, 0.42)
        .fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: 0.2, stagger: 0.12, ease: 'power2.out' }, 0.45)
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

  // bez ruchu nie ma jasnej maski — nawigacja od początku jasna
  const initialNav = reducedMotion() ? 'dark' : 'light'

  return (
    <section ref={root} id="performance" className="film rolling" data-nav={initialNav} aria-labelledby="rolling-title">
      <div className="film__media">
        <VideoClip ref={video} name="rolling" manual position="50% 55%" positionMobile="49% 55%" />
      </div>
      <div className="film__shade film__shade--bottom" />
      <div className="cap cap--bl">
        <span className="cap__idx">03 / PERFORMANCE</span>
        <span className="cap__rule" aria-hidden="true" />
        <h2 id="rolling-title" className="cap__title caption-xl">
          <Line>MOTION,</Line>
          <Line>WITH INTENT.</Line>
        </h2>
      </div>
      <div className="rolling__mask" aria-hidden="true">
        <span className="rolling__mask-label">03 / PERFORMANCE</span>
      </div>
    </section>
  )
}
