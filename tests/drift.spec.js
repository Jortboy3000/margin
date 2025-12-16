const { test, expect, chromium } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

const EXTENSION_PATH = path.resolve(__dirname, '..');

test.describe('Drift Detection', () => {
    let context;
    let page;
    let fileUrl;

    test.beforeEach(async () => {
        context = await chromium.launchPersistentContext('', {
            headless: false,
            args: [
                `--disable-extensions-except=${EXTENSION_PATH}`,
                `--load-extension=${EXTENSION_PATH}`
            ],
        });
        page = await context.newPage();

        fileUrl = pathToFileURL(path.resolve(__dirname, 'fixtures/drift-page.html')).href;
        await page.goto(fileUrl);

        // Wait for extension
        const marginRoot = page.locator('#margin-root');
        await marginRoot.waitFor({ state: 'attached', timeout: 5000 });
    });

    test.afterEach(async () => {
        if (context) await context.close();
    });

    test('should detect headline change', async () => {
        // 1. Create a note on the original page
        // Open panel
        // Select text first
        const p = page.getByText('original introductory paragraph');
        await p.selectText();

        // Trigger Add Note via Shortcut (Cmd/Ctrl + Shift + E)
        if (process.platform === 'darwin') {
            await page.keyboard.down('Meta');
        } else {
            await page.keyboard.down('Control');
        }
        await page.keyboard.down('Shift');
        await page.keyboard.press('e');
        await page.keyboard.up('Shift');
        if (process.platform === 'darwin') {
            await page.keyboard.up('Meta');
        } else {
            await page.keyboard.up('Control');
        }

        // Fill and save note
        await page.evaluate(() => {
            const root = document.querySelector('#margin-root');
            // Correct IDs found in ui_manager.js: margin-text, margin-save
            const input = root.shadowRoot.getElementById('margin-text');
            const saveBtn = root.shadowRoot.getElementById('margin-save');
            if (!input || !saveBtn) throw new Error("Could not find input or save button in shadow DOM");
            input.value = "Test Note for Drift";
            saveBtn.click();
        });

        // Verify note exists
        await page.waitForTimeout(500); // Wait for save
        const noteText = await page.evaluate(() => {
            const root = document.querySelector('#margin-root');
            return root.shadowRoot.querySelector('.margin-note-text').innerText;
        });
        expect(noteText).toContain("Test Note for Drift");

        // 2. Modify the Page (Simulate Drift)
        await page.evaluate(() => {
            document.getElementById('main-title').innerText = "Modified Headline";
        });

        // Trigger a refresh by creating a second dummy note
        // (Since we can't call refreshNotes() directly, and page.reload() resets the DOM)

        // Trigger a refresh by creating a second dummy note
        // We must use UI interaction because window.UIManager is not accessible here (Isolated World)

        await page.evaluate(() => {
            const root = document.querySelector('#margin-root');
            const input = root.shadowRoot.getElementById('margin-text');
            const saveBtn = root.shadowRoot.getElementById('margin-save');

            input.value = "Refresh Trigger Note";
            saveBtn.click();
        });

        // Wait for refresh
        await page.waitForTimeout(1000);

        // 3. Verify Warning
        const warnings = await page.evaluate(() => {
            const root = document.querySelector('#margin-root');
            const diffs = Array.from(root.shadowRoot.querySelectorAll('.margin-diff-new'));
            // Also check for simple warning just in case
            const simpleWarnings = Array.from(root.shadowRoot.querySelectorAll('.margin-warning-simple'));
            return [...diffs.map(el => el.innerText), ...simpleWarnings.map(el => el.innerText)];
        });

        console.log("Warnings found:", warnings);

        // Expected: "Headline changed" (from PageUtils logic)
        // Check fuzzy match
        const hasHeadlineWarning = warnings.some(w => w.includes('Headline'));
        expect(hasHeadlineWarning).toBe(true);
    });
});
