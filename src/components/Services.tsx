import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, revealLines, useMotion } from '../lib/motion'
import Line from './Line'

const SERVICES = [
  { name: 'PERFORMANCE', text: 'Strojenie silnika, układy dolotowe, chłodzenie, wydechy oraz kompletne pakiety mocy.' },
  { name: 'CHASSIS', text: 'Zawieszenie, geometria, hamulce i ustawienie samochodu pod drogę lub tor.' },
  { name: 'RESTOMOD', text: 'Klasyczna forma połączona ze współczesną mechaniką, technologią i jakością wykonania.' },
  { name: 'AERO & BODY', text: 'Karbon, poszerzenia, elementy aerodynamiczne oraz projektowanie proporcji nadwozia.' },
  { name: 'WHEELS & FITMENT', text: 'Indywidualny dobór felg, opon, offsetu i wysokości zawieszenia.' },
  { name: 'INTERIOR', text: 'Kierownice, fotele, tapicerka, klatki oraz kokpity podporządkowane kierowcy.' },
  { name: 'FULL BUILDS', text: 'Kompleksowe realizacje prowadzone od pierwszego szkicu do gotowego samochodu.' },
]

export default function Services() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ q, root }) => {
    revealLines(q('.services__title .line__in'), root.querySelector('.services__title')!)
    q('.service:not(.service--end)').forEach((row) => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: row, start: 'top 90%', toggleActions: 'play none none reverse' },
      })
      tl.fromTo(row.querySelector('.service__rule'), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'expo.inOut' }, 0)
        .fromTo(row.querySelectorAll('.line__in'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out' }, 0.12)
        .fromTo(row.querySelector('.service__text'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.25)
    })
    gsap.fromTo(
      q('.service--end .service__rule'),
      { scaleX: 0 },
      { scaleX: 1, duration: 1.1, ease: 'expo.inOut',
        scrollTrigger: { trigger: '.service--end', start: 'top 98%', toggleActions: 'play none none reverse' } },
    )
  })

  return (
    <section ref={root} id="services" className="services light" data-nav="light" aria-labelledby="services-title">
      <div className="wrap">
        <p className="eyebrow">What we build</p>
        <h2 id="services-title" className="services__title display">
          <Line>WHAT WE</Line>
          <Line>BUILD</Line>
        </h2>
        <ul className="services__list">
          {SERVICES.map((s, i) => (
            <li className="service" key={s.name}>
              <span className="service__rule" aria-hidden="true" />
              <span className="service__no">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="service__name">
                <a href="#contact" aria-label={`${s.name} — zapytaj o realizację`}>
                  <Line>{s.name}</Line>
                </a>
              </h3>
              <p className="service__text">{s.text}</p>
              <ArrowUpRight className="service__icon" aria-hidden="true" strokeWidth={1.25} />
            </li>
          ))}
          <li className="service service--end" aria-hidden="true">
            <span className="service__rule" />
          </li>
        </ul>
      </div>
    </section>
  )
}
