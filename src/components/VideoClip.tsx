import { forwardRef, useEffect, useRef, useState, type CSSProperties } from 'react'
import { isMobile, reducedMotion } from '../lib/env'
import type { ClipName } from '../lib/clips'

interface Props {
  name: ClipName
  /** hero: preload="auto", pozostałe: metadata */
  eager?: boolean
  /** prędkość odtwarzania (delikatne spowolnienie dla krótkich ujęć) */
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

/**
 * Pojedynczy klip: MP4 (główny) + WebM, poster, bez dźwięku, bez kontrolek,
 * odtwarzany raz po wejściu w viewport, pauza poza nim, stop na ostatniej klatce.
 */
const VideoClip = forwardRef<HTMLVideoElement, Props>(function VideoClip(
  { name, eager = false, rate = 1, threshold = 0.5, manual = false, position = '50% 50%', positionMobile, className },
  outerRef,
) {
  const inner = useRef<HTMLVideoElement | null>(null)
  const [mobile] = useState(isMobile)
  const [reduced] = useState(reducedMotion)
  const suffix = mobile ? '-m' : ''

  useEffect(() => {
    const v = inner.current
    if (!v || reduced) return
    v.defaultPlaybackRate = rate
    v.playbackRate = rate
    if (manual) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!v.ended) v.play().catch(() => undefined)
        } else v.pause()
      },
      { threshold },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [rate, manual, threshold, reduced])

  const style = {
    '--pos': position,
    '--pos-m': positionMobile ?? position,
  } as CSSProperties

  return (
    <video
      ref={(el) => {
        inner.current = el
        if (typeof outerRef === 'function') outerRef(el)
        else if (outerRef) outerRef.current = el
      }}
      className={`clip ${className ?? ''}`}
      style={style}
      poster={`/posters/${name}.jpg`}
      muted
      playsInline
      preload={reduced ? 'none' : eager ? 'auto' : 'metadata'}
      autoPlay={eager && !reduced}
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={`/video/${name}${suffix}.mp4`} type="video/mp4" />
      <source src={`/video/${name}${suffix}.webm`} type="video/webm" />
    </video>
  )
})

export default VideoClip
