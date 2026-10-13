# pi-brand: how to publish a project

This repo is the PI Brand launch hub (GitHub Pages, static, no build step).
Live: https://smessina-pi-git.github.io/pi-brand/  ·  Repo: smessina-pi-git/pi-brand

The page renders entirely from `projects.json`. A project is a folder under `projects/<slug>/` plus one manifest entry.

## Add or update a project

1. Build the thing (a self-contained HTML tool, MP4s, a skill ZIP). Single files must stay under 50 MB; for bigger video, host on Drive and link it.
2. Register it. This copies the files into `projects/<slug>/` and writes the manifest entry:

```bash
python3 scripts/add_project.py --slug my-tool --title "My Tool" --category tools \
  --blurb "One plain sentence." --launch /path/to/tool.html --launch-label "Open the tool" \
  --download "Source (ZIP)=/path/to/source.zip" [--video preview.mp4] [--cover cover.png] [--featured]
```

   Categories: `tools`, `videos`, `skills`. `--featured` puts it in the hero. Re-running with the same slug updates it. `--launch` HTML is published as `projects/<slug>/index.html`.
3. Check, preview, publish:

```bash
python3 scripts/add_project.py --check
python3 -m http.server 8000      # look at http://localhost:8000
git add -A && git commit -m "Add <title>" && git push
```

   Pages redeploys from `main` in about a minute.

## Builder tools: use the shared kit

Builder and "video editor" style tools share one look: the Brand Asset Builder kit in `shared/asset-builder/`. It covers the PI logo bar, tokens, the sentence-style form, the picker, buttons, the preview frame and fine print. See `shared/asset-builder/README.md`.

- **Hosted here:** a hosted tool links `../../shared/asset-builder/kit.css` and `kit.js`.
- **Self-contained files:** a file that must stand alone, such as a claude.ai artifact, inlines the kit at build time. The Zoom waiting room builder's `build.py` is the example.
- **Changing the kit:** after a kit change, rebuild and republish the tools that inline it.

## Rules

- Look: dark launch showcase (black, purple #5000A8 actions, blue #33A8D3 haze, PI red #EF3340 only as UI intent). Serif only for the page title. Edit tokens in `css/site.css`.
- Blurbs are one plain sentence. Dates are the ship date, YYYY-MM-DD.
- Tool pages must work from a static host with no server.
- Never commit secrets or customer data.

## Zoom waiting room
- Start with `projects/zoom-waiting-room/README.md`: what it is, the current state, Steve's rules, and which file does what.
- Work goes through named agents in `.claude/agents/`: **wr-video** (the animation), **wr-ui** (the builder page and the shared kit), **wr-copy** (Obi replies and page text), **wr-qa** (checks only, never edits), and **wr-release** (scan, push, Pages, artifact sync, notes). Edit, then check, then ship.
- The video exists twice: `source/waiting.html` (the master) and the canvas renderer inside `builder.html` (what users export). Change both together.
- Public repo: never commit rendered frames, old video cuts, real partner logos, internal links, or anyone's personal data.
