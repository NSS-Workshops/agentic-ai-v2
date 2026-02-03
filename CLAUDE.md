# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies (requires GitHub PAT for @nss-workshops scope)
npm run dev          # Start dev server at http://localhost:5173/[course-slug]/
npm run build        # Production build
npm run lint         # ESLint
```

Requires `.env.local`:
```
VITE_COURSE_NAME=Agentic AI Development
VITE_COURSE_URL_SLUG=agentic-ai
```

## Curriculum Architecture

Self-contained section/chapter structure where each module manages its own configuration:

```
src/sections/
├── index.js                    # Aggregates all sections, processes markdown
└── [section-name]/
    ├── index.js                # Section config: id, title, description, order
    └── [01-chapter]/
        ├── index.js            # Chapter config: id, title, prev/next IDs, content
        └── index.md            # Markdown content
```

### Key Patterns

- **Section ordering**: `order` property (lowest first) controls navigation position
- **Chapter linking**: `previousChapterId`/`nextChapterId` enable Previous/Next buttons
- **Content import**: `import content from "./index.md?raw"` in chapter index.js
- **Do not add `#` headers to index.md** - The title from index.js displays as the page header

### Naming Conventions

- Section directories: kebab-case (`ai-coding-fundamentals`)
- Chapter directories: numeric prefix + kebab-case (`01-llm-fundamentals`)
- Chapter IDs: kebab-case without numbers (`llm-fundamentals`)

## Content Features

- **Mermaid diagrams**: Use fenced code blocks with `mermaid` language
- **Syntax highlighting**: Prism.js with auto-detection (supports js, ts, python, bash, json, yaml, css, html)
- **Images**: Place in chapter directory, reference as `./image.png` (auto-copied to `/assets/`)

## Adding Content

1. Create section directory with `index.js` (config + chapter glob import)
2. Create chapter directories with `index.js` (metadata) and `index.md` (content)
3. Link chapters via `previousChapterId`/`nextChapterId`
4. Dev server auto-restarts for JS changes; images require restart
