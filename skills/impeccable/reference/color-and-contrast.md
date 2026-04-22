# Color & Contrast Reference

Extended material on WCAG contrast, accessibility, and palette construction.
The SKILL.md color principles are the short version — this is the full version.

---

## WCAG Contrast Requirements

WCAG (Web Content Accessibility Guidelines) defines minimum contrast ratios between text/UI elements and their background. These are **not optional** — failing them is a P1 issue (WCAG AA violation, fix before release).

### Text Contrast

| WCAG Level | Ratio | Applies to |
|------------|-------|------------|
| **AA (minimum)** | **4.5:1** | Normal text (< 18px regular, < 14px bold) |
| **AA (minimum)** | **3:1** | Large text (≥ 18px regular OR ≥ 14px bold) |
| **AAA (enhanced)** | **7:1** | Normal text |
| **AAA (enhanced)** | **4.5:1** | Large text |

### UI Component Contrast

| WCAG Level | Ratio | Applies to |
|------------|-------|------------|
| **AA** | **3:1** | UI components (borders, icons, form inputs, focus rings) |
| **AA** | **3:1** | Graphical objects needed to understand content |

### What contrast ratio means in practice

A ratio of 4.5:1 means the lighter color is 4.5× brighter than the darker one.
A ratio of 1:1 = identical colors (invisible).
A ratio of 21:1 = pure black on pure white (maximum possible).

**Quick intuition check:**
- White `#FFFFFF` on amber `#F59E0B` → ~2.3:1 → **fails AA** for normal text
- Black `#1A1A1A` on amber `#F59E0B` → ~8.5:1 → **passes AAA**
- `#C4C2D6` on near-black `#0D0B14` → ~9.2:1 → **passes AAA**
- `#9896AA` on near-black `#0D0B14` → ~5.1:1 → **passes AA** (barely — watch font size)
- `#5A5868` on near-black `#0D0B14` → ~2.8:1 → **fails AA** — nearly invisible

---

## Dark Mode: The Contrast Ladder Problem

Light mode palettes almost always fail dark mode contrast without adjustment. The failure mode is systematic: every step in your text color ladder needs to shift approximately one step brighter in dark mode.

**Why it happens:** Lightness perception is nonlinear. A gray that reads as "secondary text" on white becomes near-invisible on a dark background.

**The ItMadeMyDay failure (real example from this repo):**
- `--text-mid: #9896AA` on `#0D0B14` → 5.1:1 → passed AA but felt dim; bumped to `#C4C2D6`
- `--text-muted: #5A5868` on `#0D0B14` → 2.8:1 → **failed AA**; bumped to `#9896AA`
- `--amber-deep: #A86200` on `#0D0B14` → 3.1:1 → barely legible; overridden with `var(--amber)` in dark mode

**Rule:** When you build a dark theme, don't just invert the light theme. Audit every text color token against the dark background and verify ratios. The whole ladder shifts up.

---

## How to Check Contrast

### During design/build (recommended)

1. **Browser DevTools** — inspect any element, check the Accessibility panel → contrast ratio shown automatically
2. **DevTools color picker** — click any color in the CSS panel → ratio shown against current background
3. [coolors.co/contrast-checker](https://coolors.co/contrast-checker) — paste two hex values, instant result with pass/fail for AA and AAA

### For OKLCH values

OKLCH doesn't have a simple ratio formula you can compute in your head. Use DevTools (it computes from rendered color) or convert to hex first via:
- [oklch.com](https://oklch.com) → enter OKLCH values → copy hex → paste into contrast checker

### What to audit systematically

For each page, check:
- [ ] Body text on page background
- [ ] Heading text on any colored section backgrounds
- [ ] Secondary / muted text (most likely to fail)
- [ ] Placeholder text in inputs (often forgotten — many frameworks default to ~3:1)
- [ ] Link text on body background (AND on hover state)
- [ ] White text on colored buttons (check all button colors)
- [ ] Icon colors that convey meaning (e.g. error icon, success checkmark)
- [ ] Focus ring visibility (3:1 minimum against adjacent colors)
- [ ] Dark mode equivalents of all of the above

---

## Accessible Color Patterns

### Text on brand colors

Brand colors are often mid-range saturation — they frequently fail both white AND black text. Check both before choosing.

**Use black text when:** Brand color is light/pastel (lightness > 60%)
**Use white text when:** Brand color is dark (lightness < 40%)
**It's ambiguous when:** Lightness is 40–60% — check the actual ratio, don't guess

### Tinted neutrals (OKLCH)

Tinting your neutrals toward the brand hue (even at chroma 0.005–0.01) creates cohesion but can trap you if you're not careful — a warm-tinted gray may fail against a warm background where a pure gray would pass. Always verify after tinting.

### Color-blind safe palettes

~8% of men have red-green color blindness. Never use color as the *only* signal for:
- Error states (add an icon or label)
- Success/failure (add text)
- Required fields (add an asterisk or text)

The green/red pairing is the most common failure. If you must use it, ensure the shapes or labels also differ.

---

## Contrast Failures by Severity

| Scenario | Severity | Why |
|----------|----------|-----|
| Body text fails AA on main background | **P0** | Affects every user on every page |
| Heading fails AA on a section background | **P1** | Common, often overlooked on colored hero sections |
| Muted/secondary text fails AA | **P1** | Frequently fails — "designed to be subtle" is not an excuse |
| Placeholder text fails AA | **P2** | Users with low vision can't read input labels |
| Icon fails 3:1 | **P2** | Affects users with low contrast sensitivity |
| Dark mode text fails AA | **P1** | Entire dark mode is unusable for affected users |
| Focus ring fails 3:1 | **P1** | Keyboard navigation becomes impossible |

---

## OKLCH Contrast Discipline

When building a palette in OKLCH, these rules prevent contrast failures before they happen:

1. **At L > 80%**: chroma should be ≤ 0.10. High chroma at high lightness = garish AND low contrast against white backgrounds.
2. **At L < 30%**: chroma should be ≤ 0.12. High chroma at very dark values is nearly invisible AND low contrast against dark backgrounds.
3. **Text colors for dark backgrounds**: target L ≥ 75% for body text, L ≥ 55% for muted text.
4. **Text colors for light backgrounds**: target L ≤ 40% for body text, L ≤ 55% for muted text.
5. **Brand accent on white**: verify ratio — mid-lightness saturated colors often hover right at the failure threshold.
