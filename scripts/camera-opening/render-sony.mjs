import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas, loadImage, Path2D } from '@napi-rs/canvas';
import potrace from 'potrace';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const output = path.resolve(process.argv[2] || '/tmp/sony-film');
fs.mkdirSync(output, { recursive: true });
const fps = 30, duration = 5.2;
const clamp = t => Math.max(0, Math.min(1, t));
const ease = t => { t = clamp(t); return t * t * (3 - 2 * t); };

// Trace the exterior of the photographed body. The lens is a real-alpha layer
// extracted from the matching product shot, rather than an artificial cylinder.
async function bodyPhotograph() {
  const image = await loadImage(path.join(project, 'public/intro/sony/body-empty-angled.webp'));
  const canvas = createCanvas(image.width, image.height), ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  const { data } = ctx.getImageData(0, 0, image.width, image.height), w = image.width, h = image.height;
  const outside = new Uint8Array(w * h), queue = new Int32Array(w * h);
  let head = 0, tail = 0;
  const add = i => {
    if (i < 0 || i >= w * h || outside[i]) return;
    const p = i * 4;
    if (data[p] > 218 && data[p + 1] > 218 && data[p + 2] > 218) {
      outside[i] = 1; queue[tail++] = i;
    }
  };
  for (let x = 0; x < w; x++) { add(x); add((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { add(y * w); add(y * w + w - 1); }
  while (head < tail) {
    const i = queue[head++], x = i % w;
    if (x) add(i - 1);
    if (x < w - 1) add(i + 1);
    add(i - w); add(i + w);
  }
  const mask = ctx.createImageData(w, h);
  for (let i = 0; i < w * h; i++) {
    const v = outside[i] ? 255 : 0, p = i * 4;
    mask.data[p] = mask.data[p + 1] = mask.data[p + 2] = v;
    mask.data[p + 3] = 255;
  }
  ctx.putImageData(mask, 0, 0);
  const svg = await new Promise((resolve, reject) =>
    potrace.trace(canvas.toBuffer('image/png'), { threshold: 128, turdSize: 8, optTolerance: .15 },
      (error, value) => error ? reject(error) : resolve(value)));
  return { image, clip: new Path2D(svg.match(/<path[^>]+d="([^"]+)"/)[1]) };
}

const body = await bodyPhotograph();
const lens = await loadImage(path.join(project, 'public/intro/sony/lens-isolated.webp'));

function render(w, h, t) {
  const phone = w < h;
  const canvas = createCanvas(w, h), ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = '#050709';
  ctx.fillRect(0, 0, w, h);
  const backdrop = ctx.createRadialGradient(w * (phone ? .48 : .45), h * .47, 0, w * .5, h * .48, Math.max(w, h) * .72);
  backdrop.addColorStop(0, '#172026');
  backdrop.addColorStop(.6, '#0b1015');
  backdrop.addColorStop(1, '#050709');
  ctx.fillStyle = backdrop; ctx.fillRect(0, 0, w, h);

  const scale = phone ? .56 : .64;
  const centerX = phone ? 345 : 480, centerY = phone ? 400 : 340;
  const anchorX = 750, anchorY = 530;
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(scale, scale);
  ctx.translate(-anchorX, -anchorY);
  ctx.clip(body.clip);
  ctx.drawImage(body.image, 0, 0);
  ctx.restore();

  // The whole photographed lens starts beside the empty E-mount and follows
  // its real optical axis. The body never zooms. A final short twist seats the
  // bayonet exactly at the audible lock.
  const travel = ease((t - .42) / 1.83);
  const seat = ease((t - 2.25) / .32);
  const dx = (1 - travel) * (phone ? 250 : 550) + (1 - seat) * (phone ? 12 : 18);
  const dy = (1 - travel) * (phone ? 410 : 32) + (1 - seat) * (phone ? 12 : 8);
  const lensScale = 1 - .045 * (1 - travel);
  const angle = -.11 * (1 - seat);
  const settle = t >= 2.57 && t < 2.72 ? Math.sin((t - 2.57) * 64) * 1.1 * (1 - ease((t - 2.57) / .15)) : 0;
  ctx.save();
  ctx.translate(centerX + dx + settle, centerY + dy);
  ctx.scale(scale, scale);
  ctx.translate(-anchorX, -anchorY);
  ctx.translate(815, 480);
  ctx.rotate(angle);
  ctx.scale(lensScale, lensScale);
  ctx.translate(-815, -480);
  ctx.drawImage(lens, 0, 0);
  ctx.restore();

  // A restrained studio flag briefly catches the metal at the lock.
  const sweep = ease((t - 2.43) / .55);
  if (sweep > 0 && sweep < 1) {
    const x = (-.2 + 1.4 * sweep) * w;
    const light = ctx.createLinearGradient(x - w * .24, 0, x + w * .24, 0);
    light.addColorStop(0, '#dbe8ed00'); light.addColorStop(.5, '#dbe8ed0c'); light.addColorStop(1, '#dbe8ed00');
    ctx.fillStyle = light; ctx.fillRect(0, 0, w, h);
  }
  const vignette = ctx.createRadialGradient(w * .5, h * .5, Math.min(w, h) * .32,
    w * .5, h * .5, Math.max(w, h) * .73);
  vignette.addColorStop(0, '#0000'); vignette.addColorStop(1, '#020304a0');
  ctx.fillStyle = vignette; ctx.fillRect(0, 0, w, h);
  return canvas;
}

for (const [name, w, h] of [['desktop', 1280, 720], ['phone', 720, 1080]]) {
  const directory = path.join(output, name);
  fs.mkdirSync(directory, { recursive: true });
  for (let frame = 0; frame < duration * fps; frame++) {
    fs.writeFileSync(path.join(directory, String(frame).padStart(4, '0') + '.png'),
      render(w, h, frame / fps).toBuffer('image/png'));
  }
  console.log(`Rendered ${name}: ${duration * fps} frames`);
}

// Dry mechanical contact, a short turn against the bayonet and a distinct lock.
const rate = 44100, count = Math.ceil(duration * rate), pcm = new Float32Array(count);
let seed = 94731;
const noise = () => { seed = (Math.imul(seed, 1664525) + 1013904223) | 0; return (seed >>> 0) / 2147483648 - 1; };
function click(at, level, decay) {
  let low = 0;
  for (let i = 0; i < rate * .09; i++) {
    const t = i / rate, n = noise();
    low += .24 * (n - low);
    const env = (1 - Math.exp(-t / .00045)) * Math.exp(-t / decay);
    const metal = .48 * Math.sin(2 * Math.PI * 315 * t) * Math.exp(-t / .019)
      + .26 * Math.sin(2 * Math.PI * 1290 * t) * Math.exp(-t / .011);
    pcm[Math.floor(at * rate) + i] += level * env * ((n - low) * .7 + metal);
  }
}
click(.55, .08, .012);
click(1.32, .12, .020);
click(2.22, .22, .018);
click(2.57, .75, .027);
click(2.595, .28, .017);
let low = 0;
for (let i = Math.floor(1.42 * rate); i < 2.57 * rate; i++) {
  const t = i / rate - 1.42, n = noise();
  low += .08 * (n - low);
  const envelope = Math.sin(Math.PI * t / 1.15) ** 2;
  pcm[i] += (n - low) * .072 * envelope * (.65 + .35 * Math.sin(t * 104))
    + .025 * Math.sin(t * 2 * Math.PI * 172) * envelope;
}
let peak = 0;
for (const sample of pcm) peak = Math.max(peak, Math.abs(sample));
const gain = .75 / peak;
for (let i = 0; i < pcm.length; i++) pcm[i] *= gain;
const bytes = Buffer.alloc(44 + count * 2);
bytes.write('RIFF', 0); bytes.writeUInt32LE(bytes.length - 8, 4);
bytes.write('WAVEfmt ', 8); bytes.writeUInt32LE(16, 16);
bytes.writeUInt16LE(1, 20); bytes.writeUInt16LE(1, 22);
bytes.writeUInt32LE(rate, 24); bytes.writeUInt32LE(rate * 2, 28);
bytes.writeUInt16LE(2, 32); bytes.writeUInt16LE(16, 34);
bytes.write('data', 36); bytes.writeUInt32LE(count * 2, 40);
for (let i = 0; i < count; i++) bytes.writeInt16LE(Math.round(Math.max(-1, Math.min(1, pcm[i])) * 32767), 44 + i * 2);
fs.writeFileSync(path.join(output, 'lens-mount.wav'), bytes);
console.log('Wrote synchronized lens Foley');
