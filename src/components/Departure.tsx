import { useRef } from 'react'
import { gsap, useMotion } from '../lib/motion'
import VideoClip from './VideoClip'
import Line from './Line'

export default function Departure() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ q, desktop, root }) => {
    const lines = q('.departure__title .line__in')
    const black = q('.departure__black')

    if (desktop) {
      // Tekst wyłania się, gdy samochód się oddala; potem ekran przechodzi w czerń.
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root, start: 'top top', end: '+=180%', scrub: 0.8, pin: true, anticipatePin: 1 },
      })
        .fromTo(q('.film__media'), { scale: 1 }, { scale: 1.06, duration: 1 }, 0)
        .fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 0.22, stagger: 0.14, ease: 'power2.out' }, 0.08)
        .fromTo(q('.departure__rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out' }, 0.2)
        .fromTo(black, { opacity: 0 }, { opacity: 1, duration: 0.28 }, 0.72)
    } else {
      gsap.fromTo(
        lines,
        { yPercent: 110 },
        { yPercent: 0, duration: 1.2, stagger: 0.15, ease: 'expo.out', delay: 0.8,
          scrollTrigger: { trigger: root, start: 'top 40%', toggleActions: 'play none none reverse' } },
      )
      gsap.fromTo(
        q('.departure__rule'),
        { scaleX: 0 },
        { scaleX: 1, duration: 1.4, ease: 'expo.out', delay: 1,
          scrollTrigger: { trigger: root, start: 'top 40%', toggleActions: 'play none none reverse' } },
      )
      gsap.fromTo(
        black,
        { opacity: 0 },
        { opacity: 1, ease: 'none',
          scrollTrigger: { trigger: root, start: 'bottom 85%', end: 'bottom 15%', scrub: true } },
      )
    }
  })

  return (
    <section ref={root} id="departure" className="film departure" data-nav="dark" aria-label="Departure">
      <div className="film__media">
        <VideoClip name="departure" threshold={0.9} position="50% 50%" positionMobile="50% 50%" />
      </div>
      <div className="film__shade" />
      <div className="departure__type">
        <h2 className="departure__title caption-xl">
          <Line>BUILT TO BE</Line>
          <Line>REMEMBERED.</Line>
        </h2>
        <span className="departure__rule" aria-hidden="true" />
      </div>
      <div className="departure__black" aria-hidden="true" />
    </section>
  )
}
