# How to Use These Skills

## What are SKILL.md files?

SKILL.md files are design instruction files that AI coding tools (Claude Code, Cursor, Copilot, etc.) automatically detect and follow when generating frontend code. Instead of getting generic-looking UI, you get polished, opinionated designs.

## How does the AI choose which skill to use?

**It doesn't choose — you do.** AI tools look for a single `SKILL.md` file in your project root. To use a skill:

1. Copy the one you want into your project root:
   ```bash
   cp skills/taste-skill/SKILL.md /path/to/your-project/SKILL.md
   ```
2. Start prompting your AI tool as usual — it will follow the design instructions automatically.

## Can I combine multiple skills?

Not out of the box. Each `SKILL.md` is a standalone set of instructions. But here's how to think about combining them:

### Option A: Layer impeccable on top of a style skill (recommended)

**impeccable** focuses on design process and quality (auditing, anti-patterns, accessibility). The taste-skill variants focus on a specific visual style. They complement each other well.

To combine them:
1. Use a style skill (`taste-skill`, `soft-skill`, `minimalist-skill`, or `brutalist-skill`) as your base `SKILL.md`.
2. Copy `.impeccable.md` into your project root alongside it — impeccable is designed to work as a secondary context file that AI tools can also pick up.
3. Or, simply ask your AI tool in chat: "Also follow the impeccable design principles for accessibility and anti-patterns."

### Option B: Pick one and stick with it

If you want a single cohesive style, just pick the one that matches your project:

| Skill | Best for |
|-------|----------|
| **taste-skill** | General-purpose modern UI (SaaS, apps, landing pages) |
| **soft-skill** | Premium, high-end feel (agency sites, luxury products) |
| **minimalist-skill** | Content-heavy, editorial (docs, blogs, dashboards like Notion/Linear) |
| **brutalist-skill** | Bold, data-heavy (portfolios, dashboards, experimental) |
| **impeccable** | Design quality layer — audits, anti-patterns, accessibility |

### Option C: Merge manually

Create your own `SKILL.md` by cherry-picking sections from multiple skills. For example:
- Typography rules from `minimalist-skill`
- Motion/animation from `taste-skill`
- Anti-patterns from `impeccable`

## Quick start

```bash
# 1. Clone this repo
git clone https://github.com/AnanyaBanerjee/front-end-tech.git

# 2. Start a new project
mkdir my-app && cd my-app && npm init -y

# 3. Copy a skill into your project root
cp ../front-end-tech/skills/taste-skill/SKILL.md ./SKILL.md

# 4. Open your AI coding tool and start building
#    The AI will automatically follow the design instructions
```

## Switching skills

Just replace the `SKILL.md` in your project root:

```bash
# Switch from taste-skill to minimalist
cp ../front-end-tech/skills/minimalist-skill/SKILL.md ./SKILL.md
```

## Tuning parameters (taste-skill variants only)

The taste-skill, soft-skill, minimalist-skill, and brutalist-skill files have three tunable parameters at the top:

- **DESIGN_VARIANCE** (1-10): How creative/asymmetric the layouts are
- **MOTION_INTENSITY** (1-10): How much animation and movement
- **VISUAL_DENSITY** (1-10): How packed or airy the layout feels

You can edit these directly in the `SKILL.md` or override them in chat:
> "Use design variance 5, motion intensity 8, and visual density 3"

## impeccable commands

If you're using the impeccable skill, you get 21 steering commands you can use in chat:

| Command | What it does |
|---------|-------------|
| `/audit` | Full design quality check |
| `/critique` | Get honest feedback on current design |
| `/polish` | Refine spacing, alignment, consistency |
| `/animate` | Add or improve motion design |
| `/typeset` | Fix typography issues |
| `/colorize` | Improve color palette and contrast |
| `/arrange` | Fix layout and spatial hierarchy |
| `/harden` | Improve accessibility and robustness |
| `/optimize` | Performance and loading improvements |
| `/distill` | Simplify and remove visual noise |
| `/normalize` | Align with design system conventions |

See the [impeccable repo](https://github.com/pbakaus/impeccable) for the full list.
