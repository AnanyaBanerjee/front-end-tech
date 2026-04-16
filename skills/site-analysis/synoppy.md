# Synoppy.com — Design Analysis

**Captured:** 2026-04-16 via Playwright (Chromium 147, desktop 1440px + mobile 390px)
**URL:** https://synoppy.com/
**Product:** AI terminal coding agent (Next.js app, deployed to Vercel)

---

## What This Site Is

Synoppy is a dark-themed, near-black SaaS landing page for a terminal-based AI coding agent. The design achieves a premium "late-night engineering" aesthetic through aggressive use of orange (`#fb923c`) as a single warm accent against an almost-pure-black background, combined with layered ambient glow blobs, animated rising particles, and a scanline text effect on the hero headline. It reads as confident and technical without being garish. The restraint is the point.

---

## 1. Typography System

### Font Families

Three fonts loaded as self-hosted WOFF2 via `@font-face` (no Google Fonts CDN call — everything is bundled with Next.js):

| Variable | Family | Role |
|---|---|---|
| `--font-geist` | **Geist** (by Vercel) | All UI text — headings, body, nav, buttons |
| `--font-geist-mono` | **Geist Mono** | Terminal code snippets, CLI output blocks |
| `--font-caveat` | **Caveat** | Handwritten annotation accents (the curvy arrow SVG + label near hero) |

The body declares `font-family: ui-sans-serif, system-ui, sans-serif` as computed — meaning Geist is applied via CSS variables on the `<body>` class (`geist_a71539c9-module__T19VSG__variable`) following Next.js's font optimization pattern, not via a literal `font-family: "Geist"` declaration.

### Type Scale (computed at 1440px)

| Element | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| `h1` (hero) | `72px` (clamp: `2.5rem` → `3.25rem` → `4.5rem`) | 700 | `72px` (1.0) | `-2.52px` (−0.035em) |
| `h2` (section titles) | `36px` | 700 | `40px` | `-0.9px` (−0.025em) |
| `h3` (feature labels) | `15px` | 600 | `22.5px` | normal |
| Hero subtitle `p` | `19px` | 500 | `28.5px` | `-0.475px` |
| Body `p` | `16px` | 400 | `24px` | normal |
| Nav links | `14px` | 400 | `20px` | normal |
| Small labels | `12px` (`text-xs`) | 500–600 | — | `0.05em` (`tracking-wider`) |

### Typography Rules Extracted

- Tight tracking on large headings (`tracking-[-0.035em]` at hero scale) — this is mandatory for premium SaaS display type
- `leading-[1.0]` on `h1` — line height equals font size, producing a stacked "billboard" look
- Hero headline uses responsive Tailwind class `text-[2.5rem] sm:text-[3.25rem] lg:text-[4.5rem]` — not CSS `clamp()`, but a three-breakpoint manual scale
- Subtitles use `font-weight: 500` (medium), not 400 — gives the muted-color subtext enough presence
- Caveat font is purely decorative: appears on one hand-drawn annotation pointing to a specific word in the hero headline

---

## 2. Color Palette

### Base System

The entire page is built from **two chromatic poles**: near-black background and a warm orange accent. Everything else is white at varying opacity.

| Token | Value | Use |
|---|---|---|
| `--background` | `lab(0.31% 0 0)` ≈ `#050505` | Page background, footer |
| `--foreground` | `lab(91.88% 0 0)` ≈ `#ebebeb` | Primary text |
| `--muted-foreground` | `lab(47.8% 0 0)` ≈ `#737373` | Secondary text, nav links |
| `--primary` | `lab(66.6% 39.9 67.8)` ≈ `#f97316` (orange-500) | CTAs, glow sources, accent |
| `--card` | `lab(0.9% 0 0)` ≈ `#0d0d0d` | Card backgrounds |
| `--border` | `lab(100% 0 0 / 0.08)` = `rgba(white, 8%)` | Hairline borders |
| `--muted` | `lab(2.48% 0 0)` ≈ `#131313` | Muted surface fills |
| `--ring` | same as `--primary` | Focus ring |

**All colors are defined in CSS `lab()` color space** (CIE L*a*b*), which is perceptually uniform. This is a Tailwind v4 pattern — the framework stores all its palette tokens in lab() for consistent interpolation.

### White Opacity Scale (the whole palette in practice)

The page uses `white / [opacity]` extensively rather than gray shades. Key breakpoints observed:
- `white/[0.02]` → barely-visible texture separator
- `white/[0.04]` → footer top border, section hairlines
- `white/[0.05]` → hover backgrounds on nav items
- `white/[0.08]` → default borders
- `white/[0.10]` → card borders, prominent dividers
- `white/5` through `white/90` → used for text, fills, blurs across the whole UI

### Orange Opacity Scale (ambient glow system)

The primary accent `#fb923c` (Tailwind `orange-400`) appears at every opacity from 0.01 to 1.0 to create layered depth:
- `rgba(251,146,60, 0.14)` → hero top radial glow (largest blob, most spread)
- `rgba(251,146,60, 0.06)` → secondary hero glow blob
- `rgba(251,146,60, 0.5)` → conic-gradient border spin animation
- `rgba(251,146,60, 0.9)` and `1.0` → scan highlight peak on hero text
- `oklab(0.72 0.097 0.139 / 0.2)` → subtle orange tint on section glow orbs

---

## 3. Gradient Catalog

Every gradient on the page falls into one of four types:

### Type 1 — Radial Ellipse Glow (ambient atmosphere)
```css
/* Hero top glow — primary orange orb */
radial-gradient(ellipse 50% 50% at 50% 40%, rgba(251,146,60,0.14) 0%, transparent 70%)

/* Secondary diffuse glow */
radial-gradient(ellipse 60% 50% at 50% 30%, rgba(251,146,60,0.06) 0%, transparent 60%)

/* White lens flare */
radial-gradient(ellipse 60% 50% at 50% 30%, rgba(255,255,255,0.02) 0%, transparent 60%)

/* Far-field atmosphere (footer glow) */
radial-gradient(60% 40% at 50% -10%, rgba(251,146,60,0.04), transparent)
```

### Type 2 — Conic Gradient (animated spinning border)
```css
/* Border spin — rotates via CSS @property --border-angle */
conic-gradient(from var(--border-angle), transparent 25%, rgba(251,146,60,0.5) 50%, transparent 75%)

/* Softer variant */
conic-gradient(from 265.775deg, transparent 20%, rgba(251,146,60,0.3) 40%, rgba(251,146,60,0.05) 60%, transparent 80%)
```

### Type 3 — Linear Sweep (text scanline effect)
```css
/* Hero headline scan animation */
linear-gradient(90deg,
  rgba(255,255,255,0.45) 0% 35%,
  rgba(251,146,60,0.9) 48%,
  rgb(251,146,60) 50%,
  rgba(251,146,60,0.9) 52%,
  rgba(255,255,255,0.45) 65% 100%
)
/* background-size: 250% 100% — panned via animation */
```

### Type 4 — Linear Fade (section transitions)
```css
/* Fade to background at bottom of sections */
linear-gradient(to top, lab(0.31% 0 0) 0%, transparent 100%)

/* Subtle orange tint on card hover regions */
linear-gradient(to right bottom, oklab(0.72 0.097 0.139 / 0.2) 0%, oklab(0.72 0.097 0.139 / 0.05) 100%)
```

---

## 4. Animation System

### Keyframes Defined

```css
/* 1. Rise — floating particles in hero */
@keyframes rise {
  0%   { opacity: 0; transform: translateY(0px); }
  10%  { opacity: 1; }
  85%  { opacity: 1; }
  100% { opacity: 0; transform: translateY(-550px); }
}

/* 2. FadeIn — staggered section entrance */
@keyframes fadeIn {
  0%   { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0px); }
}

/* 3. SlideUp — larger entrance for content blocks */
@keyframes slideUp {
  0%   { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0px); }
}

/* 4. ScanHighlight — orange beam sweeping through hero text */
@keyframes scanHighlight {
  0%, 100% { background-position: 120% center; }
  50%       { background-position: -20% center; }
}

/* 5. BorderSpin — animated conic-gradient border */
@keyframes borderSpin {
  100% { --border-angle: 360deg; }
}

/* 6. Standard Tailwind: spin, ping, pulse */
/* 7. Sonner toast: sonner-fade-in, sonner-fade-out */
/* 8. Radix/shadcn enter/exit for modals/overlays */
```

### Animations In Use (live on page)

| Animation | Config | Element |
|---|---|---|
| `rise` | `7s–10s linear infinite`, multiple delays (0s–3s) | ~14 rising particle elements in hero |
| `fadeIn` | `0.5s–1.2s ease`, staggered | Hero h1, subtitle, badge, CTA buttons |
| `slideUp` | `1.2s ease` | Lower hero elements |
| `scanHighlight` | `4s ease-in-out infinite` | Hero headline (`.hero-scan-text`) |
| `borderSpin` | `3s linear infinite` or `6s linear infinite` | Animated ring borders on CTA button / feature cards |
| `pulse` | `2s cubic-bezier(0.4,0,0.6,1) infinite` | Live status dots (green/orange ping indicators) |
| `enter` | `0.5s` | Radix UI overlay entrance |

### Transition System

All interactive transitions use the same easing: `cubic-bezier(0.4, 0, 0.2, 1)` (Tailwind's default ease-in-out).

| Speed | Use |
|---|---|
| `0.15s` | Fast hover: color, background, border |
| `0.2s` | Scale transforms on social icon hover |
| `0.3s` | Standard interactive: buttons, links |
| `0.5s` | Nav scroll behavior (background + blur appear) |
| `0.7s` | Slower entrance reveals for section elements |
| `0.8s` | Heaviest transitions |

Staggered entrance delays are applied directly as inline Tailwind: `transition-[opacity] duration-700 delay-[100ms]`, `delay-[200ms]`, etc. up to `delay-[350ms]`.

### CSS @property (Houdini)

```css
@property --border-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}
```

This enables the `borderSpin` keyframe to animate a custom property directly, which in turn animates the `conic-gradient()`. Without `@property`, CSS cannot animate custom properties used in gradient functions. This is the key technique that makes the spinning border glow work.

### No Third-Party Motion Libraries

GSAP, Framer Motion, AOS, Lenis, and ScrollTrigger are all absent. Every animation is pure CSS. Scroll-driven reveals are likely handled by a lightweight custom IntersectionObserver in the Next.js component code (evidenced by the staggered transition delays on section children).

---

## 5. Glassmorphism and Blur Techniques

### Navbar Glass Panel
```css
background-color: rgba(8, 8, 8, 0.88);
backdrop-filter: blur(24px) saturate(180%);
-webkit-backdrop-filter: blur(24px) saturate(180%);
border: 1px solid rgba(white, 10%);
border-radius: 1rem; /* rounded-2xl */
box-shadow: 0 8px 32px rgba(0,0,0,0.3);
```
The nav starts transparent at `top: 40px` and transitions to the glass state when scrolled (`transition: all 0.5s cubic-bezier(0.4,0,0.2,1)`). Width is `95%`, max `max-w-5xl`, centered with `left: 50%; transform: translateX(-50%)` — the "floating pill" pattern.

### Card Glass (glassmorphism variant)
```css
background-color: oklab(0.10 0 0 / 0.95); /* card at 95% opacity */
backdrop-filter: blur(24px);
border: 1px solid oklab(1 0 0 / 0.10);
border-radius: 18px;
box-shadow: oklab(0 0 0 / 0.2) 0px 25px 50px -12px; /* shadow-2xl */
```

### Ambient Blur Orbs (fake depth of field)

Multiple absolutely-positioned divs with `filter: blur()` create soft colored halos:

| Blur Value | Element type |
|---|---|
| `blur(60px)` | Small corner accent glows |
| `blur(64px)` | `blur-3xl` — section background diffusion (used with `bg-primary/[0.04]`) |
| `blur(80px)` | Medium glow orbs centered in sections |
| `blur(100px)` | Large cross-section blur overlays |
| `blur(120px)` | Full-width atmosphere blobs |

These are `absolute inset-*` elements with `pointer-events-none`, `bg-primary/[0.01]` to `bg-primary/[0.04]`, placed behind section content via `z-index`.

---

## 6. Hero Section — Full Breakdown

The hero is the most technically complex section. Its structure (top to bottom):

```
<section class="relative pt-28 sm:pt-36 pb-6 px-6">

  <!-- Layer 1: Atmospheric glow system (pointer-events-none) -->
  <div class="absolute top-0 h-[500px] overflow-hidden">
    <div class="radial orange glow — 14% opacity" />       ← primary warm orb
    <div class="radial orange glow — 6% opacity" />        ← secondary diffuse orb
    <div class="radial white glow — 2% opacity" />         ← lens flare
    <div class="noise grid SVG + radial mask" />            ← subtle texture
    <div class="rising particles container">
      <!-- 14× <div class="p"> or <div class="ps"> or <div class="px"> -->
      <!-- each with random left%, animation-duration, animation-delay -->
    </div>
  </div>

  <!-- Layer 2: Content -->
  <div class="max-w-4xl mx-auto text-center">
    <div class="badge pill" />                             ← small label above headline
    <h1 class="hero-scan-text animate-[fadeIn_0.6s]">     ← scanned headline
      The AI engineer that
      <span class="text-gradient">doesn't stop.</span>    ← gradient text span
      <svg class="curly arrow annotation" />              ← Caveat font + SVG arrow
    </h1>
    <p class="animate-[fadeIn_0.75s]">...</p>             ← subtitle
    <div class="CTA buttons row" />                       ← primary + secondary CTAs
  </div>

  <!-- Layer 3: Product demo (video or screenshot) -->
  ...
</section>
```

### Rising Particles (detail)

Three particle sizes defined in inline `<style>` block:
```css
.p   { width: 2px;   height: 40px; opacity: 0.25; background: linear-gradient(transparent, rgba(251,146,60,0.5), transparent); }
.ps  { width: 1.5px; height: 24px; opacity: 0.3;  background: linear-gradient(transparent, rgba(251,146,60,0.45), transparent); }
.px  { width: 1px;   height: 12px; opacity: 0.3;  background: linear-gradient(transparent, rgba(255,255,255,0.5), transparent); }
```
All three types use the same `rise` keyframe but with randomized `animation-duration` (3.5s–10s) and `animation-delay` (0s–3s) applied as inline styles. The particles travel `translateY(-550px)` and fade in/out. The mix of orange and white particles creates the impression of embers rising from heat.

### Scan Text Effect (detail)

The `.hero-scan-text` class applies a 250%-wide gradient that pans left via `scanHighlight`:
```css
.hero-scan-text {
  -webkit-text-fill-color: transparent;
  background: linear-gradient(90deg,
    rgba(255,255,255,0.45) 0% 35%,
    rgba(251,146,60,0.9) 48%,
    rgb(251,146,60) 50%,
    rgba(251,146,60,0.9) 52%,
    rgba(255,255,255,0.45) 65% 100%
  ) 0 0 / 250% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: 4s ease-in-out infinite scanHighlight;
}
```
Result: a warm orange "beam" sweeps through the otherwise white headline text in a continuous slow loop. The text stays legible because white opacity is maintained at 45% outside the beam zone.

### Noise Texture Overlay

An SVG data URI inline pattern:
```svg
<svg width='60' height='60' viewBox='0 0 60 60'>
  <g fill='none' stroke='#ffffff' stroke-opacity='0.03' stroke-width='0.5'>
    <path d='M0 0h60v60H0z'/>
  </g>
</svg>
```
Applied as `background-image` on a full-viewport overlay, with a `mask-image` radial gradient so the grid only appears in the center and fades at edges:
```css
mask-image: radial-gradient(ellipse 60% 70% at 50% 40%, black 0%, transparent 70%);
```
The grid lines are white at 3% opacity — invisible individually but creates a barely-perceptible crystalline depth on close inspection.

---

## 7. Navigation

```
position: fixed
left: 50%; transform: translateX(-50%)
width: 95%; max-width: 1024px (max-w-5xl)
top: 40px
z-index: 50
transition: all 0.5s cubic-bezier(0.4,0,0.2,1)
```

**Inner pill container:**
```
border-radius: 1rem (rounded-2xl)
border: 1px solid rgba(white, 10%)
background: rgba(8,8,8,0.88)
backdrop-filter: blur(24px) saturate(180%)
box-shadow: 0 8px 32px rgba(0,0,0,0.3)
height: 56px (h-14)
padding: 0 24px
```

**Contents:** Logo (26×26 image + "Synoppy" text) left — nav links centered — "Sign in" + "Get started" CTA right.

**CTA button style:** Filled orange button, `bg-primary`, sharp `rounded-lg` (not pill), `px-4 py-2`, `text-sm font-semibold`.

**Nav links:** `text-muted-foreground`, `hover:text-foreground`, `hover:bg-white/5`, `rounded-lg`, `transition-colors` 0.15s.

**Separator:** 1px vertical line `bg-border/50` between nav links and auth buttons.

**Mobile:** Hamburger icon (Lucide `Menu`) appears below `md:` breakpoint. No data captured on drawer behavior.

---

## 8. CTA Buttons

### Primary CTA — "Start free trial"
```
Large circular button (w-16 h-16 sm:w-20 sm:h-20)
shape: rounded-full
background: bg-primary/90 (orange at 90%)
hover: bg-primary (full orange)
icon: Lucide Play (filled black)
box-shadow: oklab(primary / 0.4) 0px 10px 30px (orange glow shadow)
```

### Secondary CTA — Text link style
```
px-4 py-2; rounded-lg
bg-white/[0.06]; hover:bg-white/[0.1]
text-foreground/80; text-sm font-medium
transition: 0.2s
```

### Animated Border CTA (spinning ring variant)
Uses CSS `@property --border-angle` + `borderSpin` animation:
```css
/* Outer wrapper */
position: relative; border-radius: 0.625rem;
background: conic-gradient(from var(--border-angle),
  transparent 25%, rgba(251,146,60,0.5) 50%, transparent 75%);
animation: borderSpin 3s linear infinite;
padding: 1px; /* border width is 1px via padding trick */

/* Inner fill */
background: rgba(8,8,8,0.97);
border-radius: calc(0.625rem - 1px);
```

---

## 9. Section Layout System

All sections use a consistent spacing system:

| Pattern | Value |
|---|---|
| Section vertical padding | `py-24` (96px) or `py-28` (112px) or `py-32` (128px) |
| Section horizontal padding | `px-6` (24px) on all screen sizes |
| Max content width | `max-w-4xl` (896px) or `max-w-5xl` (1024px) or `max-w-6xl` (1152px) |
| Content centering | `mx-auto` |
| `scroll-mt` for anchor links | `scroll-mt-20` (80px, accounts for fixed nav height) |

The layout system is pure flexbox + CSS Grid via Tailwind. No custom grid framework. Footer uses `grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12`.

---

## 10. Page Section Order

| # | ID/Anchor | Purpose |
|---|---|---|
| 1 | (hero) | Hero: headline + scan effect + particles + CTA + demo video |
| 2 | `#compare` | Comparison: "Same models. Better engineering." — differentiation vs Cursor, Copilot |
| 3 | — | Under-the-hood technical deep dive: "Engineered, not wrapped." |
| 4 | — | How it works: 5-step numbered flow ("One prompt. Five steps. Working code.") |
| 5 | — | Model picker: "11 models. 3 providers. One terminal." |
| 6 | — | Social proof / testimonials: "Developers who switched aren't going back" |
| 7 | — | API keys CTA: "Have API keys? Unlimited usage." |
| 8 | — | Final CTA: "Ready to ship?" — trial offer |
| 9 | — | Footer (grid: logo + links + social icons) |

---

## 11. Cards and Component Patterns

### Feature Comparison Card
```
bg-card/95 (near-black at 95%)
backdrop-blur-xl (24px)
border: 1px solid white/10
border-radius: 18px (rounded-2xl)
box-shadow: shadow-2xl shadow-black/20
padding: 24px
```

### Terminal / Code Block
```
bg-[rgba(12,12,12,0.99)]
border: 1px solid white/8
border-radius: 11px sm:15px (rounded-[11px])
overflow-hidden
font-family: Geist Mono
```

MacOS traffic-light dots rendered as real elements:
- Red: `rgb(255,95,87)` — the actual macOS red
- Yellow: `rgb(254,188,46)` — the actual macOS yellow
- Green: `rgb(40,200,64)` — the actual macOS green

### Product Demo Video Container
```
border-radius: rounded-xl sm:rounded-2xl
border: 1px solid white/[0.06]
overflow-hidden
box-shadow: shadow-black/50
```
Video has custom controls: Play/pause button (orange circle, Lucide Play filled black), mute toggle, fullscreen — all built from scratch with Lucide icons.

### Testimonial Cards
```
bg-white/[0.02] or bg-white/[0.03]
border: 1px solid white/[0.05]
border-radius: rounded-2xl
padding: p-6
```
Small author avatar (circular), name, handle, quote text. No photo large-format testimonials — just compact tight cards.

### Section Label / Eyebrow
Small uppercase badge above section headings:
```
text-xs font-medium tracking-wider
text-primary/70 (orange at 70%)
bg-primary/[0.08] (orange at 8%)
border: 1px solid primary/[0.2]
border-radius: rounded-full
padding: px-3 py-1
```

---

## 12. Footer

```html
<footer class="relative border-t border-white/[0.04] bg-background">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
      <!-- col-span-2: Logo + tagline + social icons -->
      <!-- col-span-1 each: Product / Resources / Legal / Company links -->
    </div>
  </div>
</footer>
```

Social icons: `p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:scale-110 transition-all duration-200` — subtle square pill shape with scale hover.

Copyright line: small, muted, at bottom.

---

## 13. Unique Techniques — Replication Notes

These are the specific techniques that make the site feel distinct. Ranked by visual impact:

### 1. Orange Radial Glow System (highest impact)
Stack 3+ `absolute` divs at `pointer-events-none` above the first section. Use `radial-gradient(ellipse X% Y% at 50% Z%, rgba(accent,opacity), transparent)`. Start with the largest, highest-opacity blob at `40%` Y position, add a secondary smaller one, add a white "lens" layer at 2% opacity. The overlap of warm orange + cool white creates the impression of a real light source.

### 2. Floating Island Nav
`position: fixed; left: 50%; transform: translateX(-50%); width: 95%; max-width: 1024px; top: 40px`. Starts transparent, transitions to `blur(24px) saturate(1.8) + rgba(8,8,8,0.88)` on scroll. The floating gap between nav and viewport edge is essential — it separates the nav visually from being a traditional sticky bar.

### 3. Animated Conic Border with CSS @property
`@property --border-angle` + `conic-gradient(from var(--border-angle), ...)` + `@keyframes { to { --border-angle: 360deg } }`. Apply as `background` on the outer wrapper, use `padding: 1px` to expose it as a border, put the real background on an inner element. Produces a glowing rotating border that is pure CSS.

### 4. Scan Text Effect
`-webkit-text-fill-color: transparent` + `background-clip: text` + a 250%-wide gradient + animation that pans `background-position` from `120%` to `-20%`. The key is the gradient includes both white (for legibility) and the accent color (for the beam), and the `background-size: 250% 100%` gives the illusion of the beam sweeping across.

### 5. Rising Particles
Thin vertical `<div>` elements (1–2px wide, 12–40px tall), `border-radius: 2px`, with a `linear-gradient(transparent, rgba(accent, opacity), transparent)` background. Positioned `absolute; bottom: 0` inside a `overflow-hidden` container. Animated with `rise` keyframe (`translateY(-550px)`) at varying durations (3.5–10s) and delays. Mix orange and white particles at different sizes for variety.

### 6. Grid Noise Texture
Inline SVG as `background-image` with tiny `stroke-opacity: 0.03` grid lines (3% white). Masked with a radial gradient so it only appears in the visible center area. Invisible on casual inspection, but adds micro-texture that prevents the background from looking flat.

### 7. Staggered Fade Entrances
No library needed. Apply `opacity-0` + `translate-y-2` as initial state, then use IntersectionObserver to toggle a `visible` class that sets `opacity-1 translate-y-0 transition-[opacity,transform] duration-700`. Delay each child with `transition-delay: 0ms, 70ms, 140ms, 210ms, 280ms, 350ms`. The effect feels organic because timing is consistent but moderate (700ms, not 300ms or 1500ms).

### 8. Geist + Caveat Pairing
The handwritten Caveat font appears exactly once, on a small annotation. Its presence is the entire point — it creates human warmth in what is otherwise a very mechanical design system. The SVG dashed arrow (`stroke-dasharray="5 4"`) next to it reinforces the hand-drawn quality.

---

## 14. CSS Techniques Inventory

| Technique | Where Used |
|---|---|
| CSS `lab()` and `oklab()` color functions | All color tokens (Tailwind v4 default) |
| `@property` + Houdini | Animated conic gradient border |
| `backdrop-filter: blur() saturate()` | Navbar glass panel |
| `backdrop-filter: blur(24px)` | Content cards |
| `filter: blur(60px–120px)` | Ambient glow orbs |
| `-webkit-text-fill-color: transparent` + `background-clip: text` | Scan text + gradient text spans |
| `background-size: 250% 100%` + animated `background-position` | Scan animation |
| `mask-image: radial-gradient(...)` | Noise texture crop |
| `conic-gradient(from var(--angle), ...)` | Rotating border |
| CSS `animation-delay` inline style | Particle timing variation |
| Staggered `transition-delay` | Scroll entrance reveals |
| `scroll-mt-*` | Anchor offset for fixed nav |
| `overscroll-behavior` | Not detected (would be in mobile drawer) |
| CSS Grid `grid-cols-2 md:grid-cols-6` | Footer layout |
| `clamp()` | Not used — three-breakpoint manual scale instead |
| CSS variables for spacing/radius (`--radius: 0.625rem`) | shadcn/ui design token system |
| `font-display: swap` | All self-hosted fonts |

---

## 15. Stack

- **Framework:** Next.js (App Router) with React Server Components
- **Styling:** Tailwind CSS v4 (lab() color space, CSS variables, no config file)
- **Component library:** shadcn/ui (evidenced by `--radius`, `--card`, `--border` tokens and Radix `enter`/`exit` keyframes)
- **Icons:** Lucide React
- **Toast notifications:** Sonner
- **Analytics:** Google Tag Manager + Twitter pixel
- **Chat support:** Crisp
- **Deployment:** Vercel (Next.js native)

---

## 16. How to Replicate This Quality in Plain HTML

The site's premium feel comes from five decisions that can be replicated without React:

1. **Black background, one orange accent, nothing else.** Don't add blue, purple, or green. Trust the restraint.

2. **Ambient glow blobs in every section header.** Three absolutely-positioned divs, radial-gradient from orange to transparent, pointer-events-none. Use `filter: blur(80px)` instead of `backdrop-filter` for the blobs (different effect).

3. **Floating pill nav with blur.** `position: fixed; left: 50%; transform: translateX(-50%); top: 40px; width: 95%; max-width: 1024px`. Add `backdrop-filter: blur(24px)` and `background: rgba(8,8,8,0.88)` via a `.scrolled` class toggled by a small JS scroll listener.

4. **Tight negative letter-spacing on display text.** `letter-spacing: -0.035em` on the hero h1. `letter-spacing: -0.025em` on h2s. This single change makes headings feel premium.

5. **Stagger your reveals at 70ms intervals, 700ms duration.** Intersection Observer, no library. Fade + slide up 10px. Keep the delay total under 500ms for the first 5 elements so the page doesn't feel slow.

The scan text and spinning border are great for a primary CTA or hero headline, but they require careful restraint — use on at most one element each.
