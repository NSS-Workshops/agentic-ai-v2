How Claude Code presents information affects your productivity. Sometimes you need detailed explanations; other times you want just the code. This chapter covers how to control output verbosity and format for different situations.

## Why Output Style Matters

Consider the difference:

**Verbose output:**
```
Claude: I'll help you add a loading spinner. First, let me explain the
        approach. We'll use React's useState hook to track loading state.
        When the component mounts, we'll set loading to true, then false
        after the data fetches. The spinner will conditionally render
        based on this state. Here's the implementation:

        [50 lines of code with inline comments]

        To use this, import the Spinner component and...
```

**Concise output:**
```
Claude: Adding loading spinner:

        [15 lines of clean code]
```

Both are valid—the right choice depends on your needs.

## The Verbosity Spectrum

Claude Code can operate at different verbosity levels:

```
Minimal ─────────────────────────────────────> Detailed

"Just code"    "Brief"    "Normal"    "Explain"    "Teach me"
```

### Minimal: Just the Code

When you know what you want and just need implementation:

```
You: Add form validation. Code only, no explanation.

Claude: [Code block with no commentary]
```

**Best for:**
- Experienced developers
- Well-defined tasks
- Rapid iteration
- Tasks you've done before

### Brief: Code with Context

Quick explanation plus implementation:

```
You: Add form validation with brief explanation.

Claude: I'll add validation using our existing pattern.

        [Code block]

        Key points: validates on blur, shows inline errors.
```

**Best for:**
- Familiar patterns
- Quick changes
- Code review context

### Normal: Balanced Output

Default behavior—code with helpful explanation:

```
You: Add form validation.

Claude: I'll add form validation to the registration form. Based on
        our project patterns, I'll use:

        - Field-level validation on blur
        - Form-level validation on submit
        - Our ErrorMessage component for display

        [Code block with implementation]

        The validation runs on blur for immediate feedback and
        again on submit to catch any missed fields.
```

**Best for:**
- Standard development
- New team members
- Moderate complexity

### Explain: Teaching Mode

Detailed explanations for learning:

```
You: Add form validation. Explain your approach in detail.

Claude: **Form Validation Strategy**

        I'll implement validation using a pattern called "controlled
        validation with progressive disclosure." Here's why this
        approach works well:

        **1. Why Validate on Blur?**
        Users get immediate feedback without being interrupted
        while typing...

        **2. Schema-Based Validation**
        Using a validation schema keeps rules centralized...

        [Code with extensive comments]

        **How It Works Step by Step:**
        1. When the user focuses a field...
        2. On blur, the validateField function...
```

**Best for:**
- Learning new concepts
- Understanding unfamiliar code
- Training scenarios
- Complex systems

### Teach Me: Full Educational Mode

Maximum explanation for deep learning:

```
You: Teach me how to add form validation. I want to understand
     why each decision is made.

Claude: # Form Validation Deep Dive

        Let's build form validation from first principles...

        ## Part 1: Understanding the Problem
        Forms fail silently without validation. Users submit
        invalid data, servers reject it, and the experience
        suffers...

        ## Part 2: Validation Strategies
        There are several approaches:

        **Client-side validation**
        Pros: Immediate feedback, less server load
        Cons: Can be bypassed, needs duplication...

        [Extended tutorial with code examples]
```

**Best for:**
- Learning from scratch
- Understanding trade-offs
- Building mental models
- Comprehensive documentation

## Controlling Output Style

### Explicit Instructions

Tell Claude what you want directly:

```
# For minimal output
"Code only, no explanation"
"Just show me the diff"
"Implementation only"

# For verbose output
"Explain each step"
"Walk me through this"
"Teach me as you go"
"Include comments explaining why"
```

### In CLAUDE.md

Set default preferences:

```markdown
## Output Preferences

### Default Style
- Provide brief explanations for new patterns
- Skip explanations for routine changes
- Always explain security-related code

### Code Style
- Include TypeScript types
- Add JSDoc for public functions
- Minimal inline comments
```

### Per-Session Adjustment

Start a session with preferences:

```
You: For this session, be concise. Code first, explain only
     if I ask.

Claude: Understood. I'll provide code-focused responses.

[Rest of session follows concise pattern]
```

### Per-Message Adjustment

Change mid-conversation:

```
You: That code works. Now explain why you chose that pattern.

Claude: [Switches to explanation mode for this response]
```

## Output Formats

Beyond verbosity, you can control format.

### Code Blocks

```
You: Show me as a single code block I can copy.

Claude: ```typescript
        // Complete implementation
        export function validateForm(data: FormData): ValidationResult {
          // ... full code
        }
        ```
```

### Diffs

```
You: Show me the changes as a diff.

Claude: ```diff
        - const handleSubmit = () => {
        + const handleSubmit = async () => {
            // ...
        - }
        + };
        ```
```

### Step-by-Step

```
You: Show me step by step what to change.

Claude: **Step 1:** Open src/components/Form.tsx

        **Step 2:** Find the handleSubmit function (line 45)

        **Step 3:** Replace with:
        ```typescript
        [code]
        ```

        **Step 4:** Add the import at the top...
```

### Lists and Summaries

```
You: Summarize what changed.

Claude: **Changes made:**
        - Added validation to registration form
        - Created ValidationError component
        - Updated form submit handler

        **Files modified:**
        - src/components/Form.tsx
        - src/components/ValidationError.tsx (new)
```

## The Learn While You Build Exercise

This exercise helps you discover your preferred output style using the **Coins R Us** project.

### Setup

Open the Coins R Us project. Your task: Add error handling and loading states to the coin listing page.

### Part 1: Try Minimal Style

```
You: Add error handling and a loading state to the coins page. Code only.

[Implement the change]
```

After implementation:
- Did you understand what changed?
- Could you debug issues if they arose?
- Did you miss any context about how Coins R Us handles errors?

### Part 2: Try Verbose Style

Reset your changes (`git checkout .`), then:

```
You: Add error handling and a loading state to the coins page.
     Explain your approach in detail, including why each
     decision was made and how it fits the existing patterns.

[Review the explanation]
```

After implementation:
- Was the explanation helpful or distracting?
- Did you learn something about Styled Components or Next.js patterns?
- Was it too slow for your needs?

### Part 3: Find Your Balance

Try different combinations:

```
# Pattern A: Code first, explain on request
"Add error handling to the coins page. Code only."
"That looks good. Now explain how the error state works."

# Pattern B: Brief context, detailed code
"Add error handling to the coins page. Brief explanation
of approach, then full implementation."

# Pattern C: Teach first, implement second
"Explain error handling patterns in Next.js App Router,
then implement the best one for Coins R Us."
```

### Part 4: Document Your Preference

Add to your personal or project CLAUDE.md:

```markdown
## My Preferred Output Style

I prefer [brief/normal/verbose] explanations by default.

For familiar tasks: code only
For new patterns: brief explanation + code
For learning: full educational mode

Always include:
- Type definitions
- Error handling
- Usage example

Skip:
- Obvious comments
- Setup instructions for tools I know
```

## Situational Style Selection

Different situations call for different styles.

### By Task Type

| Task | Recommended Style |
|------|-------------------|
| Bug fix | Minimal + diff |
| New feature | Normal |
| Unfamiliar pattern | Verbose |
| Code review | Summary |
| Learning concept | Teach me |
| Refactoring | Minimal + before/after |

### By Experience Level

**Junior developer:**
- Default to verbose for learning
- Request explanations for complex patterns
- Use "teach me" mode for new concepts

**Senior developer:**
- Default to minimal for speed
- Request details only when needed
- Use verbose for unfamiliar domains

**Mid-level developer:**
- Default to normal/brief
- Adjust based on familiarity
- Mix styles within a session

### By Time Pressure

**Deadline:**
```
"Code only. Fastest working solution."
```

**Normal:**
```
"Add this feature. Standard explanation."
```

**Learning time:**
```
"Explain the options for this feature. Help me
understand the trade-offs before we implement."
```

## Balancing Speed and Learning

A key tension in AI-assisted development:

- **Speed**: Minimal output gets you moving fast
- **Learning**: Verbose output builds understanding

### Strategies for Balance

**1. Vary by session goal**

```
Morning: Learning session
"Today I want to understand how our auth system works.
Be verbose and explain patterns."

Afternoon: Shipping session
"I need to fix three bugs. Code only, be concise."
```

**2. Retrospective learning**

```
[Complete task with minimal output]

After shipping:
"Now explain what we just built and why the
approach works."
```

**3. Progressive depth**

```
"Add pagination. Brief explanation."

[Review code]

"Explain the cursor-based approach in more detail."

[Deeper dive]

"What are alternatives to this pattern?"

[Comprehensive learning]
```

## Common Output Patterns

### The "Diff and Explain" Pattern

```
You: Show the changes as a diff, then briefly explain.

Claude: ```diff
        - const data = await fetch(url);
        + const data = await fetchWithRetry(url, { retries: 3 });
        ```

        Added retry logic using our fetchWithRetry helper.
        Will attempt 3 retries with exponential backoff.
```

### The "Options First" Pattern

```
You: Show me my options before implementing.

Claude: **Options for form validation:**

        1. **React Hook Form** - Minimal re-renders, great DX
        2. **Formik** - Full-featured, larger bundle
        3. **Custom hooks** - Maximum control, more code

        Recommendation: Option 1 for our use case. Implement?
```

### The "Summary Then Details" Pattern

```
You: Summary first, then details I can expand.

Claude: **Summary:** Added user authentication with JWT.

        <details>
        <summary>Implementation details</summary>
        [Full technical explanation]
        </details>
```

## Key Takeaways

1. **Match verbosity to need**: Minimal for speed, verbose for learning
2. **Explicit instructions work**: Tell Claude the style you want
3. **Use CLAUDE.md for defaults**: Set preferences once, adjust as needed
4. **Format matters**: Diffs, steps, summaries—choose the right format
5. **Balance speed and learning**: Vary style by session and task
6. **Find your preference**: The Learn While You Build exercise helps discover what works for you

## Glossary

- **Verbosity Level**: The amount of explanation included with code output
- **Output Format**: How information is structured (diff, steps, summary)
- **Teaching Mode**: Maximum explanation for educational purposes
- **Minimal Output**: Code-only responses without explanation
- **Progressive Depth**: Starting brief and requesting more detail as needed

---

In the next chapter, we'll compare CLI and IDE workflows—understanding when to use each for optimal productivity.
