---
description: Generate a LinkedIn banner for a product, project, repo, or idea — auto-extracts branding (colors, fonts, logo, tagline, product screenshots) from websites/repos, or asks the user. Outputs a production-ready 1584x396 HTML file with PNG export, draggable phone mockup elements, and full customization controls.
---

Generate a professional LinkedIn banner as a self-contained HTML file. $ARGUMENTS may contain a product name, website URL, repo path, idea description, or style instructions. Output location is determined automatically — see Step 1B.

---

## Step 1 — Understand what the banner is for

Parse $ARGUMENTS to determine the **subject** of the banner. It could be:

- **A repo/project** (current directory or a path) — "this repo", "demand-planning-system", "../my-project"
- **A product with a website** — "Stripe", "https://linear.app", "Notion"
- **An idea/concept** — "my new AI startup called Synapse"
- **A personal brand** — "my profile as a data engineer"
- **Nothing provided** — default to the current repo/project

### Priority order for figuring out the subject:
1. If $ARGUMENTS contains a URL → that's the product website (go to Step 2A)
2. If $ARGUMENTS names a well-known product → search for its website (go to Step 2A)
3. If $ARGUMENTS references a repo or says "this repo" → analyze the codebase (go to Step 2B)
4. If $ARGUMENTS describes an idea/concept → go to Step 2C
5. If $ARGUMENTS is empty → analyze the current working directory as the project (go to Step 2B)

---

## Step 1B — Resolve the output path

Before doing any branding work, determine where `linkedin-banner.html` will be written.

**The banner always lives inside an `output/<project-name>/` folder** — never at the repo root or anywhere else.

### How to find the right folder

1. **Extract match terms** from the subject identified in Step 1:
   - Break the product/idea name into individual words (e.g. "It Made My Day" → `["it", "made", "my", "day"]`)
   - Also derive the full kebab-case slug (e.g. `it-made-my-day`)
   - From a URL: use the domain name without TLD as the slug, split into words too
   - From a repo path: use the directory name, split on hyphens/underscores

2. **Scan `output/` for candidates**:
   - List all subdirectories of `output/`
   - For each folder, check how many of the match terms appear in the folder name (case-insensitive)
   - Also check for exact or partial slug match
   - Rank folders by number of matching terms — treat 2+ word matches or a slug substring match as a strong candidate
   - Read any `site/index.html` or `SKILL.md` in top candidates to verify what the project actually is

3. **Always confirm with the user** before writing anything:
   - **Strong candidate found** (2+ word matches or slug match):
     > "It looks like this banner might be for your existing project at `output/<folder-name>/`. Is that right, or is this for something different?"
     - If yes → use `output/<folder-name>/linkedin-banner.html`
     - If no → ask what project it's for, or offer to create a new folder
   - **Weak / ambiguous candidates** (1 word match, or multiple possible folders):
     > "I found a few existing projects that might be related — `output/folder-a/`, `output/folder-b/`. Is this banner for one of those, or is it for a new project?"
     - List each candidate with a one-line description pulled from its `SKILL.md` or `site/index.html` title
     - Wait for user to confirm or name the correct folder
   - **No match found**:
     > "I didn't find an existing project in `output/` for this. I'll create `output/<slug>/` — does that work, or should I put it somewhere else?"

4. **Write to the confirmed path** once the user has confirmed (or accepted the default).

> Note: `linkedin-banner.html` is a design tool, not a deployable page — it sits at the project root alongside `SKILL.md` and `.impeccable.md`, not inside `site/`.

---

## Step 2A — Extract branding from a website

Use the `gstack` browser skill or `WebFetch` to visit the product's website and extract:

1. **Logo** — Find the logo image:
   - Look for `<img>` tags in the header/nav with alt text containing "logo", or class/id containing "logo"
   - Look for `<svg>` logos inline in the HTML
   - Check `/favicon.ico`, `/logo.png`, `/logo.svg` at the domain root
   - Check `<link rel="icon">` or `<link rel="apple-touch-icon">` in `<head>`
   - Check Open Graph meta: `<meta property="og:image">`
   - **Save the best logo URL** — prefer SVG > PNG > favicon. If it's an SVG inline, extract the SVG code.

2. **Brand colors** — Extract the color palette:
   - Read CSS custom properties (`:root { --primary: ... }`)
   - Check the most prominent background colors and text colors on the page
   - Look at button colors, link colors, accent colors
   - Check `<meta name="theme-color">`
   - Identify: primary color, secondary color, accent color, background color

3. **Typography** — Identify fonts:
   - Check `font-family` declarations in CSS
   - Look for Google Fonts `<link>` tags or `@import` statements
   - Note heading vs body font if different

4. **Tagline / value proposition**:
   - Read the hero section headline and subheadline
   - Check `<meta name="description">` and `<meta property="og:description">`
   - Look for a concise value prop (1 line)

5. **Product name**:
   - From `<title>`, `<meta property="og:title">`, or the logo alt text

6. **Product screenshots / visual assets**:
   - Look for `<img>` tags showing the product in use (app screenshots, phone mockups, dashboard views)
   - Check for image paths like `/images/`, `/screenshots/`, `/assets/` — fetch a selection (3-5 best ones)
   - Check for App Store / Play Store badges and associated preview images
   - Resize fetched images to reasonable dimensions (height ~300-400px) and convert to base64 for embedding
   - These will populate the **Elements Library** so the user can drag them onto the banner

After extraction, **confirm with the user**:
> "I found the following branding for **[Product Name]**:
>
> - **Logo**: [found at URL / extracted SVG / not found]
> - **Colors**: primary `#xxx`, secondary `#xxx`, accent `#xxx`
> - **Font**: [font name]
> - **Tagline**: "[extracted tagline]"
>
> I'll also need from you:
> 1. **What are you promoting?** — e.g. "I'm a developer advocate for this product", "I built this", "We just launched v2.0", "I'm hiring for this team"
> 2. **Your name/title** (for the banner) — or should I leave it as just the product?
> 3. **Any adjustments** to the colors/tagline above?
> 4. **Style preference** — Minimal, Bold, Gradient, Tech, or Creative (I'll suggest one based on the brand)"

---

## Step 2B — Extract branding from a repo/project

Analyze the codebase to understand what the project is:

1. **Project identity** — Read these files (whichever exist):
   - `README.md` — project name, description, badges, screenshots
   - `package.json` / `pyproject.toml` / `build.gradle` / `Cargo.toml` / `go.mod` — name, description
   - `CLAUDE.md` — project overview
   - `.github/` or CI config — repo metadata
   - `docs/` — any documentation site config (`docusaurus.config.js`, `mkdocs.yml`)

2. **Existing branding** — Search for brand assets:
   - `public/` or `static/` or `assets/` directories for logos, favicons, brand images
   - CSS/Tailwind config for color themes (`tailwind.config.*`, `theme.ts`, `variables.css`, `:root` custom properties)
   - Look for `brand`, `logo`, `favicon`, `icon` in filenames
   - Check if there's a documentation site with its own branding/theme

3. **Tech stack** — Identify key technologies (useful for visual motifs):
   - Languages, frameworks, major libraries
   - Is it a CLI tool, web app, API, library, mobile app?

4. **Tagline** — Derive from:
   - README first line or description
   - package.json description field
   - Documentation site hero text

After extraction, **confirm with the user**:
> "I've analyzed the project **[Project Name]**:
>
> - **What it does**: [1-line summary]
> - **Logo**: [found at path / not found — will use text-based design]
> - **Colors**: [extracted from theme / will design fresh]
> - **Tech stack**: [key technologies]
> - **Suggested tagline**: "[derived tagline]"
>
> I need from you:
> 1. **What's the banner for?** — promoting the project itself, your work on it, a launch, hiring, a talk/blog about it?
> 2. **Your name/role** (optional) — include on the banner or keep it product-only?
> 3. **Logo**: [if not found] Can you provide a logo path or URL? Or should I create a text-based logo?
> 4. **Style preference** — I'd suggest **[style]** based on the project. Change it?"

---

## Step 2C — Build branding for an idea/concept

When the user describes something that doesn't exist yet:

Ask:
> "I'll design a banner for **[idea name]**. I need a few things:
>
> 1. **One-line description** — what does it do?
> 2. **Target audience** — developers? businesses? consumers? designers?
> 3. **Mood/vibe** — professional, playful, futuristic, minimal, bold?
> 4. **Colors** (optional) — any preference, or should I design a palette that fits the vibe?
> 5. **Logo** — do you have one (path/URL)? Or should I create a text-based logo mark?
> 6. **Tagline** — e.g. "AI-powered demand forecasting" or should I suggest one?
> 7. **What are you promoting?** — the product launch, your role building it, a concept, a community?"

---

## Step 3 — Design the banner

### Layout & Composition Rules
- **Canvas**: Exactly 1584 × 396 px (LinkedIn recommended). Export at 2× for Retina/4K: 3168 × 792 px.
- **Safe zone — profile photo**: The LinkedIn profile photo is a **circle (~310px diameter)** positioned at the **bottom-left of the banner**, with its center approximately at the banner's bottom edge (x≈155px, y≈396px in banner coordinates). It intrudes as an arc into the bottom-left ~155px of the banner. **Content must start at x ≥ 440px from the left** to be safely past the photo at all heights. A left gradient fade (`left-fade`) from x=0 to ~480px masks the decorative left zone gracefully.
- **Safe zone — mobile crop**: Important content must be in the middle 60% of height (top/bottom 54px are cropped on mobile).
- **Profile photo zone — what NOT to place**: No logo, text, CTAs, or key visuals in the bottom-left circular region below x=440px and below y=220px. Decorative node graphs, dot patterns, and background gradients may extend into this zone — they read as design texture behind the photo.
- **Logo placement**: Right side or center-right of the content area. Never bottom-left. Ideal: right-aligned, vertically centered.
- **Visual hierarchy**: Product/project name largest → tagline → promotion text → your name/role smallest
- **Rule of thirds**: Key elements on 1/3 and 2/3 grid lines

### Logo Handling
- **If SVG found/provided**: Embed directly as inline `<svg>` in the banner HTML — scales perfectly
- **If PNG/JPG URL found**: Embed as `<img>` with the URL, AND convert to base64 data URI so the HTML works offline. Use `fetch()` in the generation script or instruct the user to update if offline use matters.
- **If logo file is local**: Read the file, convert to base64 data URI, embed as `<img src="data:image/png;base64,...">`
- **If no logo available**: Create a **text-based logo mark** using CSS:
  - First letter or initials in a colored circle/rounded-square
  - Or the product name in a distinctive font with a decorative accent
  - Make it look intentional, not like a missing image

### Typography
- Use **Google Fonts via @import** (self-contained HTML loads fonts from CDN)
- Match the product's actual font if identified. Otherwise, select based on vibe:
  - **SaaS/Professional**: Inter, Plus Jakarta Sans, General Sans
  - **Developer tools**: JetBrains Mono, Fira Code, Space Grotesk
  - **Creative/Consumer**: Poppins, Outfit, Sora
  - **Editorial/Premium**: Playfair Display, Fraunces, Libre Baskerville
- Max 2 font families. Heading: bold (600-900), body: regular (400)
- Minimum text size: 18px. Heading letter-spacing: 1-3px.

### Color
- **Use the extracted brand colors** as the foundation
- Build a harmonious 4-color system: primary, secondary, accent, background
- Ensure WCAG AA contrast (4.5:1) for all text
- Use CSS custom properties: `--primary`, `--secondary`, `--accent`, `--bg`, `--text`
- If brand has only 1-2 colors, derive the rest using complementary/analogous color theory

### Content Layout (what goes on the banner)
Structure the banner content in this hierarchy:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ x=0                x=310  x=440                                              │
│ ╔══════════════════╗   |    |                                                 │
│ ║  decoration/     ║   |    │   [LOGO]  Product Name  (56–72px, bold)        │
│ ║  node-graph/     ║   |    │   "Tagline or value proposition"  (20–24px)    │
│ ║  dot-grid        ║ photo  │   Platform · subtitle line  (13–14px mono)     │
│ ║  (behind photo)  ║  arc   │                                                 │
│ ╚══════════════════╝ <────> │   [CTA button — drag anywhere]                 │
│  profile photo circle       │                                                 │
│  (center at y=396,          ▲                                                 │
│   right edge ~310px)    safe content boundary (440px)                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

Set `#banner-content { position: absolute; left: 440px; right: 52px; top: 0; bottom: 0; display: flex; align-items: center; }` so all content starts past the profile photo zone.

- **Logo + Product name**: Most prominent, right-of-center or center
- **Tagline**: Below or beside the product name, slightly smaller
- **Promotion context**: What the user is promoting (e.g. "Now hiring engineers", "Just launched v2.0", "Speaker at ReactConf 2025") — subtle but visible
- **User's name/role**: If included, smallest text, positioned as a subtle attribution
- **Decorative elements**: Brand-consistent shapes, patterns, or motifs that fill space without competing

### Visual Elements
- Use CSS shapes: `border-radius`, `clip-path`, `transform` for geometric elements
- Subtle patterns via CSS gradients for texture
- Brand-consistent decorative motifs:
  - Dev tools → code brackets, terminal prompts, grid patterns
  - Data products → chart-like lines, node graphs
  - Design tools → color swatches, geometric shapes
  - Business/SaaS → clean lines, subtle grid, professional polish
- Use `box-shadow` and `backdrop-filter` for depth

---

## Step 4 — Generate the HTML file

Write a single self-contained HTML file to the path resolved in Step 1B (`output/<project-name>/linkedin-banner.html`). Create the directory if it doesn't already exist.

### Required features

1. **The banner** — 1584x396px div with logo, text, decorative elements, and background
2. **Logo embedded** — as inline SVG, base64 data URI, or CSS text-logo (never a broken external reference)
3. **PNG export button** — uses `html2canvas` (loaded as a **blocking `<script src>` tag** placed before `</body>`, not on-demand inside the export function). Load it with SRI integrity so it works offline once cached:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
     integrity="sha512-BNaRQnYJYiPSqHHDb58B0yaPfCu+Wgds8Gp/gU33kqBtgNS4tSPHuGibyoeqMV/TJlSKda6FXzoEyYGjTe+vXA=="
     crossorigin="anonymous"></script>
   ```
   **Do NOT load html2canvas on-demand inside `exportPNG()`.** On-demand loading is unreliable: the script fires after the banner scale has already been reset to 1 (banner at full 1584px during the CDN request), and if the CDN load fails the `onerror` event has no `.message` so the catch block toasts "Export failed: undefined" — no indication to the user of what went wrong. Always use the blocking tag.

   Captures `#banner` div at **2K resolution** (3168 × 792). Critical implementation rules:

   **Export must match the browser preview exactly.** There are two known bugs to fix:

   **Bug 1 — White margins on right/top/bottom in exported PNG (parent transform)**:
   The banner preview is scaled to fit the viewport via `transform: scale(s)` on the `#banner-scale` wrapper. html2canvas mis-renders elements inside a CSS-transformed parent — the banner content only fills `s` fraction of the canvas, leaving white space on the right (and sometimes top/bottom). This appears in LinkedIn's crop dialog as gray/white padding around the image content.

   Fix: **reset the parent transform to `scale(1)` before calling html2canvas, then restore it in `finally`**:
   ```javascript
   const bannerSc = document.getElementById('banner-scale');
   const savedTransform = bannerSc.style.transform;
   const savedOrigin    = bannerSc.style.transformOrigin;
   bannerSc.style.transform       = 'scale(1)';
   bannerSc.style.transformOrigin = 'top left';
   try {
     const canvas = await html2canvas(banner, { ... });
     // ... download
   } finally {
     bannerSc.style.transform       = savedTransform;
     bannerSc.style.transformOrigin = savedOrigin;
     // also restore hidden UI chrome here
   }
   ```
   The banner will momentarily snap to full size during capture (brief, invisible to users in practice). The `finally` block always restores the preview scale, even on error.

   **Bug 2 — Missing spaces in text (html2canvas contenteditable + `onclone` bug)**:
   When a `contenteditable` element wraps text across multiple lines, the browser internally splits it into multiple text nodes. html2canvas concatenates them without spaces → "whereverit lives" instead of "wherever it lives".

   Naive fix that **does NOT work**: reading `el.innerText` inside `onclone`. The `onclone` callback receives a cloned document that is **detached from the DOM** — no layout is computed, so `innerText` cannot determine line breaks and returns the same broken result.

   **Correct fix**: capture `innerText` from the **live** elements **before** calling `html2canvas`, then inject in `onclone`:
   ```javascript
   // Step 1 — capture BEFORE html2canvas (live DOM has layout)
   const liveTexts = new Map();
   banner.querySelectorAll('[contenteditable]').forEach((el, i) => {
     liveTexts.set(i, el.innerText.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim());
   });

   // Step 2 — inject in onclone (clone is detached, no layout; use pre-captured strings)
   html2canvas(banner, {
     onclone: (_doc, clonedEl) => {
       clonedEl.querySelectorAll('[contenteditable]').forEach((el, i) => {
         el.removeAttribute('contenteditable');
         if (liveTexts.has(i)) el.textContent = liveTexts.get(i);
       });
     }
   });
   ```
   Use `querySelectorAll('[contenteditable]')` (no value filter) — this catches both `"true"` and `"false"` values, including the CTA inner which starts as `"false"`.

   **Bug 3 — Fonts not loaded / wrong metrics**:
   Always `await document.fonts.ready` before calling `html2canvas`. This ensures Google Fonts (loaded async) are fully available so html2canvas measures text correctly.

   **Before capture**: set `visibility: hidden` on all interactive chrome (remove buttons, resize handles, opacity controls, safe zone overlay, selection bounding box). Restore in the `finally` block — always, even on error.

   **Export settings**:
   - `scale: 2` → 3168 × 792 output (2K — LinkedIn accepts this for Retina/4K displays)
   - `useCORS: true`, `allowTaint: false` (for external image URLs)
   - `backgroundColor: null` (preserve transparent areas)

   - **Filename**: `<project-slug>-linkedin-banner-2k.png` — baked in at generation time. Never a generic name.
   - **Post-export message**: show a toast telling the user the file downloaded to their Downloads folder and to move it to `output/<project-name>/`.

4. **Live text editing** — banner text elements have `contenteditable="true"` set directly in the HTML (brand name, tagline, platform line). They are always editable; no click-to-enable needed. The `makeDraggable` guard (`e.target.closest('[contenteditable="true"]')`) automatically prevents accidental drags on text. Exception: the CTA inner uses the double-click pattern (see CTA spec).
5. **Color palette controls** — color pickers that update CSS custom properties in real time:
   - Primary, Secondary, Accent, Background, Text color
   - Show current hex values
   - "Reset to original" button
6. **Logo swap** — a file input that lets the user upload a different logo image (replaces the current one in the banner via FileReader → data URI)
7. **Style variants** — 3-4 pre-designed variations:
   - **Original** (extracted brand colors)
   - **Dark mode** (dark bg, light text, same accent)
   - **Light mode** (light bg, dark text, same accent)
   - **Monochrome** (single brand color + black/white)
8. **Safe zone overlay toggle** — shows profile photo zone and mobile crop guides. The profile photo indicator MUST be rendered as a **circle** at the bottom-left (NOT a rectangle), partially clipped by the banner's `overflow: hidden`. Also render a vertical dashed content-boundary line at x=440px labeled "Safe content zone →":
   ```css
   /* Profile photo arc — circle positioned so center is at the banner bottom edge */
   .sz-photo {
     position: absolute;
     left: 0; bottom: -155px;   /* center sits at y=396, barely below banner bottom */
     width: 310px; height: 310px;
     border-radius: 50%;
     border: 2px dashed rgba(255,80,80,.75);
     background: rgba(255,0,0,.07);
   }
   /* Content boundary line */
   .sz-content-line {
     position: absolute;
     left: 440px; top: 0; bottom: 0;
     width: 0; border-left: 1.5px dashed rgba(0,220,180,.55);
   }
   ```
   The `#safe-overlay` container needs `overflow: visible` so the circle arc is not clipped at the banner edge.
9. **Scaled preview** — 50% scale preview showing realistic LinkedIn appearance
10. **Elements Library** — a panel for adding visual elements (product screenshots, phone mockups, etc.) to the banner:

    **Thumbnail generation** — Define screenshots as a JS array `const SS = [...]` of relative paths (or base64 URIs), then build thumbnails programmatically — do NOT use inline `onclick` attributes in HTML. The JS approach is reliable; inline `onclick` with relative paths has cross-browser quirks:
    ```javascript
    const SS = ['site/images/screenshot-home.png', 'site/images/screenshot-detail.png', ...];
    SS.forEach(url => {
      const img = document.createElement('img');
      img.className = 'ss-th';
      img.src = url;
      img.title = 'Click to add as phone mockup';
      img.addEventListener('click', () => addMockup(url));
      document.getElementById('ss-grid').appendChild(img);
    });
    ```

    **Thumbnail CSS** — use `object-fit: contain` (NOT `cover`) with `width: <fixed>px; height: auto` and a dark background so portrait phone screenshots show at their true aspect ratio:
    ```css
    .ss-th { width:52px; height:auto; object-fit:contain; background:#111;
             border-radius:6px; border:2px solid transparent; cursor:pointer; display:block; }
    .ss-th:hover { border-color: var(--primary); }
    ```

    **Element factory** — all draggable elements (phone mockups and free images) are created via a shared `makeElem(w, x, y)` factory. This keeps drag/resize wiring consistent and avoids duplicate code:
    ```javascript
    function makeElem(w, x, y) {
      const el = document.createElement('div');
      el.className = 'elem';
      el.style.cssText = `width:${w}px; left:${x}px; top:${y}px;`;
      const rm = document.createElement('div');
      rm.className = 'elem-rm'; rm.textContent = '✕';
      rm.onclick = e => { e.stopPropagation(); el.remove(); deselect(el); updateSelBox(); };
      el.appendChild(rm);
      document.getElementById('elems').appendChild(el);
      makeDraggable(el);
      makeResizable(el);   // creates .rh handles inside the element
      return el;
    }
    ```

    **`addMockup(src)`** — creates the element at x ≈ 980 (right side, clear of text), y ≈ 16–36 (slight random offset so stacked mockups don't perfectly overlap):
    ```javascript
    function addMockup(src) {
      const el = makeElem(150, 980 + Math.random()*60|0, 16 + Math.random()*20|0);
      const frame = document.createElement('div');
      frame.className = 'phone-frame';
      const img = document.createElement('img');
      img.src = src;
      img.style.cssText = 'display:block; width:100%; height:auto;';
      frame.appendChild(img);
      el.insertBefore(frame, el.firstChild);
    }
    ```

    **Drag** — uses `document.addEventListener` (NOT `window.addEventListener`) for `mousemove`/`mouseup`. Captures starting positions for all selected elements at mousedown, applies delta on move:
    ```javascript
    function makeDraggable(el) {
      el.addEventListener('mousedown', e => {
        if (e.target.classList.contains('elem-rm') ||
            e.target.classList.contains('rh') ||
            e.target.closest('[contenteditable="true"]')) return;
        if (!e.shiftKey) { if (!SEL.has(el)) { clearSel(); select(el); } }
        else             { SEL.has(el) ? deselect(el) : select(el); }
        const sc = banner.getBoundingClientRect().width / 1584;
        const sx = e.clientX, sy = e.clientY;
        const starts = new Map();
        SEL.forEach(s => starts.set(s, { x: parseFloat(s.style.left)||0, y: parseFloat(s.style.top)||0 }));
        const onMove = mv => {
          const dx=(mv.clientX-sx)/sc, dy=(mv.clientY-sy)/sc;
          SEL.forEach(s => { const st=starts.get(s); if(st){ s.style.left=(st.x+dx)+'px'; s.style.top=(st.y+dy)+'px'; } });
          updateSelBox();
        };
        const onUp = () => { document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseup',onUp); };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        e.preventDefault();
      });
    }
    ```

    **Resize** — `makeResizable(el)` creates all 8 `.rh` handles inside the element and attaches `document.addEventListener` per handle:
    ```javascript
    function makeResizable(el) {
      ['nw','n','ne','w','e','sw','s','se'].forEach(dir => {
        const h = document.createElement('div');
        h.className='rh'; h.dataset.d=dir;
        el.appendChild(h);
        h.addEventListener('mousedown', e => {
          e.stopPropagation(); e.preventDefault();
          const sc=banner.getBoundingClientRect().width/1584;
          const sx=e.clientX, sy=e.clientY;
          const startW=el.offsetWidth, startH=el.offsetHeight;
          const startX=parseFloat(el.style.left)||0, startY=parseFloat(el.style.top)||0;
          const aspect=startW/(startH||1);
          const onMove = mv => {
            const dx=(mv.clientX-sx)/sc, dy=(mv.clientY-sy)/sc;
            let nW=startW,nH=startH,nX=startX,nY=startY;
            if(dir==='se'||dir==='s'||dir==='sw') nH=Math.max(20,startH+dy);
            if(dir==='se'||dir==='e'||dir==='ne') nW=Math.max(20,startW+dx);
            if(dir==='sw'||dir==='w'||dir==='nw'){ nW=Math.max(20,startW-dx); nX=startX+(startW-nW); }
            if(dir==='ne'||dir==='n'||dir==='nw'){ nH=Math.max(20,startH-dy); nY=startY+(startH-nH); }
            if(dir==='se'||dir==='ne'||dir==='sw'||dir==='nw') nH=nW/aspect;
            el.style.left=nX+'px'; el.style.top=nY+'px'; el.style.width=nW+'px'; el.style.height=nH+'px';
            updateSelBox();
          };
          const onUp = () => { document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseup',onUp); };
          document.addEventListener('mousemove',onMove); document.addEventListener('mouseup',onUp);
        });
      });
    }
    ```

    **CSS for elements** — handles are hidden by default, shown only when `.solo` (single selection):
    ```css
    .elem { position:absolute; cursor:grab; z-index:10; user-select:none; }
    .elem:active { cursor:grabbing; }
    .elem-rm { position:absolute; top:-9px; right:-9px; width:20px; height:20px;
               background:#e63946; color:#fff; border-radius:50%; font-size:11px; font-weight:700;
               display:none; align-items:center; justify-content:center; cursor:pointer; z-index:60; }
    .elem:hover .elem-rm { display:flex; }
    .rh { position:absolute; width:9px; height:9px; background:var(--primary);
          border:1.5px solid #fff; border-radius:2px; z-index:60; display:none; }
    .elem.solo .rh { display:block; }
    /* rh[data-d] positions: nw/n/ne/w/e/sw/s/se — top:-4px, left/right/center as appropriate */
    .phone-frame { border-radius:20px; overflow:hidden;
                   border:2px solid rgba(255,255,255,.15);
                   box-shadow:0 12px 48px rgba(0,0,0,.22); }
    .phone-frame img { display:block; width:100%; height:auto; }
    .free-img { display:block; width:100%; height:auto; border-radius:6px; }
    .op-ctrl { position:absolute; bottom:calc(100% + 5px); left:0; right:0;
               background:rgba(0,0,0,.88); padding:5px 8px; display:none;
               align-items:center; gap:7px; font-size:10px; border-radius:5px; z-index:65; }
    .elem:hover .op-ctrl { display:flex; }
    ```

    - **Remove button**: `.elem-rm` appears on hover; `onclick` stops propagation and calls `el.remove(); deselect(el); updateSelBox()`
    - **Upload custom**: `FileReader → readAsDataURL → addMockup(result)` or `spawnFree(result)`
    - **Add from URL**: read value, call `addMockup(url)` or `spawnFree(url)`, clear input
    - **Clear all**: `document.getElementById('elems').innerHTML = ''; removeCTA(); clearSel();`
    - **Export-safe**: `visibility:hidden` on `.elem-rm,.rh,.op-ctrl,#safe-overlay,#sel-box` before capture, restored in `finally`
    - For repos (Step 2B), search for screenshots in README, docs, or `public/` directories. For ideas (Step 2C), skip this feature unless the user provides images.
11. **Free Images** — a separate panel for adding arbitrary images to the banner without a phone frame:
    - **Upload or paste URL**: Multi-file upload and URL input, same as Elements Library
    - **No frame**: Images are placed directly on the banner with no phone bezel — suitable for logos, icons, illustrations, decorative graphics, or any visual asset
    - **Drag & resize**: Same drag-to-reposition and corner-resize as phone mockups, maintaining natural aspect ratio
    - **Opacity control**: Each free image has a hover-activated control bar with a slider (0-100%) to adjust opacity in real time
    - **Layer ordering**: Up/down buttons on each image to bring forward or send backward (z-index control)
    - **Remove**: X button on hover to delete individual images
    - **Export-safe**: Opacity values are preserved in PNG export; control bars are hidden during capture
12. **Call to Action (CTA)** — a draggable, editable CTA element with multiple unique visual styles:
    - **6 style presets**, each with a distinctive visual identity:
      - **Neon Pill**: Glowing outline button with brand primary color
      - **Gradient**: Solid gradient button (primary → secondary) with bold text
      - **Glitch Tag**: Cyberpunk-inspired bar with colored side borders and scan lines
      - **Live Badge**: Accent-colored badge with pulsing dot indicator
      - **Glass Card**: Frosted glass morphism card with arrow
      - **Terminal**: CLI-style prompt with blinking cursor (e.g. `$ brew install agentchat`)
    - **Quick text presets**: Personal LinkedIn-style CTAs like "Follow me for more", "Subscribe to my newsletter", "Try it out today", "Let's connect", "DM me for early access", "Link in comments", "We're hiring — reach out", etc.
    - **Custom text input**: A text field where users can type their own CTA text and apply it
    - **Drag to move, double-click to edit** — CRITICAL pattern:
      - The CTA inner element must start as `contenteditable="false"` (not `"true"`). This is required because `makeDraggable` contains a guard: `if (e.target.closest('[contenteditable="true"]')) return` — if the inner is `"true"` by default, dragging is permanently blocked.
      - **Single click** → selects and drags the CTA (works because `contenteditable="false"` bypasses the guard)
      - **Double-click** on the inner text → sets `contentEditable = 'true'`, focuses the element, places the caret at end. The guard now fires and blocks drag while editing. Set `cursor: text; user-select: auto`.
      - **Blur** → sets `contentEditable = 'false'`, saves `ctaText`, restores `cursor: grab; user-select: none`
      - Show `title="Drag to move · Double-click to edit text"` as a native tooltip
    - **Initial position — CRITICAL**: Never set the CTA's initial position via CSS `bottom`/`right`. The drag code reads `style.left` and `style.top` (which are empty when CSS handles position), causing a position jump on first drag. Instead, after appending to the DOM, use `requestAnimationFrame(() => { ... })` to call `getBoundingClientRect()` on both the banner and the CTA element, compute `left` and `top` in banner-space (dividing by the current scale factor), and set them as inline styles. Clear any `bottom`/`right` inline styles.
    - **Smart defaults**: CTA is positioned bottom-right of the content area by default. Each style has a fitting default text (neon-pill → "Follow me for more", badge → "Subscribe to my newsletter", terminal → CLI install command, glass → "Let's connect", etc.)
    - **One active CTA**: Switching styles replaces the current CTA; "Remove CTA" clears it
    - The tone should always be **personal and inviting** — these are LinkedIn banners, so CTAs should drive follows, connections, newsletter signups, or personal engagement, not hard product marketing. Think "Follow me", "Subscribe", "Let's connect", "Try it out", "DM me".
13. **Multi-Select** — select multiple elements and move/resize them as a group:

    **Selection state** — use a `Set` (not an array or class toggle) so membership checks are O(1):
    ```javascript
    const SEL = new Set();
    function select(el)   { SEL.add(el);    refreshSel(); }
    function deselect(el) { SEL.delete(el); refreshSel(); }
    function clearSel()   { SEL.forEach(e => e.classList.remove('solo')); SEL.clear(); refreshSel(); }
    function selectAll()  { document.querySelectorAll('.elem,.cta-elem').forEach(select); }
    function refreshSel() {
      SEL.forEach(e => e.classList.toggle('solo', SEL.size === 1));
      // update status bar count, updateSelBox(), etc.
    }
    ```

    - **Click** any element → `clearSel(); select(el)` (handled inside `makeDraggable` mousedown)
    - **Shift+Click** → `SEL.has(el) ? deselect(el) : select(el)` (also inside `makeDraggable`)
    - **Drag** moves all `SEL` elements together — `makeDraggable` records `starts` for every element in SEL at mousedown, applies the same delta to all on mousemove
    - **Group bounding box** (`#sel-box`): when `SEL.size >= 2`, compute `minX/minY/maxX/maxY` from `getBoundingClientRect()` of each element, draw the box, attach 8 `.sbh` group-resize handles. Clone each `.sbh` node to wipe old listeners before re-attaching (prevents duplicate mousedown handlers accumulating across selection changes).
    - **Group resize**: record each element's fractional position/size within the bounding box (`fx = (x-minX)/boxW`). On move, compute new box edges, reapply: `el.left = newMinX + fx*newBoxW; el.width = fw*newBoxW`.
    - **`#sel-box` in HTML**: place as a sibling of `#elems` and `#cta-wrap` inside `#banner`, with 8 `.sbh` divs pre-rendered (JS clones them to reset listeners, so they must exist):
      ```html
      <div id="sel-box">
        <div class="sbh" data-d="nw"></div><div class="sbh" data-d="n"></div>
        <div class="sbh" data-d="ne"></div><div class="sbh" data-d="w"></div>
        <div class="sbh" data-d="e"></div><div class="sbh" data-d="sw"></div>
        <div class="sbh" data-d="s"></div><div class="sbh" data-d="se"></div>
      </div>
      ```
    - **Escape** to `clearSel()`; **Select All** button calls `selectAll()`
    - A fixed status bar at the bottom shows selection count and hints, hidden when `SEL.size === 0`
    - `visibility:hidden` on `#sel-box` and `.rh` before PNG capture, restored in `finally`

    **Required HTML structure inside `#banner`**:
    ```html
    <div id="banner">
      <!-- decorative elements (blobs, dot-grid, left-fade) -->
      <div id="banner-content">...</div>   <!-- text, always z-index:3 -->
      <div id="elems"></div>               <!-- all phone mockups + free images appended here -->
      <div id="cta-wrap"></div>            <!-- CTA element appended here -->
      <div id="sel-box"><!-- 8 .sbh handles --></div>
      <div id="safe-overlay">...</div>
    </div>
    ```
    Never append `.elem` elements directly to `#banner` — always to `#elems`.

### Layout: Tabbed Controls (single-screen)
All controls MUST fit on one screen without scrolling. Use a **tabbed interface** below the banner:
- **Tab bar** with 3 tabs: **Elements** | **CTA** | **Style**
  - **Elements tab**: Phone Mockups (thumbnail grid) + Free Images (upload/URL) side by side
  - **CTA tab**: Style presets (6 buttons) + Text presets + custom input, all in one row
  - **Style tab**: Color pickers + Variant buttons + **per-line text color pickers** side by side
- **Always-visible actions strip** on the right of the tab bar: Upload Logo, Safe Zones, Clear All, Export as PNG
- **Preview** is collapsible (hidden by default, toggled by a "Show Preview" button) to save vertical space
- `body { padding: 0 }` — **no side padding on body**. Add padding only to the preview wrapper and tab content panels. This lets the banner scale to the full viewport width.

### Per-line text color pickers (Style tab)
Add individual color pickers for **each text row** in the banner — not just global CSS variables. A global `--text` variable is not enough because different rows typically use different colors (e.g. product name = white, tagline = muted white, platform line = brand green). Required pickers:
- **Product Name** color (default matches `--text`)
- **Tagline** color (default: muted `--text` at ~52% opacity — store as a solid hex, control opacity separately if needed)
- **Platform / subtitle line** color (default: `--primary`)
- A **Reset** button that restores all three to their original per-line defaults

Wire each picker with `oninput` to directly set `element.style.color`. In the export `onclone`, inline `style.color` is preserved automatically — no extra work needed.

### Code quality
- All CSS in `<style>` block with CSS custom properties
- Clean, commented sections
- No external deps except Google Fonts CDN and html2canvas CDN
- Works by opening the HTML file directly in a browser (file:// protocol)
- Logo must be embedded (base64 or inline SVG), not an external URL that might break

---

## Step 5 — Present to the user

After writing the file:

1. Confirm the full output path (e.g. `output/my-project/linkedin-banner.html`) and whether it was placed in an existing project folder or a newly created one
2. Tell the user:
   > "Your **[Product Name]** LinkedIn banner is ready! Open `output/[project-name]/linkedin-banner.html` in your browser.
   >
   > **What's in it:**
   > - [Product logo] + "[tagline]" + "[promotion text]"
   > - Colors matched to [product]'s branding: `#primary`, `#secondary`, `#accent`
   > - Font: [font name] (matches [product]'s style)
   >
   > **Customize it:**
   > - **Text**: Click any text on the banner to edit directly
   > - **Colors**: Use color pickers to adjust the palette, or switch between Original / Dark / Light / Mono variants
   > - **Logo**: Click "Upload Logo" to swap in a different image
   > - **Phone Mockups**: Click product screenshots to add phone-framed mockups — drag to reposition, resize from corner, hover to remove
   > - **Free Images**: Upload any image (logo, icon, graphic) — no frame, with opacity slider and layer ordering on hover
   > - **Call to Action**: Pick a CTA style (Neon Pill, Gradient, Glitch, Badge, Glass, Terminal), choose a preset text or type your own — drag to position anywhere
   > - **Multi-Select**: Click to select, Shift+Click to add more, drag/resize the group together. Escape to deselect. Select All button in the floating bar.
   > - **Safe Zones**: Toggle overlay to check profile photo coverage and mobile crop areas
   > - **Export**: Click **Export as PNG** when you're happy — all elements, opacity, and positions are preserved. The file downloads as `<project-slug>-linkedin-banner.png` to your browser's Downloads folder. A message will tell you to move it to `output/<project-name>/` so it lives alongside the HTML file.
   >
   > Upload to LinkedIn: Profile → Edit → Camera icon on banner."

---

## Implementation Pitfalls — Lessons from Production

These are bugs discovered during real builds. Apply every rule below proactively.

### 1. Banner viewport — fill the full width
Set `body { padding: 0 }`. Do NOT put horizontal padding on the body. Add padding only to the control panel tab content and preview wrapper. The `scaleBanner()` function reads the banner-wrap container width and computes `scale = Math.min(1, containerWidth / 1584)`. If body has 16px side padding, the scale is reduced and the banner looks smaller than it should. The scaling function must also set the wrapper's `height` to `396 * scale` to prevent an empty gap below the scaled banner:
```javascript
function scaleBanner() {
  const wrap = document.getElementById('banner-wrap');
  const sc   = document.getElementById('banner-scale');
  const s    = Math.min(1, wrap.offsetWidth / 1584);
  sc.style.transform = `scale(${s})`;
  sc.style.transformOrigin = 'top center';
  sc.style.width = '1584px';
  wrap.style.height = (396 * s) + 'px';
}
window.addEventListener('resize', scaleBanner);
scaleBanner();
```

### 2. CTA dragging — never use CSS bottom/right for initial position
The drag system reads `parseFloat(el.style.left)` and `parseFloat(el.style.top)`. If position is set via CSS `bottom/right` (not inline `style.left/top`), both return `NaN → 0`, and the element jumps to (0,0) relative to the first drag delta. Always set initial position in JS after mount:
```javascript
requestAnimationFrame(() => {
  const bRect = banner.getBoundingClientRect();
  const wRect = wrap.getBoundingClientRect();
  const scale = bRect.width / 1584;
  wrap.style.left   = ((wRect.left - bRect.left) / scale) + 'px';
  wrap.style.top    = ((wRect.top  - bRect.top)  / scale) + 'px';
  wrap.style.bottom = '';
  wrap.style.right  = '';
});
```

### 3. CTA contenteditable — drag blocked by default
`makeDraggable` bails if `e.target.closest('[contenteditable="true"]')`. If the CTA inner starts as `contenteditable="true"`, dragging is permanently blocked because every click on the CTA text triggers the guard. Always start the CTA inner as `contenteditable="false"`. Use the double-click-to-edit pattern (see CTA spec). The export `onclone` uses `querySelectorAll('[contenteditable]')` (no value) so it still processes `"false"` elements — no change needed there.

### 4. html2canvas text spaces disappear — and the naive onclone fix is broken
When a `contenteditable` element wraps onto multiple lines, the browser creates multiple internal text nodes. html2canvas joins them without spaces → "whereverit lives".

**The wrong fix** (still widely cited): read `el.innerText` inside `onclone`. The cloned document is detached — no CSS layout is computed — so `innerText` cannot resolve line breaks and returns the same broken concatenation.

**The correct fix**: pre-capture `innerText` from **live** elements BEFORE calling `html2canvas`, then inject in `onclone` (see export spec above, Bug 2 for the full code pattern). Never use `innerHTML` — it includes HTML entities and can corrupt text.

### 5. 8-direction resize — corner vs edge behaviour
Corner handles (nw/ne/sw/se) must maintain the element's original aspect ratio. Edge handles (n/s/w/e) resize only one axis. For corner resize: after computing the new width from the horizontal delta, set `height = newWidth / aspectRatio`. Also update `left`/`top` when dragging from the nw/n/w/sw/ne directions (the anchor corner changes). Pattern:
```javascript
if (dir.includes('w')) { nW = startW - dx; nX = startX + (startW - nW); }
if (dir.includes('n')) { nH = startH - dy; nY = startY + (startH - nH); }
if (isCorner)          { nH = nW / aspect; }
```

### 6. Phone screenshot thumbnails — use contain not cover
Portrait phone screenshots look completely wrong in square thumbnails with `object-fit: cover` (you see a cropped centre strip). Always use `object-fit: contain; height: auto; width: <fixed>px` with a dark background. This shows the full screenshot at its true aspect ratio.

### 7. Selection system — solo vs group handling
When exactly 1 element is selected, add class `.solo` to it so the 8 per-element handles appear (`.solo .rh { display: block }`). When 2+ are selected, remove `.solo` from all and show the group bounding box instead. The `refreshSel()` function should always recompute this:
```javascript
SEL.forEach(e => e.classList.toggle('solo', SEL.size === 1));
```

### 8. Never use `window.addEventListener` for drag — use `document.addEventListener`
Using `window.addEventListener('mousemove', ...)` for drag causes conflicts when multiple elements are dragged or resized in the same session — listeners from previous interactions bleed into the next. Always use `document.addEventListener` with a scoped `onUp` cleanup:
```javascript
const onMove = mv => { /* update position */ };
const onUp   = () => {
  document.removeEventListener('mousemove', onMove);
  document.removeEventListener('mouseup', onUp);
};
document.addEventListener('mousemove', onMove);
document.addEventListener('mouseup', onUp);
```
This pattern appears in both `makeDraggable` and `makeResizable`, and in group-resize handle listeners. Never use `window` for these.

### 9. Python/shell string generation — escape JS backslash sequences
When generating the HTML file from a Python script (the recommended approach for embedding a large logo base64), Python interprets `\r`, `\n`, `\t` inside regular string literals as actual CR, LF, and tab characters. A JavaScript regex like `/\r?\n/g` written in a Python string becomes a broken multi-line token in the output — a **JS syntax error that silently kills the entire `<script>` block** (zero JS runs, zero clicks work, zero errors in the console).

**The fix**: use double backslashes in Python source for any JS regex/string escape that uses `\r`, `\n`, `\t`:
```python
# WRONG — Python converts \r and \n to real CR/LF
liveTexts.set(i, el.innerText.replace(/\r?\n/g,' ').replace(/\s+/g,' ').trim());

# CORRECT — double-backslash in Python source → single backslash in output JS
liveTexts.set(i, el.innerText.replace(/\\r?\\n/g,' ').replace(/\\s+/g,' ').trim());
```

**Better approach — template + injection**: write the entire HTML (with placeholder `__LOGO_B64__`) using the `Write` tool (no Python escape risks), then inject the logo with a 3-line Python script:
```python
with open('/tmp/banner_template.html','r') as f: html=f.read()
with open('/tmp/logo_b64.txt','r') as f: b64=f.read().strip()
html=html.replace('__LOGO_B64__', b64)
with open('output/<project>/linkedin-banner.html','w') as f: f.write(html)
```
This eliminates the entire class of Python escape bugs. Always use this two-step approach when a base64 logo needs to be embedded.

### 10. Safe zone geometry — profile photo is a bottom-left circle, not a top-left rectangle
The LinkedIn profile photo is a **circle** that overlaps from **below** the banner, not a rectangle in the top-left corner. Approximate geometry in 1584×396 banner coordinates:
- Circle diameter: ~310px
- Center: approximately (155px from left, 396px from top) — at the banner's bottom edge
- Intrudes into the banner from y ≈ 241px downward (the bottom ~155px of the banner)
- Maximum right extent: x ≈ 310px (at the center height of the circle, which is at y=396 = banner bottom)
- At content text heights (y=200-300px), the photo right edge is well inside x=200px

**Safe content left margin: x ≥ 440px** — this gives comfortable clearance at all banner heights, including at the circle's widest visible point near the bottom edge.

**Left decoration zone (x=0 to 440px)**: use for node-graph decorations, dot patterns, atmospheric glows, or a gradient fade. These sit behind the profile photo intentionally and read as designed texture.

**Safe zone overlay implementation**: always render as a circle with `border-radius: 50%`, positioned with `bottom: -155px` so only the arc above the banner bottom is visible. The `#safe-overlay` must have `overflow: visible`. See export spec item 8 for the full CSS.

### 11. Canvas taint — screenshot images must use HTTPS URLs + crossOrigin

If any `<img>` placed on the banner is loaded from a `file://` path (i.e. a relative path when the HTML is opened locally), html2canvas marks the canvas as **tainted** the moment it draws that image. After that, calling `canvas.toDataURL()` throws:
> `Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.`

**Root cause**: browsers block `canvas.toDataURL()` as a security measure when cross-origin or file-system images are drawn — even if you set `useCORS: true`. Only images loaded via HTTPS with a matching CORS header can be drawn onto an exportable canvas.

**Fix**: always store screenshot URLs as absolute HTTPS URLs, not relative paths:
```javascript
// WRONG — causes canvas taint (file:// origin):
const SS = ['images/screenshot-home.png'];

// CORRECT — HTTPS avoids taint (CDN/domain sends CORS headers):
const SS = ['https://your-domain.com/images/screenshot-home.png'];
```

And set `crossOrigin = 'anonymous'` **before** setting `src` on every `<img>` you create in JS:
```javascript
// In addMockup():
const img = document.createElement('img');
img.crossOrigin = 'anonymous';  // ← BEFORE setting src
img.src = src;

// In SS.forEach() thumbnail builder:
const img = document.createElement('img');
img.crossOrigin = 'anonymous';  // ← BEFORE setting src
img.src = url;

// In spawnFree() (free images without phone frame):
const img = document.createElement('img');
img.crossOrigin = 'anonymous';  // ← BEFORE setting src
img.src = src;
```

`crossOrigin` must be set before `src` because browsers start fetching the image as soon as `src` is assigned — setting it after is too late and some browsers ignore it.

The `html2canvas` call must also include `useCORS: true` and `allowTaint: false`:
```javascript
const canvas = await html2canvas(banner, { scale: 2, useCORS: true, allowTaint: false, ... });
```

**Note**: uploaded files (from `<input type="file">`) are loaded as `data:` URIs via `FileReader.readAsDataURL()` — these are same-origin and never cause canvas taint. The taint issue only affects URLs loaded from external domains or `file://` paths.

---

## Design inspiration by style

### Minimal
- Large whitespace, logo + tagline only, single accent element
- Colors: light background, one bold brand color
- Best for: established brands, professional/corporate products

### Bold
- Full-bleed brand color, large typography, geometric shapes
- Colors: saturated primary + contrasting accent
- Best for: launches, hiring, attention-grabbing promotions

### Gradient
- Smooth brand-color gradients, glass-morphism text containers
- Colors: brand primary → secondary gradient
- Best for: modern SaaS, consumer apps, creative products

### Tech
- Dark background, monospace accents, grid/circuit patterns
- Colors: dark theme + neon brand accent
- Best for: developer tools, APIs, CLI tools, open source projects

### Creative
- Asymmetric layout, mixed scales, overlapping elements
- Colors: unexpected brand-derived combinations
- Best for: design tools, creative agencies, portfolio pieces

---

Output ONLY the HTML file — do not print the full generated code to the user. Just write the file and give the usage instructions from Step 5.
