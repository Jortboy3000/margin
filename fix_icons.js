const fs = require('fs');
const path = require('path');

const srcDir = String.raw`C:\Users\User\.gemini\antigravity\brain\fc911cc2-c4e5-4fe4-8239-df7093618128`;
const destDir = String.raw`c:\Users\User\Desktop\Projects\web_truth_stack\icons`;

const files = [
    { src: 'uploaded_image_1_1765879693614.png', dest: 'icon16.png' },
    { src: 'uploaded_image_2_1765879693614.png', dest: 'icon48.png' },
    { src: 'uploaded_image_0_1765879693614.png', dest: 'icon128.png' }
];

console.log("Starting copy...");

files.forEach(f => {
    try {
        const s = path.join(srcDir, f.src);
        const d = path.join(destDir, f.dest);
        fs.copyFileSync(s, d);
        console.log(`Copied ${f.src} to ${f.dest}`);
    } catch (e) {
        console.error(`Error copying ${f.src}:`, e.message);
    }
});
console.log("Done.");
