const { test, expect, chromium } = require('@playwright/test');

test('sanity log check', async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    page.on('console', msg => console.log('SANITY LOG:', msg.text()));

    await page.evaluate(() => {
        console.log("Hello from browser!");
    });

    await browser.close();
});
