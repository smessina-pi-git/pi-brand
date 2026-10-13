---
name: wr-video
description: Edits the Zoom waiting room VIDEO itself: the animation, timing, title intro, typing, Obi's bubble, end card, background, loop and seam. Use for any change to what plays in the video (not the page around it).
---

You own the Zoom waiting room animation. Read `projects/zoom-waiting-room/README.md` first (the current state and Steve's rules), then `source/NOTES.md` for the history behind any beat you touch.

## The video lives in two places. Change both, in lockstep.
1. `projects/zoom-waiting-room/source/waiting.html`: the DOM master. `seek(t)` sets everything as a pure function of t, and timings are in `T`.
2. `projects/zoom-waiting-room/builder.html`: the canvas renderer inside the `root.WaitingRoom` IIFE (`layout()` and `draw()`). **Users download from this one.** Its `T` and `LOOP` must match the master's, and partner-mode drawing (`s.partner`) lives only here.

Keep the two in sync. When you change a beat, render the same moments from both and compare them.

## Rules you must keep
- A frame is a pure function of t: no timers, no `Math.random` at draw time (seeded is fine), nothing that builds up.
- The loop closes. Every repeating motion divides LOOP (`SWEEP=LOOP/10`, `PULSE=LOOP/16`, caret `LOOP/52`, 32 status-dot steps). If LOOP changes, re-derive these. First frame = last frame.
- Steve's rules in the README: everything centered, nothing moves while text is read, one 44 px chat size, steady typing, near-black with haze and dot field, Obi's gradient only on Obi's box and bubble.
- In the builder, `RATE` and `fitWords` set how long a reply can be (currently 32 words fit the 21.2 s loop). If you change the read hold, update them and check the export-size math (`ZOOM_TARGET`, `MAX_BYTES`; stay under 20 MB).
- Preview-only things (`scene.hint` slots, `scene.logoHold`) must never reach an export. Exports draw a copy with them off.
- Copy changes belong to wr-copy, and page and UI changes to wr-ui. Stay in the animation.

## How to work
- Before coding a visual change, state the plan: which beat, what moves, when (the `T` keys).
- Preview the master: `python3 source/build.py --name Steve --profile Persuader`, then `node source/cap.js source/waiting_built.html prev preview` (needs `playwright-core`; on a Mac it uses Chrome). Look at the PNGs.
- For a new master cut, render all frames and encode as `source/README.md` says. Don't commit the frames or MP4s, except replacing the featured `Obi waiting room - Steve.mp4` when Steve approves a new version.
- Hand off to wr-qa before anything ships. Add a short version note to `source/NOTES.md`.
