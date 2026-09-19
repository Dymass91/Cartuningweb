/**
 * Zakresy klipów w materiale źródłowym Honda_NSX_white_final.mp4 (21 s, 25 fps).
 * Źródło prawdy dla scripts/split-video.mjs jest ten sam zestaw wartości.
 */
export const CLIPS = {
  hero: { from: 8.84, to: 11.0, desc: 'Otwarcie przednich lamp' },
  rear: { from: 0.0, to: 3.0, desc: 'Tył samochodu na leśnej drodze' },
  stance: { from: 4.48, to: 6.08, desc: 'Koło, nadkole i szeroki bodykit' },
  side: { from: 7.32, to: 8.84, desc: 'Samochód z boku, otwarte drzwi' },
  arrival: { from: 11.0, to: 12.92, desc: 'Przejazd po karoserii' },
  inside: { from: 12.92, to: 15.84, desc: 'Wnętrze, kierownica, kokpit' },
  departure: { from: 17.52, to: 21.0, desc: 'Odjazd leśną drogą' },
} as const

export type ClipName = keyof typeof CLIPS
