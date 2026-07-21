// Captures the 6 Compass screens as PNGs into docs/screenshots/.
// Assumes the Vite dev server is already running (npm run dev, default http://localhost:5173).
// Usage: node scripts/screenshots.mjs
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const puppeteer = require(path.join(__dirname, '..', 'node_modules', 'puppeteer'));

const BASE_URL = process.env.COMPASS_DEV_URL || 'http://localhost:5173';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');

const ROUTES = [
  { path: '/overview', file: '01-overview.png' },
  { path: '/prs', file: '02-prs.png' },
  { path: '/builds', file: '03-builds.png' },
  { path: '/releases', file: '04-releases.png' },
  { path: '/bugs', file: '05-bugs.png' },
  { path: '/retrospect', file: '06-retrospect.png' },
];

// Waits until every <svg> path/rect element on the page has stopped changing
// its `d`/geometry attributes across two consecutive animation frames — a proxy
// for "Recharts has finished its mount/entry animation and settled".
async function waitForChartsSettled(page) {
  await page.waitForSelector('svg', { timeout: 15000 });
  await page.evaluate(async () => {
    function snapshot() {
      const nodes = document.querySelectorAll('svg path, svg rect, svg line, svg text');
      return Array.from(nodes)
        .map((n) => n.getAttribute('d') || n.getAttribute('height') || n.getAttribute('points') || '')
        .join('|');
    }
    let prev = snapshot();
    let stableFrames = 0;
    // Require ~30 consecutive stable animation frames (~0.5s at 60fps) before
    // considering the chart settled, with a hard cap so we never hang forever.
    for (let i = 0; i < 300; i++) {
      await new Promise((r) => requestAnimationFrame(r));
      const cur = snapshot();
      if (cur === prev) {
        stableFrames++;
        if (stableFrames >= 30) return;
      } else {
        stableFrames = 0;
        prev = cur;
      }
    }
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  for (const route of ROUTES) {
    const url = BASE_URL + route.path;
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');
    await waitForChartsSettled(page);

    const outPath = path.join(OUT_DIR, route.file);
    await page.screenshot({ path: outPath });
    console.log('Wrote', outPath);
  }

  await browser.close();
})();
