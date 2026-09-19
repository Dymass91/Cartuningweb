export const reducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Tryb oszczędzania danych albo łącze 2G — wtedy wybieramy lżejsze pliki wideo. Celowo nie używamy
 * downlink/3G: te szacunki bywają zaniżone na zwykłym desktopie i obniżałyby jakość obrazu bez potrzeby.
 */
export const slowConnection = (): boolean => {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  if (!c) return false
  return Boolean(c.saveData) || c.effectiveType === 'slow-2g' || c.effectiveType === '2g'
}

export const isMobile = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
