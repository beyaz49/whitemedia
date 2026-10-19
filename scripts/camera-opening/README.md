# Camera opening source

Original procedural camera and hollow lens geometry, rendered in a dark studio with Blender Cycles. The lens translates along the mount's optical axis and twists into place. No external camera model or stock footage is used.

The website plays the pre-rendered H.264 film, so visitors do not need WebGL. The rendering tools are development dependencies and are excluded from the application bundle. Vercel serves the committed assets; it does not run Blender.

Reproduce on Linux with DejaVu fonts, Node dependencies, Python 3.11, and FFmpeg:

```sh
node scripts/camera-opening/export.mjs /tmp/wm-camera-render
uv venv --python 3.11 /tmp/wm-blender-env
uv pip install --python /tmp/wm-blender-env/bin/python -r scripts/camera-opening/requirements.txt
WM_RENDER_DIR=/tmp/wm-camera-render WM_WIDTH=960 WM_HEIGHT=558 WM_SAMPLES=8 /tmp/wm-blender-env/bin/python scripts/camera-opening/render.py film
mkdir -p public/intro
ffmpeg -framerate 15 -i /tmp/wm-camera-render/frames/%04d.png -vf 'tpad=stop_mode=clone:stop_duration=0.2,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bilat:vsbmc=1,format=yuv420p' -frames:v 110 -c:v libx264 -preset slow -crf 18 -movflags +faststart -an public/intro/camera-studio.mp4
ffmpeg -i /tmp/wm-camera-render/frames/0000.png -frames:v 1 -quality 88 public/intro/camera-studio.webp
```

The renderer writes 55 frames at 15 frames per second. The delivered video interpolates these to 30 frames per second and starts with a fast-start MP4 header. `render.py 1.3` renders a single pose for material and lighting review. The React component handles the wordmark transition, skip control, playback failure, reduced motion, and data saving preferences.
