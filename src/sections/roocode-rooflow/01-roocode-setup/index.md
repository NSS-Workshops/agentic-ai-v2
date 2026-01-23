Welcome to the world of advanced agentic AI development! In this chapter, you'll learn how to set up RooCode, a sophisticated AI development tool that goes far beyond basic AI assistance. Think of RooCode as upgrading from a helpful assistant to having a team of specialized AI experts working on your project.

## What Makes RooCode Different?

While Cursor IDE provides excellent AI assistance within your editor, RooCode operates as an **agentic AI system** - meaning it can work independently, make decisions, and coordinate multiple specialized "modes" to accomplish complex development tasks.

It is also highly customizeable. You can make working with an LLM work the way **YOU** want to work with it. With Cursor, the ability to customize is very low and it tell you how to work with an LLM.

### Key Advantages of RooCode

RooCode's power comes from its specialized AI modes that work like having different experts on your development team. Instead of relying on one general-purpose AI, you can access

| Mode | Description |
| --- | --- |
| **Code** | Focused assistance with writing and refactoring code. |
| **Architect** | Designing system architecture and project structure. |
| **Ask** | Detailed explanations and answers to questions. |
| **Debug** | Specialized troubleshooting and problem-solving. |
| **Orchestrator** | Coordinates multiple modes, manages workflows, and passes context between modes for complex, multi-step tasks. |

Each mode brings its own expertise and perspective to your development challenges.


The system becomes even more powerful with RooFlow integration, an experimental set of YAML-based system prompts designed as an alternative to the standard Roo Code modes. RooFlow enhances productivity through its **Memory Bank** system for persistent project context, five specialized Flow modes that save tokens and money.

The **Flow-Orchestrator** mode can delegate complex tasks to other modes while maintaining context through the memory bank, enabling sophisticated multi-step development workflows that would be difficult for any single AI mode to handle alone.

## Installation and Setup

Open the Coins R Us project with Visual Studio Code.

```sh
code ~/agentic-ai-workshop/coins-r-us
```

### Step 1: Install RooCode

RooCode is distributed as a VS Code extension, making installation straightforward through VS Code's built-in extension marketplace.

1. Open VS Code in the Coins R Us directory
2. Navigate to the Extensions panel using Ctrl+Shift+X (or Cmd+Shift+X on Mac)
3. Search for "Roo Code" and click Install on the official RooCode extension.

### Step 2: Open RooCode Panel

In the extensions strip on the left of VS Code, you'll see a new Kangaroo icon. Click that icon.

### Step 3: Initial Configuration

After installation, you'll need to configure RooCode with your API credentials to connect it to an AI provider. RooCode supports multiple AI providers, each with different strengths and pricing models.

**Google Gemini** offers the most generous free tier, making it ideal for learning and experimentation.

**OpenAI GPT-4** provides high-quality responses but requires payment

**Anthropic Claude** offers excellent reasoning capabilities, also on a paid basis.

#### Gemini API Key Generation

You are going to be using Google Gemini's `gemini-2.5-flash` model which is free to use with harsh rate limiting. As always, you get what you pay for.

1. Visit <a href="https://aistudio.google.com/app/api-keys" target="_blank">Google AI Studio</a>
2. Click **Get API Key** at the bottom
3. Click **Create API Key** at the top
4. Name your key "AI Workshop"
5. Choose an existing Cloud Project if you have one. If you don't, create a new one. It can be anything.
6. Click **Create Key** button
7. Do not close the tab. Move on to next steps

#### Setting Up Gemini in Roo Code

1. Click the _"or use without an account"_ link
2. Choose the option to use a 3rd party provider
6. In the **API Provider** field, choose "Google Gemini"
7. Go back to the browser and copy your API key and paste it into the **Gemini API Key** field in Roo Code
8. Choose **gemini-2.5-flash** from the **Model** dropdown
9.  Expand the **Advanced Settings** further down in the panel
10. Update the **Rate limit** slider to be 10 seconds.
11. Click **Save** at the top of the panel, then **Done**

## Verifying Your Setup

Test your basic connection to ensure RooCode can communicate with your chosen AI provider.

1. Open Roo Code extension
2. Click **Start New Task** at the bottom, or the pencil ✏️ icon at the top
3. At the bottom, make sure the selected mode is **Ask** and that **Gemini** is the selected model
4. Ask a simple question like "Can you explain what RooCode is?" If your setup is working correctly, you should receive a detailed response about RooCode's capabilities, confirming that your API key is properly configured and the connection is established.

## API Key Security Best Practices

**⚠️ CRITICAL SECURITY NOTICE**: API keys are like passwords to your AI accounts. Mishandling them can lead to unauthorized usage and unexpected charges.

### Understanding API Key Risks

Think of API keys like credit cards for AI services - they provide direct access to your account and billing. Anyone who obtains your key can make requests using your account, potentially running up charges without your knowledge. Costs can accumulate quickly with heavy usage, especially with premium models, and keys should never be shared with others or stored directly in code repositories where they might be accidentally exposed through version control systems.

## What's Next?

In the next chapter, you will learn about RooFlow, which enhances the default RooCode extension to make it truly powerful.
