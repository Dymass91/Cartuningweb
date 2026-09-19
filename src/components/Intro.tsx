import { useRef } from 'react'
import { gsap, useMotion } from '../lib/motion'
import Line from './Line'

const PARAMS = ['ROAD / RESTOMOD', 'DEEP BLACK', 'NORTHLINE ATELIER']

/** Jasny rozdział między klipami 04 i 05: przedstawia prezentowany projekt. */
export default function Intro() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ q, root }) => {
    // linie konstrukcyjne rysują się z przewijaniem — główny motyw ruchu tej sekcji
    gsap.fromTo(
      q('.intro__grid i'),
      { scaleY: 0 },
      { scaleY: 1, ease: 'none', stagger: 0.08,
        scrollTrigger: { trigger: root, start: 'top 85%', end: 'bottom 60%', scrub: 0.6 } },
    )
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: 'top 62%', toggleActions: 'play none none reverse' },
    })
    tl.fromTo(q('.intro__rule'), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'expo.inOut' }, 0)
      .fromTo(q('.intro__label .line__in'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out' }, 0.05)
      .fromTo(q('.intro__title .line__in'), { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09 }, 0.15)
      .fromTo(q('.intro__sub .line__in'), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.09 }, 0.5)
      .fromTo(q('.intro__params li'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }, 0.7)
  })

  return (
    <section ref={root} id="project" className="intro light" data-nav="light" aria-labelledby="intro-title">
      <div className="intro__grid" aria-hidden="true">
        <i /><i /><i /><i />
      </div>
      <div className="wrap intro__inner">
        <div className="intro__head">
          <span className="intro__rule" aria-hidden="true" />
          <p className="eyebrow intro__label">
            <Line>PROJECT 001</Line>
          </p>
        </div>
        <h2 id="intro-title" className="intro__title display">
          <Line>911 /</Line>
          <Line>FOREST SPEC</Line>
        </h2>
        <div className="intro__foot">
          <p className="intro__sub">
            <Line>A familiar silhouette,</Line>
            <Line>rewritten with intent.</Line>
          </p>
          <ul className="intro__params">
            {PARAMS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
