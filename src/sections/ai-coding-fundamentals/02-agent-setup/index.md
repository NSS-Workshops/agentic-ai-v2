Now that you understand how LLMs work, it's time to set up your development environment with Claude Code. This chapter walks you through installing both the CLI tool and the VS Code extension, verifying your setup, and troubleshooting common issues.

## What is Claude Code?

Claude Code is Anthropic's official development tool that brings Claude directly into your coding workflow. It comes in two forms:

1. **Claude Code CLI**: A command-line interface that runs in your terminal
2. **Claude Code VS Code Extension**: An integrated extension for Visual Studio Code

Both tools connect to the same Claude models and share similar capabilities, but they offer different interaction styles.

For this course, we'll primarily use the **VS Code extension** for its seamless integration with your editor, but we'll also cover CLI usage for specific workflows.

## Prerequisites

Before installing Claude Code, ensure you have the following:

### 1. Node.js and npm

Claude Code requires Node.js version 18 or higher.

**Check your current version:**

```bash
node --version
npm --version
```

If you need to install or update Node.js, visit [nodejs.org](https://nodejs.org/) and download the LTS (Long Term Support) version.

### 2. Visual Studio Code

Download VS Code from [code.visualstudio.com](https://code.visualstudio.com/) if you haven't already. The extension requires VS Code version 1.85 or higher.

### 3. Claude Account Setup

Claude Code offers two ways to authenticate and pay for usage. Choose the option that best fits your workflow and budget:

| Option | Best For | Payment Model | Starting Cost |
|--------|----------|---------------|---------------|
| **API Key + Credits** | Heavy users, teams, automation | Pay-as-you-go | $5 minimum deposit |
| **Claude Pro Subscription** | Individual developers, predictable costs | Monthly subscription | $20/month |

---

## Option A: API Key with Purchased Credits (Pay-as-You-Go)

This option gives you direct API access with usage-based billing. You only pay for what you use.

### Step 1: Create an Anthropic Console Account

1. Visit [console.anthropic.com](https://console.anthropic.com/)
2. Click **Sign Up** and create an account using email or Google
3. Verify your email address

### Step 2: Add Payment and Purchase Credits

1. Navigate to **Settings** → **Billing** in the left sidebar
2. Click **Add Payment Method** and enter your credit card details
3. Purchase API credits:
   - Minimum purchase: **$5**
   - Credits don't expire
   - You can set up auto-reload when balance drops below a threshold

### Step 3: Generate an API Key

1. Navigate to **API Keys** in the left sidebar
2. Click **Create Key**
3. Give your key a descriptive name (e.g., "Claude Code - Personal Laptop")
4. **Copy the key immediately** - you won't be able to see it again
5. Store it securely (password manager recommended)

**Important**: Keep your API key secret. Never commit it to version control or share it publicly.

### Cost Breakdown: API Credits

Pricing is based on tokens (roughly 4 characters = 1 token):

| Model | Input Cost | Output Cost | Typical Use |
|-------|------------|-------------|-------------|
| **Claude Sonnet 4** | $3 / 1M tokens | $15 / 1M tokens | Default for Claude Code |
| **Claude Opus 4** | $15 / 1M tokens | $75 / 1M tokens | Complex reasoning tasks |
| **Claude Haiku 3.5** | $0.80 / 1M tokens | $4 / 1M tokens | Fast, simple tasks |

**What does this mean in practice?**

| Activity | Approximate Token Usage | Estimated Cost |
|----------|------------------------|----------------|
| Simple code question | ~1,000 tokens | $0.003 - $0.02 |
| Code review (medium file) | ~5,000 tokens | $0.02 - $0.08 |
| Feature implementation | ~20,000 tokens | $0.08 - $0.35 |
| Full session (1 hour heavy use) | ~100,000 tokens | $0.50 - $2.00 |
| Full course completion | ~2-5M tokens | $10 - $50 |

### Pros and Cons: API Credits

**Pros:**
- Pay only for what you use
- No monthly commitment
- Access to all models (Sonnet, Opus, Haiku)
- Can set spending limits and alerts
- Best for variable usage patterns
- Shareable across multiple tools and integrations

**Cons:**
- Requires upfront credit purchase
- Costs can be unpredictable during learning
- Need to monitor balance
- Heavy users may pay more than subscription

---

## Option B: Claude Pro Subscription

This option provides a fixed monthly fee with generous usage limits through the Claude web app and extensions.

### Step 1: Create a Claude Account

1. Visit [claude.ai](https://claude.ai/)
2. Click **Sign Up** and create an account
3. Verify your email address

### Step 2: Subscribe to Claude Pro

1. Click your profile icon in the bottom-left corner
2. Select **Upgrade to Pro**
3. Choose your billing cycle:
   - **Monthly**: $20/month
   - **Annual**: $18/month ($216/year, save 10%)
4. Enter payment details and confirm

### Step 3: Connect Claude Code

With Claude Pro, authentication works through your browser:

1. Open VS Code with Claude Code extension installed
2. Open Command Palette: `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
3. Type "Claude Code: Sign In"
4. A browser window opens - sign in with your Claude account
5. Authorize the connection

No API key needed - your Pro subscription handles authentication automatically.

### Cost Breakdown: Claude Pro

| Plan | Monthly Cost | What You Get |
|------|--------------|--------------|
| **Pro** | $20/month | ~45x more usage than Free, all models, priority access, Claude Code access |
| **Max x5** | $100/month | 5x Pro limits, more Opus access |
| **Max x20** | $200/month | 20x Pro limits, more Opus access |

**Claude Pro Limits:**

The Pro plan uses a "usage-based" system rather than strict message counts:
- Approximately **45x more usage** than the free tier
- Access to Claude Sonnet 4, Claude Opus 4, and Claude Haiku 3.5
- Limits reset daily
- Priority access during high-demand periods

For typical course work, Pro limits are more than sufficient.

### Pros and Cons: Claude Pro

**Pros:**
- Predictable monthly cost
- No API key management needed
- Simple browser-based authentication
- Access to Claude.ai web interface as well
- Good for consistent, moderate usage
- Includes additional features (artifacts, projects, etc.)

**Cons:**
- Fixed cost even if you don't use it
- Usage limits (though generous for most users)
- Can't share across team members
- Heavy users may hit daily limits
- Less flexibility for automation/integrations

---

## Which Option Should You Choose?

### Choose API Credits if:
- You want to pay only for actual usage
- You're unsure how much you'll use Claude Code
- You need to integrate with other tools or automation
- You're working on a team that shares API access
- You want maximum control over costs

### Choose Claude Pro if:
- You prefer predictable monthly billing
- You don't want to manage API keys
- You'll also use Claude.ai web interface
- You use Claude Code consistently (daily or near-daily)
- You're an individual developer, not a team

---

## Installing the VS Code Extension

### Step 1: Open VS Code Extensions

Open VS Code and access the Extensions view:
- **Keyboard shortcut**: `Cmd+Shift+X` (macOS) or `Ctrl+Shift+X` (Windows/Linux)
- **Menu**: View → Extensions

### Step 2: Search and Install

1. Search for "Claude Code" in the extensions marketplace
2. Look for the official extension by **Anthropic**
3. Click **Install**

### Step 3: Authenticate (Choose Your Method)

Authentication depends on which account option you chose:

#### If You're Using API Credits:

**Option A - Environment Variable (Recommended):**

Set your API key as an environment variable. This is the most secure method:

```bash
# macOS/Linux - Add to ~/.zshrc or ~/.bashrc
export ANTHROPIC_API_KEY="sk-ant-api03-your-key-here"
```

After adding, reload your shell:

```bash
source ~/.zshrc  # or ~/.bashrc
```

**Option B - VS Code Command:**

1. Open the Command Palette: `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "Claude Code: Set API Key"
3. Paste your API key when prompted

#### If You're Using Claude Pro:

1. Open the Command Palette: `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "Claude Code: Sign In"
3. Your browser opens - sign in with your Claude account
4. Click **Authorize** to connect VS Code
5. Return to VS Code - you should see a confirmation

### Step 4: Verify Installation

Open the Command Palette and type "Claude Code" to see available commands. You should see options like:
- Claude Code: Open Chat
- Claude Code: Explain Selection
- Claude Code: Generate Code

## Installing the CLI (Optional)

While the VS Code extension is our primary tool, the CLI is useful for terminal workflows and automation.

### Global Installation

```bash
npm install -g @anthropic-ai/claude-code
```

### Verify Installation

```bash
claude --version
```

### Authenticate the CLI

#### If You're Using API Credits:

The CLI uses the `ANTHROPIC_API_KEY` environment variable (same as VS Code):

```bash
# If not already set
export ANTHROPIC_API_KEY="sk-ant-api03-your-key-here"
```

#### If You're Using Claude Pro:

Run the login command to authenticate via browser:

```bash
claude login
```

This opens your browser for OAuth authentication with your Claude account.

### First CLI Command

Test your setup with a simple prompt:

```bash
claude "What programming languages do you know?"
```

You should see Claude respond with a list of programming languages it can assist with.

## Managing Your Usage

Whether you chose API Credits or Claude Pro, understanding what affects usage helps you work efficiently.

### What Affects Token/Usage Consumption

1. **Input tokens**: Your prompts and any files Claude reads
2. **Output tokens**: Claude's responses (code, explanations)
3. **Context size**: Open files and conversation history

### Cost-Saving Tips

- **Be specific**: Clear prompts reduce back-and-forth
- **Close unused files**: Reduces context sent with each request
- **Choose the right model**: Use Haiku for simple tasks, Sonnet for general work, Opus only when needed
- **Start new conversations**: Long conversations accumulate context

### Monitoring Your Usage

**API Credits users**: Check balance at [console.anthropic.com/settings/usage](https://console.anthropic.com/settings/usage)

**Claude Pro users**: Usage indicator appears in the Claude interface; limits reset daily

---

In the next chapter, we'll learn about context engineering—how to structure your prompts and project context to get the best results from Claude.
