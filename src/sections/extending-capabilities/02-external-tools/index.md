Claude Code's built-in capabilities cover many development tasks, but real projects often require specialized tools—component libraries, testing frameworks, databases, and external services. The Model Context Protocol (MCP) allows Claude Code to connect with these external tools, dramatically expanding what you can accomplish.

## The Limits of Built-in Tools

Claude Code comes with powerful built-in capabilities:
- File reading and editing
- Terminal command execution
- Web search and fetching
- Code analysis and generation

But what about:
- Generating UI components from a design system?
- Writing and running browser automation tests?
- Querying your production database?
- Interacting with your CI/CD pipeline?

These require **external tools**—and MCP provides the connection.

## What is MCP?

The **Model Context Protocol (MCP)** is a standard for connecting AI assistants to external tools and data sources. Think of it as a plugin system for Claude Code.

```
┌─────────────────────────────────────────────────────────────┐
│                        Claude Code                          │
│                                                             │
│  Built-in: File ops, Terminal, Web, Analysis               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    MCP Layer                         │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │   │
│  │  │ Shadcn  │ │Playwright│ │ GitHub  │ │ Custom  │   │   │
│  │  │  MCP    │ │   MCP   │ │   MCP   │ │   MCP   │   │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
   UI Library    Browser Tests    GitHub API    Your Tools
```

### How MCP Works

1. **MCP Servers** are small programs that expose tools to Claude
2. **Claude Code** discovers available tools from configured servers
3. **You make requests** that need those tools
4. **Claude uses the tools** through the MCP connection
5. **Results return** to continue your conversation

### MCP vs. Regular Commands

| Without MCP | With MCP |
|-------------|----------|
| "Run `npx shadcn-ui add button`" | "Add a Button component" |
| Manual component customization | Claude customizes based on context |
| Hope the component fits your code | Component adapts to your patterns |

MCP gives Claude direct access to tool capabilities, not just command execution.

## Configuring MCP Servers

MCP servers are configured in Claude Code's settings.

### Configuration File Location

```
~/.claude/mcp_servers.json
```

### Basic Configuration Structure

```json
{
  "mcpServers": {
    "server-name": {
      "command": "command-to-run",
      "args": ["arg1", "arg2"],
      "env": {
        "API_KEY": "your-key"
      }
    }
  }
}
```

### Example: Adding a Server

```json
{
  "mcpServers": {
    "shadcn-ui": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-shadcn-ui"]
    }
  }
}
```

### Verifying Configuration

After adding a server, restart Claude Code and check:

```
You: What MCP tools are available?

Claude: I have access to the following MCP servers:
        - shadcn-ui: Component generation and management
          Tools: add_component, list_components, customize_component
```

## Understanding MCP Tools

Each MCP server exposes specific **tools** that Claude can use.

### Tool Discovery

Claude discovers tools automatically:

```
You: What can you do with the Playwright MCP?

Claude: The Playwright MCP provides these tools:

        **Navigation:**
        - browser_navigate: Go to a URL
        - browser_back: Navigate back

        **Interaction:**
        - browser_click: Click an element
        - browser_type: Type into an element
        - browser_screenshot: Capture the screen

        **Assertions:**
        - browser_assert_text: Check text content
        - browser_assert_visible: Check element visibility
```

### Tool Invocation

When you make a request, Claude selects appropriate tools:

```
You: Add a Card component to my React project

Claude: I'll use the shadcn-ui MCP to add a Card component.

        [Using tool: add_component]
        Component: Card
        Project: /Users/you/project

        Card component added successfully!
        Files created:
        - src/components/ui/card.tsx

        Would you like me to show you how to use it?
```

### Tool Parameters

Tools accept parameters that Claude fills from context:

```
Tool: add_component

Parameters:
- component (required): Name of component to add
- path (optional): Where to install
- variants (optional): Which variants to include

Claude determines these from your request and project structure.
```

## MCP Server Categories

MCP servers generally fall into these categories:

### UI/Component Libraries

Connect to design systems and component libraries:
- **Shadcn/UI**: Add and customize React components
- **Radix**: Headless UI primitives
- **Custom design systems**: Your organization's components

### Testing & Automation

Browser and test automation:
- **Playwright**: Browser automation and testing
- **Puppeteer**: Chrome DevTools automation
- **Testing libraries**: Jest, Vitest integrations

### Development Services

External services and APIs:
- **GitHub**: Issues, PRs, Actions
- **Databases**: Query and manage data
- **Cloud providers**: AWS, GCP, Azure services

### Knowledge & Memory

Persistent context and documentation:
- **Memory MCP**: Long-term context storage
- **Documentation**: Access to docs and references
- **Codebase indexes**: Semantic code search

## Security Considerations

MCP servers can have significant capabilities. Consider security carefully.

### Permission Levels

MCP tools may have different permission requirements:

```
High Permission (requires explicit approval):
- Database write operations
- File system modifications outside project
- Network requests to external services

Medium Permission (may need approval):
- Reading configuration files
- Accessing environment variables

Low Permission (usually auto-approved):
- Read-only operations
- Component generation
- Documentation lookup
```

### Best Practices

**1. Review server sources**

Only install MCP servers from trusted sources:
```json
// Good: Known, maintained server
"shadcn-ui": {
  "command": "npx",
  "args": ["-y", "@anthropic/mcp-server-shadcn-ui"]
}

// Risky: Unknown source
"some-random-server": {
  "command": "npx",
  "args": ["-y", "random-mcp-server"]
}
```

**2. Limit environment variables**

Only provide necessary credentials:
```json
{
  "env": {
    "GITHUB_TOKEN": "ghp_..." // Only if needed
  }
}
```

**3. Use project-specific configuration**

For sensitive projects, use project-level config:
```
project/.claude/mcp_servers.json
```

This keeps credentials project-specific.

**4. Review tool actions**

When Claude uses MCP tools, review what it's doing:

```
Claude: I'll use the database MCP to update the user record.

        [Using tool: update_record]
        Table: users
        ID: 12345
        Changes: { status: "active" }

        Proceed? (y/n)
```

## Common MCP Setup Patterns

### Pattern: Development Environment

For general development work:

```json
{
  "mcpServers": {
    "shadcn-ui": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-shadcn-ui"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-playwright"]
    }
  }
}
```

### Pattern: Project-Specific

For a specific project's needs:

```json
{
  "mcpServers": {
    "project-api": {
      "command": "node",
      "args": ["./tools/mcp-server.js"],
      "env": {
        "API_URL": "http://localhost:3001"
      }
    }
  }
}
```

### Pattern: Team Standard

For consistent team setup:

```json
{
  "mcpServers": {
    "company-components": {
      "command": "npx",
      "args": ["-y", "@yourcompany/mcp-components"]
    },
    "company-api": {
      "command": "npx",
      "args": ["-y", "@yourcompany/mcp-api-client"]
    }
  }
}
```

## Troubleshooting MCP

### Server Won't Start

Check the command works manually:

```bash
npx -y @anthropic/mcp-server-shadcn-ui
```

If it fails, the server may need dependencies or configuration.

### Tools Not Appearing

1. Restart Claude Code after configuration changes
2. Check for JSON syntax errors in config
3. Verify server is starting without errors

### Tool Execution Fails

```
You: Add a Button component

Claude: Error using shadcn-ui tool: ENOENT

This usually means the tool couldn't find your project.
Make sure you're in a valid React project directory.
```

### Permission Errors

```
Claude: The github MCP requires authentication.
        Please add GITHUB_TOKEN to the server configuration.
```

Add the required credentials to your config.

## Creating Custom MCP Servers

For advanced users, you can create custom MCP servers for your specific needs.

### When to Create Custom Servers

- Internal tools not available publicly
- Project-specific operations
- Integration with proprietary systems
- Specialized workflows

### Basic Server Structure

```javascript
// my-mcp-server.js
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

const server = new Server({
  name: "my-tools",
  version: "1.0.0"
});

server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "my_tool",
    description: "Does something useful",
    inputSchema: {
      type: "object",
      properties: {
        param: { type: "string" }
      }
    }
  }]
}));

server.setRequestHandler("tools/call", async (request) => {
  // Handle tool execution
});

server.connect(process.stdin, process.stdout);
```

We'll cover specific MCP servers (Shadcn, Playwright) in detail in upcoming chapters.

## Practical Exercise: MCP Setup

Practice configuring and using MCP servers.

### Setup

1. Create or use an existing React project
2. Locate your MCP configuration file

### Exercise

**Step 1: Add Shadcn MCP**

Create `~/.claude/mcp_servers.json`:
```json
{
  "mcpServers": {
    "shadcn-ui": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-shadcn-ui"]
    }
  }
}
```

**Step 2: Restart and verify**

```
You: What MCP tools do you have access to?
```

Confirm shadcn-ui tools appear.

**Step 3: Use the tools**

```
You: Add a Button component to my project
```

Watch Claude use the MCP tool instead of manual commands.

### Reflect

- How did MCP change the interaction?
- What capabilities did MCP add?
- What would you build with custom MCP servers?

## Key Takeaways

1. **MCP extends Claude's capabilities**: Connect to external tools and services
2. **Configuration is simple**: JSON file specifies servers and their commands
3. **Tools are discovered automatically**: Claude sees what each server provides
4. **Security matters**: Only install trusted servers, review actions
5. **Many categories exist**: UI libraries, testing, services, memory
6. **Custom servers are possible**: Build your own for specific needs

## Glossary

- **MCP (Model Context Protocol)**: Standard for connecting AI assistants to external tools
- **MCP Server**: A program that exposes tools to Claude through MCP
- **Tool**: A specific capability exposed by an MCP server
- **Tool Invocation**: When Claude uses an MCP tool to accomplish a task
- **Server Configuration**: JSON file specifying which MCP servers to load

---

In the next chapter, we'll dive deep into the Shadcn/UI MCP server—learning how to generate, customize, and manage UI components directly through Claude.
