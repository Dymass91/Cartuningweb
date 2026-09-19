# Northline Atelier

Fikcyjne studio performance / restomod — strona demonstracyjna oparta na montażu wideo (czarne Porsche w lesie).
React, Vite, TypeScript, GSAP + ScrollTrigger, Lenis, SCSS.

## Uruchomienie

```bash
npm install
npm run dev            # http://localhost:5173
npm run lint           # ESLint (typescript-eslint + react-hooks)
npm run build          # tsc + vite build -> dist/
npm run preview        # build + wrangler dev
npm run deploy         # build + wrangler deploy (Cloudflare Workers, statyczne zasoby z dist/)
npm run video:prepare  # regeneracja wariantów mobilnych, posterów i og.jpg
```

## Klipy

Oryginalne MP4 (1920×842, H.264, bez audio) leżą w `public/video/porsche/` i są serwowane bez ponownego
kodowania. `scripts/prepare-video.mjs` (FFmpeg z `ffmpeg-static`) generuje z nich:

- `<nazwa>-m.mp4` — wariant mobilny 1280 px,
- `public/posters/<nazwa>.jpg` — pierwsza klatka (poster),
- `public/posters/<nazwa>-still.jpg` — znaczący kadr pokazywany przy `prefers-reduced-motion`,
- `public/og.jpg` — grafika Open Graph.

Mapowanie klipów na sekcje: `src/lib/clips.ts` oraz komponenty w `src/components/`.
