/**
 * Enhanced Magnetic Cursor & Advanced Interactions
 * Creates delightful, premium cursor effects and element magnetism
 */

class MagneticCursor {
    constructor() {
        this.cursor = null;
        this.cursorDot = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.dotX = 0;
        this.dotY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.magneticElements = [];
        this.isActive = false;
    }

    init() {
        // Create cursor elements
        this.cursor = document.createElement('div');
        this.cursor.className = 'magnetic-cursor';
        document.body.appendChild(this.cursor);

        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'magnetic-cursor-dot';
        document.body.appendChild(this.cursorDot);

        // Track mouse movement
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // Detect magnetic elements
        this.detectMagneticElements();

        // Start animation loop
        this.animate();

        // Show cursor after init
        setTimeout(() => {
            this.cursor.classList.add('active');
        }, 100);
    }

    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    detectMagneticElements() {
        // Select elements that should have magnetic effect
        const selectors = [
            '.api-node',
            '.neural-node',
            '.metric-card',
            '.q-card',
            '.trust-item'
        ];

        this.magneticElements = [];
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                this.magneticElements.push({
                    element: el,
                    rect: null,
                    strength: el.classList.contains('btn-primary') ? 30 : 20
                });

                // Add hover listeners
                el.addEventListener('mouseenter', () => this.onElementEnter(el));
                el.addEventListener('mouseleave', () => this.onElementLeave(el));
            });
        });
    }

    onElementEnter(element) {
        this.isActive = true;
        this.cursor.style.transform = 'scale(1.5)';
    }

    onElementLeave(element) {
        this.isActive = false;
        this.cursor.style.transform = 'scale(1)';
        // Reset element position
        element.style.transform = '';
    }

    animate() {
        // Smooth cursor following
        this.dotX += (this.mouseX - this.dotX) * 0.15;
        this.dotY += (this.mouseY - this.dotY) * 0.15;

        this.cursorX += (this.mouseX - this.cursorX) * 0.08;
        this.cursorY += (this.mouseY - this.cursorY) * 0.08;

        this.cursorDot.style.transform = `translate(${this.dotX}px, ${this.dotY}px)`;
        this.cursor.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px) scale(${this.isActive ? 1.5 : 1})`;

        // Check magnetic attraction
        this.magneticElements.forEach(item => {
            const el = item.element;
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = this.mouseX - centerX;
            const deltaY = this.mouseY - centerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Magnetic radius
            const magneticRadius = 100;

            if (distance < magneticRadius) {
                const force = (1 - distance / magneticRadius) * item.strength;
                const pullX = (deltaX / distance) * force;
                const pullY = (deltaY / distance) * force;

                el.style.transform = `translate(${pullX}px, ${pullY}px)`;
            } else if (el.style.transform) {
                // Gradually reset
                el.style.transform = '';
            }
        });

        requestAnimationFrame(() => this.animate());
    }

    refresh() {
        // Re-detect elements (useful after DOM changes)
        this.detectMagneticElements();
    }
}

/**
 * Value Counter Animation
 * Smoothly animates numeric values with easing
 */
class ValueCounter {
    static animateValue(element, start, end, duration = 1500, options = {}) {
        const {
            prefix = '',
            suffix = '',
            decimals = 0,
            separator = ',',
            easing = 'easeOutQuart'
        } = options;

        const startTime = Date.now();
        const range = end - start;

        const easingFunctions = {
            linear: t => t,
            easeOutQuart: t => 1 - Math.pow(1 - t, 4),
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        };

        const easeFn = easingFunctions[easing] || easingFunctions.easeOutQuart;

        element.classList.add('updating');

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easedProgress = easeFn(progress);
            const currentValue = start + (range * easedProgress);

            // Format number
            let formattedValue = currentValue.toFixed(decimals);

            // Add thousands separator
            if (separator) {
                const parts = formattedValue.split('.');
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
                formattedValue = parts.join('.');
            }

            element.textContent = prefix + formattedValue + suffix;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.classList.remove('updating');
            }
        };

        requestAnimationFrame(animate);
    }

    static animateFromAttribute(element) {
        const value = parseFloat(element.dataset.value || 0);
        const prefix = element.dataset.prefix || '';
        const suffix = element.dataset.suffix || '';
        const decimals = parseInt(element.dataset.decimals || '0');

        ValueCounter.animateValue(element, 0, value, 1500, {
            prefix,
            suffix,
            decimals,
            separator: ','
        });
    }
}

/**
 * Scroll Reveal Animations
 * Reveals elements with smooth animations as they enter viewport
 */
class ScrollReveal {
    constructor() {
        this.observer = null;
        this.elements = [];
    }

    init() {
        const options = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Animate counters if present
                    const counters = entry.target.querySelectorAll('[data-value]');
                    counters.forEach(counter => {
                        ValueCounter.animateFromAttribute(counter);
                    });

                    // Don't observe anymore (one-time animation)
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe elements
        this.observeElements();
    }

    observeElements() {
        const selectors = [
            '.reveal-on-scroll',
            '.reveal-scale-scroll',
            '.metric-card',
            '.trust-item',
            '.q-card'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (!el.classList.contains('visible')) {
                    this.observer.observe(el);
                }
            });
        });
    }

    refresh() {
        this.observeElements();
    }
}

/**
 * Progress Bar Animator
 */
class ProgressBarAnimator {
    static animateBar(barElement, targetPercent, duration = 1500) {
        const startTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentPercent = targetPercent * eased;

            barElement.style.width = `${currentPercent}%`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    static animateCircular(circleElement, targetPercent, duration = 1500) {
        const circumference = 283; // 2 * π * r (radius = 45)
        const offset = circumference - (targetPercent / 100) * circumference;

        circleElement.style.strokeDashoffset = circumference;

        setTimeout(() => {
            circleElement.style.strokeDashoffset = offset;
        }, 100);
    }
}

/**
 * Sparkline Generator
 */
class Sparkline {
    static generate(container, data, options = {}) {
        const {
            width = 200,
            height = 40,
            color = '#8d90f6',
            gradientId = 'sparklineGradient'
        } = options;

        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min;

        // Create SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

        // Create gradient
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', gradientId);
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '0%');
        gradient.setAttribute('y2', '100%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', color);
        stop1.setAttribute('stop-opacity', '0.8');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', color);
        stop2.setAttribute('stop-opacity', '0.1');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.appendChild(defs);

        // Generate path
        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - min) / range) * (height - 10) - 5;
            return `${x},${y}`;
        });

        // Line path
        const linePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        linePath.setAttribute('d', `M ${points.join(' L ')}`);
        linePath.classList.add('sparkline-line');

        // Area path
        const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const areaPoints = `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;
        areaPath.setAttribute('d', areaPoints);
        areaPath.classList.add('sparkline-area');

        svg.appendChild(areaPath);
        svg.appendChild(linePath);

        // Add dots
        data.forEach((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - min) / range) * (height - 10) - 5;

            const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dot.setAttribute('cx', x);
            dot.setAttribute('cy', y);
            dot.classList.add('sparkline-dot');
            svg.appendChild(dot);
        });

        container.innerHTML = '';
        container.appendChild(svg);
    }
}

// Export for use
export { MagneticCursor, ValueCounter, ScrollReveal, ProgressBarAnimator, Sparkline };
