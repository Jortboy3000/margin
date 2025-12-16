// Network Utilities for Web Truth Stack

(function (global) {
    const SERVER_URL = "http://localhost:3000/api/v1";

    global.NetworkUtils = {
        /**
         * Fetch community notes for a URL.
         */
        async fetchCommunityNotes(url, token) { // Added token parameter
            try {
                const response = await fetch(`${SERVER_URL}/observations?url=${encodeURIComponent(url)}`, {
                    headers: { 'Authorization': token }
                });
                if (!response.ok) return [];
                return await response.json();
            } catch (e) {
                console.error("Web Truth Stack: Failed to fetch community notes", e);
                return [];
            }
        },

        /**
         * Publish notes to the community.
         * @param {string} url 
         * @param {Array} notes 
         * @param {string} token 
         */
        async publishNotes(url, notes, token = "demo-token") {
            try {
                const res = await fetch(`${SERVER_URL}/publish`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        url,
                        notes,
                        token
                    })
                });
                if (!res.ok) throw new Error("Publish failed");
                return await res.json();
            } catch (err) {
                console.error("Web Truth Stack: Failed to publish notes", err);
                throw err;
            }
        },

        /**
         * Upload sync data.
         */
        async uploadSync(data, token = "demo-token") {
            try {
                // Start upload request

                // Let's update server to be consistent first. 
                // But assuming I fix server to be /api/v1/sync

                const response = await fetch(`${SERVER_URL}/sync`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify({
                        data,
                        timestamp: Date.now()
                    })
                });
                if (!response.ok) throw new Error("Sync failed");
                return await response.json();
            } catch (e) {
                console.error("Margin: Sync failed", e);
                throw e;
            }
        }
    };


})(typeof window !== 'undefined' ? window : self);
