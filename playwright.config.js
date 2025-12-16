// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    timeout: 30000,
    expect: {
        timeout: 5000
    },
    fullyParallel: false,
    workers: 1, // Extensions often conflict in parallel
    reporter: 'html',
    use: {
        trace: 'on-first-retry',
        headless: false, // Extensions don't work in headless mode usually (or require xvfb)
        // We need to load the extension
        ignoreHTTPSErrors: true,
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
