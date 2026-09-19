// Generuje z klipów w public/video/porsche: lżejsze warianty mobilne (-m.mp4),
// postery (pierwsza klatka) oraz kadry statyczne dla reduced-motion (-still.jpg).
// Oryginalne MP4 (1920x842, H.264, bez audio) są serwowane bez ponownego kodowania.
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
let ffmpeg = 'ffmpeg'
try { ffmpeg = require('ffmpeg-static') ?? ffmpeg } catch { /* ffmpeg z PATH */ }

const DIR = 'public/video/porsche'
const POSTERS = 'public/posters'
// sekunda, z której pochodzi statyczny kadr (znaczący moment ujęcia)
const CLIPS = {
  '01_hero_front_reveal': 6.6,
  '02_cockpit_instruments': 1.8,
  '03_rolling_front': 3.2,
  '04_front_fender_detail': 3.4,
  '05_rear_stance': 3.5,
  '06_smoke_side_profile': 6.2,
  '07_rolling_side_detail': 3.2,
  '08_departure_finale': 3.0,
}

const run = (args) => {
  const r = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' })
  if (r.status !== 0) throw new Error('ffmpeg: ' + args.join(' '))
}

for (const [name, still] of Object.entries(CLIPS)) {
  const src = `${DIR}/${name}.mp4`
  if (!existsSync(src)) throw new Error(`Brak ${src}`)
  run(['-i', src, '-an', '-vf', 'scale=1280:-2:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-crf', '25',
    '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', `${DIR}/${name}-m.mp4`])
  run(['-i', src, '-frames:v', '1', '-vf', 'scale=1600:-2', '-q:v', '4', `${POSTERS}/${name}.jpg`])
  run(['-ss', String(still), '-i', src, '-frames:v', '1', '-vf', 'scale=1600:-2', '-q:v', '4', `${POSTERS}/${name}-still.jpg`])
}
run(['-ss', '6.6', '-i', `${DIR}/01_hero_front_reveal.mp4`, '-frames:v', '1', '-vf', 'scale=-2:630,crop=1200:630', '-q:v', '3', 'public/og.jpg'])
console.log('Gotowe.')
