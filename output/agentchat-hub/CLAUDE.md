# Project Rules

## Logo

**Always ask for a logo before building.** Ask:
> "Do you have a logo for this product/app/idea? If yes, share the file (PNG, SVG, JPG) or describe it. If no, I'll create a text-based or SVG logo using the product name and brand colors."

- If provided: place in this folder, use in navbar (top-left, 28–36px), hero (optional), and footer (muted, 20–24px)
- If not provided: create a clean SVG wordmark using the product name, brand color, and a premium font from the active SKILL.md
- Never stretch or distort the logo — always preserve aspect ratio

## Design Skills

This project uses layered design skills:
- **Logo**: follow `../../skills/logo/SKILL.md` — always ask for a logo before building
- **Branding**: follow `../../skills/branding/patterns.md` and `../../skills/branding/anti-patterns.md`
- **Product images**: follow `../../skills/product-images/SKILL.md` — always ask for screenshots before building
- **SKILL.md** — taste-skill (visual direction)
- **.impeccable.md** — design quality, anti-patterns, and accessibility
- **Structure**: follow `../../skills/landing-page-design/patterns.md`, `../../skills/landing-page-design/anti-patterns.md`, and `../../skills/landing-page-design/decisions.md`
- **Engineering**: follow `../../skills/emil-design-eng/SKILL.md` for animation and interaction
- **Legal**: follow `../../skills/legal/SKILL.md` — ask for existing Privacy Policy and Terms of Use first, improve or generate
- **Security**: follow `../../skills/security/SKILL.md` — create site/_headers, no secrets in HTML, SRI on CDN scripts, rel="noopener noreferrer" on all external links
- **SEO**: follow `../../skills/seo/SKILL.md` — apply full SEO checklist to every page by default
- **AEO**: follow `../../skills/aeo/SKILL.md` — generate llms.txt and apply AI search optimization
- **Copy**: follow `../../skills/copywriting/patterns.md` for headlines, CTAs, and page copy

## Universal Rule: Security + Legal on Every Single Page

**Every `.html` file in `site/` — without exception — must follow both security and legal guidelines.**

Security on every page:
- `integrity` + `crossorigin="anonymous"` on every CDN script and stylesheet
- `rel="noopener noreferrer"` on every `target="_blank"` link
- No API keys, email addresses, or sensitive data in source code

Legal on every page:
- Same navbar (logo links to `/`)
- Same footer with copyright: `© [year] [Owner]. All rights reserved. [Product]™`
- Same footer links to Privacy Policy, Terms, and DMCA
- Same fonts, colors, spacing, and animations as index.html

Legal pages only (privacy-policy.html, terms.html, dmca.html):
- Add `<meta name="robots" content="noindex, nofollow">`
- Do NOT add Open Graph, Twitter card, or JSON-LD tags

## Output

All generated files must stay in this folder.
