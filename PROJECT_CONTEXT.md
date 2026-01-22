# PROJECT_CONTEXT.md

## PROJECT OVERVIEW

### Tech Stack
- **Framework**: Astro 5.16.x
- **Styling**: Tailwind CSS v4 (via Vite plugin `@tailwindcss/vite`)
- **Animation**: GSAP 3.14.x with ScrollTrigger plugin
- **Interactivity**: Alpine.js (CDN) for mobile menu
- **Content**: Astro Content Collections with Zod validation
- **Fonts**: Libre Baskerville (headings), Inter (body), JetBrains Mono (code)

### Purpose
Interactive single-page portfolio with sophisticated scroll-based animations, featuring:
- Desktop: GSAP-powered scroll experience with pinned sections
- Mobile: CSS-only card-stacking effect for performance
- Theme: Light/dark mode with localStorage persistence
- Content: Markdown-based CMS with TypeScript fallback

---

## ARCHITECTURE

### Page Structure
Single page application at `src/pages/index.astro` with 6 sections:
1. **Hero** (`#home`) - Section 0
2. **About** (`#about`) - Section 1
3. **Skills** (`#skills`) - Section 2
4. **Projects** (`#projects`) - Section 3
5. **Timeline** (`#timeline`) - Section 4
6. **Contact** (`#contact`) - Section 5

### DOM Hierarchy
```
<Layout>
  ├── Preloader (fixed overlay)
  ├── Navbar (desktop: top fixed, mobile: bottom floating)
  └── #scroll-root
      ├── ScrollIndicator (desktop only, right side dots)
      └── .scroll-stage (pinned container for GSAP)
          ├── .base-background (animated gradient)
          ├── .background-image-layer (hero background)
          ├── .overlay-full (Section 0 overlay)
          ├── .overlay-gradient (Section 1 overlay)
          └── .scroll-panel × 6 (each section)
```

### Routing/Navigation
- **Desktop**: Click handlers on nav links dispatch custom events; GSAP scrolls to calculated positions
- **Mobile**: Standard anchor links with CSS scroll-snap-like behavior
- **Events Used**:
  - `sectionchange` - Fired when active section changes
  - `gotosection` - Request navigation to specific section index
  - `timelineprogress` - Updates timeline component (0-1 progress)
  - `siteready` - Fired when preloader completes

### Content Organization
```
src/content/
├── content.config.ts   # Zod schemas for all collections
├── portfolio/
│   └── hero.md         # Hero section content
├── about/
│   ├── index.md        # Main about text (body = paragraphs)
│   └── stats.md        # Statistics data
├── skills/
│   ├── frontend.md
│   ├── backend.md
│   └── tools.md
├── projects/
│   ├── project-1.md
│   ├── project-2.md
│   └── project-3.md
├── timeline/
│   ├── 2005.md → today.md  # Sorted by date field
└── contact/
    └── index.md
```

### Content Loading Strategy
1. **Primary**: Astro Content Collections via `getCollection()`
2. **Fallback**: Simple glob loader (`content-simple.ts`)
3. **Final Fallback**: Static TypeScript config (`data/config.ts`)

---

## REUSABLE COMPONENTS

### Hero.astro
- **Location**: `src/components/Hero.astro`
- **Purpose**: Landing section with animated name, role, and CTA buttons
- **Key Props**: `greeting`, `name`, `role`, `description`, `primaryButton`, `secondaryButton`
- **Animations**: 
  - Custom letter-by-letter name animation (vanilla JS `animate()` API)
  - CSS keyframe animations for greeting, role, description, buttons
  - Triggered by `.hero.animate` class (added after `siteready` event)

### About.astro
- **Location**: `src/components/About.astro`
- **Purpose**: Biography paragraphs with stats
- **Key Props**: `paragraphs: string[]`, `stats: { number, label }[]`
- **Animations**: None (static component)
- **Special**: Backdrop blur on mobile, transparent on desktop

### Skills.astro
- **Location**: `src/components/Skills.astro`
- **Purpose**: Skill categories with glassmorphism cards
- **Key Props**: `categories: { title, skills[] }[]`
- **Animations**: CSS hover transforms only

### Projects.astro
- **Location**: `src/components/Projects.astro`
- **Purpose**: Tabbed project showcase (Work/Ventures/Playground)
- **Key Props**: `categories: { id, label, projects[] }[]`
- **Animations**: CSS fade-in for tab switching
- **Child Component**: `ProjectCard.astro`

### HorizontalTimeline.astro
- **Location**: `src/components/HorizontalTimeline.astro`
- **Purpose**: Scroll-synced timeline with horizontal progress bar and glow effects
- **Key Props**: None (loads content via `getTimelineEntries()`)
- **Animations**:
  - Bar glow follows scroll progress (CSS `left` + `opacity`)
  - Vertical glow beam reaches up to year labels
  - Year labels get `.glowing` class when glow passes
  - Content panels fade in/out based on active index
- **Data Attribute**: `data-timeline-entries={count}` (used by main scroll calculations)

### Contact.astro
- **Location**: `src/components/Contact.astro`
- **Purpose**: Contact CTA with social links
- **Key Props**: `description`, `email`, `socialLinks[]`
- **Animations**: CSS hover transforms

### Navbar.astro
- **Location**: `src/components/Navbar.astro`
- **Purpose**: Responsive navigation
- **Key Props**: `logo`, `links[]`
- **Behavior**:
  - Desktop (>1024px): Fixed top navbar with backdrop blur
  - Mobile (≤1024px): Floating bottom bar with Alpine.js toggle, glassmorphism effect
- **Special**: Contrast detection script adjusts mobile menu colors based on background

### ScrollIndicator.astro
- **Location**: `src/components/ScrollIndicator.astro`
- **Purpose**: Desktop-only dot navigation on right side
- **Key Props**: `totalSections: number`
- **Animations**: CSS pulse animation on active dot
- **Events**: Listens to `sectionchange`, dispatches `gotosection`

### ThemeToggle.astro
- **Location**: `src/components/ThemeToggle.astro`
- **Purpose**: Light/dark mode toggle
- **Key Props**: None
- **Storage**: `localStorage.theme` = 'light' | 'dark'

### SectionTitle.astro
- **Location**: `src/components/SectionTitle.astro`
- **Purpose**: Consistent section headers
- **Key Props**: `number`, `title`, `class?`

### ProjectCard.astro
- **Location**: `src/components/ProjectCard.astro`
- **Purpose**: Individual project display card
- **Key Props**: `title`, `description`, `technologies[]`, `projectUrl?`, `codeUrl?`

### Footer.astro
- **Location**: `src/components/Footer.astro`
- **Purpose**: Simple footer
- **Key Props**: `text`, `year`

---

## ANIMATION PATTERNS

### Desktop Scroll Experience (GSAP ScrollTrigger)

**Location**: Inline `<script>` in `src/pages/index.astro` (lines 140-677)

**Core Configuration**:
```javascript
const SECTION_SCROLL_UNITS = 0.80;    // Scroll distance per section
const TIMELINE_SCROLL_UNITS = 0.75;   // Scroll distance per timeline entry
const SECTION_TOLERANCE = 0.25;       // Dead zone for section transitions
const BACKGROUND_IMAGE_END_SECTION = 2; // Hide bg at Skills section
```

**ScrollTrigger Setup**:
```javascript
ScrollTrigger.create({
  trigger: scrollRoot,
  start: 'top top',
  end: () => `+=${scrollDistance - window.innerHeight}`,
  scrub: 2,           // Smooth scrolling with 2s delay
  pin: scrollStage,   // Pin the stage container
  anticipatePin: 1,
  onUpdate: (self) => { /* main animation logic */ }
});
```

**Section Transitions**:
- Sections are absolutely positioned, stacked
- Only active section visible (`autoAlpha: 1`)
- Inactive sections: `autoAlpha: 0, y: 40, x: ±60` (alternating directions)
- Transitions use `gsap.to()` with `duration: 0.3, ease: 'power2.out'`
- Threshold-based switching with tolerance zones

**Background Image Animation (Sections 0-1)**:
1. **Section 0**: Zoom from 1.0 to 1.5 scale (completes at 70% progress)
2. **Overlay transition**: Full overlay fades out, gradient fades in (synced with zoom)
3. **Section 1**: Image slides left (`translateX`) and fades out (completes at 60%)
4. **Section 2+**: Background completely hidden

**Timeline Extended Scroll**:
- Timeline section gets extra scroll units based on entry count
- Progress mapped to timeline entries for horizontal bar animation
- Custom event `timelineprogress` dispatched with 0-1 value

### Mobile "Card-Like" Behavior (CSS Only)

**Location**: `<style>` in `src/pages/index.astro` (lines 1117-1255)

**Breakpoint**: `@media (max-width: 1024px)`

**Implementation**:
```css
/* Sections 0-1: Transparent, background visible through */
.scroll-panel#home, .scroll-panel#about {
  background: transparent;
  position: sticky; /* About section */
  top: 0;
}

/* Sections 2+: Card stacking effect */
.scroll-panel:nth-child(n+3) {
  position: sticky;
  top: 0;
  background: var(--bg-primary);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.08);
}

/* Z-index layering */
.scroll-panel:nth-child(3) { z-index: 30; }
.scroll-panel:nth-child(4) { z-index: 40; }
/* etc... */
```

**Mobile Background Fade** (`initMobileBackgroundFade()`):
- Phase 1: Overlay transition during Hero scroll (0-70% of hero height)
- Phase 2: Background fades out when Skills section starts covering About
- Uses scroll event listener (passive) with calculated thresholds

### Other Animation Patterns

**Hero Name Animation** (Hero.astro):
```javascript
// Letter-by-letter with blur and Y-offset
span.animate([
  { opacity: 0, transform: `translateY(${offset}px)`, filter: 'blur(8px)' },
  { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' }
], {
  duration: letterDuration,
  delay: cumulativeDelay,
  easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  fill: 'forwards'
});
```

**Preloader** (Layout.astro):
- Waits for: DOM ready, fonts, background image, minimum 800ms
- Dispatches `siteready` event when complete
- Failsafe: 5s maximum wait

**Timeline Glow Effect** (HorizontalTimeline.astro):
- `.bar-glow`: Radial gradient, follows scroll progress horizontally
- `.vertical-glow`: Linear gradient beam, points up to year labels
- Year labels get `.glowing` class within 5% radius of glow position

---

## STYLING APPROACH

### When Tailwind is Used (HTML Classes)
- **Utility classes**: Layout, spacing, typography, colors in component templates
- **Responsive utilities**: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`, `3xl:`, `4xl:`
- **Dark mode**: `dark:` prefix classes
- **Common patterns**:
  ```html
  <div class="flex flex-col items-center justify-center gap-8 lg:flex-row">
  <h2 class="text-3xl lg:text-5xl font-light text-slate-900 dark:text-slate-100">
  ```

### When Plain CSS is Necessary

1. **GSAP Animation Targets**: 
   - Styles modified by JavaScript need to exist in CSS for proper resets
   - Example: `.scroll-panel` positioning, `.background-image-layer` transforms

2. **Complex Overlays & Gradients**:
   - Multi-stop gradients with CSS variables for theme support
   - Example: `.overlay-gradient` with 5+ gradient stops

3. **CSS Variables for Runtime Modification**:
   - Overlay customization per breakpoint (lines 756-893)
   - Theme colors that change with `.dark` class

4. **Pseudo-elements (::before, ::after)**:
   - Glassmorphism border overlays (`.mobile-menu-bar::before`)
   - Nav link underline animations (`.nav-link::after`)

5. **Complex Animations**:
   - `@keyframes` for preloader, pulse effects, gradient shifts
   - CSS animations that need to run continuously

6. **Webkit-specific Properties**:
   - `-webkit-backdrop-filter`, `-webkit-mask-image`
   - Scrollbar hiding for different browsers

### Current Inconsistencies

1. **Hardcoded Colors**:
   - `#ff8c3c` (orange accent) used directly instead of CSS variable in multiple places
   - Timeline component uses literal color values

2. **Mixed Class Application**:
   - Some components use `class:list={}` Astro syntax, others use template literals
   - Example: SectionTitle uses backticks for className concatenation

3. **Button Styling**:
   - Global `.btn` styles in Layout.astro
   - Hero.astro completely overrides with `!important` declarations
   - Contact.astro redefines `.btn` styles locally

4. **Container Definition**:
   - Defined in `global.css` with responsive padding
   - Some sections add their own padding overrides

5. **Glassmorphism Values**:
   - Slightly different blur/opacity values across components
   - Skills: `blur(16px)`, About: `blur(12px)`, Navbar mobile: `blur(4px)`

---

## CRITICAL PATTERNS TO FOLLOW

### Component Structure Convention
```astro
---
// 1. Imports
import SectionTitle from './SectionTitle.astro';

// 2. TypeScript interface for props
interface Props {
  title: string;
  items?: string[];
}

// 3. Destructure props with defaults
const { title, items = [] } = Astro.props;

// 4. Any data processing
const processedItems = items.filter(Boolean);
---

<!-- 5. HTML template -->
<section id="section-id" class="section container">
  <!-- content -->
</section>

<style>
  /* 6. Scoped CSS - component-specific styles only */
</style>

<script>
  // 7. Client-side JavaScript (if needed)
</script>
```

### Animation Initialization Pattern
```javascript
// 1. Check for mobile (skip GSAP on mobile)
const isMobile = () => window.innerWidth <= 1024;

function initFeature() {
  if (isMobile()) {
    console.log('[Feature] Mobile - skipping');
    return;
  }
  // Desktop implementation
}

// 2. Initialize on DOM ready or immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFeature);
} else {
  initFeature();
}

// 3. Handle resize for mode switching
let currentMode = isMobile() ? 'mobile' : 'desktop';
window.addEventListener('resize', () => {
  const newMode = isMobile() ? 'mobile' : 'desktop';
  if (newMode !== currentMode) {
    // Kill old instances, reinitialize
    ScrollTrigger.getAll().forEach(st => st.kill());
    initFeature();
    currentMode = newMode;
  }
});
```

### Responsive Behavior Pattern
```css
/* Mobile-first base styles */
.component {
  /* Mobile styles */
}

/* Desktop enhancement */
@media (min-width: 1024px) {
  .component {
    /* Desktop styles */
  }
}
```

### Theme Support Pattern
```css
/* Light theme (default) */
.component {
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* Dark theme */
html.dark .component {
  /* Override only what changes */
}
```

### Content Loading Pattern
```typescript
// Try Content Collections first
let content = null;
try {
  content = await getCollection('collectionName');
} catch (error) {
  console.warn('Collection failed:', error);
}

// Fallback to config
const finalData = content || fallbackConfig;
```

---

## KNOWN COMPLEXITIES

### 1. Timeline Scroll Calculation
The timeline section requires extra scroll distance because it contains multiple entries that need individual scroll time. The calculation involves:
- `TIMELINE_SCROLL_UNITS × (entries - 1)` for extra scroll distance
- Stored in `data-*` attributes on `#scroll-root`
- Progress mapping adjusts when entering/leaving timeline section

### 2. Background Image Exit Animation
The background image in sections 0-1 has a sophisticated exit:
- Scale increases from 1.0 → 1.5 during section 0 (zoom in)
- TranslateX moves from 0 → -40vw during section 1 (slide left)
- Opacity fades from 1 → 0 synchronized with translateX
- Two separate overlays (full and gradient) swap during transition

### 3. Overlay Customization Per Breakpoint
The overlay gradients need different values at each breakpoint because the hero content positioning changes. There are ~100 lines of CSS variables for 8+ breakpoints in both light and dark modes.

### 4. Mobile Menu Contrast Detection
The floating mobile menu detects background luminance and adjusts its appearance:
- Samples pixel behind menu center
- Walks up DOM tree to find non-transparent background
- Adds `.light-bg` or `.dark-bg` class accordingly
- Updates on scroll with RAF throttling

### 5. Section Tolerance Zones
Section transitions use tolerance thresholds to prevent flickering:
- `SECTION_TOLERANCE = 0.25` creates a dead zone
- Only switches section when progress crosses midpoint
- Prevents rapid switching near section boundaries

### 6. Preloader + Animation Coordination
- Preloader must complete before hero animations start
- `siteready` custom event coordinates this
- Hero animations have 3s failsafe timeout
- Letter animation delays calculated cumulatively

### 7. Multiple Theme Toggles
There can be two ThemeToggle components (desktop navbar + mobile menu):
- Script handles multiple buttons with `querySelectorAll`
- Prevents duplicate initialization with `data-theme-initialized` attribute
- Both update synchronously via shared `setTheme()` function

---

*Generated from codebase analysis on January 2026*