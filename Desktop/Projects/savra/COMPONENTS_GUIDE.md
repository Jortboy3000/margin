# Savra Main Page - New Components Guide

This guide shows the HTML structure for the 5 new page sections. Add these components to `index.html` in the specified order.

## 1. Enhanced Header (Replace existing header)

Find the existing `<header class="site-header">` and replace with:

```html
<header class="site-header">
  <nav class="container">
    <div class="logo">
      <img src="/assets/s.png" alt="Savra" />
    </div>
    
    <div class="nav-links">
      <div class="nav-item-dropdown">
        <a>Product <span class="dropdown-arrow">▼</span></a>
        <div class="dropdown-menu">
          <a href="#" class="dropdown-item">
            <div class="dropdown-item-icon">💰</div>
            <div class="dropdown-item-content">
              <div class="dropdown-item-title">Cash Flow Prediction</div>
              <div class="dropdown-item-description">See 6 months ahead with AI</div>
            </div>
          </a>
          <a href="#" class="dropdown-item">
            <div class="dropdown-item-icon">⚠️</div>
            <div class="dropdown-item-content">
              <div class="dropdown-item-title">Risk Detection</div>
              <div class="dropdown-item-description">Spot issues before they cost you</div>
            </div>
          </a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item">
            <div class="dropdown-item-icon">👁</div>
            <div class="dropdown-item-content">
              <div class="dropdown-item-title">See All Features</div>
            </div>
          </a>
        </div>
      </div>
      
      <div class="nav-item-dropdown">
        <a>Resources <span class="dropdown-arrow">▼</span></a>
        <div class="dropdown-menu">
          <a href="#" class="dropdown-item">
            <div class="dropdown-item-icon">📖</div>
            <div class="dropdown-item-content">
              <div class="dropdown-item-title">Guides</div>
              <div class="dropdown-item-description">Learn best practices</div>
            </div>
          </a>
          <a href="#" class="dropdown-item">
            <div class="dropdown-item-icon">📊</div>
            <div class="dropdown-item-content">
              <div class="dropdown-item-title">Case Studies</div>
              <div class="dropdown-item-description">See real results</div>
            </div>
          </a>
        </div>
      </div>
      
      <a href="#pricing">Pricing</a>
      
      <div class="system-status">
        <div class="status-dot-live"></div>
        <span>All Systems Operational</span>
      </div>
    </div>
    
    <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
      <i data-lucide="sun" class="theme-icon sun-icon"></i>
      <i data-lucide="moon" class="theme-icon moon-icon"></i>
    </button>
    
    <div class="nav-actions">
      <a href="#" class="btn-ghost">Sign in</a>
      <a href="#" class="btn-demo">
        <span class="btn-demo-text">Book Demo</span>
      </a>
    </div>
  </nav>
</header>
```

---

## 2. Enhanced Hero Section (Add after header, before Business Health Monitor)

```html
<section class="hub-section">
  <!-- Atmospheric Lighting (keep existing) -->
  <div class="atmosphere-layer">
    <div class="atmo-blob atmo-1"></div>
    <div class="atmo-blob atmo-2"></div>
    <div class="atmo-blob atmo-3"></div>
  </div>

  <div class="hero-enhanced">
    <div class="hero-content">
      <h1 class="text-gradient">Proactive Intelligence for your Business</h1>
      <p class="hero-sub-reason">Savra gives you the insight of a CFO, strategist and analyst, without the payroll.</p>
      
      <div class="hero-actions">
        <a href="#" class="btn-primary">Start Free Trial</a>
        <a href="#" class="btn-outline">Watch Demo</a>
      </div>
      
      <div class="trust-indicators">
        <div class="trust-stat">
          <div class="trust-stat-value" data-count="500">0</div>
          <div class="trust-stat-label">Active Businesses</div>
        </div>
        <div class="trust-stat">
          <div class="trust-stat-value" data-count="2.4">0</div>
          <div class="trust-stat-label">Million Saved</div>
        </div>
        <div class="trust-stat">
          <div class="trust-stat-value" data-count="40">0</div>
          <div class="trust-stat-label">% Time Saved</div>
        </div>
      </div>
    </div>
    
    <div class="hero-preview">
      <div class="dashboard-preview glass-morphism-v2 float-gentle">
        <div class="preview-header">
          <div class="preview-title">Your Dashboard</div>
          <div class="preview-live-badge">
            <div class="preview-live-dot"></div>
            <span>Live</span>
          </div>
        </div>
        
        <div class="preview-metrics">
          <div class="preview-metric">
            <div class="preview-metric-label">Cash Flow</div>
            <div class="preview-metric-value value-counter" data-value="12.4" data-prefix="$" data-suffix="k">$0k</div>
            <div class="preview-metric-trend positive">↑ 10%</div>
          </div>
          <div class="preview-metric">
            <div class="preview-metric-label">Runway</div>
            <div class="preview-metric-value value-counter" data-value="5.2" data-suffix=" mo">0 mo</div>
            <div class="preview-metric-trend positive">↑ Healthy</div>
          </div>
          <div class="preview-metric">
            <div class="preview-metric-label">Burn Rate</div>
            <div class="preview-metric-value value-counter" data-value="8.2" data-prefix="$" data-suffix="k">$0k</div>
            <div class="preview-metric-trend negative">Monitor</div>
          </div>
          <div class="preview-metric">
            <div class="preview-metric-label">Profit</div>
            <div class="preview-metric-value value-counter" data-value="32" data-suffix="%">0%</div>
            <div class="preview-metric-trend positive">↑ 5%</div>
          </div>
        </div>
      </div>
      
      <div class="roi-calculator" id="roi-calculator-widget">
        <h3 class="roi-title">Calculate Your Savings</h3>
        
        <div class="roi-input-group">
          <div class="roi-label">
            <span>Monthly Revenue</span>
            <span class="roi-value" id="revenue-display">$50k</span>
          </div>
          <input type="range" class="roi-slider" id="revenue-slider" min="10000" max="500000" value="50000" step="5000">
        </div>
        
        <div class="roi-input-group">
          <div class="roi-label">
            <span>Monthly Transactions</span>
            <span class="roi-value" id="transactions-display">500</span>
          </div>
          <input type="range" class="roi-slider" id="transactions-slider" min="50" max="5000" value="500" step="50">
        </div>
        
        <div class="roi-result">
          <div class="roi-result-label">You could save annually</div>
          <div class="roi-result-value" data-current="0">$0</div>
          <div class="roi-result-subtext">Based on industry averages</div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Keep existing Business Health Monitor here -->
</section>
```

---

## 3. Interactive Feature Cards (Add after Business Health Monitor)

```html
<section class="features-section">
  <div class="features-header">
    <h2 class="features-title">Everything You Need to Thrive</h2>
    <p class="features-subtitle">Powerful features that work together seamlessly</p>
  </div>
  
  <div class="features-grid">
    <div class="feature-card reveal-on-scroll" data-feature="cashflow">
      <div class="feature-icon-wrapper">
        <div class="feature-icon">💰</div>
      </div>
      <div class="feature-content">
        <h3 class="feature-title">Cash Flow Prediction</h3>
        <p class="feature-description">See 6 months ahead with AI-powered forecasting. Know exactly when money's coming in and going out.</p>
        <div class="feature-highlight">
          95% accuracy <span class="feature-arrow">→</span>
        </div>
      </div>
    </div>
    
    <div class="feature-card reveal-on-scroll" data-feature="risk">
      <div class="feature-icon-wrapper">
        <div class="feature-icon">⚠️</div>
      </div>
      <div class="feature-content">
        <h3 class="feature-title">Risk Detection</h3>
        <p class="feature-description">AI spots tax risks, burn rate spikes, and hidden expenses before they become problems.</p>
        <div class="feature-highlight">
          Real-time alerts <span class="feature-arrow">→</span>
        </div>
      </div>
    </div>
    
    <div class="feature-card reveal-on-scroll" data-feature="auto">
      <div class="feature-icon-wrapper">
        <div class="feature-icon">🤖</div>
      </div>
      <div class="feature-content">
        <h3 class="feature-title">Auto-Categorization</h3>
        <p class="feature-description">No more manual tagging. Savra learns your business and categorizes every transaction instantly.</p>
        <div class="feature-highlight">
          Zero manual work <span class="feature-arrow">→</span>
        </div>
      </div>
    </div>
    
    <div class="feature-card reveal-on-scroll" data-feature="multi">
      <div class="feature-icon-wrapper">
        <div class="feature-icon">📊</div>
      </div>
      <div class="feature-content">
        <h3 class="feature-title">Multi-Business Dashboard</h3>
        <p class="feature-description">Run multiple ventures? See all your businesses in one unified, intelligent dashboard.</p>
        <div class="feature-highlight">
          Unlimited businesses <span class="feature-arrow">→</span>
        </div>
      </div>
    </div>
    
    <div class="feature-card reveal-on-scroll" data-feature="security">
      <div class="feature-icon-wrapper">
        <div class="feature-icon">🔐</div>
      </div>
      <div class="feature-content">
        <h3 class="feature-title">Bank-Level Security</h3>
        <p class="feature-description">End-to-end encryption, isolated data, and SOC 2 compliance. Your data never trains our models.</p>
        <div class="feature-highlight">
          Enterprise-grade <span class="feature-arrow">→</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 4. Integration Showcase (Add after Features)

```html
<section class="integration-section">
  <div class="integration-header">
    <h2 class="integration-title">Connects to Everything You Use</h2>
    <p class="integration-subtitle">Seamless integrations with your favorite tools</p>
  </div>
  
  <div class="integration-map">
    <div class="integration-center">
      <div class="integration-center-inner">Savra</div>
    </div>
    
    <div class="integration-node">
      <div class="integration-node-icon">💳</div>
      <div class="integration-node-label">Stripe</div>
    </div>
    
    <div class="integration-node">
      <div class="integration-node-icon">📊</div>
      <div class="integration-node-label">Xero</div>
    </div>
    
    <div class="integration-node">
      <div class="integration-node-icon">📗</div>
      <div class="integration-node-label">QuickBooks</div>
    </div>
    
    <div class="integration-node">
      <div class="integration-node-icon">🛍️</div>
      <div class="integration-node-label">Shopify</div>
    </div>
    
    <div class="integration-node">
      <div class="integration-node-icon">💵</div>
      <div class="integration-node-label">PayPal</div>
    </div>
  </div>
  
  <div class="integration-badge">
    <div class="integration-count">
      <span class="integration-count-number">50+</span>
      <span>integrations and counting</span>
    </div>
  </div>
</section>
```

---

## 5. Before vs After Comparison (Add after Integration Showcase)

```html
<section class="comparison-section">
  <div class="comparison-header">
    <h2 class="comparison-title">The Difference is Night & Day</h2>
    <p class="comparison-subtitle">See what changes when intelligence enters the room</p>
  </div>
  
  <div class="comparison-container">
    <div class="comparison-before">
      <div class="comparison-label">❌ Before</div>
      <h3 class="comparison-side-title">Spreadsheet Chaos</h3>
      
      <ul class="comparison-list">
        <li class="comparison-item">
          <span class="comparison-item-icon">📊</span>
          <span class="comparison-item-text">Hours spent updating spreadsheets manually</span>
        </li>
        <li class="comparison-item">
          <span class="comparison-item-icon">⏰</span>
          <span class="comparison-item-text">Discover problems weeks too late</span>
        </li>
        <li class="comparison-item">
          <span class="comparison-item-icon">🤯</span>
          <span class="comparison-item-text">Can't see across multiple businesses</span>
        </li>
        <li class="comparison-item">
          <span class="comparison-item-icon">💸</span>
          <span class="comparison-item-text">Miss tax deductions & savings</span>
        </li>
        <li class="comparison-item">
          <span class="comparison-item-icon">❓</span>
          <span class="comparison-item-text">No visibility into future cash flow</span>
        </li>
      </ul>
      
      <div class="comparison-metrics">
        <div class="comparison-metric">
          <div class="comparison-metric-value">20+</div>
          <div class="comparison-metric-label">Hours/month</div>
        </div>
        <div class="comparison-metric">
          <div class="comparison-metric-value">$0</div>
          <div class="comparison-metric-label">Insights</div>
        </div>
        <div class="comparison-metric">
          <div class="comparison-metric-value">High</div>
          <div class="comparison-metric-label">Stress</div>
        </div>
      </div>
    </div>
    
    <div class="comparison-after">
      <div class="comparison-label">✅ After</div>
      <h3 class="comparison-side-title">Intelligent Clarity</h3>
      
      <ul class="comparison-list">
        <li class="comparison-item">
          <span class="comparison-item-icon">⚡</span>
          <span class="comparison-item-text">Everything updates automatically in real-time</span>
        </li>
        <li class="comparison-item">
          <span class="comparison-item-icon">🎯</span>
          <span class="comparison-item-text">Get alerted before issues become expensive</span>
        </li>
        <li class="comparison-item">
          <span class="comparison-item-icon">🌐</span>
          <span class="comparison-item-text">Unified view of all your businesses</span>
        </li>
        <li class="comparison-item">
          <span class="comparison-item-icon">💰</span>
          <span class="comparison-item-text">AI finds every optimization opportunity</span>
        </li>
        <li class="comparison-item">
          <span class="comparison-item-icon">🔮</span>
          <span class="comparison-item-text">See 6 months ahead with 95% accuracy</span>
        </li>
      </ul>
      
      <div class="comparison-metrics">
        <div class="comparison-metric">
          <div class="comparison-metric-value">5min</div>
          <div class="comparison-metric-label">per month</div>
        </div>
        <div class="comparison-metric">
          <div class="comparison-metric-value">24/7</div>
          <div class="comparison-metric-label">Monitoring</div>
        </div>
        <div class="comparison-metric">
          <div class="comparison-metric-value">Peace</div>
          <div class="comparison-metric-label">of Mind</div>
        </div>
      </div>
    </div>
    
    <div class="comparison-vs">VS</div>
  </div>
</section>
```

---

## Integration Instructions

1. **Import CSS files** - Already done in main.js
2. **Add HTML sections** - Copy the HTML above into index.html in order
3. **ROI Calculator** - Automatically initializes on page load

The sections will automatically:
- Animate values on scroll
- Apply glass morphism effects
- Show dropdown menus on hover
- Calculate ROI as sliders change
- Display live status indicator

All styling and interactions are already wired up!