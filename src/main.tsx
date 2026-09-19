import { createRoot } from 'react-dom/client'
import '@fontsource-variable/syne'
import '@fontsource-variable/manrope'
import './styles/main.scss'
import App from './App'

// Odświeżenie (F5) zawsze zaczyna od hero: ignorujemy hash z paska adresu i przywracanie scrolla.
// Jawny link z hashem (nowe wejście) nadal prowadzi do sekcji.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
if (navigation?.type === 'reload' && location.hash) {
  history.replaceState(null, '', location.pathname + location.search)
}

createRoot(document.getElementById('root')!).render(<App />)
