---
name: animate
description: "Review a feature and enhance it with purposeful animations, micro-interactions, and motion effects that improve usability and delight. Use when the user mentions adding animation, transitions, micro-interactions, motion design, hover effects, or making the UI feel more alive."
argument-hint: "[target]"
user-invocable: true
---

Analyze a feature and strategically add animations and micro-interactions that enhance understanding, provide feedback, and create delight.

## MANDATORY PREPARATION

Invoke {{command_prefix}}impeccable — it contains design principles, anti-patterns, and the **Context Gathering Protocol**. Follow the protocol before proceeding — if no design context exists yet, you MUST run {{command_prefix}}impeccable teach first. Additionally gather: performance constraints.

---

## Assess Animation Opportunities

Analyze where motion would improve the experience:

1. **Identify static areas**:
   - **Missing feedback**: Actions without visual acknowledgment (button clicks, form submission, etc.)
   - **Jarring transitions**: Instant state changes that feel abrupt (show/hide, page loads, route changes)
   - **Unclear relationships**: Spatial or hierarchical relationships that aren't obvious
   - **Lack of delight**: Functional but joyless interactions
   - **Missed guidance**: Opportunities to direct attention or explain behavior

2. **Understand the context**:
   - What's the personality? (Playful vs serious, energetic vs calm)
   - What's the performance budget? (Mobile-first? Complex page?)
   - Who's the audience? (Motion-sensitive users? Power users who want speed?)
   - What matters most? (One hero animation vs many micro-interactions?)

If any of these are unclear from the codebase, {{ask_instruction}}

**CRITICAL**: Respect `prefers-reduced-motion`. Always provide non-animated alternatives for users who need them.

## Plan Animation Strategy

Create a purposeful animation plan:

- **Hero moment**: What's the ONE signature animation? (Page load? Hero section? Key interaction?)
- **Feedback layer**: Which interactions need acknowledgment?
- **Transition layer**: Which state changes need smoothing?
- **Delight layer**: Where can we surprise and delight?

**IMPORTANT**: One well-orchestrated experience beats scattered animations everywhere. Focus on high-impact moments.

## Implement Animations

Add motion systematically across these categories:

### Entrance Animations
- **Page load choreography**: Stagger element reveals (100-150ms delays), fade + slide combinations
- **Hero section**: Dramatic entrance for primary content (scale, parallax, or creative effects)
- **Content reveals**: Scroll-triggered animations using intersection observer
- **Modal/drawer entry**: Smooth slide + fade, backdrop fade, focus management

### Micro-interactions
- **Button feedback**:
  - Hover: Subtle scale (1.02-1.05), color shift, shadow increase
  - Click: Quick scale down then up (0.95 → 1), ripple effect
  - Loading: Spinner or pulse state
- **Form interactions**:
  - Input focus: Border color transition, slight scale or glow
  - Validation: Shake on error, check mark on success, smooth color transitions
- **Toggle switches**: Smooth slide + color transition (200-300ms)
- **Checkboxes/radio**: Check mark animation, ripple effect
- **Like/favorite**: Scale + rotation, particle effects, color transition

### State Transitions
- **Show/hide**: Fade + slide (not instant), appropriate timing (200-300ms)
- **Expand/collapse**: Height transition with overflow handling, icon rotation
- **Loading states**: Skeleton screen fades, spinner animations, progress bars
- **Success/error**: Color transitions, icon animations, gentle scale pulse
- **Enable/disable**: Opacity transitions, cursor changes

### Navigation & Flow
- **Page transitions**: Crossfade between routes, shared element transitions
- **Tab switching**: Slide indicator, content fade/slide
- **Carousel/slider**: Smooth transforms, snap points, momentum
- **Scroll effects**: Parallax layers, sticky headers with state changes, scroll progress indicators
- **GSAP Scroll-Pin Feature Walkthrough:** Freeze the viewport for an entire scroll zone while the user scrolls through product steps. Use `ScrollTrigger.create({ pin: true })` on the section wrapper. Within the pinned zone, show sequential `.step` panels at the same screen coordinates — the user sees steps 1 → 2 → 3 without the page visually moving. Scroll distance consumed = `number_of_steps × viewport_height`. A `pin-spacer` div handles layout displacement automatically. Add a pill nav strip so the user always knows their position. **CRITICAL:** Never use `window.addEventListener('scroll')` — use ScrollTrigger's `onUpdate` callback.

### Feedback & Guidance
- **Hover hints**: Tooltip fade-ins, cursor changes, element highlights
- **Drag & drop**: Lift effect (shadow + scale), drop zone highlights, smooth repositioning
- **Copy/paste**: Brief highlight flash on paste, "copied" confirmation
- **Focus flow**: Highlight path through form or workflow

### Delight Moments
- **Empty states**: Subtle floating animations on illustrations
- **Completed actions**: Confetti, check mark flourish, success celebrations
- **Easter eggs**: Hidden interactions for discovery
- **Contextual animation**: Weather effects, time-of-day themes, seasonal touches

## Technical Implementation

Use appropriate techniques for each animation:

### Timing & Easing

**Durations by purpose:**
- **100-150ms**: Instant feedback (button press, toggle)
- **200-300ms**: State changes (hover, menu open)
- **300-500ms**: Layout changes (accordion, modal)
- **500-800ms**: Entrance animations (page load)

**Easing curves (use these, not CSS defaults):**
```css
/* Recommended - natural deceleration */
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);    /* Smooth, refined */
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);   /* Slightly snappier */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);     /* Confident, decisive */

/* AVOID - feel dated and tacky */
/* bounce: cubic-bezier(0.34, 1.56, 0.64, 1); */
/* elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6); */
```

**Exit animations are faster than entrances.** Use ~75% of enter duration.

### CSS Animations
```css
/* Prefer for simple, declarative animations */
- transitions for state changes
- @keyframes for complex sequences
- transform + opacity only (GPU-accelerated)
```

### JavaScript Animation
```javascript
/* Use for complex, interactive animations */
- Web Animations API for programmatic control
- Framer Motion for React
- GSAP for complex sequences
```

### Performance
- **GPU acceleration**: Use `transform` and `opacity`, avoid layout properties
- **will-change**: Add sparingly for known expensive animations
- **Reduce paint**: Minimize repaints, use `contain` where appropriate
- **Monitor FPS**: Ensure 60fps on target devices

### Accessibility
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**NEVER**:
- Use bounce or elastic easing curves—they feel dated and draw attention to the animation itself
- Animate layout properties (width, height, top, left)—use transform instead
- Use durations over 500ms for feedback—it feels laggy
- Animate without purpose—every animation needs a reason
- Ignore `prefers-reduced-motion`—this is an accessibility violation
- Animate everything—animation fatigue makes interfaces feel exhausting
- Block interaction during animations unless intentional

## Verify Quality

Test animations thoroughly:

- **Smooth at 60fps**: No jank on target devices
- **Feels natural**: Easing curves feel organic, not robotic
- **Appropriate timing**: Not too fast (jarring) or too slow (laggy)
- **Reduced motion works**: Animations disabled or simplified appropriately
- **Doesn't block**: Users can interact during/after animations
- **Adds value**: Makes interface clearer or more delightful

Remember: Motion should enhance understanding and provide feedback, not just add decoration. Animate with purpose, respect performance constraints, and always consider accessibility. Great animation is invisible - it just makes everything feel right.

---

## Signature Dark Hero Techniques

Five pure-CSS techniques for building premium dark landing page heroes. No GSAP, no Framer Motion — all CSS. Use these when the design calls for a near-black background with a single accent color.

### 1. Radial Glow Stack (warm light source)
Stack 3 `pointer-events-none` divs with `radial-gradient(ellipse ... at 50% 40%, rgba(accent, N), transparent)` at 14%, 6%, and 2% opacity. Positioned absolutely behind the hero content. Creates a convincing warm light source without any images or JS.

```css
/* Layer 1 — widest, lowest opacity */
background: radial-gradient(ellipse 80% 50% at 50% 40%, rgba(251,146,60,0.14), transparent);
/* Layer 2 — tighter */
background: radial-gradient(ellipse 50% 35% at 50% 40%, rgba(251,146,60,0.06), transparent);
/* Layer 3 — core glow */
background: radial-gradient(ellipse 30% 20% at 50% 40%, rgba(251,146,60,0.02), transparent);
```

All three layers: `position: absolute; inset: 0; pointer-events: none;`

---

### 2. Animated Conic Border (spinning glow ring)
Uses CSS Houdini `@property` to animate a `conic-gradient()` as a rotating border. The outer element holds the gradient; 1px of padding exposes it as the border. Requires a `background-clip: content-box` inner fill.

```css
@property --border-angle {
  syntax: '<angle>';
  initial-value: 0turn;
  inherits: false;
}

.conic-border {
  background:
    conic-gradient(from var(--border-angle), transparent 75%, rgba(251,146,60,0.8) 90%, transparent 100%)
    border-box;
  animation: spin-border 3s linear infinite;
}

@keyframes spin-border {
  to { --border-angle: 1turn; }
}
```

Wrap the inner content in a child element with `background: var(--bg-color); border-radius: inherit; margin: 1px;` to expose exactly 1px of the spinning gradient as the visible border.

---

### 3. Scan Text / Beam Sweep
An accent-colored beam sweeps through headline text on a loop. Pure CSS — no JS.

```css
.scan-text {
  background: linear-gradient(
    105deg,
    rgba(255,255,255,0.9) 0%,
    rgba(255,255,255,0.9) 40%,
    rgba(251,146,60,1) 50%,
    rgba(255,255,255,0.9) 60%,
    rgba(255,255,255,0.9) 100%
  );
  background-size: 250% 100%;
  background-position: 120% center;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: beam-sweep 4s ease-in-out infinite;
}

@keyframes beam-sweep {
  0%   { background-position: 120% center; }
  50%  { background-position: -20% center; }
  100% { background-position: 120% center; }
}
```

Apply only to the hero `<h1>`. Do not use on body text — the effect loses impact when repeated.

---

### 4. Rising Ember Particles (pure CSS)
14 thin `<div>` elements styled as embers, animated upward with `translateY`. Mix of accent and white particles at randomized sizes and delays creates depth without JS.

```html
<!-- Repeat 14x with varying --delay and --duration custom props -->
<div class="particle" style="--delay: 1.2s; --duration: 6s; --x: 30%; --size: 1px; --height: 24px;"></div>
```

```css
.particle {
  position: absolute;
  bottom: 0;
  left: var(--x);
  width: var(--size);
  height: var(--height);
  background: linear-gradient(transparent, rgba(251,146,60,0.8), transparent);
  border-radius: 99px;
  animation: rise var(--duration) ease-in var(--delay) infinite;
  pointer-events: none;
}

@keyframes rise {
  0%   { transform: translateY(0); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(-550px); opacity: 0; }
}
```

Use white particles (`rgba(255,255,255,0.4)`) for roughly 4 of the 14 to vary the ember mix. Randomize `--delay` between `0s` and `8s`, `--duration` between `3.5s` and `10s`, `--x` between `10%` and `90%`, `--height` between `12px` and `40px`.

---

### 5. Grid Noise Texture (anti-flat black)
An inline SVG grid at near-zero opacity cropped by a radial mask. Invisible individually, but prevents large dark backgrounds from looking flat or void-like.

```css
.grid-noise {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M40 0H0v40' stroke='white' stroke-opacity='0.03' stroke-width='0.5'/%3E%3C/svg%3E");
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 100%);
  mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 100%);
  position: absolute;
  inset: 0;
  pointer-events: none;
}
```

The radial mask means the grid is only visible at the hero center — edges fade to nothing. Adjust `stroke-opacity` between `0.02` and `0.05` to taste.

---

### When to use these together
These five techniques are designed to layer. A complete dark SaaS hero typically uses all five simultaneously:
- Grid noise as the base layer (z-index 0)
- Radial glow stack above it (z-index 1)
- Particles floating above both (z-index 2)
- Hero content with scan text (z-index 10)
- Conic border on key components (cards, CTAs, input fields)
