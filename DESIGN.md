# SecureBox — Design Specification (Supabase Aesthetic)
> Midnight code editor with phosphor green pulse — a terminal-native encryption suite where data flows through an all-black canvas punctuated by a single vibrant green signal.

**Theme:** dark

**Core Philosophy:** SecureBox adopts Supabase's monochrome discipline with a single chromatic accent. The interface is 99% grayscale: #121212 obsidian canvas, subtle #2e2e2e charcoal borders, and #3ecf8e phosphor green reserved exclusively for CTAs, success states, and emphasis. Typography is geometric and humanist (Inter/Manrope fallback for Circular) at weight 400 (headlines) and 500 (buttons). All buttons are pill-shaped (9999px radius). Cards breathe generously with 24px padding and 16px radius. Zero shadows — separation comes from 1px hairline borders. The aesthetic is developer-focused, quietly confident, and terminal-native.

---

## Color Tokens

| Name | Value | Role |
|------|-------|------|
| Phosphor Green | `#3ecf8e` | Primary CTA fill, active nav, success indicators, logo accents — the only chromatic element |
| Mint Pulse | `#00c573` | Link text, inline accents, subtle emphasis (reserve for rare secondary uses) |
| Forest Depth | `#1f4b37` | Hover/pressed state for green CTAs, button border shift |
| Midnight Emerald | `#006239` | Disabled green states, low-key brand-tinted backgrounds |
| Snow | `#fafafa` | Primary text, button labels, icon strokes — the dominant foreground |
| Silver Mist | `#b4b4b4` | Secondary headings, nav items, body emphasis, card descriptions |
| Smoke | `#898989` | Tertiary text, captions, helper text, muted metadata, logo cloud |
| Graphite | `#4d4d4d` | Icon outlines, low-emphasis borders, divider lines, decorative strokes |
| Slate | `#393939` | Input borders, subtle separators |
| Charcoal | `#2e2e2e` | Card and component borders, hairline separation lines (most-used border) |
| Ash | `#242424` | Elevated surface (nested cards, hover states, pills, popovers) |
| Obsidian | `#121212` | Page canvas foundation — the only background color used |

---

## Typography

### Primary Font: Inter / Manrope (Circular substitute)
- **Weights:** 400 (Regular — headlines), 500 (Medium — emphasis, buttons)
- **Sizes:** 12px, 14px, 16px, 18px, 24px, 36px, 48px
- **Line Height:** 1.0–1.56 (tight at display, generous at body)
- **Letter Spacing:** -0.007em uniform across all sizes (signature tightness)

### Mono Font: JetBrains Mono (Source Code Pro substitute)
- **Sizes:** 12px, 13px, 14px
- **Line Height:** 1.33
- **Letter Spacing:** +0.100em (wide tracking, airy terminal aesthetic)
- **Role:** Inline code snippets, hash digests, algorithm labels, technical metadata

### Type Scale

| Role | Size | Weight | Line Height | Letter Spacing |
|------|------|--------|-------------|----------------|
| Caption | 12px | 400 | 1.5 | -0.084px |
| Body Small | 14px | 400 | 1.43 | -0.098px |
| Body | 16px | 400 | 1.5 | -0.112px |
| Subheading | 18px | 500 | 1.38 | -0.126px |
| Heading Small | 24px | 500 | 1.33 | -0.168px |
| Heading | 36px | 500 | 1.2 | -0.252px |
| Display | 48px | 400 | 1.1 | -0.336px |

---

## Spacing & Layout

- **Base Unit:** 8px
- **Spacing Scale:** 8px, 16px, 24px, 32px, 40px, 48px, 64px, 80px, 96px
- **Page Max Width:** 1200px (centered container)
- **Section Gap:** 64–96px (generous vertical breathing room)
- **Card Padding:** 24px (internal)
- **Element Gap:** 8–16px (between form fields, buttons)
- **Gutter:** 24px (page horizontal padding)

---

## Components

### Pill Primary Button (CTA)
- **Background:** Phosphor Green `#3ecf8e`
- **Text:** Snow `#fafafa`, weight 500 at 14px
- **Border:** 1px Phosphor Green `#3ecf8e`
- **Padding:** 8px 16px
- **Border Radius:** 9999px (fully rounded)
- **State – Hover:** Border shifts to Forest Depth `#1f4b37`, background brightens
- **State – Active:** Background → Mint Pulse `#00c573`, border Forest Depth
- **State – Disabled:** Background Ash `#242424`, text Smoke `#898989`
- **Examples:** "Encrypt Data", "Decrypt Now", "Start Encryption"

### Pill Ghost Button (Secondary)
- **Background:** Transparent
- **Border:** 1px Charcoal `#2e2e2e`
- **Text:** Snow `#fafafa`, weight 400 at 14px
- **Padding:** 8px 16px
- **Border Radius:** 9999px
- **State – Hover:** Border → Graphite `#4d4d4d`, background rgba(255, 255, 255, 0.04)
- **Examples:** "Cancel", "Reset", "Learn More"

### Pill Status Indicator (GitHub-style)
- **Background:** Ash `#242424`
- **Border:** 1px Charcoal `#2e2e2e`
- **Text:** Snow `#fafafa`, weight 400 at 12px (mono font optional)
- **Icon:** Left-aligned (24px, Smoke color)
- **Padding:** 6px 10px
- **Border Radius:** 9999px
- **Use Case:** Success tags, file size badges, algorithm names
- **Examples:** "AES-256-GCM", "Verified ✓", "1.2 MB"

### Feature Card
- **Background:** Obsidian `#121212` (canvas-colored, border defines it)
- **Border:** 1px Charcoal `#2e2e2e`
- **Padding:** 24px
- **Border Radius:** 16px
- **Icon:** 24px, Phosphor Green `#3ecf8e` (top-left or center)
- **Heading:** Snow `#fafafa`, weight 500, 18px
- **Description:** Silver Mist `#b4b4b4`, weight 400, 14px
- **Illustration Area:** Optional decorative graphic in Graphite `#4d4d4d` lines on Ash `#242424` background (16px radius)
- **State – Hover:** Border → Graphite `#4d4d4d`, background stays Obsidian

### Result Display Panel
- **Background:** Ash `#242424` (elevated surface)
- **Border:** 1px Charcoal `#2e2e2e`
- **Padding:** 24px
- **Border Radius:** 16px
- **Title:** "Encryption Result" in Snow `#fafafa`, weight 500, 18px
- **Content Area:** Monospace text (algorithm, key size, nonce, auth tag) in Mono font 12px
- **Success Indicator:** Phosphor Green dot + "Verified" text
- **Error Indicator:** Text in Smoke `#898989` with red-tinted border (or use Smoke for subtle error)
- **Action Buttons:** Copy (primary green pill), Download (ghost pill)

### History List Item
- **Background:** Obsidian `#121212` (bordered)
- **Border:** 1px Charcoal `#2e2e2e`
- **Padding:** 16px 24px
- **Border Radius:** 16px
- **Hover State:** Border → Graphite `#4d4d4d`, subtle scale transform
- **Layout:** DateTime | Operation | File/Size | Actions (right-aligned)
- **Font:** Body 14px for primary, Mono 12px for metadata
- **Icon Color:** Phosphor Green (hover), Graphite (default)

### Form Input Field
- **Background:** Obsidian `#121212`
- **Border:** 1px Slate `#393939` (default) → 1px Phosphor Green `#3ecf8e` (focus)
- **Text:** Snow `#fafafa`, weight 400, 14px
- **Placeholder:** Smoke `#898989`, 50% opacity
- **Padding:** 8px 12px
- **Border Radius:** 8px
- **Label:** Silver Mist `#b4b4b4`, weight 400, 12px, 12px above input
- **Focus State:** Green border (no glow ring), subtle scale(1.01) transform

### File Upload Zone (Drag & Drop)
- **Background:** Ash `#242424`
- **Border:** 1px dashed Charcoal `#2e2e2e` → 1px solid Phosphor Green on hover
- **Text:** "Drag files here or click to browse" in Silver Mist `#b4b4b4`, 14px
- **Icon:** Phosphor Green upload icon (32px)
- **Padding:** 48px
- **Border Radius:** 16px
- **Hover State:** Border pulse animation (500ms), background → Graphite `#4d4d4d` at 0.02 opacity

### Error Banner
- **Background:** Smoke `#898989` at 8% opacity (or red-tinted if extending palette)
- **Border:** 1px Smoke `#898989`
- **Text:** "Authentication failed" in Smoke, 14px
- **Icon:** Alert triangle in Smoke
- **Padding:** 16px 24px
- **Border Radius:** 8px
- **Position:** Full width, top of form
- **Animation:** Fade in (150ms), auto-dismiss 5s (fade out 300ms)

### Success Banner
- **Background:** Phosphor Green `#3ecf8e` at 8% opacity
- **Border:** 1px Phosphor Green `#3ecf8e`
- **Text:** "Decryption successful" in Phosphor Green, 14px, weight 500
- **Icon:** Checkmark in Phosphor Green
- **Padding:** 16px 24px
- **Border Radius:** 8px
- **Animation:** Fade in (150ms), pulse border (subtle glow 0.5s infinite)

### Navigation Bar
- **Background:** Obsidian `#121212` (or transparent, solid on scroll)
- **Border:** 1px Charcoal `#2e2e2e` bottom
- **Height:** 64px
- **Logo:** "SecureBox" in Snow `#fafafa`, weight 500, 16px (left-aligned)
- **Nav Links:** Silver Mist `#b4b4b4`, weight 400, 14px (center)
- **Active Indicator:** Phosphor Green underline (2px)
- **Right Section:** Sign in ghost button, feature pill (GitHub stars style)
- **Padding:** 16px 24px

### Benchmark / Comparison Table
- **Background:** Obsidian `#121212`
- **Header Row:** Ash `#242424` background, Snow text, weight 500, 14px
- **Data Rows:** Alternating Obsidian / transparent
- **Border:** 1px Charcoal `#2e2e2e` between rows
- **Numeric Highlight:** Phosphor Green for best-performer metric
- **Border Radius:** 16px (container only, no cell borders)
- **Padding:** 24px row, 16px cell

### Step Flow Indicator (Encryption Flow)
- **Layout:** Horizontal 4-step indicator (Step 1 → Step 2 → Step 3 → Step 4)
- **Active Step Number:** Phosphor Green `#3ecf8e`, weight 500, 18px
- **Inactive Step Number:** Graphite `#4d4d4d`, weight 400, 14px
- **Connector Line:** Charcoal `#2e2e2e` → Phosphor Green (active)
- **Background:** Optional Ash `#242424` thin band
- **Padding:** 24px vertical, full width
- **Step Description:** Smoke `#898989`, 12px, centered below number

---

## Layout Patterns

### Hero Section
- **Viewport Height:** 480px minimum (full bleed on mobile)
- **Background:** Obsidian `#121212` (optional subtle Ash gradient background, 2% opacity)
- **Content:** Centered
  - **Headline:** 48px weight 400, Snow `#fafafa`, tight letter-spacing
  - **Subheading:** 16px weight 400, Silver Mist `#b4b4b4`
  - **CTA Pair:** Phosphor Green pill + Ghost pill, 16px gap
- **Spacing:** 64px vertical padding, max-width 1200px

### Two-Column Layout
- **Left Column:** Heading (24px weight 500), body (16px weight 400), CTA
- **Right Column:** Visualization, code block, or illustration
- **Gap:** 48px horizontal
- **Background Alternation:** Obsidian / none (white space)
- **Max Width:** 1200px

### Tab Navigation (Encrypt / Decrypt / History / Compare)
- **Background:** Obsidian `#121212` (or Ash at 50% opacity)
- **Tab Items:** Weight 400, 14px, Silver Mist default → Snow on active
- **Active Indicator:** Bottom border 2px Phosphor Green (no background fill)
- **Padding:** 16px 24px per tab
- **Spacing:** 4px gap
- **Animation:** Border slides smoothly (200ms ease-out)

### Form Section (Centered)
- **Max Width:** 600px (centered on page)
- **Background:** Obsidian `#121212` with 1px Charcoal `#2e2e2e` border
- **Padding:** 32px
- **Border Radius:** 16px
- **Fields:** Stacked vertically, 16px gap
- **Button Group:** 8px gap, flex row, primary button on left

### Comparison Grid
- **Grid:** 3-column (1KB | 1MB | 10MB)
- **Cards Per Column:** Algorithm + Speed + Throughput in card format
- **Section Header:** 24px weight 500, centered, 48px margin-bottom
- **Gap:** 24px between cards
- **Background:** Obsidian with Charcoal borders

---

## Animations & Transitions

All animations are **subtle, performance-optimized, and use `transform` + `opacity` only** (GPU-accelerated, zero repaints).

### Button Interactions
- **Hover:** Border color transition (200ms ease-out), scale(1.02)
- **Active:** scale(0.98) (press feel), immediate
- **Disabled:** Opacity 0.5, no transition

### Input Focus
- **Border Color:** Slate → Phosphor Green (150ms ease-out), no glow ring
- **Scale:** scale(1.01) on focus (subtle expansion)

### Form State Changes
- **Error Banner:** Fade in (150ms cubic-bezier), slide down 12px simultaneously
- **Success Banner:** Fade in (150ms), then pulse border 1s infinite (opacity 1 → 0.6)

### Tab Switch
- **Indicator Line:** Slides smoothly (250ms ease-out), width animates proportionally
- **Content:** Fade + slide up (200ms ease-out)

### File Drag & Drop
- **Hover State:** Border animation (dashed → solid), pulse effect (500ms infinite, opacity 0.4 → 1)
- **Active Upload:** Scale(0.98), opacity 0.8

### List Item Interactions
- **Hover:** Border color (Charcoal → Graphite), subtle background fill rgba(255, 255, 255, 0.01), scale(1.01) transform
- **Transition Duration:** 150ms ease-out

### Modal / Popover Entrance
- **Fade:** opacity 0 → 1 (200ms)
- **Slide:** translate(-50%, -48px) → (0, 0) (200ms ease-out cubic-bezier(0.34, 1.56, 0.64, 1))
- **Exit:** Reverse 150ms

### Encryption Progress
- **Subtle Pulse:** Success indicator pulses Phosphor Green (0.8s infinite, opacity 1 → 0.6)
- **No Progress Bar Animation:** Keep simple, linear, no bounce

### Copy Action Feedback
- **Icon Swap:** Check icon appears (150ms fade), auto-reverts after 2s (200ms fade)
- **Text Color:** Phosphor Green temporarily

### Link Underline
- **Hover:** Width 0% → 100% (200ms ease-out from left)

---

## Do's and Don'ts

### Do
- ✅ Use #3ecf8e (Phosphor Green) exclusively for primary CTAs, active nav, success states
- ✅ Set all button radius to 9999px (pills) and card radius to 16px
- ✅ Use weight 400 for headlines, weight 500 only for button labels and emphasis
- ✅ Separate surfaces with 1px Charcoal `#2e2e2e` hairline borders
- ✅ Apply -0.007em letter-spacing uniformly across all sizes
- ✅ Use Phosphor Green as focus border on inputs (1px, no box-shadow)
- ✅ Maintain Obsidian `#121212` as the single page background
- ✅ Keep animations GPU-accelerated (transform, opacity only), max 250ms
- ✅ Use consistent spacing: 8px gaps, 24px card padding, 48–64px section gaps
- ✅ Apply subtle scale transforms on hover (scale 1.01–1.02)

### Don't
- ❌ Never use colors outside the defined 12-color palette
- ❌ Never use weight 600+ in font (system tops at 500)
- ❌ Never add box-shadows (flat design — use borders only)
- ❌ Never use radius other than 9999px (buttons), 16px (cards), 8px (inputs)
- ❌ Never place Phosphor Green on large backgrounds (punctuation only)
- ❌ Never use gradients (flat, terminal-native aesthetic)
- ❌ Never exceed 250ms animation duration (performance)
- ❌ Never animate using `left`, `top`, `width`, `height` (use `transform` instead)
- ❌ Never use `box-shadow` for focus states (use border color only)
- ❌ Never skip letter-spacing (it's the signature of the design)

---

## Animation Performance Guidelines

- **GPU Acceleration:** Only animate `transform` and `opacity` properties
- **Duration:** Keep animations 100–250ms (100ms for quick micro-interactions, 250ms for larger state changes)
- **Easing:** Use `ease-out`, `ease-in-out`, cubic-bezier for fluid motion
- **No JavaScript Animations:** Rely on CSS transitions and keyframes
- **Reduce Motion:** Respect `prefers-reduced-motion` media query (disable animations if enabled)

**Lightweight Animation Pattern:**
```css
.button {
  transition: border-color 150ms ease-out, transform 150ms ease-out;
}

.button:hover {
  border-color: var(--color-phosphor-green);
  transform: scale(1.02);
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Responsive Breakpoints

| Breakpoint | Width | Change |
|-----------|-------|--------|
| Mobile | <640px | Single column, 16px gutter, cards 100% width, nav hamburger |
| Tablet | 640–1024px | Two-column sections → single, padding 20px, spacing 48px |
| Desktop | >1024px | Full layout, 1200px max-width, 24px gutter, full nav |

---

## Tailwind CSS Configuration Override

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      'phosphor': '#3ecf8e',
      'mint': '#00c573',
      'forest': '#1f4b37',
      'emerald': '#006239',
      'snow': '#fafafa',
      'silver': '#b4b4b4',
      'smoke': '#898989',
      'graphite': '#4d4d4d',
      'slate': '#393939',
      'charcoal': '#2e2e2e',
      'ash': '#242424',
      'obsidian': '#121212',
    },
    borderRadius: {
      'sm': '8px',
      'base': '16px',
      'full': '9999px',
    },
    spacing: {
      '8': '8px',
      '16': '16px',
      '24': '24px',
      '32': '32px',
      '40': '40px',
      '48': '48px',
      '64': '64px',
      '80': '80px',
      '96': '96px',
    },
    fontFamily: {
      'sans': ['Inter', 'Manrope', 'ui-sans-serif'],
      'mono': ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      'xs': '12px',
      'sm': '14px',
      'base': '16px',
      'lg': '18px',
      'xl': '24px',
      '2xl': '36px',
      '3xl': '48px',
    },
    transitionDuration: {
      '150': '150ms',
      '200': '200ms',
      '250': '250ms',
    },
  },
};
```

---

## Summary

SecureBox with Supabase aesthetic is **monochrome discipline meets developer focus** — a terminal-native encryption interface where a single phosphor green signal cuts through an all-black canvas. Typography is geometric and humanist, surfaces breathe generously, and animations are subtle and GPU-optimized. The design communicates speed, precision, and trust without marketing noise. Every green pixel is earned.