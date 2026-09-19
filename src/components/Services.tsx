import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, revealLines, useMotion } from '../lib/motion'
import Line from './Line'

const SERVICES = [
  { name: 'PERFORMANCE', text: 'Strojenie ECU, układy dolotowe, chłodzenie, wydechy i kompletne pakiety mocy.' },
  { name: 'SUSPENSION', text: 'Zawieszenia gwintowane, pneumatyka, geometria i indywidualne ustawienie samochodu.' },
  { name: 'AERO & BODY', text: 'Bodykity, dokładki, elementy karbonowe, poszerzenia i projektowanie proporcji nadwozia.' },
  { name: 'WHEELS & FITMENT', text: 'Dobór felg, offsetu, opon oraz ustawienie idealnego spasowania.' },
  { name: 'INTERIOR', text: 'Kierownice, tapicerka, detale, multimedia i wnętrza budowane pod właściciela.' },
  { name: 'FULL BUILDS', text: 'Kompleksowe projekty od pierwszego szkicu do gotowego samochodu.' },
]

export default function Services() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ q, root }) => {
    revealLines(q('.services__title .line__in'), root.querySelector('.services__title')!)
    q('.service:not(.service--end)').forEach((row) => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: row, start: 'top 88%', toggleActions: 'play none none reverse' },
      })
      tl.fromTo(row.querySelector('.service__rule'), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'expo.inOut' }, 0)
        .fromTo(row.querySelectorAll('.line__in'), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, 0.15)
        .fromTo(row.querySelector('.service__text'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.3)
    })
    gsap.fromTo(
      q('.service--end .service__rule'),
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2, ease: 'expo.inOut',
        scrollTrigger: { trigger: '.service--end', start: 'top 95%', toggleActions: 'play none none reverse' } },
    )
  })

  return (
    <section ref={root} id="services" className="services light" data-nav="light" aria-labelledby="services-title">
      <div className="wrap">
        <p className="eyebrow">04 / Services</p>
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
