// Dzieli źródłowy film na osobne, zoptymalizowane klipy (MP4 H.264 + WebM VP9),
// w wariancie desktop (1280 px) i mobile (854 px), bez ścieżki audio, plus postery.
import { spawnSync } from 'node:child_process'
import { mkdirSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
let ffmpeg = 'ffmpeg'
try { ffmpeg = require('ffmpeg-static') ?? ffmpeg } catch { /* użyj ffmpeg z PATH */ }

const SOURCE = 'Honda_NSX_white_final.mp4'
const OUT = 'public/video'
const POSTERS = 'public/posters'

// start / koniec w sekundach materiału źródłowego (granice ujęć wykryte filtrem scene)
const CLIPS = [
  { name: 'hero', start: 8.84, end: 11.0 },
  { name: 'rear', start: 0.0, end: 3.0 },
  { name: 'stance', start: 4.48, end: 6.08 },
  { name: 'side', start: 7.32, end: 8.84 },
  { name: 'arrival', start: 11.0, end: 12.92 },
  { name: 'inside', start: 12.92, end: 15.84 },
  { name: 'departure', start: 17.52, end: 21.0 },
]
const VARIANTS = [
  { suffix: '', width: 1280, crf: 20, vp9: 33 },
  { suffix: '-m', width: 854, crf: 24, vp9: 37 },
]

mkdirSync(OUT, { recursive: true })
mkdirSync(POSTERS, { recursive: true })
if (!existsSync(SOURCE)) throw new Error(`Brak pliku ${SOURCE}`)

const run = (args) => {
  const r = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' })
  if (r.status !== 0) throw new Error('ffmpeg zakończył się błędem: ' + args.join(' '))
}

for (const c of CLIPS) {
  // -0.02 s, by nie zahaczyć o pierwszą klatkę następnego ujęcia
  const dur = (c.end - c.start - 0.02).toFixed(3)
  const seek = ['-ss', String(c.start), '-t', dur, '-i', SOURCE, '-an']
  for (const v of VARIANTS) {
    const scale = ['-vf', `scale=${v.width}:-2:flags=lanczos`]
    run([...seek, ...scale, '-c:v', 'libx264', '-preset', 'slow', '-crf', String(v.crf),
      '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', `${OUT}/${c.name}${v.suffix}.mp4`])
    run([...seek, ...scale, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', String(v.vp9),
      '-row-mt', '1', '-pix_fmt', 'yuv420p', `${OUT}/${c.name}${v.suffix}.webm`])
  }
  // poster = pierwsza klatka klipu
  run(['-ss', String(c.start), '-i', SOURCE, '-frames:v', '1', '-vf', 'scale=1280:-2', '-q:v', '3', `${POSTERS}/${c.name}.jpg`])
}
// grafika Open Graph 1200x630 z kadru z lampami
run(['-ss', '10.4', '-i', SOURCE, '-frames:v', '1', '-vf', 'scale=-2:630,crop=1200:630:0:0', '-q:v', '3', 'public/og.jpg'])
console.log('Gotowe.')
