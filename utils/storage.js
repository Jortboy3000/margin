// Storage Utility for Web Truth Stack
(function (global) {
    global.StorageUtils = {
        /**
         * Save a note.
         * @param {Object} note - The note object to save.
         * @returns {Promise<void>}
         */
        async saveNote(note) {
            if (!note || !note.url) return;
            try {
                const url = note.url;
                const existing = await this.getNotesForUrl(url);
                existing.push(note);
                await chrome.storage.local.set({ [url]: existing });
                console.log("Margin: Note saved", note);
            } catch (e) {
                console.error("Margin: Save failed", e);
                alert("Margin: Failed to save note. Please refresh the page.");
            }
        },

        /**
         * Get notes for a specific URL.
         * @param {string} url 
         * @returns {Promise<Array>}
         */
        async getNotesForUrl(url) {
            if (!url) {
                console.warn("Margin: getNotesForUrl called with empty URL");
                return [];
            }
            try {
                const result = await chrome.storage.local.get(url);
                return result[url] || [];
            } catch (e) {
                console.error("Margin: Storage error (Context invalidated?)", e);
                return [];
            }
        },

        /**
         * Clear all notes (debug only)
         */
        async clearAll() {
            await chrome.storage.local.clear();
        }
    };
})(typeof window !== 'undefined' ? window : self);


