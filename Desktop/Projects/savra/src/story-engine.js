
export class StoryEngine {
    constructor() {
        // Base state (The "Truth")
        this.baseData = {
            quote: {
                volume: 50000,
                count: 10,
                avgValue: 5000
            },
            job: {
                hoursPerJob: 40,
                materialCostPerJob: 1500,
                baseHourlyRate: 85
            },
            payment: {
                totalInvoiced: 50000,
                collected: 45000,
                avgDaysToPay: 14
            },
            month: {
                fixedCosts: 12000,
                personalSpend: 4000
            }
        };

        // Sim state (The "What If")
        this.levers = {
            // Quote Levers
            upsell: 0, // %
            taxRate: 10, // %
            priceIncrease: 0, // %

            // Job Levers
            materialVariation: 0, // %
            hoursVariation: 0, // +hours
            overheadPerJob: 50, // $

            // Payment Levers
            paymentDelay: 0, // +days
            includeCash: false, // toggle

            // Month Levers
            personalSpendCut: 0, // % reduction
        };

        this.results = {};
        this.calculate();
    }

    setLever(leverId, value) {
        if (this.levers.hasOwnProperty(leverId)) {
            this.levers[leverId] = parseFloat(value);
            this.calculate();
            return this.results;
        }
        console.warn(`Lever ${leverId} not found`);
        return null;
    }

    calculate() {
        // 1. QUOTE CHAPTER
        // "What you charged"
        const priceIncreasePercent = this.levers.priceIncrease; // 0-20%
        const priceMultiplier = 1 + (priceIncreasePercent / 100);
        const upsellMultiplier = 1 + (this.levers.upsell / 100);

        // ELASTICITY LOGIC: Raising prices too high drops volume (churn/lost bids)
        // Rule: For every 1% price increase above 5%, lose 0.5% volume.
        // Capped loss at 10% volume for MVP simplicity.
        let volumeDrag = 1.0;
        if (priceIncreasePercent > 5) {
            const excessIncrease = priceIncreasePercent - 5;
            const dragPercent = Math.min(10, excessIncrease * 0.5); // Max 10% volume loss
            volumeDrag = 1 - (dragPercent / 100);
        }

        const effectiveJobCount = this.baseData.quote.count * volumeDrag;
        const baseRevenue = this.baseData.quote.volume * volumeDrag * priceMultiplier * upsellMultiplier;
        const taxAmount = baseRevenue * (this.levers.taxRate / 100);
        const totalCharged = baseRevenue + taxAmount;

        // Calculate the "Lost Opportunity" from price increase churn
        const lostRevenue = (this.baseData.quote.volume * priceMultiplier * upsellMultiplier) - baseRevenue;

        const quoteResults = {
            baseRevenue,
            taxAmount,
            totalCharged,
            effectiveJobCount,
            lostRevenue,
            volumeDrag,
            avgItemValue: (baseRevenue / effectiveJobCount) || 0
        };

        // 2. JOB CHAPTER
        // "What it cost you" - The Grind
        // Base costs scaled by effective job count
        const baseMatCost = this.baseData.job.materialCostPerJob * effectiveJobCount;
        const baseHours = this.baseData.job.hoursPerJob * effectiveJobCount;

        // Apply Levers
        const matVarPercent = this.levers.materialVariation || 0;
        const materialCosts = baseMatCost * (1 + (matVarPercent / 100));

        // Hours Variation: +/- hours per job
        const hoursVar = this.levers.hoursVariation || 0;
        const totalHours = (this.baseData.job.hoursPerJob + hoursVar) * effectiveJobCount;
        const laborCost = totalHours * 35; // Internal cost rate $35/hr

        // Overhead
        const overheadTotal = (this.levers.overheadPerJob || 0) * effectiveJobCount;

        const cogs = materialCosts + laborCost;
        const totalCost = cogs + overheadTotal;

        const grossProfit = totalCharged - totalCost;
        const grossMargin = totalCharged > 0 ? (grossProfit / totalCharged) * 100 : 0;
        const profitPerHour = totalHours > 0 ? grossProfit / totalHours : 0;

        const jobResults = {
            materialCosts,
            laborCost,
            totalHours,
            grossProfit,
            grossMargin,
            profitPerHour,
            overheadTotal,
            // Deltas for "Because" strip
            deltaMaterials: materialCosts - baseMatCost,
            deltaHours: totalHours - baseHours
        };

        // 3. PAYMENT CHAPTER
        // "The Realisation"
        const includeCash = this.levers.includeCash || false;
        // Cash factor: "Off-books" jobs might add liquidity but riskiness. 
        // For simulation, let's say cash jobs add 5% strictly to collection rate (liquidity) but don't change invoiced.
        // Actually, let's keep it simple: Cash jobs = faster collection.

        // Payment Delay Impact
        const delayDays = this.levers.paymentDelay || 0;
        // Logic: 0 days = 100% collected. >30 days = decay.
        let collectionRate = 1.0;
        if (delayDays > 30) {
            collectionRate -= ((delayDays - 30) * 0.005);
        }
        if (includeCash) collectionRate += 0.05; // Cash boosts liquidity
        collectionRate = Math.min(1.0, collectionRate); // Cap at 100%

        const possibleRevenue = totalCharged;
        const collected = possibleRevenue * collectionRate;
        const realisationRate = (collected / possibleRevenue) * 100;

        const matchConfidence = "High";

        const paymentResults = {
            collected,
            possibleRevenue,
            avgDelay: this.baseData.payment.avgDaysToPay + delayDays,
            realisationRate,
            matchConfidence
        };

        // 4. MONTH CHAPTER
        const fixedCosts = this.levers.fixedCosts || 15000;
        const personalDraw = this.levers.personalDraw || 5000;
        const totalNut = fixedCosts + personalDraw;

        const grossMarginDecimal = grossMargin / 100;
        const breakEvenRevenue = grossMarginDecimal > 0 ? totalNut / grossMarginDecimal : 999999;
        const coverageRatio = ((grossProfit) / totalNut) * 100;

        const totalOutflows = totalCost + fixedCosts + personalDraw;
        const netCashFlow = collected - totalOutflows;
        const burnRate = totalOutflows - collected;
        const runway = burnRate > 0 ? (collected * 3) / burnRate : 99;

        const monthResults = {
            netCashFlow,
            personalSpend: personalDraw,
            burnRate,
            runway,
            totalNut,
            coverageRatio,
            breakEvenRevenue
        };

        // 5. HEALTH CHAPTER
        let score = 70;

        // Penalties (The Killers)
        if (runway < 1) score -= 40;
        else if (runway < 3) score -= 20;

        if (coverageRatio < 80) score -= 20;
        if (realisationRate < 80) score -= 10;
        if (jobResults.profitPerHour < 40) score -= 10;

        // Bonuses (The Scalers)
        if (grossMargin > 50) score += 10;
        if (profitPerHour > 80) score += 10;
        if (runway > 6) score += 10;
        if (quoteResults.volumeDrag < 1) score -= 5; // Penalty for pricing out customers

        score = Math.min(100, Math.max(0, score));

        // Generate Prescription
        let prescription = "Maintain current trajectory.";
        let action = "Scale Marketing";

        if (score < 50) {
            if (runway < 2) {
                prescription = "CRITICAL: You are insolvent in <60 days.";
                action = "Freeze All Spending";
            } else if (grossMargin < 35) {
                prescription = "You are working for free. Margins are dangerous.";
                action = "Raise Prices or Cut Scope";
            } else {
                prescription = "Inefficient delivery is eating your profit.";
                action = "Audit Labour Hours";
            }
        } else if (score < 80) {
            if (quoteResults.volumeDrag < 0.95) {
                prescription = "High prices are hurting volume. You lost jobs this month.";
                action = "Review Pricing Strategy";
            } else if (paymentResults.avgDelay > 15) {
                prescription = "Profitable on paper, broke in the bank.";
                action = "Chase Overdue Invoices";
            } else {
                prescription = "Stable foundation. Time to optimize.";
                action = "Invest in Automations";
            }
        } else {
            prescription = "Financial Fortress. You are ready to scale.";
            action = "Hire Senior Talent";
        }

        this.results = {
            quote: quoteResults,
            job: jobResults,
            payment: paymentResults,
            month: monthResults,
            health: {
                score,
                prescription,
                action,
                vitals: {
                    margin: Math.round(grossMargin),
                    runway: runway.toFixed(1),
                    efficiency: Math.round(profitPerHour)
                }
            }
        };
    }

    getNarrative(node) {
        const r = this.results;

        switch (node) {
            case 'quote':
                const jobMsg = r.quote.volumeDrag < 1
                    ? `Price hikes cost you <strong>${Math.round((1 - r.quote.volumeDrag) * 100)}%</strong> of bid volume.`
                    : `You won ${Math.round(r.quote.effectiveJobCount)} jobs at standard conversion rates.`;

                return [
                    `You quoted <strong>$${this.formatK(r.quote.baseRevenue)}</strong> total revenue.`,
                    jobMsg,
                    `Average job value is now <strong>$${this.formatK(r.quote.avgItemValue)}</strong>.`
                ];
            case 'job':
                return [
                    `Materials ran at <strong>$${this.formatK(r.job.materialCosts)}</strong> (${Math.round(r.job.grossMargin < 0 ? 'Cost > Rev' : (r.job.materialCosts / r.quote.baseRevenue * 100) + '%')}).`,
                    `Labour hit <strong>${Math.round(r.job.totalHours)} hours</strong>. True cost: <strong>$${Math.round(r.job.laborCost)}</strong>.`,
                    `Gross Margin: <strong>${Math.round(r.job.grossMargin)}%</strong>. (Target: 45%).`
                ];
            case 'payment':
                const outstanding = r.payment.possibleRevenue - r.payment.collected;
                return [
                    r.payment.avgDelay > 20 ?
                        `Cash flow warning: Average payment delay is <strong>${Math.round(r.payment.avgDelay)} days</strong>.` :
                        `Payments are healthy: <strong>${Math.round(r.payment.avgDelay)} day</strong> average.`,
                    outstanding > 1000 ?
                        `You have <strong>$${this.formatK(outstanding)}</strong> trapped in unpaid invoices.` :
                        `Great collection work. Realisation rate: <strong>${Math.round(r.payment.realisationRate)}%</strong>.`,
                    this.levers.includeCash ? "Cash jobs improved liquidity." : "Standard invoiced income."
                ];
            case 'month':
                const nutStatus = r.month.coverageRatio >= 100 ? 'covered' : 'short';
                return [
                    `Monthly Nut (Fixed + Draw): <strong>$${this.formatK(r.month.totalNut)}</strong>.`,
                    nutStatus === 'covered'
                        ? `Profit: <strong>$${this.formatK(r.month.netCashFlow)}</strong>. You are scaling.`
                        : `Deficit: <strong>$${this.formatK(Math.abs(r.month.netCashFlow))}</strong>. You are bleeding.`,
                    `Break-even target: <strong>$${this.formatK(r.month.breakEvenRevenue)}</strong>.`
                ];
            case 'health':
                return [
                    `Overall Health Score: <strong>${Math.round(r.health.score)}/100</strong>.`,
                    r.health.prescription,
                    `Move: <strong>${r.health.action}</strong>`
                ];
            default:
                return ["Select a node to see the story."];
        }
    }

    formatK(num) {
        return num > 999 ? (num / 1000).toFixed(1) + 'k' : Math.round(num);
    }
}
