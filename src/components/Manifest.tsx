import { useRef } from 'react'
import { gsap, revealLines, useMotion } from '../lib/motion'
import Line from './Line'

const PILLARS = [
  { n: 1, label: 'Direction' },
  { n: 2, label: 'Engineering' },
  { n: 3, label: 'Execution' },
]

export default function Manifest() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ q, root }) => {
    revealLines(q('.manifest__title .line__in'), root.querySelector('.manifest__title')!, { stagger: 0.08 })
    gsap.fromTo(
      q('.manifest__lede'),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.manifest__lede', start: 'top 88%', toggleActions: 'play none none reverse' } },
    )
    // linie konstrukcyjne rysują się wraz z przewijaniem
    gsap.fromTo(
      q('.manifest__grid i'),
      { scaleY: 0 },
      { scaleY: 1, ease: 'none', stagger: 0.08,
        scrollTrigger: { trigger: root, start: 'top 60%', end: 'bottom 70%', scrub: 0.6 } },
    )
    gsap.fromTo(
      q('.manifest__pillar-rule'),
      { scaleX: 0 },
      { scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: '.manifest__pillars', start: 'top 92%', end: 'top 60%', scrub: 0.6 } },
    )
    q('.manifest__num').forEach((el) => {
      const target = Number(el.dataset.n)
      const counter = { v: 0 }
      gsap.to(counter, {
        v: target, duration: 1.2, ease: 'power2.out',
        onUpdate: () => { el.textContent = String(Math.round(counter.v)).padStart(2, '0') },
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
      })
    })
    gsap.fromTo(
      q('.manifest__pillar'),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: '.manifest__pillars', start: 'top 90%', toggleActions: 'play none none reverse' } },
    )
  })

  return (
    <section ref={root} id="manifest" className="manifest light" data-nav="light" aria-labelledby="manifest-title">
      <div className="manifest__grid" aria-hidden="true">
        <i /><i /><i /><i />
      </div>
      <div className="wrap">
        <p className="eyebrow">Manifest</p>
        <h2 id="manifest-title" className="manifest__title display">
          <span className="manifest__lead">
            <Line>Nie budujemy</Line>
            <Line>samochodów</Line>
            <Line>dla wszystkich.</Line>
          </span>
          <span className="manifest__second">
            <Line>Budujemy je dla tych,</Line>
            <Line>którzy zauważają różnicę.</Line>
          </span>
        </h2>
        <p className="manifest__lede">
          Northline Atelier to niezależne studio projektowania, modyfikacji i budowy samochodów performance. Łączymy
          mechanikę, proporcje i detal w jeden konsekwentny projekt — od pierwszej koncepcji do ostatniej śruby.
        </p>
        <ol className="manifest__pillars">
          {PILLARS.map((p) => (
            <li className="manifest__pillar" key={p.n}>
              <span className="manifest__pillar-rule" aria-hidden="true" />
              <span className="manifest__num" data-n={p.n}>{String(p.n).padStart(2, '0')}</span>
              <span className="manifest__label">{p.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
