import './style.css';
import './trust.css';
import './light-mode.css';
import './footer.css';
import './dashboard-hub.css';
import './micro_animations.css';
import './value_indicators.css';
import './stream_particles.css';
import './utilities.css';
import './hero_enhancements.css';
import './feature_cards.css';
import './integration_map.css';
import './comparison_section.css';
import './enhanced_header.css';
import './story-mode.css';
import './premium_polish.css';
import './professional_background.css';
import { DashboardHub } from './dashboard-hub.js';
import { MagneticCursor, ValueCounter, ScrollReveal, ProgressBarAnimator, Sparkline } from './enhanced_interactions.js';
import { ROICalculator } from './roi_calculator.js';
import StoryMode from './story-mode.js';

console.log('Savra System v2.0 - Initializing...');

/**
 * Core Application Orchestrator
 */
import { StoryUI } from './story-ui.js';
// ROICalculator is already imported at line 18 (checking valid file first)

class SavraApp {
    constructor() {
        this.dashboardHub = new DashboardHub();
        this.streamViz = null;
        this.dashboard = new DashboardCharts();
        this.magneticCursor = new MagneticCursor();
        this.scrollReveal = new ScrollReveal();
        this.storyUI = null; // Interactive Story Spine
        this.roiCalculator = null;
        this.initThemeToggle();
    }

    init() {
        try {
            // Init Dashboard Hub
            this.dashboardHub.init();

            // Init Stream
            this.streamViz = new StreamVisualization({ nodes3D: [] });
            this.streamViz.init();
            this.dashboard.init();

            // Global Lucide Icons
            if (window.lucide) window.lucide.createIcons();

            // Smart Title Animations
            this.initTitleObservers();

            // Initialize Enhanced Interactions
            this.magneticCursor.init();
            this.scrollReveal.init();
            this.initValueCounters();
            this.initProgressBars();

            // Initialize Story Spine MVP
            this.storyUI = new StoryUI('story-spine-app');

            // Initialize ROI Calculator
            // Initialize ROI Calculator with Dashboard Connection
            this.roiCalculator = new ROICalculator('roi-calculator-widget', {
                onUpdate: (data) => this.updateDashboardPreview(data)
            });

            console.log('Savra System v2.1 Online - Enhanced Edition 🚀');
        } catch (e) {
            console.error('Savra Initialization Failed:', e);
        }
    }

    initValueCounters() {
        // Animate all metric values with data attributes
        document.querySelectorAll('[data-value]').forEach(element => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        ValueCounter.animateFromAttribute(element);
                        observer.unobserve(element);
                    }
                });
            }, { threshold: 0.3 });
            observer.observe(element);
        });
    }

    initProgressBars() {
        // Animate progress bars when visible
        document.querySelectorAll('.progress-bar-fill').forEach(bar => {
            const targetPercent = parseFloat(bar.dataset.percent || '0');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        ProgressBarAnimator.animateBar(bar, targetPercent);
                        observer.unobserve(bar);
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(bar);
        });
    }

    initThemeToggle() {
        // Check for saved theme preference or default to LIGHT mode
        const savedTheme = localStorage.getItem('theme') || 'light';

        // Apply theme immediately on load for all pages
        if (savedTheme === 'dark') {
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
        }

        // Attach event listener ONLY if the toggle exists (homepage)
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('light-mode');

                // Save preference
                const isLight = document.body.classList.contains('light-mode');
                localStorage.setItem('theme', isLight ? 'light' : 'dark');

                // Re-render Lucide icons after theme change
                if (window.lucide) {
                    setTimeout(() => window.lucide.createIcons(), 50);
                }
            });
        }
    }

    updateDashboardPreview(data) {
        // Find dashboard metric elements
        const preview = document.querySelector('.dashboard-preview');
        if (!preview) return;

        // 1. Update Cash Flow (Linked to Revenue)
        // Scale: Revenue * 0.25 (simulated margin)
        const cashFlow = (data.revenue * 0.25) / 1000;
        const cashFlowEl = preview.querySelector('.preview-metric:nth-child(1) .value-counter');
        if (cashFlowEl) cashFlowEl.textContent = `$${cashFlow.toFixed(1)}k`;

        // 2. Update Burn Rate (Linked to Transactions)
        // Scale: Base $5k + ($2 per transaction)
        const burnRate = (5000 + (data.transactions * 2)) / 1000;
        const burnRateEl = preview.querySelector('.preview-metric:nth-child(3) .value-counter');
        if (burnRateEl) burnRateEl.textContent = `$${burnRate.toFixed(1)}k`;

        // 3. Update Profit (Derived)
        const revenueK = data.revenue / 1000;
        const profit = ((revenueK - burnRate) / revenueK) * 100;
        const profitEl = preview.querySelector('.preview-metric:nth-child(4) .value-counter');
        if (profitEl) profitEl.textContent = `${Math.max(0, profit).toFixed(0)}%`;
    }

    initTitleObservers() {
        const options = { threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Stagger children
                    const spans = entry.target.querySelectorAll('span');
                    spans.forEach((span, i) => {
                        span.style.transitionDelay = `${i * 100}ms`;
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        document.querySelectorAll('.animate-title').forEach(el => {
            el.classList.add('js-ready'); // Activate hidden state now that JS is running
            observer.observe(el);
        });
    }
}

/**
 * Module: Orbit System
 * Handles the rotating API nodes and data packet spawning
 */
class OrbitSystem {
    constructor() {
        this.container = document.querySelector('.orbit-system');
        this.parallaxLayer = document.querySelector('.parallax-layer');
        this.svg = document.querySelector('.connection-layer');
        this.hub = document.querySelector('.hub-center');

        this.activeNodes = [];
        this.rings = [
            { r: 220, count: 8, speed: 60, dir: 1, paused: false },
            { r: 380, count: 12, speed: 90, dir: -1, paused: false }
        ];

        this.ALL_CONNECTORS = [
            "Openai", "Stripe", "Github", "Slack", "Google", "Discord", "Notion", "Hubspot", "Salesforce", "Shopify",
            "Airtable", "Intercom", "Mailchimp", "Zendesk", "Twilio", "Zoom", "Dropbox", "Trello", "Asana", "Jira"
        ];

        this.INSIGHTS = [
            { text: "Revenue +12%", type: "success" },
            { text: "Churn Risk Detected", type: "danger" },
            { text: "Optimising Ad Spend", type: "warning" },
            { text: "Customer LTV ↑", type: "success" },
            { text: "Server Load 40%", type: "info" }
        ];
    }

    init() {
        if (!this.container || !this.svg) return;

        this.centerX = this.container.offsetWidth / 2;
        this.centerY = this.container.offsetHeight / 2;

        // Accessibility Check
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.setupNodes();
        this.startAnimationLoop();

        // Only start heavy animations if motion is allowed
        if (!this.prefersReducedMotion) {
            this.startPacketSystem();
            this.setupParallax();
        }
    }

    setupNodes() {
        // Sentient Neural Cloud Config
        // We simulate 3D spherical coordinates
        this.nodes3D = [];
        const nodeCount = 40;
        const radius = 300; // Cloud Radius

        for (let i = 0; i < nodeCount; i++) {
            // Fibonacci Sphere for even distribution
            const phi = Math.acos(1 - 2 * (i + 0.5) / nodeCount);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            // Create Node
            const nodeEl = document.createElement('div');
            nodeEl.className = 'neural-node';
            // nodeEl.textContent = this.ALL_CONNECTORS[i % this.ALL_CONNECTORS.length];
            this.parallaxLayer.appendChild(nodeEl);

            // Random Drift velocity
            const drift = {
                x: (Math.random() - 0.5) * 0.2,
                y: (Math.random() - 0.5) * 0.2,
                z: (Math.random() - 0.5) * 0.2
            };

            const nodeObj = {
                el: nodeEl,
                x, y, z,
                baseX: x, baseY: y, baseZ: z,
                drift
            };
            this.nodes3D.push(nodeObj);
            this.attachNodeEvents(nodeObj);
        }

        // Synapse Pool (reusable lines)
        this.synapses = [];
        const maxLines = 60;
        for (let i = 0; i < maxLines; i++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.classList.add('neural-synapse');
            line.style.opacity = 0;
            this.svg.appendChild(line);
            this.synapses.push({ el: line, active: false });
        }
    }

    attachNodeEvents(node) {
        node.el.addEventListener('mouseenter', () => {
            node.el.style.boxShadow = '0 0 30px #ffffff, 0 0 60px var(--primary)';
            node.el.style.zIndex = 1000;
        });

        node.el.addEventListener('mouseleave', () => {
            // Reset is handled by animation loop (zIndex/boxShadow overridden by CSS/JS loop)
            // But we can reset style here to let CSS take over
            node.el.style.boxShadow = '';
        });

        node.el.addEventListener('click', () => this.spawnDataPacket(node));
    }

    startAnimationLoop() {
        let rotationY = 0;
        let rotationX = 0;
        const focalLength = 600; // Camera distance

        const animate = () => {
            // Rotate Cloud
            if (!this.prefersReducedMotion) {
                // Mouse Parallax influence on rotation speed
                const mx = (window.mouseX || window.innerWidth / 2) - window.innerWidth / 2;
                const my = (window.mouseY || window.innerHeight / 2) - window.innerHeight / 2;

                rotationY += 0.002 + (mx * 0.00001); // Spin Y
                rotationX += (my * 0.00001); // Tilt X
            }

            // Project Nodes
            const activeConnections = [];

            this.nodes3D.forEach(node => {
                // Apply Rotation Matrix (Y then X)
                let x = node.baseX;
                let z = node.baseZ;
                let y = node.baseY;

                // Rotate Y
                let cosY = Math.cos(rotationY);
                let sinY = Math.sin(rotationY);
                let x1 = x * cosY - z * sinY;
                let z1 = z * cosY + x * sinY;

                // Rotate X
                let cosX = Math.cos(rotationX);
                let sinX = Math.sin(rotationX);
                let y2 = y * cosX - z1 * sinX;
                let z2 = z1 * cosX + y * sinX;

                // Update Coordinates for connection logic
                node.projX = x1;
                node.projY = y2;
                node.projZ = z2;

                // Perspective Projection
                const scale = focalLength / (focalLength + z2);
                node.scale = scale;

                const screenX = this.centerX + x1 * scale;
                const screenY = this.centerY + y2 * scale;

                // Render Node
                node.screenX = screenX;
                node.screenY = screenY;

                node.el.style.transform = `translate(${screenX}px, ${screenY}px) scale(${scale})`;
                node.el.style.opacity = Math.max(0.2, (scale - 0.5) * 2); // Fade back nodes
                node.el.style.zIndex = Math.floor(scale * 100);
            });

            // Dynamic Synapses (Connect nearest neighbors in 3D space)
            // Reset lines
            this.synapses.forEach(s => s.active = false);
            let lineIdx = 0;

            // Simple proximity check (can be optimized but fine for 40 nodes)
            for (let i = 0; i < this.nodes3D.length; i++) {
                const n1 = this.nodes3D[i];
                if (n1.projZ < -100) continue; // Don't connect deeply hidden nodes

                for (let j = i + 1; j < this.nodes3D.length; j++) {
                    const n2 = this.nodes3D[j];
                    if (n2.projZ < -100) continue;

                    // Distance in 3D space (not projected)
                    const dx = n1.projX - n2.projX;
                    const dy = n1.projY - n2.projY;
                    const dz = n1.projZ - n2.projZ;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < 120) { // Connection Threshold
                        if (lineIdx >= this.synapses.length) break;
                        const s = this.synapses[lineIdx++];
                        s.active = true;

                        s.el.setAttribute('x1', n1.screenX);
                        s.el.setAttribute('y1', n1.screenY);
                        s.el.setAttribute('x2', n2.screenX);
                        s.el.setAttribute('y2', n2.screenY);

                        // Opacity based on distance and depth
                        const opacity = (1 - dist / 120) * Math.min(n1.scale, n2.scale) * 0.5;
                        s.el.style.opacity = opacity;
                    }
                }
            }

            // Hide unused lines
            for (let k = lineIdx; k < this.synapses.length; k++) {
                this.synapses[k].el.style.opacity = 0;
            }

            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    // Removed setupParallax as it is integrated into the loop logic naturally
    setupParallax() { }

    // Packet System
    startPacketSystem() {
        setInterval(() => {
            this.spawnDataPacket();
            if (Math.random() > 0.6) this.spawnInsightCard();
        }, 400);
    }

    spawnDataPacket(specificNode = null) {
        if (!this.nodes3D || !this.nodes3D.length) return;
        const sourceNode = specificNode || this.nodes3D[Math.floor(Math.random() * this.nodes3D.length)];

        // Only spawn from visible nodes
        if (sourceNode.projZ < -100 && !specificNode) return;

        const packet = document.createElement('div');
        packet.className = 'data-packet';
        this.container.appendChild(packet);

        // Flash node
        sourceNode.el.classList.add('active-packet');
        setTimeout(() => sourceNode.el.classList.remove('active-packet'), 200);

        const startX = sourceNode.screenX;
        const startY = sourceNode.screenY;

        let progress = 0;
        const duration = 800;
        const startTime = Date.now();

        const move = () => {
            const now = Date.now();
            progress = (now - startTime) / duration;

            if (progress >= 1) {
                packet.remove();
                this.triggerHubPulse();
                return;
            }

            const cx = startX + (this.centerX - startX) * progress;
            const cy = startY + (this.centerY - startY) * progress;
            packet.style.left = `${cx - 3}px`;
            packet.style.top = `${cy - 3}px`;
            requestAnimationFrame(move);
        };
        requestAnimationFrame(move);
    }

    spawnInsightCard() {
        const item = this.INSIGHTS[Math.floor(Math.random() * this.INSIGHTS.length)];
        const card = document.createElement('div');
        // card.className = `insight-card type-${item.type}`; // Bug fix: some items might not have type
        card.classList.add('insight-card');
        if (item.type) card.classList.add(`type-${item.type}`);

        card.textContent = item.text;
        this.container.appendChild(card);

        const angle = Math.random() * Math.PI * 2;
        const dist = 100 + Math.random() * 50;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist - 50;

        requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1)`;
        });

        setTimeout(() => {
            card.style.opacity = '0';
            setTimeout(() => card.remove(), 500);
        }, 2000);
    }

    triggerHubPulse() {
        this.hub.classList.add('pulse');
        setTimeout(() => this.hub.classList.remove('pulse'), 150);
    }
}

/**
 * Module: Stream Visualization
 * Handles the vertical 5-point data stream and scroll interactions
 */
class StreamVisualization {
    constructor(orbitSystem) {
        this.orbit = orbitSystem;
        this.container = document.querySelector('.stream-container');
        this.path = document.getElementById('streamPath');
        this.head = document.getElementById('streamHead');
        this.checkpoints = {
            c0: document.querySelector('.c0-welcome'),
            c1: document.querySelector('.c1'),
            c2: document.querySelector('.c2'),
            c3: document.querySelector('.c3'),
            c4: document.querySelector('.c4'),
            c5: document.querySelector('.c5'),
        };
    }

    init() {
        if (!this.container || !this.path) return;

        this.updatePath();
        this.measureSegments();
        this.setupMouseGrid();

        window.addEventListener('resize', () => {
            this.updatePath();
            this.measureSegments();
        });
        window.addEventListener('scroll', () => this.handleScroll());

        // Initial Draw
        setTimeout(() => this.handleScroll(), 100);

        // Start Living Data Stream
        this.startParticleSystem();
    }

    updatePath() {
        const w = this.container.offsetWidth;
        const h = this.container.offsetHeight;

        // Anchor to Hub Center (800px)
        const hubOffset = 800;
        const startX = w * 0.5;
        const startY = hubOffset;
        const endX = w * 0.5;
        const endY = h;

        // Interaction Physics (WARP)
        // Check mouse distance from stream center
        let warpX = 0;
        if (window.mouseX) {
            const centerX = w * 0.5;
            const dist = window.mouseX - centerX;
            // Magnetic force: only affects if within 300px
            if (Math.abs(dist) < 300) {
                // Push TOWARDS mouse (Magnet)
                warpX = dist * 0.4;
            }
        }

        // Dynamic Control Points based on Warp
        // We gently interpolate the warp influence down the stream
        const pts = [
            { x: w * 0.50 + (warpX * 0.1), y: hubOffset + 300 }, // C0
            { x: w * 0.25 + (warpX * 0.5), y: h * 0.55 }, // C1
            { x: w * 0.75 - (warpX * 0.3), y: h * 0.65 }, // C2 (Oppose)
            { x: w * 0.50 + (warpX * 0.8), y: h * 0.75 }, // C3 (Max effect)
            { x: w * 0.25 + (warpX * 0.4), y: h * 0.85 }, // C4
            { x: w * 0.50 + (warpX * 0.1), y: h * 0.96 }  // C5
        ];

        const midY = (y1, y2) => (y1 + y2) / 2;

        let d = `M ${startX},${startY}`;
        d += ` C ${startX},${midY(startY, pts[0].y)} ${pts[0].x},${midY(startY, pts[0].y)} ${pts[0].x},${pts[0].y}`;
        d += ` C ${pts[0].x},${midY(pts[0].y, pts[1].y)} ${pts[1].x},${midY(pts[0].y, pts[1].y)} ${pts[1].x},${pts[1].y}`;
        d += ` C ${pts[1].x},${midY(pts[1].y, pts[2].y)} ${pts[2].x},${midY(pts[1].y, pts[2].y)} ${pts[2].x},${pts[2].y}`;
        d += ` C ${pts[2].x},${midY(pts[2].y, pts[3].y)} ${pts[3].x},${midY(pts[2].y, pts[3].y)} ${pts[3].x},${pts[3].y}`;
        d += ` C ${pts[3].x},${midY(pts[3].y, pts[4].y)} ${pts[4].x},${midY(pts[3].y, pts[4].y)} ${pts[4].x},${pts[4].y}`;
        d += ` C ${pts[4].x},${midY(pts[4].y, pts[5].y)} ${pts[5].x},${midY(pts[4].y, pts[5].y)} ${pts[5].x},${pts[5].y}`;
        d += ` C ${pts[5].x},${midY(pts[5].y, endY)} ${endX},${midY(pts[5].y, endY)} ${endX},${endY}`;

        this.path.setAttribute('d', d);

        const len = this.path.getTotalLength();
        this.path.style.strokeDasharray = len;
        this.path.style.strokeDashoffset = len;
        this.totalPathLength = len;
    }

    startParticleSystem() {
        if (!this.path) return;

        // Start Plasma Noise Animation
        const turbulence = document.querySelector('#plasma feTurbulence');
        if (turbulence) {
            let baseFreq = 0.01;
            const animatePlasma = () => {
                baseFreq += 0.0005; // Flow speed
                turbulence.setAttribute('baseFrequency', `0.01 ${0.005 + Math.sin(baseFreq) * 0.005}`);

                // Continuous Physics Loop
                this.updatePath();

                if (!document.hidden) requestAnimationFrame(animatePlasma);
            };
            requestAnimationFrame(animatePlasma);
        }

        // Spawn particles periodically
        setInterval(() => {
            if (!document.hidden) this.spawnParticle();
        }, 800);
    }

    measureSegments() {
        const h = this.container.offsetHeight;
        const c0Y = 800 + 300; // Sync with updatePath
        const targets = [
            { id: 'hub', el: null, yPct: 800 / h },
            { id: 'c0', el: this.checkpoints.c0, yPct: c0Y / h },
            { id: 'c1', el: this.checkpoints.c1, yPct: 0.55 },
            { id: 'c2', el: this.checkpoints.c2, yPct: 0.65 },
            { id: 'c3', el: this.checkpoints.c3, yPct: 0.75 },
            { id: 'c4', el: this.checkpoints.c4, yPct: 0.85 },
            { id: 'c5', el: this.checkpoints.c5, yPct: 0.96 },
            { id: 'end', el: null, yPct: 1.0 }
        ];

        this.segments = targets.map(t => {
            const targetY = h * t.yPct;
            let bestL = 0;
            if (t.yPct <= targets[0].yPct) bestL = 0;
            else if (t.yPct >= 0.99) bestL = this.totalPathLength;
            else {
                for (let l = 0; l <= this.totalPathLength; l += 5) {
                    const p = this.path.getPointAtLength(l);
                    if (p.y >= targetY) { bestL = l; break; }
                }
            }
            return { id: t.id, y: targetY, l: bestL, el: t.el };
        });
    }

    handleScroll() {
        if (!this.segments) return;

        const rect = this.container.getBoundingClientRect();
        const winH = window.innerHeight;
        const centerScreen = winH * 0.5;
        let focusY = centerScreen - rect.top;

        const maxH = this.container.offsetHeight;
        focusY = Math.max(0, Math.min(maxH, focusY));

        // 1. Orbit Fading & Energy Transfer (Cinematic Stage Clearing)
        if (this.orbit && this.orbit.container) {
            const fadeStart = 600;
            const fadeEnd = 1000;
            const opacity = Math.max(0, 1 - (focusY - fadeStart) / (fadeEnd - fadeStart));

            this.orbit.container.style.opacity = opacity;
            this.orbit.container.style.filter = `blur(${(1 - opacity) * 8}px)`;

            // ENERGY TRANSFER: Stream line sucks energy from Hub (Logo stays original color)
            const transferStart = 400;
            const transferPeak = 800; // Peak at Hub center
            const transferFactor = Math.max(0, Math.min(1, (focusY - transferStart) / (transferPeak - transferStart)));

            // STREAM GLOW: Line sucks energy from Hub
            if (this.path) {
                const glowIntensity = 4 + (transferFactor * 10);
                const strokeWidth = 3 + (transferFactor * 3);
                this.path.style.setProperty('--stream-glow', `${glowIntensity}px`);
                this.path.style.setProperty('--stream-width', strokeWidth);
            }
        }

        // 2. Interpolate Logic
        let currentSeg = 0;
        for (let i = 0; i < this.segments.length - 1; i++) {
            if (focusY >= this.segments[i].y && focusY < this.segments[i + 1].y) {
                currentSeg = i; break;
            }
        }
        if (focusY >= this.segments[this.segments.length - 1].y) {
            currentSeg = this.segments.length - 2;
        }

        const start = this.segments[currentSeg];
        const end = this.segments[currentSeg + 1];
        const segProgress = (focusY - start.y) / (end.y - start.y);
        const drawLen = start.l + (end.l - start.l) * segProgress;

        this.path.style.strokeDashoffset = this.totalPathLength - drawLen;

        // 3. Head Logic
        if (this.head) {
            if (drawLen > 1 && drawLen < this.totalPathLength) {
                this.head.style.opacity = 1;
                const pt = this.path.getPointAtLength(drawLen);
                this.head.style.transform = `translate(-50%, -50%) translate(${pt.x}px, ${pt.y}px)`;
            } else {
                this.head.style.opacity = 0;
            }
        }

        // 4. Activation (Cinematic Bloom)
        this.segments.forEach(seg => {
            if (seg.el) {
                let isActive = focusY >= (seg.y - 120);

                // SPECIAL: C0 Fades Out after passing (Interstitial)
                if (seg.id === 'c0') {
                    // Active window: Start EARLY (y-400) to End (y+200)
                    // This ensures it fades in as the stream starts drawing (at 800px)
                    isActive = focusY >= (seg.y - 400) && focusY < (seg.y + 200);
                }

                this.toggle(seg.el, isActive);
            }
        });

        // 5. Connection Logic (Stream Complete -> Reveal Trust)
        // If focusesY passes 95% of total height, we consider the stream "connected".
        const completionPct = focusY / maxH;
        if (completionPct > 0.95) {
            document.body.classList.add('stream-connected');
            document.body.classList.add('show-grid');
        } else {
            document.body.classList.remove('stream-connected');
            if (completionPct < 0.9) document.body.classList.remove('show-grid'); // Keep grid on a bit longer
        }
    }

    setupMouseGrid() {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            // Store global for Physics Loop
            window.mouseX = x;
            document.documentElement.style.setProperty('--mouse-x', `${x}px`);
            document.documentElement.style.setProperty('--mouse-y', `${y}px`);
        });
    }

    startParticleSystem() {
        if (!this.path) return;

        // Add pulse animation to the path
        this.path.classList.add('stream-pulse');

        // Spawn particles periodically
        setInterval(() => {
            if (!document.hidden) this.spawnParticle();
        }, 1200); // New particle every 1.2s
    }

    spawnParticle() {
        const particle = document.createElement('div');
        particle.className = 'stream-particle';
        this.container.appendChild(particle);

        const duration = 4000; // 4s to travel down
        const startTime = Date.now();
        const pathLen = this.totalPathLength;

        const animate = () => {
            const now = Date.now();
            const progress = (now - startTime) / duration;

            if (progress >= 1) {
                particle.remove();
                return;
            }

            // Move along path
            const pt = this.path.getPointAtLength(progress * pathLen);
            particle.style.transform = `translate(${pt.x}px, ${pt.y}px)`;

            // Fade in/out logic
            if (progress < 0.1) particle.style.opacity = progress * 10;
            else if (progress > 0.9) particle.style.opacity = (1 - progress) * 10;
            else particle.style.opacity = 1;

            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    toggle(el, active) {
        if (active) el.classList.add('active');
        else el.classList.remove('active');
    }
}

/**
 * Module: Dashboard Charts
 * Handles safe initialization of ApexCharts
 */
class DashboardCharts {
    constructor() {
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        // Safety check for library and clean DOM
        if (window.ApexCharts && document.querySelector("#revenueChart")) {
            this.renderRevenueChart();
            this.renderSourceChart();
            this.initialized = true;
        }
    }

    renderRevenueChart() {
        const el = document.querySelector("#revenueChart");
        if (!el) return;

        const options = {
            series: [{ name: 'Net Volume', data: [3100000, 3200000, 3150000, 3350000, 3400000, 3300000, 3528198] }],
            chart: { type: 'area', height: 180, toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'Inter, sans-serif' },
            colors: ['#8d90f6'],
            fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 90, 100] } },
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 3 },
            xaxis: { categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Current'], labels: { style: { colors: '#64748b' } }, axisBorder: { show: false }, axisTicks: { show: false } },
            yaxis: { show: false },
            grid: { show: true, borderColor: 'rgba(255,255,255,0.05)', strokeDashArray: 4, xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } }, padding: { top: 0, right: 0, bottom: 0, left: 10 } },
            tooltip: { theme: 'dark', x: { show: false }, y: { formatter: (v) => "A$" + v.toLocaleString() } }
        };

        new window.ApexCharts(el, options).render();
    }

    renderSourceChart() {
        const el = document.querySelector("#sourceChart");
        if (!el) return;

        const options = {
            series: [68, 24, 8],
            labels: ['Stripe', 'Shopify', 'Manual'],
            chart: { type: 'donut', height: 220, fontFamily: 'Inter, sans-serif' },
            colors: ['#8d90f6', '#a855f7', '#94a3b8'],
            plotOptions: { pie: { donut: { size: '65%', labels: { show: true, total: { show: true, label: 'Total', color: '#1e293b', formatter: () => '100%' } } } } },
            dataLabels: { enabled: false },
            legend: { position: 'bottom', itemMargin: { horizontal: 10, vertical: 5 }, markers: { radius: 12 } },
            stroke: { show: false }
        };

        new window.ApexCharts(el, options).render();
    }
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
    const app = new SavraApp();
    app.init();
});
