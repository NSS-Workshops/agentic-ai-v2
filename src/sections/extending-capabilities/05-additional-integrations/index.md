Beyond Shadcn and Playwright, the MCP ecosystem offers many more integrations. This chapter covers GitHub integration for repository management, Memory MCP for persistent context, and other useful tools that expand what you can accomplish with Claude Code.

## GitHub Integration

The GitHub MCP allows Claude to interact directly with repositories, issues, pull requests, and GitHub Actions.

### Setting Up GitHub MCP

**1. Create a GitHub Personal Access Token**

Go to GitHub Settings → Developer settings → Personal access tokens → Generate new token

Required scopes:
- `repo` (full repository access)
- `workflow` (if using GitHub Actions)

**2. Configure the MCP server**

```json
// ~/.claude/mcp_servers.json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### Working with Issues

```
You: Show me open issues in this repository

Claude: [Using tool: list_issues]
        Repository: your-org/your-repo

        Open Issues (5):

        #42 - Bug: Login fails on mobile Safari
             Labels: bug, high-priority
             Assigned: @developer1
             Created: 2 days ago

        #38 - Feature: Add dark mode support
             Labels: enhancement
             Assigned: unassigned
             Created: 1 week ago

        #35 - Docs: Update API documentation
             Labels: documentation
             Assigned: @developer2
             Created: 2 weeks ago

        ...

        Would you like details on any of these?
```

### Creating Issues

```
You: Create an issue for the login bug we found

Claude: I'll create an issue for the login bug.

        [Using tool: create_issue]

        **Title:** Form validation bypassed when submitting with Enter key

        **Body:**
        ## Description
        The login form validation can be bypassed by pressing Enter
        instead of clicking the submit button.

        ## Steps to Reproduce
        1. Go to /login
        2. Enter invalid email format
        3. Press Enter instead of clicking "Sign In"
        4. Form submits without validation

        ## Expected Behavior
        Validation should run regardless of submission method.

        ## Actual Behavior
        Validation only runs on button click.

        **Labels:** bug
        **Assignee:** (none)

        Create this issue? (y/n)
```

### Pull Request Workflows

```
You: Create a PR for my current changes

Claude: Let me analyze your changes and create a PR.

        [Running: git diff main]

        Changes detected:
        - src/components/LoginForm.tsx (+15, -3)
        - src/utils/validation.ts (+8, -0)
        - src/tests/login.test.ts (+25, -0)

        [Using tool: create_pull_request]

        **Title:** fix: Add Enter key validation to login form

        **Body:**
        ## Summary
        Fixes form validation bypass when pressing Enter key.

        ## Changes
        - Add onSubmit handler to form element
        - Centralize validation logic in validateForm()
        - Add tests for keyboard submission

        ## Testing
        - [x] Manual testing on Chrome, Firefox, Safari
        - [x] Unit tests added
        - [x] E2E tests pass

        Fixes #42

        Create PR? (y/n)

You: Yes

Claude: [Using tool: create_pull_request]

        ✓ Pull request #47 created!
        URL: https://github.com/your-org/your-repo/pull/47

        The PR is ready for review.
```

### Reviewing PRs

```
You: Review PR #45

Claude: [Using tool: get_pull_request]

        **PR #45: Add user profile page**

        Author: @teammate
        Status: Open
        Checks: ✓ All passing
        Reviews: Awaiting review

        **Files changed (4):**

        [Using tool: get_pull_request_diff]

        **Review comments:**

        1. **src/pages/Profile.tsx:23**
           The useEffect dependency array is missing `userId`.
           This could cause stale data issues.
           ```tsx
           // Current:
           useEffect(() => { fetchUser() }, [])

           // Should be:
           useEffect(() => { fetchUser() }, [userId])
           ```

        2. **src/api/users.ts:45**
           No error handling for the API call. Consider adding
           try-catch.

        3. **src/components/Avatar.tsx:12**
           Nice reusable component! Consider adding a `size` prop
           for flexibility.

        Overall: Good implementation with minor issues.
        Recommend: Request changes

        Should I submit this review?
```

## Memory MCP

Memory MCP provides persistent storage across Claude Code sessions, allowing context to survive beyond a single conversation.

### Why Memory Matters

Without Memory MCP:
```
Session 1: "We decided to use PostgreSQL instead of MongoDB"
[Session ends]

Session 2: "Claude, what database are we using?"
Claude: "I don't have information about your database choice..."
```

With Memory MCP:
```
Session 1: "We decided to use PostgreSQL instead of MongoDB"
Claude: [Saves to memory: database decision]

Session 2: "Claude, what database are we using?"
Claude: [Retrieves from memory]
        "Based on our previous discussion, you decided to use
        PostgreSQL instead of MongoDB."
```

### Setting Up Memory MCP

```json
// ~/.claude/mcp_servers.json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-memory"],
      "env": {
        "MEMORY_PATH": "~/.claude/memory"
      }
    }
  }
}
```

### Storing Information

```
You: Remember that we're using Next.js 14 with the App Router
     and our API is hosted on Vercel.

Claude: [Using tool: store_memory]
        Category: project-config
        Content: Tech stack - Next.js 14 with App Router, API on Vercel

        ✓ Stored! I'll remember this for future sessions.
```

### Retrieving Information

```
You: What's our deployment setup?

Claude: [Using tool: retrieve_memory]
        Query: deployment, hosting, infrastructure

        From my memory:
        - API is hosted on Vercel
        - Using Next.js 14 with App Router

        Would you like more details about any of these?
```

### Organizing Memories

```
You: What do you remember about this project?

Claude: [Using tool: list_memories]

        **Project Memories:**

        **Architecture:**
        - Next.js 14 with App Router
        - PostgreSQL database
        - Redis for caching

        **Decisions:**
        - Using Tailwind CSS over styled-components (Jan 15)
        - Chose Clerk for auth over Auth0 (Jan 20)

        **Team:**
        - @alice handles frontend
        - @bob handles backend
        - Standups at 9am daily

        **Patterns:**
        - API routes in /api/v1/
        - Components follow atomic design

        Would you like to update or add anything?
```

### Memory Best Practices

**1. Be specific when storing**
```
# Too vague
"Remember we made a decision about auth"

# Better
"Remember: We chose Clerk for authentication because it has
better Next.js integration and handles MFA out of the box"
```

**2. Categorize memories**
```
You: Store this under "architecture decisions":
     We're using server components by default,
     client components only when needed for interactivity.
```

**3. Periodically review and clean**
```
You: Show me all memories and let me clean up outdated ones
```

## Database Integration

Connect Claude to your databases for queries and management.

### PostgreSQL MCP

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost/mydb"
      }
    }
  }
}
```

### Database Queries

```
You: How many users signed up last month?

Claude: [Using tool: query_database]
        Query: SELECT COUNT(*) FROM users
               WHERE created_at >= NOW() - INTERVAL '1 month'

        Result: 247 users signed up in the last month.

        Would you like a breakdown by week or day?
```

### Schema Exploration

```
You: Show me the database schema

Claude: [Using tool: list_tables]

        Tables in database:
        - users (12 columns)
        - posts (8 columns)
        - comments (6 columns)
        - categories (3 columns)

        [Using tool: describe_table]
        Table: users

        | Column      | Type        | Nullable |
        |-------------|-------------|----------|
        | id          | uuid        | NO       |
        | email       | varchar     | NO       |
        | name        | varchar     | YES      |
        | created_at  | timestamp   | NO       |
        | ...         | ...         | ...      |
```

## File System MCP

Enhanced file operations beyond Claude Code's built-in capabilities.

### Watching for Changes

```
You: Watch the src directory and tell me when files change

Claude: [Using tool: watch_directory]
        Watching: ./src

        [File changed: src/components/Button.tsx]

        Button.tsx was modified. Changes:
        - Added loading prop
        - Updated styles for disabled state

        Should I review the changes?
```

### Bulk Operations

```
You: Rename all .jsx files to .tsx

Claude: [Using tool: list_files]
        Found 23 .jsx files

        [Using tool: rename_files]
        Pattern: *.jsx → *.tsx

        Preview:
        - src/App.jsx → src/App.tsx
        - src/components/Header.jsx → src/components/Header.tsx
        - ...

        Proceed with renaming? (y/n)
```

## Documentation MCP

Connect to documentation sources for reference.

### MDN Integration

```
You: How does the Intersection Observer API work?

Claude: [Using tool: fetch_documentation]
        Source: MDN Web Docs

        **Intersection Observer API**

        The Intersection Observer API provides a way to
        asynchronously observe changes in the intersection
        of a target element with an ancestor element or
        the viewport.

        **Basic Usage:**
        ```javascript
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Element is visible
            }
          });
        });

        observer.observe(targetElement);
        ```

        [Full documentation with examples]
```

## Building Custom Integrations

For specific needs, you can create custom MCP servers.

### Simple Custom Server

```javascript
// my-mcp-server.js
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

const server = new Server({
  name: "my-project-tools",
  version: "1.0.0"
});

// Register tools
server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "deploy_preview",
      description: "Deploy a preview environment",
      inputSchema: {
        type: "object",
        properties: {
          branch: { type: "string" }
        }
      }
    }
  ]
}));

// Handle tool calls
server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "deploy_preview") {
    const branch = request.params.arguments.branch;
    // Your deployment logic here
    return { content: [{ type: "text", text: `Preview deployed for ${branch}` }] };
  }
});

server.connect(process.stdin, process.stdout);
```

### Registering Custom Server

```json
{
  "mcpServers": {
    "my-tools": {
      "command": "node",
      "args": ["./tools/my-mcp-server.js"]
    }
  }
}
```

## Integration Patterns

### Pattern: Full Development Stack

Combine multiple integrations for complete workflows:

```json
{
  "mcpServers": {
    "github": { /* PR and issue management */ },
    "shadcn-ui": { /* Component generation */ },
    "playwright": { /* Testing */ },
    "memory": { /* Persistent context */ },
    "postgres": { /* Database queries */ }
  }
}
```

### Pattern: Project-Specific Setup

Create a project-level config with specific tools:

```
project/
├── .claude/
│   └── mcp_servers.json  # Project-specific MCP config
├── tools/
│   └── project-mcp.js    # Custom project tools
└── ...
```

### Pattern: Team Standards

Share MCP configurations across a team:

```json
// team-mcp-config.json (in shared repo)
{
  "mcpServers": {
    "company-components": { /* Shared design system */ },
    "internal-api": { /* Company API tools */ },
    "deploy": { /* Deployment tools */ }
  }
}
```

## Practical Exercise: Integration Setup

Practice configuring multiple integrations.

### Exercise Goal

Set up a development environment with GitHub and Memory MCP.

### Steps

**Step 1: Configure GitHub MCP**

Create a token and add to configuration.

**Step 2: Configure Memory MCP**

Add memory server to configuration.

**Step 3: Test GitHub integration**

```
You: Show me recent commits in this repo
You: Create an issue for [describe a task]
```

**Step 4: Test Memory integration**

```
You: Remember that [important project decision]
[Start new session]
You: What did we decide about [topic]?
```

### Reflect

- Which integrations will you use daily?
- What custom integrations would help your workflow?
- How can you share configurations with your team?

## Key Takeaways

1. **GitHub MCP streamlines repository work**: Issues, PRs, and reviews through conversation
2. **Memory MCP provides continuity**: Important context persists across sessions
3. **Database MCP enables queries**: Interact with data directly
4. **Custom servers extend capabilities**: Build tools for your specific needs
5. **Combine integrations strategically**: Create powerful, integrated workflows

## Glossary

- **GitHub Token**: Authentication credential for GitHub API access
- **Memory MCP**: Integration that persists context across Claude Code sessions
- **Custom MCP Server**: A self-built server that exposes specific tools to Claude
- **Database MCP**: Integration that allows Claude to query databases directly
- **Integration Stack**: The combination of MCP servers configured for a project

---

You've now learned how to extend Claude Code's capabilities through various integrations. In the next section, we'll apply everything you've learned to working with existing codebases—analyzing, enhancing, and debugging real-world projects.
