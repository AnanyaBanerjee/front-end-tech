---
name: mockups
description: Generate production-ready device mockups for app store screenshots and landing pages. Covers iPhone (Dynamic Island + notch), Android (Pixel punch-hole), iPad Pro, and MacBook frames — all pure HTML/CSS, no build tools. Outputs to output/<project>/mockups/ for export, or as embeddable components in site/index.html.
---

# Mockups Skill

Generates two things:
1. **Embeddable frames** — CSS device frames to drop into landing pages (extends product-images Style 2)
2. **Export pages** — standalone HTML files at app store dimensions, opened in a browser and screenshotted for submission

**Relationship to product-images:** Use this skill when you need accurate, detailed device frames. Use product-images for presentation *compositions* (tilt, layered, masonry). They work together — wrap a mockups frame inside a product-images Style 4 perspective tilt for a premium hero.

---

## Output Structure

```
output/<project>/
├── site/                    ← deploy this
└── mockups/                 ← export artifacts, NOT deployed
    ├── preview.html         ← all devices side-by-side for review
    ├── ios-69.html          ← iPhone 16 Pro Max (6.9" — App Store required)
    ├── ios-65.html          ← iPhone 11 Pro Max (6.5" — App Store required)
    ├── ios-61.html          ← iPhone 15 (6.1")
    ├── android-phone.html   ← Android phone portrait (1080×1920)
    ├── android-tablet.html  ← Android 10" tablet landscape (1920×1200)
    ├── android-feature.html ← Google Play feature graphic (1024×500)
    ├── ipad-pro.html        ← iPad Pro 12.9" (2048×2732)
    └── components/
        └── frames.css       ← reusable device frame classes (for site/index.html)
```

---

## Step 1: Gather Inputs

Ask the user:

> 1. "Share your app screenshots (PNG/JPG/WebP). One per screen you want to feature — I'll put each inside the correct device frame."
> 2. "What is the headline for each screenshot? (e.g. 'Track every habit. Every day.')"
> 3. "What devices do you need? iPhone only, Android only, both, iPad too?"
> 4. "What's the primary brand color and background color for the export slides?"

If no screenshots yet: generate shimmer placeholders (see Step 3, Placeholder).

---

## Step 2: Device Targets & App Store Requirements

| Platform | Required sizes | Notes |
|----------|---------------|-------|
| Apple App Store | 6.9" (1320×2868) + 6.5" (1242×2688) | These two cover all iPhone sizes |
| Apple App Store (iPad) | 12.9" (2048×2732) | Required if app runs on iPad |
| Google Play | Phone 1080×1920 + Feature 1024×500 | Tablet optional |

**Minimum to submit to App Store:** 6.9" screenshots (required from 2024).
**Minimum to submit to Google Play:** Phone portrait + Feature graphic.

---

## Step 3: Device Frame Components

These CSS classes are used both in `mockups/components/frames.css` and copied inline into `site/index.html` when embedding.

### iPhone 15 Pro (Dynamic Island)

```html
<div class="iphone-pro">
  <div class="iphone-pro__frame">
    <div class="iphone-pro__island"></div>
    <div class="iphone-pro__screen">
      <img src="../site/images/screenshot-1.png" alt="App screen — home dashboard" />
    </div>
    <div class="iphone-pro__btn iphone-pro__btn--power"></div>
    <div class="iphone-pro__btn iphone-pro__btn--vol-up"></div>
    <div class="iphone-pro__btn iphone-pro__btn--vol-dn"></div>
    <div class="iphone-pro__btn iphone-pro__btn--mute"></div>
    <div class="iphone-pro__indicator"></div>
  </div>
</div>

<style>
.iphone-pro {
  display: inline-block;
  filter: drop-shadow(0 40px 80px rgba(0,0,0,0.28)) drop-shadow(0 8px 16px rgba(0,0,0,0.12));
}
.iphone-pro__frame {
  position: relative;
  width: 290px;
  /* Height ratio matches 393×852 pt screen + frame */
  aspect-ratio: 393 / 852;
  border-radius: 52px;
  background: linear-gradient(160deg, #2c2c2e 0%, #1c1c1e 40%, #111 100%);
  border: 1.5px solid rgba(255,255,255,0.13);
  box-shadow:
    inset 0 0 0 1px rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(255,255,255,0.08);
  padding: 14px 11px 10px;
  box-sizing: border-box;
  overflow: visible;
}
.iphone-pro__screen {
  width: 100%;
  height: 100%;
  border-radius: 40px;
  overflow: hidden;
  background: #000;
  position: relative;
}
.iphone-pro__screen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
/* Dynamic Island */
.iphone-pro__island {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  width: 72px;
  height: 24px;
  background: #000;
  border-radius: 12px;
  z-index: 10;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
}
/* Home indicator */
.iphone-pro__indicator {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: rgba(255,255,255,0.3);
  border-radius: 2px;
  z-index: 10;
}
/* Side buttons */
.iphone-pro__btn {
  position: absolute;
  background: linear-gradient(180deg, #3a3a3c, #2c2c2e);
  border-radius: 2px;
}
.iphone-pro__btn--power {
  right: -3px;
  top: 28%;
  width: 3px;
  height: 62px;
  border-radius: 0 2px 2px 0;
}
.iphone-pro__btn--vol-up {
  left: -3px;
  top: 22%;
  width: 3px;
  height: 40px;
  border-radius: 2px 0 0 2px;
}
.iphone-pro__btn--vol-dn {
  left: -3px;
  top: calc(22% + 52px);
  width: 3px;
  height: 40px;
  border-radius: 2px 0 0 2px;
}
.iphone-pro__btn--mute {
  left: -3px;
  top: 15%;
  width: 3px;
  height: 24px;
  border-radius: 2px 0 0 2px;
}
</style>
```

---

### iPhone 15 / 14 (Notch Pill)

```html
<div class="iphone-notch">
  <div class="iphone-notch__frame">
    <div class="iphone-notch__pill"></div>
    <div class="iphone-notch__screen">
      <img src="../site/images/screenshot-1.png" alt="App screen" />
    </div>
    <div class="iphone-notch__indicator"></div>
  </div>
</div>

<style>
.iphone-notch { display: inline-block; filter: drop-shadow(0 40px 80px rgba(0,0,0,0.28)); }
.iphone-notch__frame {
  position: relative;
  width: 290px;
  aspect-ratio: 390 / 844;
  border-radius: 50px;
  background: linear-gradient(160deg, #1a1a1a 0%, #111 100%);
  border: 1.5px solid rgba(255,255,255,0.1);
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.6);
  padding: 12px 10px 8px;
  box-sizing: border-box;
}
.iphone-notch__screen {
  width: 100%; height: 100%;
  border-radius: 38px;
  overflow: hidden;
  background: #000;
}
.iphone-notch__screen img { width: 100%; height: 100%; object-fit: cover; display: block; }
/* Pill notch */
.iphone-notch__pill {
  position: absolute;
  top: 16px; left: 50%;
  transform: translateX(-50%);
  width: 88px; height: 24px;
  background: #000;
  border-radius: 12px;
  z-index: 10;
}
.iphone-notch__indicator {
  position: absolute;
  bottom: 8px; left: 50%;
  transform: translateX(-50%);
  width: 100px; height: 4px;
  background: rgba(255,255,255,0.25);
  border-radius: 2px;
  z-index: 10;
}
</style>
```

---

### Android (Pixel-style, Punch-hole)

```html
<div class="android-frame">
  <div class="android-frame__body">
    <div class="android-frame__camera"></div>
    <div class="android-frame__screen">
      <img src="../site/images/screenshot-1.png" alt="App screen" />
    </div>
    <div class="android-frame__btn android-frame__btn--power"></div>
    <div class="android-frame__btn android-frame__btn--vol"></div>
    <div class="android-frame__nav">
      <span class="android-frame__navdot"></span>
      <span class="android-frame__navdot navdot--wide"></span>
      <span class="android-frame__navdot"></span>
    </div>
  </div>
</div>

<style>
.android-frame { display: inline-block; filter: drop-shadow(0 40px 80px rgba(0,0,0,0.28)); }
.android-frame__body {
  position: relative;
  width: 280px;
  aspect-ratio: 9 / 19.5;
  border-radius: 36px;
  background: linear-gradient(160deg, #222 0%, #111 100%);
  border: 1.5px solid rgba(255,255,255,0.1);
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.5);
  padding: 10px 9px;
  box-sizing: border-box;
  overflow: visible;
}
.android-frame__screen {
  width: 100%; height: 100%;
  border-radius: 26px;
  overflow: hidden;
  background: #000;
}
.android-frame__screen img { width: 100%; height: 100%; object-fit: cover; display: block; }
/* Punch-hole camera */
.android-frame__camera {
  position: absolute;
  top: 18px; left: 50%;
  transform: translateX(-50%);
  width: 14px; height: 14px;
  background: #000;
  border-radius: 50%;
  z-index: 10;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.05);
}
/* Gesture nav bar */
.android-frame__nav {
  position: absolute;
  bottom: 10px; left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 10;
}
.android-frame__navdot {
  width: 6px; height: 6px;
  background: rgba(255,255,255,0.25);
  border-radius: 3px;
}
.navdot--wide { width: 22px; border-radius: 3px; }
/* Buttons */
.android-frame__btn { position: absolute; background: #222; border-radius: 2px; }
.android-frame__btn--power {
  right: -3px; top: 22%;
  width: 3px; height: 48px;
  border-radius: 0 2px 2px 0;
}
.android-frame__btn--vol {
  right: -3px; top: calc(22% + 60px);
  width: 3px; height: 70px;
  border-radius: 0 2px 2px 0;
}
</style>
```

---

### iPad Pro (Face ID, thin bezels)

```html
<div class="ipad-pro-frame">
  <div class="ipad-pro-frame__body">
    <div class="ipad-pro-frame__island"></div>
    <div class="ipad-pro-frame__screen">
      <img src="../site/images/screenshot-ipad.png" alt="App on iPad" />
    </div>
    <div class="ipad-pro-frame__indicator"></div>
  </div>
</div>

<style>
.ipad-pro-frame { display: inline-block; filter: drop-shadow(0 40px 100px rgba(0,0,0,0.22)); }
.ipad-pro-frame__body {
  position: relative;
  width: 480px;
  aspect-ratio: 2048 / 2732;
  border-radius: 28px;
  background: linear-gradient(160deg, #2c2c2e 0%, #1c1c1e 100%);
  border: 1.5px solid rgba(255,255,255,0.1);
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.5);
  padding: 12px 10px 10px;
  box-sizing: border-box;
}
.ipad-pro-frame__screen {
  width: 100%; height: 100%;
  border-radius: 18px;
  overflow: hidden;
  background: #000;
}
.ipad-pro-frame__screen img { width: 100%; height: 100%; object-fit: cover; display: block; }
/* Dynamic Island */
.ipad-pro-frame__island {
  position: absolute;
  top: 16px; left: 50%;
  transform: translateX(-50%);
  width: 80px; height: 20px;
  background: #000;
  border-radius: 10px;
  z-index: 10;
}
.ipad-pro-frame__indicator {
  position: absolute;
  bottom: 8px; left: 50%;
  transform: translateX(-50%);
  width: 120px; height: 4px;
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
  z-index: 10;
}
</style>
```

---

### Screenshot Placeholder (no image yet)

```html
<div class="mock-placeholder">
  <div class="mock-ph-bar">
    <div class="mock-ph-block" style="width:60px;height:8px"></div>
    <div class="mock-ph-block" style="width:40px;height:8px;margin-left:auto"></div>
  </div>
  <div class="mock-ph-body">
    <div class="mock-ph-block" style="width:100%;height:80px"></div>
    <div style="display:flex;gap:8px;margin-top:8px">
      <div class="mock-ph-block" style="flex:1;height:60px"></div>
      <div class="mock-ph-block" style="flex:1;height:60px"></div>
    </div>
    <div class="mock-ph-block" style="width:70%;height:8px;margin-top:8px"></div>
    <div class="mock-ph-block" style="width:50%;height:8px;margin-top:6px"></div>
    <div class="mock-ph-block" style="width:55%;height:8px;margin-top:6px"></div>
  </div>
</div>

<style>
.mock-placeholder { background:#111; border-radius: inherit; width:100%; height:100%; overflow:hidden; }
.mock-ph-bar {
  display:flex; align-items:center;
  padding:10px 12px;
  border-bottom:1px solid rgba(255,255,255,0.06);
}
.mock-ph-body { padding:12px; display:flex; flex-direction:column; gap:6px; }
.mock-ph-block {
  background: linear-gradient(90deg, #2a2a2a 25%, #333 50%, #2a2a2a 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: mock-shimmer 1.6s infinite;
}
@keyframes mock-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
```

Use inside any device frame's `.___-screen` container when the user has no screenshot yet.

---

## Step 4: App Store Export Pages

Each export page is a standalone HTML file. The device frame is centered on a branded slide background with marketing copy. Open in Chrome, zoom to fit, then use an extension like "GoFullPage" or run `puppeteer` to export at exact pixel dimensions.

### Export Page Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <!-- Target export size declared here — use browser zoom or Puppeteer to capture at 1:1 -->
  <!-- iPhone 6.9": 1320×2868 | 6.5": 1242×2688 | Android phone: 1080×1920 -->
  <meta name="viewport" content="width=1320, height=2868" />
  <title>App Store Screenshot — [Slide Title]</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    /* === BRAND VARIABLES — change these per project === */
    :root {
      --bg: #0d0d0f;            /* slide background */
      --accent: #7c3aed;        /* primary brand color */
      --accent-2: #a855f7;      /* secondary / gradient end */
      --text: #ffffff;
      --subtext: rgba(255,255,255,0.6);
      --headline-size: 96px;    /* scale to fit */
      --sub-size: 52px;
    }

    html, body {
      width: 1320px;
      height: 2868px;
      overflow: hidden;
      background: var(--bg);
      font-family: -apple-system, 'SF Pro Display', 'Inter', sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    /* Background decoration */
    .slide-bg {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, var(--accent) 20%, transparent) 0%, transparent 60%),
        var(--bg);
    }

    /* Copy block — top third */
    .slide-copy {
      position: absolute;
      top: 140px;
      left: 0; right: 0;
      text-align: center;
      padding: 0 80px;
      z-index: 10;
    }
    .slide-headline {
      font-size: var(--headline-size);
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.08;
      color: var(--text);
    }
    .slide-sub {
      margin-top: 36px;
      font-size: var(--sub-size);
      font-weight: 400;
      color: var(--subtext);
      line-height: 1.3;
    }

    /* Device — centered in bottom 60% */
    .slide-device {
      position: absolute;
      bottom: -60px;       /* bleed off bottom edge intentionally */
      left: 50%;
      transform: translateX(-50%);
      z-index: 20;
    }

    /* Scale the iPhone frame UP to fill the slide */
    .slide-device .iphone-pro__frame {
      width: 780px;         /* 2× larger than embed size */
    }

    /* Accent bar at top */
    .slide-bar {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 6px;
      background: linear-gradient(90deg, var(--accent), var(--accent-2));
      z-index: 30;
    }
  </style>
</head>
<body>
  <div class="slide-bg"></div>
  <div class="slide-bar"></div>

  <div class="slide-copy">
    <div class="slide-headline">Track every habit.<br/>Every single day.</div>
    <div class="slide-sub">Your streaks. Your progress.<br/>Beautifully visualized.</div>
  </div>

  <div class="slide-device">
    <!-- Paste iPhone 15 Pro frame from Step 3 here -->
    <!-- Change the img src to your screenshot file -->
  </div>
</body>
</html>
```

**To export at exact pixel dimensions:**
```bash
# Option A — Puppeteer (recommended, requires Node.js)
npx puppeteer-screenshot --url mockups/ios-69.html --width 1320 --height 2868 --output ios-69-slide-1.png

# Option B — Chrome DevTools
# Open the file → DevTools (F12) → Toggle device toolbar → set 1320×2868 → right-click → Screenshot
```

---

## Step 5: Preview Page

Generate `mockups/preview.html` to show all device variants at once:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Mockup Preview</title>
  <link rel="stylesheet" href="components/frames.css" />
  <style>
    body {
      background: #0a0a0a; color: #fff;
      font-family: -apple-system, sans-serif;
      padding: 60px 40px;
      min-height: 100vh;
    }
    h1 { font-size: 20px; font-weight: 500; opacity: 0.5; margin-bottom: 60px; letter-spacing: 0.05em; text-transform: uppercase; }
    .device-row {
      display: flex;
      align-items: flex-end;
      gap: 48px;
      flex-wrap: wrap;
      margin-bottom: 80px;
    }
    .device-label {
      display: block;
      font-size: 11px;
      opacity: 0.35;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  <h1>Mockup Preview — [Product Name]</h1>

  <div class="device-row">
    <div>
      <span class="device-label">iPhone 15 Pro</span>
      <!-- Paste iphone-pro frame here -->
    </div>
    <div>
      <span class="device-label">iPhone 15</span>
      <!-- Paste iphone-notch frame here -->
    </div>
    <div>
      <span class="device-label">Android Pixel</span>
      <!-- Paste android frame here -->
    </div>
  </div>

  <div class="device-row">
    <div>
      <span class="device-label">iPad Pro 12.9"</span>
      <!-- Paste ipad frame here, set width:380px -->
    </div>
  </div>
</body>
</html>
```

---

## Step 6: Embedding in site/index.html

When the user wants a device frame on their landing page (not app store export), copy the CSS inline into `site/index.html` and use the frame directly. No separate file needed.

**Recommended pairings with product-images:**

| Combo | When to use |
|-------|-------------|
| iPhone Pro frame + Style 4 perspective tilt | Premium hero — SaaS / fintech / productivity apps |
| iPhone Pro + Android side by side + Style 3 floating shadow | Cross-platform apps, "available on both" section |
| iPad frame + Style 5 layered composition | Tablet-first apps, note-taking, document editors |
| 3× iPhone frames (diff screens) + Style 7 depth carousel | Feature showcase section |
| iPhone + proof cards (Style 10) | Social proof section |

---

## Step 7: Rules

- **Always use `object-fit: cover`** on the `<img>` inside a device frame — never let a screenshot stretch the frame
- **Always add descriptive `alt` text** — "App screen showing habit tracker dashboard", not "screenshot"
- **Never deploy `mockups/` to Cloudflare Pages** — it stays local, it's an export tool
- **Scale the frame, not the screenshot** — adjust the frame's `width` to change size; the image fills it automatically
- **On mobile landing pages**, reduce frame width to `min(260px, 80vw)` so phones don't overflow
- **Match the slide background to the brand** — never use generic white or plain grey for app store slides
- **At least 3 slides** for App Store — Apple requires a minimum of 3 screenshots per device size
- **Google Play feature graphic (1024×500)**: use a landscape hero crop — no device frame, just the logo + tagline on brand background

---

## App Store Dimension Reference

| Store | Device | Dimensions | Required |
|-------|--------|------------|----------|
| Apple | iPhone 6.9" (16 Pro Max) | 1320 × 2868 px | ✅ Required from 2024 |
| Apple | iPhone 6.5" (11 Pro Max) | 1242 × 2688 px | ✅ Required |
| Apple | iPhone 6.1" (15) | 1179 × 2556 px | Optional |
| Apple | iPad Pro 12.9" | 2048 × 2732 px | Required if iPad app |
| Google Play | Phone portrait | 1080 × 1920 px | ✅ Required |
| Google Play | Feature graphic | 1024 × 500 px | ✅ Required |
| Google Play | 7" tablet portrait | 1200 × 1920 px | Optional |
| Google Play | 10" tablet landscape | 1920 × 1200 px | Optional |
