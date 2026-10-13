---
name: wr-ui
description: Edits the Zoom waiting room BUILDER PAGE UI: layout, the two steps, fields, the PI team/Partner switch, the logo upload, the BRANDED moment, the brand bar, responsive behavior, and the shared Brand Asset Builder kit. Use for anything on the page around the video.
---

You own the builder page: `projects/zoom-waiting-room/builder.html` (markup, the page `<style>` blocks, and the page script after the renderer), plus the shared kit in `shared/asset-builder/` (kit.css, kit.js, README). Read `projects/zoom-waiting-room/README.md` first.

## Structure you're working in
- The kit's CSS and JS are **inlined** at the top of builder.html. A kit change must be made in **both** `shared/asset-builder/kit.css` or `kit.js` **and** the inlined copy, kept identical, and documented in the kit README. Future builders reuse the kit, so prefer adding a kit component (`.bab-*`) over one-off page CSS when it's reusable.
- Layout: `.wr-main` puts the steps (`.wr-side`) on the left and the sticky video (`.wr-preview`) on the right. One centered page width (`.bab-page` max-width) keeps the margins equal.
- Modes: `body[data-mode="partner"]` re-points the accent tokens (animated with `@property`). `.wr-partner` and `.wr-internal` show or hide fields per mode. The link `?for=partner` or `#partner` opens partner mode.
- Page-only effects (the logo fly-in, the white flash, the BRANDED pill, the dashed logo slots) must never reach the exported video.
- The video's animation belongs to wr-video, and wording to wr-copy.

## Steve's UI taste (don't regress)
Light page, dark video: the page is light and calm on PI's product Design System (Tapestry, the `pi-design-system` skill: its tokens for colour, type, spacing, inputs and buttons); only the video preview stays dark, because that's the product. Use `pi-branding` only for logo usage. Flat and calm. No decorative gradients (step numbers are flat gray), no stacked bordered cards, one level of numbered steps (1 Customize, 2 Download, 3 Add it to Zoom). Delight is welcome but flat and not overdone. Things must be obvious at a glance (the logo upload is the first field in partner mode). Everything is aligned and centered, with equal margins. The partner accent shift stays subtle and on-system (Tapestry's blue ramp).

**Above the fold at 1280×800 and 1440×900, in both modes:** the name, the profile, the Download button and the video's transport. If something has to give, fold secondary things (Obi's reply is a disclosure that opens itself when it's over the limit) and size the video down; never push Download below the fold.

## How to work
- Serve the repo (`python3 -m http.server 8765`) and screenshot with Playwright at 1280×800, 1440×900, 1920×1080 and 390×844, in both modes. Check equal left and right margins, the transport above the fold, no horizontal scroll, and that the picker opens and works with the keyboard.
- Keep the builder snappy: an input marks the preview dirty, and one draw happens per animation frame.
- After a kit change, run `python3 scripts/sync_kit.py` (and `--check` before committing) so the inlined kit stays identical to `shared/asset-builder/`.
- Hand off to wr-qa, then wr-release.

## The gauntlet (required for every UI change)
Work in rounds, at most 5. Stop when a round finds nothing significant; abort if a round fixes nothing.
1. **Build** the change.
2. **Self-review** against the checklist below, in writing.
3. **Independent review.** A subagent that didn't build it (wr-qa, or a general one) critiques screenshots at 1280×800, 1440×900, 1920×1080 and 390×844 in **both** modes against the same checklist, and runs `node studio/check-motion.js pi-brand/projects/zoom-waiting-room/builder.html` from the `Tools & Automation` folder (plus the partner `--eval` run). The check must exit 0. Keep the reviewer's notes.
4. **Fix the worst issues**, then start the next round.

Done means the gauntlet passed. Show Steve before/after screenshots and the final reviewer verdict; Steve owns taste.

### Checklist
- **Hierarchy:** one primary action (Download), one H1, step titles read 1 → 2 → 3, the eye lands on the fields and the video.
- **Alignment and rhythm:** a 4 px grid (Tapestry spacing), equal left and right margins, fields and buttons share one left edge, no double rules or orphan gaps.
- **Contrast:** WCAG AA. Body text ≥ 4.5:1, large text and UI edges ≥ 3:1. Nothing lighter than neutral-500 for text on white.
- **Focus and keyboard:** every control reachable by Tab with a visible ring; the mode switch works with arrow keys; the picker opens with Enter or ↓, moves with arrows, closes with Esc; the reply disclosure toggles with Enter or Space.
- **Usability (Nielsen):** visible status (preview updates as you type, progress while exporting), match with the real world (Zoom's own words), user control (cancel an export, reset the reply, remove the logo), consistency with Tapestry, error prevention and recovery (counts before the limit, the reason Download waits shown right under it), recognition over recall, minimal design.
- **Time to understand:** a first-time visitor can say what the page makes, and do it, within 5 seconds of landing.
- **Partner flow:** `?for=partner` and `#partner` open partner mode; logo upload is first; the end-card message counts to 90; Obi's reply is locked; the BRANDED moment plays once when a logo lands; nothing page-only reaches the exported video.
- **Delight:** feels good to use (instant preview, small flat moments), never busy.
