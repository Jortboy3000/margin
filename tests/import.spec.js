import { test, expect, chromium } from '@playwright/test';
import path from 'path';
import { pathToFileURL } from 'url';

const EXTENSION_PATH = path.resolve(__dirname, '..');
const TEST_DATA_PATH = path.resolve(__dirname, 'data', 'import_test.json');

test.describe('Margin Extension Import', () => {
    let context;
    let page;

    test.beforeEach(async () => {
        context = await chromium.launchPersistentContext('', {
            headless: false,
            args: [
                `--disable-extensions-except=${EXTENSION_PATH}`,
                `--load-extension=${EXTENSION_PATH}`
            ],
        });
        page = await context.newPage();
    });

    test.afterEach(async () => {
        if (context) await context.close();
    });

    test('should import notes from JSON', async () => {
        const fileUrl = pathToFileURL(path.resolve(__dirname, 'fixtures/test-page.html')).href;
        await page.goto(fileUrl);

        // Wait for content script injection
        const marginRoot = page.locator('#margin-root');
        await marginRoot.waitFor({ state: 'attached', timeout: 5000 });

        // Create dynamic import file that matches current URL
        const importData = {
            url: fileUrl,
            exportedAt: new Date().toISOString(),
            notes: [
                {
                    id: "import-test-1",
                    url: fileUrl,
                    noteText: "Imported Observation Logic",
                    noteType: "observation",
                    selection: {
                        "text": "Select this text" // Matches text in test-page.html
                    },
                    createdAt: Date.now(),
                    published: false
                }
            ]
        };
        const fs = require('fs');
        const tempImportPath = path.resolve(__dirname, 'data', 'temp_import.json');
        fs.writeFileSync(tempImportPath, JSON.stringify(importData));

        // 1. Open Panel (Meta/Ctrl+Shift+.)
        if (process.platform === 'darwin') {
            await page.keyboard.down('Meta');
        } else {
            await page.keyboard.down('Control');
        }
        await page.keyboard.down('Shift');
        await page.keyboard.press('.');
        await page.keyboard.up('Shift');
        if (process.platform === 'darwin') {
            await page.keyboard.up('Meta');
        } else {
            await page.keyboard.up('Control');
        }

        // Wait for panel animation
        await page.waitForTimeout(500);

        // 2. Prepare File Chooser
        const fileChooserPromise = page.waitForEvent('filechooser');

        // 3. Click Import
        await page.evaluate(() => {
            const root = document.querySelector('#margin-root');
            const btn = root.shadowRoot.querySelector('#margin-import');
            if (btn) btn.click();
            else console.error("Import button not found in shadow DOM");
        });

        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(tempImportPath);

        // 4. Handle Alert (Dialog)
        // Playwright dismisses by default, but we can verify it if we want.
        // For now, simpler to just wait for the note to appear.

        await page.waitForTimeout(1000); // Allow storage set and re-render

        const found = await page.evaluate(() => {
            const root = document.querySelector('#margin-root');
            if (!root || !root.shadowRoot) return false;
            const notes = Array.from(root.shadowRoot.querySelectorAll('.margin-note-text'));
            return notes.some(n => n.textContent.includes('Imported Observation Logic'));
        });

        expect(found).toBe(true);
    });
});
