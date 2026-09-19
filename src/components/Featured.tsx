import { useRef } from 'react'
import { gsap, revealLines, useMotion } from '../lib/motion'
import VideoClip from './VideoClip'
import Line from './Line'

const SPECS = [
  ['Platform', 'Honda NSX'],
  ['Direction', 'Street / Show'],
  ['Body', 'Wide architecture'],
  ['Suspension', 'Air management'],
  ['Wheels', 'Bespoke three-piece'],
  ['Finish', 'Championship White'],
]

export default function Featured() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ q, desktop, root }) => {
    revealLines(q('.featured__title .line__in'), root.querySelector('.featured__title')!)
    revealLines(q('.featured__statement .line__in'), root.querySelector('.featured__statement')!, { stagger: 0.12 })

    q('.spec').forEach((row) => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: row, start: 'top 90%', toggleActions: 'play none none reverse' },
      })
      tl.fromTo(row.querySelector('.spec__rule'), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'expo.inOut' }, 0)
        .fromTo(row.querySelectorAll('dt, dd'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, 0.15)
    })

    q('.frame').forEach((frame) => {
      const clip = frame.querySelector('video')
      gsap.fromTo(
        frame,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'expo.out',
          scrollTrigger: { trigger: frame, start: 'top 85%', toggleActions: 'play none none reverse' } },
      )
      if (desktop && clip) {
        gsap.fromTo(
          clip,
          { yPercent: -6, scale: 1.12 },
          { yPercent: 6, scale: 1.12, ease: 'none',
            scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      }
    })
  })

  return (
    <section ref={root} id="featured" className="featured light" data-nav="light" aria-labelledby="featured-title">
      <div className="wrap">
        <p className="eyebrow">08 / Featured build — concept</p>
        <h2 id="featured-title" className="featured__title display">
          <Line>NSX /</Line>
          <Line>WHITE SILENCE</Line>
        </h2>

        <div className="frame frame--wide">
          <VideoClip name="rear" position="50% 50%" positionMobile="50% 50%" />
        </div>

        <div className="featured__grid">
          <p className="featured__statement">
            <Line>Ikona lat dziewięćdziesiątych</Line>
            <Line>przeprojektowana z myślą</Line>
            <Line>o współczesnej drodze.</Line>
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

        <div className="frame frame--side">
          <VideoClip name="side" position="36% 55%" positionMobile="34% 55%" />
        </div>

        <p className="featured__note">
          Realizacja koncepcyjna na potrzeby strony demonstracyjnej. Powyższe parametry są fikcyjne i nie opisują
          zweryfikowanej specyfikacji prawdziwego samochodu.
        </p>
      </div>
    </section>
  )
}
