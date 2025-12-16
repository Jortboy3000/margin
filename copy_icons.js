const fs = require('fs');
const path = require('path');

const brainsDir = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\fc911cc2-c4e5-4fe4-8239-df7093618128';
const iconsDir = path.join(process.cwd(), 'icons');

// Map source filename to dest filename
const files = [
    { src: 'uploaded_image_0_1765879693614.png', dest: 'icon128.png' },
    { src: 'uploaded_image_1_1765879693614.png', dest: 'icon16.png' },
    { src: 'uploaded_image_2_1765879693614.png', dest: 'icon48.png' }
];

if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
    console.log(`Created directory: ${iconsDir}`);
}

console.log(`Reading source directory: ${brainsDir}`);
try {
    const srcFiles = fs.readdirSync(brainsDir);
    console.log(`Source files (${srcFiles.length}):`, srcFiles);
} catch (e) {
    console.error(`Failed to read source dir: ${e.message}`);
}

files.forEach(f => {
    const srcPath = path.join(brainsDir, f.src);
    const destPath = path.join(iconsDir, f.dest);
    try {
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${f.src} to ${f.dest} - Success`);
        } else {
            console.error(`Source file not found: ${srcPath}`);
        }
    } catch (err) {
        console.error(`Failed to copy ${f.src}: ${err.message}`);
    }
});
