# Camera and lens assembly opening

The opening uses a matched, high-resolution pair of product images derived from the original Sony α7 IV photographs. The camera body stays still, with its E-mount exposed. A separate lens starts beside it, advances along the mount axis and makes a short bayonet turn into the locked position. The final lens layer is isolated from the matching assembled image, so its position at the lock is exact. There is no camera zoom. Desktop and portrait films have their own paths over 5.2 seconds.

The tactile contact, bayonet rotation and lock Foley are synthesized in the source script, normalized to an audible level and muxed into both films. A prominent “Sesi aç ve filmi izle” button starts synchronized audio and picture after a visitor gesture. If untouched, the film plays silently after a short invitation, with a visible option to restart it with sound. Skip, reduced motion, loading timeout and portfolio playback remain supported.

Original photo URLs, derivative assets and ownership are recorded in `public/intro/sony/SOURCES.md`. No external video service is required.

Reproduce with Node dependencies and FFmpeg:

```sh
node scripts/camera-opening/render-sony.mjs /tmp/sony-film
ffmpeg -framerate 30 -i /tmp/sony-film/desktop/%04d.png -i /tmp/sony-film/lens-mount.wav -map 0:v -map 1:a -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart -shortest public/intro/sony-camera-desktop.mp4
ffmpeg -framerate 30 -i /tmp/sony-film/phone/%04d.png -i /tmp/sony-film/lens-mount.wav -map 0:v -map 1:a -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart -shortest public/intro/sony-camera-phone.mp4
ffmpeg -i /tmp/sony-film/desktop/0000.png -frames:v 1 -quality 88 public/intro/sony-camera-poster.webp
```

Vercel serves the committed media and does not run the renderer.
