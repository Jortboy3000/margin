# MARGIN
> **Monitoring Articles for Revision and Governance of Information Networks**

Margin is a Chrome extension that adds a **"truth layer"** to the web. It allows you to:

## Features
 
### 📝 Contextual Capture
Highlight text on any webpage and attach a note instantly.
<img src="docs/images/capture.png" width="600" alt="Contextual Capture" />

### 🗂️ Structured Taxonomy
Classify information as Observation, Claim, Correction, or Context.
<img src="docs/images/taxonomy.png" width="400" alt="Taxonomy Dropdown" />

### ⚠️ Semantic Drift Detection
MARGIN detects if the underlying article has changed since you left your note. It ignores "noise" (ads/timestamps) but warns you if the headlines or meaning have shifted.
<img src="docs/images/drift.png" width="400" alt="Drift Detection Warning" />

### ☁️ Community Knowledge
Share and view observations from other users on the same URL.
<img src="docs/images/community.png" width="400" alt="Community Tab" />

### Other Features
- **Evidence Linking**: Attach evidence URLs to your claims.
- **Local-First**: All data is stored locally in your browser (Chrome Storage).
- **Import/Export**: Backup your notes to JSON.
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
