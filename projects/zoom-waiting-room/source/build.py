# Fill the tokens and inline the brand assets: waiting.html -> waiting_built.html
#   python3 build.py [--name Steve] [--profile Persuader] [--out waiting_built.html]
# Logos come from the repo's assets/ folder.
import argparse, base64, pathlib

here = pathlib.Path(__file__).resolve().parent
ap = argparse.ArgumentParser()
ap.add_argument('--name', default='Steve'); ap.add_argument('--profile', default='Persuader')  # bolds this word in the reply
ap.add_argument('--assets', default=str(here.parents[2] / 'assets')); ap.add_argument('--out', default=str(here / 'waiting_built.html'))
a = ap.parse_args()
assets = pathlib.Path(a.assets)
b64 = lambda p: base64.b64encode((assets / p).read_bytes()).decode()

html = (here / 'waiting.html').read_text()
html = html.replace('__NAME__', a.name.replace("'", "\\'")).replace('__PROFILE__', a.profile)
html = html.replace('__LOGO__', b64('PI_Logo_White.png'))
html = html.replace('__CIRCLE__', b64('PI_Logo_Circle.svg'))
html = html.replace('__MARK__', b64('PI_Logo_Full_White-Text.png'))
pathlib.Path(a.out).write_text(html)
print('wrote', a.out)
