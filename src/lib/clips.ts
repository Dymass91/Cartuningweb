/**
 * Klipy w public/video/porsche (oryginały 1920x842 H.264 + warianty -m.mp4).
 * Postery: public/posters/<plik>.jpg (pierwsza klatka) i <plik>-still.jpg (kadr dla reduced-motion).
 * Generuje je scripts/prepare-video.mjs.
 */
export const CLIPS = {
  hero: '01_hero_front_reveal',
  cockpit: '02_cockpit_instruments',
  rolling: '03_rolling_front',
  fender: '04_front_fender_detail',
  rear: '05_rear_stance',
  smoke: '06_smoke_side_profile',
  side: '07_rolling_side_detail',
  departure: '08_departure_finale',
} as const

export type ClipName = keyof typeof CLIPS
