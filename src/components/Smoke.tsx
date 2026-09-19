import { useRef } from 'react'
import { gsap, useMotion } from '../lib/motion'
import VideoClip from './VideoClip'
import Line from './Line'

export default function Smoke() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ q, desktop, root }) => {
    const words = q('.smoke__title .line__in')
    if (desktop) {
      // krótki pin: słowa wchodzą jedno po drugim, film gra naturalnie
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root, start: 'top top', end: '+=25%', scrub: 0.7, pin: true, anticipatePin: 1 },
      })
        .fromTo(q('.film__media'), { scale: 1 }, { scale: 1.04, duration: 1 }, 0)
        .fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: 0.22, stagger: 0.2, ease: 'power2.out' }, 0.05)
        .fromTo(q('.cap__rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0.1)
    } else {
      gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 60%', toggleActions: 'play none none reverse' } })
        .fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.14, ease: 'expo.out' }, 0)
        .fromTo(q('.cap__rule'), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'expo.out' }, 0.1)
    }
  })

  return (
    <section ref={root} id="force" className="film film--compact smoke" data-nav="dark" aria-labelledby="smoke-title">
      <div className="film__media">
        <VideoClip name="smoke" threshold={0.6} position="50% 60%" positionMobile="50% 60%" />
      </div>
      <div className="film__shade film__shade--top" />
      <div className="cap cap--tl">
        <h2 id="smoke-title" className="smoke__title caption-xl">
          <Line>FORM.</Line>
          <Line>FORCE.</Line>
          <Line>FUNCTION.</Line>
        </h2>
        <span className="cap__rule" aria-hidden="true" />
      </div>
    </section>
  )
}
