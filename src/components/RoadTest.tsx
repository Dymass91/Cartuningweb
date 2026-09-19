import { useRef } from 'react'
import { gsap, useMotion } from '../lib/motion'
import Line from './Line'

/**
 * Ciemny rozdział przed finałem: tekst wchodzi, a pod koniec przygasa. Czerń sekcji
 * przechodzi w czerń zasłony finałowego filmu (Departure), który spod niej się odsłania.
 */
export default function RoadTest() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ q, root }) => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: root, start: 'top 75%', end: 'bottom 40%', scrub: 0.6 },
    })
    tl.fromTo(q('.roadtest__title .line__in'), { yPercent: 110 }, { yPercent: 0, duration: 0.3, stagger: 0.12, ease: 'power2.out' }, 0)
      .fromTo(q('.roadtest__rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out' }, 0.05)
      .fromTo(q('.roadtest__idx'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.1)
      // pod koniec scrollowania tekst przygasa
      .to(q('.roadtest__inner'), { opacity: 0.08, duration: 0.3 }, 0.72)
  })

  return (
    <section ref={root} id="roadtest" className="roadtest" data-nav="dark" aria-labelledby="roadtest-title">
      <div className="wrap roadtest__inner">
        <div className="roadtest__meta">
          <span className="roadtest__rule" aria-hidden="true" />
          <span className="roadtest__idx">08 / DEPARTURE</span>
        </div>
        <h2 id="roadtest-title" className="roadtest__title display">
          <Line>THE ROAD IS</Line>
          <Line>THE FINAL TEST.</Line>
        </h2>
      </div>
    </section>
  )
}
