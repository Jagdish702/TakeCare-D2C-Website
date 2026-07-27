import { chromium } from 'playwright';

const url = process.argv[2];
const outDir = process.argv[3];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// Reach the Setup/Refill flow page via its "Explore the flow" CTA.
const exploreCta = page.locator('text=Explore the flow').first();
await exploreCta.scrollIntoViewIfNeeded();
await exploreCta.click({ force: true });
await page.waitForTimeout(1000);

// Jump near the phone13 element's DOM position, then fine-scroll until its
// wrapper opacity settles near 1 (GSAP scrub reveals it partway through).
const info = await page.evaluate(() => {
  const img = document.querySelector('img[src*="mobile_img_3_1"]');
  if (!img) return null;
  const rect = img.getBoundingClientRect();
  // Walk up to find the huge scroll-jacked outer container (height set in vh).
  let el = img;
  let outerH = 0;
  while (el) {
    const h = el.getBoundingClientRect().height;
    if (h > outerH) outerH = h;
    el = el.parentElement;
  }
  return { top: rect.top + window.scrollY, docHeight: document.documentElement.scrollHeight, outerH };
});
console.log('info', info);

const sectionRange = info.outerH; // walked-up max element height = the vh-sized outer container
const sectionStart = info.top;

const readOpacity = () => page.evaluate(() => {
  const img = document.querySelector('img[src*="mobile_img_3_1"]');
  const wrap = img?.parentElement;
  return wrap ? parseFloat(getComputedStyle(wrap).opacity) : -1;
});

// Coarse scan across the whole 4050vh range to find where opacity peaks.
let bestOpacity = -1;
let bestY = null;
const coarseStep = sectionRange / 40;
for (let i = 0; i <= 40; i++) {
  const y = sectionStart + i * coarseStep;
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(120);
  const opacity = await readOpacity();
  if (opacity > bestOpacity) { bestOpacity = opacity; bestY = y; }
}
console.log('coarse bestOpacity', bestOpacity, 'bestY', bestY);

// Fine scan around the coarse peak.
for (let i = -10; i <= 10; i++) {
  const y = bestY + i * (coarseStep / 10);
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(100);
  const opacity = await readOpacity();
  if (opacity > bestOpacity) { bestOpacity = opacity; bestY = y; }
}
console.log('bestOpacity', bestOpacity, 'bestY', bestY);

await page.evaluate((y) => window.scrollTo(0, y), bestY);
await page.waitForTimeout(600);
await page.screenshot({ path: `${outDir}/phone13-mobile-full.png` });

const box = await page.evaluate(() => {
  const img = document.querySelector('img[src*="mobile_img_3_1"]');
  const wrap = img?.parentElement;
  const r = wrap.getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height };
});
console.log('box', box);
if (box && box.width > 0) {
  await page.screenshot({
    path: `${outDir}/phone13-crop.png`,
    clip: { x: Math.max(0, box.x - 20), y: Math.max(0, box.y - 20), width: box.width + 40, height: box.height + 40 },
  });
}

await browser.close();
console.log('done');
