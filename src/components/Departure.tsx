import { useRef } from 'react'
import { gsap, useMotion } from '../lib/motion'
import VideoClip from './VideoClip'
import Line from './Line'

export default function Departure() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ q, desktop, root }) => {
    const video = root.querySelector('video')
    const black = q('.departure__black')
    const veil = q('.departure__veil')

    // Napis wyłania się, gdy samochód jest już daleko (czas filmu) albo gdy użytkownik
    // przewinie sekcję — co nastąpi pierwsze. Film gra w swoim tempie, bez przyspieszania.
    const text = gsap.timeline({ paused: true })
      .fromTo(q('.departure__title .line__in'), { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.16, ease: 'expo.out' }, 0)
      .fromTo(q('.departure__rule'), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'expo.out' }, 0.3)
    let progress = 0
    const sync = () => {
      const want = progress > 0.3 || (video?.currentTime ?? 0) > 5
      if (want) text.play()
      else text.reverse()
    }
    video?.addEventListener('timeupdate', sync)

    // czerń poprzedniego rozdziału (RoadTest) płynnie odsłania film
    gsap.fromTo(
      veil,
      { opacity: 1 },
      { opacity: 0, ease: 'none',
        scrollTrigger: { trigger: root, start: 'top 95%', end: 'top 25%', scrub: true } },
    )

    if (desktop) {
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root, start: 'top top', end: '+=40%', scrub: 0.8, pin: true, anticipatePin: 1,
          onUpdate: (self) => { progress = self.progress; sync() },
        },
      })
        .fromTo(q('.film__media'), { scale: 1 }, { scale: 1.05, duration: 1 }, 0)
        .fromTo(black, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.7)
    } else {
      gsap.to(root, {
        scrollTrigger: {
          trigger: root, start: 'top 45%', end: 'bottom 60%',
          onUpdate: (self) => { progress = self.progress; sync() },
        },
      })
      gsap.fromTo(
        black,
        { opacity: 0 },
        { opacity: 1, ease: 'none',
          scrollTrigger: { trigger: root, start: 'bottom 85%', end: 'bottom 15%', scrub: true } },
      )
    }
    return () => video?.removeEventListener('timeupdate', sync)
  })

  return (
    <section ref={root} id="departure" className="film departure" data-nav="dark" aria-labelledby="departure-title">
      <div className="film__media">
        <VideoClip name="departure" threshold={0.9} position="52% 50%" positionMobile="52% 50%" />
      </div>
      <div className="film__shade film__shade--top" />
      <div className="cap cap--tl">
        <h2 id="departure-title" className="departure__title caption-xl">
          <Line>BUILT TO BE</Line>
          <Line>REMEMBERED.</Line>
        </h2>
        <span className="departure__rule" aria-hidden="true" />
      </div>
      <div className="departure__veil" aria-hidden="true" />
      <div className="departure__black" aria-hidden="true" />
    </section>
  )
}
