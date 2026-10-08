#!/usr/bin/env python3
"""Add or update a project in projects.json and copy its files into projects/<slug>/.

  python3 scripts/add_project.py --slug my-tool --title "My Tool" --category tools \
      --blurb "One sentence." --launch path/to/index.html --download "Source (ZIP)=path/to/x.zip" \
      [--video path/to/preview.mp4] [--cover path/to/cover.png] [--featured] [--launch-label "Open it"]
  python3 scripts/add_project.py --check      # validate only

Re-running with the same slug updates that entry. Categories: tools, videos, skills.
"""
import argparse, datetime, json, pathlib, shutil, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
MANIFEST = ROOT / 'projects.json'
CATS = {'tools', 'videos', 'skills'}
MAX_MB = 50


def load():
    return json.loads(MANIFEST.read_text())


def check(data):
    errs = []
    seen = set()
    for p in data['projects']:
        s = p.get('slug', '?')
        if s in seen: errs.append(f'{s}: duplicate slug')
        seen.add(s)
        for k in ('slug', 'title', 'category', 'blurb', 'date'):
            if not p.get(k): errs.append(f'{s}: missing {k}')
        if p.get('category') not in CATS: errs.append(f'{s}: category must be one of {sorted(CATS)}')
        paths = [p.get(k) for k in ('launch', 'cover', 'video')] + [d['file'] for d in p.get('downloads', [])]
        for rel in filter(None, paths):
            f = ROOT / rel
            if not f.is_file(): errs.append(f'{s}: missing file {rel}')
            elif f.stat().st_size > MAX_MB * 1024 * 1024: errs.append(f'{s}: {rel} is over {MAX_MB} MB, host it on Drive and link it')
    return errs


def copy_in(src, slug, name=None):
    src = pathlib.Path(src).expanduser()
    if not src.is_file(): sys.exit(f'not a file: {src}')
    dest = ROOT / 'projects' / slug / (name or src.name)
    dest.parent.mkdir(parents=True, exist_ok=True)
    if src.resolve() != dest.resolve(): shutil.copy2(src, dest)
    return dest.relative_to(ROOT).as_posix()


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--check', action='store_true')
    ap.add_argument('--slug'); ap.add_argument('--title'); ap.add_argument('--category'); ap.add_argument('--blurb')
    ap.add_argument('--launch'); ap.add_argument('--launch-label'); ap.add_argument('--video'); ap.add_argument('--cover')
    ap.add_argument('--download', action='append', default=[], help='"Label=path"; repeatable')
    ap.add_argument('--featured', action='store_true'); ap.add_argument('--date')
    a = ap.parse_args()
    data = load()
    if not a.check:
        for k in ('slug', 'title', 'category', 'blurb'):
            if not getattr(a, k): ap.error(f'--{k} is required')
        today = a.date or datetime.date.today().isoformat()
        old = next((p for p in data['projects'] if p['slug'] == a.slug), {})
        p = dict(old, slug=a.slug, title=a.title, category=a.category, blurb=a.blurb, date=today)
        if a.launch: p['launch'] = copy_in(a.launch, a.slug, 'index.html' if a.launch.endswith('.html') else None)
        if a.launch_label: p['launchLabel'] = a.launch_label
        if a.video: p['video'] = copy_in(a.video, a.slug)
        if a.cover: p['cover'] = copy_in(a.cover, a.slug)
        if a.featured: p['featured'] = True
        if a.download:
            p['downloads'] = []
            for d in a.download:
                label, _, path = d.partition('=')
                p['downloads'].append({'label': label, 'file': copy_in(path, a.slug)})
        data['projects'] = [x for x in data['projects'] if x['slug'] != a.slug] + [p]
        data['updated'] = today
        MANIFEST.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
        print(f'wrote {a.slug}')
    errs = check(data)
    if errs:
        print('\n'.join('ERROR ' + e for e in errs)); sys.exit(1)
    print(f'ok: {len(data["projects"])} projects')


main()
