// Render every frame of the loop to PNGs with Playwright, then encode with ffmpeg (see README.md).
//   node cap.js waiting_built.html frames            all frames (30 fps)
//   node cap.js waiting_built.html prev preview      a few key frames to check first
// Uses system Google Chrome on a Mac (channel "chrome"). Elsewhere set CHROME_PATH to a Chromium binary,
// or leave both unset to use Playwright's own downloaded Chromium.
const { chromium } = require('playwright-core'); const fs = require('fs'); const path = require('path');
(async () => {
  const [,, file, out, mode] = process.argv;
  const opts = process.env.CHROME_PATH ? {executablePath: process.env.CHROME_PATH} : (process.platform === 'darwin' ? {channel: 'chrome'} : {});
  const b = await chromium.launch(opts);
  const p = await b.newPage({viewport: {width: 1920, height: 1080}});
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + path.resolve(file)); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  const LOOP = await p.evaluate(() => LOOP);
  fs.mkdirSync(out, {recursive: true});
  const ts = mode === 'preview' ? [0, 2.5, 3.5, 5.3, 5.85, 6.2, 9.0, 14.0, 15.0, 16.5, 20.0, 24.8, 26.8, LOOP - .01] : null;
  const FPS = 30, N = Math.round(LOOP * FPS);
  const list = ts || Array.from({length: N}, (_, i) => i / FPS);
  for (let i = 0; i < list.length; i++) {
    await p.evaluate(t => seek(t), list[i]);
    await p.screenshot({path: path.join(out, (ts ? 't' + list[i].toFixed(2) : 'f' + String(i).padStart(4, '0')) + '.png')});
  }
  await b.close();
})();
