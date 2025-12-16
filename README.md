# MARGIN
> **Monitoring Articles for Revision and Governance of Information Networks**

Margin is a Chrome extension that adds a **"truth layer"** to the web. It allows you to:

## Features

### 📝 Annotation
- **Attach Notes**: Right-click partial text to attach observations.
- **Evidence**: Link sources to your claims. Unsafe links are auto-blocked.
- **Contextual Notes**: Add notes to any URL.
- **Evidence Linking**: Attach evidence URLs to your claims.
- **Semantic Fingerprinting**: Detects if the page content has changed significantly since you left your note.
- **Local-First**: All data is stored locally in your browser (Chrome Storage).
- **Import/Export**: Backup your notes to JSON or standardise your data.
- **Resilient Anchoring**: Notes stay attached even if minor page edits occur.

## Installation (Developer Mode)

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (top right toggle).
4. Click **Load unpacked**.
5. Select the folder containing this project.

## Development

The project is structured as a standard Chrome Extension (Manifest V3).

- `manifest.json`: Extension configuration.
- `content.js`: Main logic that injects the UI into webpages.
- `background.js`: Service worker for context menus and background tasks.
- `ui/`: Contains the Shadow DOM UI logic and styles.
- `utils/`: Utility modules for storage, hashing, and networking.

### Running Tests

We use [Playwright](https://playwright.dev/) for automated End-to-End (E2E) testing.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the test suite:
   ```bash
   npx playwright test
   ```

   **Note:** Tests run in a visible browser window to properly load the extension. Tests verify:
   - UI injection on local test pages.
   - Note creation and persistence.
   - Data import functionality.

## Contributing

1. **Localise**: Ensure your code works with Australian English spelling where applicable in user-facing text (e.g. colour, centre).
2. **Test**: Run the full test suite before submitting changes.
3. **Verify**: Check console logs for any 'Margin:' errors during manual verification.

## License

MIT Licence.
