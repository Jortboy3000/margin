/**
 * Business Journey - Animated Orchestration
 */

export class DashboardHub {
    constructor() {
        this.stages = {
            inputs: document.querySelector('.stage-inputs'),
            core: document.querySelector('.stage-core'),
            split: document.querySelector('.journey-split')
        };
    }

    init() {
        // Start the count-up animations with proper timing
        this.animateJourney();
    }

    animateJourney() {
        // Core metrics count-up (starts when they zoom in at 1.6s)
        setTimeout(() => {
            this.animateValue('.core-primary .card-value-huge', 0, 12.4, '$', 'k', 1200);
            this.animateValue('.core-secondary .card-value-large', 0, 1.7, '', 'mo', 1200);
        }, 1600);

        // Risk cards count-up (starts when they appear at 2.2s)
        setTimeout(() => {
            const riskCards = document.querySelectorAll('.path-risk .card-value');
            if (riskCards[0]) this.animateValue(riskCards[0], 0, 27, '', '%', 800);
            if (riskCards[1]) this.animateValue(riskCards[1], 0, 8.2, '$', 'k', 800);
        }, 2200);

        // Opportunity cards count-up (starts when they appear at 2.2s)
        setTimeout(() => {
            const oppCards = document.querySelectorAll('.path-opportunity .card-value');
            if (oppCards[0]) this.animateValue(oppCards[0], 0, 500, '$', '', 800);
            if (oppCards[1]) this.animateValue(oppCards[1], 0, 32, '', '%', 800);
        }, 2200);
    }

    animateValue(selector, start, end, prefix = '', suffix = '', duration = 1000) {
        const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
        if (!element) return;

        const range = end - start;
        const increment = range / 60;
        const stepTime = duration / 60;
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }

            // Format number
            let displayValue;
            if (suffix === 'k') {
                displayValue = current.toFixed(1);
            } else if (suffix === '%' || suffix === 'mo') {
                displayValue = current.toFixed(1);
            } else {
                displayValue = Math.round(current);
            }

            element.textContent = `${prefix}${displayValue}${suffix}`;
        }, stepTime);
    }
}
