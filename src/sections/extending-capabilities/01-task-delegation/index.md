As tasks grow in complexity, a single Claude Code conversation can become unwieldy. Task delegation allows Claude to spawn subagents—specialized helpers that tackle specific parts of a larger problem. This chapter explains how delegation works and when to use it effectively.

## Why Delegate Tasks?

Consider a complex request:

```
You: Refactor the entire authentication system to use JWT,
     update all tests, and update the documentation.
```

This involves:
- Understanding the current auth system
- Designing the new JWT implementation
- Refactoring multiple files
- Updating dozens of tests
- Writing documentation

Handling all of this in a single conversation creates problems:
- Context becomes cluttered with too much information
- Mistakes in one area affect understanding of others
- Hard to track progress across multiple concerns

Task delegation solves this by breaking work into focused pieces.

## How Task Delegation Works

When Claude recognizes a task would benefit from delegation, it can spawn a **subagent**—a separate Claude instance with its own context.

```
┌─────────────────────────────────────────────────────────────┐
│                     Main Claude (Orchestrator)              │
│                                                             │
│  "Refactor auth to use JWT..."                              │
│                                                             │
│         ┌─────────────────┬─────────────────┐               │
│         │                 │                 │               │
│         ▼                 ▼                 ▼               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Subagent   │  │  Subagent   │  │  Subagent   │         │
│  │  Auth Code  │  │   Tests     │  │    Docs     │         │
│  │  Refactor   │  │  Updates    │  │  Updates    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│         │                 │                 │               │
│         └─────────────────┴─────────────────┘               │
│                           │                                 │
│                     Results merge back                      │
└─────────────────────────────────────────────────────────────┘
```

### The Orchestration Pattern

1. **Main Claude** receives the complex task
2. **Analyzes** what subtasks are needed
3. **Spawns subagents** with specific, focused goals
4. **Subagents work** independently with their own context
5. **Results return** to the main Claude
6. **Main Claude synthesizes** the final output

## Context Isolation

Each subagent operates in its own **context bubble**:

```
Main Context                    Subagent Context
┌────────────────────┐         ┌────────────────────┐
│ Full conversation  │         │ Task description   │
│ All project files  │   ──>   │ Relevant files     │
│ Your preferences   │         │ Specific focus     │
│ Prior decisions    │         │                    │
└────────────────────┘         └────────────────────┘
```

### Benefits of Context Isolation

**1. Focused attention**

A subagent working on tests doesn't need to track implementation details it's not testing.

**2. Reduced confusion**

Separate contexts prevent information from one task bleeding into another.

**3. Parallel work**

Multiple subagents can work simultaneously without interfering.

**4. Cleaner history**

Each subtask has its own clean conversation history.

### Isolation Trade-offs

Context isolation also means:
- Subagents don't automatically know what other subagents are doing
- Coordination requires explicit communication
- Some information must be repeated across contexts

## Recognizing Delegation Opportunities

Claude Code delegates automatically in certain situations, but you can also explicitly request delegation.

### Automatic Delegation

Claude may delegate when it detects:
- Multiple independent subtasks
- Tasks requiring different expertise
- Work that would benefit from fresh context
- Operations that can run in parallel

Example of automatic delegation:
```
You: Add error handling to all API endpoints and add tests
     for each new error case

Claude: This involves changes across multiple independent endpoints.
        I'll delegate:
        - Subagent 1: Error handling for user endpoints
        - Subagent 2: Error handling for product endpoints
        - Subagent 3: Error handling for order endpoints

        Each subagent will add error handling AND the corresponding
        tests for their endpoint group.

        Proceeding with delegation...
```

### Requesting Delegation

You can explicitly ask for delegation:

```
You: This is a big task. Please delegate to subagents:
     - One for the database schema changes
     - One for the API updates
     - One for the frontend components

Claude: I'll create three subagents with those specific focuses...
```

### When NOT to Delegate

Delegation adds overhead. Avoid it for:
- Simple, single-file changes
- Tasks requiring tight coordination
- Work where context continuity is critical
- Quick questions or explorations

## Working with Subagents

### Providing Clear Instructions

Good delegation prompts are specific:

```
Good:
"Create a subagent to:
 - Update src/api/users.ts to handle validation errors
 - Return 400 status with error details
 - Follow our existing error format in src/types/errors.ts"

Poor:
"Create a subagent to fix the user API"
```

### Monitoring Progress

When Claude delegates, you can track progress:

```
Claude: Delegating to 3 subagents...

        [Subagent 1: Users API] Starting...
        [Subagent 1: Users API] Reading current implementation...
        [Subagent 1: Users API] Adding error handling...
        [Subagent 1: Users API] Complete ✓

        [Subagent 2: Products API] Starting...
        ...
```

### Reviewing Results

After subagents complete:

```
Claude: All subagents have completed.

        **Summary:**
        - Subagent 1: Added validation to 4 user endpoints
        - Subagent 2: Added validation to 6 product endpoints
        - Subagent 3: Added validation to 3 order endpoints

        **Files modified:**
        - src/api/users.ts
        - src/api/products.ts
        - src/api/orders.ts
        - src/types/errors.ts (extended)

        Want me to show the changes from any subagent?
```

### Handling Conflicts

Sometimes subagents make conflicting changes:

```
Claude: ⚠️ Conflict detected:
        - Subagent 1 modified src/types/errors.ts
        - Subagent 2 also modified src/types/errors.ts

        I'll merge these changes. Here's the combined result:
        [Shows merged file]

        Look correct?
```

## Delegation Patterns

### Pattern: Explore-Delegate-Synthesize

For research and analysis tasks:

```
You: Analyze our codebase for security vulnerabilities

Claude: I'll delegate security analysis by area:
        - Subagent 1: Authentication analysis
        - Subagent 2: Input validation analysis
        - Subagent 3: Data exposure analysis

        [Subagents complete their analysis]

        **Synthesized Report:**
        Found 3 critical issues, 7 warnings, 12 suggestions.

        **Critical:**
        1. SQL injection in user search (found by Subagent 2)
        ...
```

### Pattern: Parallel Implementation

For independent features:

```
You: Add sorting and filtering to the products table

Claude: These features are independent. Delegating in parallel:
        - Subagent 1: Column sorting
        - Subagent 2: Filter dropdowns

        Both subagents will work simultaneously on different
        aspects of the same component.
```

### Pattern: Sequential Dependencies

For work with dependencies:

```
You: Add a new database table and API endpoints for reviews

Claude: This has dependencies. Delegating sequentially:
        - Subagent 1: Database migration and model
        [Wait for completion]
        - Subagent 2: API endpoints using new model
        [Wait for completion]
        - Subagent 3: Type definitions and tests
```

### Pattern: Specialist Subagents

For work requiring different expertise:

```
You: Optimize our React application for performance

Claude: Creating specialist subagents:
        - Subagent 1: Bundle size analysis and reduction
        - Subagent 2: Render performance optimization
        - Subagent 3: Network/data fetching optimization

        Each specialist focuses on their area of expertise.
```

## Best Practices

### 1. Provide Sufficient Context

When requesting delegation, include what subagents need:

```
"Delegate API updates to a subagent. Make sure it knows:
 - We use Express with TypeScript
 - Error format is in src/types/errors.ts
 - All endpoints need authentication middleware"
```

### 2. Define Clear Boundaries

Specify what each subagent should and shouldn't touch:

```
"Subagent for frontend:
 - Update components in src/components/
 - Don't modify any API code
 - Use existing hooks, don't create new ones"
```

### 3. Request Coordination Points

For dependent work, specify check-ins:

```
"After completing the database changes, the first subagent should
 report what the API subagent needs to know about the new schema."
```

### 4. Review Before Merging

Always review subagent work before accepting:

```
You: Show me what each subagent changed before merging.

Claude: [Displays diffs from each subagent]

You: Subagent 2's changes look wrong. Can you regenerate
     just that subagent's work?

Claude: Rerunning Subagent 2 with additional guidance...
```

## Practical Exercise: Delegation Practice

Practice using task delegation effectively.

### Setup

Choose a moderately complex task in your project:
- Adding a feature that spans multiple files
- Refactoring a system with multiple components
- Adding tests across several modules

### Exercise

**Step 1: Plan the delegation**

```
You: I want to [describe task]. Before doing anything, show me how
     you would delegate this to subagents.

Claude: [Shows delegation plan]
```

**Step 2: Refine the plan**

```
You: Let's modify the plan:
     - Combine subagents 2 and 3
     - Add a separate subagent for tests
```

**Step 3: Execute with oversight**

```
You: Proceed with delegation, but pause after each subagent
     completes so I can review.
```

**Step 4: Review and merge**

Examine each subagent's work, request changes, then approve.

### Reflect

- Did delegation make the task easier?
- Where was context isolation helpful?
- Where did you need to coordinate between subagents?

## Key Takeaways

1. **Delegation breaks complexity**: Large tasks become manageable subtasks
2. **Context isolation focuses work**: Each subagent has only what it needs
3. **Parallel work saves time**: Independent subtasks can run simultaneously
4. **Clear instructions matter**: Specific delegation prompts produce better results
5. **Review before merging**: Always verify subagent work before accepting
6. **Not everything needs delegation**: Simple tasks are better done directly

## Glossary

- **Subagent**: A separate Claude instance spawned to handle a specific subtask
- **Context Isolation**: Keeping each subagent's context separate from others
- **Orchestrator**: The main Claude that coordinates subagents
- **Delegation**: The act of assigning subtasks to subagents
- **Synthesis**: Combining results from multiple subagents into a coherent output

---

In the next chapter, we'll explore external tools and the Model Context Protocol (MCP)—how Claude Code extends its capabilities by connecting to external services and tools.
