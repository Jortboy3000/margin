# Logo Integration Guide

## Logo File Provided
The new Margin logo has been saved to `icons/logo.png`

## Required Icon Sizes for Chrome Extension

Chrome extensions need icons in these sizes:
- **16x16** - Favicon, extension menu
- **48x48** - Extension management page  
- **128x128** - Chrome Web Store, installation

## Next Steps

### Option 1: Use Online Tool (Recommended)
1. Go to https://www.iloveimg.com/resize-image or similar
2. Upload `icons/logo.png`
3. Create 3 versions:
   - Resize to 16x16 → Save as `icons/icon16.png`
   - Resize to 48x48 → Save as `icons/icon48.png`
   - Resize to 128x128 → Save as `icons/icon128.png`

### Option 2: Use ImageMagick (if installed)
```bash
magick icons/logo.png -resize 16x16 icons/icon16.png
magick icons/logo.png -resize 48x48 icons/icon48.png
magick icons/logo.png -resize 128x128 icons/icon128.png
```

### Option 3: Use Photoshop/GIMP
Open `icons/logo.png` and export in each size

## Files Updated

The manifest.json already references the correct icon paths:
- `icons/icon16.png`
- `icons/icon48.png`
- `icons/icon128.png`

Once you create these files, the extension will use your new logo!

## Logo Design
The logo is a minimalist "M" with two vertical bars - perfect for the Margin brand!
