export const reducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Wolne łącze / tryb oszczędzania danych — wybieramy lżejsze pliki wideo. */
export const slowConnection = (): boolean => {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string; downlink?: number } }).connection
  if (!c) return false
  return Boolean(c.saveData) || (c.effectiveType !== undefined && c.effectiveType !== '4g') || (c.downlink !== undefined && c.downlink > 0 && c.downlink < 8)
}

export const isMobile = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
