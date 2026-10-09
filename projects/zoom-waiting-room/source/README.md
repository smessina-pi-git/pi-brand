# Zoom waiting room video: source

The master animation for the Zoom waiting room video (v13). The builder (`../builder.html`) is a canvas port of this page and is what people use to make their own video. Use this folder to change the animation itself and render reference MP4s. `NOTES.md` has the design history and every timing decision.

| File | What it is |
|---|---|
| `waiting.html` | The whole animation as one 1920×1080 page. `seek(t)` sets every element as a pure function of time, so frames are deterministic. Timings live in the `T` object; copy lives in `QUESTION` and `REPLY` (tokens `{name}` and `{profile}`). |
| `build.py` | Fills the name and profile and inlines the logos from the repo's `assets/` folder, writing `waiting_built.html`. |
| `cap.js` | Renders frames with Playwright. `preview` mode renders a few key frames to check first. |

## Render

Needs Python 3, Node, `playwright-core`, Chrome or Chromium, and ffmpeg. Install the fonts in the repo's `fonts/` folder first (Roboto, Roboto Mono, Roboto Serif Medium and Light Italic). Elsewhere they fall back and the layout shifts.

```
python3 build.py --name Steve --profile Persuader
npm i playwright-core && npx playwright install chromium     # skip on a Mac with Chrome
node cap.js waiting_built.html prev preview                   # check these PNGs first
node cap.js waiting_built.html frames
ffmpeg -framerate 30 -i frames/f%04d.png -c:v libx264 -pix_fmt yuv420p -crf 16 -tune grain -movflags +faststart out.mp4
```

On Linux, copy the fonts into `~/.fonts` and run `fc-cache -f`. On a Mac, Chrome is used automatically; elsewhere set `CHROME_PATH` or let Playwright use its own Chromium. Check that the first and last frames match (the loop is seamless), and keep the file under Zoom's 30 MB limit; about 5 MB is typical.

Don't commit rendered frames, `waiting_built.html`, or old cuts of the video. This repo is public.
