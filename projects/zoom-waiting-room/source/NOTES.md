# Waiting room video: design history

Version-by-version notes from building the video (v1 to v13). Private links and machine paths removed.

# Waiting Room Generator — handoff

Context for a fresh chat. Everything below is the current state as of 2026-10-08.

## What exists

1. **Obi Chat Animator** (Claude artifact, shared with PI org): paste User/Obi lines, get a Lottie JSON, MP4, or still PNG in the Obi input-box style (light, lavender, 1080×1080 and 1080×1350). Source zip was delivered separately (`obi-chat-animator.zip`): `src/generator.js` builds the Lottie from scratch; `scripts/build.py` assembles the page.
2. **Zoom waiting room video** for Steve (this folder): `Obi waiting room - Steve.mp4` — 1920×1080, 30 fps, 24 s seamless loop, H.264, ~1.1 MB. Built from `v1/source/waiting.html`.

## How the waiting room video is built

- `waiting.html` is a single page with a `seek(t)` function. Every element's state is a pure function of time t (seconds), so frames are deterministic.
- `cap.js` (Playwright + Chromium) calls `seek(i/30)` for i = 0..719 and screenshots each frame; ffmpeg encodes `libx264 -pix_fmt yuv420p -crf 20`.
- Placeholders `__LOGO__`, `__ICON__`, `__CIRCLE__` are replaced with base64 assets (PI white logo PNG, Persuader icon PNG cropped from the Reference Profile set, PI red circle SVG) to make `waiting_built.html`.
- Fonts: Roboto, Roboto Serif, Roboto Mono from the pi-branding skill bundle, installed system-wide before rendering.

## Timeline (seconds, LOOP = 24)

| t | what |
|---|---|
| 0.3–1.0 | header + box fade/rise in |
| 1.6–4.4 | question types in (purple caret) |
| 4.7 | send press |
| 5.0–5.6 | box → bubble morph; gradient border and glow fade; "You" label |
| 5.8 | "Obi by The Predictive Index" + red mark |
| 6.1–8.4 | reply words fade in, 0.11 s apart; "Persuader" bold |
| 13.4–14.1 | chat fades out |
| 14.0–15.3 | 8 red hairlines draw in from the edges, converge, collapse |
| 15.1–15.9 | Persuader icon irises open at center (220px); label settles |
| 18.3–18.9 | icon out |
| 19.2–19.9 | "Meeting initiating" (serif) in; dot-ring loader |
| 20.5 | "Steve will let you in shortly." rises in |
| 22.7–23.4 | out; t=24 == t=0 |

All timings live in the `T` object in the script.

## Design decisions

- Dark theme from PI Brand Design tokens: surface #181818, soft #24221F, ink #FFF, muted #AAA69E, rule #45433F, red #EF3340.
- Obi product styling kept on the input box only: purple→blue gradient border (#6A3BD8→#3DA3EE), soft glow, purple caret and send (#4908A0). A faint purple/blue radial glow sits behind the whole frame and breathes.
- Serif (Roboto Serif Medium) only on the two titles. Mono only on the "Meeting initiating…" status. Everything else Roboto.
- Loading is indeterminate, not a progress bar, because it loops: a red sweep travels along the top hairline every 2.4 s, the status dot emits a pulse ring every 1.6 s, and the interstitial uses a 12-dot ring.
- Names in copy are bold, no @.

## Next step Steve wants

Build a tool (like the chat animator) where someone enters their own name, Reference Profile, question, and Obi reply via JSON or a form, and gets their own waiting room MP4. The natural path: parameterize `waiting.html` (name, profile icon, question, reply, "let you in" line), then either render server-side with the same Playwright pipeline or in-browser with WebCodecs the way the chat animator does. The 17 Reference Profile icons are in the pi-branding skill under `assets/reference-profiles/`.

## Open items

- Confirm the loop plays cleanly in Zoom's waiting room setting (Zoom re-encodes uploads).
- Steve's photo is not used in this cut; the chat animator supports an asker photo if wanted.

## v3 (2026-10-08)

- `v3/source/`: `waiting.html`, `build.py` (inlines the assets), `cap.js` (playwright-core driving local Google Chrome), `Persuader_icon.png` (Persuader.png with its built-in label cropped off).
- Box border and glow go from blue #33A8D3 to purple #5000A8; the send button is #5000A8.
- Opens on the empty box, and typing starts at 0.3 s. There's no intro line any more.
- Obi's reply: "Persuaders are energized by people, influence, and the chance to talk ideas through. Make space for dialogue and connect the topic to a compelling outcome."
- Ending: the Persuader card with "**Steve** will let you in shortly." Then the empty box rises back in, so the last frame matches the first.
- LOOP = 14.4 s, which every ambient cycle divides evenly. The sent bubble is sized to the question's real wrapped height.
- Build: `python3 build.py waiting.html <pi-branding/assets> waiting_built.html`, then `node cap.js waiting_built.html frames`, then encode with `ffmpeg -framerate 30 -i frames/f%04d.png -c:v libx264 -pix_fmt yuv420p -crf 20`.

## v4 (2026-10-08)

- The box gradient drifts: its angle sways ±16°, the blue/purple blend point slides, and the glow follows. All of these motions repeat evenly within the loop.
- The red hairlines are gone. Transition: as the chat fades, the bold profile word ("Persuaders") glides to the center of the frame, grows, and dissolves into the icon. The icon is 240 px, dead center, with no text, and grows in with a slight overshoot while one red ring pulses outward.
- Timings are in `T`: pw0/pw1 (word glide), ic0/ic1 (icon), ring0/ring1.

## v5 (2026-10-08)

- Loop: the icon opens out into the empty input box (the box grows from icon size at frame center to full size, the icon fades inside it), and the caret blinks for about a second. That end state is the frame-0 state, so the video loops with no seam.
- Prompt template: "I'm in {name}'s waiting room, and we are about to meet. How should I prepare?" It's gender-neutral. The reply template starts with "{profile}s ...". Both live in `QUESTION` / `REPLY` at the top of the script.
- `build.py --name Steve --profile Persuader` fills the tokens and picks `reference-profiles/<Profile>.png`, auto-cropping the name label under the badge. It needs Pillow.
- The bold word that glides into the icon is the first reply word that starts with the profile name.

## v6 (2026-10-08)

- Crisp: pure black background, neutral greys, no background radial haze; the box glow is tighter.
- No Reference Profile icon. The chat clears and resolves into the red PI logo (PI_Logo_Full_White-Text.png) at the center, and the header logo steps aside meanwhile. The logo then fades and the input box opens out from the center: the last frame is the first.
- `--profile` now only sets which word in the reply is bold.

## v7 (2026-10-08)

- v6 plus the purple/blue background haze. Everything else is unchanged from v6: pacing, the PI logo resolve, and the box opening back out.
- `#glow` is a full-frame `<canvas>` behind everything, drawn once at load. Its ellipse has an 820×520 px radius, and its falloff eases twice: a smoothstep raised to the power 1.7, with a core level of 0.40. The colour blends from a purple core (#5000A8) to a blue fringe (#33A8D3). A triangular ±1 LSB dither breaks up banding. Outside the ellipse the canvas is exactly 0, so edges and corners stay true #000 (checked on rendered and decoded frames).
- The haze follows the action. It sits at 0.72 while typing and swells to 1.0 as Obi answers (morph0 → words0+1 s). It eases down to 0.58 for the PI logo (out0−0.2 s → mk1) and returns to 0.72 as the box opens (back0 → back1+0.2 s). On top of that is a ±7% breath twice per loop. Both ends of the loop are flat, so there is no step at the seam.
- Output: `v7/Obi waiting room - Steve.mp4` (and a copy in `Claude outputs/`).

## Builder (2026-10-08, updated to v13 on 2026-10-09)

- Page (2026-10-09 round): built on the shared Brand Asset Builder kit (`pi-brand/shared/asset-builder/`: kit.css, kit.js, README), which `scripts/build.py` inlines (`--kit` to point elsewhere). It has:
  - a branded bar at the top: the red PI mark, "Brand Asset Builder", a divider, then "Zoom Waiting Room" (the mark is also the favicon; the page title is "Zoom Waiting Room · Brand Asset Builder")
  - the input up front as one big sentence, "I'm [ Steve ], a [ Persuader ▾ ].": the name field sizes to its text, and the picker is a keyboard-accessible popover with all 17 profile icons; a/an follows the profile, and changes animate
  - the live preview (inside a waiting-room window) directly under the sentence, with Download video (purple) and Upload to Zoom beside it and Obi's reply editor below them
  - layout (pi-brand d8e9065): no eyebrow; the sentence is clamp(28px, 4vw, 50px)/1.2; the top spacing is tighter; .wr-main is capped at max(760px, (100vh − 424px)·16/9 + 416px), so the video, transport and sidebar sit above the fold at 1280×800, 1440×900 and 1920×1080 (checked: the builder/ build is pixel-identical to the live Pages page at all three)
  - minimal dark preview window (pi-brand 5d9b7fd, replacing the light window from e1f3d6e, which Steve didn't like): a gray title bar (#2a2a30), a #141418 body with 10/12 px padding, and a soft violet glow on the canvas. The kit's `BAB.bar()` takes an optional `badge`; the builder passes 'BETA', a small pill at the top right
  - Upload to Zoom (pi-brand 676a68b): the button toggles an inline steps panel (#zoomGuide) whose "Open Zoom settings" link goes to https://zoom.us/profile/setting?tab=meeting, through Zoom's own sign-in (SSO "predictiveindex" or Google). The old predictiveindex.zoom.us link sent signed-out users to Google SAML and a bare 403. The picker chevron is more visible. Checked in claude.ai (version 25): clicking the link from inside the artifact makes a new-tab request to zoom.us (the artifact sandbox allows it).
  - bar note and Zoom path (pi-brand 1b6a6f6, d8a4937): `BAB.bar()` takes an optional `note`; the builder shows "Coming soon: Feature Specific Video, Custom Styling, Dept. Specific Messaging, and more." (hidden under 900 px). The Zoom steps and the footer spell out Settings › Meeting › Security.
  - Since version 26, the artifact is published straight from pi-brand's `projects/zoom-waiting-room/builder.html` (byte-identical inside claude.ai's page wrapper), so the artifact and Pages can't drift. `builder/src` mirrors every change and renders the same page; it differs from that file only by the kit drift below.
  - kit drift: pi-brand's `shared/asset-builder/kit.css` still has the older spacing and sentence size; only the live builder.html's inline copy has the new values. builder/ carries them as page-level overrides in its template until the kit file catches up.
  - side-panel cleanup (pi-brand bd89c4f): no how-to hint or spec row. Under the reply sits a right-aligned "n / 37 words" count (MAX_WORDS 37); over the limit it turns red and Download is disabled. The subhead ends "Customize your Waiting Room in Zoom."
  - a quiet disclaimer under the reply editor: "Do not input text that disregards PI science. Always use Obi output for text shown here. You are responsible for what is put here."
  - a stacked layout on narrow screens
  - checked at 1440×900 and 390×844, including picker keyboard use and an export through the new UI
- The animation is a canvas port of `v13/source/waiting.html` (`builder/src/renderer.js`), copied into `builder/v13-source/` as the reference. It includes:
  - the title intro: per-letter glide-in with blur and the gradient fill, the light sweep, and the glow copies over the bloom
  - the ellipsis dots arcing into the caret, and the box wiping open behind the light edge
  - the slower pacing (LOOP 27.6; SWEEP LOOP/10, PULSE LOOP/16, caret blink LOOP/68)
  - Obi's bubble and the scroll to y 540
  - the end card dissolving back into the bloom
  - {name} and {profile} flow through the question and the reply as before
- Frame comparison against the v13 DOM render (Steve/Persuader, 20 times across the loop): at most 0.73/255 mean per pixel.
- The title faces are embedded as 9 KB subsets in `builder/fonts/`. Chrome on Steve's Mac renders v13's title with the static RobotoSerif-Medium (line 1) and RobotoSerif_120pt-ExtraLightItalic (line 2), found by matching per-letter widths. Google's variable Roboto Serif renders 9% narrower at 124 px, so it isn't used for the title.
- Speed: the title's per-letter layout is measured once and cached; it isn't rebuilt on name or profile changes. Each letter's gradient sprite and each line's blurred glow copy are also cached. During the title, a preview frame costs about 21 ms in headless Chrome without a GPU; later frames cost less. Edits still only mark the preview dirty (input handler about 0.7 ms).
- Copy: QUESTION "I'm about to meet with {name}. Help me prepare for the meeting before I leave this waiting room." The 17 replies in `builder/src/profiles.js` follow "{name}'s a/an {Profile}, which means {name} …". They use no pronouns, are 28–31 words each, and bold only the profile word, not its punctuation.
- Reply edits are stored per profile as {name} templates, so renaming later still updates the reply. At about 4.2 words a second, 32 words fit the 27.6 s loop; a longer reply grows the hold in 0.8 s steps, and all ambient periods stay fractions of LOOP.
- Long content: the question wraps at 1120 px, and the box grows past 3 lines while staying centred on y 540. The reply wraps at 1180 px inside the bubble, and the bubble stays centred on y 540 whatever its height.
- Speed:
  - The preview draws at the size it's shown on screen (about 700 px wide, 7.9 ms a frame in headless Chrome, against 48 ms at full size).
  - Edits only mark the preview dirty, so the input handler takes 0.35 ms and the next animation frame draws once.
  - Exports always draw full 1920×1080 frames.
- Export (2026-10-09 fix: Zoom rejected a file over 30 MB): WebCodecs + mp4-muxer.
  - The bitrate is capped to fit about 26 MB over the loop (`ZOOM_TARGET`; about 7.5 Mbps at 27.6 s).
  - The hardware encoder puts a keyframe every 10 s; the software encoder puts one at the start.
  - A file over 29 MB (`MAX_BYTES`) is re-encoded at 0.72× bitrate, up to 3 attempts.
  - Results: hardware 26.1 MB (checked in Chrome by the other session); software 5.7 MB at 7.54 Mbps on the first attempt (checked headless here).
  - The page also declares `<meta charset="utf-8">`, so "Steve’s" no longer garbles when the page is served without a charset header.
- Checked exports (`builder/test-exports/`), Steve/Persuader and Jordan/Guardian, v13, both made in headless Chrome, so through the software encoder: H.264 High, 828 frames, 27.60 s, about 5.9 MB, about 55 s each without a GPU. The seam is clean on lossless frames: last→first differs by 0.018/255, the same as a normal frame step (0.014/255). In the encoded files the last→first step is 0.74/255, from the software encoder's single keyframe.
- Rebuild: `python3 builder/scripts/build.py`, then republish `builder/dist/waiting-room-builder.html` to the same URL. Details in `builder/README.md`.

## v8 (2026-10-08)

- Built on v7 (with the haze). LOOP is now 16 s. Typing takes 0.5 s longer (typeStart .35 → typeEnd 3.45), and Obi's reply stays on screen 1 s longer (out0 11.1). The ambient periods are fractions of LOOP instead of fixed numbers: SWEEP=LOOP/6, PULSE=LOOP/10, and 32 dot steps.
- New `#amb` canvas under the haze. Three soft lights (purple, blue, lilac) drift on closed orbits, one or two turns per loop. They tint the black at about 16%, and they light a fine 36 px dot grid that sits faintly silver everywhere and brightens and tints where the lights pass. The result: the background is never dead flat, and the edges are near-black rather than #000.
- Encode: `-crf 16 -tune grain`, so the dot grid survives H.264 (about 2.6 MB).
- The builder was later ported to v13 (see the Builder section).

## v9 (2026-10-08)

- v8 with one type size for the chat. The question and Obi's reply are both 44 px with line-height 1.4 (`--chat`). Labels ("You", "Obi by The Predictive Index") went up from 20 to 24 px so they read at Zoom size. The reply is 1100 px wide.

## v10 (2026-10-08): readability pass

- Typing is steady. The question is typed at an even rate per character (the `KT` keystroke table) with a short beat after punctuation. v9 eased the whole string with eio, so typing crawled at the start and raced through the middle.
- The sent message no longer moves. The input box and the bubble share top 376. On send, the box only drops its empty lower half; there's no jump up.
- One text column: "You", the question, the Obi label, and the reply all start 44 px in from the box edge. The exchange sits near optical center under the header.
- The slow upward drift during the read is gone, and the haze no longer swells behind the reply (flat at 0.72, dipping for the logo).
- The PI logo and the reopening box share the box's center (y 501), so the handoff is concentric.

## v11 (2026-10-08): friendly Obi reply

- Obi replies in a speech bubble. The avatar is 40 px with the name next to it. Below it, a rounded bubble (32 px corners, a tight 8 px "tail" corner under the avatar) with a dark fill (#100D19) and the input box's own drifting blue → purple gradient edge and glow, sharing the same --ga/--gs/--gx/--gy variables. The glow leaves the input on send and arrives on Obi's reply.
- Sequence: the label and a small bubble pop in from the tail corner with a gentle overshoot (obi 4.55). Three typing dots bounce in it, then it opens out to fit the reply (grow0 5.25 → grow1 5.7), and the words follow (words0 5.55, 0.06 s apart). The bubble size is measured from the laid-out reply.
- The user's sent message softens into a rounded bubble (28 px, with a tighter bottom-right corner) and a slightly lighter fill.
- The exchange moved up (box top 340), so the 4-line reply bubble fits. The logo and the reopening box share center y 465.
- Copy (v11): QUESTION = "I'm about to meet with {name}. Help me prepare for the meeting before I leave this waiting room." REPLY = "{name}'s a {profile}, which means {name} is energized by … compelling outcome." The name is repeated instead of a pronoun. Only the profile word is bold, not its punctuation (`#a b`).
- The chat column is wider: the stage is 1280 px (left 320), the question is 1120 px, and the reply bubble is 1260 px, so the copy runs 2 + 4 lines. LOOP is 17.2 s (+0.6 s typing, +0.6 s reading). The caret blink period is LOOP/44, so the blink also closes on the seam.

## v12 (2026-10-08): one message at a time

- Once Obi's typing dots are up, the conversation scrolls (scroll0 5.7 → scroll1 6.35): the question and "You" slide up and fade out, and Obi's label and bubble land centered under the header (block center y 600). The bubble opens during the scroll (grow1 6.35), and the words start only after it settles (words0 6.35). Nothing moves while the reply is being read.
- Centered (v12): the input box is centered on the frame (top 415, center y 540). Obi's block scrolls to center y 540. The end card is "Obi by" (60 px Roboto Medium) above a 660 px PI logo, centered as a pair on the frame. The returning box grows from 560×240 at center y 540 back to the opening frame's box, so the loop stays seamless.

## v13 (2026-10-09): title intro, slower pacing

- LOOP is 27.6 s (SWEEP=LOOP/10, PULSE=LOOP/16, caret blink LOOP/68).
- **Title** (0.3–4.75): "Behavioral intelligence" (Roboto Serif 500, 124 px) over "*for this meeting*" (Roboto Serif 300 italic, with a lavender → sky gradient). The text is per-character spans. Each letter glides in from a 16 px blur, rising 42 px and tracking in toward the center. Each letter's gradient is offset by its x, so a line reads as one continuous fill. A light sweep crosses the lines at 2.95–4.15. Behind them sit a blurred glow copy (violet; blue for line 2) and `#bloom`, a big soft radial with 17 eased stops and no visible rim.
- **Ellipsis → caret:** three glowing dots pop in after "meeting" (2.5 s), then bounce like Obi's typing dots. The title lifts away word by word (blur up, 4.75), and the dots arc on a quadratic bezier into the input box's caret position (4.85–5.75). The box then draws open left → right with a clip-path wipe, led by a glowing vertical edge (`#edge`, 5.72–6.65). Send pops in as the box lands.
- **Slower:** typing 6.85–12.35 (5.5 s). Obi's dots hold about 0.9 s. The scroll and bubble open run 14.55–15.45. Words are 0.085 s apart with a 0.5 s fade. The reply stays up until 23.0.
- **Loop:** the "Obi by" card shrinks and blurs back into the bloom (26.35–27.25). Bloom level is 0.3 at the seam, so the title rises out of the same light the card dissolves into. Mean pixel difference between the first and last frame is about 0.02.
