Context engineering is the art and science of providing Claude with the right information to generate accurate, relevant responses. Since LLMs are prediction engines, the quality of their predictions depends entirely on the context they receive.

This chapter covers how to structure project context through `CLAUDE.md` files, manage tokens effectively, and craft prompts that lead to better outcomes.

## Why Context Matters

Remember from Chapter 1: LLMs predict what text should come next based on patterns they've learned. Your context shapes those predictions.

Consider these two prompts:

**Weak context:**
```
Write a function to validate email
```

**Strong context:**
```
I'm building a React form component in TypeScript. Write a function
to validate email addresses that:
- Returns a boolean
- Handles common edge cases
- Follows our project's pattern of pure functions in utils/
```

The second prompt provides context that helps Claude make better predictions about:
- Language and framework (React, TypeScript)
- Return type expectations (boolean)
- Quality requirements (edge cases)
- Project conventions (pure functions, file location)

## The CLAUDE.md System

Claude Code uses a hierarchical system of markdown files to understand your projects. These files provide persistent context that's automatically included in conversations.

### Three Levels of Context

```
~/.claude/CLAUDE.md           # User-level (your preferences)
├── project/
│   ├── CLAUDE.md             # Project-level (codebase rules)
│   └── src/
│       └── components/
│           └── CLAUDE.md     # Directory-level (local patterns)
```

**User-level** (`~/.claude/CLAUDE.md`):
- Personal preferences that apply to all projects
- Your coding style preferences
- Common patterns you use

**Project-level** (project root `CLAUDE.md`):
- Project architecture and structure
- Technology stack and versions
- Team conventions and standards
- Important files and their purposes

**Directory-level** (any subdirectory `CLAUDE.md`):
- Patterns specific to that part of the codebase
- Local conventions that differ from project-wide rules
- Component-specific guidelines

### How Context Flows

When you ask Claude a question, it automatically reads:
1. Your user-level `CLAUDE.md` (if it exists)
2. The project-level `CLAUDE.md` (if it exists)
3. Any `CLAUDE.md` files in directories between the project root and your current file

This creates a cascade where general rules apply everywhere, but specific directories can add or override rules.

## Writing Effective CLAUDE.md Files

### Project-Level Template

Here's a template for a project-level `CLAUDE.md`:

```markdown
# Project Context

## Overview
Brief description of what this project does and its purpose.

## Technology Stack
- Framework: React 18 with TypeScript
- Styling: Tailwind CSS
- State: React Query for server state, Zustand for client state
- Testing: Vitest + React Testing Library

## Project Structure
src/
├── components/    # Reusable UI components
├── features/      # Feature-specific code
├── hooks/         # Custom React hooks
├── utils/         # Pure utility functions
├── api/           # API client and types
└── types/         # Shared TypeScript types

## Coding Conventions
- Use functional components with hooks
- Prefer named exports over default exports
- Write tests for business logic and complex components
- Use TypeScript strict mode

## Important Files
- src/api/client.ts - API configuration and interceptors
- src/types/index.ts - Shared type definitions
- .env.example - Required environment variables

## Commands
- `npm run dev` - Start development server
- `npm run test` - Run tests
- `npm run build` - Production build
```

### Directory-Level Example

For a `components/` directory:

```markdown
# Components Directory

## Conventions
- One component per file
- Component file names use PascalCase
- Each component should have:
  - Component.tsx - Main component
  - Component.test.tsx - Tests
  - index.ts - Export barrel

## Patterns
- Props interfaces named `{ComponentName}Props`
- Use `forwardRef` for components that wrap native elements
- Prefer composition over prop drilling
```

### What to Include (and Exclude)

**Include:**
- Architecture decisions and rationale
- Non-obvious conventions
- File organization patterns
- Testing requirements
- Important configuration files

**Exclude:**
- Obvious information (e.g., "this is a JavaScript project" in a `.js` file)
- Sensitive information (API keys, passwords)
- Information that changes frequently
- Redundant details already clear from code

## Bootstrapping with /init

Rather than writing CLAUDE.md files from scratch, Claude Code provides the `/init` command to generate a starter file based on your codebase.

### What /init Does

When you run `/init` in a project, Claude Code analyzes your codebase to detect:

- **Build systems**: package.json scripts, Makefiles, etc.
- **Test frameworks**: Jest, Vitest, pytest, etc.
- **Code patterns**: Component structures, API patterns, etc.
- **Project structure**: Directory organization and key files

It then generates a CLAUDE.md file with this information as a starting point.

Claude will analyze the project and create a CLAUDE.md file. Review the generated content—it's a starting point, not a finished product.

### Refining Generated Content

After `/init` creates your CLAUDE.md, review it with these questions:

1. **What's missing?** Add context Claude couldn't detect (architectural decisions, team conventions, external dependencies)
2. **What's unnecessary?** Remove obvious information that clutters the file
3. **What's incorrect?** Fix any misinterpretations of your codebase

### Best Practice

Keep CLAUDE.md concise. For each line, ask: *"Would removing this cause Claude to make mistakes?"* If not, cut it. A focused 20-line CLAUDE.md is more effective than a sprawling 200-line document.

## Crafting Effective Prompts

Beyond `CLAUDE.md` files, how you phrase individual prompts affects results.

### Prompt Patterns for Common Tasks

**Code generation:**
```
Write a [type of code] that [does what].
Requirements:
- [Specific requirement 1]
- [Specific requirement 2]
Follow our existing pattern in [reference file].
```

**Debugging:**
```
This code isn't working as expected:
[code block]

Expected behavior: [what should happen]
Actual behavior: [what's happening]
Error message (if any): [error]

What's causing this and how do I fix it?
```

**Code review:**
```
Review this code for:
- Potential bugs
- Performance issues
- Adherence to our conventions in CLAUDE.md

[code block]
```

**Refactoring:**
```
Refactor this code to [goal]:
[code block]

Maintain the same external API/behavior.
Focus on [specific improvement area].
```

## Iterative Context Building

Complex tasks benefit from building context through conversation.

### The Three-Step Pattern

**Step 1: Establish understanding**
```
I'm working on adding dark mode to our app. Before we start,
can you summarize:
1. How our current theme system works (see src/theme/)
2. What components would need updates
```

**Step 2: Plan the approach**
```
Based on your analysis, let's plan the implementation:
1. What's the best approach for theme switching?
2. Where should we store the user's preference?
3. What's the order of changes we should make?
```

**Step 3: Execute incrementally**
```
Let's start with step 1: creating the theme context.
Please create a ThemeProvider component that...
```

### Maintaining Context Across Sessions

Claude Code conversations reset between sessions. To maintain continuity:

1. **Update CLAUDE.md** with decisions made during sessions
2. **Create ADR files** (Architecture Decision Records) for significant choices
3. **Reference previous work** in new prompts:

```
We previously implemented the theme context (src/context/ThemeContext.tsx).
Now let's update the Header component to use it.
```

## Practical Exercise: Building Context

Let's practice context engineering with the **Coins R Us** project—a Next.js application you'll work with again in Section 4 (Brownfield Development).

### Scenario

You're joining a coin collection management app mid-development. The team built the frontend but left no documentation. Your task: create a CLAUDE.md file so Claude Code can help effectively.

### Exercise Steps


1. **Run /init to generate a starter CLAUDE.md**
   Get the repo link from your instructor and clone the repo in your workspace.
Open the `coins-r-us` directory and run the `/init` command in Claude Code (either the CLI or the VS code extension, your choice).

   Let Claude analyze the codebase and generate an initial file.

2. **Review what Claude detected**
   - Did it identify the tech stack correctly?
   - Did it find the available npm scripts?
   - What patterns did it recognize?

3. **Enhance the CLAUDE.md with any missing context**

   Claude is thorough, but it's possible it missed some important details. Add information about:
   - The json-server backend requirement (runs on port 3001)
   - How to start both frontend and backend
   - The relationship between Next.js API routes and json-server
   - Any conventions you notice in the code

4. **Test your documentation**

   Switch to `|| Plan` mode and Ask Claude Code a question that requires project context:
   ```
   How do I add a new API endpoint to fetch a single coin by ID?
   ```
   Does Claude's response reflect your documented conventions? Read the plan and compare it to the codebase. Is the plan comprehensive or is it missing any important information that could be added to the CLAUDE.md file?

   This is a pretty simple application so Claude likely got most of this right. However imagine you are working on a much larger codebase. You can use Claude to help you understand the project architecture and document your findings in CLAUDE.md. 

5. **Directory-level CLAUDE.md**
   This sample project is quite simple, therefore Claude's documentation in the project-level `CLAUDE.md` is likely comprehensive enough. However, for demonstration purposes, run `/init /src/app/api` to prompt Claude to create a `CLAUDE.md` file for the patterns in this directory. 

   What did it create? How does this help you understand the codebase better?

### What You Should Discover

As you explore the project, you'll find:
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Styled Components + Radix UI
- **Backend**: json-server mock API with database.json
- **Key commands**: `npm run dev` (frontend), `npx json-server --watch data/database.json --port 3001` (backend)

## Key Takeaways

1. **Context shapes predictions**: Better context leads to better code generation
2. **CLAUDE.md hierarchy**: User → Project → Directory levels cascade automatically
3. **Use /init to bootstrap**: Generate starter CLAUDE.md files, then refine them
4. **Build context iteratively**: Complex tasks benefit from conversational context building

## Glossary

- **Context Engineering**: The practice of structuring information to optimize LLM responses
- **CLAUDE.md**: Markdown files that provide persistent context to Claude Code
- **Token Budget**: The practical limit of context you should provide, balancing completeness with efficiency

---

In the next chapter, we'll explore the agentic loop—how Claude Code executes multi-step tasks through a gather-act-verify cycle.
