Claude Code includes built-in skills—pre-packaged commands that automate common development tasks. These skills save time and ensure consistency by following best practices automatically.

## What Are Skills?

Skills are slash commands that trigger specialized workflows. Instead of writing detailed prompts for common tasks, you invoke a skill with a simple command:

```
/commit              # Creates a well-formatted commit
/review              # Reviews code changes
/plan                # Enters planning mode for a task
```

Each skill encapsulates Claude's knowledge about how to perform that task well.

### Skills vs. Regular Prompts

| Regular Prompt | Skill |
|----------------|-------|
| "Look at my changes and write a good commit message following conventional commits format" | `/commit` |
| "Review my code for bugs, security issues, and best practices" | `/review` |
| "Create a detailed plan for implementing this feature" | `/plan feature description` |

Skills are faster, more consistent, and follow established patterns.

## The /commit Skill

The `/commit` skill analyzes your staged changes and creates a well-formatted commit message.

### How It Works

```
$ git add src/auth/login.ts src/utils/validation.ts
$ /commit

Claude: Analyzing staged changes...

        Found changes in 2 files:
        - src/auth/login.ts: Added password strength validation
        - src/utils/validation.ts: New validation helper functions

        Proposed commit message:

        feat(auth): add password strength validation

        - Add validatePasswordStrength function with configurable rules
        - Implement minimum length, uppercase, number requirements
        - Add corresponding validation helpers in utils

        Create this commit? [y/n]
```

### Commit Message Format

The `/commit` skill follows Conventional Commits format:

```
<type>(<scope>): <short description>

<body - what and why>

<footer - references, breaking changes>
```

**Types used:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code change that neither fixes nor adds
- `docs`: Documentation only
- `style`: Formatting, whitespace
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Usage Options

```bash
/commit                    # Analyze and propose message
/commit -m "message"       # Use provided message, verify appropriateness
/commit --amend            # Amend previous commit
```

### When to Use

**Good for:**
- Any commit where you want a clear, descriptive message
- Ensuring consistent commit format across a project
- When you're not sure how to categorize changes

**Skip when:**
- You have a specific message you want to use
- Making a WIP (work-in-progress) commit

## The /review Skill

The `/review` skill analyzes code for potential issues, following best practices for code review.

### How It Works

```
/review

Claude: Reviewing changes in current branch compared to main...

        **Files Reviewed:**
        - src/api/users.ts
        - src/components/UserForm.tsx

        **Issues Found:**

        🔴 Critical (1):
        - src/api/users.ts:45 - SQL query built with string
          concatenation. Risk of SQL injection.

        🟡 Warning (2):
        - src/components/UserForm.tsx:23 - Missing error boundary
          around async operation
        - src/api/users.ts:67 - No input validation before database
          operation

        🔵 Suggestions (3):
        - Consider extracting form validation to custom hook
        - Add loading state for better UX
        - Document the API response format

        Would you like me to fix any of these issues?
```

### Review Categories

**/review** checks for:

1. **Security Issues**
   - Injection vulnerabilities
   - Authentication problems
   - Data exposure risks

2. **Bugs**
   - Null/undefined handling
   - Race conditions
   - Logic errors

3. **Performance**
   - Unnecessary re-renders
   - Missing memoization
   - N+1 queries

4. **Best Practices**
   - Code organization
   - Error handling
   - Type safety

5. **Maintainability**
   - Code clarity
   - Documentation needs
   - Test coverage

### Usage Options

```bash
/review                    # Review current changes vs main branch
/review src/auth/          # Review specific directory
/review --staged           # Review only staged changes
/review --thorough         # Deep analysis (slower, more comprehensive)
```

### Responding to Review

After the review, you can ask Claude to fix issues:

```
You: Fix the SQL injection issue in users.ts

Claude: I'll use parameterized queries to fix the SQL injection...
        [Shows diff]
```

Or address multiple issues:

```
You: Address all critical and warning issues

Claude: I'll fix the 3 issues. Let me start with the SQL injection...
```

### When to Use

**Good for:**
- Before creating a pull request
- After completing a feature
- Reviewing your own code
- Learning best practices

**Skip when:**
- Minor formatting changes
- Documentation-only changes

## The /plan Skill

The `/plan` skill enters planning mode and creates a structured implementation plan.

### How It Works

```
/plan Add user authentication to the API

Claude: I'll create a plan for adding user authentication.
        Let me first explore the codebase...

        [Reads relevant files]

        **Authentication Implementation Plan**

        ## Overview
        Add JWT-based authentication with login, register, and
        protected route middleware.

        ## Prerequisites
        - Database with users table (exists)
        - Express server setup (exists)

        ## Implementation Steps

        ### Step 1: Install Dependencies
        - jsonwebtoken for JWT handling
        - bcrypt for password hashing

        ### Step 2: Create Auth Utilities
        - src/utils/auth.ts
          - hashPassword(password)
          - verifyPassword(password, hash)
          - generateToken(userId)
          - verifyToken(token)

        ### Step 3: Create Auth Routes
        - POST /api/auth/register
        - POST /api/auth/login
        - GET /api/auth/me (protected)

        ### Step 4: Create Middleware
        - src/middleware/auth.ts
          - requireAuth middleware for protected routes

        ### Step 5: Update Existing Routes
        - Add auth middleware to sensitive endpoints

        ## Testing Plan
        - Unit tests for auth utilities
        - Integration tests for auth routes
        - E2E test for full auth flow

        ## Estimated Effort
        Steps 1-2: Simple
        Steps 3-4: Moderate
        Step 5: Varies by existing routes

        Ready to implement? Start with Step 1?
```

### Plan Structure

A `/plan` output includes:

1. **Overview**: What we're building and why
2. **Prerequisites**: What must exist first
3. **Steps**: Ordered implementation steps
4. **Files**: What will be created/modified
5. **Testing**: How to verify the implementation
6. **Effort estimate**: Relative complexity of each step

### Usage Options

```bash
/plan "description"        # Plan a specific feature
/plan                      # Enter planning mode, describe interactively
/plan --detailed           # More granular steps
/plan --minimal            # High-level overview only
```

### From Plan to Implementation

After approving a plan:

```
You: The plan looks good. Start with Step 1.

Claude: [Exits plan mode, begins implementation]
        Installing dependencies...
        npm install jsonwebtoken bcrypt
```

The plan serves as a roadmap throughout implementation.

## Other Useful Skills

### /explain

Explains selected code or concepts:

```
/explain

Claude: [Analyzes selected code or recent context]

        This function implements a debounce pattern...
```

### /test

Generates tests for code:

```
/test src/utils/validation.ts

Claude: I'll create tests for the validation utilities...
        [Creates test file with comprehensive test cases]
```

### /fix

Attempts to fix errors:

```
/fix

Claude: Looking at the recent error...
        [Analyzes error, proposes fix]
```

### /doc

Generates documentation:

```
/doc src/api/

Claude: Generating API documentation...
        [Creates documentation for endpoints]
```

## Creating Your Own Workflows

While built-in skills handle common cases, you can create custom workflows for your specific needs.

### Combining Skills

Chain skills for complex workflows:

```
# Development workflow
1. /plan "new feature"     # Design first
2. [implement]             # Code the feature
3. /review                 # Check your work
4. /commit                 # Commit changes

# Bug fix workflow
1. /explain [error]        # Understand the issue
2. /fix                    # Apply fix
3. /test                   # Add regression test
4. /commit                 # Commit fix
```

### Custom Prompts as Pseudo-Skills

For repeated tasks, save prompts in your CLAUDE.md:

```markdown
## Custom Workflows

### Component Creation
When I ask to create a component, follow this pattern:
1. Create ComponentName.tsx with props interface
2. Create ComponentName.test.tsx with basic tests
3. Create index.ts exporting the component
4. Update parent directory's index.ts

### API Endpoint
When I ask to create an endpoint:
1. Add route handler in routes/
2. Add types in types/api.ts
3. Add validation schema
4. Add tests
```

Then invoke naturally:

```
You: Create a UserProfile component

Claude: [Follows the custom workflow from CLAUDE.md]
```

## Skill Best Practices

### Choose the Right Skill

| Situation | Skill |
|-----------|-------|
| Ready to commit | `/commit` |
| About to create PR | `/review` |
| Starting a feature | `/plan` |
| Code not working | `/fix` |
| Need to understand code | `/explain` |
| Adding test coverage | `/test` |

### Combine Skills with Modes

Skills work best with appropriate permission modes:

- `/plan` → Plan mode (read-only exploration)
- `/review` → Plan mode (analysis only)
- `/commit` → Normal mode (controlled changes)
- `/fix` → Normal or Auto-accept (depending on confidence)

### Provide Context

Skills work better with context:

```
# Less effective
/review

# More effective
/review --focus security     # Focus the review
/review src/auth/            # Scope the review
```

### Trust but Verify

Skills are smart but not perfect:

- **Review `/commit` messages** before accepting
- **Check `/review` findings** against your knowledge
- **Validate `/plan` steps** against requirements

## Practical Exercise: Skill Practice

Practice using skills in a realistic workflow.

### Setup

1. Create a new branch: `git checkout -b skill-practice`
2. Make some changes to your code (add a function, fix a bug)

### Exercise

**Step 1: Plan a small feature**
```
/plan Add a helper function that formats dates for display
```
Review the plan. Does it match your expectations?

**Step 2: Implement and review**
```
[Implement the plan]
/review
```
Address any issues found.

**Step 3: Commit with skill**
```
git add .
/commit
```
Evaluate the proposed commit message.

### Reflect

- How did skills change your workflow?
- What would you do differently?
- Which skills will you use regularly?

## Key Takeaways

1. **Skills are shortcuts**: Pre-packaged workflows for common tasks
2. **`/commit` writes messages**: Analyzes changes and creates conventional commits
3. **`/review` finds issues**: Comprehensive code review before merging
4. **`/plan` structures work**: Creates implementation roadmaps
5. **Combine skills**: Chain them for complete workflows
6. **Customize when needed**: Use CLAUDE.md for project-specific patterns

## Glossary

- **Skill**: A slash command that triggers a pre-defined workflow in Claude Code
- **Conventional Commits**: A commit message format that categorizes changes (feat, fix, etc.)
- **Code Review**: Systematic examination of code for issues and improvements
- **Implementation Plan**: A structured breakdown of steps to build a feature
- **Workflow**: A sequence of steps to accomplish a development task

---

In the next chapter, we'll explore output styles—how to control the format and verbosity of Claude's responses.
