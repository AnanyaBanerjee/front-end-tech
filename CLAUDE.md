# Project Rules

## Purpose

This repo is a toolkit for building landing pages and websites for apps, ideas, and concepts. Everything here — skills, scripts, structure — exists to help ship polished pages fast using AI tools.

## Output Policy

**All files generated for user tasks MUST be created inside a subfolder within `output/`.**

- Never create generated files (HTML, CSS, JS, images, etc.) in the repo root or inside `skills/`.
- For each task, create a descriptively named subfolder: `output/<project-name>/`.
- The `output/` directory holds all generated work. Each project gets its own subfolder.
- The `skills/` folder is for design instruction files only — never write generated code there.

Examples:
```
output/landing-page/index.html       # Correct
output/dashboard-v2/src/App.tsx      # Correct
landing-page/index.html              # WRONG — not inside output/
index.html                           # WRONG — not inside output/
skills/my-project/index.html         # WRONG — skills/ is for SKILL.md files only
```

## Skill Evaluation

When asked to evaluate or add a new skill, judge it from this perspective: "Does this help build better landing pages and websites?" Focus on skills that improve: visual design, hero sections, CTAs, typography, color, responsive layouts, motion that converts, page performance. Reject skills focused on app internals (state management, routing, testing) that don't improve the final shipped page.
