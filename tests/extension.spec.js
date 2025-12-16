import { test, expect, chromium } from '@playwright/test';
import path from 'path';

const EXTENSION_PATH = path.resolve(__dirname, '..');

test.describe('Margin Extension E2E', () => {
    let context;
    let page;

    test.beforeEach(async () => {
        // Launch Chrome with extension loaded
        context = await chromium.launchPersistentContext('', {
            headless: false,
            args: [
                `--disable-extensions-except=${EXTENSION_PATH}`,
                `--load-extension=${EXTENSION_PATH}`
            ],
        });

        page = await context.newPage();

        page.on('pageerror', exception => console.log(`PAGE ERROR: ${exception}`));

    });

    test.afterEach(async () => {
        if (context) await context.close();
    });

    test('should inject UI on a page', async () => {
        // Use local fixture to avoid network issues and ensure reliable loading
        const path = require('path');
        const { pathToFileURL } = require('url');
        const fileUrl = pathToFileURL(path.resolve(__dirname, 'fixtures/test-page.html')).href;
        await page.goto(fileUrl);

        // Wait for content script injection
        // Check if our root exists
        const marginRoot = page.locator('#margin-root');
        await marginRoot.waitFor({ state: 'attached', timeout: 5000 });

        // Check for panel opening
        // We need to pierce shadow DOM
        // Playwright handles open shadow roots automatically usually, but let's be explicit if needed
        // The root is #margin-root -> shadow -> #margin-panel

        // Simple check: Evaluate in page
        const isPanelVisible = await page.evaluate(() => {
            const root = document.querySelector('#margin-root');
            if (!root || !root.shadowRoot) return false;
            const panel = root.shadowRoot.querySelector('#margin-panel');
            return panel.classList.contains('open');
        });

        // It shouldn't be open by default unless we triggered it?
        // Actually the first test just checked if it *could* be opened or just injected?
        // Original test checked for panel visibility after shortcut.
        // Let's trigger it.

        await page.keyboard.down('Meta'); // or Control
        await page.keyboard.down('Shift');
        await page.keyboard.press('.');
        await page.keyboard.up('Shift');
        await page.keyboard.up('Meta');

        const isVisibleAfterShortcut = await page.evaluate(() => {
            const root = document.querySelector('#margin-root');
            const panel = root.shadowRoot.querySelector('#margin-panel');
            return panel.classList.contains('open');
        });

        expect(isVisibleAfterShortcut).toBe(true);
    });

    test('should allow creating a note', async () => {
        // Use local fixture
        const path = require('path');
        const { pathToFileURL } = require('url');
        const fileUrl = pathToFileURL(path.resolve(__dirname, 'fixtures/test-page.html')).href;
        await page.goto(fileUrl);

        // Wait for content script injection
        const marginRoot = page.locator('#margin-root');
        await marginRoot.waitFor({ state: 'attached', timeout: 5000 });

        // 1. Select text
        // Using locator.selectText() is more reliable and ensures focus
        await page.locator('p').first().selectText();

        // 2. Trigger shortcut to add note
        // Ensure focus is on the page body or paragraph to capture keydown
        await page.locator('p').first().focus();

        await page.keyboard.down('Control'); // assume windows/linux for generic
        await page.keyboard.down('Shift');
        await page.keyboard.press('E');
        await page.keyboard.up('Shift');
        await page.keyboard.up('Control');

        // 3. Verify quote preview (visual confirm)
        // Wait for panel
        await page.waitForTimeout(500); // Animation

        const quote = await page.evaluate(() => {
            const root = document.querySelector('#margin-root');
            const text = root.shadowRoot.querySelector('#margin-quote-preview').textContent;
            return text;
        });

        expect(quote).toContain('Margin extension');

        // 4. Fill form
        await page.evaluate(() => {
            const root = document.querySelector('#margin-root');
            const input = root.shadowRoot.querySelector('#margin-text');
            input.value = 'Automated Test Observation';

            const btn = root.shadowRoot.querySelector('#margin-save');
            btn.click();
        });

        // 5. Verify Note appeared
        await page.waitForTimeout(500);

        const noteText = await page.evaluate(() => {
            const root = document.querySelector('#margin-root');
            const note = root.shadowRoot.querySelector('.margin-note-text');
            return note ? note.textContent : null;
        });

        expect(noteText).toBe('Automated Test Observation');
    });
});
