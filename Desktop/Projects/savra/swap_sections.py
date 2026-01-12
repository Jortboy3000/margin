import os

file_path = r"c:\Users\User\Desktop\Projects\savra\index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Define the blocks using start/end markers that are unique
# Hero Preview Block
hero_start_marker = '<div class="hero-preview">'
hero_end_marker = '<!-- Trust Indicators -->' # This marks the start of the next section

# logic: find start of hero-preview, find line before Trust Indicators.
start_idx = content.find(hero_start_marker)
end_idx = content.find(hero_end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find hero-preview block")
    exit(1)

# The content to replace (Hero Preview) is roughly content[start_idx : end_idx]
# We need to backtrack from end_idx to include the closing </div> of the hero-preview
# Iterate backwards from end_idx to find the last </div>
# Actually, looking at the file, the </div> is structurally before the comment.
# "                </div>\n\n                <!-- Trust Indicators -->"

# Let's simple slice up to end_idx and replace the PREVIOUS </div> block.
# safer: Find the exact string if possible. 

# New approach: Replace the known block with the new content string directly constructed.

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

# Remove the old block using slice
# We assume the layout:
# <div class="hero-preview">
# ...
# </div> (The one just before trust indicators)

# find the last </div> before trigger
sub_content = content[:end_idx]
last_div = sub_content.rfind('</div>') # This finds the </div> of the hero-preview
if last_div == -1:
    print("Error locating end div")
    exit(1)

# Now iterate back one more time to find the div that closes .roi-calculator? No, .hero-preview closes everything.
# The structure is <div class="hero-preview"> ... </div>
# So replacing content[start_idx : last_div + 6] should work.

new_content = content[:start_idx] + radial_map_html + "\n\n" + (" " * 16) + content[last_div+6:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully replaced content.")
