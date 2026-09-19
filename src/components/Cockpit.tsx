import { useRef } from 'react'
import { gsap, useMotion } from '../lib/motion'
import VideoClip from './VideoClip'
import Line from './Line'

export default function Cockpit() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ q, desktop, root }) => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: desktop
        ? { trigger: root, start: 'top top', end: '+=25%', scrub: 0.8, pin: true, anticipatePin: 1 }
        : { trigger: root, start: 'top 65%', toggleActions: 'play none none reverse' },
    })
    if (desktop) {
      // jeden motyw: powolny najazd na kokpit + odsłonięcie typografii
      tl.fromTo(q('.film__media'), { scale: 1 }, { scale: 1.06, duration: 1 }, 0)
        .fromTo(q('.cap__title .line__in'), { yPercent: 110 }, { yPercent: 0, duration: 0.3, stagger: 0.1, ease: 'power2.out' }, 0.05)
        .fromTo(q('.cap__rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out' }, 0.05)
        .fromTo(q('.cap__idx'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.15)
    } else {
      tl.fromTo(q('.cap__title .line__in'), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.1, ease: 'expo.out' }, 0)
        .fromTo(q('.cap__rule'), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'expo.out' }, 0)
        .fromTo(q('.cap__idx'), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.3)
    }
  })

  return (
    <section ref={root} id="control" className="film cockpit" data-nav="dark" aria-labelledby="cockpit-title">
      <div className="film__media">
        <VideoClip name="cockpit" threshold={0.6} position="60% 50%" positionMobile="56% 50%" />
      </div>
      <div className="film__shade film__shade--bottom" />
      <div className="cap cap--bl">
        <span className="cap__idx">02 / CONTROL</span>
        <span className="cap__rule" aria-hidden="true" />
        <h2 id="cockpit-title" className="cap__title caption-xl">
          <Line>BUILT FROM THE</Line>
          <Line>DRIVER OUT.</Line>
        </h2>
      </div>
    </section>
  )
}
