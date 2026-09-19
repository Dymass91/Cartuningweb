import { useRef } from 'react'
import { gsap, useMotion } from '../lib/motion'
import VideoClip from './VideoClip'
import Line from './Line'

export default function Inside() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ q, desktop, root }) => {
    // Wejście do auta: poprzednia treść powiększa się i rozmywa, film przejmuje ekran.
    const prev = document.querySelector<HTMLElement>('#process .process__inner')
    const entry = { trigger: root, start: 'top bottom', end: 'top top', scrub: true }
    if (prev) {
      gsap.fromTo(
        prev,
        { scale: 1, opacity: 1, filter: 'blur(0px)', transformOrigin: '50% 100%' },
        { scale: 1.14, opacity: 0.2, filter: desktop ? 'blur(8px)' : 'blur(0px)', ease: 'none', scrollTrigger: entry },
      )
    }
    gsap.fromTo(q('.film__media'), { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: entry })

    const words = q('.inside__title .line__in')
    if (desktop) {
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root, start: 'top top', end: '+=130%', scrub: 0.8, pin: true, anticipatePin: 1 },
      })
        .fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: 0.2, stagger: 0.1, ease: 'power2.out' }, 0.1)
        .fromTo(q('.inside__rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out' }, 0.1)
        .fromTo(q('.film__media'), { scale: 1 }, { scale: 1.05, duration: 1 }, 0)
    } else {
      gsap.fromTo(
        words,
        { yPercent: 110 },
        { yPercent: 0, duration: 1, stagger: 0.1, ease: 'expo.out',
          scrollTrigger: { trigger: root, start: 'top 35%', toggleActions: 'play none none reverse' } },
      )
      gsap.fromTo(
        q('.inside__rule'),
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: root, start: 'top 35%', toggleActions: 'play none none reverse' } },
      )
    }
  })

  return (
    <section ref={root} id="inside" className="film inside" data-nav="dark" aria-label="Inside the machine">
      <div className="film__media">
        <VideoClip name="inside" rate={0.8} threshold={0.9} position="50% 50%" positionMobile="48% 50%" />
      </div>
      <div className="film__shade" />
      <div className="inside__type">
        <span className="inside__idx">07 / INSIDE THE MACHINE</span>
        <span className="inside__rule" aria-hidden="true" />
        <h2 className="inside__title caption-xl">
          <Line>CRAFTED AROUND</Line>
          <Line>THE DRIVER</Line>
        </h2>
      </div>
    </section>
  )
}
