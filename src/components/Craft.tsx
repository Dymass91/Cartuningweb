import { useRef } from 'react'
import { gsap, useMotion } from '../lib/motion'
import VideoClip from './VideoClip'
import Line from './Line'

const PRINCIPLES = ['Measured precisely.', 'Built deliberately.', 'Driven properly.']

/**
 * Klip 07 jako editorial media block na jasnym tle: kinowa ramka z marginesami,
 * nagłówek nad nią, hasła w kolumnie obok — nic nie leży na samochodzie.
 */
export default function Craft() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ q, desktop, root }) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: 'top 65%', toggleActions: 'play none none reverse' },
    })
    tl.fromTo(q('.craft__idx'), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0)
      .fromTo(q('.craft__title .line__in'), { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out' }, 0.05)
      .fromTo(q('.craft__frame'), { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'expo.out' }, 0.2)

    q('.principle').forEach((item, i) => {
      gsap.timeline({ scrollTrigger: { trigger: '.craft__list', start: 'top 90%', toggleActions: 'play none none reverse' } })
        .fromTo(item.querySelector('.principle__rule'), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'expo.inOut' }, i * 0.12)
        .fromTo(item.querySelectorAll('.line__in'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out' }, 0.15 + i * 0.12)
    })

    // delikatny parallax obrazu wewnątrz ramki
    if (desktop) {
      gsap.fromTo(
        q('.craft__frame video'),
        { yPercent: -3, scale: 1.08 },
        { yPercent: 3, scale: 1.08, ease: 'none',
          scrollTrigger: { trigger: '.craft__frame', start: 'top bottom', end: 'bottom top', scrub: true } },
      )
    }
  })

  return (
    <section ref={root} id="craft" className="craft light" data-nav="light" aria-labelledby="craft-title">
      <div className="wrap craft__inner">
        <header className="craft__head">
          <p className="eyebrow craft__idx">07 / CRAFT</p>
          <h2 id="craft-title" className="craft__title display">
            <Line>CRAFTED</Line>
            <Line>AT SPEED.</Line>
          </h2>
        </header>
        <div className="craft__body">
          <ul className="craft__list">
            {PRINCIPLES.map((p, i) => (
              <li className="principle" key={p}>
                <span className="principle__rule" aria-hidden="true" />
                <span className="principle__no">{String(i + 1).padStart(2, '0')}</span>
                <p className="principle__text">
                  <Line>{p}</Line>
                </p>
              </li>
            ))}
          </ul>
          <div className="craft__frame">
            <VideoClip name="side" threshold={0.5} position="55% 50%" positionMobile="55% 50%" />
          </div>
        </div>
      </div>
    </section>
  )
}
