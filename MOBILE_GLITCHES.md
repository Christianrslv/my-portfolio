# Mobile Glitches — Analysis & Hypotheses

Analyzed from screen recording on Samsung S23 Ultra, Chrome Android.
Video frames extracted and reviewed frame-by-frame.

---

## Glitch 1: Content Bleeding Through During Slide Transitions

### What happens
During the Swiper creative effect transition, the **previous slide's content is visible behind the incoming slide**. Most obvious when transitioning FROM Home/About (which have transparent backgrounds with the background image visible) TO card slides (Skills, Projects, etc.).

### Frames where it's visible
- Home → About transition: previous slide text visible behind incoming slide
- About → Skills transition: "About Me" text and background image bleed through behind the Skills card
- Skills → Projects transition: Skills content briefly visible behind Projects card
- Timeline → Contact transition: Timeline header visible behind Contact card

### Hypotheses

**H1: Card slides don't fully cover the previous slide during the creative effect animation**
The creative effect uses `translate3d` to slide the incoming card up from below. During the animation, both the current and next slides are visible. If the incoming slide doesn't have a fully opaque background covering its ENTIRE area (including the rounded top corners), the previous slide shows through.

- Check: `.mobile-swiper-active .swiper-slide#skills`, `#projects`, `#contact` all have `background: var(--bg-primary) !important` but the creative effect might expose a gap at the top during the slide-in animation.
- Fix: Ensure card slides have a solid background that extends ABOVE the visible area (e.g., using a `::before` pseudo-element with extra height and solid background color that covers the gap during transition).

**H2: The `swiper-slide-shadow` layers are too subtle**
The creative effect generates shadow layers (`.swiper-slide-shadow-left`, `.swiper-slide-shadow-right`, `.swiper-slide-shadow`) between slides. Currently these are set to very low opacity:
```css
.mobile-swiper-active .swiper-slide-shadow { background: rgba(0,0,0,0.05) !important; opacity: 0.5; }
```
This makes the "seam" between slides nearly invisible, allowing content to bleed through.

- Fix: Increase shadow opacity significantly, or replace with a solid color that matches the card background.

**H3: The creative effect `prev` configuration doesn't hide the previous slide fast enough**
In the Swiper creative effect config, the `prev` slide transform might keep it visible too long. The `opacity` in the prev config might not go to 0, or the transition timing doesn't align with the next slide covering it.

- Check: `getSwiperConfig()` in `index.astro` — look at the `creativeEffect.prev` settings
- Fix: Set `prev.opacity: 0` or add `prev.translate: [0, '-100%', 0]` to push it out of view faster.

**H4: Home and About slides have transparent backgrounds by design**
These slides use `background: transparent` so the background image shows through. During transitions FROM these slides, their content (text, stats) remains visible behind the incoming card. Unlike card slides which have `var(--bg-primary)` backgrounds, Home/About rely on the background image layer.

- Fix: During the transition animation, hide the content of the departing slide. Could use Swiper's `slideChangeTransitionStart` event to add a class that fades out the departing slide's content immediately.

---

## Glitch 2: Ghostly/Faded Text on Projects (Ventures Tab)

### What happens
When switching to the "Ventures" tab on the Projects page, the project card content ("Mobile App") appears extremely faded/ghostly — almost invisible text on a nearly-transparent card.

### Hypotheses

**H1: Nested Swiper carousel opacity issue**
When switching tabs, a new Swiper carousel becomes visible. The `fadeIn` animation on `.project-panel-mobile.active` might interact poorly with the nested Swiper's initial render state.

- Check: The `@keyframes fadeIn` animation in `Projects.astro` starts at `opacity: 0; transform: translateY(10px)`.
- Fix: Ensure the carousel's slides have `opacity: 1` explicitly after the tab becomes active. May need to call `carousel.swiper.update()` with a longer delay.

**H2: The nested Swiper hasn't initialized/rendered when the tab switches**
The Ventures carousel might not be fully initialized when its panel becomes visible. Swiper needs the container to be visible to calculate dimensions.

- Check: `initProjectTabs()` calls `carousel.swiper?.update()` with a 50ms timeout. This might not be enough.
- Fix: Increase the timeout, or re-initialize the nested Swiper when the tab activates.

**H3: CSS transition conflict between tab animation and Swiper**
The tab panel uses `animation: fadeIn 0.4s ease` which affects `opacity` and `transform`. This might conflict with Swiper's own transform-based positioning of carousel slides.

- Fix: Remove the fadeIn animation from mobile panels, or ensure it doesn't affect nested Swiper elements.

---

## Glitch 3: Pull-to-Refresh Still Appearing

### What happens
Despite `overscroll-behavior: none` being set, Chrome's native "Pull to refresh" gesture still triggers when on the first slide (Home) and swiping down.

### Hypotheses

**H1: `overscroll-behavior` not applied at the right level**
The property is set on `html.mobile-swiper-active-html` and `body.mobile-swiper-active-body`, but Chrome might need it on the actual scrolling element or the root element before Swiper initializes.

- Fix: Set `overscroll-behavior: none` on `html` and `body` unconditionally on mobile (not just when Swiper is active), using a media query.

**H2: Swiper's touch handling allows the gesture to propagate**
Swiper might not be `preventDefault()`-ing the touchmove events on the first slide when swiping down (since there's no previous slide to go to). Chrome interprets this as a page scroll and triggers pull-to-refresh.

- Check: Swiper's `touchMoveStopPropagation` and `preventInteractionOnTransition` settings.
- Fix: Add `touchStartPreventDefault: true` to Swiper config, or add a manual `touchmove` listener on the first slide that calls `preventDefault()` for downward swipes.

**H3: The Chrome trick attempt left stale state**
The removed Chrome address bar trick temporarily set `overflow: auto` on the body. If the cleanup didn't run properly before being removed, there might be stale state.

- Fix: Ensure no leftover styles. This should be clean now after our cleanup, but worth verifying.

---

## Glitch 4: Transition Jank/Stutter

### What happens
Slide transitions aren't perfectly smooth — there's visible stutter/jank during the creative effect animation.

### Hypotheses

**H1: Too many GPU-composited layers**
Each slide has `transform: translateZ(0)`, `will-change: transform`, `backface-visibility: hidden`. Combined with backdrop-filter on some elements, the GPU is compositing many large layers simultaneously during transitions.

- Fix: Remove `will-change: transform` from non-active slides. Only add it to the active, next, and prev slides. Remove `translateZ(0)` from slides that don't need it.

**H2: `backdrop-filter: blur()` is expensive during animation**
The About slide's glassmorphism effect (`backdrop-filter: blur(12px)`) is extremely GPU-intensive, especially when the element is being transformed during a transition.

- Fix: Disable `backdrop-filter` during transitions. Use Swiper's `slideChangeTransitionStart`/`End` events to toggle a class.

**H3: The `forceSlideChildrenHeight()` JS runs during transitions**
Our viewport fix runs `forceSlideChildrenHeight()` on `slideChange`, which does DOM reads (`getBoundingClientRect`) and writes (`setProperty`) during the transition animation, causing layout thrash.

- Fix: Debounce or delay the call further (e.g., 500ms instead of 100ms), or use `slideChangeTransitionEnd` instead of `slideChange`.

**H4: Large background images being composited**
The Home and About slides have full-screen background images (`background-image: var(--mobile-bg-image)`). During transitions, the GPU must composite these large images while also animating transforms.

- Fix: Use smaller/compressed background images for mobile. Or convert the background to a fixed layer outside the Swiper so it doesn't need to be composited per-slide.

---

## Recommended Priority Order

1. **Glitch 1** (Content bleeding) — Most visually jarring. Start with H2 (increase shadow opacity) and H3 (creative effect prev config) as quick wins.
2. **Glitch 4** (Jank) — H3 is an easy fix (delay forceSlideChildrenHeight). H1 and H2 require more testing.
3. **Glitch 3** (Pull-to-refresh) — H2 is the most likely cause. Check Swiper touch config.
4. **Glitch 2** (Ghostly text) — Likely H2. Increase the timeout for nested Swiper update.

---

## Key Files to Examine

- `src/pages/index.astro` — Main scroll logic, Swiper config (`getSwiperConfig()`), creative effect settings, mobile CSS
- `src/components/Projects.astro` — Tab switching logic, nested Swiper carousels
- `src/components/Skills.astro` — Similar nested carousel setup
- `src/components/MobileTimeline.astro` — Timeline scroll handling

## Useful Debugging Approach

For each glitch, add targeted CSS with bright colors to isolate the problem:
```css
/* Example: Make slide shadows visible to debug bleeding */
.swiper-slide-shadow { background: red !important; opacity: 1 !important; }

/* Example: Highlight the previous slide during transition */
.swiper-slide-prev { outline: 5px solid yellow !important; }
```

Then record another video and compare frames.
