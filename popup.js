document.addEventListener('DOMContentLoaded', async () => {
    const listEl = document.getElementById('list');
    const searchInput = document.getElementById('search-input');
    const totalEl = document.getElementById('total-count');

    // Fetch all data
    const allData = await chrome.storage.local.get(null);

    // Process into list of { url, noteCount, lastUpdated, title? }
    let pages = Object.entries(allData).map(([key, notes]) => {
        if (!key.startsWith('http')) return null; // Filter non-url keys
        if (!Array.isArray(notes)) return null;

        // Find latest timestamp
        const lastUpdated = notes.reduce((max, n) => Math.max(max, n.createdAt || 0), 0);

        return {
            url: key,
            noteCount: notes.length,
            lastUpdated,
            // Try to extract domain/title from URL
            domain: new URL(key).hostname.replace('www.', '')
        };
    }).filter(p => p !== null);

    // Sort by recent
    pages.sort((a, b) => b.lastUpdated - a.lastUpdated);

    // Update Stats
    const totalNotes = pages.reduce((sum, p) => sum + p.noteCount, 0);
    totalEl.textContent = `${totalNotes} Notes / ${pages.length} Pages`;

    // Render Function
    const render = (items) => {
        listEl.innerHTML = '';
        if (items.length === 0) {
            listEl.innerHTML = '<div class="empty">No pages found.</div>';
            return;
        }

        items.forEach(page => {
            const div = document.createElement('div');
            div.className = 'item';

            const dateStr = new Date(page.lastUpdated).toLocaleDateString();

            div.innerHTML = `
                <a class="item-title" href="${page.url}" target="_blank">${page.url}</a>
                <div class="item-meta">
                    <span class="badge">${page.noteCount}</span>
                    <span>${page.domain}</span>
                    <span style="margin-left:auto">${dateStr}</span>
                </div>
            `;

            // Handle click specifically to open new tab
            div.addEventListener('click', (e) => {
                // If user clicked the anchor specifically, let it handle it (or prevent default and do it here)
                // Since anchor has target="_blank", it works naturally.
                // We only want to handle the div click if they missed the anchor.
                if (e.target.tagName === 'A') return;

                chrome.tabs.create({ url: page.url });
            });

            listEl.appendChild(div);
        });
    };

    // Initial Render
    render(pages);

    // Search Filter
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = pages.filter(p =>
            p.url.toLowerCase().includes(term) ||
            p.domain.toLowerCase().includes(term)
        );
        render(filtered);
    });
});
