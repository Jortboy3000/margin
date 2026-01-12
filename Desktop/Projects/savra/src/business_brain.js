// Living Business Brain - setupNodes implementation
// Replace the existing setupNodes method in OrbitSystem class with this

class BusinessBrainSnippet {
    setupNodes() {
        // Living Business Brain - Zoned Architecture
        const BUSINESS_BRAIN = {
            core: [
                { id: 'net-cash', label: 'Net Cash: $12.4k', zone: 'core', pos: [0, 0, 0], size: 24 },
                { id: 'runway', label: 'Runway: 1.7mo', zone: 'core', pos: [40, 0, 0], size: 20 }
            ],
            input: [
                { id: 'bank-feed', label: 'Bank Feeds', zone: 'input', angle: 0 },
                { id: 'csv-upload', label: 'CSV Upload', zone: 'input', angle: 120 },
                { id: 'invoices', label: 'Invoices', zone: 'input', angle: 240 }
            ],
            risk: [
                { id: 'personal-bleed', label: 'Personal: 27%', zone: 'risk', cluster: 0 },
                { id: 'burn-rate', label: 'Burn Rate Alert', zone: 'risk', cluster: 0 },
                { id: 'low-runway', label: 'Low Runway', zone: 'risk', cluster: 1 }
            ],
            opportunity: [
                { id: 'tax-save', label: 'Tax Save: $500', zone: 'opportunity', cluster: 0 },
                { id: 'margin-gain', label: 'Margin Gains', zone: 'opportunity', cluster: 1 },
                { id: 'profit-trend', label: 'Profit Up 5%', zone: 'opportunity', cluster: 0 }
            ],
            operational: [
                { id: 'materials', label: 'Materials: 22%', zone: 'operational', angle: 0 },
                { id: 'wages', label: 'Wages: 20%', zone: 'operational', angle: 90 },
                { id: 'income', label: 'Income Trends', zone: 'operational', angle: 180 },
                { id: 'profit', label: 'Profit: 32%', zone: 'operational', angle: 270 }
            ]
        };

        // Relationship Map (for contextual synapses)
        this.synapseRules = [
            { from: 'materials', to: 'profit', impact: 0.8, type: 'causal' },
            { from: 'wages', to: 'profit', impact: 0.7, type: 'causal' },
            { from: 'personal-bleed', to: 'runway', impact: 0.9, type: 'warning' },
            { from: 'bank-feed', to: 'net-cash', impact: 1.0, type: 'data-flow' },
            { from: 'tax-save', to: 'net-cash', impact: 0.6, type: 'opportunity' }
        ];

        this.nodes3D = [];
        this.nodeMap = new Map();

        // Create nodes for each zone
        Object.entries(BUSINESS_BRAIN).forEach(([zoneName, nodes]) => {
            nodes.forEach((nodeData, idx) => {
                let x, y, z;

                // Position by zone
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
                    zone: nodeData.zone,
                    size: nodeData.size || 12,
                    x, y, z,
                    baseX: x, baseY: y, baseZ: z,
                    drift: { x: 0, y: 0, z: 0 }
                };

                this.nodes3D.push(nodeObj);
                this.nodeMap.set(nodeData.id, nodeObj);
                this.attachNodeEvents(nodeObj);
            });
        });

        // Synapse Pool
        this.synapses = [];
        const maxLines = this.synapseRules.length * 2;
        for (let i = 0; i < maxLines; i++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.classList.add('neural-synapse');
            line.style.opacity = 0;
            this.svg.appendChild(line);
            this.synapses.push({ el: line, active: false });
        }
    }
}
