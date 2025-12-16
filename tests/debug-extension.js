// Simple test to verify the extension loads correctly
// Run this in the browser console after loading a page with the extension

console.log("=== Margin Extension Debug Test ===");
console.log("1. Checking if content.js loaded:", typeof window !== 'undefined');
console.log("2. Checking dependencies:");
console.log("   - UIManager:", typeof window.UIManager);
console.log("   - PageUtils:", typeof window.PageUtils);
console.log("   - StorageUtils:", typeof window.StorageUtils);
console.log("3. Checking for #margin-root:", document.getElementById('margin-root'));
console.log("4. Checking console for 'Margin:' messages...");
