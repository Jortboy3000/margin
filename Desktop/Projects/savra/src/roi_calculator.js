/**
 * ROI Calculator Logic
 * Interactive savings calculator
 */

class ROICalculator {
    constructor(containerId, config = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.onUpdate = config.onUpdate || null;

        this.revenueSlider = this.container.querySelector('#revenue-slider');
        this.transactionsSlider = this.container.querySelector('#transactions-slider');
        this.resultValue = this.container.querySelector('.roi-result-value');
        this.revenueDisplay = this.container.querySelector('#revenue-display');
        this.transactionsDisplay = this.container.querySelector('#transactions-display');

        this.init();
        this.initSteps();
    }

    init() {
        if (this.revenueSlider) {
            this.revenueSlider.addEventListener('input', () => this.calculate());
        }

        if (this.transactionsSlider) {
            this.transactionsSlider.addEventListener('input', () => this.calculate());
        }

        // Initial calculation
        this.calculate();
    }

    initSteps() {
        // Next Buttons
        this.container.querySelectorAll('.btn-roi-next').forEach(btn => {
            btn.addEventListener('click', () => {
                const nextStep = btn.dataset.next;
                this.goToStep(nextStep);
            });
        });

        // Back Buttons
        this.container.querySelectorAll('.btn-roi-back').forEach(btn => {
            btn.addEventListener('click', () => {
                const backStep = btn.dataset.back;
                this.goToStep(backStep);
            });
        });

        // Reset Button
        this.container.querySelectorAll('.btn-roi-reset').forEach(btn => {
            btn.addEventListener('click', () => {
                this.goToStep(1);
            });
        });
    }

    goToStep(stepId) {
        // Hide all steps
        this.container.querySelectorAll('.roi-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show target step
        const target = this.container.querySelector(`.roi-step[data-step="${stepId}"]`);
        if (target) {
            target.classList.add('active');
        }
    }

    calculate() {
        const revenue = parseFloat(this.revenueSlider?.value || 50000);
        const transactions = parseFloat(this.transactionsSlider?.value || 500);

        // Update displays
        if (this.revenueDisplay) {
            this.revenueDisplay.textContent = `$${(revenue / 1000).toFixed(0)}k`;
        }

        if (this.transactionsDisplay) {
            this.transactionsDisplay.textContent = transactions;
        }

        // ROI Calculation
        // Average savings: 10% of time spent on bookkeeping
        // + 2% cash flow optimization
        // + $500 base from automated categorization

        const timeSavings = (revenue * 0.01) / 12; // 1% of monthly revenue in time saved
        const cashFlowOptimization = (revenue * 0.02) / 12; // 2% optimization monthly
        const automationSavings = 500; // Fixed monthly savings

        const totalMonthlySavings = timeSavings + cashFlowOptimization + automationSavings;
        const annualSavings = totalMonthlySavings * 12;

        // Animate to new value
        this.animateValue(annualSavings);

        // Notify Listeners (Dashboard Connection)
        if (this.onUpdate) {
            this.onUpdate({
                revenue: revenue,
                transactions: transactions,
                savings: annualSavings
            });
        }
    }

    animateValue(target) {
        if (!this.resultValue) return;

        const current = parseFloat(this.resultValue.dataset.current || 0);
        const duration = 800;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = current + (target - current) * eased;

            this.resultValue.textContent = `$${Math.round(value).toLocaleString()}`;
            this.resultValue.dataset.current = value;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }
}

export { ROICalculator };
