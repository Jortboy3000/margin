/**
 * Living Business Brain - Zoned 3D Intelligence Visualization
 * Replaces the generic OrbitSystem with meaningful business metrics
 */

export class BusinessBrain {
    constructor(container, parallaxLayer, svg) {
        this.container = container;
        this.parallaxLayer = parallaxLayer;
        this.svg = svg;
        this.centerX = 0;
        this.centerY = 0;
        this.nodes3D = [];
        this.nodeMap = new Map();
        this.synapses = [];
        this.synapseRules = [];
        this.prefersReducedMotion = false;
    }

    init() {
        if (!this.container || !this.svg) return;

        // Container is already centered via CSS (left: 50%, transform: translateX(-50%))
        // So we position nodes relative to container center at (0, 0)
        this.centerX = 0;
        this.centerY = 0; // Relative to orbit-system center

        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.setupNodes();
        this.startAnimationLoop();
    }

    setupNodes() {
        // Living Business Brain - Zoned Architecture
        const BUSINESS_BRAIN = {
            core: [
                { id: 'net-cash', label: 'Net Cash: $12.4k', zone: 'core', pos: [0, 0, 0], size: 48 }, // Was 24
                { id: 'runway', label: 'Runway: 1.7mo', zone: 'core', pos: [80, 0, 0], size: 40 } // Was 20
            ],
            input: [
                { id: 'bank-feed', label: 'Bank Feeds', zone: 'input', angle: 0, size: 28 },
                { id: 'csv-upload', label: 'CSV Upload', zone: 'input', angle: 120, size: 28 },
                { id: 'invoices', label: 'Invoices', zone: 'input', angle: 240, size: 28 }
            ],
            risk: [
                { id: 'personal-bleed', label: 'Personal: 27%', zone: 'risk', cluster: 0, size: 32 },
                { id: 'burn-rate', label: 'Burn Rate Alert', zone: 'risk', cluster: 0, size: 32 },
                { id: 'low-runway', label: 'Low Runway', zone: 'risk', cluster: 1, size: 32 }
            ],
            opportunity: [
                { id: 'tax-save', label: 'Tax Save: $500', zone: 'opportunity', cluster: 0, size: 32 },
                { id: 'margin-gain', label: 'Margin Gains', zone: 'opportunity', cluster: 1, size: 32 },
                { id: 'profit-trend', label: 'Profit Up 5%', zone: 'opportunity', cluster: 0, size: 32 }
            ],
            operational: [
                { id: 'materials', label: 'Materials: 22%', zone: 'operational', angle: 0, size: 30 },
                { id: 'wages', label: 'Wages: 20%', zone: 'operational', angle: 90, size: 30 },
                { id: 'income', label: 'Income Trends', zone: 'operational', angle: 180, size: 30 },
                { id: 'profit', label: 'Profit: 32%', zone: 'operational', angle: 270, size: 30 }
            ]
        };

        // Contextual Relationships (Cause & Effect)
        this.synapseRules = [
            { from: 'materials', to: 'profit', impact: 0.8, type: 'causal' },
            { from: 'wages', to: 'profit', impact: 0.7, type: 'causal' },
            { from: 'personal-bleed', to: 'runway', impact: 0.9, type: 'warning' },
            { from: 'bank-feed', to: 'net-cash', impact: 1.0, type: 'data-flow' },
            { from: 'csv-upload', to: 'net-cash', impact: 0.8, type: 'data-flow' },
            { from: 'invoices', to: 'net-cash', impact: 0.7, type: 'data-flow' },
            { from: 'tax-save', to: 'net-cash', impact: 0.6, type: 'opportunity' },
            { from: 'profit', to: 'net-cash', impact: 0.9, type: 'causal' }
        ];

        // Create nodes for each zone
        Object.entries(BUSINESS_BRAIN).forEach(([zoneName, nodes]) => {
            nodes.forEach((nodeData, idx) => {
                let x, y, z;

                // Zone-based positioning
                if (nodeData.zone === 'core') {
                    [x, y, z] = nodeData.pos;
                } else if (nodeData.zone === 'input') {
                    const theta = (nodeData.angle || idx * 120) * Math.PI / 180;
                    x = 400 * Math.cos(theta);
                    y = 400 * Math.sin(theta);
                    z = 0;
                } else if (nodeData.zone === 'risk') {
                    const baseAngle = -120 + (nodeData.cluster || 0) * 60;
                    const theta = (baseAngle + idx * 40) * Math.PI / 180;
                    const phi = (100 + idx * 10) * Math.PI / 180;
                    x = 250 * Math.sin(phi) * Math.cos(theta);
                    y = 250 * Math.sin(phi) * Math.sin(theta);
                    z = 250 * Math.cos(phi);
                } else if (nodeData.zone === 'opportunity') {
                    const baseAngle = 60 + (nodeData.cluster || 0) * 60;
                    const theta = (baseAngle + idx * 40) * Math.PI / 180;
                    const phi = (20 + idx * 10) * Math.PI / 180;
                    x = 250 * Math.sin(phi) * Math.cos(theta);
                    y = 250 * Math.sin(phi) * Math.sin(theta);
                    z = 250 * Math.cos(phi);
                } else { // operational
                    const theta = (nodeData.angle || idx * 90) * Math.PI / 180;
                    x = 300 * Math.cos(theta);
                    y = 300 * Math.sin(theta);
                    z = 0;
                }

                const nodeEl = document.createElement('div');
                nodeEl.className = `neural-node zone-${nodeData.zone}`;
                nodeEl.dataset.nodeId = nodeData.id;

                const labelEl = document.createElement('span');
                labelEl.className = 'node-label';
                labelEl.textContent = nodeData.label;
                nodeEl.appendChild(labelEl);

                this.parallaxLayer.appendChild(nodeEl);

                const nodeObj = {
                    el: nodeEl,
                    id: nodeData.id,
                    label: nodeData.label,
                    zone: nodeData.zone,
                    size: nodeData.size || 12,
                    x, y, z,
                    baseX: x, baseY: y, baseZ: z,
                    screenX: 0,
                    screenY: 0,
                    scale: 1
                };

                this.nodes3D.push(nodeObj);
                this.nodeMap.set(nodeData.id, nodeObj);
                this.attachNodeEvents(nodeObj);
            });
        });

        // Create synapse pool
        this.synapses = [];
        const maxLines = this.synapseRules.length;
        for (let i = 0; i < maxLines; i++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.classList.add('neural-synapse');
            line.style.opacity = 0;
            this.svg.appendChild(line);
            this.synapses.push({ el: line, rule: this.synapseRules[i] || null });
        }
    }

    attachNodeEvents(node) {
        node.el.addEventListener('mouseenter', () => {
            const intensity = node.zone === 'core' ? 1.5 : 1.2;
            node.el.style.transform += ` scale(${intensity})`;
            node.el.style.zIndex = 1000;
        });

        node.el.addEventListener('mouseleave', () => {
            node.el.style.zIndex = '';
        });

        node.el.addEventListener('click', () => {
            this.spawnHolographicCard(node);
        });
    }

    startAnimationLoop() {
        let rotationY = 0;
        let rotationX = 0;
        const focalLength = 600;

        const animate = () => {
            // Rotate Cloud
            if (!this.prefersReducedMotion) {
                const mx = (window.mouseX || window.innerWidth / 2) - window.innerWidth / 2;
                const my = (window.mouseY || window.innerHeight / 2) - window.innerHeight / 2;

                rotationY += 0.001 + (mx * 0.00001);
                rotationX += (my * 0.00001);
            }

            // Project and render nodes
            this.nodes3D.forEach(node => {
                let x = node.baseX;
                let z = node.baseZ;
                let y = node.baseY;

                // Rotation matrices
                let cosY = Math.cos(rotationY);
                let sinY = Math.sin(rotationY);
                let x1 = x * cosY - z * sinY;
                let z1 = z * cosY + x * sinY;

                let cosX = Math.cos(rotationX);
                let sinX = Math.sin(rotationX);
                let y2 = y * cosX - z1 * sinX;
                let z2 = z1 * cosX + y * sinX;

                node.projX = x1;
                node.projY = y2;
                node.projZ = z2;

                // Perspective
                const scale = focalLength / (focalLength + z2);
                node.scale = scale;

                const screenX = this.centerX + x1 * scale;
                const screenY = this.centerY + y2 * scale;

                node.screenX = screenX;
                node.screenY = screenY;

                // Apply size based on zone
                const baseSize = node.size * scale;
                node.el.style.width = `${baseSize}px`;
                node.el.style.height = `${baseSize}px`;
                node.el.style.transform = `translate(${screenX}px, ${screenY}px)`;
                node.el.style.opacity = Math.max(0.7, scale); // Much more visible (was 0.3)
                node.el.style.zIndex = Math.floor(scale * 100);
            });

            // Draw Contextual Synapses
            this.synapses.forEach((synapse, idx) => {
                if (!synapse.rule) {
                    synapse.el.style.opacity = 0;
                    return;
                }

                const fromNode = this.nodeMap.get(synapse.rule.from);
                const toNode = this.nodeMap.get(synapse.rule.to);

                if (!fromNode || !toNode) {
                    synapse.el.style.opacity = 0;
                    return;
                }

                // Only draw if both visible
                if (fromNode.projZ < -100 || toNode.projZ < -100) {
                    synapse.el.style.opacity = 0;
                    return;
                }

                synapse.el.setAttribute('x1', fromNode.screenX);
                synapse.el.setAttribute('y1', fromNode.screenY);
                synapse.el.setAttribute('x2', toNode.screenX);
                synapse.el.setAttribute('y2', toNode.screenY);

                // Style by type
                const impact = synapse.rule.impact;
                const type = synapse.rule.type;

                synapse.el.style.strokeWidth = `${impact * 2}px`;
                synapse.el.classList.remove('type-causal', 'type-warning', 'type-data-flow', 'type-opportunity');
                synapse.el.classList.add(`type-${type}`);

                const opacity = impact * Math.min(fromNode.scale, toNode.scale) * 0.6;
                synapse.el.style.opacity = opacity;
            });

            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    spawnHolographicCard(node) {
        // Remove existing cards
        document.querySelectorAll('.holo-card').forEach(c => c.remove());

        const card = document.createElement('div');
        card.className = 'holo-card';
        card.innerHTML = `
            <div class="holo-header">
                <strong>${node.label}</strong>
            </div>
            <div class="holo-content">
                <div class="holo-sparkline">▁▃▅▇▅▃▁</div>
                <div class="holo-insight">
                    💡 <em>Savra Insight:</em><br/>
                    ${this.getInsight(node)}
                </div>
            </div>
        `;

        this.container.appendChild(card);

        // Position above node
        card.style.position = 'absolute';
        card.style.left = `${node.screenX}px`;
        card.style.top = `${node.screenY - 100}px`;
        card.style.transform = 'translate(-50%, 0) scale(0)';

        // Animate in
        requestAnimationFrame(() => {
            card.style.transform = 'translate(-50%, 0) scale(1)';
        });

        // Auto-dismiss
        setTimeout(() => {
            card.style.opacity = '0';
            setTimeout(() => card.remove(), 300);
        }, 5000);
    }

    getInsight(node) {
        const insights = {
            'materials': 'Try 10% trim for $420/mo save',
            'personal-bleed': 'Separate for $500/mo tax deduction',
            'profit': 'Up 5% from last month - great work!',
            'tax-save': 'Potential savings available',
            'runway': 'Healthy - up 10% from last upload'
        };
        return insights[node.id] || 'Check Insights page for details';
    }
}
