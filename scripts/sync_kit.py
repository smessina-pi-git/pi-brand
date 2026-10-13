#!/usr/bin/env python3
"""Keep the Brand Asset Builder kit inlined in self-contained builders identical to shared/asset-builder/.

  python3 scripts/sync_kit.py           # copy kit.css and kit.js into each builder below
  python3 scripts/sync_kit.py --check   # exit 1 if any inlined copy differs from the kit

The inlined copies are the first <style> that starts with "/* Brand Asset Builder kit" and the first
<script> that starts with "// Brand Asset Builder kit".
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
KIT = ROOT / 'shared' / 'asset-builder'
BUILDERS = [ROOT / 'projects' / 'zoom-waiting-room' / 'builder.html']

css = (KIT / 'kit.css').read_text().rstrip('\n')
js = (KIT / 'kit.js').read_text().rstrip('\n')
CSS_RE = re.compile(r'<style>/\* Brand Asset Builder kit.*?</style>', re.S)
JS_RE = re.compile(r'<script>// Brand Asset Builder kit.*?</script>', re.S)

check = '--check' in sys.argv
bad = 0
for path in BUILDERS:
    html = path.read_text()
    out = CSS_RE.sub(lambda m: '<style>' + css + '\n</style>', html, count=1)
    out = JS_RE.sub(lambda m: '<script>' + js + '\n</script>', out, count=1)
    if not CSS_RE.search(html) or not JS_RE.search(html):
        print('no inlined kit found in', path.relative_to(ROOT)); bad += 1; continue
    if out != html:
        if check: print('kit differs:', path.relative_to(ROOT)); bad += 1
        else: path.write_text(out); print('synced', path.relative_to(ROOT))
    else:
        print('in sync', path.relative_to(ROOT))
sys.exit(1 if bad else 0)
