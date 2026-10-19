import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas, loadImage, Path2D } from '@napi-rs/canvas';
import potrace from 'potrace';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const output = path.resolve(process.argv[2] || '/tmp/sony-film');
fs.mkdirSync(output, {recursive:true});
const fps=30, duration=4.6;
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
const front=new Path2D('M241 211 C295 207 340 239 343 292 C351 348 318 398 271 408 C219 422 167 391 154 344 C135 292 155 243 193 221 C207 215 225 212 241 211 Z');

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
  if(t<2.48) {
    const scale=(phone?1.77:2.45)*(1-.035*ease(t/2.4));
    const fade=ease(t/.34)*(1-ease((t-2.34)/.14));
    draw(body,w*.51,h*.51,scale,[358,260],fade);
    const approach=ease((t-1.08)/1.08), lock=ease((t-2.10)/.23);
    const presence=ease((t-1.06)/.25)*fade;
    if(presence>0) draw(mounted,w*.51+(1-approach)*w*.14,h*.51+(1-approach)*h*.065,scale*(1.24+.50*(1-approach)),[246,310],presence,-.19*(1-lock),2.5*(1-approach),front);
    // Restrained moving studio flag, rather than a digital glow or interface HUD.
    const flag=ctx.createLinearGradient(0,0,w,0);flag.addColorStop(0,'#050709dd');flag.addColorStop(.40,'#05070910');flag.addColorStop(1,'#05070955');
    ctx.fillStyle=flag;ctx.fillRect(0,0,w,h);
  } else {
    const reveal=ease((t-2.48)/.26), move=ease((t-2.48)/2.12);
    const scale=(phone?1.27:1.51)*(1+.045*move);
    ctx.save();ctx.globalAlpha=reveal*.7;
    const shadow=ctx.createRadialGradient(w*.51,h*.84,0,w*.51,h*.84,w*.34);shadow.addColorStop(0,'#000');shadow.addColorStop(1,'#0000');
    ctx.translate(0,h*.76);ctx.scale(1,.22);ctx.fillStyle=shadow;ctx.fillRect(0,-h,w,h*4);ctx.restore();
    draw(mounted,w*.51,h*.50,scale,[321,216],reveal);
  }
  const vignette=ctx.createRadialGradient(w*.5,h*.5,Math.min(w,h)*.24,w*.5,h*.5,Math.max(w,h)*.68);
  vignette.addColorStop(0,'#0000');vignette.addColorStop(1,'#020304c0');ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
  return canvas;
}

for(const [name,w,h] of [['desktop',1280,720],['phone',720,1080]]) {
  const directory=path.join(output,name);fs.mkdirSync(directory,{recursive:true});
  for(let frame=0;frame<duration*fps;frame++) fs.writeFileSync(path.join(directory,String(frame).padStart(4,'0')+'.png'),render(w,h,frame/fps).toBuffer('image/png'));
  console.log(`Rendered ${name}: ${duration*fps} frames`);
}

// Original dry bayonet Foley: short contact, friction, detent and lock. No stock
// recording or music. It is muxed into the video and starts only after opt-in.
const rate=44100, count=Math.ceil(duration*rate), pcm=new Float32Array(count);
let seed=94731;const noise=()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return (seed>>>0)/2147483648-1;};
function click(at,level,decay) {
  let low=0;
  for(let i=0;i<rate*.09;i++) {const t=i/rate,n=noise();low+=.24*(n-low);const env=(1-Math.exp(-t/.00045))*Math.exp(-t/decay);
    const metal=.48*Math.sin(2*Math.PI*315*t)*Math.exp(-t/.019)+.26*Math.sin(2*Math.PI*1290*t)*Math.exp(-t/.011);
    pcm[Math.floor(at*rate)+i]+=level*env*((n-low)*.7+metal);
  }
}
click(1.82,.12,.014);click(2.01,.045,.008);click(2.13,.06,.007);click(2.235,.40,.010);click(2.263,.16,.006);
let low=0;
for(let i=Math.floor(1.84*rate);i<2.235*rate;i++){const t=i/rate-1.84,n=noise();low+=.08*(n-low);const envelope=Math.sin(Math.PI*t/.395)**2;pcm[i]+=(n-low)*.018*envelope*(.65+.35*Math.sin(t*104));}
const bytes=Buffer.alloc(44+count*2);bytes.write('RIFF',0);bytes.writeUInt32LE(bytes.length-8,4);bytes.write('WAVEfmt ',8);bytes.writeUInt32LE(16,16);bytes.writeUInt16LE(1,20);bytes.writeUInt16LE(1,22);bytes.writeUInt32LE(rate,24);bytes.writeUInt32LE(rate*2,28);bytes.writeUInt16LE(2,32);bytes.writeUInt16LE(16,34);bytes.write('data',36);bytes.writeUInt32LE(count*2,40);
for(let i=0;i<count;i++)bytes.writeInt16LE(Math.round(Math.max(-1,Math.min(1,pcm[i]))*32767),44+i*2);
fs.writeFileSync(path.join(output,'lens-mount.wav'),bytes);
console.log('Wrote synchronized lens Foley');
