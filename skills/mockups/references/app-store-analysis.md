# App Store Screenshot Reference Analysis

Sources: 14 reference screenshot sets from the App Store (music, fitness, finance, shopping, productivity, health apps).
Saved: 2026-04-23

---

## The 10 Slide Types

Professional App Store sets use a **mix of these types** — never all the same layout.

| # | Type | Description | When to use |
|---|------|-------------|-------------|
| 1 | **Brand/Identity hero** | NO phone or tiny phone. Full bleed lifestyle photo OR solid brand color. App name + 1 bold claim. Stars/badge. | Always slide 1 — establishes identity before features |
| 2 | **Colored background + centered phone** | Solid brand color fill, large phone centered or slightly off-center, short headline top or bottom | Most common feature slide type |
| 3 | **Full bleed lifestyle photo** | Background IS a real photo. Minimal or no phone frame. Headline overlaid with high contrast | Nike, eBay, Unsplash — lifestyle-heavy brands |
| 4 | **Dark background + phone + glow** | Dark bg (#0d0f12 range), phone with radial glow behind it, gradient headline | Tech / productivity / developer apps |
| 5 | **Multi-phone overlapping** | 2–3 phones at different scales, overlapping, showing different screens | Shows app depth; good for apps with many features |
| 6 | **Tilted/perspective phone** | Phone at 10–20° tilt or 3D perspective transform | More dynamic energy; breaks visual monotony |
| 7 | **3D character + phone** | Illustrated or 3D-rendered character interacting with floating phone | Playful/consumer apps; adds personality |
| 8 | **Testimonial/social proof** | Stars + quote text, NO phone. OR "10M+ Users" big number statement | Position as slide 2 or last slide; reinforces trust |
| 9 | **Press logos** | "As featured in" + media logos (Forbes, GQ, Vogue, TechCrunch) | Credibility signal; use if app has real coverage |
| 10 | **Pure copy** | Just text on solid or photo background, no phone at all. Works as slide 1 or interstitial | Confident brand identity; used by Nike, Opal |

---

## Background Treatment Patterns

### Pattern A: Solid brand color fill
Every single slide uses the same saturated brand color as background.
- Nike: lime `#BFFF00` / `#C8FF00`
- Fitness app (yellow): `#F5B800` / `#FFC107`
- Fitness app (orange): `#E85200` / `#FF5500`
- Dating app: `#E83060` / hot pink

**How to implement:**
```css
html, body { background: #BFFF00; }  /* brand color fill */
.headline { color: #000; }            /* dark text on light bg */
```

### Pattern B: Alternating light/dark per slide
Slide 1: dark with photo
Slide 2: light/colored
Slide 3: dark
…creates visual rhythm.

### Pattern C: Dark with glow
Background stays dark but each slide has a different colored radial glow behind the phone. Color shifts per slide (green → cyan → purple → blue).

### Pattern D: Full bleed photo with overlay
```css
html, body {
  background: url('lifestyle.jpg') center/cover no-repeat;
}
/* Optional overlay */
html, body::before {
  content: '';
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.35);
}
```

---

## Typography Scale (at 1320px canvas width)

| Element | Size | Weight | Notes |
|---------|------|--------|-------|
| Brand name / hero headline | 140–186px | 800–900 | Tight line-height 0.9–1.0 |
| Feature headline | 90–130px | 700–800 | 2–4 words max |
| Subheadline / descriptor | 48–64px | 400–500 | 1–2 lines |
| Badge / label text | 32–40px | 600 | All caps, pill background |
| Fine print / footnote | 28–36px | 400 | Muted opacity |

**Key rules:**
- Short is always better. 2–3 words for feature slides.
- ALL CAPS works for impact (Nike, Opal fitness, fitness apps)
- Title Case works for premium/editorial feel (Claude, Wellora)
- 1 colored word in headline is enough — don't color whole phrase
- Headline must be readable at 200px thumbnail width (test this)

---

## Decorative Element Vocabulary

Elements seen across premium App Store sets:

### Floating scattered icons
Small 3D emoji, brand icons, or themed icons scattered around the phone at random angles.
```css
.deco-icon {
  position: absolute;
  font-size: calc(64px * var(--scale));
  opacity: 0.6;
  transform: rotate(-15deg);
  filter: drop-shadow(0 8px 16px rgba(0,0,0,0.3));
}
```

### Social proof badges
```css
.badge-stars { /* star rating row */ }
.badge-award { /* "App of the Day" wreath icon */ }
.badge-count { /* "10M+ Users" */ }
```

### Press logos row
```html
<div class="press-row">
  <span>GQ</span>
  <span>Forbes</span>
  <span>VOGUE</span>
  <span>COSMOPOLITAN</span>
</div>
```
Style: muted opacity (0.5–0.6), same font family as brand, no border/background.

### Rounded pill label behind headline
Instead of bare text, wrap in a pill:
```css
.headline-pill {
  display: inline-block;
  background: rgba(0,0,0,0.15);
  border-radius: 12px;
  padding: 8px 20px;
}
```
Seen in Opal: "Daily Focus Report" as a pill tag above the number.

### Rating stars
```html
<div class="stars">★★★★★</div>
<div class="rating-text">This app saved me a lot of time. Love it!</div>
```

---

## Phone Composition Patterns

### Pattern 1: Single phone, bleed off bottom
Already in SKILL.md. Phone bleed 180px+ off bottom edge.

### Pattern 2: Two phones overlapping
```
Phone B (back, smaller, offset left or right)
Phone A (front, full size)
```
```css
.phone-back {
  position: absolute;
  transform: scale(0.82) translateX(-180px) translateY(60px);
  opacity: 0.55;
  z-index: 1;
}
.phone-front {
  position: relative;
  z-index: 2;
}
```

### Pattern 3: Tilted perspective phone
Creates dynamic energy without needing multiple phones:
```css
.phone-tilt {
  transform: perspective(1200px) rotateY(-12deg) rotateX(4deg) rotate(3deg);
  filter: drop-shadow(40px 60px 80px rgba(0,0,0,0.5));
}
```

### Pattern 4: Hand holding phone
Actual photo of hand holding phone — most realistic feel. Requires a hand+phone photo asset.
Alternative: CSS wrist shape (rarely convincing in pure CSS).

### Pattern 5: Phone on colored shape
Phone overlaid on a geometric shape (circle, rounded square) in a contrasting color.
```css
.phone-shape-bg {
  position: absolute;
  width: 700px; height: 700px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  top: 50%; left: 50%;
  transform: translate(-50%, -40%);
}
```

---

## Slide Set Rhythm

Best-in-class sets follow a rhythm:

**5-slide set (minimum viable):**
1. Brand hero (photo or bold type, no phone or tiny phone)
2. Feature 1 — primary feature, big phone
3. Feature 2 — secondary feature, different bg color
4. Feature 3 — tertiary feature, again different bg
5. Social proof (stars + quote) OR multi-phone breadth shot

**7-slide set (recommended for complex apps):**
1. Brand hero
2. Feature 1
3. Feature 2
4. Feature 3
5. Feature 4
6. Social proof / testimonial
7. CTA slide ("Download free. No account needed.")

**Key rule:** Alternate between dark/colored backgrounds. Never have 3 dark slides in a row.

---

## Color Strategy per Slide Set

### Option A: Monochromatic (single brand color, different lightness)
- Slide 1: dark background (brand color at 10% opacity as glow)
- Slide 2: full brand color background (100%)
- Slide 3: brand color at 85% (slightly different shade)
- Slide 4: dark background again
- Slide 5: brand color

### Option B: Brand color + neutral alternation
- Odd slides: brand color background
- Even slides: black or dark neutral

### Option C: Multi-hue (premium, editorial)
Each slide has a slightly different bg:
- Slide 1: dark
- Slide 2: warm brand color
- Slide 3: cool complementary color
- Slide 4: neutral cream/white
- Slide 5: dark

---

## What Makes Slide 1 Different

Slide 1 is a **brand poster**, not a feature slide. The goal is to establish identity and make someone tap to read more.

**Patterns observed:**
- No feature benefit stated — just the brand name + a punchy brand claim
- "FEEL THE MUSIC VIBE" (not "Stream 100M songs")
- "ANYTIME ANYWHERE" (not "Access workouts on any device")
- "Health made simple" (not "Track your calories")
- App rating stars + review count prominently placed
- App award badge if applicable ("App of the Day", "#1 Fitness App")
- Often uses a full-bleed lifestyle photo or 3D character as background/focus

---

## CSS Snippets

### Tilted phone frame
```css
.phone-tilted {
  transform:
    perspective(1800px)
    rotateY(-8deg)
    rotateX(3deg)
    rotate(2deg);
  transform-origin: center bottom;
}
```

### Two overlapping phones
```css
.phone-duo {
  position: relative;
  width: 900px; height: 1200px; /* at 1320px canvas */
}
.phone-duo .phone-back {
  position: absolute;
  left: 0; bottom: 0;
  transform: scale(0.78) rotate(-5deg) translateY(40px);
  transform-origin: bottom left;
  opacity: 0.5;
}
.phone-duo .phone-front {
  position: absolute;
  right: 0; bottom: 0;
  transform: scale(1.0) rotate(3deg);
  transform-origin: bottom right;
}
```

### Floating 3D emoji scatter
```css
.float-icons { position: absolute; inset: 0; pointer-events: none; }
.float-icon {
  position: absolute;
  font-size: 72px;
  filter: drop-shadow(0 12px 24px rgba(0,0,0,0.4));
}
.float-icon:nth-child(1) { top: 12%; left: 8%;  transform: rotate(-22deg); }
.float-icon:nth-child(2) { top: 18%; right: 6%; transform: rotate(15deg); }
.float-icon:nth-child(3) { top: 55%; left: 5%;  transform: rotate(-8deg); opacity: 0.5; }
.float-icon:nth-child(4) { top: 60%; right: 7%; transform: rotate(25deg); opacity: 0.4; }
```

### Stars + testimonial slide
```css
.proof-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 120px;
  text-align: center;
  gap: 48px;
}
.stars {
  font-size: 80px;
  letter-spacing: 8px;
  color: #FFD700;
}
.quote {
  font-size: 72px;
  font-weight: 500;
  line-height: 1.25;
  color: rgba(255,255,255,0.9);
}
.attribution {
  font-size: 44px;
  font-weight: 400;
  color: rgba(255,255,255,0.45);
}
```

### Colored background slide (solid brand color)
```css
/* Override the default dark bg for specific slides */
#s2 { --slide-bg: #BFFF00; --slide-text: #000; }
#s3 { --slide-bg: #0d0d0f; --slide-text: #fff; }
#s4 { --slide-bg: #BFFF00; --slide-text: #000; }
```
Apply in slide root: `background: var(--slide-bg); color: var(--slide-text);`

---

## Quick Checklist: Is This Set Good?

- [ ] Slide 1 is brand identity, NOT a feature
- [ ] At least 1 slide with a colored (non-dark) background
- [ ] Headline is ≤ 4 words on feature slides
- [ ] Phone bleeds off bottom on at least 2 slides
- [ ] Social proof appears (stars, quote, OR user count)
- [ ] Text is readable at 200px thumbnail width
- [ ] No 2 consecutive slides with same bg color
- [ ] At least 1 slide variation (tilted, multi-phone, OR no phone)
