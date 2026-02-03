Claude Code works in two environments: the command line (CLI) and Visual Studio Code (IDE). Each has strengths that make it better suited for different workflows. This chapter helps you choose the right tool for each situation.

## Two Ways to Work

### The CLI Experience

```bash
$ claude "Add validation to the registration form"

I'll add validation to the registration form. Let me first
read the current implementation...

Reading src/components/RegistrationForm.tsx...

I see the form currently has no validation. I'll add:
- Email format validation
- Password strength check
- Confirm password match

[Shows diff]

Apply changes? (y/n)
```

### The IDE Experience

```
┌─────────────────────────────────────────────────────────────┐
│ VS Code                                                     │
├─────────────────────────────────┬───────────────────────────┤
│ [RegistrationForm.tsx]          │   Claude Code             │
│                                 │                           │
│ 1  import React from 'react';   │   You: Add validation to  │
│ 2  import { useState } from     │   the registration form   │
│ 3                               │                           │
│ 4  export function Registra... │   Claude: I'll add        │
│ 5    const [email, setEmail]   │   validation...           │
│ 6                               │                           │
│ 7    // [highlighted change]    │   [Inline diff preview]   │
│ 8                               │                           │
│                                 │   [Accept] [Reject]       │
└─────────────────────────────────┴───────────────────────────┘
```

## Feature Comparison

| Feature | CLI | IDE |
|---------|-----|-----|
| **File context** | Manual or per-prompt | Automatic from open files |
| **Diff preview** | Text-based | Visual with syntax highlighting |
| **Multi-file edits** | Sequential | Parallel with tabs |
| **Code navigation** | External editor | Click-to-jump |
| **Session persistence** | Per-command or conversation | Persists with workspace |
| **Automation** | Full scriptability | Limited |
| **Resource usage** | Minimal | VS Code overhead |
| **Selection context** | Paste or reference | Highlight and ask |

## When to Use the CLI

### Best CLI Use Cases

**1. Quick one-off tasks**

```bash
$ claude "What does the fetchUsers function do?"
```

No need to open an editor for a quick question.

**2. Scripted workflows**

```bash
#!/bin/bash
# Auto-review all changed files
for file in $(git diff --name-only); do
  claude "Review $file for issues" --plan
done
```

The CLI integrates with shell scripts and automation.

**3. Working with large contexts**

```bash
$ claude "Analyze the entire src/ directory and suggest
          architectural improvements" --context src/
```

CLI can efficiently process large file sets.

**4. Server/remote development**

```bash
# SSH into server
$ ssh production-server
$ claude "Debug why the API is returning 500 errors"
```

Works anywhere with terminal access.

**5. Git-centric workflows**

```bash
$ git diff | claude "Review these changes"
$ claude "Write a commit message for staged changes"
```

Natural integration with git commands.

**6. Focused, distraction-free work**

The CLI keeps you in terminal flow without switching contexts.

### CLI Strengths

- **Speed**: No GUI overhead, instant startup
- **Scriptability**: Combine with shell tools and automation
- **Portability**: Works on any system with Node.js
- **Simplicity**: One interface, no learning curve for VS Code
- **Pipeline integration**: Compose with Unix tools

### CLI Workflow Example

A typical CLI workflow for fixing a bug:

```bash
# 1. Understand the issue
$ claude "Explain the error in src/api/auth.ts:45"

# 2. Get a fix suggestion
$ claude "How should I fix this authentication bug?"

# 3. Apply the fix
$ claude "Fix the auth bug we discussed" --auto-accept

# 4. Verify
$ npm test

# 5. Commit
$ claude --commit
```

## When to Use the IDE

### Best IDE Use Cases

**1. Active development sessions**

When you're writing code and want Claude alongside:
- Ask questions about code in front of you
- Get suggestions as you work
- Apply changes without leaving the editor

**2. Visual diff review**

IDE shows changes with:
- Syntax highlighting
- Line-by-line comparison
- One-click accept/reject

**3. Multi-file refactoring**

When changes span many files:
- See all affected files in tabs
- Navigate between changes
- Track what's been modified

**4. Learning and exploration**

IDE provides:
- Click-to-navigate to definitions
- Inline documentation
- Visual context about code structure

**5. Selection-based queries**

Highlight code and ask about it:
```
[Select a function]
Right-click > "Ask Claude about this"

Claude: This function implements a debounce pattern...
```

**6. Maintaining context**

IDE remembers:
- Open files
- Conversation history
- Workspace state

### IDE Strengths

- **Visual context**: See code and chat side by side
- **Direct manipulation**: Click to navigate, accept, or reject
- **Selection integration**: Ask about highlighted code
- **Persistent workspace**: Everything in one place
- **Familiar environment**: Standard VS Code workflows

### IDE Workflow Example

A typical IDE workflow for adding a feature:

```
1. Open relevant files in tabs
2. Tell Claude what you want to build
3. Claude shows inline diffs across files
4. Review each change visually
5. Accept, reject, or modify
6. Test in integrated terminal
7. Commit with built-in git
```

## Hybrid Workflows

The most effective developers use both tools strategically.

### Pattern: CLI for Research, IDE for Implementation

```bash
# CLI: Quick exploration
$ claude "What patterns does this codebase use for error handling?"

# IDE: Implement feature using those patterns
[Open VS Code, start implementation with Claude]
```

### Pattern: IDE for Development, CLI for Commits

```
[VS Code: Write and test feature]

$ git add .
$ claude "Review staged changes"
$ claude --commit
$ git push
```

### Pattern: CLI for Automation, IDE for Oversight

```bash
# Script runs nightly
$ claude "Check for deprecated dependencies and create upgrade PRs"

# Review in IDE next morning
[Open VS Code, review suggested changes]
```

### Pattern: Switching Based on Task

| Task | Tool |
|------|------|
| "What does this code do?" | CLI (quick) |
| "Build a new component" | IDE (visual) |
| "Review my changes" | CLI (scriptable) |
| "Refactor these 5 files" | IDE (multi-file) |
| "Debug this error" | CLI (fast) or IDE (visual) |
| "Write commit message" | CLI (git integration) |

## Making the Choice

### Ask These Questions

**1. Do I need to see the code?**
- Yes → IDE
- No → CLI

**2. Is this a one-off or ongoing?**
- One-off → CLI
- Ongoing session → IDE

**3. Do I need visual diffs?**
- Yes → IDE
- Text diffs fine → CLI

**4. Am I automating this?**
- Yes → CLI
- No → Either

**5. Am I on a remote machine?**
- Yes → CLI
- No → Either

### Decision Flowchart

```
                    ┌─────────────────────┐
                    │ What's the task?    │
                    └──────────┬──────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           ▼                   ▼                   ▼
    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │Quick query  │     │Development  │     │Automation   │
    │or script    │     │session      │     │             │
    └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
           │                   │                   │
           ▼                   ▼                   ▼
        CLI                  IDE                 CLI
```

## Environment Setup for Both

### CLI Configuration

Create `~/.claude/config`:

```json
{
  "defaultModel": "claude-3-5-sonnet",
  "autoAccept": false,
  "outputStyle": "concise"
}
```

### IDE Configuration

VS Code settings:

```json
{
  "claudeCode.autoSuggest": true,
  "claudeCode.contextFiles": true,
  "claudeCode.panelPosition": "right"
}
```

### Shared Context

Both tools read the same `CLAUDE.md` files:

```markdown
# Project Context

Applies to both CLI and IDE sessions.

## Patterns
- Use functional components
- Error handling: our custom ErrorBoundary
- Testing: Vitest with React Testing Library
```

## Transitioning Between Tools

### CLI to IDE

```bash
# Discover something in CLI
$ claude "Find all usages of the deprecated login function"

# Response shows 12 usages across 8 files
# Switch to IDE to make the changes visually
```

### IDE to CLI

```
[In IDE, realize you need to run a complex script]

# Open integrated terminal
$ claude "Generate a script to migrate all user accounts"
$ ./migrate.sh
```

### Maintaining Context

Conversation history is separate between CLI and IDE. To bridge:

```bash
# CLI: Save context to a file
$ claude "Summarize our discussion about the auth refactor" > auth-plan.md

# IDE: Reference in next session
[Open auth-plan.md alongside your work]
```

Or use CLAUDE.md:

```markdown
## Recent Decisions

### Auth Refactor (2024-01)
Decided to use JWT with refresh tokens.
See full discussion: docs/decisions/auth-refactor.md
```

## Practical Exercise: Tool Selection

Try completing the same task with both tools.

### Setup

Choose a small task: "Add a helper function to format phone numbers"

### Part 1: CLI Approach

```bash
$ claude "Create a formatPhoneNumber function in src/utils/"
```

Note:
- How long did it take?
- How was the experience reviewing changes?
- Did you feel you had enough context?

### Part 2: IDE Approach

Open VS Code, then:
```
"Create a formatPhoneNumber function in utils"
```

Note:
- How did inline diffs help or hinder?
- Was the visual context valuable?
- Did the session feel more or less efficient?

### Part 3: Reflect

- Which tool felt more natural for this task?
- Would your answer change for a larger task?
- What's your default going forward?

## Common Pitfalls

### Over-relying on One Tool

**Problem**: Using only CLI when IDE would be faster
**Solution**: Match tool to task, not habit

### Context Confusion

**Problem**: Forgetting what each tool "knows"
**Solution**: Use CLAUDE.md for shared context, reference files explicitly

### Fighting the Tool

**Problem**: Trying to make CLI do what IDE does well (or vice versa)
**Solution**: Switch tools when friction increases

## Key Takeaways

1. **CLI excels at**: Quick queries, automation, scripting, remote work
2. **IDE excels at**: Visual diffs, multi-file work, active development, learning
3. **Use both**: Match the tool to the task, not your habit
4. **Shared foundation**: CLAUDE.md works in both environments
5. **Context is separate**: Plan for transitioning between tools
6. **Experiment**: Try both approaches to find what works for you

## Glossary

- **CLI (Command Line Interface)**: The terminal-based Claude Code tool
- **IDE (Integrated Development Environment)**: VS Code with Claude Code extension
- **Inline diff**: Visual code change preview within the editor
- **Scriptability**: The ability to automate and compose with other tools
- **Context persistence**: How tools remember conversation and file state

---

You've now mastered effective development workflows with Claude Code. In the next section, we'll explore extending capabilities—using task delegation, MCP servers, and external integrations to accomplish even more.
