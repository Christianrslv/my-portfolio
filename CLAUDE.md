# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website built with Astro, featuring a sophisticated scroll-based animation system using GSAP and Tailwind CSS for styling. The portfolio displays information across multiple sections (Hero, About, Skills, Projects, Timeline, Contact) with different behaviors on desktop vs mobile.

## Commands

Development:
```bash
npm run dev          # Start dev server at localhost:4321
npm run build        # Build production site to ./dist/
npm run preview      # Preview production build locally
```

## Architecture

### Content Management System

The portfolio uses a dual-content strategy:

1. **Primary: Astro Content Collections** (`src/content/`)
   - Markdown-based content stored in `src/content/` organized by type: `portfolio/`, `about/`, `projects/`, `skills/`, `contact/`, `timeline/`
   - Schema definitions in `src/content/content.config.ts` using Zod for validation
   - Content loaded via `src/utils/content.ts` using `getCollection()`

2. **Fallback: TypeScript Config** (`src/data/config.ts`)
   - If Content Collections fail to load, the site falls back to static config in `portfolioConfig`
   - The main page (`src/pages/index.astro`) tries Content Collections first, then falls back to config

### Scroll Experience System

**Desktop (>1024px):**
- Custom GSAP-based scroll experience with pinned sections
- Sections transition in/out with discrete switching using tolerance thresholds
- Background image with zoom and exit animations controlled by scroll progress
- Overlay system that transitions from full to gradient overlay during Hero section
- Timeline section has extended scroll units for horizontal progress
- All scroll calculations in `src/pages/index.astro` inline `<script>` tag

**Mobile (≤1024px):**
- CSS-based card stacking effect (no GSAP)
- Sections 0-1 (Hero, About) use transparent backgrounds with fixed background image
- Section 2+ (Skills onward) use sticky positioning with card-like appearance
- Background fade logic in `initMobileBackgroundFade()` function

### Component Architecture

**Main Layout:** `src/layouts/Layout.astro`
- Global styles, theme management, preloader
- Fonts: Libre Baskerville (headings), Inter (body), JetBrains Mono (code)
- CSS custom properties for theming in `:root` and `html.dark`

**Page Structure:** `src/pages/index.astro`
- All sections are in a single page
- Wrapped in `#scroll-root` > `.scroll-stage` > `.scroll-panel` elements
- Each section has an ID (home, about, skills, projects, timeline, contact)
- Complex scroll logic with GSAP ScrollTrigger for desktop
- Background layers: `.base-background`, `.background-image-layer`, `.overlay-full`, `.overlay-gradient`

**Key Components:**
- `Hero.astro` - Landing section with greeting, name, role, buttons
- `About.astro` - About paragraphs with optional profile image
- `Skills.astro` - Displays skill categories
- `Projects.astro` - Project cards with tech stack
- `HorizontalTimeline.astro` - Timeline with horizontal progress bar and content panels
- `Navbar.astro` - Navigation with theme toggle
- `ThemeToggle.astro` - Dark/light mode switcher
- `ScrollIndicator.astro` - Visual indicator for scroll progress

### Timeline System

Timeline entries in `src/content/timeline/*.md` are loaded by `src/utils/timeline.ts`:
- Each entry has: `date`, `title`, `category`, `icon`, `featured`
- Sorted chronologically
- Can be filtered to featured only
- Timeline progress synced with scroll via custom events (`timelineprogress`)

### Styling System

**Tailwind CSS v4** via Vite plugin (`@tailwindcss/vite`)
- Global styles in `src/styles/global.css` (imported in Layout.astro)
- Theme variables in `src/layouts/Layout.astro` using CSS custom properties
- Responsive breakpoints: xs(480), sm(640), md(768), lg(1024), xl(1280), 2xl(1536), 3xl(1920), 4xl(2560)
- Overlay customization via CSS variables for different breakpoints

**Theme Support:**
- Light and dark themes via `html.dark` class
- Theme persisted in localStorage
- Inline script in Layout.astro applies theme before paint to avoid FOUC

### Animation Utilities

- `src/utils/animations.ts` - GSAP-based reveal animations
- `src/utils/scrollReveal.ts` - Scroll-based reveal effects
- `src/utils/timeline.ts` - Timeline data loading and formatting

## Key Implementation Details

### Adding New Sections

1. Create content in `src/content/[collection-name]/`
2. Define schema in `src/content/content.config.ts`
3. Create component in `src/components/`
4. Add to `src/pages/index.astro` as a new `.scroll-panel` section
5. Update `ScrollIndicator` totalSections prop if needed
6. Adjust scroll calculations if the section needs custom scroll behavior

### Modifying Scroll Behavior

Desktop scroll constants in `src/pages/index.astro`:
- `SECTION_SCROLL_UNITS` (0.80) - scroll distance per section
- `TIMELINE_SCROLL_UNITS` (0.75) - scroll distance per timeline entry
- `SECTION_TOLERANCE` (0.25) - dead zone for section transitions
- `BACKGROUND_IMAGE_END_SECTION` (2) - when to hide background image

Mobile scroll behavior in CSS media query `@media (max-width: 1024px)` section of index.astro.

### Background Image & Overlays

Background image controlled via frontmatter in `src/content/portfolio/hero.md`:
```yaml
backgroundImage: "/images/background.jpg"
```

Overlay customization via CSS variables in index.astro:
- `--overlay-color` - RGB values for overlay color
- `--full-*` variables for Section 0 full overlay
- `--grad-*` variables for Section 1 gradient overlay
- Different values per breakpoint for responsive design

### Content Collections

To modify content, edit markdown files in `src/content/`:
- Each collection has a schema in `content.config.ts`
- Frontmatter for structured data, body for markdown content
- See `src/content/README.md` for detailed editing instructions

## Common Patterns

**Conditional Content Loading:**
The site tries multiple content loading strategies to ensure robustness. Always maintain this fallback pattern when adding new content types.

**Responsive Design:**
Always implement both desktop GSAP scroll and mobile card-stacking behavior when adding sections. Mobile uses CSS-only approach for performance.

**Theme Colors:**
Use CSS custom properties (`var(--bg-primary)`, `var(--text-primary)`, etc.) instead of hardcoded colors to maintain theme consistency.

**GSAP ScrollTrigger:**
Desktop scroll experience uses a single ScrollTrigger instance that controls all section transitions. Modifying scroll behavior requires understanding the `updateProgress()` and `onUpdate` callback logic.
