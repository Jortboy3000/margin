/**
 * Story Mode Engine - Interactive Dashboard Storytelling
 * Production-grade implementation with accessibility and performance optimization
 */

class StoryMode {
    constructor() {
        this.stages = [];
        this.currentStage = -1;
        this.isPlaying = false;
        this.observers = [];
        this.respectsReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.narratives = this.initNarratives();

        this.init();
    }

    /**
     * Initialize story narratives for each stage
     */
    initNarratives() {
        return {
            'stage-inputs': {
                title: 'Your Story Begins',
                text: 'Connect your financial data sources and watch your business intelligence come alive',
                delay: 300
            },
            'stage-core': {
                title: 'The Pulse of Your Business',
                text: 'Real-time metrics that matter most to your survival and growth',
                delay: 600
            },
            'path-risk': {
                title: 'Know Your Risks',
                text: 'Early warnings that protect your runway and cashflow',
                delay: 400
            },
            'path-opportunity': {
                title: 'Seize Opportunities',
                text: 'Hidden savings and optimization potential uncovered by Savra',
                delay: 400
            }
        };
    }

    /**
     * Initialize the story mode system
     */
    init() {
        if (!this.checkBrowserSupport()) {
            console.warn('Story Mode: Browser does not support required features');
            return;
        }

        this.setupIntersectionObservers();
        this.setupScrollListeners();
        this.initializeParticleSystem();
        this.setupCardInteractions();
        this.createNarrativeOverlay();

        // Add keyboard shortcuts
        this.setupKeyboardNavigation();

        console.log('Story Mode initialized');
    }

    /**
     * Check browser support for required features
     */
    checkBrowserSupport() {
        return 'IntersectionObserver' in window &&
            'requestAnimationFrame' in window;
    }

    /**
     * Setup Intersection Observers for scroll-triggered animations
     */
    setupIntersectionObservers() {
        const observerConfig = {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: [0, 0.25, 0.5, 0.75, 1.0]
        };

        // Observe stage inputs
        const stageInputs = document.querySelector('.stage-inputs');
        if (stageInputs) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                        this.activateStage('stage-inputs', entry.target);
                    }
                });
            }, observerConfig);
            observer.observe(stageInputs);
            this.observers.push(observer);
        }

        // Observe core metrics
        const stageCore = document.querySelector('.stage-core');
        if (stageCore) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
                        this.activateStage('stage-core', entry.target);
                    }
                });
            }, observerConfig);
            observer.observe(stageCore);
            this.observers.push(observer);
        }

        // Observe split paths
        const pathRisk = document.querySelector('.path-risk');
        const pathOpp = document.querySelector('.path-opportunity');

        if (pathRisk) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                        this.activateStage('path-risk', entry.target);
                    }
                });
            }, observerConfig);
            observer.observe(pathRisk);
            this.observers.push(observer);
        }

        if (pathOpp) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                        this.activateStage('path-opportunity', entry.target);
                    }
                });
            }, observerConfig);
            observer.observe(pathOpp);
            this.observers.push(observer);
        }
    }

    /**
     * Activate a story stage with animations
     */
    activateStage(stageName, element) {
        if (element.classList.contains('story-activated')) return;

        element.classList.add('story-activated');

        // Show narrative if exists
        if (this.narratives[stageName]) {
            this.showNarrative(this.narratives[stageName]);
        }

        // Trigger stage-specific animations
        switch (stageName) {
            case 'stage-inputs':
                this.animateInputPills(element);
                break;
            case 'stage-core':
                this.animateCoreMetrics(element);
                this.startFlowAnimation();
                break;
            case 'path-risk':
            case 'path-opportunity':
                this.animatePathCards(element);
                break;
        }
    }

    /**
     * Animate input pills with sequential reveal
     */
    animateInputPills(container) {
        const pills = container.querySelectorAll('.input-pill');
        if (!pills.length) return;

        pills.forEach((pill, index) => {
            if (this.respectsReducedMotion) {
                pill.style.opacity = '1';
                pill.style.transform = 'translateY(0)';
                return;
            }

            pill.style.opacity = '0';
            pill.style.transform = 'translateY(20px)';

            setTimeout(() => {
                pill.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                pill.style.opacity = '1';
                pill.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    /**
     * Animate core metrics with dramatic reveal
     */
    animateCoreMetrics(container) {
        const cards = container.querySelectorAll('.metric-card');
        if (!cards.length) return;

        cards.forEach((card, index) => {
            if (this.respectsReducedMotion) {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
                return;
            }

            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';

            setTimeout(() => {
                card.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';

                // Add extra pulse for primary card
                if (card.classList.contains('core-primary')) {
                    setTimeout(() => {
                        card.style.animation = 'corePulse 3s infinite';
                    }, 800);
                }
            }, index * 300);
        });
    }

    /**
     * Animate path cards with staggered reveal
     */
    animatePathCards(container) {
        const cards = container.querySelectorAll('.metric-card');
        if (!cards.length) return;

        cards.forEach((card, index) => {
            if (this.respectsReducedMotion) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                return;
            }

            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    /**
     * Start flow line animation
     */
    startFlowAnimation() {
        if (this.respectsReducedMotion) return;

        const flowPaths = document.querySelectorAll('.flow-path');
        flowPaths.forEach(path => {
            path.style.opacity = '1';
        });

        // Start particle flow
        this.startParticleFlow();
    }

    /**
     * Initialize particle system for data flow visualization
     */
    initializeParticleSystem() {
        this.particles = [];
        this.particlePool = [];
        this.maxParticles = 20;

        // Pre-create particles for performance
        for (let i = 0; i < this.maxParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'story-particle';
            this.particlePool.push(particle);
        }
    }

    /**
     * Start particle flow animation
     */
    startParticleFlow() {
        if (this.respectsReducedMotion) return;

        const flowPath = document.getElementById('flowPath');
        if (!flowPath) return;

        const container = document.querySelector('.business-journey');
        if (!container) return;

        let particleInterval = setInterval(() => {
            if (this.particlePool.length > 0) {
                this.emitParticle(flowPath, container);
            }
        }, 800);

        // Stop after 10 seconds
        setTimeout(() => {
            clearInterval(particleInterval);
        }, 10000);
    }

    /**
     * Emit a single particle along the flow path
     */
    emitParticle(path, container) {
        const particle = this.particlePool.pop();
        if (!particle) return;

        container.appendChild(particle);

        const pathLength = path.getTotalLength();
        let progress = 0;
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            progress = Math.min(elapsed / duration, 1);

            const point = path.getPointAtLength(progress * pathLength);
            const rect = container.getBoundingClientRect();

            particle.style.left = `${point.x}px`;
            particle.style.top = `${point.y}px`;
            particle.style.opacity = Math.sin(progress * Math.PI);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Recycle particle
                particle.remove();
                particle.style.opacity = '0';
                this.particlePool.push(particle);
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Setup interactive card click handlers
     */
    setupCardInteractions() {
        const cards = document.querySelectorAll('.metric-card');

        cards.forEach(card => {
            // Add interactive attribute
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', 'Click to view detailed metrics');

            // Click handler
            card.addEventListener('click', (e) => {
                this.expandCard(card);
            });

            // Keyboard handler
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.expandCard(card);
                }
            });

            // Enhanced hover effects
            card.addEventListener('mouseenter', () => {
                if (!this.respectsReducedMotion) {
                    card.style.transform = 'translateY(-8px) scale(1.02)';
                }
            });

            card.addEventListener('mouseleave', () => {
                if (!this.respectsReducedMotion) {
                    card.style.transform = 'translateY(0) scale(1)';
                }
            });
        });
    }

    /**
     * Expand card to show detailed view
     */
    expandCard(card) {
        const metricType = card.getAttribute('data-metric');
        if (!metricType) return;

        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'story-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'modal-title');

        const content = this.generateCardDetailContent(metricType, card);
        modal.innerHTML = content;

        document.body.appendChild(modal);

        // Animate in
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });

        // Close handlers
        const closeBtn = modal.querySelector('.modal-close');
        const backdrop = modal.querySelector('.modal-backdrop');

        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
            card.focus(); // Return focus
        };

        closeBtn?.addEventListener('click', closeModal);
        backdrop?.addEventListener('click', closeModal);

        // Escape key to close
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Focus trap
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        firstFocusable?.focus();

        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable?.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable?.focus();
                }
            }
        });
    }

    /**
     * Generate detailed content for card modal
     */
    generateCardDetailContent(metricType, card) {
        const cardValue = card.querySelector('.card-value, .card-value-large, .card-value-huge')?.textContent || 'N/A';
        const cardLabel = card.querySelector('.card-label, .card-label-large')?.textContent || 'Metric';

        const details = {
            'net-cash': {
                title: 'Net Cash Flow Analysis',
                description: 'Your monthly cash flow shows the difference between money in and money out.',
                insights: [
                    'Current trend is positive (+10% vs last month)',
                    'Main drivers: Increased revenue, reduced overhead',
                    'Watch out for: Seasonal variations in Q1'
                ],
                actions: [
                    'Review expense categories',
                    'Forecast next 3 months',
                    'Set up alerts for < $5k'
                ]
            },
            'runway': {
                title: 'Cash Runway Analysis',
                description: 'Based on current burn rate and cash reserves.',
                insights: [
                    'Current runway: 1.7 months',
                    'Critical threshold: < 1 month',
                    'Safe zone: > 3 months'
                ],
                actions: [
                    'Consider revenue acceleration',
                    'Review discretionary spending',
                    'Explore funding options'
                ]
            },
            'personal': {
                title: 'Personal Expense Detection',
                description: 'Savra-detected personal expenses mixed with business costs.',
                insights: [
                    'Detected: 27% of expenses may be personal',
                    'Confidence: 94%',
                    'Impact: Reduces tax deductions'
                ],
                actions: [
                    'Review flagged transactions',
                    'Separate personal/business accounts',
                    'Update expense policies'
                ]
            },
            'burn': {
                title: 'Burn Rate Analysis',
                description: 'Your monthly cash burn rate and sustainability.',
                insights: [
                    'Current burn: $8.2k/month',
                    'Trending up (needs attention)',
                    'At 82% of safe operational limit'
                ],
                actions: [
                    'Identify largest cost drivers',
                    'Evaluate ROI on major expenses',
                    'Consider cost optimization'
                ]
            },
            'tax': {
                title: 'Tax Optimization Opportunities',
                description: 'Potential tax savings identified by Savra analysis.',
                insights: [
                    'Monthly savings potential: $500',
                    'Deduction opportunities found',
                    '70% confidence in recommendations'
                ],
                actions: [
                    'Review suggested deductions',
                    'Consult with tax advisor',
                    'Implement recommended changes'
                ]
            },
            'profit': {
                title: 'Profitability Metrics',
                description: 'Your profit margins and growth trajectory.',
                insights: [
                    'Current margin: 32%',
                    'Growth: +5% vs last month',
                    'Industry benchmark: 28%'
                ],
                actions: [
                    'Analyze margin by product/service',
                    'Identify high-margin opportunities',
                    'Monitor competitive landscape'
                ]
            }
        };

        const detail = details[metricType] || {
            title: cardLabel,
            description: 'Detailed analysis coming soon.',
            insights: ['More data needed'],
            actions: ['Continue monitoring']
        };

        return `
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <button class="modal-close" aria-label="Close modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="modal-header">
          <h2 id="modal-title">${detail.title}</h2>
          <div class="modal-value">${cardValue}</div>
          <p class="modal-description">${detail.description}</p>
        </div>
        
        <div class="modal-body">
          <div class="modal-section">
            <h3>Key Insights</h3>
            <ul class="insights-list">
              ${detail.insights.map(insight => `<li>${insight}</li>`).join('')}
            </ul>
          </div>
          
          <div class="modal-section">
            <h3>Recommended Actions</h3>
            <ul class="actions-list">
              ${detail.actions.map(action => `<li>${action}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-primary">Deep Dive Analysis</button>
          <button class="btn-outline modal-close">Close</button>
        </div>
      </div>
    `;
    }

    /**
     * Create narrative overlay element
     */
    createNarrativeOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'narrative-overlay';
        overlay.setAttribute('aria-live', 'polite');
        overlay.innerHTML = `
      <div class="narrative-content">
        <h3 class="narrative-title"></h3>
        <p class="narrative-text"></p>
      </div>
    `;
        document.body.appendChild(overlay);
        this.narrativeOverlay = overlay;
    }

    /**
     * Show narrative text
     */
    showNarrative(narrative) {
        if (!this.narrativeOverlay) return;

        const title = this.narrativeOverlay.querySelector('.narrative-title');
        const text = this.narrativeOverlay.querySelector('.narrative-text');

        if (title && text) {
            title.textContent = narrative.title;
            text.textContent = narrative.text;

            setTimeout(() => {
                this.narrativeOverlay.classList.add('active');
            }, narrative.delay || 300);

            setTimeout(() => {
                this.narrativeOverlay.classList.remove('active');
            }, 3000 + (narrative.delay || 300));
        }
    }

    /**
     * Setup scroll listeners for flow animation sync
     */
    setupScrollListeners() {
        let ticking = false;

        const updateOnScroll = () => {
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            this.updateFlowProgress(scrollPercent);
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Update flow line progress based on scroll
     */
    updateFlowProgress(percent) {
        // Could sync flow animations with scroll position
        // Implementation depends on desired effect
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Add keyboard shortcuts if needed
            // e.g., 'R' to replay story
        });
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];

        if (this.narrativeOverlay) {
            this.narrativeOverlay.remove();
        }

        this.particlePool.forEach(particle => particle.remove());
        this.particlePool = [];
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.storyMode = new StoryMode();
    });
} else {
    window.storyMode = new StoryMode();
}

export default StoryMode;
