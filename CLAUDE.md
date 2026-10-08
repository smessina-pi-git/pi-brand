# pi-brand: how to publish a project

This repo is the PI Brand launch hub (GitHub Pages, static, no build step).
Live: https://smessina-pi-git.github.io/pi-brand/  ·  Repo: smessina-pi-git/pi-brand
Local: `Shared drives/Marketing/Brand Marketing/05_Marketing Operations/Tools & Automation/pi-brand`

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

## Rules

- Look: dark launch showcase (black, purple #5000A8 actions, blue #33A8D3 haze, PI red #EF3340 only as UI intent). Serif only for the page title. Edit tokens in `css/site.css`.
- Blurbs are one plain sentence. Dates are the ship date, YYYY-MM-DD.
- Tool pages must work from a static host with no server.
- Never commit secrets or customer data.
