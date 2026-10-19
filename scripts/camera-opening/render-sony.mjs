import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas, loadImage, Path2D } from '@napi-rs/canvas';
import potrace from 'potrace';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const output = path.resolve(process.argv[2] || '/tmp/sony-film');
fs.mkdirSync(output, {recursive:true});
const fps=30, duration=5.2;
const clamp = t => Math.max(0, Math.min(1,t));
const ease = t => {t=clamp(t); return t*t*(3-2*t);};

// Trace only the exterior white backdrop into an SVG clipping path. The
// original Sony JPEGs remain byte-for-byte intact; no camera pixels are repainted.
async function photograph(name) {
  const image=await loadImage(path.join(project,'public/intro/sony',name));
  const canvas=createCanvas(image.width,image.height), ctx=canvas.getContext('2d');
  ctx.drawImage(image,0,0);
  const {data}=ctx.getImageData(0,0,image.width,image.height), w=image.width,h=image.height;
  const outside=new Uint8Array(w*h), queue=new Int32Array(w*h); let head=0,tail=0;
  const add=i=>{if(i<0||i>=w*h||outside[i])return;const p=i*4;if(data[p]>218&&data[p+1]>218&&data[p+2]>218){outside[i]=1;queue[tail++]=i;}};
  for(let x=0;x<w;x++){add(x);add((h-1)*w+x);}for(let y=0;y<h;y++){add(y*w);add(y*w+w-1);}
  while(head<tail){const i=queue[head++],x=i%w;if(x) add(i-1);if(x<w-1)add(i+1);add(i-w);add(i+w);}
  const mask=ctx.createImageData(w,h);
  for(let i=0;i<w*h;i++){const v=outside[i]?255:0;mask.data.set([v,v,v,255],i*4);}
  ctx.putImageData(mask,0,0);
  const svg=await new Promise((resolve,reject)=>potrace.trace(canvas.toBuffer('image/png'),{threshold:128,turdSize:6,optTolerance:.15},(error,svg)=>error?reject(error):resolve(svg)));
  const d=svg.match(/<path[^>]+d="([^"]+)"/)[1];
  return {image,clip:new Path2D(d)};
}
const body=await photograph('body-original.jpg'), mounted=await photograph('mounted-original.jpg');
// Follow the photographed front rim itself, so no arbitrary ellipse cuts
// through the barrel when the glass moves into the mount close-up.
function render(w,h,t) {
  const canvas=createCanvas(w,h), ctx=canvas.getContext('2d'), phone=w<h;
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  ctx.fillStyle='#050709';ctx.fillRect(0,0,w,h);
  const glow=ctx.createRadialGradient(w*.52,h*.50,0,w*.52,h*.50,w*.68);
  glow.addColorStop(0,'#161e25');glow.addColorStop(1,'#050709');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  function draw(photo,x,y,scale,anchor,alpha=1,rotate=0,blur=0,extraClip) {
    ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(rotate);ctx.scale(scale,scale);ctx.translate(-anchor[0],-anchor[1]);
    ctx.clip(photo.clip);if(extraClip)ctx.clip(extraClip);
    if(blur>0)ctx.filter=`blur(${blur}px)`;
    ctx.drawImage(photo.image,0,0);ctx.restore();
  }
  if(t<1.62) {
    // A genuine close-up of the bare E-mount. A dark edit hides the angle
    // change; no cut-out lens is ever pasted onto this photograph.
    const advance=ease(t/1.5), fade=1-ease((t-1.43)/.19);
    const scale=(phone?1.82:2.35)*(1+.075*advance);
    draw(body,w*(.515-.012*advance),h*.515,scale,[358,260],fade);
  } else {
    // Lens macro and complete body are one continuous original photograph.
    // The dolly-out reveals the camera after the off-screen bayonet lock.
    const advance=ease((t-1.62)/1.72), reveal=ease((t-1.62)/.17);
    const scale=(phone?3.05:3.55)*(1-advance)+(phone?1.48:1.56)*advance;
    const anchor=[246+(321-246)*advance,305+(216-305)*advance];
    const settle= t>2.48 && t<2.7 ? Math.sin((t-2.48)*79)*.9*(1-ease((t-2.48)/.22)) : 0;
    draw(mounted,w*.51+settle,h*.51,scale,anchor,reveal);
  }
  // Controlled moving black flag: a photographic lighting cue, not a CG glow.
  const flag=ctx.createLinearGradient(-w*.35+t*w*.15,0,w*.95+t*w*.10,0);
  flag.addColorStop(0,'#0203048c');flag.addColorStop(.46,'#02030400');flag.addColorStop(1,'#02030472');
  ctx.fillStyle=flag;ctx.fillRect(0,0,w,h);
  const vignette=ctx.createRadialGradient(w*.5,h*.5,Math.min(w,h)*.24,w*.5,h*.5,Math.max(w,h)*.68);
  vignette.addColorStop(0,'#0000');vignette.addColorStop(1,'#020304c0');ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
  return canvas;
}

for(const [name,w,h] of [['desktop',1280,720],['phone',720,1080]]) {
  const directory=path.join(output,name);fs.mkdirSync(directory,{recursive:true});
  for(let frame=0;frame<duration*fps;frame++) fs.writeFileSync(path.join(directory,String(frame).padStart(4,'0')+'.png'),render(w,h,frame/fps).toBuffer('image/png'));
  console.log(`Rendered ${name}: ${duration*fps} frames`);
}

// Original dry bayonet Foley: prolonged metal friction, detents and a distinct
// lock. No stock recording or music. The entire track is picture-synchronous.
const rate=44100, count=Math.ceil(duration*rate), pcm=new Float32Array(count);
let seed=94731;const noise=()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return (seed>>>0)/2147483648-1;};
function click(at,level,decay) {
  let low=0;
  for(let i=0;i<rate*.09;i++) {const t=i/rate,n=noise();low+=.24*(n-low);const env=(1-Math.exp(-t/.00045))*Math.exp(-t/decay);
    const metal=.48*Math.sin(2*Math.PI*315*t)*Math.exp(-t/.019)+.26*Math.sin(2*Math.PI*1290*t)*Math.exp(-t/.011);
    pcm[Math.floor(at*rate)+i]+=level*env*((n-low)*.7+metal);
  }
}
click(1.72,.19,.025);click(1.95,.12,.014);click(2.15,.16,.012);click(2.49,.66,.025);click(2.515,.24,.016);
let low=0;
for(let i=Math.floor(1.75*rate);i<2.49*rate;i++){const t=i/rate-1.75,n=noise();low+=.08*(n-low);const envelope=Math.sin(Math.PI*t/.74)**2;pcm[i]+=(n-low)*.075*envelope*(.65+.35*Math.sin(t*104))+.026*Math.sin(t*2*Math.PI*172)*envelope;}
// Consistent audible peak without digital clipping.
let peak=0;for(const sample of pcm)peak=Math.max(peak,Math.abs(sample));
const gain=.75/peak;for(let i=0;i<pcm.length;i++)pcm[i]*=gain;
const bytes=Buffer.alloc(44+count*2);bytes.write('RIFF',0);bytes.writeUInt32LE(bytes.length-8,4);bytes.write('WAVEfmt ',8);bytes.writeUInt32LE(16,16);bytes.writeUInt16LE(1,20);bytes.writeUInt16LE(1,22);bytes.writeUInt32LE(rate,24);bytes.writeUInt32LE(rate*2,28);bytes.writeUInt16LE(2,32);bytes.writeUInt16LE(16,34);bytes.write('data',36);bytes.writeUInt32LE(count*2,40);
for(let i=0;i<count;i++)bytes.writeInt16LE(Math.round(Math.max(-1,Math.min(1,pcm[i]))*32767),44+i*2);
fs.writeFileSync(path.join(output,'lens-mount.wav'),bytes);
console.log('Wrote synchronized lens Foley');
