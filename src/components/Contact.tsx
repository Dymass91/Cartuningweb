import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, revealLines, useMotion } from '../lib/motion'
import Line from './Line'

export default function Contact() {
  const root = useRef<HTMLElement>(null)

  useMotion(root, ({ q, root }) => {
    revealLines(q('.contact__title .line__in'), root.querySelector('.contact__title')!, { start: 'top 85%' })
    gsap.fromTo(
      q('.contact__fade'),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: '.contact__body', start: 'top 85%', toggleActions: 'play none none reverse' } },
    )
  })

  return (
    <section ref={root} id="contact" className="contact dark" data-nav="dark" aria-labelledby="contact-title">
      <div className="wrap contact__wrap">
        <p className="eyebrow">10 / Contact</p>
        <h2 id="contact-title" className="contact__title display">
          <Line>START</Line>
          <Line>A BUILD</Line>
        </h2>
        <div className="contact__body">
          <p className="contact__lede contact__fade">
            Masz samochód.
            <br />
            My nadamy mu kierunek.
          </p>
          <div className="contact__actions contact__fade">
            <a className="btn btn--solid" href="mailto:hello@northlineatelier.com">
              Porozmawiajmy <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
            </a>
            <a className="btn btn--ghost" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              Instagram <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
            </a>
          </div>
          <ul className="contact__details contact__fade">
            <li><a href="mailto:hello@northlineatelier.com">hello@northlineatelier.com</a></li>
            <li>Wrocław, Poland</li>
            <li>By appointment only</li>
          </ul>
        </div>
      </div>
      <footer className="footer wrap">
        <span>© {new Date().getFullYear()} Northline Atelier</span>
        <span className="footer__note">Fikcyjne studio — strona demonstracyjna.</span>
      </footer>
    </section>
  )
}
