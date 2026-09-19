import { forwardRef, useEffect, useRef, useState, type CSSProperties } from 'react'
import { isMobile, reducedMotion } from '../lib/env'
import { CLIPS, type ClipName } from '../lib/clips'

interface Props {
  name: ClipName
  /** hero: preload="auto", pozostałe: metadata */
  eager?: boolean
  /** prędkość odtwarzania */
  rate?: number
  /** ułamek widoczności, od którego film startuje */
  threshold?: number
  /** rodzic sam decyduje kiedy odtworzyć film (np. po odsłonięciu maski) */
  manual?: boolean
  /** object-position dla desktopu / telefonu — samochód zostaje w kadrze */
  position?: string
  positionMobile?: string
  className?: string
}

/** Rejestr klipów: w danym momencie gra tylko jeden. */
const registry = new Set<HTMLVideoElement>()

const playExclusive = (v: HTMLVideoElement) => {
  registry.forEach((other) => {
    if (other !== v) other.pause()
  })
  return v.play().catch(() => undefined)
}

/**
 * Pojedynczy klip: MP4, poster, bez dźwięku i kontrolek, odtwarzany raz po wejściu
 * w viewport, pauza poza nim, zatrzymanie na ostatniej klatce.
 */
const VideoClip = forwardRef<HTMLVideoElement, Props>(function VideoClip(
  { name, eager = false, rate = 1, threshold = 0.5, manual = false, position = '50% 50%', positionMobile, className },
  outerRef,
) {
  const inner = useRef<HTMLVideoElement | null>(null)
  const [mobile] = useState(isMobile)
  const [reduced] = useState(reducedMotion)
  const file = CLIPS[name]

  useEffect(() => {
    const v = inner.current
    if (!v || reduced) return
    registry.add(v)
    v.defaultPlaybackRate = rate
    v.playbackRate = rate
    let io: IntersectionObserver | undefined
    if (!manual) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (!v.ended) void playExclusive(v)
          } else v.pause()
        },
        { threshold },
      )
      io.observe(v)
    }
    return () => {
      io?.disconnect()
      registry.delete(v)
    }
  }, [rate, manual, threshold, reduced])

  const style = { '--pos': position, '--pos-m': positionMobile ?? position } as CSSProperties

  return (
    <video
      ref={(el) => {
        inner.current = el
        if (typeof outerRef === 'function') outerRef(el)
        else if (outerRef) outerRef.current = el
      }}
      className={`clip ${className ?? ''}`}
      style={style}
      poster={`/posters/${file}${reduced ? '-still' : ''}.jpg`}
      muted
      playsInline
      preload={reduced ? 'none' : eager ? 'auto' : 'metadata'}
      autoPlay={eager && !reduced}
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={`/video/porsche/${file}${mobile ? '-m' : ''}.mp4`} type="video/mp4" />
    </video>
  )
})

export { playExclusive }
export default VideoClip
