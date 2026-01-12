# Implementation Plan - Multi-Theme Support for Internal Pages

Enable the "About Us", "Careers", and "Pricing" pages to respect the global theme preference (Light/Dark mode) while maintaining the standardized header without a toggle button.

## Proposed Changes

### [Global Theme Management] [src/main.js]
- **Theme Initialization**: Ensure the stored theme is applied to `document.body` on every page load, regardless of whether a toggle button is present. (Already implemented in Step Id: 2225).

### [Pricing Page] [pricing.html]
- **Light Mode Styles**: Add `body.light-mode` overrides for:
    - Hero section background and typography.
    - Pricing card background, border, and shadows.
    - Feature list icons and text colors.
    - Enterprise section background and typography.
    - Value proposition cards.

### [About Us & Careers Pages] [about.html, careers.html]
- **Verify/Restore Light Mode**: Ensure these pages still contain the necessary `body.light-mode` CSS blocks to render correctly when the light theme is active.

## Verification Plan

### Automated Tests (Browser)
- Open the Homepage (`index.html`).
- Toggle to **Light Mode**.
- Navigate to **About Us**. Verify the page is in Light Mode.
- Navigate to **Pricing**. Verify the page is in Light Mode.
- Navigate to **Careers**. Verify the page is in Light Mode.
- Toggle back to **Dark Mode** on the Homepage and repeat the navigation checks.

### Manual Verification
- Visual inspection of the Light Mode aesthetics on the Pricing page to ensure high quality and readability.
- Check that the header remains consistent (no toggle) across all internal pages.
