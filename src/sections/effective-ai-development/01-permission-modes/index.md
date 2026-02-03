Claude Code offers different permission modes that control how much autonomy the agent has when executing tasks. Understanding these modes helps you choose the right level of oversight for different situations.

## Why Permission Modes Matter

Every action Claude Code takes—reading files, editing code, running commands—has potential consequences. Permission modes let you balance:

- **Safety**: Reviewing actions before they happen
- **Speed**: Letting the agent work without constant approval
- **Control**: Maintaining oversight of critical operations

The right mode depends on your task, your familiarity with the codebase, and your risk tolerance.

## The Three Modes

Claude Code provides three distinct permission modes:

| Mode | Description | Best For |
|------|-------------|----------|
| **Normal** | Asks permission for each action | Learning, unfamiliar code, risky tasks |
| **Auto-Accept** | Approves read/write operations automatically | Familiar codebases, routine tasks |
| **Plan** | Analysis only, no modifications | Exploration, understanding, planning |

### Visual Comparison

```
Task: "Add error handling to the login function"

NORMAL MODE:
You ──prompt──> Claude ──reads file──> [Approve?] ──edits file──> [Approve?] ──runs lint──> [Approve?]

AUTO-ACCEPT MODE:
You ──prompt──> Claude ──reads file──> ──edits file──> ──runs lint──> Done

PLAN MODE:
You ──prompt──> Claude ──reads file──> ──analyzes──> "Here's how I would add error handling..."
```

## Normal Mode (Default)

Normal mode is Claude Code's default setting. It asks for your approval before taking any action.

### How It Works

```
You: Add a loading state to the UserProfile component

Claude: I'll read the UserProfile component first.

        Read src/components/UserProfile.tsx?
        [Allow] [Deny]

        > [Allow]

Claude: I can see the component fetches user data. I'll add loading
        state with useState. Here's my edit:

        Edit src/components/UserProfile.tsx?
        [Allow] [Deny] [View Diff]
```

### Approval Options

When Claude asks for permission, you typically have these options:

- **Allow**: Approve this specific action
- **Deny**: Reject the action
- **View Diff**: See exactly what changes will be made (for edits)
- **Allow Always**: Approve this type of action for the session

### When to Use Normal Mode

**Recommended for:**
- First time working in a codebase
- Tasks involving configuration files
- Operations that could have side effects
- Learning how Claude Code operates
- Sensitive areas (auth, payments, security)

**Example scenario:**
```
You're new to a project and want to understand its structure.
Using Normal mode, you can see exactly what files Claude reads
and how it interprets the codebase.
```

### Tips for Normal Mode

1. **Use "View Diff"** liberally—understanding changes builds intuition
2. **"Allow Always"** for repetitive approvals (like file reads)
3. **Deny and redirect** when Claude takes the wrong approach
4. **Take notes** on patterns you observe

## Auto-Accept Mode

Auto-accept mode lets Claude Code operate more autonomously by automatically approving certain actions.

### How It Works

In auto-accept mode, Claude automatically proceeds with:
- File reads
- File edits
- File creation
- Most terminal commands

```
You: Add a loading state to the UserProfile component

Claude: I'll add loading state to the UserProfile component.

        Reading src/components/UserProfile.tsx...
        Editing src/components/UserProfile.tsx...
        Running: npm run lint

        Done! I've added a loading state that shows a spinner
        while user data is being fetched.
```

### What Still Requires Approval

Even in auto-accept mode, certain actions require explicit approval:

- **Destructive commands**: `rm`, `git reset --hard`, etc.
- **Package installation**: `npm install`, adding dependencies
- **Git operations**: Commits, pushes, branch operations
- **Network requests**: External API calls
- **System modifications**: Environment changes

### Enabling Auto-Accept

In VS Code:
1. Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Search "Claude Code: Enable Auto-Accept"
3. Confirm when prompted

In CLI:
```bash
claude --auto-accept "Your prompt here"
# or
claude -y "Your prompt here"
```

### When to Use Auto-Accept Mode

**Recommended for:**
- Well-understood codebases
- Routine tasks (refactoring, formatting)
- Iterative development with frequent changes
- Time-sensitive work
- Tasks you've done manually many times

**Example scenario:**
```
You're fixing TypeScript errors across a codebase. You know
the changes are safe, and stopping to approve each edit would
slow you down significantly.
```

### Risks and Mitigations

**Risk**: Unreviewed changes may introduce bugs

**Mitigations:**
- Work on a feature branch
- Keep changes atomic and testable
- Run tests after auto-accept sessions
- Review git diff before committing

```bash
# After auto-accept session:
git diff                    # Review all changes
npm test                    # Run tests
git add -p                  # Stage selectively
```

## Plan Mode

Plan mode restricts Claude to read-only operations—it can analyze and suggest but cannot modify anything.

### How It Works

```
You: How would you add authentication to this Express app?

Claude: [Reads package.json]
        [Reads src/app.js]
        [Reads src/routes/]

        Here's how I'd approach adding authentication:

        1. Install dependencies: passport, passport-jwt, bcrypt
        2. Create auth middleware in src/middleware/auth.js
        3. Add user model in src/models/User.js
        4. Create routes in src/routes/auth.js
        5. Update app.js to use passport

        Would you like me to show the specific code for any step?
```

### What Plan Mode Can Do

- **Read files**: Explore the entire codebase
- **Search code**: Find patterns and implementations
- **Analyze structure**: Understand architecture
- **Generate suggestions**: Provide detailed plans
- **Show code**: Display what it *would* write

### What Plan Mode Cannot Do

- Edit any files
- Create new files
- Run commands (except read-only ones like `ls`)
- Make any modifications

### Enabling Plan Mode

In VS Code:
1. Open Command Palette
2. Search "Claude Code: Enter Plan Mode"
3. Or use the mode selector in the Claude Code panel

In CLI:
```bash
claude --plan "Analyze this codebase and suggest improvements"
# or
claude -p "How would you refactor the authentication system?"
```

### When to Use Plan Mode

**Recommended for:**
- Exploring unfamiliar codebases
- Architecture planning sessions
- Getting suggestions before implementing
- Learning how Claude would approach problems
- Code review and analysis
- Understanding complex systems

**Example scenario:**
```
You've inherited a legacy codebase. Before making changes,
you want to understand its structure, patterns, and potential
issues without accidentally modifying anything.
```

### Plan Mode Workflow

A typical plan mode workflow:

1. **Enter plan mode**
2. **Ask for analysis**: "Explain how authentication works in this app"
3. **Request suggestions**: "How would you improve the error handling?"
4. **Get implementation plan**: "Create a step-by-step plan to add feature X"
5. **Exit plan mode** when ready to implement
6. **Implement with plan as guide**: Use normal or auto-accept mode

## Switching Between Modes

### Quick Reference

| From | To | VS Code | CLI |
|------|-----|---------|-----|
| Normal | Auto-Accept | Command Palette | `--auto-accept` or `-y` |
| Normal | Plan | Command Palette | `--plan` or `-p` |
| Auto-Accept | Normal | Command Palette | Disable auto-accept |
| Plan | Normal | Command Palette | Exit plan mode |

### Mode Transitions in Practice

A typical session might flow:

```
1. START: Plan mode
   - Explore new codebase
   - Understand architecture
   - Plan your approach

2. TRANSITION: Normal mode
   - Begin implementation
   - Review each change
   - Build understanding

3. TRANSITION: Auto-accept mode
   - Speed up routine work
   - Trust patterns you've verified
   - Complete implementation quickly

4. FINISH: Normal mode
   - Final changes
   - Careful review
   - Commit preparation
```

## Choosing the Right Mode

### Decision Framework

Ask yourself these questions:

**1. How familiar am I with this codebase?**
- New to it → Plan or Normal
- Somewhat familiar → Normal
- Very familiar → Auto-accept

**2. What's the risk of this task?**
- High risk (auth, data, security) → Normal
- Medium risk (features) → Normal, then Auto-accept
- Low risk (formatting, typos) → Auto-accept

**3. What's my goal right now?**
- Understanding → Plan
- Learning → Normal
- Implementing → Normal or Auto-accept
- Fixing quickly → Auto-accept

### Mode Recommendations by Task

| Task | Recommended Mode |
|------|------------------|
| Codebase exploration | Plan |
| Architecture planning | Plan |
| First feature in new repo | Normal |
| Security-related changes | Normal |
| Configuration changes | Normal |
| Routine refactoring | Auto-accept |
| Fixing lint errors | Auto-accept |
| Adding tests | Auto-accept (after first few) |
| Debug investigation | Plan, then Normal |
| Code review | Plan |

## Practical Exercise: Mode Exploration

Try each mode with the same task to understand the differences.

### Setup

Choose a simple task: "Add a timestamp to console.log statements in a file"

### Exercise

**Step 1: Plan Mode**
```
Enter plan mode and ask Claude:
"How would you add timestamps to console.log statements?"

Observe:
- What files does it read?
- How detailed is its plan?
- Note that nothing changes
```

**Step 2: Normal Mode**
```
Exit plan mode and give the same task.

Observe:
- What approvals are required?
- How do the actual changes match the plan?
- What would you deny or modify?
```

**Step 3: Auto-Accept Mode**
```
Undo the changes (git checkout) and enable auto-accept.
Give the same task.

Observe:
- How fast is the execution?
- What actions still require approval?
- Is the result different from Normal mode?
```

### Reflect

- Which mode felt most comfortable?
- What situations would require each mode?
- How would you combine modes in real work?

## Key Takeaways

1. **Normal mode** provides full visibility and control—use it when learning or for risky tasks
2. **Auto-accept mode** speeds up routine work but requires trust in your recovery capabilities
3. **Plan mode** is pure analysis—perfect for exploration and planning before action
4. **Match mode to task**: High risk = more oversight, routine work = more autonomy
5. **Mode switching** is natural—move between modes as your needs change throughout a session
6. **Safety nets matter**: Use version control and tests regardless of mode

## Glossary

- **Permission Mode**: A setting that controls how much autonomy Claude Code has over file and command operations
- **Auto-Accept**: A mode where Claude automatically approves non-destructive file operations
- **Plan Mode**: A read-only mode where Claude can analyze but not modify
- **Destructive Command**: A command that could cause irreversible changes (delete, reset, force push)
- **Approval Gate**: A checkpoint where Claude pauses to ask for permission

---

In the next chapter, we'll learn the Explore-Plan-Implement workflow—a structured approach to tackling complex development tasks with Claude Code.
