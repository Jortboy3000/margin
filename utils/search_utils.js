// Search Intelligence Utilities

(function (global) {
    global.SearchUtils = {
        isSearchPage() {
            const host = window.location.hostname;
            return host.includes('google.com') || host.includes('bing.com');
        },

        async run() {
            if (!this.isSearchPage()) return;

            console.log("Margin: Search Intelligence Active");

            // 1. Get all stored URLs (keys)
            // We do this to avoid N async calls. 
            // Note: chrome.storage.local.get(null) gets everything.
            const allData = await chrome.storage.local.get(null);
            if (!allData) return;

            // Filter for keys that look like URLs and have notes
            const witnessedUrls = new Set();
            for (const [key, value] of Object.entries(allData)) {
                if (key.startsWith('http') && Array.isArray(value) && value.length > 0) {
                    witnessedUrls.add(this.normalizeUrl(key));
                }
            }

            if (witnessedUrls.size === 0) return;

            // 2. Scan SERP links
            this.scanAndInject(witnessedUrls);

            // Handle dynamic loading (e.g. Google infinite scroll)
            const observer = new MutationObserver((mutations) => {
                // Debounce or simple check? Simple check for now.
                this.scanAndInject(witnessedUrls);
            });

            observer.observe(document.body, { childList: true, subtree: true });
        },

        scanAndInject(witnessedUrls) {
            // Selector strategy
            // Google: #search .g a
            // Bing: #b_results .b_algo a
            const links = document.querySelectorAll('a');

            links.forEach(link => {
                // Avoid internal links or already handled
                if (!link.href || link.href.startsWith('javascript') || link.href.startsWith('/') || link.hasAttribute('data-margin-checked')) {
                    return;
                }

                link.setAttribute('data-margin-checked', 'true');

                const normalizedLink = this.normalizeUrl(link.href);

                if (witnessedUrls.has(normalizedLink)) {
                    this.injectBadge(link);
                }
            });
        },

        normalizeUrl(url) {
            try {
                // Strip trailing slash, query params might be relevant so we keep them? 
                // Margin uses exact href usually. 
                // For search matching, strict equality is safest to avoid false positives.
                // But search results might differ slightly (http vs https, trash params).
                // Let's rely on exact match of the base mostly.

                const u = new URL(url);
                // Simple normalization: protocol + host + pathname
                // We ignore query params for matching to increase hit rate on cleaner URLs
                // But if Margin stored with params, this might miss. 
                // Let's try to match exactly what is stored first. 

                // Actually, best approach:
                // Margin stores "location.href".
                // So we should try to match exact first.
                return url.replace(/\/$/, "");
            } catch (e) {
                return url;
            }
        },

        injectBadge(linkElement) {
            // Find a good place to inject. Usually after the H3 or inside the container.
            // Google: Link contains h3.
            const h3 = linkElement.querySelector('h3');
            const target = h3 ? h3 : linkElement;

            const badge = document.createElement('span');
            badge.textContent = " M ";
            badge.title = "You have Margin notes for this page";
            badge.style.cssText = `
            background-color: #000;
            color: #fff;
            font-size: 10px;
            font-weight: bold;
            padding: 2px 5px;
            border-radius: 4px;
            margin-left: 8px;
            vertical-align: middle;
            display: inline-block;
            font-family: sans-serif;
            opacity: 0.8;
        `;

            // Prevent click propagation to the link (optional, but keep it simple)
            // Insert
            if (h3) {
                h3.appendChild(badge);
            } else {
                target.appendChild(badge);
            }
        }
    };
})(typeof window !== 'undefined' ? window : self);

