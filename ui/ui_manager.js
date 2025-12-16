// UI Manager for Margin (formerly Web Truth Stack)

(function (global) {
    global.UIManager = {
        root: null,
        shadow: null,
        panelOpen: false,
        activeTab: 'local', // 'local' or 'community'

        mount() {
            if (this.root) return;

            this.root = document.createElement('div');
            this.root.id = 'margin-root';

            // Explicit high-z-index container attached to HTML to avoid body stacking contexts
            this.root.style.cssText = `
        all: initial;
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        z-index: 2147483647;
    `;

            // Mount to documentElement (HTML) instead of body
            (document.documentElement || document.body).appendChild(this.root);

            this.shadow = this.root.attachShadow({ mode: 'open' });

            // Inject styles
            const style = document.createElement('style');
            style.textContent = this.getStyles();
            this.shadow.appendChild(style);

            // Render components
            this.renderStrip();
            this.renderPanel();
        },

        getStyles() {
            return `
      :host {
        all: initial;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        --margin-bg: #fff;
        --margin-text: #333;
        --margin-border: #eee;
        --margin-accent: #000;
      }
      *, *::before, *::after {
        box-sizing: border-box;
      }
      
      /* Context Strip */
      #margin-strip {
        position: fixed;
        right: 0;
        top: 20%;
        background: #000;
        color: #fff;
        padding: 8px 12px;
        border-radius: 8px 0 0 8px;
        cursor: pointer;
        z-index: 2147483646; /* High z-index */
        box-shadow: -2px 2px 8px rgba(0,0,0,0.15);
        transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: 'Inter', sans-serif;
        letter-spacing: -0.5px;
      }
      #margin-strip:hover {
        transform: translateX(-4px);
      }
      
      /* Side Panel */
      #margin-panel {
        position: fixed;
        top: 0;
        right: 0;
        width: 380px;
        height: 100vh;
        background: var(--margin-bg);
        box-shadow: -4px 0 20px rgba(0,0,0,0.08);
        z-index: 2147483647;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        flex-direction: column;
        border-left: 1px solid #eaeaea;
      }
      #margin-panel.open {
        transform: translateX(0);
      }
      
      /* Header & Tabs */
      .margin-header {
        padding: 16px 20px;
        border-bottom: 1px solid var(--margin-border);
        background: #fff;
      }
      .margin-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
      }
      .margin-title {
        font-family: 'Inter', sans-serif;
        font-weight: 800;
        font-size: 18px;
        color: #000;
        letter-spacing: -0.8px;
      }
      .margin-controls {
          display: flex;
          gap: 6px;
      }
      .margin-icon-btn {
        cursor: pointer;
        background: none;
        border: 1px solid transparent;
        font-size: 15px;
        color: #666;
        padding: 6px;
        border-radius: 6px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .margin-icon-btn:hover {
          background: #f5f5f5;
          color: #000;
      }
      
      .margin-tabs {
          display: flex;
          gap: 20px;
      }
      .margin-tab {
          text-align: center;
          padding-bottom: 8px;
          cursor: pointer;
          font-weight: 500;
          color: #999;
          border-bottom: 2px solid transparent;
          transition: 0.2s;
          font-size: 13px;
      }
      .margin-tab:hover {
          color: #555;
      }
      .margin-tab.active {
          color: #000;
          border-bottom: 2px solid #000;
          font-weight: 700;
      }

      .margin-content {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        position: relative;
        background-color: #fafafa;
      }
      
      /* Local Flow */
      .margin-local-view { display: none; }
      .margin-local-view.active { display: block; }
      
      /* Community Flow */
      .margin-community-view { display: none; }
      .margin-community-view.active { display: block; }
      
      .margin-comm-header {
          padding: 16px;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 8px;
          font-size: 13px;
          color: #444;
          margin-bottom: 20px;
          text-align: center;
          font-weight: 500;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
      }
      .margin-comm-header small {
          display: block;
          margin-top: 4px;
          color: #888;
          font-weight: 400;
      }

      /* Note Form */
      .margin-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 24px;
        background: #fff;
        padding: 16px;
        border: 1px solid #eee;
        border-radius: 12px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.03);
      }
      .margin-input, .margin-select, .margin-textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #eee;
        border-radius: 6px;
        font-size: 13px;
        color: #333;
        background: #fafafa;
        font-family: inherit;
        transition: border 0.2s;
      }
      .margin-input:focus, .margin-select:focus, .margin-textarea:focus {
          outline: none;
          border-color: #aaa;
          background: #fff;
      }
      .margin-textarea {
        min-height: 80px;
        resize: vertical;
      }
      .margin-row {
          display: flex;
          gap: 8px;
      }
      .margin-btn {
        background: #000;
        color: #fff;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        align-self: flex-end;
        font-size: 12px;
        transition: transform 0.1s;
      }
      .margin-btn:hover {
        background: #333;
      }
      .margin-btn:active {
          transform: scale(0.98);
      }
      
      /* Notes List */
      .margin-note-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .margin-note {
        padding: 16px;
        border: 1px solid #eaeaea;
        border-radius: 8px;
        background: #fff;
        position: relative;
        transition: box-shadow 0.2s;
      }
      .margin-note:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
          border-color: #ddd;
      }
      
      .margin-comm-note {
          border-left: 3px solid #000;
      }
      
      .margin-note-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          align-items: center;
      }
      .margin-note-type {
        font-size: 10px;
        text-transform: uppercase;
        padding: 3px 8px;
        border-radius: 100px;
        background: #f0f0f0;
        color: #444;
        font-weight: 700;
        letter-spacing: 0.5px;
      }
      .margin-observations {
          font-size: 10px;
          color: #888;
          font-weight: 600;
      }
      
      .margin-note-text {
        color: #222;
        margin-bottom: 12px;
        font-size: 14px;
        line-height: 1.5;
      }
      .margin-note-evidence {
        font-size: 12px;
        margin-top: 10px;
        border-top: 1px solid #f5f5f5;
        padding-top: 8px;
        display: flex;
        gap: 8px;
        align-items: center;
        color: #666;
      }
      .margin-note-evidence a {
        color: #000;
        text-decoration: underline;
        font-weight: 500;
      }
      .margin-evidence-indicator {
          font-size: 14px;
      }
      .margin-strength-badge {
         font-size: 10px;
         font-weight: 700;
         padding: 2px 6px;
         border-radius: 4px;
         margin-left:auto;
      }
      .strength-high { color: #1b5e20; background: #e8f5e9; }
      .strength-medium { color: #f57f17; background: #fffde7; }
      .strength-low { color: #c62828; background: #ffebee; }
      
      /* Warnings (Context Analysis) */
      .margin-context-analysis {
        font-size: 11px;
        margin-bottom: 12px;
        background: #fff5f5;
        border: 1px solid #fed7d7;
        border-radius: 6px;
        padding: 8px 10px;
        color: #c53030;
      }
      .margin-context-header {
          font-weight: 700;
          margin-bottom: 4px;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.5px;
      }
      .margin-diff-box {
          background: rgba(255,255,255,0.5);
          padding: 6px;
          border-radius: 4px;
          margin-top: 4px;
      }
      .margin-diff-old { text-decoration: line-through; color: #e57373; display:block; opacity: 0.8;}
      .margin-diff-new { font-weight: 600; display:block; color: #b71c1c; }
      
      /* Anchor Warning */
       .margin-warning-simple {
        font-size: 11px;
        margin-bottom: 8px;
        font-weight: 600;
        padding: 6px 10px;
        border-radius: 6px;
        background: #fff8e1;
        color: #f57f17;
        border: 1px solid #ffecb3;
      }

       .margin-selection-quote {
        font-size: 12px;
        color: #555;
        border-left: 2px solid #ddd;
        padding-left: 10px;
        margin: 6px 0 12px 0;
        font-style: italic;
        line-height: 1.4;
      }
      
      /* Fork Button */
      .margin-fork-btn {
          margin-top: 12px;
          background: transparent;
          border: 1px solid #ddd;
          color: #555;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 11px;
          cursor: pointer;
          width: 100%;
          text-align: center;
          font-weight: 500;
          transition: all 0.2s;
      }
      .margin-fork-btn:hover {
          background: #f9f9f9;
          color: #000;
          border-color: #ccc;
      }
      
      .margin-comm-meta {
          font-size: 11px;
          color: #999;
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
      }
      .margin-disclaimer {
          font-size: 10px;
          color: #999;
          margin-top: 8px;
          font-style: italic;
          line-height: 1.3;
      }
      .margin-published-badge {
          font-size: 10px;
          color: #2e7d32;
          font-weight: 600;
          background: #e8f5e9;
          padding: 2px 6px;
          border-radius: 4px;
      }
      .margin-pub-btn {
          padding: 2px 6px;
          font-size: 12px;
          color: #666;
      }
      .margin-pub-btn:hover {
          color: #0d47a1;
          background: #e3f2fd;
      }
    `;
        },

        renderStrip() {
            const strip = document.createElement('div');
            strip.id = 'margin-strip';
            strip.innerHTML = `
      <span>Margin</span>
      <span id="margin-count" style="background:rgba(255,255,255,0.2); padding:0 6px; border-radius:4px; font-size:12px;">0</span>
    `;
            strip.addEventListener('click', () => this.togglePanel());
            this.shadow.appendChild(strip);
        },

        renderPanel() {
            const panel = document.createElement('div');
            panel.id = 'margin-panel';
            panel.innerHTML = `
      <div class="margin-header">
        <div class="margin-top-row">
            <span class="margin-title" title="Monitoring Articles for Revision and Governance of Information Networks">MARGIN</span>
            <div class="margin-controls">
                <button class="margin-icon-btn" id="margin-sync" title="Sync to Cloud">☁️</button>
                <button class="margin-icon-btn" id="margin-import" title="Import JSON">⬆</button>
                <button class="margin-icon-btn" id="margin-export" title="Export JSON">⬇</button>
                <button class="margin-icon-btn margin-close">×</button>
            </div>
        </div>
        <div class="margin-tabs">
            <div class="margin-tab active" data-tab="local">My Notes</div>
            <div class="margin-tab" data-tab="community">Shared</div>
        </div>
      </div>
      
      <div class="margin-content">
        <!-- Local View -->
        <div id="margin-local" class="margin-local-view active">
             <!-- Form -->
            <div class="margin-form">
               <div class="margin-row">
                   <select id="margin-type" class="margin-select" style="flex:2">
                     <option value="observation">Observation</option>
                     <option value="claim">Claim</option>
                     <option value="counter-claim">Counter-Claim</option>
                     <option value="correction">Correction</option>
                     <option value="context">Context</option>
                   </select>
                   <select id="margin-strength" class="margin-select" style="flex:1" title="Evidence Strength">
                     <option value="">Strength...</option>
                     <option value="high">High</option>
                     <option value="medium">Medium</option>
                     <option value="low">Low</option>
                   </select>
               </div>
                   </select>
               </div>
               <div id="margin-quote-preview" style="font-size:11px; color:#666; font-style:italic; margin-bottom:8px; border-left:2px solid #ddd; padding-left:8px; display:none;"></div>
               <textarea id="margin-text" class="margin-textarea" placeholder="Record an observation..."></textarea>
               <input id="margin-evidence" class="margin-input" placeholder="Evidence URL (optional)" type="url">
               <button id="margin-save" class="margin-btn">Add Note</button>
            </div>
            
             <div id="margin-notes-list" class="margin-note-list"></div>
        </div>
        
        <!-- Community View -->
        <div id="margin-community" class="margin-community-view">
             <div class="margin-comm-header">
                Shared observations<br>
                <small>What others have recorded about this page</small>
                <div class="margin-disclaimer">Observations are user-contributed and may reflect partial or evolving information.</div>
             </div>
             <div id="margin-comm-list" class="margin-note-list">
                <div style="text-align:center; padding: 20px; color:#999;">Loading...</div>
             </div>
        </div>

      </div>
    `;

            // Listeners
            panel.querySelector('.margin-close').addEventListener('click', () => this.togglePanel(false));
            panel.querySelector('#margin-save').addEventListener('click', () => this.handleSave());
            panel.querySelector('#margin-export').addEventListener('click', () => this.handleExport());
            panel.querySelector('#margin-import').addEventListener('click', () => this.handleImportTrigger());
            panel.querySelector('#margin-sync').addEventListener('click', () => this.handleSyncTrigger());

            // Tabs
            const tabs = panel.querySelectorAll('.margin-tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    this.switchTab(e.target.dataset.tab);
                });
            });

            this.shadow.appendChild(panel);
        },

        switchTab(tabName) {
            this.activeTab = tabName;
            const shadow = this.shadow;

            // Update Tab UI
            shadow.querySelectorAll('.margin-tab').forEach(t => t.classList.remove('active'));
            shadow.querySelector(`.margin-tab[data-tab="${tabName}"]`).classList.add('active');

            // Update View
            shadow.getElementById('margin-local').classList.remove('active');
            shadow.getElementById('margin-community').classList.remove('active');

            if (tabName === 'local') {
                shadow.getElementById('margin-local').classList.add('active');
            } else {
                shadow.getElementById('margin-community').classList.add('active');
                this.loadCommunityNotes();
            }
        },

        togglePanel(forceState) {
            const panel = this.shadow.getElementById('margin-panel');
            if (typeof forceState !== 'undefined') {
                this.panelOpen = forceState;
            } else {
                this.panelOpen = !this.panelOpen;
            }

            if (this.panelOpen) {
                panel.classList.add('open');
            } else {
                panel.classList.remove('open');
                // Clear pending selection when closing? 
                // Maybe not, in case they accidentally closed it.
                // But we should probably clear the Preview if we persist?
                // Actually, let's keep it. State is preserved.
            }
        },

        updateCount(count) {
            const el = this.shadow.getElementById('margin-count');
            if (el) el.textContent = count;
        },

        renderNotesList(notes) {
            const list = this.shadow.getElementById('margin-notes-list');
            list.innerHTML = '';

            this.updateCount(notes.length);

            if (notes.length === 0) {
                list.innerHTML = `<div style="text-align:center; color:#999; font-size:13px; margin-top:20px;">No notes yet.</div>`;
                return;
            }

            notes.forEach(note => {
                const div = document.createElement('div');
                div.className = 'margin-note';

                let warningHtml = '';

                // Context Analysis UI
                if (note.semanticChanges && note.semanticChanges.length > 0) {
                    warningHtml += `
             <div class="margin-context-analysis">
                <div class="margin-context-header">Context Shift Detected</div>
                <div>The discussion moves or content has changed:</div>
                ${note.semanticChanges.map(c => `
                    <div class="margin-diff-box">
                       <span style="font-size:10px; color:#555; text-transform:uppercase;">${c.description}</span>
                       <span class="margin-diff-old">"${this.escapeHtml(c.oldVal)}"</span>
                       <span class="margin-diff-new">"${this.escapeHtml(c.newVal)}"</span>
                    </div>
                `).join('')}
             </div>`;
                } else if (note.contextChanged) {
                    // Fallback for non-semantic hash mismatch
                    warningHtml += `<div class="margin-warning-simple">⚠ Page content has changed</div>`;
                }

                if (note.anchorMissing) warningHtml += `<div class="margin-warning-simple">⚠ Anchor Text Missing</div>`;

                let selectionHtml = '';
                if (note.selection && note.selection.text) {
                    selectionHtml = `<div class="margin-selection-quote">"${this.escapeHtml(note.selection.text)}"</div>`;
                }

                // Evidence Indicator
                let evidenceIndicator = '';
                const safeUrl = this.sanitizeUrl(note.evidenceUrl);
                if (safeUrl) {
                    evidenceIndicator = `<span class="margin-evidence-indicator">🔗</span> <a href="${safeUrl}" target="_blank">Evidence Attached</a>`;
                } else if (note.evidenceUrl) {
                    evidenceIndicator = `<span class="margin-evidence-indicator">⚠️</span> <span style="color:#d32f2f; font-size:10px;">Blocked Unsafe Link</span>`;
                } else {
                    evidenceIndicator = `<span class="margin-evidence-indicator">⚠️</span> No evidence`;
                }

                // Publish State
                let publishAction = '';
                if (note.published) {
                    publishAction = `<span class="margin-published-badge" title="Published to Community">☁ Shared</span>`;
                } else {
                    publishAction = `<button class="margin-icon-btn margin-pub-btn" title="Publish this note">☁</button>`;
                }

                // Strength Badge
                let strengthBadge = '';
                if (note.strength) {
                    strengthBadge = `<span class="margin-strength-badge strength-${note.strength.toLowerCase()}">${note.strength}</span>`;
                }

                div.innerHTML = `
            ${warningHtml}
            <div class="margin-note-header">
                <span class="margin-note-type">${note.noteType}</span>
                ${strengthBadge}
                ${publishAction}
            </div>
            ${selectionHtml}
            <div class="margin-note-text">${this.escapeHtml(note.noteText)}</div>
            <div class="margin-note-evidence">${evidenceIndicator}</div>
        `;

                // Wire up publish button
                if (!note.published) {
                    const pubBtn = div.querySelector('.margin-pub-btn');
                    if (pubBtn) {
                        pubBtn.addEventListener('click', () => {
                            if (confirm("Publish this single note to the shared layer? It will become immutable.")) {
                                if (this.onPublishNote) this.onPublishNote(note);
                            }
                        });
                    }
                }

                list.appendChild(div);
            });
        },

        renderCommunityList(claims) {
            const list = this.shadow.getElementById('margin-comm-list');
            list.innerHTML = '';

            if (!claims || claims.length === 0) {
                list.innerHTML = `<div style="text-align:center; padding:20px; color:#999; font-size:13px;">No shared observations found.</div>`;
                return;
            }

            claims.forEach(claim => {
                const div = document.createElement('div');
                div.className = 'margin-note margin-comm-note';

                let evidenceHtml = '';
                if (claim.evidence && claim.evidence.length > 0) {
                    const safeLinks = claim.evidence
                        .map(e => this.sanitizeUrl(e))
                        .filter(u => u)
                        .map(u => `<a href="${u}" target="_blank">Link</a>`)
                        .join(', ');

                    if (safeLinks) {
                        evidenceHtml = `<div class="margin-note-evidence"><span class="margin-evidence-indicator">🔗</span> Evidence: ${safeLinks}</div>`;
                    } else {
                        evidenceHtml = `<div class="margin-note-evidence"><span class="margin-evidence-indicator">⚠️</span> Evidence blocked (unsafe)</div>`;
                    }
                } else {
                    evidenceHtml = `<div class="margin-note-evidence"><span class="margin-evidence-indicator">⚠️</span> No evidence provided</div>`;
                }

                // Time context
                const lastSeen = new Date(claim.lastSeen).toLocaleDateString();

                div.innerHTML = `
            <div class="margin-note-header">
                 <span class="margin-note-type">${this.escapeHtml(claim.type)}</span>
                 <span class="margin-observations">Observed by ${this.escapeHtml(claim.observations)} other</span>
            </div>
            <div class="margin-note-text">${this.escapeHtml(claim.text)}</div>
            ${evidenceHtml}
            <div class="margin-comm-meta">
                <span>Last seen: ${lastSeen}</span>
            </div>
            <button class="margin-fork-btn" data-id="${this.escapeHtml(claim.id)}">Fork to My Notes</button>
          `;

                // Wire up fork button
                const forkBtn = div.querySelector('.margin-fork-btn');
                forkBtn.addEventListener('click', () => {
                    this.handleFork(claim);
                });

                list.appendChild(div);
            });
        },

        escapeHtml(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        },

        sanitizeUrl(url) {
            if (!url) return '';
            try {
                const parsed = new URL(url);
                if (['http:', 'https:'].includes(parsed.protocol)) {
                    return this.escapeHtml(url);
                }
                return '';
            } catch (e) {
                return '';
            }
        },

        setPendingSelection(selection) {
            this.pendingSelection = selection;
            const preview = this.shadow.getElementById('margin-quote-preview');
            if (preview) {
                if (selection && selection.text) {
                    preview.textContent = `"${selection.text}"`;
                    preview.style.display = 'block';
                } else {
                    preview.textContent = '';
                    preview.style.display = 'none';
                }
            }
        },

        handleSave() {
            const type = this.shadow.getElementById('margin-type').value;
            const strength = this.shadow.getElementById('margin-strength').value;
            const text = this.shadow.getElementById('margin-text').value;
            const evidence = this.shadow.getElementById('margin-evidence').value;

            if (!text.trim()) return;

            if (this.onSaveNote) {
                this.onSaveNote({
                    noteType: type,
                    noteText: text,
                    evidenceUrl: evidence,
                    strength: strength,
                    // Use pending, or try generic grab?
                    // The onSaveNote handler in content.js *also* calls PageUtils.getSelectionInfo() currently.
                    // We should pass the pending selection down to it!
                    selection: this.pendingSelection || null
                });
                this.shadow.getElementById('margin-text').value = '';
                this.shadow.getElementById('margin-evidence').value = '';
                this.shadow.getElementById('margin-strength').value = '';
                this.pendingSelection = null; // Clear after save
            }
        },

        handleFork(claim) {
            if (this.onFork) {
                // Confirm
                if (confirm("Fork this observation to your local notes?")) {
                    this.onFork(claim);
                    // Switch back to local view
                    this.switchTab('local');
                }
            }
        },

        handleExport() { if (this.onExport) this.onExport(); },

        handleImportTrigger() {
            // Create hidden file input
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.style.display = 'none';

            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        if (this.onImport) this.onImport(data);
                    } catch (err) {
                        alert("Failed to parse JSON: " + err.message);
                    }
                };
                reader.readAsText(file);
            };

            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
        },

        handleSyncTrigger() {
            if (this.onSync) this.onSync();
        },

        // Virtual Scrolling State
        virtualState: {
            items: [],
            itemHeight: 140, // Approximate height of a note card
            containerHeight: 0,
            startIndex: 0,
            endIndex: 10
        },

        renderCommunityList(claims) {
            const container = this.shadow.getElementById('margin-comm-list');
            if (!container) return;

            if (!claims || claims.length === 0) {
                container.innerHTML = `<div style="text-align:center; padding:20px; color:#999; font-size:13px;">No shared observations found.</div>`;
                return;
            }

            // Initialize Virtual State
            this.virtualState.items = claims;
            this.virtualState.containerHeight = container.clientHeight || 500; // Fallback

            // Setup Container Styles for Virtualization
            container.style.position = 'relative';
            container.style.overflowY = 'auto'; // Ensure it scrolls
            container.style.height = '100%';    // Fill parent

            // Remove old listeners to prevent duplication if re-rendering
            const oldHandler = this.virtualState.scrollHandler;
            if (oldHandler) container.removeEventListener('scroll', oldHandler);

            // Create inner spacer to fake scroll height
            const totalHeight = claims.length * this.virtualState.itemHeight;

            // We need a scroll wrapper or just handle it in the list container?
            // Let's assume margin-comm-list is the scroll container.

            const spacer = document.createElement('div');
            spacer.id = 'margin-virtual-spacer';
            spacer.style.height = `${totalHeight}px`;
            spacer.style.position = 'absolute';
            spacer.style.top = '0';
            spacer.style.left = '0';
            spacer.style.width = '1px';
            spacer.style.zIndex = '-1';

            // Content wrapper for visible items
            const content = document.createElement('div');
            content.id = 'margin-virtual-content';
            content.style.position = 'absolute';
            content.style.top = '0';
            content.style.left = '0';
            content.style.width = '100%';
            content.style.padding = '10px'; // Matching list style

            container.innerHTML = '';
            container.appendChild(spacer);
            container.appendChild(content);

            // Scroll Handler
            const handleScroll = () => {
                const scrollTop = container.scrollTop;
                const startNode = Math.floor(scrollTop / this.virtualState.itemHeight);
                const visibleNodes = Math.ceil(container.clientHeight / this.virtualState.itemHeight);

                // Render with buffer (e.g. 5 items above/below)
                const start = Math.max(0, startNode - 5);
                const end = Math.min(claims.length, startNode + visibleNodes + 5);

                this.renderVirtualSlice(content, claims, start, end);

                // Offset content
                content.style.transform = `translateY(${start * this.virtualState.itemHeight}px)`;
            };

            this.virtualState.scrollHandler = handleScroll;
            container.addEventListener('scroll', handleScroll);

            // Initial Render
            handleScroll();
        },

        renderVirtualSlice(container, claims, start, end) {
            container.innerHTML = ''; // Clear current slice

            const slice = claims.slice(start, end);

            slice.forEach(claim => {
                const div = document.createElement('div');
                // Add static height to enforce virtualization math
                div.style.height = `${this.virtualState.itemHeight - 16}px`; // Subtract margin
                div.style.marginBottom = '16px';
                div.className = 'margin-note margin-comm-note';

                // ... [Logic from previous renderCommunityList] ...
                let evidenceHtml = '';
                if (claim.evidence && claim.evidence.length > 0) {
                    const safeLinks = claim.evidence
                        .map(e => this.sanitizeUrl(e))
                        .filter(u => u)
                        .map(u => `<a href="${u}" target="_blank">Link</a>`)
                        .join(', ');

                    if (safeLinks) {
                        evidenceHtml = `<div class="margin-note-evidence"><span class="margin-evidence-indicator">🔗</span> Evidence: ${safeLinks}</div>`;
                    } else {
                        evidenceHtml = `<div class="margin-note-evidence"><span class="margin-evidence-indicator">⚠️</span> Evidence blocked (unsafe)</div>`;
                    }
                } else {
                    evidenceHtml = `<div class="margin-note-evidence"><span class="margin-evidence-indicator">⚠️</span> No evidence provided</div>`;
                }

                const lastSeen = new Date(claim.lastSeen).toLocaleDateString();

                div.innerHTML = `
             <div class="margin-note-header">
                  <span class="margin-note-type">${this.escapeHtml(claim.type)}</span>
                  <span class="margin-observations">Observed by ${this.escapeHtml(claim.observations)} other</span>
             </div>
             <div class="margin-note-text" style="max-height:60px; overflow:hidden; text-overflow:ellipsis;">${this.escapeHtml(claim.text)}</div>
             ${evidenceHtml}
             <div class="margin-comm-meta">
                 <span>Last seen: ${lastSeen}</span>
             </div>
             <button class="margin-fork-btn" data-id="${this.escapeHtml(claim.id)}">Fork to My Notes</button>
           `;

                const forkBtn = div.querySelector('.margin-fork-btn');
                forkBtn.addEventListener('click', () => {
                    this.handleFork(claim);
                });

                container.appendChild(div);
            });
        },

        loadCommunityNotes() {
            if (this.onFetchCommunity) {
                this.shadow.getElementById('margin-comm-list').innerHTML = '<div style="text-align:center; padding:20px;">Fetching...</div>';
                this.onFetchCommunity();
            }
        }
    };
})(typeof window !== 'undefined' ? window : self);
