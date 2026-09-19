import { useRef } from 'react'
import { gsap, useMotion } from '../lib/motion'
import VideoClip from './VideoClip'

export default function Stance() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ q, desktop, root }) => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: desktop
        ? { trigger: root, start: 'top top', end: '+=130%', scrub: 0.8, pin: true, anticipatePin: 1 }
        : { trigger: root, start: 'top 70%', toggleActions: 'play none none reverse' },
    })
    if (desktop) {
      // jeden motyw: powolny najazd + odsłonięcie podpisu
      tl.fromTo(q('.film__media'), { scale: 1 }, { scale: 1.08, duration: 1 }, 0)
        .fromTo(q('.stance__cap .line__in'), { yPercent: 110 }, { yPercent: 0, duration: 0.25, ease: 'power2.out' }, 0.12)
        .fromTo(q('.stance__rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out' }, 0.12)
        .fromTo(q('.stance__idx'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.25)
    } else {
      tl.fromTo(q('.stance__cap .line__in'), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, 0)
        .fromTo(q('.stance__rule'), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'expo.out' }, 0)
        .fromTo(q('.stance__idx'), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.3)
    }
  })

  return (
    <section ref={root} id="work" className="film stance" data-nav="dark" aria-label="Stance">
      <div className="film__media">
        <VideoClip name="stance" rate={0.75} threshold={0.6} position="55% 50%" positionMobile="56% 50%" />
      </div>
      <div className="film__shade" />
      <div className="stance__type">
        <span className="stance__idx">03 / STANCE</span>
        <span className="stance__rule" aria-hidden="true" />
        <p className="stance__cap caption">
          <span className="line"><span className="line__in">FORM FOLLOWS FORCE</span></span>
        </p>
      </div>
    </section>
  )
}
