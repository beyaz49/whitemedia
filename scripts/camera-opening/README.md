# Sony photographic opening

The opening uses original Sony α7 IV product photography. Camera detail pixels are preserved; an exterior SVG clipping path removes the white page backdrop. A bare E-mount close-up cuts through darkness to a single genuine photograph of the mounted lens and body. A dolly-out reveals the entire camera over 5.2 seconds. Desktop and portrait films have their own framing. No lens cut-out is composited onto another camera photograph.

The tactile contact, bayonet rotation and lock Foley are synthesized in the source script, normalized to an audible level and muxed into both films. A prominent “Sesi aç ve filmi izle” button starts synchronized audio and picture after a visitor gesture. If untouched, the film plays silently after a short invitation, with a visible option to restart it with sound. Skip, reduced motion, loading timeout and portfolio playback remain supported.

Original photo URLs and ownership are recorded in `public/intro/sony/SOURCES.md`. No external video service is required.

Reproduce with Node dependencies and FFmpeg:

```sh
node scripts/camera-opening/render-sony.mjs /tmp/sony-film
ffmpeg -framerate 30 -i /tmp/sony-film/desktop/%04d.png -i /tmp/sony-film/lens-mount.wav -map 0:v -map 1:a -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart -shortest public/intro/sony-camera-desktop.mp4
ffmpeg -framerate 30 -i /tmp/sony-film/phone/%04d.png -i /tmp/sony-film/lens-mount.wav -map 0:v -map 1:a -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart -shortest public/intro/sony-camera-phone.mp4
ffmpeg -i /tmp/sony-film/desktop/0000.png -frames:v 1 -quality 88 public/intro/sony-camera-poster.webp
```

Vercel serves the committed media and does not run the renderer.
