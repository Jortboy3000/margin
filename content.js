// Content script for Margin
console.log("Margin: Content Loader Initializing...");

// Ensure global scope access for safety
const globalScope = typeof window !== 'undefined' ? window : self;


// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "OPEN_NOTE_PANEL") {
        if (window.UIManager) {
            // robustly capture selection
            let selection = window.PageUtils ? window.PageUtils.getSelectionInfo() : null;
            // Fallback to what background script saw if local selection is gone
            if (!selection && request.selectionText) {
                selection = { text: request.selectionText };
            }

            window.UIManager.setPendingSelection(selection);
            window.UIManager.togglePanel(true);
        }
    }
});

// Shortcuts
document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + Shift + E -> Add Note (Focus Panel)
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === 'KeyE') {
        e.preventDefault();
        if (window.UIManager) {
            // Capture selection for shortcut too!
            const selection = window.PageUtils ? window.PageUtils.getSelectionInfo() : null;
            window.UIManager.setPendingSelection(selection);
            window.UIManager.togglePanel(true);
        }
    }
    // Cmd/Ctrl + Shift + . -> Toggle Panel
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === '.') {
        e.preventDefault();
        if (window.UIManager) {
            window.UIManager.togglePanel();
        }
    }
});


let computedHash = "";
let currentNotes = [];

/**
 * Wait for all required dependencies to be loaded.
 * Uses exponential backoff with a maximum timeout.
 * @returns {Promise<boolean>} True if all dependencies loaded, false if timeout
 */
async function waitForDependencies() {
    const requiredDeps = ['UIManager', 'PageUtils', 'StorageUtils'];
    const optionalDeps = ['NetworkUtils', 'TelemetryUtils', 'SearchUtils'];
    const maxWaitTime = 10000; // 10 seconds max
    const startTime = Date.now();
    let attempt = 0;

    while (Date.now() - startTime < maxWaitTime) {
        // Check if all required dependencies are available
        const allLoaded = requiredDeps.every(dep => {
            return window[dep] !== undefined;
        });

        if (allLoaded) {
            console.log("Margin: All dependencies loaded successfully");

            // Log optional dependencies status
            optionalDeps.forEach(dep => {
                if (window[dep]) {
                    console.log(`Margin: Optional dependency ${dep} loaded`);
                } else {
                    console.warn(`Margin: Optional dependency ${dep} not available`);
                }
            });

            return true;
        }

        // Log missing dependencies
        const missing = requiredDeps.filter(dep => !window[dep]);
        console.log(`Margin: Waiting for dependencies (attempt ${attempt + 1}): ${missing.join(', ')}`);

        // Exponential backoff: 10ms, 20ms, 40ms, 80ms, 160ms, 320ms, 640ms...
        const waitTime = Math.min(10 * Math.pow(2, attempt), 500);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        attempt++;
    }

    console.error("Margin: Timeout waiting for dependencies. Missing:",
        requiredDeps.filter(dep => !window[dep]).join(', '));
    return false;
}

async function init() {
    console.log("Margin: Initialization starting...");

    // Wait for body
    if (!document.body) {
        console.log("Margin: Waiting for DOMContentLoaded...");
        window.addEventListener('DOMContentLoaded', init);
        return;
    }

    // Wait for all dependencies to load
    const depsLoaded = await waitForDependencies();
    if (!depsLoaded) {
        console.error("Margin: Failed to initialize - dependencies not loaded");
        return;
    }

    // 1. Mount UI
    const uiManager = window.UIManager;

    if (uiManager) {
        uiManager.mount();
        console.log("Margin: UI mounted successfully");
    } else {
        console.error("Margin: UIManager not found after dependency check");
        return;
    }

    // 2. Compute Hash & Fingerprint
    const text = window.PageUtils.getVisibleText();
    computedHash = await window.PageUtils.computeHash(text);
    const fingerPrint = window.PageUtils.getSemanticFingerprint();
    // console.log("Margin: Computed Hash", computedHash);

    // 3. Load Notes
    await refreshNotes();

    // 4. Setup Event Handlers
    window.UIManager.onSaveNote = async (noteData) => {
        // prefer passed selection (from pending), fallback to current
        const selectionInfo = noteData.selection || window.PageUtils.getSelectionInfo();

        // Remove selection from noteData spread to avoid duplication/confusion
        const { selection, ...restData } = noteData;

        const note = {
            id: crypto.randomUUID(),
            url: window.location.href,
            pageHash: computedHash,
            semanticFingerprint: fingerPrint,
            selection: selectionInfo,
            createdAt: Date.now(),
            published: false, // Default state
            ...restData
        };
        await window.StorageUtils.saveNote(note);
        await refreshNotes();
    };

    // Handle Fork
    window.UIManager.onFork = async (claim) => {
        const note = {
            id: crypto.randomUUID(),
            url: window.location.href,
            pageHash: computedHash,
            semanticFingerprint: fingerPrint,
            noteType: claim.type || 'observation',
            noteText: claim.text,
            evidenceUrl: (claim.evidence && claim.evidence.length > 0) ? claim.evidence[0] : "",
            createdAt: Date.now(),
            published: false // Forked notes start as local drafts
        };
        await window.StorageUtils.saveNote(note);
        await refreshNotes();
    };

    window.UIManager.onExport = async () => {
        const notes = await window.StorageUtils.getNotesForUrl(window.location.href);
        const data = {
            url: window.location.href,
            exportedAt: new Date().toISOString(),
            notes: notes
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'margin-notes.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    window.UIManager.onImport = async (data) => {
        // ... (existing import logic) ...
        // Refactored somewhat in previous steps but just keeping it simple here
        // The user hasn't asked to change import logic
        // But for Sync, we reuse the import logic effectively!

        if (!data || !Array.isArray(data.notes)) {
            // Try handling "Everything" format if coming from Sync?
            // Sync stores { "url1": [], "url2": [] }
            // Import usually handles single URL export.
            // We need to support bulk import for Sync Restore.
            if (typeof data === 'object') {
                // It's likely a full backup dump
                await chrome.storage.local.set(data);
                await refreshNotes();
                alert("Full restore complete from file.");
                return;
            }
            alert("Invalid import file format.");
            return;
        }

        // Single page import (legacy)
        let count = 0;
        for (const note of data.notes) {
            const existing = await window.StorageUtils.getNotesForUrl(window.location.href);
            if (!existing.find(e => e.id === note.id)) {
                await window.StorageUtils.saveNote(note);
                count++;
            }
        }
        await refreshNotes();
        alert(`Imported ${count} notes.`);
    };

    window.UIManager.onSync = async () => {
        try {
            const btn = window.UIManager.shadow.getElementById('margin-sync');
            btn.textContent = '⏳';

            // 1. Get All Data
            const allData = await chrome.storage.local.get(null);

            // 2. Upload
            await window.NetworkUtils.uploadSync(allData);

            // 3. Try Download (Merge?)
            // For MVP Sync, we usually just "Push" or "Pull". True sync is hard.
            // Let's do: Push Current -> If success, say "Synced!".
            // To Restore, we'd need a separate button.
            // OR: We check if server has newer timestamp?
            // Let's stick to "Backup to Cloud" behavior for safety.

            btn.textContent = '✅';
            setTimeout(() => btn.textContent = '☁️', 2000);
            alert("Library synced to cloud.");
        } catch (e) {
            alert("Sync failed: " + e.message);
            const btn = window.UIManager.shadow.getElementById('margin-sync');
            btn.textContent = '❌';
            setTimeout(() => btn.textContent = '☁️', 2000);
        }
    };

    window.UIManager.onPublishNote = async (note) => {
        if (!note || !note.id) return;

        try {
            // Send single note as array
            await window.NetworkUtils.publishNotes(window.location.href, [note]);

            // Update local state to published
            const latestNotes = await window.StorageUtils.getNotesForUrl(window.location.href);
            const targetIndex = latestNotes.findIndex(n => n.id === note.id);
            if (targetIndex !== -1) {
                latestNotes[targetIndex].published = {
                    at: Date.now(),
                    version: 1,
                    status: 'active'
                };
                // Save back all notes (including the updated one)
                // StorageUtils.saveNote appends, so we need a verify/update mechanism or just re-save the list?
                // StorageUtils was simple append. We need to overwrite or update.
                // Looking at StorageUtils, it does fetch-modify-save logic internally in saveNote? 
                // Ah, saveNote pushes new. We need an update method or we overwrite the entry.
                // Since StorageUtils is simple, let's just overwrite the whole URL entry manually here using chrome.storage

                // Let's rely on StorageUtils if it had update... it doesn't.
                // We'll effectively re-save the whole list for this URL.
                const storageObj = {};
                storageObj[window.location.href] = latestNotes;
                await chrome.storage.local.set(storageObj);

                // Refresh UI
                await refreshNotes();
                alert("Note published to Shared Observations.");
            }
        } catch (e) {
            alert("Failed to publish: " + e.message);
        }
    };

    window.UIManager.onFetchCommunity = async () => {
        const claims = await window.NetworkUtils.fetchCommunityNotes(window.location.href);
        window.UIManager.renderCommunityList(claims);
    };
}

async function refreshNotes() {
    const url = window.location.href;
    currentNotes = await window.StorageUtils.getNotesForUrl(url);

    // Schema Migration: Boolean -> Object
    let migrationNeeded = false;
    currentNotes = currentNotes.map(note => {
        if (note.published === true) {
            migrationNeeded = true;
            return {
                ...note,
                published: {
                    at: Date.now(),
                    version: 1,
                    status: 'active'
                }
            };
        }
        return note;
    });

    if (migrationNeeded) {
        console.log("Margin: Migrating schema for", url);
        await chrome.storage.local.set({ [url]: currentNotes });
    }
    const currentFingerPrint = window.PageUtils.getSemanticFingerprint();

    // Process notes for context warning
    const processedNotes = currentNotes.map(note => {
        const isHashDifferent = note.pageHash !== computedHash;

        let semanticChanges = [];
        if (note.semanticFingerprint && currentFingerPrint) {
            semanticChanges = window.PageUtils.compareFingerprints(note.semanticFingerprint, currentFingerPrint);
        }

        let anchorMissing = false;
        if (note.selection && note.selection.text) {
            anchorMissing = !window.PageUtils.hasText(note.selection.text);
        }

        return {
            ...note,
            contextChanged: isHashDifferent,
            semanticChanges: semanticChanges,
            anchorMissing: anchorMissing
        };
    });

    window.UIManager.renderNotesList(processedNotes);
}

// Initialize
try {
    const Telemetry = window.TelemetryUtils;
    const Search = window.SearchUtils;

    if (Telemetry) Telemetry.init();

    // Call init but ensure we catch promise errors
    init().catch(err => console.error("Margin: init() promise failed:", err));

    // Start Search Intelligence
    if (Search) {
        Search.run();
    }
} catch (e) {
    if (window.TelemetryUtils) {
        window.TelemetryUtils.captureError(e, { context: 'Global Init' });
    } else {
        console.error("Margin Check Fatal:", e);
    }
}
