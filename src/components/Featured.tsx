import { useRef } from 'react'
import { gsap, revealLines, useMotion } from '../lib/motion'
import VideoClip from './VideoClip'
import Line from './Line'

const SPECS = [
  ['Platform', 'Porsche 911'],
  ['Direction', 'Road / Restomod'],
  ['Body', 'Wide architecture'],
  ['Chassis', 'Bespoke setup'],
  ['Wheels', 'Three-piece forged'],
  ['Finish', 'Deep Black'],
]

/**
 * Film „rear stance” zatrzymuje się na ostatniej klatce (sticky), a jasny panel
 * z danymi projektu wjeżdża na niego od dołu.
 */
export default function Featured() {
  const root = useRef<HTMLDivElement>(null)

  useMotion(root, ({ q }) => {
    const enter = { trigger: '#featured', start: 'top bottom', end: 'top top', scrub: true }
    gsap.fromTo(q('.rear__media'), { scale: 1 }, { scale: 1.04, ease: 'none', scrollTrigger: enter })
    gsap.fromTo(q('.rear__dim'), { opacity: 0 }, { opacity: 0.6, ease: 'none', scrollTrigger: enter })

    revealLines(q('.featured__title .line__in'), q('.featured__title')[0], { start: 'top 85%' })
    gsap.fromTo(
      q('.featured__desc'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.featured__desc', start: 'top 88%', toggleActions: 'play none none reverse' } },
    )
    q('.spec').forEach((row) => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: row, start: 'top 92%', toggleActions: 'play none none reverse' },
      })
      tl.fromTo(row.querySelector('.spec__rule'), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'expo.inOut' }, 0)
        .fromTo(row.querySelectorAll('dt, dd'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, 0.12)
    })
  })

  return (
    <div ref={root} className="stack">
      <section className="film film--compact rear" data-nav="dark" aria-label="Rear stance">
        <div className="film__media rear__media">
          <VideoClip name="rear" threshold={0.5} position="52% 55%" positionMobile="60% 55%" />
        </div>
        <div className="rear__dim" aria-hidden="true" />
      </section>

      <section id="featured" className="featured light" data-nav="light" aria-labelledby="featured-title">
        <div className="wrap">
          <p className="eyebrow">Featured build — concept</p>
          <h2 id="featured-title" className="featured__title display">
            <Line>SPECIFICATION</Line>
          </h2>
          <div className="featured__grid">
            <p className="featured__desc">
              Klasyczna forma podporządkowana współczesnym osiągom. Nisko osadzona sylwetka, precyzyjny fitment i
              mechanika przygotowana do jazdy — nie tylko do oglądania.
            </p>
            <dl className="specs">
              {SPECS.map(([k, v]) => (
                <div className="spec" key={k}>
                  <span className="spec__rule" aria-hidden="true" />
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="featured__note">
            Concept presentation created for the Northline Atelier showcase. Specifications are illustrative.
          </p>
        </div>
      </section>
    </div>
  )
}
