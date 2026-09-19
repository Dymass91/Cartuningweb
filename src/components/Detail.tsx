import { useRef } from 'react'
import { gsap, useMotion } from '../lib/motion'
import VideoClip from './VideoClip'
import Line from './Line'

export default function Detail() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ q, root }) => {
    // Film wjeżdża spod ciemnej sekcji procesu — obraz osiada z lekkiego powiększenia.
    gsap.fromTo(
      q('.film__media'),
      { scale: 1.1 },
      { scale: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'top top', scrub: true } },
    )
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: 'top 45%', toggleActions: 'play none none reverse' },
    })
    tl.fromTo(q('.cap__idx'), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0)
      .fromTo(q('.cap__rule'), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'expo.out' }, 0)
      .fromTo(q('.cap__title .line__in'), { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out' }, 0.1)
  })

  return (
    <section ref={root} id="detail" className="film detail" data-nav="dark" aria-labelledby="detail-title">
      <div className="film__media">
        <VideoClip name="fender" threshold={0.6} position="40% 50%" positionMobile="52% 50%" />
      </div>
      <div className="film__shade film__shade--right" />
      {/* tekst po prawej: w tym ujęciu prawa strona kadru to ciemny las i pusta droga */}
      <div className="cap cap--r">
        <span className="cap__idx">04 / DETAIL</span>
        <span className="cap__rule" aria-hidden="true" />
        <h2 id="detail-title" className="cap__title caption-xl">
          <Line>EVERY LINE</Line>
          <Line>HAS A</Line>
          <Line>PURPOSE.</Line>
        </h2>
      </div>
    </section>
  )
}
