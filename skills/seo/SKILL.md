---
name: seo
description: Technical and on-page SEO for landing pages and websites. Covers meta tags, Open Graph, JSON-LD structured data, semantic HTML, page speed rules, and URL structure. Implement on every page by default.
---

# SEO Skill

## Rule: Apply to Every Page by Default

SEO is not optional. Every landing page or website built using this repo must implement the full checklist below without being asked. Do not wait for the user to request SEO — it should be baked in from the start.

---

## 1. HTML Head — Required Tags

Add all of the following inside `<head>` on every page:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Primary SEO -->
  <title>[Product Name] — [One-line value proposition, max 60 chars]</title>
  <meta name="description" content="[2-sentence description of what this is and who it's for. Max 160 characters.]" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://yoursite.com/" />

  <!-- Open Graph (Facebook, LinkedIn, iMessage previews) -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="[Same as <title>]" />
  <meta property="og:description" content="[Same as meta description]" />
  <meta property="og:url" content="https://yoursite.com/" />
  <meta property="og:image" content="https://yoursite.com/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="[Product Name]" />

  <!-- Twitter/X Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="[Same as <title>]" />
  <meta name="twitter:description" content="[Same as meta description]" />
  <meta name="twitter:image" content="https://yoursite.com/og-image.png" />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</head>
```

**Always ask the user for:**
- Their canonical URL (the real domain)
- A one-line value proposition for the title
- Whether they have an OG image (1200×630px). If not, note it as a TODO comment in the code.

### `noindex` — what it means and when to use it

`noindex` is a meta tag directive that tells search engine crawlers: *visit this page but do not add it to your search index*. The page remains accessible via direct URL — it simply will not appear as a search result.

```html
<!-- Product/landing page — you WANT this to rank -->
<meta name="robots" content="index, follow" />

<!-- Utility pages — keep out of search results -->
<meta name="robots" content="noindex, follow" />
```

`follow` (in both cases) tells crawlers to still follow links on the page to discover the rest of your site. Never use `noindex, nofollow` on pages with useful outbound links.

**Use `noindex` on:** `privacy-policy.html`, `terms.html`, `support.html`, `dmca.html`, any page that is a legal or utility page — not a product or content page.

**Why:** You want `index.html` to rank in search, not your Terms of Use. `noindex` on utility pages prevents them from competing with your main page in results and keeps search results clean.

**What `noindex` does NOT do:**
- Does not hide the page from people who have the URL
- Does not block social media crawlers (OG tags still work, links can still be shared)
- Does not prevent AI crawlers from reading it (block those separately in `robots.txt`)

**OG tags on `noindex` pages:** OG tags only matter for social link previews. On `noindex` utility pages (privacy policy, terms) that you don't intend to promote or share, OG tags add no value and create maintenance overhead — skip them. The page `<title>` is sufficient fallback for the rare case someone shares the link. Exception: if a utility page is meaningfully shareable (e.g. a public support/FAQ page), you may add OG tags.

**`sitemap.xml` rule:** Never list `noindex` pages in `sitemap.xml`. The sitemap signals to Google which pages to prioritise for crawling and ranking — including a `noindex` page creates a contradiction.

---

## 2. JSON-LD Structured Data

Add this inside `<head>` or before `</body>`. Structured data helps Google show rich results and helps AI search engines understand what your product is.

### For a SaaS / App product:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "[Product Name]",
  "description": "[What it does in one sentence]",
  "applicationCategory": "[e.g. BusinessApplication, MobileApplication]",
  "operatingSystem": "[e.g. iOS, Android, Web]",
  "url": "https://yoursite.com",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Person",
    "name": "[Creator name]"
  }
}
</script>
```

### For a general landing page / idea:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "[Product Name]",
  "description": "[What it does]",
  "url": "https://yoursite.com"
}
</script>
```

### If there are FAQs on the page:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question text]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer text]"
      }
    }
  ]
}
</script>
```

### For every secondary / utility page (privacy-policy, terms, support, etc.):

Even `noindex` utility pages need a minimal `WebPage` schema. It helps AI crawlers understand the page's role in the site graph and establishes the `isPartOf` relationship to the main website entity. Do NOT add `SoftwareApplication` or `FAQPage` here — just `WebPage`.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://yoursite.com/privacy-policy.html",
  "url": "https://yoursite.com/privacy-policy.html",
  "name": "Privacy Policy — [Product Name]",
  "description": "[One-sentence factual description of what this page contains]",
  "isPartOf": { "@id": "https://yoursite.com/#website" },
  "publisher": { "@type": "Person", "name": "[Creator name]" }
}
</script>
```

The `isPartOf` `@id` must match the `@id` used on the `WebSite` node in `index.html` (typically `https://yoursite.com/#website`).

---

## 3. Semantic HTML

Use the correct HTML elements — search engines and AI use these to understand page structure.

| Use this | Instead of | Why |
|----------|-----------|-----|
| `<header>` | `<div class="header">` | Marks the page header |
| `<nav>` | `<div class="nav">` | Marks navigation |
| `<main>` | `<div class="main">` | Marks main content |
| `<section>` | `<div class="section">` | Groups related content |
| `<article>` | `<div class="post">` | Self-contained content |
| `<footer>` | `<div class="footer">` | Marks the footer |
| `<h1>` | `<p class="hero-text">` | Only ONE h1 per page |
| `<h2>`, `<h3>` | `<div class="subtitle">` | Hierarchy matters |

**Rules:**
- One `<h1>` per page — it should be your main value proposition
- `<h2>` for section headings, `<h3>` for sub-sections
- Never skip heading levels (don't go from h1 to h3)
- Every image needs a descriptive `alt` attribute
- Every link needs meaningful text — never "click here"

### Anchor `title` attributes — required on every `<a>` tag

Every `<a>` element must have a `title` attribute. Search engines and AI crawlers use `title` to understand link intent without following the href. This is one of the most commonly failed technical SEO checks.

```html
<!-- Navigation links -->
<a title="Features" href="#features">Features</a>
<a title="Protocol" href="#protocol">Protocol</a>

<!-- Logo — always href="/" not href="#" -->
<a title="[Product Name]" href="/">
  <img src="logo.png" alt="[Product Name]" />
  [Product Name]
</a>

<!-- External CTAs -->
<a title="Download on the App Store"
   href="https://apps.apple.com/..."
   target="_blank" rel="noopener noreferrer">
  Download on the App Store
</a>

<!-- Footer links -->
<a title="Terms of Use" href="terms.html">Terms of Use</a>
<a title="Privacy Policy" href="privacy-policy.html">Privacy Policy</a>
<a title="Support" href="support.html">Support</a>
<a title="App Store" href="https://apps.apple.com/..." target="_blank" rel="noopener noreferrer">App Store</a>

<!-- Email links -->
<a title="Email Support" href="mailto:contact@example.com">contact@example.com</a>

<!-- Skip link (accessibility + SEO) -->
<a title="Skip to main content" href="#main-content">Skip to main content</a>
```

**Critical link rules:**
- Navbar logo: always `href="/"`, never `href="#"` — `#` creates a broken anchor, not a home link
- External links: always `rel="noopener noreferrer"` — **never** `rel="noopener"` alone; `noreferrer` prevents referrer header leakage and implies `noopener`
- Internal nav links on secondary pages: reference `index.html#section` not `/#section` or a stale filename — verify after every rename
- `title` text: describe the destination or action. For simple labels like "Features", the title matches the text. For icons or ambiguous elements, be more descriptive.

---

## 4. Page Speed Rules

Page speed is a Google ranking factor. Follow these on every page:

- **Fonts**: Use `font-display: swap` to prevent invisible text while fonts load
- **Images**: Always add `width` and `height` attributes on `<img>` to prevent layout shift
- **Images**: Use `loading="lazy"` on images below the fold
- **Images**: Prefer WebP format over PNG/JPG
- **Critical CSS**: Inline above-the-fold styles in `<style>` tags when possible for HTML-only pages
- **No unused JS**: Don't load scripts for features you're not using
- **Preconnect**: Add `<link rel="preconnect">` for any external font or asset domains

```html
<!-- Example: preconnect for Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

---

## 5. URL and Content Rules

- Page URL should describe the content: `/features` not `/page2`
- Title tag should be unique on every page — never duplicate
- Meta description should be unique on every page
- First paragraph of each section should clearly state what that section is about
- Use keywords naturally in headings and first 100 words — never stuff them
- Every CTA button should have descriptive text: "Start free trial" not "Click here"

---

## 6. sitemap.xml and robots.txt

Create these files inside `site/` (they are pre-stubbed by `setup.sh` — just update the domain). On a deployed site they must live at the root, which is why they go in `site/` and not anywhere else.

**robots.txt:**
```
User-agent: *
Allow: /
Sitemap: https://yoursite.com/sitemap.xml
```

**sitemap.xml:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yoursite.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

---

## 7. SEO Checklist — Run Before Finishing Any Page

**Meta & head**
- [ ] `<title>` is under 60 characters and includes the product name
- [ ] `<meta name="description">` is 120–160 characters
- [ ] Canonical URL is set correctly
- [ ] Open Graph tags are all filled in (skip on `noindex` utility pages)
- [ ] Twitter card tags are filled in (skip on `noindex` utility pages)
- [ ] OG image exists (1200×630px) or is marked as TODO

**Structured data**
- [ ] `index.html`: JSON-LD includes `SoftwareApplication` or `WebSite` + `FAQPage` (if FAQ section exists)
- [ ] Every secondary/utility page has a minimal `WebPage` JSON-LD with `isPartOf` pointing to `#website`
- [ ] `sitemap.xml` lists only `index` pages — `noindex` pages must NOT appear in sitemap

**Semantic HTML**
- [ ] One and only one `<h1>` on the page
- [ ] `<header>`, `<main>`, `<footer>`, `<nav>` used correctly
- [ ] No "click here" link text

**Images**
- [ ] All images have `alt` attributes
- [ ] All images have `width` and `height` attributes
- [ ] `loading="lazy"` on below-the-fold images

**Links — every `<a>` tag**
- [ ] Every `<a>` has a descriptive `title` attribute
- [ ] Navbar logo uses `href="/"` not `href="#"`
- [ ] All external links use `rel="noopener noreferrer"` (both tokens, not just `noopener`)
- [ ] Internal nav links on secondary pages reference `index.html#section` (verify filename is correct)
- [ ] No empty or broken hrefs (`href="#"` on non-logo links, `href=""`, `href="javascript:void(0)"`)

**Crawl**
- [ ] `robots.txt` exists (for deployed sites)
- [ ] `sitemap.xml` exists (for multi-page sites)
