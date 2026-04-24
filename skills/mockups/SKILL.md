---
name: mockups
description: Generate production-ready device mockups for app store screenshots and landing pages. Covers iPhone (Dynamic Island + notch), Android (Pixel punch-hole), iPad Pro, and MacBook frames — all pure HTML/CSS, no build tools. Outputs to output/<project>/mockups/ for export, or as embeddable components in site/index.html. Always includes a built-in Studio panel for live editing of text, colors, themes, and device screenshots.
---

# Mockups Skill

Generates two things:
1. **Embeddable frames** — CSS device frames to drop into landing pages (extends product-images Style 2)
2. **Export pages** — a single `preview.html` with all slides inlined, a built-in Studio panel for editing, and a "Download All PNGs" button for App Store export

**Relationship to product-images:** Use this skill when you need accurate, detailed device frames. Use product-images for presentation *compositions* (tilt, layered, masonry). They work together — wrap a mockups frame inside a product-images Style 4 perspective tilt for a premium hero.

---

## Output Structure

```
output/<project>/
├── site/                    ← deploy this
└── mockups/                 ← export artifacts, NOT deployed
    ├── preview.html         ← SINGLE FILE — all slides inlined, export all PNGs from here
    ├── images/              ← screenshots (copied from site/images/, base64-inlined into preview.html)
    └── components/
        └── frames.css       ← reusable device frame classes (for site/index.html)
```

**Architecture: single preview.html contains everything.**
All slides are inlined as full-size divs scaled down to 25% for preview. The "Download All PNGs" button exports every slide at exact App Store dimensions via html2canvas. The Studio panel enables live editing of text, colors, themes, transforms, and device screenshots. "Save Edits" downloads a fully self-contained HTML snapshot with all changes baked in. No separate per-slide HTML files are needed or generated.

**Fonts must be inlined as base64 `@font-face` data URIs** — never use Google Fonts `<link>` tags. External font URLs taint the `<canvas>` element under `file://` protocol, causing `toBlob()` to throw a SecurityError and breaking all PNG exports. Inlined fonts eliminate this permanently.

**`.hl-accent` elements must have `display: inline-block`** — without it, Chrome fails to apply `-webkit-background-clip: text` when the `<em>` sits mid-line surrounded by sibling text (e.g. "Watch your agent **think** live."). The gradient background renders as a solid color block and the text becomes invisible. `display: inline-block` forces its own block formatting context and makes the clip work in all positions.

```css
.hl-accent {
  display: inline-block; /* REQUIRED — background-clip:text fails on pure inline mid-line elements */
  background: linear-gradient(135deg, var(--c1), var(--c2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Save Edits: clone is the `<html>` element, not the document** — `document.documentElement.cloneNode(true)` returns an `HTMLElement`. It has no `.documentElement` property. Set CSS vars directly on `clone.style`, not `clone.documentElement.style`. Calling `.documentElement` on the clone throws `TypeError: Cannot read properties of undefined` and silently breaks the save.

```js
// WRONG — clone.documentElement is undefined
clone.documentElement.style.setProperty('--c1', c1);

// CORRECT — clone IS the <html> element
clone.style.setProperty('--c1', c1);
```

**`URL.revokeObjectURL` must be delayed** — calling it synchronously after `a.click()` revokes the object URL before the browser has started the download, causing a silent failure. Use `setTimeout(() => URL.revokeObjectURL(a.href), 10000)` to give the browser time to initiate the download.

---

## Step 1: Gather Inputs

**Before asking the user anything, check `output/<project>/site/images/` for existing images.**

```
output/<project>/site/images/   ← scan this directory first
```

- List every `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif` file found there
- These ARE the product screenshots — use them directly as `../site/images/<filename>` in mockup HTML
- Sort them by filename so the order is predictable (s01, s02, s03... or 1, 2, 3...)
- Assign one image per slide: first image → slide 1, second → slide 2, etc.
- If more than 10 images exist, use the first 5–6 for App Store slides (quality over quantity)

**CRITICAL: Every external resource must be inlined as base64** — Chrome's `file://` security taints the `<canvas>` for ANY cross-origin or non-inlined resource. A tainted canvas throws `SecurityError: Failed to execute 'toBlob'` and breaks all PNG exports. The rule is simple: if it loads from a URL (even a relative path like `images/s02.png`), it taints the canvas.

**Checklist — nothing may be left as an external URL:**
- **Images**: every `<img src="">` must be a `data:image/png;base64,...` URI — including every image in every slide, no exceptions. Check with: `re.findall(r'<img[^>]+src="(?!data:)', html)` — must return empty.
- **Fonts**: never use Google Fonts `<link>` tags. Inline all font files as `@font-face` with `data:font/woff2;base64,...` src (see font inlining script below).
- **CSS files**: inline any `<link rel="stylesheet" href="...css">` as a `<style>` block. Even local relative paths (`components/frames.css`) can cause issues.
- **Scripts (html2canvas, JSZip, FileSaver)**: CDN `<script src>` tags are safe — scripts don't taint canvas.

**After every change, run this check before shipping:**
```python
import re
with open('preview.html') as f: html = f.read()
ext = re.findall(r'<img[^>]+src="(?!data:)([^"]+)"', html)
assert not ext, f'Non-inlined images found: {ext}'
assert 'fonts.googleapis.com' not in html, 'External font link found'
assert 'fonts.gstatic.com' not in html, 'External font URL found'
print('All resources inlined — canvas will not be tainted')
```

**Do NOT create separate per-slide HTML files.** All slides go into `preview.html` only.

```bash
# Copy screenshots into mockups/images/ (kept as source reference)
mkdir -p output/<project>/mockups/images
cp output/<project>/site/images/*.png output/<project>/mockups/images/
cp output/<project>/site/images/*.jpg output/<project>/mockups/images/ 2>/dev/null || true

# After writing preview.html with images/sXX.png paths, run this to inline them:
python3 -c "
import base64, os
imgs = ['s01', 's02', 's03']  # list all images used in the slides
b64 = {}
for name in imgs:
    path = f'output/<project>/mockups/images/{name}.png'
    with open(path, 'rb') as f:
        b64[name] = 'data:image/png;base64,' + base64.b64encode(f.read()).decode()
with open('output/<project>/mockups/preview.html', 'r') as f:
    html = f.read()
for name, data in b64.items():
    html = html.replace(f'images/{name}.png', data)
with open('output/<project>/mockups/preview.html', 'w') as f:
    f.write(html)
print('Done')
"
```

**Font inlining script** — run once after writing preview.html. Replace Google Fonts `<link>` tags with inlined `@font-face`:

```python
import urllib.request, ssl, base64, re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
HEADERS = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'}

def fetch(url, binary=False):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30, context=ctx) as r:
        return r.read() if binary else r.read().decode('utf-8')

# Fetch each font family separately (combined URL may 400 for variable fonts)
FONT_URLS = [
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
    # Add other families used by the project:
    "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&display=swap",
]
combined_css = ''.join(fetch(u) + '\n' for u in FONT_URLS)

# Inline every .woff2 file
for furl in list(dict.fromkeys(re.findall(r'url\((https://fonts\.gstatic\.com/[^)]+\.woff2)\)', combined_css))):
    data = fetch(furl, binary=True)
    combined_css = combined_css.replace(furl, 'data:font/woff2;base64,' + base64.b64encode(data).decode())

# Replace Google Fonts link tags in the HTML file
HTML_PATH = 'output/<project>/mockups/preview.html'
with open(HTML_PATH, 'r') as f: html = f.read()
# Remove preconnect + stylesheet links, replace with inline style
import re as _re
html = _re.sub(r'<link[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>\s*', '', html)
html = html.replace('</head>', '<style>\n' + combined_css + '\n</style>\n</head>', 1)
with open(HTML_PATH, 'w') as f: f.write(html)
print('Fonts inlined — ' + str(len(html)//1024) + 'KB')
```

**Note:** preview.html will be 25–30 MB after inlining images + fonts. This is expected and fine for a local export tool.

**Only ask the user for images if `site/images/` is empty or doesn't exist.**

After scanning images, ask only the remaining questions:

> 1. "I found [N] screenshots in site/images/ — I'll use those. Which devices do you need? (iPhone, Android, iPad, or all)"
> 2. "What is the headline for each slide? I'll suggest ones based on the product if you skip this."
> 3. (Only if brand colors not found in site/index.html) "What's your primary brand color?"

**Also check `site/index.html` for brand colors** — read the CSS custom properties (`--color-accent`, `--color-bg`, etc.) before asking. Use what's already there.

If no screenshots exist: generate shimmer placeholders (see Step 3, Placeholder).

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

## Step 4: App Store Export Slides

All slides are inlined as sections inside `preview.html` — no separate HTML files per slide. Each slide is a full-size `<div>` (e.g. `width:1320px;height:2868px`) scaled to 25% preview size via `transform:scale(.25)`. Exporting is done via the "Download All PNGs" button which uses html2canvas to render each div at full dimensions.

**Slide naming convention** (used for exported PNG filenames):
- `ios-6.9in-poster-1` — iPhone 6.9", left-aligned poster layout
- `ios-6.9in-slide-1` — iPhone 6.9", centered layout
- `ios-6.5in-slide-1` — iPhone 6.5" (for App Store compat)
- `ipad-pro-slide-1` — iPad Pro 12.9"
- `android-phone-slide-1` — Android portrait
- `android-feature` — Google Play feature graphic (landscape, 1024×500)

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

**To export:** Open `mockups/preview.html` in Chrome and click **"Download All PNGs"**. This renders every slide via html2canvas and downloads a ZIP with all PNGs at exact App Store dimensions. Any edits made in the Studio panel (theme, text, background, reference images) are reflected in the exported PNGs automatically. No separate files, no Puppeteer, no DevTools needed.

---

## Step 5: Preview Page

Generate a single `mockups/preview.html` that contains ALL slides inlined — no separate slide files. Each slide is a section with a heading, a row of `slide-card` elements, and a "Download All PNGs" button that exports everything via html2canvas + JSZip.

**The Studio panel is always included.** Every `preview.html` must ship with the built-in Studio panel — see Step 5b for what it does and how to build it in.

**Two CSS layout families in one file:**
- `slide-root` class — poster slides (left-aligned copy, `#07070a` bg). Use `.bg-grid`, `.bg-glow`, `.copy`, `.badge`, `.headline`, `.showcase`, `.phone-wrap`.
- `fslide` class — feature slides (centered copy, `#000` bg). Use `.fs-grid`, `.fs-glow`, `.fs-bar`, `.fs-copy`, `.fs-eyebrow`, `.fs-headline`, `.fs-sub`, `.fs-device`. Scope overrides with `#sN` IDs.

**Important:** scope all feature-slide styles with ID selectors (`#s6 .fs-copy { ... }`) to avoid colliding with poster-slide styles that share class names like `.copy` and `.bg-glow`.

**Scale values for preview:** `transform:scale(.25)` for 1320×2868 slides, `scale(.265)` for 1242×2688, `scale(.166)` for 2048×2732, `scale(.25)` for 1080×1920, `scale(.55)` for 1024×500.

**Device `--scale` values at export dimensions:**
- iPhone at 720px → `--scale:1.832` · at 680px → `--scale:1.730`
- iPad at 1160px → `--scale:2.265`
- Android at 560px → `--scale:2.074`

The template structure:

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

## Step 5b: Studio Panel (always included in preview.html)

Every `preview.html` must include a built-in Studio panel. Do not skip this. It lets the user edit their mockups without touching code — essential when the file will be used to iterate on copy, colors, and screenshots.

### What the Studio does

| Panel section | What the user can change |
|---------------|--------------------------|
| **Theme** | 6 preset gradient palettes (Neon, Ocean, Aurora, Sunset, Candy, Gold) — updates accent gradient + slide backgrounds in one click |
| **Accent Gradient** | Two color pickers (From / To) — live-updates all gradient text (`hl-accent`), decorative elements, and the download progress bar via CSS vars `--c1` / `--c2`. Changes carry into exported PNGs. |
| **Background** | Color picker + scope selector (This slide / This section / All slides) — sets the bg of `.slide-root` elements |
| **Position & Tilt** | 7 sliders that transform the device frame inside the selected slide: Move X/Y, Scale, Rotate (2D), Tilt X / Tilt Y (3D perspective), and Depth (perspective distance). Reset button returns to default. |
| **Edit Text** | Click any slide card → text fields appear for that slide's headline, badge, body, eyebrow. Headline uses `[[HL:word]]` syntax to mark gradient-highlighted words. Body/badge are plain textareas. |
| **Device Screenshot** | Grid of all reference images extracted from the page's device frames. Click one to swap the screenshot inside the selected slide's phone/tablet. Upload button adds an external image. |

### Theme presets (use these exact values)

```js
const THEMES = [
  { name:'Neon',    c1:'#00E87A', c2:'#22D3EE', bg:'#07070a', poster:'#07070a', feature:'#000000' },
  { name:'Ocean',   c1:'#3B82F6', c2:'#06B6D4', bg:'#07080f', poster:'#07080f', feature:'#000510' },
  { name:'Aurora',  c1:'#10B981', c2:'#A78BFA', bg:'#08070f', poster:'#08070f', feature:'#02000a' },
  { name:'Sunset',  c1:'#F97316', c2:'#EF4444', bg:'#0f0705', poster:'#0f0705', feature:'#0a0200' },
  { name:'Candy',   c1:'#EC4899', c2:'#8B5CF6', bg:'#0a070f', poster:'#0a070f', feature:'#040010' },
  { name:'Gold',    c1:'#F59E0B', c2:'#FB923C', bg:'#0f0b02', poster:'#0f0b02', feature:'#080500' },
];
```

### CSS vars (required — must be at top of style block)

```css
:root { --c1: #00E87A; --c2: #22D3EE; }
```

All gradient usages throughout the CSS must reference `var(--c1)` / `var(--c2)` — never hardcode `#00E87A` or `#22D3EE`. This makes theme switching instant (one CSS var update changes everything).

### `[[HL:text]]` syntax

In the Edit Text panel, the user marks gradient-highlighted words with `[[HL:word]]`. The JS replaces this with `<em class="hl-accent">word</em>` which the CSS renders as gradient text. Example:

```
All your [[HL:AI agents.]] One place.
```
→ renders as: `All your <em class="hl-accent">AI agents.</em> One place.`

### captureSlide must read colors from CSS vars

The `captureSlide()` gradient-text canvas workaround uses hardcoded colors by default. Update it to read the current CSS vars so exported PNGs reflect the user's theme choice:

```js
const _rc1 = getComputedStyle(document.documentElement).getPropertyValue('--c1').trim() || '#00E87A';
const _rc2 = getComputedStyle(document.documentElement).getPropertyValue('--c2').trim() || '#22D3EE';
const c1  = isReversed ? _rc2 : _rc1;
const c2  = isReversed ? _rc1 : _rc2;
```

### Studio trigger: click slide card while Studio is open

Wire up `.slide-card` click handlers at init:
```js
document.querySelectorAll('.slide-card').forEach(card => {
  const slideEl = card.querySelector('.slide-root[id]');
  if (!slideEl) return;
  card.setAttribute('data-sp-id', slideEl.id);
  card.addEventListener('click', () => {
    if (_studioOpen) _selectSlide(slideEl.id);
  });
});
```

When a slide is selected, its card gets `.sp-selected` (colored border) and the Studio panel updates to show that slide's editable fields.

### Studio toggle button in header

Add a "Studio" button next to the "Download All PNGs" button in the sticky header:
```html
<button class="studio-toggle-btn" id="studio-toggle-btn" onclick="toggleStudio()">
  <svg><!-- pencil icon --></svg>
  Studio
</button>
```

The panel slides in from the right (`transform: translateX(100%)` → `translateX(0)`), and `body.studio-open { padding-right: 310px; }` shifts the content left to avoid overlap.

### Save Edits button (always in Studio panel)

A **"Save"** button must appear at the top of the Studio panel body. It overwrites `preview.html` directly on disk using the **File System Access API** (`showSaveFilePicker`). First click shows a Save dialog (user picks `preview.html`); subsequent clicks write silently to the same file handle. Falls back to a download if the API isn't available. (above all sections). It downloads a complete snapshot of the current page as `preview-saved.html` with all edits baked in — text changes, theme colors, backgrounds, transforms, swapped screenshots. Opening the saved file restores the exact state.

**Implementation:**
```js
function saveEdits() {
  const clone = document.documentElement.cloneNode(true);
  // Strip transient UI state
  clone.querySelector('body')?.classList.remove('studio-open');
  clone.querySelector('#studio-panel')?.classList.remove('open');
  clone.querySelector('#studio-toggle-btn')?.classList.remove('active');
  clone.querySelectorAll('.sp-selected').forEach(el => el.classList.remove('sp-selected'));
  clone.querySelectorAll('.sp-ref-item.active').forEach(el => el.classList.remove('active'));
  // Bake in current CSS var values so saved file opens with same theme
  const c1 = getComputedStyle(document.documentElement).getPropertyValue('--c1').trim();
  const c2 = getComputedStyle(document.documentElement).getPropertyValue('--c2').trim();
  if (c1 && c2) clone.documentElement.style.setProperty('--c1', c1);
  if (c2) clone.documentElement.style.setProperty('--c2', c2);

  const blob = new Blob(['<!DOCTYPE html>\n' + clone.outerHTML], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'preview-saved.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
  // Show confirmation toast
  const toast = document.getElementById('sp-save-toast');
  if (toast) { toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2800); }
}
```

What persists in the saved file (because it's live DOM state):
- Text content edits (all `innerHTML`/`textContent` changes)
- CSS var theme (`--c1`, `--c2` baked into `:root` inline style)
- Background colors (inline `style.background` on `.slide-root` elements)
- Device transforms (inline `style.transform` on device containers)
- Swapped reference screenshots (`img.src` changes)
- Uploaded images (base64 data URIs from FileReader)

Add a toast element inside the Studio panel HTML:
```html
<div id="sp-save-toast" class="sp-save-toast">✓ Saved — open preview-saved.html</div>
```

Toast CSS:
```css
.sp-save-toast {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  background: #111; border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; padding: 12px 22px;
  font-size: 13px; font-weight: 600; color: var(--c1);
  z-index: 2000; opacity: 0; transition: opacity .25s;
  pointer-events: none; white-space: nowrap;
}
.sp-save-toast.show { opacity: 1; }
```

### Position & Tilt: 7 transform sliders

The device frame inside each slide can be repositioned, scaled, and tilted in 3D using `<input type="range">` sliders. Transforms apply to the device container element, found via `_getDeviceEl(slideId)`.

**Slider definitions:**

| ID | Range | Default | Maps to |
|----|-------|---------|---------|
| `sp-tx` | -600 → +600 | 0 | `translateX(Npx)` |
| `sp-ty` | -600 → +600 | 0 | `translateY(Npx)` |
| `sp-scale` | 30 → 220 | 100 | `scale(N/100)` |
| `sp-rot` | -45 → +45 | 0 | `rotate(Ndeg)` |
| `sp-rotx` | -45 → +45 | 0 | `rotateX(Ndeg)` |
| `sp-roty` | -45 → +45 | 0 | `rotateY(Ndeg)` |
| `sp-persp` | 300 → 3000 | 1200 | `perspective(Npx)` — only applied when rotX or rotY ≠ 0 |

**Composed transform applied to the device element:**
```js
const perspStr = has3d ? `perspective(${t.persp}px) ` : '';
el.style.transform = `${perspStr}translateX(${t.tx}px) translateY(${t.ty}px) scale(${s}) rotate(${t.rot}deg) rotateX(${t.rotX}deg) rotateY(${t.rotY}deg)`;
```

**State storage:** `_transforms[slideId]` — persists per slide for the session. Reset button calls `resetTransform()` which clears the stored state and removes the inline style.

**Device element targeting:** `_getDeviceEl(slideId)` walks the slide looking for `.phone-wrap`, then `.fs-device`, then `.iphone-pro`, `.android-pixel`, `.ipad-pro` in that priority order. Apply the transform to whichever is found.

### Reference image picker: build from the DOM

Do NOT hardcode reference image srcs. Build the grid dynamically at runtime by scanning the page for existing device images:

```js
function _initRefImages() {
  const seen = new Set();
  document.querySelectorAll(
    '.phone-wrap img, .iphone-pro img, .android-pixel img, .ipad-pro img, .showcase img'
  ).forEach(img => {
    const key = img.src.substring(0, 150);
    if (!seen.has(key)) {
      seen.add(key);
      _REF_IMAGES.push({ src: img.src, slideId: img.closest('[id]')?.id });
    }
  });
}
```

This automatically picks up all base64-inlined screenshots already in the page — no duplication of data.

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

## Step 6b: What makes mockups look professional (reference: theapplaunchpad.com)

The difference between bad and good App Store screenshots:

| Bad | Good |
|-----|------|
| Single phone, centered, no context | Phone bleeds off the bottom edge (180px+) — creates drama |
| Generic black background | Brand-colored background with a radial glow **behind** the phone |
| Text above as an afterthought | Big bold headline (140–186px at 1320px canvas) that earns attention at thumbnail scale |
| One layout for all slides | Mix poster slides + multi-phone strip slides in the same set |
| Frame matches screenshot content | Thin metallic frame with screen glass glare (`::after` diagonal gradient) |

### Four slide types every set should include

| Type | Slide ID example | When to use |
|------|-----------------|-------------|
| **Hero poster** | `s1` (`ios-6.9in-poster-1`) | First impression — one big phone + brand statement |
| **Feature poster** | `s2`, `s3` | Each key feature — one phone, focused copy |
| **Multi-phone strip** | `s4` (`ios-6.9in-strip`) | Shows breadth — 3 phones with per-phone labels side by side |
| **Google Play feature** | `s5` (`android-feature`) | Landscape 1024×500 — stacked phones + logo + tags |

All slide types live as inline `<div>` sections inside `preview.html`. No separate HTML files.

### Phone glow technique (essential for premium look)

```css
.phone-glow {
  position: absolute;
  bottom: -100px; left: 50%; transform: translateX(-50%);
  width: 1400px; height: 1000px;
  background: radial-gradient(
    ellipse 55% 50% at 50% 75%,
    rgba(0,232,122,0.20) 0%,    /* brand accent color here */
    rgba(34,211,238,0.08) 40%,
    transparent 65%
  );
  filter: blur(48px);
  pointer-events: none;
  z-index: 0;
}
```
Place this behind the phone frame. The phone appears to emit light. Adjust the rgba color to match brand accent.

### Frame scaling (use `--scale` property)

All device frames use a `--scale` custom property. Set it inline to resize proportionally:
```html
<!-- 860px wide single-phone poster -->
<div class="iphone-pro" style="--scale: 2.19">

<!-- 360px wide in a 3-phone strip -->
<div class="iphone-pro" style="--scale: 0.916">

<!-- 260px wide in preview.html -->
<div class="iphone-pro" style="--scale: 0.661">
```
Scale formula: `desired_px / 393` for iPhone, `desired_px / 270` for Android, `desired_px / 512` for iPad.

### Screen glass glare (makes the frame look real)

Applied via `::after` pseudo-element on `.iphone-pro__screen`:
```css
.iphone-pro__screen::after {
  content: '';
  position: absolute; inset: 0;
  background:
    linear-gradient(90deg, rgba(255,255,255,0.04) 0%, transparent 8%),
    linear-gradient(148deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.06) 8%, rgba(255,255,255,0.00) 22%, transparent 40%);
  border-radius: inherit;
  pointer-events: none;
  z-index: 10;
}
```

### Image path rule (critical — see Step 1 for base64 inlining)

Individual slide files reference `images/s01.png` (no `../`). `preview.html` must have images inlined as base64 data URIs so html2canvas can export without triggering Chrome's tainted canvas security block.

---

## Step 6c: App Store Screenshot Design Patterns (from professional reference sets)

Full analysis: `skills/mockups/references/app-store-analysis.md`

### The 10 slide types — use a mix, not just one layout

| # | Type | Key trait |
|---|------|-----------|
| 1 | **Brand/Identity hero** | No phone or tiny phone. Just brand name + bold claim + stars/badge. Slide 1 ALWAYS. |
| 2 | **Colored background + centered phone** | Solid brand color fill (e.g. lime green, hot pink, orange). Most common feature slide. |
| 3 | **Full bleed lifestyle photo** | Background IS a photo. No phone frame needed. Headline overlaid. |
| 4 | **Dark background + glow** | Dark bg + radial glow behind phone. Best for tech/productivity apps. |
| 5 | **Two overlapping phones** | Back phone smaller + offset + 50% opacity. Shows depth/breadth. |
| 6 | **Tilted perspective phone** | `perspective(1200px) rotateY(-12deg) rotate(3deg)`. Dynamic energy. |
| 7 | **3D character + phone** | Illustrated/3D character next to floating phone. Playful consumer apps. |
| 8 | **Testimonial/social proof** | Stars + quote, NO phone. Or "10M+ Users" as big number. |
| 9 | **Press logos** | "As featured in" + media logos. Credibility. |
| 10 | **Pure copy** | Text only on solid bg. Nike-style confident brand. |

### What Slide 1 must be (brand poster, not a feature)

Slide 1 is a **brand statement**, not a feature pitch. Examples from reference sets:
- "FEEL THE MUSIC VIBE" ← not "Stream 100M songs"
- "ANYTIME ANYWHERE" ← not "Access workouts on any device"
- "Health made simple" ← not "Track your calories"

Slide 1 elements: App name badge + bold 2–3 word claim + stars/award badge (if available). Phone is secondary or absent.

### Background variety rule

**Never use dark (#07070a) for every slide.** Best sets alternate:
- Slide 1: dark with photo or glow
- Slide 2: solid brand color fill (100% saturated)
- Slide 3: dark again
- Slide 4: brand color or light neutral
- Slide 5: social proof (stars + quote on dark or colored)

```css
/* Per-slide background overrides */
#s2 { background: #BFFF00; }  /* brand color — lime, orange, pink, etc. */
#s2 .headline { color: #000; }
#s2 .sub { color: rgba(0,0,0,0.55); }
```

### Typography scale at 1320px canvas

| Element | Size | Weight |
|---------|------|--------|
| Hero headline | 140–186px | 800–900 |
| Feature headline | 90–130px | 700–800 |
| Subtitle | 48–64px | 400–500 |
| Badge/label | 32–40px | 600 |

Rule: Headline must be readable at 200px preview thumbnail width. Short is always better (2–4 words).

### Decorative elements vocabulary

```html
<!-- Floating scattered icons around phone -->
<div class="float-icons">
  <span class="float-icon" style="top:12%;left:8%;transform:rotate(-22deg)">🎵</span>
  <span class="float-icon" style="top:18%;right:6%;transform:rotate(15deg)">🎵</span>
</div>
<style>
.float-icons { position:absolute; inset:0; pointer-events:none; }
.float-icon { position:absolute; font-size:72px; filter:drop-shadow(0 12px 24px rgba(0,0,0,.4)); }
</style>

<!-- Social proof: stars + quote -->
<div class="proof-slide">
  <div class="stars">★★★★★</div>
  <p class="quote">"This app saved me a lot of time."</p>
  <p class="attribution">— Real user review</p>
</div>

<!-- App award / rating badge (slide 1) -->
<div class="award-badge">
  <span class="award-icon">🏆</span>
  <span>#1 Fitness App · 4.8 ★</span>
</div>
```

### Tilted phone CSS
```css
.phone-tilted {
  transform: perspective(1800px) rotateY(-8deg) rotateX(3deg) rotate(2deg);
  transform-origin: center bottom;
}
```

### Two overlapping phones CSS
```css
.phone-back {
  position: absolute;
  transform: scale(0.78) rotate(-5deg) translateY(40px);
  transform-origin: bottom left;
  opacity: 0.5;
  z-index: 1;
}
.phone-front {
  position: relative;
  z-index: 2;
}
```

---

## Step 7: Rules

- **Always scan `output/<project>/site/images/` first** — every image found there is a product screenshot, use it automatically without asking
- **Image paths in preview.html** use `images/<filename>` (relative to `mockups/`) — these get replaced with base64 data URIs by the inlining script. Never use `../site/images/` in preview.html.
- **Always use `object-fit: cover`** on the `<img>` inside a device frame — never let a screenshot stretch the frame
- **Always add descriptive `alt` text** — "App screen showing habit tracker dashboard", not "screenshot"
- **Never deploy `mockups/` to Cloudflare Pages** — it stays local, it's an export tool
- **Scale the frame, not the screenshot** — adjust the frame's `width` to change size; the image fills it automatically
- **On mobile landing pages**, reduce frame width to `min(260px, 80vw)` so phones don't overflow
- **Match the slide background to the brand** — read `site/index.html` CSS variables first; never use generic white or grey
- **At least 3 slides** for App Store — Apple requires a minimum of 3 screenshots per device size
- **Google Play feature graphic (1024×500)**: no device frame — logo + tagline + mini phone stack on brand background

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
