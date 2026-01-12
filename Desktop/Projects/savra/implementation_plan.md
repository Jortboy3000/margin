# Implementation Plan - Fix Background (Switch to Dark Mode)

## Goal
Fix the "weird background" on the main page by establishing Dark Mode as the default premium aesthetic, removing the forced Light Mode.

## Problem
- `index.html` hardcodes `class="light-mode"` on the `<body>` tag.
- `main.js` defaults to `'light'` if no user preference is saved.
- `professional_background.css` renders a pale/flat background in light mode, which conflicts with the intended "premium/serious" aesthetic (likely interpreted as "weird" by the user).

## Proposed Changes

### [index.html](file:///c:/Users/User/Desktop/Projects/savra/index.html)
- Remove `class="light-mode"` from the `<body>` tag to ensure the initial render is Dark Mode (the default in CSS).

### [src/main.js](file:///c:/Users/User/Desktop/Projects/savra/src/main.js)
- Update `initThemeToggle()` to default to `'dark'` instead of `'light'` when no `localStorage` preference exists.
- This ensures new users (and the current session) see the intended Dark Mode interface.

## Verification Plan
### Manual Verification
1.  **Visual Check**: Confirm the background is now the "Deep Mesh" dark gradient (purple/blue/black) instead of the pale gray/white.
2.  **Console Check**: Ensure no errors in `main.js`.
3.  **Theme Toggle**: Verify the theme toggle button still works to switch back to light mode if desired.
