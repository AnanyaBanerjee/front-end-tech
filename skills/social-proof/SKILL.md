# Social Proof Design Skill

How to make social proof look impressive — not just present.

The existing landing-page-design skills cover WHERE to place proof and what copy to use. This skill covers the visual execution: format choices, platform formats, credibility strips, and collecting real proof over time.

---

## When to use this skill

- Adding a testimonials / social proof section to a landing page
- The section exists but feels generic or weak
- User asks to "make it look more impressive"
- Transitioning from placeholder to real testimonials

---

## The Core Problem

Most social proof sections fail visually because they look like the builder made them up. Generic quote cards with initials, no platform context, no numbers, no specificity. The section exists but does zero trust work.

Impressive social proof signals:
1. **Real people said this somewhere** (platform context)
2. **Other people saw it** (engagement counts, views)
3. **Numbers back it up** (ratings, user count, countries)
4. **The result is specific** (not "great tool" but "team onboarded in 20 minutes")

---

## Format Options

### 1. Social Media Post Format (highest authenticity)

Render testimonials as social media posts — LinkedIn or X/Twitter. This is the most powerful format for developer/tech audiences because:
- Platform branding signals it was said publicly, not solicited
- Engagement counts (likes, reposts, views) show real traction
- Writing style matches how people actually talk on those platforms

**LinkedIn post anatomy:**
```
[Avatar]  Name · 1st                              [LinkedIn logo in #0A66C2]
          Title at Company
          2d · 🌐

Post content written in LinkedIn voice:
Paragraph breaks. Professional but personal.
Specific result. Hashtags at end.

#AI #Agents #BuildInPublic

👍 ❤️ 💡  47                              12 comments · 3 reposts
─────────────────────────────────────────
[Like]   [Comment]   [Repost]   [Send]
```

**X post anatomy:**
```
[Avatar]  Name                                    [X logo]
          @handle

lowercase. punchy lines.
one idea per line.
specific result.

#hashtag

4:23 PM · Apr 8, 2026 · 2,341 Views
─────────────────────────────────────────
[Reply 14]   [Repost 89]   [Like 312]
```

**Layout for social media format:**
- 1 featured LinkedIn post (full width, left border in LinkedIn blue `#0A66C2`)
- 3 X posts below in a grid (platform logo top-right, engagement counts at bottom)

### 2. Featured Quote + Grid

Use for more formal/enterprise positioning:
- 1 large quote (full width, decorative large quotation mark, gradient avatar)
- 2–3 compact cards below (asymmetric: 1 wide left + 2 stacked right)
- Left border accent stripe (alternating brand accent colors) instead of uniform cards
- Bold one key result phrase per quote so skimmers extract proof

### 3. Pull Quote (single, high-impact)

Use when you have one exceptional testimonial and want maximum impact:
- Full viewport width section
- Large type (text-2xl or larger)
- Name + company beneath
- No card border — just the quote floating in whitespace

---

## Credibility Strip

Always pair the testimonial layout with a quantitative strip. Numbers are more credible than words.

```
4.9          |    12k+           |    80+
★★★★★        |    agents         |    countries
App Store    |    connected      |
```

**Placement:** Flush right of the section H2 on desktop, stacked below on mobile.

**What numbers to use:**
- App Store / Play Store rating (most credible — third-party verified)
- Total users / accounts / items created
- Countries or regions
- Uptime / reliability stat
- GitHub stars (for dev tools)

If the product is new and numbers are small — skip the strip. Never fake numbers. Use qualitative signals instead.

---

## Platform Branding

When using social media post format, include the platform logo:

**LinkedIn:** `fill="#0A66C2"` — always in LinkedIn blue, never muted
```svg
<svg viewBox="0 0 24 24" fill="#0A66C2">
  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
</svg>
```

**X / Twitter:** `fill="currentColor"` — inherits text color (white on dark, black on light)
```svg
<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
</svg>
```

Place the platform logo top-right of the card. Size: `w-5 h-5` for grid cards, `w-6 h-6` for featured.

---

## Avatar Treatment

Never use flat colored circles with initials at the same visual weight as body text.

**Gradient avatars (preferred):**
```html
<div style="background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)">MC</div>
```

Alternate gradient direction per person to differentiate:
- Person 1: `accent → accent2`
- Person 2: `accent2 → blue-400`
- Person 3: `accent → accent2` (repeat ok at small size)

**With real photos:** round, 40–48px, object-cover. Always preferred over initials.

---

## Copy Voice by Platform

The writing style must match the platform or it looks fake.

**LinkedIn voice:**
- Sentence case, paragraph breaks
- Professional but personal
- Ends with insight or lesson
- Hashtags on last line
- "We went from X to Y in Z time" structure works well

**X voice:**
- Lowercase preferred
- One idea per line
- No full sentences required
- Short, punchy, no throat-clearing
- Hashtags inline or at end

**Traditional testimonial card:**
- First person quote in "double quotes"
- Specific result in the middle
- Name, Title · Company beneath
- Bold the key result so skimmers extract it

---

## Collecting Real Testimonials

Always add a link to collect real proof. Place it below the social proof section as a subtle pill CTA:

```html
<a href="[testimonial-collection-url]" target="_blank" rel="noopener noreferrer"
   class="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-border bg-elevated hover:border-accent/40 transition-all group">
  <!-- pencil icon -->
  <span>Using [Product]? Share your experience</span>
  <!-- arrow icon -->
</a>
```

**Tools for collecting testimonials:**
- [testimonial.to](https://testimonial.to) — video + text, embeddable wall
- [Senja](https://senja.io) — similar, good import from G2/Trustpilot
- App Store / Play Store reviews — link directly to review prompt
- Twitter/X — search your product name, screenshot good ones (with permission)

---

## Placeholder → Real Proof Transition

When building with placeholder content, write placeholders that teach the pattern for real testimonials:

- Use realistic names and realistic companies ("Placeholder Co." signals clearly)
- Write the quote as if it were real — same specificity, same voice
- Add platform handles (`@handle`) so the format is clear when replaced
- Keep engagement counts plausible (not 10,000 likes for a new product)
- Mark the collection link prominently so it gets filled first

**Replacement checklist when going live:**
- [ ] Swap placeholder names for real people (get permission)
- [ ] Replace fake @handles with real handles
- [ ] Update engagement counts to match actual posts (or remove counts if no post exists)
- [ ] Update credibility strip numbers with real data
- [ ] If no real testimonials yet: remove section entirely rather than showing obvious fakes

---

## What Existing Skills Already Cover

Do not duplicate these — use the relevant skill instead:

| Topic | Covered by |
|-------|-----------|
| WHERE to place proof on the page | `landing-page-design/patterns.md` Pattern 3 |
| Basic testimonial card layouts | `landing-page-design/patterns.md` Pattern 8 |
| The "social proof desert" mistake | `landing-page-design/sharp-edges.md` Section 7 |
| What makes testimonial COPY specific and credible | `copywriting/SKILL.md` (social proof hierarchy section) |

This skill handles the visual design and format execution only.

---

## Anti-Patterns

- **Uniform cards in a 3-column grid** — generic, forgettable. Break the grid.
- **Same card background everywhere** — use featured format for hierarchy
- **Initials in flat color** — use gradients or real photos
- **No numbers anywhere** — always pair with a credibility strip
- **Vague quotes** — "Great tool!" is worse than no quote. Push for specific results.
- **Quote marks as the only decoration** — the big `"` decoration alone doesn't make a section impressive
- **Placeholder quotes that read like marketing copy** — write placeholders in human voice
- **Context chips / pill labels on every card** — tested poorly; they look like tags on a spreadsheet, not authentic proof
