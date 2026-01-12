# Interactive Dashboard Storytelling - Implementation Plan

## Overview
Transform the Business Health Journey dashboard into an immersive storytelling experience where users discover their financial narrative through scroll-triggered animations, click interactions, and progressive data reveal.

## Story Flow Design

### Act 1: The Beginning - Data Sources (Current State)
**User sees:** Input pills (Bank Feeds, Invoices, CSV Upload)
**Interaction:** Pills animate in sequence on scroll
**Narrative:** "Your story begins with data..."

### Act 2: The Journey - Data Processing
**User sees:** Animated flow line starts moving downward
**Interaction:** Particle effects travel down the line
**Narrative:** "We digest your numbers in real-time..."

### Act 3: The Heart - Core Metrics
**User sees:** Core cards fade in and pulse
**Interaction:** Click cards to see detailed breakdowns
**Narrative:** "Here's the pulse of your business..."

### Act 4: The Split - Risks vs Opportunities
**User sees:** Flow splits into red (risk) and green (opportunity) paths
**Interaction:** Cards reveal on scroll, clickable for deep dives
**Narrative:** "Every business faces crossroads..."

## Technical Implementation

### 1. Scroll-Triggered Story Mode (`story-mode.js`)
- Intersection Observer for scroll detection
- Stage-based progression system
- Narrative text overlay system
- Progress bar indicator

### 2. Interactive Card System (Enhanced)
- Click to expand with modal/overlay
- Detailed data visualization in expanded view
- Chart animations on reveal
- Smooth transitions

### 3. Data Flow Animations (Enhanced)
- Particle system along flow paths
- Pulsing effect at decision points
- Color-coded data packets
- Synchronized with scroll position

### 4. Narrative Overlay System
- Contextual tooltips
- Story text that fades in/out
- Voice-of-Savra personality
- Progress tracking

## Files to Modify/Create

### New Files
- `src/story-mode.js` - Main storytelling engine
- `src/story-mode.css` - Storytelling UI styles
- `src/interactive-cards.js` - Enhanced card interactions
- `src/narrative-overlay.css` - Narrative text styles

### Modified Files
- `src/main.js` - Import and initialize story mode
- `src/dashboard-hub.css` - Add interactive states
- `index.html` - Add narrative elements and data attributes

## Progressive Enhancement Strategy

**Phase 1: Scroll Animations** (Essential)
- Scroll-triggered card reveals
- Flow line animations
- Stage progression

**Phase 2: Click Interactions** (Core)
- Expandable cards
- Detailed views
- Interactive tooltips

**Phase 3: Narrative Layer** (Enhancement)
- Story text overlays
- Guided tour mode
- Progress tracking

**Phase 4: Polish** (Nice-to-have)
- Sound effects
- Micro-interactions
- Easter eggs

## User Experience Flow

1. **Initial Load:** User sees hero section and "Data Sources" label
2. **Scroll Down:** Data source pills animate in sequentially
3. **Continued Scroll:** Flow line starts drawing downward
4. **Particles Emerge:** Data particles flow down the line
5. **Core Reveal:** Main cash flow card pulses into view with dramatic effect
6. **Secondary Metrics:** Runway card appears
7. **The Split:** Flow divides, risk/opportunity paths reveal
8. **Discovery:** User can click any card for deeper insights
9. **Completion:** All stages revealed, "Replay Story" button appears

## Interaction States

### Cards
- **Default:** Subtle pulse, hover glow
- **Hover:** Lift effect, brighter border
- **Click:** Expand to detailed view
- **Expanded:** Full data breakdown, mini charts, close button

### Flow Lines
- **Inactive:** Faint, static
- **Active:** Glowing, animated particles
- **Complete:** Full opacity, steady glow

### Narrative Text
- **Hidden:** opacity 0, translateY(20px)
- **Active:** opacity 1, translateY(0)
- **Exiting:** opacity 0, translateY(-20px)

## Accessibility Considerations

- Respect `prefers-reduced-motion`
- Keyboard navigation for all interactions
- ARIA labels for story stages
- Skip story button for repeat visitors
- Alt text for visual elements

## Success Metrics

- Scroll depth increases
- Card interaction rate
- Time spent on dashboard
- Completion rate of full story
- User delight (qualitative)
