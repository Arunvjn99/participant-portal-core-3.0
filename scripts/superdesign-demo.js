import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://superdesign.dev');

  await page.fill('textarea', 'Create modern retirement dashboard UI');
})();
