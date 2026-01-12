import os

file_path = r"c:\Users\User\Desktop\Projects\savra\index.html"

print(f"Reading {file_path}")
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

start_marker = '<div class="features-radial-map">'
end_marker = '<!-- Trust Indicators -->'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

print(f"Start Index: {start_idx}")
print(f"End Index: {end_idx}")

if start_idx != -1 and end_idx != -1:
    # Construct new content
    # We want to keep the start_marker (wrapper) but replace its content? 
    # Actually, let's just REPLACE THE WHOLE BLOCK including wrapper with the new wrapper+content.
    
    radial_map_html = """                    <div class="features-radial-map">
                        <svg class="mind-map-svg" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet">
                            <!-- Connections from Center (500, 350) to Nodes -->
                            <path class="map-line" d="M 500 350 L 500 105" /> <!-- Top -->
                            <path class="map-line" d="M 500 350 L 820 196" /> <!-- Top Right -->
                            <path class="map-line" d="M 500 350 L 750 504" /> <!-- Bottom Right -->
                            <path class="map-line" d="M 500 350 L 250 504" /> <!-- Bottom Left -->
                            <path class="map-line" d="M 500 350 L 180 196" /> <!-- Top Left -->
                        </svg>

                        <!-- Center Node -->
                        <div class="feature-center-logo">
                            <img src="/assets/s.svg" alt="Savra" />
                        </div>

                        <!-- 1. Cash Flow (Top) -->
                        <div class="feature-radial-node pos-1" data-feature="cashflow">
                            <div class="feature-icon-wrapper">
                                <div class="feature-icon"><i data-lucide="coins"></i></div>
                            </div>
                            <h3 class="feature-title">Cash Flow Prediction</h3>
                            <p class="feature-description">See 6 months ahead with Savra-powered forecasting. Know exactly when money's coming in.</p>
                            <div class="feature-highlight">95% ACCURACY</div>
                        </div>

                        <!-- 2. Risk (Top Right) -->
                        <div class="feature-radial-node pos-2" data-feature="risk">
                            <div class="feature-icon-wrapper">
                                <div class="feature-icon"><i data-lucide="alert-triangle"></i></div>
                            </div>
                            <h3 class="feature-title">Risk Detection</h3>
                            <p class="feature-description">Savra spots tax risks, burn rate spikes, and hidden expenses before they become problems.</p>
                            <div class="feature-highlight">REAL-TIME ALERTS</div>
                        </div>

                        <!-- 3. Security (Bottom Right) -->
                        <div class="feature-radial-node pos-3" data-feature="security">
                            <div class="feature-icon-wrapper">
                                <div class="feature-icon"><i data-lucide="shield-check"></i></div>
                            </div>
                            <h3 class="feature-title">Bank-Level Security</h3>
                            <p class="feature-description">End-to-end encryption, isolated data, and SOC 2 compliance. Your data never trains our models.</p>
                            <div class="feature-highlight">ENTERPRISE-GRADE</div>
                        </div>

                        <!-- 4. Multi-Business (Bottom Left) -->
                        <div class="feature-radial-node pos-4" data-feature="multi">
                            <div class="feature-icon-wrapper">
                                <div class="feature-icon"><i data-lucide="layout-dashboard"></i></div>
                            </div>
                            <h3 class="feature-title">Multi-Business Dashboard</h3>
                            <p class="feature-description">Run multiple ventures? See all your businesses in one unified, intelligent dashboard.</p>
                            <div class="feature-highlight">UNLIMITED BUSINESSES</div>
                        </div>

                        <!-- 5. Auto-Cat (Top Left) -->
                        <div class="feature-radial-node pos-5" data-feature="auto">
                            <div class="feature-icon-wrapper">
                                <div class="feature-icon"><i data-lucide="bot"></i></div>
                            </div>
                            <h3 class="feature-title">Auto-Categorization</h3>
                            <p class="feature-description">No more manual tagging. Savra learns your business and categorizes every transaction instantly.</p>
                            <div class="feature-highlight">ZERO MANUAL WORK</div>
                        </div>
                    </div>"""
    
    # We replace from start_idx to end_idx-1.
    # Note: start_idx is the '<' of <div class="features-radial-map">
    # end_idx is the '<' of <!-- Trust
    # We want to replace strictly that range.
    
    # Check if there is a closing div before Trust Indicators that we need to keep?
    # No, the previous content ended with </div></div></div> etc.
    # The structure:
    # <div class="features-radial-map"> ... </div> (This is the block to replace)
    # <div class="trust-indicators"> ...
    # So we replace up to the whitespace before Trust Indicators.
    
    new_content = content[:start_idx] + radial_map_html + "\n\n                " + content[end_idx:]
    
    print("Writing new content...")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
        f.flush()
        os.fsync(f.fileno())
    print("Write complete.")
    
else:
    print("Markers not found.")
