const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json());

// Simple File-based DB
let DB = {
    pages: {} // url -> { claims: [] }
};

// Load DB
if (fs.existsSync(DATA_FILE)) {
    try {
        DB = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (e) {
        console.error("Failed to load DB", e);
    }
}

// Routes

// GET /api/v1/observations?url=...
app.get('/api/v1/observations', (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "Missing url param" });

    // Normalize URL
    // In real app: remove tracking params, sort query keys, etc.
    // Current strategy: direct string match

    const pageData = DB.pages[url];
    if (!pageData) {
        return res.json({ claims: [] });
    }

    res.json({ claims: pageData.claims });
});

// POST /api/v1/publish
app.post('/api/v1/publish', (req, res) => {
    const { url, notes, token } = req.body;

    // Auth Check
    // Current strategy: allow any non-empty token
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    if (!url || !Array.isArray(notes)) {
        return res.status(400).json({ error: "Invalid payload" });
    }

    if (!DB.pages[url]) {
        DB.pages[url] = { claims: [] };
    }

    const pageClaims = DB.pages[url].claims;
    let newClaimsAdded = 0;
    let observationsAdded = 0;

    notes.forEach(note => {
        // Primitive: Claim
        // We define a "Claim" as a unique Note Text on a Page for now.
        // Ideally we fuzzy match text.

        // Check if claim exists
        let existing = pageClaims.find(c => c.text === note.noteText);

        if (existing) {
            // Existing claim -> Add Observation
            existing.observations += 1;
            existing.lastSeen = Date.now();

            // Merge Evidence (dedupe)
            if (note.evidenceUrl) {
                if (!existing.evidence.includes(note.evidenceUrl)) {
                    existing.evidence.push(note.evidenceUrl);
                }
            }
            observationsAdded++;
        } else {
            // New Claim
            const newClaim = {
                id: Math.random().toString(36).substr(2, 9),
                text: note.noteText,
                type: note.noteType,
                evidence: note.evidenceUrl ? [note.evidenceUrl] : [],
                observations: 1, // The author
                firstSeen: Date.now(),
                lastSeen: Date.now()
            };
            pageClaims.push(newClaim);
            newClaimsAdded++;
        }
    });

    saveDB();

    console.log(`[Publish] ${url}: +${newClaimsAdded} claims, +${observationsAdded} observations`);
    res.json({ success: true, newClaims: newClaimsAdded, newObservations: observationsAdded });
});

// Sync Store (File-based persistence)
const SYNC_FILE = path.join(__dirname, 'sync.json');
let syncStore = {};

// Load Sync DB
if (fs.existsSync(SYNC_FILE)) {
    try {
        syncStore = JSON.parse(fs.readFileSync(SYNC_FILE, 'utf8'));
    } catch (e) {
        console.error("Failed to load Sync DB", e);
    }
}

function saveSyncDB() {
    // Async write to avoid blocking event loop
    fs.writeFile(SYNC_FILE, JSON.stringify(syncStore, null, 2), (err) => {
        if (err) console.error("Failed to save Sync DB async", err);
    });
}

function saveDB() {
    // Async write to avoid blocking event loop
    fs.writeFile(DATA_FILE, JSON.stringify(DB, null, 2), (err) => {
        if (err) console.error("Failed to save Main DB async", err);
    });
}

// POST /api/v1/sync - Upload backup
app.post('/api/v1/sync', (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    // In a real app, 'data' would be an encrypted blob
    const { data, timestamp } = req.body;

    syncStore[token] = {
        data,
        timestamp: timestamp || Date.now()
    };

    saveSyncDB(); // Persist to disk

    console.log(`[Sync] Backup received for user ${token.substring(0, 8)}...`);
    res.json({ success: true, timestamp: syncStore[token].timestamp });
});

// GET /api/v1/sync - Download backup
app.get('/api/v1/sync', (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const record = syncStore[token];
    if (!record) {
        return res.status(404).json({ error: "No backup found" });
    }

    res.json(record);
});

app.listen(PORT, () => {
    console.log(`Web Truth Stack Server running on http://localhost:${PORT}`);
});
