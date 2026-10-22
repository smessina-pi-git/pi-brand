# Zoom Waiting Room: start here

A builder where someone types their name, picks their PI Reference Profile, and downloads a looping Obi waiting-room video for Zoom. Partner mode lets a PI partner add their logo and their own end-card message.

- **Live builder:** https://smessina-pi-git.github.io/pi-brand/projects/zoom-waiting-room/builder.html
- **Partner link:** `builder.html?for=partner`. On the claude.ai artifact copy, use `#partner`, because claude.ai drops `?` queries.
- **Owner:** Steve Messina (PI Brand Marketing). Steve owns taste; machines own mechanics.

## Who edits what

Each piece has a named agent in `.claude/agents/`. Ask for the agent by name ("use wr-video to …"), or describe the change and the matching agent picks it up.

| Piece | Files | Agent |
|---|---|---|
| **The video**: the animation itself (title intro, typing, Obi bubble, end card, background, timing, loop) | `source/waiting.html` (the master) **and** the canvas renderer inside `builder.html` (the `root.WaitingRoom` block). Users download from the renderer. | `wr-video` |
| **The builder UI**: layout, the two steps, partner mode, logo upload, the "branded" moment, the bar | `builder.html` (page markup, CSS, page JS) and `../../shared/asset-builder/` (the shared kit) | `wr-ui` |
| **Copy**: the 17 Obi replies, the typed question, page text, upload steps, the partner default message | `PROFILES` and `QUESTION` in `builder.html`; `QUESTION`/`REPLY` in `source/waiting.html` | `wr-copy` |
| **QA**: checks only, never edits | runs the motion check, screenshots, test exports | `wr-qa` |
| **Release**: publishing | public-repo scan, commit and push, the GitHub Pages check, the artifact sync, the notes | `wr-release` |

Usual flow: **edit** (wr-video, wr-ui or wr-copy) → **check** (wr-qa) → **ship** (wr-release).

## Current state (video v16, builder light + smooth pass, 2026-10-22)

- **Video v16:** a 2:1 frame (2160×1080) so it fills Zoom's waiting room with no empty sides, a very faint static glow behind the text, and quicker typing and reply (details in `source/NOTES.md`). v15 brought the larger chat copy, taller input box and Obi bubble.
- **Loop:** 19.8 s at 2160×1080, 30 fps. Every frame is a pure function of time, and the first frame equals the last.
- **Sequence:**
  - glowing title "Behavioral intelligence / *for this meeting…*"
  - the ellipsis dots fly into the input box and become the caret
  - the question types at a steady pace: "I'm about to meet with {name}. Help me prepare for the meeting before I leave this waiting room."
  - Obi replies in a speech bubble: "{name}'s a {Profile}, which means {name} …"
  - end card: "Obi by [PI logo]", or in partner mode, the partner's message over their logo
  - the end card dissolves back into the bloom the title rises from
- **Timings** live in `T` (the same values in both files). The ambient periods are fractions of LOOP, so the seam always closes.
- **Export:** in-browser H.264 at level 5.0 (2160×1080 is over level 4's frame-size limit). It targets about 17 MB, never more than 19 MB, because Zoom is safest under 20 MB. A hardware export takes about 3.5 s.
- **Builder:** a light UI on PI's Design System (the `pi-design-system` skill), with the live video kept dark. Clear numbered steps on the left and the video on the right.
  - The audience switch is two pills, “I’m a PIoneer” and “I’m a Partner”: the chosen one is filled, the other outlined.
  - Fields reveal smoothly.
  - Download fills with a percentage, then shows "Saved ✓", and the steps check off as you go.
  - Partner mode gets a logo upload (the first field), an end-card message (90 characters), a locked Obi reply, and the flat "BRANDED" moment.
- **Seeing an old version?** GitHub Pages lets browsers cache for 10 minutes, so hard-refresh (Cmd+Shift+R).

## Steve's rules (from his feedback; don't regress these)

- Everything centered. One message on screen at a time. Nothing moves while text is being read.
- One 60 px text size for the question and the reply (v15; 44 px before), in a 1600 px column. Typing is steady per character, never eased.
- Near-black background with haze and drifting lights over a faint dot grid: never dead flat, never a gray wash.
- Obi's reply is a friendly speech bubble that carries the input box's blue → purple edge and glow. Those Obi gradients belong to Obi's box and bubble only.
- Builder UI: light and minimal on PI's Design System; flat, calm, no decorative gradients (the step numbers are flat gray), no stacked cards. Delight is welcome but flat and not overdone.
- Copy is gender-neutral (tokens `{name}`, `{profile}`). Obi's words come from Obi output or approved copy. Say "Obi" or "Obi by The Predictive Index".
- Fonts must really load: Roboto, Roboto Serif and Roboto Mono, embedded or installed. A silent fallback is a bug.
- **This repo is public.** Never commit real partner logos, old video cuts, rendered frames, internal links or anyone's personal data.

## Download tracking

Each saved video adds one row to a Google Sheet: time, mode (`partner` or `internal`), profile, a random id for the browser, host and version. The name, logo and message are never sent. **Partners using the tool = distinct `browser` values where `mode` is `partner`.** One partner on two browsers counts twice.

Live since 2026-10-16: the Google Sheet "Waiting room downloads" in Steve's Drive. `Sheet1` holds the counts (partners all-time and last 30 days, partner and PI team downloads); `Downloads` holds the rows. It's written by the Apps Script project "Waiting room download log" (source: `tracking/Code.gs`), deployed as a web app (runs as Steve, access: Anyone). Its `/exec` URL is `LOG_URL` in `builder.html`; empty means tracking is off.

To change the script: edit it in Apps Script, then Deploy → Manage deployments → edit → New version. That keeps the same URL. The URL is public in this repo, so anyone could add junk rows; the script drops rows without a valid mode.

## Checks

- **Motion check** (on Steve's Mac, from the `Tools & Automation` folder above this repo): `node studio/check-motion.js pi-brand/projects/zoom-waiting-room/builder.html`. It must exit 0; then look at the contact sheet. Since v16 the checker's builder shim still assumes 1920×1080, so pass an `--eval` that sets `window.__motion` from `WaitingRoom.W`/`H` (see `source/NOTES.md`, v16), and run the built master with `--size 2160x1080`. For partner mode, pass `--eval` to click the Partner switch and inject a placeholder logo (see `source/NOTES.md`). In a cloud session the studio isn't available: use Playwright screenshots and compare the first and last frames instead.
- **Layout:** screenshots at 1280×800, 1440×900, 1920×1080 and 390×844. Equal left and right margins, the video's transport above the fold, no horizontal scroll.
- **Export:** one real Download in Chrome. Under 20 MB, and the first decoded frame equals the last.

## History

- `source/NOTES.md`: the full design history, v1 → v14 and every builder round (public, with links and paths removed).
- `Waiting Room Generator/HANDOFF.md` (Steve's Google Drive): the same history with private links. Old versions `v1/`–`v14/` live there, not in this repo.
- `Tools & Automation/LOG.md`: what went wrong, and the rule or check it became.
