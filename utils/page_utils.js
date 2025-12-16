// Hashing and Page Content Utilities

(function (global) {
    global.PageUtils = {
        /**
         * Get visible text from the page.
         * This is a simplified version for MVP.
         * @returns {string}
         */
        getVisibleText() {
            // Clone body to avoid modify live DOM if we were to clean it up heavily
            // For MVP, innerText of body is a strong proxy for visible text
            // We might want to remove scripts/styles
            if (!document || !document.body) return "";
            return document.body.innerText.replace(/\s+/g, ' ').trim();
        },

        /**
         * Compute SHA-256 hash of a string.
         * @param {string} text 
         * @returns {Promise<string>} Hex string of hash
         */
        async computeHash(text) {
            const msgBuffer = new TextEncoder().encode(text);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        },

        /**
         * Get semantic fingerprint of the page for smarter diffs.
         */
        getSemanticFingerprint() {
            if (!document || !document.body) return null;

            const h1 = Array.from(document.querySelectorAll('h1')).map(el => el.innerText.trim()).join(' | ');
            const h2 = Array.from(document.querySelectorAll('h2')).slice(0, 5).map(el => el.innerText.trim());
            const p = Array.from(document.querySelectorAll('p')).slice(0, 3).map(el => el.innerText.trim());

            return {
                h1,
                h2,
                p
            };
        },

        /**
         * Compare fingerprints. Returns detailed change objects.
         * @returns {Array<{type: string, description: string, oldVal: string, newVal: string}>}
         */
        compareFingerprints(oldPrint, newPrint) {
            if (!oldPrint || !newPrint) return [];
            const changes = [];

            // 1. Headline Check
            if (oldPrint.h1 !== newPrint.h1) {
                changes.push({
                    type: 'Critical',
                    description: 'Headline changed',
                    oldVal: oldPrint.h1,
                    newVal: newPrint.h1
                });
            }

            // 2. Subheadings Check (Structure)
            const oldH2Str = JSON.stringify(oldPrint.h2);
            const newH2Str = JSON.stringify(newPrint.h2);
            if (oldH2Str !== newH2Str) {
                changes.push({
                    type: 'Structural',
                    description: 'Subheadings changed',
                    oldVal: oldPrint.h2.join(', '),
                    newVal: newPrint.h2.join(', ')
                });
            }

            // 3. Intro Content Check
            // We compare the first paragraph specifically as it usually sets the frame
            if (oldPrint.p && newPrint.p) {
                if (oldPrint.p[0] !== newPrint.p[0]) {
                    changes.push({
                        type: 'Content',
                        description: 'Intro paragraph changed',
                        oldVal: oldPrint.p[0] || "(empty)",
                        newVal: newPrint.p[0] || "(empty)"
                    });
                }
            }

            return changes;
        },

        /**
         * Get current text selection info.
         */
        getSelectionInfo() {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0 || selection.toString().trim() === "") {
                return null;
            }

            const text = selection.toString().trim();

            return {
                text,
                contextBefore: "", // placeholder
                contextAfter: "" // placeholder
            };
        },

        /**
         * Check if specific text exists on page.
         */
        hasText(text) {
            if (!text) return true;
            return document.body.innerText.includes(text);
        }
    };
})(typeof window !== 'undefined' ? window : self);
