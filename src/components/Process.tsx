import { useRef } from 'react'
import { gsap, revealLines, useMotion } from '../lib/motion'
import Line from './Line'

const STEPS = [
  { n: '01', name: 'DISCOVERY', text: 'Poznajemy samochód, właściciela i kierunek projektu.' },
  { n: '02', name: 'DESIGN', text: 'Budujemy moodboard, dobieramy części i projektujemy proporcje.' },
  { n: '03', name: 'BUILD', text: 'Montaż, dopasowanie, strojenie i kontrola każdego detalu.' },
  { n: '04', name: 'DELIVERY', text: 'Ostatnia inspekcja, sesja zdjęciowa i przekazanie gotowego auta.' },
]

export default function Process() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ q, root }) => {
    revealLines(q('.process__title .line__in'), root.querySelector('.process__title')!)

    // pionowa linia postępu przechodzi przez kolejne etapy
    gsap.fromTo(
      q('.process__fill'),
      { scaleY: 0 },
      { scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.process__steps', start: 'top 55%', end: 'bottom 55%', scrub: 0.5 } },
    )
    q('.step').forEach((step) => {
      gsap.to(step, {
        scrollTrigger: {
          trigger: step, start: 'top 58%', end: 'max',
          toggleClass: { targets: step, className: 'is-active' },
        },
      })
    })
  })

  return (
    <section ref={root} id="process" className="process dark" data-nav="dark" aria-labelledby="process-title">
      <div className="process__inner wrap">
        <header className="process__head">
          <p className="eyebrow">06 / Process</p>
          <h2 id="process-title" className="process__title display">
            <Line>BUILT WITH</Line>
            <Line>INTENT</Line>
          </h2>
        </header>
        <ol className="process__steps">
          <span className="process__track" aria-hidden="true">
            <i className="process__fill" />
          </span>
          {STEPS.map((s) => (
            <li className="step" key={s.n}>
              <span className="step__dot" aria-hidden="true" />
              <span className="step__no">{s.n} /</span>
              <h3 className="step__name">{s.name}</h3>
              <p className="step__text">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
