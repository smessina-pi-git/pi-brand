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

## v14 (2026-10-13): shorter loop, step-based builder

- Feedback after launch: the 27.6 s loop felt long for people who are only briefly in a waiting room, and the download felt slow. The loop was retimed to 21.2 s. Only the `T` table changed: a quicker title (in by about 2.2 s, out at 3.2), typing 5.0–9.2 s (4.2 s, still calmer than v12), a read hold sized at about 5 words a second (32 words fit; the Persuader line is 30), and a shorter end card. Caret blink LOOP/52.
- Builder: same timings (`RATE` 5, so `fitWords` is 32). Zoom uploads are safest under 20 MB, so the export targets about 17 MB (`ZOOM_TARGET` 17e6, about 6.4 Mbps at 21.2 s) with a 19 MB ceiling (`MAX_BYTES`). The hardware encoder uses one keyframe per loop, so that budget goes to the dot grid. Measured in Chrome on a Mac with the hardware encoder: 3.7 s and 16.4 MB, down from 8.8 s and 25.2 MB for v13.
- Builder layout: the live video sits front and center on the left. The right column is two numbered steps: 1 Customize your video (first name, Reference Profile picker, Obi's reply) and 2 Download and install (Download video, then "Easy to upload:" with three numbered steps and an Open Zoom settings link). The step, field and list styles (`.bab-step`, `.bab-field`, `.bab-control`, `.bab-steps`, `.bab-subtitle`) live in the shared kit.
- Both pass `studio/check-motion.js`: no font fallbacks, overlaps or out-of-stage text; determinism, seam wrap and seam step pass.
- Builder layout, second pass (2026-10-13): the steps are on the left and the live video on the right (sticky). Steps are open sections split by one rule, not cards. Step numbers are flat gray circles (no gradient), and the "Easy to upload" list uses plain muted numerals, so only the two main steps read as steps. On narrow screens the video comes first. The saved-state key went to `wrb14`, so everyone starts once on Steve / Persuader.

## Partner mode (2026-10-13)

- One builder, two modes: a "PI team | Partner" switch at the top of the steps. Link straight to it with `builder.html?for=partner` (or `#partner`); `?for=internal` forces PI team mode, and otherwise the last-used mode is remembered.
- In partner mode:
  - The UI accent shifts from purple to the PI blue family, animated.
  - The bar reads "Zoom Waiting Room · Partners".
  - Step 1 adds "Your logo" (PNG, SVG or JPG; read in the browser and never uploaded; scaled to 800 px and remembered locally) with an optional light backing for dark logos, and an "End-card message" (default "What would you ask Obi by The Predictive Index? We're here to help you through it.", 90-character limit, red count and a held download over it).
  - Obi's reply is read-only (the approved reply for the profile).
  - Step 2's sign-in note says to use your own Zoom account.
- Video in partner mode: the partner logo top left (fitted to 340×74; the PI logo if there's none), the Obi label at 30 px with a 48 px avatar, and the end card is the partner's message (56 px on a 70 px line, centred) over their logo (fitted to 680×220). The timing and the dissolve back into the bloom are unchanged, so the seam holds.
- Both modes: "Brand Asset Builder" in the bar is now 15 px with a 28 px mark, and the subhead sits under the H1.
- Checked: `studio/check-motion.js` passes in both modes (partner run with a placeholder logo via `--eval`). A partner hardware export took 3.5 s and came out at 16.4 MB.
- Partner logo, made obvious (2026-10-13): in partner mode the logo is the first field in Step 1, a tall accent drop area ("Add your logo", upload icon) that collapses to a thumbnail row once a logo is in. Until then, the preview shows dashed "Your logo" slots in the header and on the end card (`scene.hint`). Exports draw a copy of the scene with `hint: false`, so slots never reach the MP4.
- The "branded" moment (2026-10-13), page only: adding a logo holds the preview on the end card, and the logo lifts out of the drop area and glides into the video, landing where it sits on the end card. The video logo stays hidden until it lands (`scene.logoHold`). Then a thin white line traces the preview frame once (a conic-gradient border driven by a registered `--wr-a` angle), a soft neutral halo glows, and a "✓ BRANDED" glass badge rises under the content and fades. Neutral white, with no colored gradients (Steve). Screen readers hear "Logo added to your video". Reduced motion: badge only. Playback resumes after about 3.4 s. Exports use `hint: false, logoHold: false`.
- The "branded" moment, made flat (2026-10-13): no ring, halo, outline or gradient. When the logo lands there is a brief white flash over the video (opacity 0.14 → 0 over 0.55 s), then a solid white "✓ BRANDED" pill pops in under the content, holds, and fades (about 2.4 s). It is a UI interaction only and never part of the video.

## Builder, light redesign (2026-10-13)

- Feedback: the dark page caused cognitive overload and the video took too much space. The page is now light, on PI's product Design System: a white page, purple-tinted neutrals, Roboto, a 4 px grid, 48 px fields with 6 px corners, primary purple for the one main action. The video preview stays dark, because that's the product. The shared kit (`shared/asset-builder/`) changed with it, and `scripts/sync_kit.py --check` keeps the copy inlined in `builder.html` identical.
- Three steps on the left: 1 Customize your video, 2 Download your video, 3 Add it to Zoom. The video is on the right under "Preview · Updates as you type". Name and profile sit side by side, and Obi's reply folds into a disclosure that names its state (Suggested, Edited, Approved, Too long) and opens itself when the reply is over 37 words. Name, profile, Download and the video transport are above the fold at 1280×800 and 1440×900 in both modes.
- The PI team / Partner switch looks like the Design System's Tabs and keeps radio semantics and arrow keys. Partner mode shifts the accent to the Design System's blue (blue-700), with its own subtitle that mentions the logo. Logo upload stays first, and the flat BRANDED moment is unchanged.
- Errors show next to the field (a red count, edge and line) and again under Download, saying why it waits. Input edges are neutral-400 (3.4:1) rather than the lighter border token, for WCAG 1.4.11.
- Phones: a viewport meta was missing, so phones laid the page out at 980 px. Narrow screens now get one column: Customize, Preview, Download, Zoom.
- Built through the wr-ui gauntlet (now in `.claude/agents/wr-ui.md`): two rounds, with the independent review passing in round 2. `studio/check-motion.js` passes in both modes, and the renderer is unchanged.

## v15 (2026-10-13): larger copy, fuller frame

- Steve: "I want the copy larger. The text box at the beginning of the chat and the Obi reply can both be taller, with more room. There's too much dark space."
- **Type:** one chat size, 60 px on an 84 px line (was 44). Labels ("You", "Obi by The Predictive Index") are 30 px with a 48 px avatar in both modes (the partner sizes became the standard).
- **Column:** 1600 px (stage left 160; was 1280 at left 320), with text inset 64 px in the box and the bubble, so the wrap width is 1472. The default reply wraps to 4 lines and the question to 2.
- **Input box:** 360 px tall (was 250), still centred on y 540. The question sits 52 px below the top. The send button is 84 px (was 68), inset 44 px. The caret is 4 × 66, and the title's dots fly to its new rest point.
- **Obi's bubble:** 1600 wide, 40 px above the text and 38 below. It pops from 180 × 108, with 16 px typing dots. Corners are 40 px with a 10 px tail. The sent bubble keeps 52 px above and below the question.
- **End card:** "Obi by" is 68 px over a 760 px PI logo (was 60 over 660).
- **Partner end card:** 64 px on an 80 px line (was 56). "The Predictive Index" never splits across lines, and lines are balanced (the narrowest width that keeps the line count), so no word sits alone.
- **Fit:** timings are unchanged, so `fitWords` stays 32 (`RATE` 5) and `MAX_WORDS` stays 37. The longest default reply (Scholar) with a long name takes 5 lines; a 34-word custom reply takes 6. If a very long custom reply would push Obi's block above y 160, the builder steps the one shared chat size down 2 px at a time (never below 44 px). Up to 7 lines fit at 60 px.
- **Gauntlet:** three rounds. An independent reviewer found nothing significant after round 1. Fixes along the way: the end-card scale, the partner line breaks, the bubble's bottom padding and the send inset. "Move the chat 40 px below centre" was left for Steve, because it would break the centred rule.
- **Checks:**
  - `studio/check-motion.js` passes on the builder in both modes and on the master: all counters 0; seam step 0.028 (builder) and 0.025 (master).
  - Builder vs master: mean difference 0.3–0.7/255, antialiasing only.
- **Shipped** (2026-10-13, Steve approved): merged to main on top of the builder light redesign (only these notes conflicted), with the featured MP4 replaced by the v15 cut. The motion check passed again on the merged builder in both modes, and the claude.ai copy of the builder was republished from the same commit.

## Builder, smooth pass (2026-10-14)

- Feedback on the light builder: "still too busy", "extra horizontal lines on the left side", "clearly tabs like pills between PI Team and Partner", "make it smooth, delightful".
- No horizontal rules in the steps column: space separates the three steps. The footer note ("About the replies") moved inside Obi's reply and steps aside while the reply is over the limit. "Live preview" sits in the frame bar instead of a header row, and Open Zoom settings is a link.
- PI team / Partner is a pill switch (kit `.bab-seg`): an accent pill slides to the chosen option (CSS `:has()`), labels flip colour as it crosses the middle, and arrows, Home and End move it.
- Motion is flat and only answers what the person did: partner fields open and close (grid rows 0fr↔1fr; a closed field takes no space), Obi's reply unfolds (`::details-content`), the remembered mode loads without animating. Download fills inside the button with a percentage and Cancel, then says "Saved" with a drawn check; step 2's badge ticks and step 3 is tinted as next until the video changes. A direct download gets one status line with "Download again" instead of a second video player. Under reduced motion nothing moves, but the checks and BRANDED still show.
- Built through the wr-ui gauntlet: two rounds, the independent review passed in round 2. `studio/check-motion.js` passes in both modes; the renderer is unchanged. A headless export came out at 16.2 MB.

## v16 (2026-10-22): 2:1 frame, a glow behind the text, quicker typing

- Steve: 16:9 leaves empty room on each side in Zoom; the video reads too dark; typing a little quicker, with the hold after it unchanged.
- **2:1:** the frame is 2160×1080 (was 1920×1080). The height stays 1080, so every type size and the 1600 px chat column hold; the column and title centre on x 1080 (stage left 280). Full-frame pieces span the width: the header rule and its red sweep run 64 → 2096, the status sits 64 from the right edge. The haze's horizontal radius (820 → 922) and the three lights' orbits (`ax` × 1.125) widen with the frame; the bloom is unchanged. Builder: `W = 2160`, `CX = W / 2`, `STAGE_X = (W − STAGE_W) / 2`; the preview canvas is 2160×1080 with `--bab-aspect: 2 / 1` (the kit's frame rule now reads `aspect-ratio: var(--bab-aspect, 16 / 9)`), `sizeView` and the branded logo landing use `WR.W`/`WR.H`.
- **Export:** 2160×1080 is 9180 macroblocks, over H.264 level 4.x (8192/8704), and Chrome rejects `avc1.640028` at that size, so the codec list starts at level 5.0 (`avc1.640032`, `4d0032`, `420032`). Measured headless on a Mac: 3.7 s, 16.5 MB, High@5.0, 20.3 s.
- **Text glow:** a static lilac light (190,170,255, the palette's third ambient light) behind the chat column: an ellipse 1150 × 560 at the frame centre, peak alpha 0.075, `(1 − smoothstep(d))^1.6` falloff, seeded ±1 LSB alpha dither. Drawn once (master `#tglow` canvas above the bloom; builder `getTextGlow()` after the bloom), so it is loop-safe. It lifts the chat column's mean level by about 1–5 /255 (most where the bubble doesn't cover it).
- **Typing:** the question types 27% faster: `typeEnd` 9.2 → 8.3 (3.3 s, was 4.2), the punctuation beats scaled with it. Every beat after `typeEnd` keeps its length and moves 0.9 s earlier, so the holds are unchanged and LOOP is 20.3 s (609 frames; was 21.2). Ambient periods are still LOOP fractions (SWEEP LOOP/10, PULSE LOOP/16, caret LOOP/52, 32 dot steps); `fitWords` stays 32 and `MAX_WORDS` 37. Obi's word-by-word reveal (0.075 s a word) is unchanged.
- **Checks:** `studio/check-motion.js` passes on the built master (`--size 2160x1080`) and on the builder in both modes (with an `--eval` that sets `__motion` at 2160×1080): all counters 0, seam step 0.026 (master) and 0.029 (builder). Builder vs master: mean difference 0.23–0.63 /255.
- **v16b, a quicker reply (same day):** Obi's words come in 27% faster too: 0.0589 s a word (was 0.075), with the same 0.5 s fade per word. A 32-word reply (the fit capacity) lands 0.5 s sooner (31 gaps × 0.0161 s). `out0` and every later beat move 0.5 s earlier, so the hold after the last word is unchanged: exactly for 32 words, and within 2 frames for 28–37. LOOP is 19.8 s (594 frames). Fit math: the builder measures fit against `FIT_END = out0 + 0.8` (v16's reading window end, out0 + 0.3, plus the 0.5 s saved), so `fitWords` stays 32, `MAX_WORDS` stays 37, and a longer reply extends the loop in 0.8 s steps exactly as before. The export cap is now about 6.9 Mbps. The check passes on the built master and on the builder in both modes (all counters 0; seam step 0.026 master, 0.029 builder).
- **Audience pills (same release):** the PI team / Partner switch is now two larger pills, "I’m a PIoneer" and "I’m a Partner" (Design System Button lg: 48 px, 18/27 SemiBold). The chosen one is filled, the other outlined; same radio semantics and arrow keys, no sliding track. The finished-video player is 2:1 too.
- **Released after wr-qa:** motion check exit 0 on the master and on the builder in both modes; layout clean at 1280, 1440, 1920 and 390 wide; two real Chrome exports at 16.59 and 16.55 MB, 2160×1080, 19.8 s.
