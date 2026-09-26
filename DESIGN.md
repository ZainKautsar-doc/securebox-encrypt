# SecureBox — Design Specification
> Dark encrypted protocol interface with electric blue cryptographic signals — a fortress of sharp edges and minimal surfaces where data moves through carefully orchestrated ciphertext layers.

**Theme:** dark

**Core Philosophy:** SecureBox adopts Vana's dark-canvas + electric-blue accent model to create a technical, protocol-focused aesthetic. No shadows, no gradients — surfaces step vertically through a neutral stack. All action is signaled via #0000ff (Electric Indigo). Typography is tight, geometric (Inter fallback for Cofo Sans), with sharp 2px corners on all buttons and cards to evoke "protocol command" rather than marketing affordance.

---

## Color Tokens

| Name | Value | Role |
|------|-------|------|
| Electric Indigo | `#0000ff` | Primary CTA, brand accent, encryption flow highlights, toggle states |
| Cobalt Pulse | `#4141fc` | Secondary borders, hover states on outlined controls |
| Periwinkle Veil | `#8b8bfe` | Ghost button borders, tertiary accents |
| Lime Beacon | `#7fd579` | Success states, verification checkmarks, file integrity indicators |
| Orchid Whisper | `#d896ff` | Decryption success marker, rare chromatic accent |
| Midnight Void | `#0d0d0d` | Page background canvas |
| Carbon Panel | `#161616` | Card, form panel, modal background — primary elevated surface |
| Graphite Lift | `#252525` | Secondary elevated surface for nested cards, headers |
| Steel Hover | `#3b3b3b` | Tertiary surface, filled neutral button, highest elevation |
| Pure Signal | `#ffffff` | Primary text, button labels, headings |
| Soft Mist | `#eaeaea` | Body text, descriptions, secondary copy |
| Warm Filament | `#b8ad97` | Decorative accents, code block borders |

---

## Typography

### Primary Font: Inter (Cofo Sans substitute)
- **Weights:** 400 (Regular), 700 (Bold)
- **Sizes:** 13px, 14px, 16px, 24px, 32px, 48px
- **Line Height:** 1.0–1.5
- **Letter Spacing:** Tight at headlines; -0.02em default

### Mono Font: JetBrains Mono (for metadata labels, code snippets)
- **Sizes:** 11px, 12px, 13px
- **Line Height:** 1.4
- **Role:** Technical labels, algorithm names, hash digests, file sizes

### Type Scale

| Role | Size | Weight | Line Height | Letter Spacing |
|------|------|--------|-------------|----------------|
| Caption / Tag | 11px | 400 | 1.25 | -0.22px |
| Body | 14px | 400 | 1.5 | -0.28px |
| Body Large | 16px | 400 | 1.5 | -0.32px |
| Subheading | 24px | 700 | 1.15 | -0.36px |
| Display | 48px | 700 | 1.1 | -0.96px |

---

## Spacing & Layout

- **Base Unit:** 4px
- **Spacing Scale:** 8px, 16px, 20px, 24px, 32px, 48px, 64px
- **Page Max Width:** 1200px (centered container)
- **Section Gap:** 48px vertical spacing between major sections
- **Card Padding:** 24px (internal)
- **Element Gap:** 16px (between form inputs, buttons, etc.)
- **Gutter:** 24px (page horizontal padding)

---

## Components

### Navigation Bar
- **Background:** Midnight Void `#0d0d0d`
- **Border:** 1px Pure Signal `#ffffff` bottom border
- **Logo/Brand:** "SecureBox" in Inter 700 at 16px, Pure Signal, left-aligned
- **Nav Items:** Right-aligned, Mono font at 12px uppercase with dot prefix (• ENCRYPT, • DECRYPT, • FILES, • HISTORY)
- **Padding:** 20px vertical, 24px horizontal

### Primary CTA Button (Filled)
- **Background:** Electric Indigo `#0000ff`
- **Text:** Pure Signal `#ffffff`, Inter 700 at 13–14px uppercase
- **Padding:** 11px 24px
- **Border Radius:** 2px
- **State – Hover:** Cobalt Pulse border (1px), maintained background
- **State – Disabled:** Steel Hover background, Soft Mist text
- **Examples:** "Encrypt Now", "Decrypt", "Upload File"

### Secondary Button (Outlined Ghost)
- **Background:** Transparent
- **Border:** 1px Periwinkle Veil `#8b8bfe`
- **Text:** Pure Signal `#ffffff`, Inter 700 at 13–14px uppercase
- **Padding:** 11px 24px
- **Border Radius:** 2px
- **State – Hover:** Cobalt Pulse border
- **Examples:** "Cancel", "Reset", "View Details"

### Chromatic Accent Button (Lime or Orchid)
- **Background:** Transparent
- **Border:** 1px Lime Beacon `#7fd579` OR Orchid Whisper `#d896ff`
- **Text:** Matching color to border
- **Padding:** 11px 24px
- **Border Radius:** 2px
- **Use Sparingly:** Only 2–4 instances across entire app
- **Examples:** "Verify Integrity", "Mark Success"

### Form Input / Textarea
- **Background:** Carbon Panel `#161616`
- **Border:** 1px Graphite Lift `#252525` (default) → 1px Electric Indigo on focus
- **Text:** Pure Signal `#ffffff`
- **Placeholder:** Soft Mist `#eaeaea`, 50% opacity
- **Padding:** 12px 16px
- **Border Radius:** 2px
- **Font:** Inter 400 at 14px
- **Label:** Soft Mist at 12px, 16px above input

### Card Container
- **Background:** Carbon Panel `#161616`
- **Border:** 1px Graphite Lift `#252525` (optional subtle line)
- **Padding:** 24px
- **Border Radius:** 2px
- **Elevation Rule:** Never use shadow; rely on surface color step

### Step-by-Step Flow Indicator
- **Layout:** Horizontal 4-step flow (Step 1 → Step 2 → Step 3 → Step 4)
- **Active Step Number:** Electric Indigo `#0000ff`, Inter 700 at 16px
- **Inactive Step Number:** Graphite Lift `#252525`, Inter 400 at 14px
- **Connector Line:** Steel Hover `#3b3b3b` between steps
- **Active Connector:** Electric Indigo `#0000ff`
- **Padding:** 24px vertical, full width
- **Background:** Graphite Lift `#252525` light band

### Result Display Panel
- **Background:** Carbon Panel `#161616`
- **Title:** "Encryption Result" / "Decryption Result" in Inter 700 at 16px, Pure Signal
- **Content:** Monospace metadata (algorithm, key size, file size, timestamp)
- **Copy Button:** Primary CTA button, positioned top-right
- **Padding:** 24px
- **Border Radius:** 2px
- **Success Indicator:** Lime Beacon dot + "Verified" text on successful decryption
- **Error Indicator:** Orchid Whisper dot + error message on authentication failure

### History List Item
- **Background:** Carbon Panel `#161616` on default, Graphite Lift `#252525` on hover
- **Layout:** 3-column (DateTime | Operation | File/Size)
- **Font:** Inter 14px body, Mono 11px for metadata
- **Padding:** 16px 24px
- **Border Radius:** 2px
- **Action Icons:** Right-aligned (copy, download, retry, delete)
- **Icon Color:** Electric Indigo on hover, Soft Mist default

### File Upload Zone (Drag & Drop)
- **Background:** Graphite Lift `#252525`
- **Border:** 2px dashed Periwinkle Veil `#8b8bfe`
- **Hover Border:** 2px solid Electric Indigo `#0000ff`
- **Text:** "Drag files here or click to browse" in Soft Mist at 14px
- **Padding:** 48px
- **Border Radius:** 2px
- **Icon:** Electric Indigo upload icon (lucide-react) at 32px

### Benchmark Chart / Comparison Table
- **Background:** Carbon Panel `#161616`
- **Header Row:** Graphite Lift `#252525` background, Pure Signal text in Inter 700 at 13px
- **Data Rows:** Alternating Midnight Void (even) / Carbon Panel (odd)
- **Numeric Data:** Mono font at 13px, Lime Beacon for optimal performance
- **Border Radius:** 2px (container only, not cell borders)

### Error State Banner
- **Background:** Orchid Whisper `#d896ff` at 12% opacity
- **Border:** 1px Orchid Whisper `#d896ff`
- **Text:** "Authentication failed" or similar, Orchid Whisper at 14px
- **Icon:** Alert triangle in Orchid Whisper
- **Padding:** 16px 24px
- **Border Radius:** 2px
- **Position:** Below form, full width

### Success State Banner
- **Background:** Lime Beacon `#7fd579` at 12% opacity
- **Border:** 1px Lime Beacon `#7fd579`
- **Text:** "Decryption successful" or similar, Lime Beacon at 14px
- **Icon:** Checkmark in Lime Beacon
- **Padding:** 16px 24px
- **Border Radius:** 2px

---

## Layout Patterns

### Hero Section (Home / Landing)
- **Full viewport height** (480px minimum)
- **Background:** Midnight Void `#0d0d0d` with subtle Electric Indigo gradient or ASCII texture overlay (20% opacity)
- **Content:** Centered
  - **Headline:** 48px Inter 700, Pure Signal, tight letter-spacing
  - **Subheading:** 16px Inter 400, Soft Mist
  - **CTA Pair:** Primary (Encrypt) + Secondary (Learn More) buttons side-by-side
- **Spacing:** 48px vertical padding, max-width container

### Two-Column Section
- **Left Column:** Heading (24px), body text (14px), CTA button
- **Right Column:** Visualization or code block
- **Background Alternation:** Midnight Void / Graphite Lift bands for visual break
- **Gap:** 48px between columns
- **Max Width:** 1200px

### Tab Navigation (Encrypt / Decrypt / Files / History)
- **Background:** Graphite Lift `#252525`
- **Tab Items:** Inter 400 at 14px, Soft Mist default, Pure Signal on active
- **Active Indicator:** Bottom border 2px Electric Indigo
- **Padding:** 16px 24px per tab
- **Spacing:** 4px gap between tabs

### Form Section
- **Max Width:** 600px (centered on page)
- **Background:** Carbon Panel `#161616`
- **Padding:** 32px (internal content spacing)
- **Border Radius:** 2px
- **Fields:** Stacked vertically, 16px gap between inputs
- **Button Group:** 16px gap, flex-start alignment

### Comparison / Benchmark Layout
- **Section Header:** 24px subheading, centered, 48px bottom margin
- **Grid:** 3-column (1 KB | 1 MB | 10 MB payload sizes)
- **Card Per Column:** Algorithm + Speed + Throughput metrics
- **Background Alternation:** Carbon Panel / Graphite Lift rows

---

## Visual Hierarchy Rules

1. **Color Hierarchy:**
   - Electric Indigo `#0000ff` = "Switch On" action signals (buttons, active states, highlights)
   - Neutrals (white, gray stack) = primary readability
   - Lime/Orchid = success/error chromatic punctuation (< 5% of screen)

2. **Typography Hierarchy:**
   - Headlines: Inter 700, 24px+ (subheadings, section titles)
   - Body: Inter 400, 14–16px (descriptions, labels, copy)
   - Meta: Mono 11–12px (algorithm names, timestamps, technical details)

3. **Surface Hierarchy (No Shadows):**
   - Level 0: Midnight Void `#0d0d0d` (page background)
   - Level 1: Carbon Panel `#161616` (cards, modals, primary containers)
   - Level 2: Graphite Lift `#252525` (nested cards, headers, hover states)
   - Level 3: Steel Hover `#3b3b3b` (highest elevation, filled neutral buttons)

4. **Spacing Hierarchy:**
   - Page gutter: 24px
   - Section gap: 48px
   - Element gap: 16px
   - Component padding: 24px (cards), 12px (form inputs)

---

## Do's and Don'ts

### Do
- ✅ Use #0000ff (Electric Indigo) exclusively for all filled button backgrounds and primary CTAs
- ✅ Set border-radius to 2px on all buttons, cards, inputs, and containers
- ✅ Build surface hierarchy through color steps, never shadows
- ✅ Apply tight letter-spacing (-0.02em) on headlines
- ✅ Use Mono font exclusively for metadata, algorithm labels, and timestamps
- ✅ Maintain consistent 16px element gaps within form sections
- ✅ Use Lime/Orchid as rare accent borders (1px only), never backgrounds
- ✅ Stack neutral surfaces: #0d0d0d → #161616 → #252525 → #3b3b3b (one step per elevation level)
- ✅ Keep all text Pure Signal (#ffffff) or Soft Mist (#eaeaea) for contrast

### Don't
- ❌ Never use shadows, blur effects, or drop shadows for separation
- ❌ Never apply rounded corners >2px to buttons/cards (only pill buttons at 1440px)
- ❌ Never use gradients or textured fills in backgrounds
- ❌ Never mix multiple accent colors in the same UI section
- ❌ Never step surfaces by more than one level (jump directly from #0d0d0d to #252525 is visual noise)
- ❌ Never use a color outside the defined palette
- ❌ Never apply weight 700 to body copy (700 = headings only)
- ❌ Never exceed 12–14px for form labels or captions
- ❌ Never position multiple CTAs without clear primary/secondary distinction

---

## Responsive Breakpoints

| Breakpoint | Width | Layout Change |
|-----------|-------|----------------|
| Mobile | <640px | Single column, full-width cards, nav collapses to hamburger (dot-prefixed items hidden) |
| Tablet | 640–1024px | Two-column sections collapse to single column, card padding reduces to 20px |
| Desktop | >1024px | Full layout: two-column sections, 1200px max-width container, full nav visible |

---

## Animation & Microinteraction

- **Button Hover:** Background color shift (#0000ff → #4141fc) OR border highlight
- **Input Focus:** Border color shift (#252525 → #0000ff), no box-shadow
- **Tab Switch:** Underline slide animation (150ms ease-out), no fade
- **Error State:** Fade in (100ms) at top of form, auto-dismiss after 5s
- **File Upload Drag:** Hover state activates border pulse (dashed → solid)
- **Copy Action:** Text feedback "Copied!" for 2s, no toast notification

---

## Technical Specifications

### Tailwind CSS Configuration Override
```javascript
// tailwind.config.js additions
module.exports = {
  theme: {
    colors: {
      'electric-indigo': '#0000ff',
      'cobalt-pulse': '#4141fc',
      'periwinkle-veil': '#8b8bfe',
      'lime-beacon': '#7fd579',
      'orchid-whisper': '#d896ff',
      'midnight-void': '#0d0d0d',
      'carbon-panel': '#161616',
      'graphite-lift': '#252525',
      'steel-hover': '#3b3b3b',
      'pure-signal': '#ffffff',
      'soft-mist': '#eaeaea',
      'warm-filament': '#b8ad97',
    },
    borderRadius: {
      'sm': '2px',
      'lg': '16px',
      'full': '1440px',
    },
    spacing: {
      '8': '8px',
      '16': '16px',
      '20': '20px',
      '24': '24px',
      '32': '32px',
      '48': '48px',
      '64': '64px',
    },
    fontFamily: {
      'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      'mono': ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      'xs': '11px',
      'sm': '13px',
      'base': '14px',
      'lg': '16px',
      'xl': '24px',
      '2xl': '48px',
    },
  },
};
```

### CSS Custom Properties
```css
:root {
  --color-electric-indigo: #0000ff;
  --color-cobalt-pulse: #4141fc;
  --color-periwinkle-veil: #8b8bfe;
  --color-lime-beacon: #7fd579;
  --color-orchid-whisper: #d896ff;
  --color-midnight-void: #0d0d0d;
  --color-carbon-panel: #161616;
  --color-graphite-lift: #252525;
  --color-steel-hover: #3b3b3b;
  --color-pure-signal: #ffffff;
  --color-soft-mist: #eaeaea;
  --color-warm-filament: #b8ad97;

  --radius-sm: 2px;
  --radius-lg: 16px;
  --radius-full: 1440px;

  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
}
```

---

## Summary

SecureBox design is a **cryptographic protocol interface** — sharp, minimal, efficient. Dark canvas with electric-blue signal. No marketing chrome, no shadows, no gradients. Every pixel serves encryption and decryption clarity. Typography is tight, surfaces step predictably, and buttons feel like terminal commands. This aesthetic communicates trust, technical precision, and data sovereignty.