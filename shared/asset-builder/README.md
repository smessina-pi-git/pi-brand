# Brand Asset Builder kit

The shared look for PI Brand's builder tools and "video editor" style tools. The Zoom waiting room builder is the first one built on it. The kit provides:

- the branded top bar: the red PI mark, "Brand Asset Builder", a divider, then the tool's name
- light tokens and type from PI's product Design System (Tapestry): white page, purple-tinted neutrals, Roboto, a 4 px grid
- a big sentence-style form, for example "I'm [ Steve ], a [ Persuader ▾ ]."
- numbered steps for a builder's side panel, with labeled fields and numbered lists
- a picker popover
- a mode switch styled as Tapestry Tabs
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
<script>BAB.bar(document.getElementById('bar'), {logo: '../../shared/asset-builder/pi-mark.svg', tool: 'My tool', home: '../../', note: 'Coming soon: …', badge: 'BETA'});  // note and badge are optional</script>
```

**A self-contained file** (a claude.ai artifact, or anything that must work offline): inline `kit.css` and `kit.js`, and pass the logo as a data URI. The Zoom waiting room builder does this. After changing the kit here, run `python3 scripts/sync_kit.py` from the repo root: it copies the kit into every inlined builder, and `--check` fails if a copy has drifted. Then republish the tool.

## Building blocks

- **Sentence form.** An `<h1 class="bab-sentence">` with inline slots:
  - name slot: `<span class="bab-slot"><input class="bab-input"></span>`, then `BAB.autosize(input)` so the field grows with the text
  - picker slot: `<span class="bab-slot"><button class="bab-pick">…<svg class="bab-chev">…</svg></button></span>`
  - Focus thickens the slot's underline in the accent colour. Add `bab-active` to a slot to show that state without focus, for example on first load.
- **Steps.** The builder layout: the preview on the left, steps on the right. Each step is a `<section class="bab-step">` with a `.bab-step-head` (`.bab-step-num` badge plus `<h2 class="bab-step-title">`). Inside a step:
  - Fields are `.bab-field`: a `.bab-label`, then a `.bab-control` (a text input, or a `.bab-control.bab-pick` button for the picker, with its `.bab-pop` inside the same field).
  - Instructions are a `.bab-subtitle` over an `<ol class="bab-steps">`, with numbered dots.
  - Steps are open sections split by a rule, with flat gray number badges (no gradients). The Zoom waiting room builder puts three steps on the left ("Customize your video", "Download your video", "Add it to Zoom") and the live preview on the right.
  - Fields follow Tapestry's TextField: a bold 14 px label, a 48 px control with a 6 px radius and an edge that turns accent on focus. The edge is neutral-400 (`--bab-edge`, 3.4:1 on white) rather than Tapestry's `border-primary` neutral-100 (1.5:1), so fields meet WCAG 1.4.11; dividers keep `border-primary`. `.bab-labelrow` puts a hint or count at the right end of the label row. `.bab-invalid` gives a control the error edge.
- **Modes.** Set `data-mode` on `<body>`. `partner` re-points the accent tokens (`--bab-accent`, `-hi`, `-lo`, `-soft`, `-line`: primary button, focus, tabs, BETA chip) from Tapestry primary-800 purple to Tapestry blue-700, and the colours ease because they're registered with `@property`. Pair it with a `.bab-seg` switch.
- **Mode switch.** `<div class="bab-seg" role="radiogroup">` with `<button role="radio" aria-checked>` children. It looks like Tapestry Tabs (rules above and below, a 4 px accent bar and semibold label on the chosen one) but keeps radio semantics and arrow keys.
- **File drop.** `<label class="bab-drop">` wrapping a hidden file input, with an optional `.bab-thumb` preview. Read files locally; nothing is uploaded. `.bab-check` is a small checkbox row.
- **Picker.** `BAB.picker(button, popEl, {items: [{value, label, icon}], value, onChange, label})`. Place `popEl` (a `.bab-pop`) inside a `position: relative` container.
  - It's a keyboard-accessible listbox: arrow keys, Home/End, typing a letter, Enter or Space, and Esc.
  - It returns `{set, close, disable, value}`.
  - Use `BAB.swap(el, text)` to animate a value that changes in the sentence.
- **Buttons.**
  - `.bab-btn.bab-primary` is Tapestry Primary (accent fill), for the one main action. Add `.bab-lg` for the 48 px size.
  - `.bab-btn` is Tapestry Secondary (white, accent edge and label), for the rest. `.bab-tertiary` drops the edge.
  - Disabled buttons are neutral-100 with neutral-600 text (the Tapestry spec's neutral-300 label is too faint to read).
  - Put `.bab-nudge` on an SVG group for a gentle bounce, for example the upload arrow.
- **Text.**
  - `.bab-card` holds a group (Tapestry Card Container: 1 px border, 8 px radius). Prefer open sections over cards.
  - `.bab-label` and `.bab-hint` go with `.bab-text`, a textarea with an accent edge on focus.
  - `.bab-fineprint` is for small, quiet disclaimers.
- **Preview.**
  - `.bab-frame` contains `.bab-frame-bar` (the window chrome) and `.bab-frame-body` (holding a 16:9 `canvas` or `video`).
  - Below the frame, `.bab-transport` holds `.bab-play`, `.bab-scrub` and `.bab-time`.
  - `.bab-progress` holds a `.bab-meter` with an `<i>` inside, plus a `.bab-row`.

## Rules

- Light, on PI's product Design System (the `pi-design-system` skill, Tapestry). Use the `--bab-*` tokens in `kit.css`; each names its Tapestry token. Primary-800 `#5000A8` marks the one primary action; focus is a 2 px primary-500 ring. PI red `#EF3340` is only for the PI mark (logo usage follows `pi-branding`); errors use Tapestry's system-error `#DA0C35`.
- The thing a tool previews (a video, an image) keeps its own look. The Zoom waiting room video stays dark inside the light page.
- No decorative gradients, glows or stacked cards.
- The page should respond instantly: change state, mark the preview dirty, and draw once on the next animation frame.
- All motion is short (≤ .3 s) and is switched off under `prefers-reduced-motion`.
