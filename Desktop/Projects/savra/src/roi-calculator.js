export class ROICalculator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.revenueSlider = this.container.querySelector('#revenue-slider');
        this.transactionsSlider = this.container.querySelector('#transactions-slider');

        this.revenueDisplay = this.container.querySelector('#revenue-display');
        this.transactionsDisplay = this.container.querySelector('#transactions-display');

        this.resultValue = this.container.querySelector('.roi-result-value');

        this.init();
    }

    init() {
        if (this.revenueSlider) {
            this.revenueSlider.addEventListener('input', (e) => this.handleInput());
        }
        if (this.transactionsSlider) {
            this.transactionsSlider.addEventListener('input', (e) => this.handleInput());
        }

        // Sample Data Button Listener
        const sampleBtn = document.getElementById('btn-sample-data-hero');
        if (sampleBtn) {
            sampleBtn.addEventListener('click', () => {
                if (this.revenueSlider && this.transactionsSlider) {
                    // Set "Tradie" sample values
                    this.revenueSlider.value = 150000;
                    this.transactionsSlider.value = 1200;

                    // Dispatch events to ensure UI sync
                    this.revenueSlider.dispatchEvent(new Event('input'));
                    this.transactionsSlider.dispatchEvent(new Event('input'));

                    this.handleInput();

                    // Visual feedback
                    this.container.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    this.container.classList.add('flash-highlight');
                    setTimeout(() => this.container.classList.remove('flash-highlight'), 500);
                }
            });
        }

        this.calculate();
    }

    handleInput() {
        const revenue = parseInt(this.revenueSlider.value);
        const transactions = parseInt(this.transactionsSlider.value);

        // Update displays
        if (this.revenueDisplay) this.revenueDisplay.textContent = `$${(revenue / 1000).toFixed(0)}k`;
        if (this.transactionsDisplay) this.transactionsDisplay.textContent = transactions;

        this.calculate();
    }

    calculate() {
        const revenue = parseInt(this.revenueSlider.value) || 0;
        const transactions = parseInt(this.transactionsSlider.value) || 0;

        // ROI Logic:
        // Assume 2% error rate in manual entry (money saved)
        // Assume 5 mins per transaction manual reconciliation (time saved -> money)

        const manualEntryErrorSavings = revenue * 0.02;
        const timeSavingsHours = (transactions * 5) / 60;
        const timeSavingsMoney = timeSavingsHours * 50; // $50/hr value

        const totalSavings = manualEntryErrorSavings + timeSavingsMoney;

        // Animate the number
        if (this.resultValue) {
            this.resultValue.textContent = `$${Math.round(totalSavings).toLocaleString()}`;
        }
    }
}
