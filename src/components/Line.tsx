import type { ReactNode } from 'react'

/** Linia tekstu w masce overflow:hidden — baza dla reveal przez GSAP. */
export default function Line({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`line ${className}`}>
      <span className="line__in">{children}</span>
    </span>
  )
}
