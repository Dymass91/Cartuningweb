import { useRef } from 'react'
import { gsap, useMotion } from '../lib/motion'
import Line from './Line'

const PRINCIPLES = ['Measured precisely.', 'Built deliberately.', 'Driven properly.']

/** Ciemny separator po klipie 06 — bez wideo, hasła pojawiają się kolejno wraz ze scrollem. */
export default function Standstill() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ q, root }) => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: root, start: 'top 78%', end: 'bottom 62%', scrub: 0.6 },
    })
    tl.fromTo(q('.standstill__title .line__in'), { yPercent: 110 }, { yPercent: 0, duration: 0.3, stagger: 0.1, ease: 'power2.out' }, 0)
    q('.standstill__item').forEach((item, i) => {
      const at = 0.3 + i * 0.2
      tl.fromTo(item.querySelector('.standstill__rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.2 }, at)
        .fromTo(item.querySelector('.standstill__no'), { opacity: 0 }, { opacity: 1, duration: 0.15 }, at + 0.05)
        .fromTo(item.querySelector('.line__in'), { yPercent: 110 }, { yPercent: 0, duration: 0.2, ease: 'power2.out' }, at + 0.05)
    })
  })

  return (
    <section ref={root} id="standstill" className="standstill" data-nav="dark" aria-labelledby="standstill-title">
      <div className="wrap standstill__inner">
        <h2 id="standstill-title" className="standstill__title display">
          <Line>NOT BUILT</Line>
          <Line>TO STAND STILL.</Line>
        </h2>
        <ul className="standstill__list">
          {PRINCIPLES.map((p, i) => (
            <li className="standstill__item" key={p}>
              <span className="standstill__rule" aria-hidden="true" />
              <span className="standstill__no">{String(i + 1).padStart(2, '0')}</span>
              <p className="standstill__text">
                <Line>{p}</Line>
              </p>
            </li>
          ))}
          <li className="standstill__item standstill__item--end" aria-hidden="true">
            <span className="standstill__rule" />
          </li>
        </ul>
      </div>
    </section>
  )
}
