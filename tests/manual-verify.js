// Quick verification script to test if dependencies load correctly
// This can be run in the browser console after loading the extension

console.log("=== Margin Extension Dependency Check ===");

// Check if all required dependencies are available
const requiredDeps = ['UIManager', 'PageUtils', 'StorageUtils'];
const optionalDeps = ['NetworkUtils', 'TelemetryUtils', 'SearchUtils'];

console.log("\nRequired Dependencies:");
requiredDeps.forEach(dep => {
    const available = window[dep] !== undefined;
    console.log(`  ${dep}: ${available ? '✓ LOADED' : '✗ MISSING'}`);
});

console.log("\nOptional Dependencies:");
optionalDeps.forEach(dep => {
    const available = window[dep] !== undefined;
    console.log(`  ${dep}: ${available ? '✓ LOADED' : '⚠ NOT LOADED'}`);
});

// Check if UI is mounted
console.log("\nUI Mount Status:");
const marginRoot = document.getElementById('margin-root');
console.log(`  #margin-root element: ${marginRoot ? '✓ FOUND' : '✗ NOT FOUND'}`);

if (marginRoot) {
    console.log(`  Shadow root: ${marginRoot.shadowRoot ? '✓ ATTACHED' : '✗ NOT ATTACHED'}`);

    if (marginRoot.shadowRoot) {
        const panel = marginRoot.shadowRoot.getElementById('margin-panel');
        const strip = marginRoot.shadowRoot.getElementById('margin-strip');
        console.log(`  #margin-panel: ${panel ? '✓ FOUND' : '✗ NOT FOUND'}`);
        console.log(`  #margin-strip: ${strip ? '✓ FOUND' : '✗ NOT FOUND'}`);
    }
}

console.log("\n=== Verification Complete ===");
