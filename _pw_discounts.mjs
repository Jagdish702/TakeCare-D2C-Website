import { chromium } from 'playwright';

const url = process.argv[2];
const outDir = process.argv[3];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (err) => errors.push(String(err)));

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

const cta = page.locator('[role="button"]:has-text("Get Started")').first();
await cta.scrollIntoViewIfNeeded();
await cta.click();
await page.waitForTimeout(300);

await page.click('button[aria-label="Cart"]');
await page.waitForTimeout(600);
await page.click('[role="button"]:has-text("Checkout"), button:has-text("Checkout")');
await page.waitForTimeout(1000);
await page.screenshot({ path: `${outDir}/discounts-removed.png` });

console.log('console errors:', JSON.stringify(errors));
await browser.close();
console.log('done');
