When you ask Claude Code to complete a task, it doesn't just generate a response—it operates as an **agent** that can gather information, take actions, and verify results. This chapter explores how this agentic behavior works and how to collaborate effectively with it.

## What Makes AI "Agentic"?

Traditional AI interactions are simple request-response pairs:

```
You: "What's 2 + 2?"
AI: "4"
```

Agentic AI goes further. It can:

1. **Gather information** before responding (read files, search code)
2. **Take actions** on your behalf (edit files, run commands)
3. **Verify results** after acting (check for errors, run tests)
4. **Iterate** when something doesn't work

This transforms AI from a question-answering tool into a collaborative assistant that can execute multi-step tasks.

### A Simple Example

When you ask Claude Code to "add error handling to the login function," it doesn't just output code. It:

1. **Gathers**: Reads the file containing the login function
2. **Analyzes**: Understands the current implementation
3. **Plans**: Determines what error handling to add
4. **Acts**: Edits the file with the changes
5. **Verifies**: Checks the syntax is valid

This loop can repeat as needed until the task is complete.

## The Gather-Act-Verify Cycle

At its core, agentic behavior follows a continuous cycle:

```
┌─────────────────────────────────────────┐
│                                         │
│    ┌─────────┐                          │
│    │ GATHER  │ ← Read files, search     │
│    └────┬────┘   code, get context      │
│         │                               │
│         ▼                               │
│    ┌─────────┐                          │
│    │   ACT   │ ← Edit files, run        │
│    └────┬────┘   commands, generate     │
│         │                               │
│         ▼                               │
│    ┌─────────┐                          │
│    │ VERIFY  │ ← Check results, run     │
│    └────┬────┘   tests, validate        │
│         │                               │
│         └──────────────────────────┐    │
│                                    │    │
│    Repeat if needed ←──────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

### Gather Phase

Before acting, Claude Code collects the information it needs:

**File reading**: Opens and reads relevant files
```
Reading src/auth/login.ts...
Reading src/types/user.ts...
Reading src/utils/validation.ts...
```

**Code search**: Finds related code across the project
```
Searching for "handleLogin" usage...
Found 3 references in 2 files
```

**Context awareness**: Uses your CLAUDE.md files and open editor tabs

The gather phase is crucial—Claude Code can't make good decisions without understanding the current state.

### Act Phase

After gathering context, Claude Code takes action:

**File edits**: Modifies existing files
```
Editing src/auth/login.ts:
- Adding try-catch block around API call
- Adding error state handling
- Adding user feedback for failures
```

**File creation**: Creates new files when needed
```
Creating src/auth/login.test.ts
Creating src/types/errors.ts
```

**Command execution**: Runs terminal commands
```
Running: npm run lint
Running: npm test -- --testPathPattern=login
```

### Verify Phase

After acting, Claude Code checks its work:

**Syntax validation**: Ensures code is valid
**Lint checks**: Runs linters to catch issues
**Test execution**: Runs relevant tests
**Error checking**: Looks for problems in output

If verification fails, the cycle repeats with corrections.

## How Claude Code Decides What To Do

Claude Code uses its training and your context to make decisions. Understanding this helps you guide it effectively.

### The Decision Process

1. **Parse the request**: What are you asking for?
2. **Assess current state**: What files exist? What's their content?
3. **Plan approach**: What steps will accomplish the goal?
4. **Execute steps**: Carry out the plan
5. **Evaluate results**: Did it work?

### What Influences Decisions

**Your prompt**: The clearer your request, the better the decisions

```
Vague: "Fix authentication"
Clear: "Add password validation to the registration form that
       requires 8+ characters, one uppercase, and one number"
```

**Project context**: CLAUDE.md files guide conventions

**Existing code**: Claude Code follows patterns it observes

**Error messages**: Feedback from commands influences next steps

### Decision Transparency

Claude Code shows its reasoning:

```
I'll add error handling to the login function. First, let me read
the current implementation to understand the structure.

[Reads file]

I see the function makes an API call without error handling. I'll:
1. Wrap the API call in a try-catch
2. Add specific error types for common failures
3. Return appropriate error messages to the caller

[Edits file]

Let me verify the changes by running the linter...
```

This transparency helps you understand and guide the process.

## Tools and Capabilities

Claude Code has access to specific tools that enable agentic behavior.

### File Operations

**Read**: View file contents
**Edit**: Modify existing files
**Write**: Create new files
**Glob**: Find files matching patterns
**Grep**: Search file contents

### Command Execution

**Bash**: Run terminal commands
- Build commands (`npm run build`)
- Test commands (`npm test`)
- Git operations (`git status`, `git diff`)
- Package management (`npm install`)

### Specialized Tools

**Web search**: Find documentation and solutions
**Web fetch**: Retrieve content from URLs
**Task delegation**: Spawn sub-agents for complex tasks

### Tool Limitations

Understanding limitations prevents frustration:

- **No GUI interaction**: Can't click buttons in browsers
- **No persistent processes**: Long-running servers need manual handling
- **Environment boundaries**: Can only access your local filesystem
- **Permission required**: Asks before destructive operations

## When to Intervene vs. Let It Run

Effective collaboration means knowing when to step in.

### Let Claude Code Run When:

**Clear, bounded tasks**
```
"Add a loading spinner to the submit button"
```

**Pattern-following work**
```
"Create a new API endpoint following our existing pattern"
```

**Iterative refinement**
```
"Fix the TypeScript errors in this file"
```

### Intervene When:

**Heading wrong direction**
```
Claude: "I'll refactor this to use Redux..."
You: "Actually, we want to keep using Context API"
```

**Missing context**
```
Claude: "I don't see any tests, so I'll skip testing"
You: "Tests are in __tests__ directories, please add them"
```

**Unexpected scope expansion**
```
Claude: "While I'm here, I'll also refactor the entire auth system..."
You: "Let's focus on just the login form for now"
```

**Risky operations**
```
Claude: "I'll run npm audit fix --force to resolve vulnerabilities"
You: "Wait - let me review the changes that would make first"
```

### The Permission System

Claude Code asks for permission before potentially risky actions:

```
I need to run a bash command to install the dependency:
npm install react-hook-form

Allow? (y/n)
```

This gives you checkpoints to review and approve actions.

## Optimizing the Loop

You can influence how efficiently Claude Code operates.

### Provide Context Upfront

Instead of:
```
"Update the form"
[Claude reads files, makes assumptions]
"No, I meant the contact form"
[Claude re-reads different files]
```

Try:
```
"Update the contact form in src/components/ContactForm.tsx
to add phone number validation"
```

### Use Checkpoints for Complex Tasks

```
"Before making changes, show me your plan for implementing
the search feature"

[Claude shows plan]

"That looks good, but let's use Fuse.js instead of building
our own fuzzy search. Please proceed with that change."
```

### Guide the Verification Strategy

```
"After making changes, please:
1. Run the linter
2. Run tests for the affected component
3. Show me a summary of changes"
```

### Break Down Large Tasks

Instead of:
```
"Implement user authentication with registration, login,
password reset, and email verification"
```

Try:
```
"Let's implement user authentication step by step.
Start with basic registration - just email and password."

[Complete registration]

"Now add login functionality"

[Continue incrementally]
```

## Understanding the Output

Claude Code shows what it's doing as it works.

### Reading the Activity Log

```
⠋ Reading src/components/Form.tsx              # Gather
⠋ Searching for "FormProps" in project         # Gather
⠋ Editing src/components/Form.tsx              # Act
⠋ Running: npm run lint                        # Verify
✓ Lint passed                                  # Verify result
```

### Interpreting Results

**Success indicators:**
- ✓ checkmarks
- "completed successfully"
- Test pass messages

**Warning signs:**
- Error messages in output
- "I'll try a different approach"
- Repeated attempts at same action

### When Things Go Wrong

If Claude Code gets stuck:

1. **Stop the current operation** if it's looping
2. **Provide clarification** about what's wrong
3. **Add context** about constraints or requirements
4. **Simplify the request** if it's too complex

```
You: Stop. The tests are failing because we need to mock the API.
     Our mocking pattern is in src/test-utils/mocks.ts. Please
     use that pattern for the new tests.
```

## Practical Exercise: Observing the Loop

Try this exercise to see the agentic loop in action:

### Setup

1. Open a project with existing code
2. Find a function that lacks error handling

### Exercise

Ask Claude Code:
```
"Add comprehensive error handling to the [function name] function.
After making changes, run the tests to verify nothing broke."
```

### Observe

Watch for:
1. What files does it read first?
2. What approach does it take?
3. How does it verify the changes?
4. Does it iterate if something fails?

### Reflect

- Did the gather phase collect enough context?
- Were the actions appropriate?
- Was verification thorough?
- Would you intervene differently next time?

## Key Takeaways

1. **Agentic means autonomous action**: Claude Code gathers, acts, and verifies without constant guidance
2. **The loop is iterative**: It repeats until the task is complete or it needs help
3. **Context drives decisions**: Better context leads to better autonomous choices
4. **Know when to intervene**: Guide when heading wrong, let it run for clear tasks
5. **Use the permission system**: Review before approving potentially risky actions
6. **Break down complexity**: Smaller tasks lead to more reliable execution

## Glossary

- **Agentic Loop**: The cycle of gather-act-verify that enables autonomous task completion
- **Tool Use**: The ability of an AI agent to execute specific operations like reading files or running commands
- **Verification**: The phase where an agent checks whether its actions achieved the desired outcome
- **Intervention**: When you stop or redirect the agent's autonomous behavior
- **Permission Checkpoint**: A point where the agent asks for approval before a potentially risky action

---

You now understand the fundamentals of AI-assisted development with Claude Code. In the next section, we'll dive into effective development workflows—learning how to leverage different modes and features for various types of tasks.
