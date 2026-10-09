# Brand Asset Builder kit

The shared look for PI Brand's builder tools and "video editor" style tools. The Zoom waiting room builder is the first one built on it. The kit provides:

- the branded top bar: the red PI mark, "Brand Asset Builder", a divider, then the tool's name
- the dark tokens and type
- a big sentence-style form, for example "I'm [ Steve ], a [ Persuader ▾ ]."
- a picker popover
- buttons, cards and text fields
- small, muted fine print
- a preview frame with a play and scrub row
- a progress meter

| File | What it is |
|---|---|
| `kit.css` | Tokens and components. Everything is prefixed `bab-`, and the base resets use `:where()`, so a tool's own CSS always wins. |
| `kit.js` | No dependencies. `BAB.bar()`, `BAB.autosize()`, `BAB.picker()`, `BAB.swap()`. |
| `pi-mark.svg` | The red PI mark for the bar (shown at 24 px) and the favicon. |

## Use it in a new tool

**Hosted on this site** (`projects/<slug>/index.html`): link the files relatively, and load Roboto. The hub's fonts are in `/fonts`, or use Google Fonts.

```html
<link rel="stylesheet" href="../../shared/asset-builder/kit.css">
<body class="bab">
<header id="bar"></header>
<div class="bab-page"> … </div>
<script src="../../shared/asset-builder/kit.js"></script>
<script>BAB.bar(document.getElementById('bar'), {logo: '../../shared/asset-builder/pi-mark.svg', tool: 'My tool', home: '../../'});</script>
```

**A self-contained file** (a claude.ai artifact, or anything that must work offline): inline `kit.css` and `kit.js` at build time, and pass the logo as a data URI. The Zoom waiting room builder does this. Its `scripts/build.py` reads this folder (`--kit <path>`) and fills `__KIT_CSS__` and `__KIT_JS__` in its page template. Change the kit here, rebuild the tool, then republish it.

## Building blocks

- **Sentence form.** An `<h1 class="bab-sentence">` with inline slots:
  - name slot: `<span class="bab-slot"><input class="bab-input"></span>`, then `BAB.autosize(input)` so the field grows with the text
  - picker slot: `<span class="bab-slot"><button class="bab-pick">…<svg class="bab-chev">…</svg></button></span>`
  - Focus lights the slot's underline with the blue → purple edge. Add `bab-active` to a slot to show that state without focus, for example on first load.
- **Picker.** `BAB.picker(button, popEl, {items: [{value, label, icon}], value, onChange, label})`. Place `popEl` (a `.bab-pop`) inside a `position: relative` container.
  - It's a keyboard-accessible listbox: arrow keys, Home/End, typing a letter, Enter or Space, and Esc.
  - It returns `{set, close, disable, value}`.
  - Use `BAB.swap(el, text)` to animate a value that changes in the sentence.
- **Buttons.**
  - `.bab-btn.bab-primary` is purple, for the one main action.
  - `.bab-btn` is outlined, for the rest.
  - Put `.bab-nudge` on an SVG group for a gentle bounce, for example the upload arrow.
- **Text.**
  - `.bab-card` holds a group.
  - `.bab-label` and `.bab-hint` go with `.bab-text`, a textarea with the glow on focus.
  - `.bab-fineprint` is for small, quiet disclaimers.
- **Preview.**
  - `.bab-frame` contains `.bab-frame-bar` (the window chrome) and `.bab-frame-body` (holding a 16:9 `canvas` or `video`).
  - Below the frame, `.bab-transport` holds `.bab-play`, `.bab-scrub` and `.bab-time`.
  - `.bab-progress` holds a `.bab-meter` with an `<i>` inside, plus a `.bab-row`.

## Rules

- Dark only. Purple `#5000A8` marks the one primary action, blue → purple marks focus and live edges, and PI red `#EF3340` is only for UI intent (keyboard focus rings, links).
- The page should respond instantly: change state, mark the preview dirty, and draw once on the next animation frame.
- All motion is short (≤ .3 s) and is switched off under `prefers-reduced-motion`.
