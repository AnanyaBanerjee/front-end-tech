---
name: mobile
description: Optimize every web page for phone-first experience. Covers touch targets, viewport, responsive layout, font scaling, mobile nav, performance, thumb zones, and a full mobile audit checklist. Apply to every project by default — no need to ask.
---

# Mobile Optimization Skill

## Rule: Apply to Every Page by Default

Mobile is not an afterthought. Every page built using this repo must pass the full mobile checklist below without being asked. If a page looks great on desktop but breaks on a 375px screen, it is not done.

**Design order: phone → tablet → desktop. Never the other way around.**

---

## 1. Viewport & Base Setup

Every `<head>` must have exactly this meta tag — no zoom traps, no user-scalable=no:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Never use** `user-scalable=no` or `maximum-scale=1` — this breaks accessibility for users who need to zoom in.

Also add:

```html
<meta name="theme-color" content="#[your-brand-color]">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
```

---

## 2. Touch Targets

Every interactive element — buttons, links, nav items, form inputs — must be at least **44×44px** (Apple HIG minimum) and ideally **48×48px** (Material Design minimum).

**Too small (broken on phone):**
```html
<a href="/page" class="text-sm">Read more</a>
```

**Correct (44px minimum touch area):**
```html
<a href="/page" class="text-sm min-h-[44px] min-w-[44px] flex items-center px-4">Read more</a>
```

**Rules for touch targets:**
- Buttons: `min-h-[48px]` with horizontal padding ≥ `px-5`
- Nav links on mobile: wrap in `<li>` with `py-3` padding, full-width tap area
- Icon-only buttons (hamburger, close, X): surround with `p-3` wrapper, making effective area 44px+
- Form inputs: `min-h-[48px]` — never smaller
- Spacing between adjacent targets: at least 8px to prevent mis-taps

---

## 3. Responsive Typography

Type must scale down gracefully. Use fluid sizing — never fixed `px` sizes that look giant on phones.

**Pattern — clamp for headings:**
```css
h1 { font-size: clamp(2rem, 5vw + 1rem, 4.5rem); }
h2 { font-size: clamp(1.5rem, 3vw + 0.75rem, 3rem); }
h3 { font-size: clamp(1.125rem, 2vw + 0.5rem, 1.75rem); }
p  { font-size: clamp(0.9375rem, 1.5vw + 0.5rem, 1.125rem); }
```

**With Tailwind — mobile-first breakpoints:**
```html
<h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">Headline</h1>
<p class="text-base sm:text-lg leading-relaxed">Body text</p>
```

**Rules:**
- Minimum body font size on mobile: 15px (0.9375rem) — never smaller
- Line height on mobile: 1.6–1.7 for body, 1.2–1.3 for headings
- Letter spacing for all-caps labels: `tracking-wider` — easier to read on small screens
- Max line length: 65–70 characters on desktop, 45–55 on mobile (`max-w-prose` or `max-w-[55ch]`)

---

## 4. Mobile Navigation

Desktop navbars almost always break on phone. Every project needs a mobile nav pattern.

**Standard pattern — hamburger menu:**
```html
<!-- Mobile nav toggle button (top-right, 44px touch area) -->
<button id="nav-toggle"
  class="md:hidden p-3 -mr-3 rounded-lg"
  aria-label="Open menu"
  aria-expanded="false"
  aria-controls="mobile-menu">
  <svg ...hamburger icon...></svg>
</button>

<!-- Mobile menu drawer (hidden by default) -->
<div id="mobile-menu"
  class="hidden fixed inset-0 z-50 bg-[--bg] flex flex-col pt-20 px-6"
  role="dialog"
  aria-modal="true"
  aria-label="Navigation">

  <!-- Close button -->
  <button id="nav-close" class="absolute top-4 right-4 p-3" aria-label="Close menu">
    <svg ...X icon...></svg>
  </button>

  <!-- Links — full-width, large tap area -->
  <nav class="flex flex-col gap-1">
    <a href="#features" class="text-xl font-medium py-4 border-b border-[--border]">Features</a>
    <a href="#pricing" class="text-xl font-medium py-4 border-b border-[--border]">Pricing</a>
    <a href="#faq"      class="text-xl font-medium py-4 border-b border-[--border]">FAQ</a>
  </nav>

  <!-- CTA at bottom -->
  <div class="mt-auto pb-8">
    <a href="#download" class="btn-primary w-full text-center text-lg min-h-[52px] flex items-center justify-center">
      Get Started
    </a>
  </div>
</div>

<script>
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('mobile-menu');
  const close  = document.getElementById('nav-close');

  function openMenu() {
    menu.classList.remove('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // prevent scroll behind overlay
  }
  function closeMenu() {
    menu.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', openMenu);
  close.addEventListener('click', closeMenu);
  // Close on any nav link click
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  // Close on ESC
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
</script>
```

**Rules:**
- Desktop nav links: `hidden md:flex` — never visible on mobile unless intentional
- Hamburger: `md:hidden` — only visible on mobile
- Mobile menu overlay: locks body scroll while open (`overflow: hidden`)
- Mobile CTA button: always full-width (`w-full`), minimum 52px height
- Menu links: always min 48px tap height, separated by visible dividers or padding

---

## 5. Layout & Grid

**All grid layouts must collapse to 1 column on mobile:**

```html
<!-- Bento / feature grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

<!-- Two-column hero (text + image) -->
<div class="flex flex-col md:flex-row items-center gap-8 md:gap-16">
  <div class="text-center md:text-left"> <!-- text block -->
  <div class="w-full max-w-sm md:max-w-none"> <!-- image block -->

<!-- Pricing cards -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
```

**Horizontal padding — always protect content from screen edges:**
```html
<div class="px-4 sm:px-6 lg:px-8"> <!-- minimum 16px on mobile sides -->
```

**Never use fixed pixel widths** for layout containers on mobile. Use `w-full`, `max-w-*`, and `mx-auto`.

**Flex direction:** default `flex-col` on mobile, switch to `flex-row` at `md:` or larger.

---

## 6. Images & Media

```html
<!-- Every image: responsive, correct sizing, lazy loading -->
<img
  src="images/screenshot.png"
  alt="[descriptive alt text]"
  width="800"
  height="500"
  loading="lazy"
  class="w-full h-auto rounded-xl"
>

<!-- Hero image on mobile: cap it to not push content below fold -->
<img class="w-full max-w-sm mx-auto md:max-w-none h-auto" ...>
```

**Rules:**
- Always `width` + `height` attributes (prevents layout shift, improves CLS score)
- Always `loading="lazy"` on below-fold images
- Always `h-auto` — never fixed pixel heights that crop the image
- Hero images on mobile: cap at `max-w-sm` or `max-w-xs` so they don't consume the whole screen
- Logo in navbar: `h-7 w-auto` or `h-8 w-auto` — never a fixed pixel width that overflows
- Background images: use `object-cover` + `aspect-ratio` instead of fixed heights

---

## 7. Thumb Zone Design

On phones, users naturally reach with their thumb. The lower half of the screen is easy; the top corners are hard.

**The three zones:**
```
┌─────────────────────┐
│  ╔═══╗  hard zone   │  ← Top: hard to reach with thumb
│  ║   ║              │
│  ╚═══╝  ok zone     │  ← Middle: reachable
│                     │
│  ███████ easy zone  │  ← Bottom: easiest — put primary CTAs here
│  ████████████████   │
└─────────────────────┘
```

**Apply this to layout decisions:**
- Primary CTA button: lower half of screen, not top-right corner
- Floating action buttons: bottom-right (`fixed bottom-6 right-6`)
- Sticky CTA bar at bottom: use for the most important action
  ```html
  <div class="fixed bottom-0 left-0 right-0 p-4 bg-[--bg] border-t border-[--border] md:hidden z-40">
    <a href="#download" class="btn-primary w-full min-h-[52px] flex items-center justify-center text-lg">
      Download Free
    </a>
  </div>
  ```
- Navigation: hamburger top-right is conventional; bottom nav bar is even more thumb-friendly for complex apps

---

## 8. Spacing & Density

Desktop designs often have generous whitespace that looks sparse on phones, or dense content that becomes cramped.

**Reduce vertical spacing on mobile, expand on desktop:**
```html
<section class="py-12 md:py-24 lg:py-32">
<div class="mt-6 md:mt-12 lg:mt-20">
<p class="mb-3 md:mb-6">
```

**Gap between cards/items:**
```html
<div class="gap-4 md:gap-6 lg:gap-8">
```

**Section padding sides:**
```html
<div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
```

**Reduce hero top padding on mobile (status bar takes space):**
```html
<section class="pt-16 pb-12 md:pt-32 md:pb-24">
```

---

## 9. Forms on Mobile

```html
<form class="flex flex-col gap-3 w-full max-w-md mx-auto">
  <input
    type="email"
    placeholder="you@email.com"
    class="w-full min-h-[48px] px-4 rounded-xl border border-[--border] text-base"
    inputmode="email"
    autocomplete="email"
  >
  <button type="submit" class="w-full min-h-[52px] rounded-xl font-semibold text-lg">
    Get Early Access
  </button>
</form>
```

**Rules:**
- `inputmode` attribute: `email`, `tel`, `numeric`, `url` — triggers the right keyboard
- `autocomplete` on every field — reduces friction on mobile
- `text-base` minimum (16px) on inputs — below 16px triggers iOS auto-zoom, which breaks layout
- Full-width inputs on mobile (`w-full`)
- Stack fields vertically on mobile (`flex-col`), can go side-by-side at `sm:` if appropriate
- Submit button: full-width on mobile, min 52px height, high contrast

---

## 10. Performance for Mobile (Slow Networks)

Mobile users are often on slower connections. Heavy pages = high bounce rates.

**Font loading — preconnect and swap:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- Add &display=swap to every Google Fonts URL -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

**Defer non-critical scripts:**
```html
<script src="analytics.js" defer></script>
<script src="interactions.js" defer></script>
```

**Inline critical CSS** (above-fold styles only) if page is performance-critical — avoids render-blocking.

**Image format checklist:**
- Use `.webp` where possible (30–50% smaller than JPEG/PNG)
- Provide `srcset` for large hero images:
  ```html
  <img srcset="hero-480.webp 480w, hero-800.webp 800w, hero-1200.webp 1200w"
       sizes="(max-width: 640px) 100vw, 800px"
       src="hero-800.webp" alt="..." loading="eager" fetchpriority="high">
  ```
- Mark hero/above-fold image with `loading="eager"` and `fetchpriority="high"` — not lazy

---

## 11. Mobile UX Patterns — Quick Reference

| Pattern | When to use | Implementation |
|---------|-------------|----------------|
| Sticky CTA bar | Product landing pages — keep conversion visible | `fixed bottom-0 w-full md:hidden` |
| Accordion FAQ | Long Q&A sections — saves scroll length | `<details>/<summary>` or JS toggle |
| Horizontal scroll cards | Feature list, testimonials, screenshots | `flex overflow-x-auto snap-x snap-mandatory` |
| Full-screen mobile menu | Sites with 4+ nav items | See Section 4 above |
| Bottom sheet / drawer | Secondary actions, filters | `fixed bottom-0 translate-y-full → translate-y-0` on open |
| Collapsible sections | Long content pages | `<details>` or `max-h-0 → max-h-screen` transition |

**Horizontal scroll for testimonials/screenshots:**
```html
<div class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-4 -mx-4">
  <div class="flex-none w-[80vw] sm:w-[340px] snap-start bg-[--card] rounded-2xl p-6">
    <!-- card content -->
  </div>
  <!-- more cards -->
</div>
```

---

## 12. Animations — Respect Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Also: reduce animation intensity on mobile even without `prefers-reduced-motion` — parallax, large-scale transforms, and heavy blur effects all hurt performance and feel wrong on touch devices.

---

## 13. Mobile Audit Checklist

Run this before delivering any page:

**Viewport & Setup**
- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1.0">` present — no zoom traps
- [ ] `<meta name="theme-color">` matches brand color
- [ ] Body has no horizontal overflow (`overflow-x: hidden` on `html`/`body` if needed)

**Touch & Interaction**
- [ ] Every button and link ≥ 44px tap target height
- [ ] Form inputs ≥ 48px height, font-size ≥ 16px (no iOS auto-zoom)
- [ ] `inputmode` set on all inputs (email, tel, numeric)
- [ ] `autocomplete` attributes on all form fields
- [ ] No hover-only interactions (hover doesn't exist on touch)

**Navigation**
- [ ] Desktop nav hidden on mobile (`hidden md:flex`)
- [ ] Mobile hamburger menu implemented with accessible ARIA
- [ ] Mobile menu closes on link click and ESC key
- [ ] Body scroll locked when mobile menu is open
- [ ] Primary CTA visible on mobile (sticky bar or prominent button)

**Layout & Typography**
- [ ] No layout breaks at 320px, 375px, 390px, 414px widths
- [ ] All grids collapse to 1 column on mobile
- [ ] No horizontal scroll (unless intentional swipe carousel)
- [ ] Content has ≥ 16px horizontal padding from screen edges
- [ ] Body font ≥ 15px on mobile, line-height ≥ 1.6
- [ ] Headings use `clamp()` or responsive classes — not fixed px
- [ ] Line length ≤ 55 characters on mobile screens

**Images & Media**
- [ ] Every image has `width` + `height` attributes (prevents layout shift)
- [ ] Every below-fold image has `loading="lazy"`
- [ ] No images with fixed pixel heights that crop on narrow screens
- [ ] Hero image doesn't dominate the entire mobile viewport

**Performance**
- [ ] Google Fonts loaded with `&display=swap`
- [ ] Non-critical scripts use `defer` or `async`
- [ ] No blocking render resources (large undeferred CSS/JS in `<head>`)

**Animations**
- [ ] `prefers-reduced-motion` media query implemented
- [ ] No parallax or scroll-jank effects on mobile (test on real device)

**Testing**
- [ ] Tested at 375px width (iPhone SE) — nothing clipped or overflowing
- [ ] Tested at 390px width (iPhone 14/15)
- [ ] Tested at 414px width (iPhone Plus)
- [ ] All interactive elements are finger-tappable without mis-tapping adjacent elements
- [ ] Page renders correctly in portrait AND landscape orientation

---

## 14. Common Mobile Bugs to Catch

| Bug | Cause | Fix |
|-----|-------|-----|
| Horizontal scroll bar appears | Element wider than viewport | Add `overflow-x: hidden` to `html, body`; find the offending element |
| Text too small on mobile | Fixed `px` sizes or `text-xs` | Use `clamp()` or `text-sm md:text-base` |
| iOS auto-zoom on input focus | Input font-size < 16px | Set `font-size: 16px` (1rem) on all `<input>` elements |
| Fixed elements overlap content | `position: fixed` nav/bar | Add `padding-top` equal to nav height on `<main>` |
| Images overflow container | No `max-width: 100%` | Add `w-full h-auto` to all `<img>` |
| Buttons too small to tap | No minimum height set | Add `min-h-[44px]` to all interactive elements |
| Tap highlight color ugly | Default browser tap highlight | Add `tap-highlight-color: transparent` in CSS or `-webkit-tap-highlight-color: transparent` |
| Sticky hover states on touch | Pure CSS `:hover` | Wrap hover effects in `@media (hover: hover)` |
| Long words overflow on mobile | No word break | Add `overflow-wrap: break-word` or `word-break: break-word` to containers |
| Video autoplay blocked on iOS | iOS blocks autoplay with sound | Use `muted playsinline autoplay` attributes on all `<video>` elements |

---

## 15. Tailwind Mobile-First Quick Reference

Always write mobile styles first, then override at larger breakpoints:

```
sm:  ≥ 640px
md:  ≥ 768px
lg:  ≥ 1024px
xl:  ≥ 1280px
2xl: ≥ 1536px
```

```html
<!-- CORRECT: mobile-first -->
<div class="text-base md:text-lg lg:text-xl">
<div class="flex-col md:flex-row">
<div class="w-full md:w-1/2">
<div class="py-8 md:py-16 lg:py-24">

<!-- WRONG: overriding mobile from desktop -->
<!-- Don't set desktop size first and try to shrink it down -->
```
