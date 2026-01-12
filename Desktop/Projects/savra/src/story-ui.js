
import { StoryEngine } from './story-engine.js';

export class StoryUI {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn(`StoryUI: Container #${containerId} not found`);
            return;
        }

        this.engine = new StoryEngine();
        this.activeNode = 'quote'; // Default state

        this.nodes = [
            { id: 'quote', icon: '<i data-lucide="message-square"></i>', label: 'Quote' },
            { id: 'job', icon: '<i data-lucide="briefcase"></i>', label: 'Job' },
            { id: 'payment', icon: '<i data-lucide="credit-card"></i>', label: 'Payment' },
            { id: 'month', icon: '<i data-lucide="calendar"></i>', label: 'Month' },
            { id: 'health', icon: '<i data-lucide="heart"></i>', label: 'Health' }
        ];

        this.init();
    }

    init() {
        this.renderSpine();
        this.updateStage();
    }

    renderSpine() {
        this.container.innerHTML = `
            <div class="story-wrapper">
                <div class="story-spine">
                    ${this.nodes.map(node => `
                        <div class="spine-node ${node.id === this.activeNode ? 'active' : ''}" 
                             data-id="${node.id}">
                            <div class="node-icon">${node.icon}</div>
                            <div class="node-label">${node.label}</div>
                        </div>
                    `).join('')}
                </div>
                <div id="story-stage" class="story-stage reveal-anim"></div>
            </div>
        `;

        // Add Click Listeners
        const nodes = this.container.querySelectorAll('.spine-node');
        nodes.forEach(node => {
            node.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.setActiveNode(id);
                this.setActiveNode(id);
            });
        });

        if (window.lucide) window.lucide.createIcons();
    }

    setActiveNode(id) {
        if (this.activeNode === id) return;

        // Update State
        this.activeNode = id;

        // Update UI Classes
        this.container.querySelectorAll('.spine-node').forEach(node => {
            node.classList.toggle('active', node.dataset.id === id);
        });

        // Re-render Stage
        const stage = this.container.querySelector('#story-stage');
        stage.classList.remove('reveal-anim');
        void stage.offsetWidth; // Trigger reflow
        stage.classList.add('reveal-anim');

        this.updateStage();
    }

    updateStage() {
        const stage = this.container.querySelector('#story-stage');
        const narrative = this.engine.getNarrative(this.activeNode);
        const controls = this.getControlsForNode(this.activeNode);
        const headline = this.getHeadlineForNode(this.activeNode);

        stage.innerHTML = `
            <div class="stage-content">
                <div class="stage-header">
                    <div class="stage-title">${this.nodes.find(n => n.id === this.activeNode).label} Phase</div>
                    <div class="stage-headline">${headline}</div>
                </div>
                <div class="stage-narrative">
                    ${narrative.map(p => `<p>${p}</p>`).join('')}
                </div>
            </div>
            <div class="stage-controls">
                <div class="controls-title">Adjust & Simulate</div>
                ${controls}
            </div>
        `;

        // Bind Control Listeners
        stage.querySelectorAll('input[type="range"]').forEach(input => {
            input.addEventListener('input', (e) => {
                this.handleLeverChange(e.target.dataset.lever, e.target.value);
                // Update display value
                e.target.parentElement.querySelector('.value-display').textContent = this.formatValue(e.target.dataset.lever, e.target.value);
            });
        });

        // Bind Toggle Listener
        const cashToggle = stage.querySelector('#toggle-cash');
        if (cashToggle) {
            cashToggle.addEventListener('change', (e) => {
                this.handleLeverChange('includeCash', e.target.checked);
            });
        }

        // Bind Navigation Listeners (Next & Back)
        stage.querySelectorAll('.btn-roi-next, .btn-roi-back').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const nextId = e.currentTarget.dataset.next;
                this.setActiveNode(nextId);
            });
        });

        // Initialize new icons
        if (window.lucide) window.lucide.createIcons();
    }

    handleLeverChange(lever, value) {
        this.engine.setLever(lever, value);
        // Refresh only the content logic
        const newNarrative = this.engine.getNarrative(this.activeNode);
        const newHeadline = this.getHeadlineForNode(this.activeNode);

        // Text updates
        const narrativeContainer = this.container.querySelector('.stage-narrative');
        narrativeContainer.innerHTML = newNarrative.map(p => `<p>${p}</p>`).join('');
        this.container.querySelector('.stage-headline').innerHTML = newHeadline;

        // Dynamic Break-Even Bar Update (For Month Phase)
        if (this.activeNode === 'month') {
            const r = this.engine.results.month;
            const bePercent = Math.min(100, Math.max(0, r.coverageRatio));
            const barFill = this.container.querySelector('.be-fill');
            const barLabel = this.container.querySelector('.be-label span:last-child');

            if (barFill && barLabel) {
                barFill.style.width = `${bePercent}%`;
                // Choose color based on health
                barFill.style.backgroundColor = bePercent >= 100 ? 'var(--accent-success)' : 'var(--accent-warning)';
                barLabel.textContent = `${Math.round(r.coverageRatio)}%`;
            }
        }
    }

    getHeadlineForNode(node) {
        const r = this.engine.results;
        switch (node) {
            case 'quote':
                return `$${this.engine.formatK(r.quote.totalCharged)}`;
            case 'job':
                return `Est. Gross Profit: $${this.engine.formatK(r.job.grossProfit)}<br><span style="font-size: 0.6em; opacity: 0.8">Profit per hour: $${Math.round(r.job.profitPerHour)}/hr</span>
                <div class="because-strip" id="job-because-strip">
                    <span class="because-text">Profit/hr changed because </span>
                    <span class="because-chip ${r.job.deltaHours > 0 ? 'negative' : 'positive'}" onclick="document.querySelector('[data-lever=hoursVariation]').focus()">Hours ${r.job.deltaHours > 0 ? '+' : ''}${Math.round(r.job.deltaHours)}h</span>
                    <span class="because-chip ${r.job.deltaMaterials > 0 ? 'negative' : 'positive'}" onclick="document.querySelector('[data-lever=materialVariation]').focus()">Mat ${r.job.deltaMaterials > 0 ? '+' : '-'}$${Math.round(Math.abs(r.job.deltaMaterials))}</span>
                </div>`;
            case 'payment':
                return `Collected: $${this.engine.formatK(r.payment.collected)} of $${this.engine.formatK(r.payment.possibleRevenue)}<br><span style="font-size: 0.6em; opacity: 0.8">${Math.round(r.payment.realisationRate)}% Realisation</span>`;
            case 'month':
                return `$${this.engine.formatK(r.month.netCashFlow)} Net`;
            case 'health':
                return `${Math.round(r.health.score)}/100 Health Score`;
            default:
                return '';
        }
    }

    getControlsForNode(node) {
        const l = this.engine.levers;
        const slider = (id, label, min, max, val, suffix = '') => `
            <div class="control-group">
                <div class="control-label">
                    <span>${label}</span>
                    <span class="value-display">${val}${suffix}</span>
                </div>
                <input type="range" data-lever="${id}" min="${min}" max="${max}" value="${val}" step="1">
            </div>
        `;

        switch (node) {
            case 'quote':
                return slider('upsell', 'Upsell Rate', 0, 50, l.upsell, '%') +
                    slider('priceIncrease', 'Price Increase', 0, 20, l.priceIncrease, '%') +
                    `<div class="roi-nav-group single-next" style="margin-top: 20px;">
                        <button class="btn-roi-next" data-next="job">Next Phase <span>→</span></button>
                    </div>`;
            case 'job':
                return slider('materialVariation', 'Materials Variance', -20, 50, l.materialVariation, '%') +
                    slider('hoursVariation', 'Hours Variance', -10, 20, l.hoursVariation, 'h') +
                    slider('overheadPerJob', 'Overhead Allocation', 0, 200, l.overheadPerJob, '$') +
                    `<div class="roi-nav-group" style="margin-top: 20px;">
                        <button class="btn-roi-back" data-next="quote">Back</button>
                        <button class="btn-roi-next" data-next="payment">Next Phase <span>→</span></button>
                    </div>`;
            case 'payment':
                slider('paymentDelay', 'Payment Delay', 0, 60, l.paymentDelay, ' days') +
                    `<div class="control-group" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
                        <span class="control-label" style="margin-bottom: 0;">Include Cash Jobs</span>
                        <input type="checkbox" id="toggle-cash" ${l.includeCash ? 'checked' : ''} style="width: auto; height: auto;">
                    </div>
                    <button class="btn-secondary" style="width: 100%; margin-bottom: 20px; font-size: 0.85rem;" onclick="this.innerHTML = '✅ Matched (High Conf)' ">Match payments to jobs</button>` +
                    `<div class="roi-nav-group" style="margin-top: 20px;">
                        <button class="btn-roi-back" data-next="job">Back</button>
                        <button class="btn-roi-next" data-next="month">Next Phase <span>→</span></button>
                    </div>`;
            case 'month':
                const bePercent = Math.min(100, Math.max(0, this.engine.results.month.coverageRatio));
                const barColor = bePercent >= 100 ? 'var(--accent-success)' : 'var(--accent-warning)';

                return slider('fixedCosts', 'Monthly Overheads (The Nut)', 5000, 50000, l.fixedCosts, '$') +
                    slider('personalDraw', 'Owners Draw', 0, 20000, l.personalDraw, '$') +
                    `<div class="break-even-container" style="margin-top: 20px;">
                        <div class="be-label" style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.8rem; color:var(--text-dim);">
                            <span>Break-even Progress</span>
                            <span>${Math.round(this.engine.results.month.coverageRatio)}%</span>
                        </div>
                        <div class="be-track" style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden;">
                            <div class="be-fill" style="width:${bePercent}%; height:100%; background:${barColor}; transition: all 0.5s ease;"></div>
                        </div>
                    </div>` +
                    `<div class="roi-nav-group" style="margin-top: 20px;">
                        <button class="btn-roi-back" data-next="payment">Back</button>
                        <button class="btn-roi-next" data-next="health">Next Phase <span>→</span></button>
                    </div>`;
            case 'health':
                const h = this.engine.results.health;
                const scoreColor = h.score >= 80 ? 'var(--accent-success)' : h.score >= 50 ? 'var(--accent-warning)' : 'var(--accent-danger)';

                const impact = this.engine.results.month.runway > 4 ? '2.4' : '0.1';

                return `<div class="scenario-completion-message">
                    Scenario complete. <br>Your decisions impacted runway by +${impact} months.
                    </div>
                    <div class="health-card" style="text-align:center; padding:10px;">
                    <div class="score-circle" style="width:80px; height:80px; border-radius:50%; border:4px solid ${scoreColor}; display:flex; align-items:center; justify-content:center; margin:0 auto 15px; font-size:1.8rem; font-weight:700; color:${scoreColor}; box-shadow:0 0 20px ${scoreColor}40;">
                        ${Math.round(h.score)}
                    </div>
                    <div class="vitals-grid" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:15px;">
                        <div class="vital-item" style="background:rgba(255,255,255,0.05); padding:8px; border-radius:6px;">
                            <div style="font-size:0.6rem; color:var(--text-dim);">MARGIN</div>
                            <div style="font-weight:600;">${h.vitals.margin}%</div>
                        </div>
                        <div class="vital-item" style="background:rgba(255,255,255,0.05); padding:8px; border-radius:6px;">
                            <div style="font-size:0.6rem; color:var(--text-dim);">RUNWAY</div>
                            <div style="font-weight:600;">${h.vitals.runway}m</div>
                        </div>
                        <div class="vital-item" style="background:rgba(255,255,255,0.05); padding:8px; border-radius:6px;">
                            <div style="font-size:0.6rem; color:var(--text-dim);">EFFIC.</div>
                            <div style="font-weight:600;">$${h.vitals.efficiency}/h</div>
                        </div>
                    </div>
                    <div class="prescription-box" style="background:rgba(141,144,246,0.1); border:1px solid rgba(141,144,246,0.2); padding:10px; border-radius:8px; font-size:0.85rem;">
                        <div style="font-size:0.7rem; text-transform:uppercase; color:var(--primary); margin-bottom:4px;">Prescription</div>
                        ${h.action}
                    </div>
                </div>` +
                    `<div class="roi-nav-group" style="margin-top: 20px;">
                    <button class="btn-roi-back" data-next="month">Back</button>
                    <button class="btn-roi-next" data-next="quote">Replay Story <span>↺</span></button>
                </div>`;
            default:
                return '<div class="controls-title">No simulation levers for this view.</div>';
        }
    }

    formatValue(lever, val) {
        if (lever === 'paymentDelay') return val + ' days';
        if (lever === 'hoursVariation') return val + 'h';
        if (lever === 'overheadPerJob' || lever === 'fixedCosts' || lever === 'personalDraw') return '$' + parseInt(val).toLocaleString();
        return val + '%';
    }
}
