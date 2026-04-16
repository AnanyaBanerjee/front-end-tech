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
- **Canvas**: Exactly 1584 x 396 px (LinkedIn recommended)
- **Safe zone**: Keep ALL text and important elements in the RIGHT 60% — left ~250px is covered by profile photo on desktop
- **Bottom-left exclusion**: Nothing important in bottom-left 200x200px (profile photo overlap)
- **Mobile crop**: Important content in middle 60% of height (top/bottom cropped on mobile)
- **Logo placement**: Right side or center-right. Never bottom-left. Ideal: right-aligned, vertically centered.
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
┌─────────────────────────────────────────────────────────────────┐
│ [profile photo zone]  │                                         │
│                       │   [LOGO]  Product Name                  │
│   ← AVOID THIS       │   "Tagline or value proposition"        │
│     AREA              │   Your Name · What you're promoting     │
│                       │                                         │
└─────────────────────────────────────────────────────────────────┘
```

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
3. **PNG export button** — loads `html2canvas` from CDN (`https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js`), captures `#banner` div, triggers download as `linkedin-banner.png`
4. **Live text editing** — all text elements are `contenteditable` on click, with a subtle highlight showing they're editable
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
8. **Safe zone overlay toggle** — shows profile photo zone and mobile crop guides
9. **Scaled preview** — 50% scale preview showing realistic LinkedIn appearance
10. **Elements Library** — a panel for adding visual elements (product screenshots, phone mockups, etc.) to the banner:
    - **Source screenshots**: When building from a website (Step 2A), fetch product screenshots/images found on the site (e.g. hero images, app screenshots, phone mockups). Resize to reasonable dimensions (height ~300-400px) and embed as base64 data URIs.
    - **Thumbnail grid**: Display fetched screenshots as clickable thumbnails in an "Elements Library" control panel
    - **Click to add**: Clicking a thumbnail adds it as a phone-frame mockup element on the banner (rounded corners, subtle border/shadow, positioned on the right side by default)
    - **Drag to reposition**: Each added element is draggable within the banner via mouse events
    - **Resize from corner**: A small resize handle on the bottom-right corner lets users resize elements while maintaining aspect ratio
    - **Remove button**: An X button appears on hover to remove individual elements
    - **Upload custom**: A multi-file input lets users upload multiple screenshots/images at once as banner elements
    - **Add from URL**: A text input lets users paste an image URL to add it as an element (attempts CORS-safe base64 conversion, falls back to direct URL reference)
    - **Clear all**: A button to remove all added elements at once
    - **Export-safe**: Elements are included in the PNG export; remove/resize UI handles are hidden during capture
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
    - **Editable text**: Click the CTA text on the banner to edit directly
    - **Draggable**: Position the CTA anywhere on the banner
    - **Smart defaults**: CTA is positioned bottom-right of the content area by default. Each style has a fitting default text (neon-pill → "Follow me for more", badge → "Subscribe to my newsletter", terminal → CLI install command, glass → "Let's connect", etc.)
    - **One active CTA**: Switching styles replaces the current CTA; "Remove CTA" clears it
    - The tone should always be **personal and inviting** — these are LinkedIn banners, so CTAs should drive follows, connections, newsletter signups, or personal engagement, not hard product marketing. Think "Follow me", "Subscribe", "Let's connect", "Try it out", "DM me".
13. **Multi-Select** — select multiple elements and move/resize them as a group:
    - **Click** any element (phone mockup, free image, CTA) to select it (shown with a cyan outline + dashed border)
    - **Shift+Click** to add/remove elements from the selection
    - **Drag** any selected element to move the entire group together, maintaining relative positions
    - **Resize** via any selected element's handle to resize all selected elements proportionally
    - **Escape** to deselect all
    - **Select All** button in the floating info bar to select every element on the banner
    - A floating status bar at the bottom shows selection count and keyboard hints
    - Selection outlines are stripped from preview and PNG export

### Layout: Tabbed Controls (single-screen)
All controls MUST fit on one screen without scrolling. Use a **tabbed interface** below the banner:
- **Tab bar** with 3 tabs: **Elements** | **CTA** | **Style**
  - **Elements tab**: Phone Mockups (thumbnail grid) + Free Images (upload/URL) side by side
  - **CTA tab**: Style presets (6 buttons) + Text presets + custom input, all in one row
  - **Style tab**: Color pickers + Variant buttons side by side
- **Always-visible actions strip** on the right of the tab bar: Upload Logo, Safe Zones, Clear All, Export as PNG
- **Preview** is collapsible (hidden by default, toggled by a "Show Preview" button) to save vertical space
- Compact padding throughout — body padding 16px, small margins between sections, no wasted vertical space

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
   > - **Export**: Click **Export as PNG** when you're happy — all elements, opacity, and positions are preserved
   >
   > Upload to LinkedIn: Profile → Edit → Camera icon on banner."

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
