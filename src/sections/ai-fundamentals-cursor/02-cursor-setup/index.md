## What is Cursor IDE?

Cursor is a modern code editor built specifically for AI-assisted development. Think of it as VS Code's AI-powered cousin—it looks and feels familiar but comes with powerful AI features built right in.

Unlike traditional code editors where AI is an add-on, Cursor was designed from the ground up to seamlessly integrate AI assistance into your coding workflow.

### Why Cursor for This Workshop?

Cursor is an ideal choice for people new to learning AI-assisted development because it removes the typical barriers that prevents many from getting started. The platform offers a generous free tier with GPT-4.1 access, meaning you can begin experimenting with advanced AI features immediately without needing API keys, subscriptions, or complex setup procedures. Since Cursor is built on the same foundation as VS Code, you'll find yourself in a familiar environment that minimizes the learning curve while maximizing your ability to focus on AI concepts rather than wrestling with a new interface. The editor provides multiple AI interaction modes—including chat, inline suggestions, and intelligent code completion—all integrated seamlessly into a professional-grade development environment that mirrors what you'll use in real-world projects.

## Installation and Setup

### Step 1: Download Cursor

1. Visit [cursor.com](https://cursor.com)
2. Click **"Download for [Your OS]"**
3. Install like any other application

### Step 2: Clone First Workshop Project

In your terminal, make a new directory in your home directory for this workshop.

```sh
mkdir -p ~/agentic-ai-workshop
```

Then navigate to that directory

```sh
cd ~/agentic-ai-workshop
```

Clone the **Coins-R-Us** project and `cd` to that directory

```sh
git clone git@github.com:NSS-Workshops/coins-r-us.git
cd coins-r-us
```

Then open the project in Cursor

```sh
cursor .
```

### Step 3: Initial Setup

When you first open Cursor:

1. **Sign up for an account** - This enables the free AI features
2. **Choose your theme** - Light, dark, or system preference

### Step 4: Activate Free Models

1. From the app menu at the top, choose **Cursor** -> **Settings** -> **Cursor Settings**
2. Click on **Models**
3. Search "gemini" and enable **gemini-2.5-flash**

### Step 5: Verify AI Access

1. Open any code file (or create a new one)
2. Press `Cmd+L` (Mac) or `Ctrl+L` (Windows/Linux)
3. You should see the AI chat interface appear
4. Make sure the **gemini-2.5-flash** model is chosen in the dropdown at the bottom of the chat box
5. Type "What is this project about?" and press Enter - you should get a response

If this works, you're ready to go!

## Understanding Cursor's AI Features

### 1. Chat Interface (`Cmd+L` / `Ctrl+L`)

The **Chat** feature transforms your coding experience by providing an intelligent conversation partner that understands your development context. You can engage with this AI assistant to ask detailed questions about your code's functionality, request clear explanations of complex functions that might be difficult to understand, seek debugging assistance when errors arise, and collaboratively brainstorm creative solutions to challenging programming problems. This conversational approach makes learning more interactive and helps you develop a deeper understanding of both your code and programming concepts in general.

**Example Chat Prompts:**
```
"Explain what this function does"
"How can I optimize this code?"
"What's causing this error?"
"Show me a better way to write this"
```

### 2. Inline AI (`Cmd+K` / `Ctrl+K`)

**Inline AI** revolutionizes how you write and modify code by allowing you to generate or transform code directly within your editor through natural language instructions. This powerful feature enables you to describe what you want in plain English and watch as new code materializes based on your specifications, refactor existing code blocks with targeted improvements, automatically add comprehensive comments and documentation to make your code more maintainable, and apply precise bug fixes without manually hunting through complex logic. The inline approach keeps you in your coding flow while providing AI assistance exactly where and when you need it.

**Example Inline Prompts:**
```
"Create a function that validates email addresses"
"Add error handling to this function"
"Convert this to use async/await"
"Add TypeScript types to this code"
```

### 3. Tab Completion

As you type, Cursor's intelligent tab completion system anticipates your coding intentions and offers contextually relevant suggestions that go far beyond simple autocomplete. The system provides smart suggestions that understand not just the immediate code you're writing, but the broader context of your project, including variable names, function signatures, and established patterns throughout your codebase.

When working with complex programming patterns, Cursor can suggest entire multi-line code blocks that follow best practices and maintain consistency with your existing code style. Simply press Tab to accept these AI-powered suggestions and watch your coding speed increase dramatically while maintaining high code quality.

## Cost Considerations and Limits

### Free Tier Limits

Cursor's free tier provides a carefully balanced offering that supports serious learning while maintaining sustainable service quality. The platform includes limited monthly usage that proves generous enough for educational purposes and skill development, though it's designed to encourage thoughtful use rather than unlimited experimentation.

You'll have full access to GPT-4.1, ensuring that your AI interactions benefit from the most advanced language model capabilities available, delivering high-quality responses that can genuinely accelerate your learning.

Most importantly, the free tier doesn't restrict access to core features—you'll have complete access to chat functionality, inline AI assistance, and intelligent code completions, giving you the full Cursor experience without financial barriers.

### Usage Tips to Stay Within Limits

To maximize your free tier benefits and develop good AI-assisted coding habits, focus on crafting specific, detailed prompts that communicate your needs clearly in a single interaction, avoiding lengthy back-and-forth conversations that consume your quota unnecessarily.

Exercise thoughtful judgment with code completions by evaluating each suggestion rather than automatically accepting every AI recommendation, ensuring that accepted code aligns with your project's goals and coding standards. Prioritize using AI as a learning accelerator rather than a code generator—ask for explanations, request alternative approaches, and seek to understand the reasoning behind AI suggestions so you develop genuine programming skills alongside AI proficiency.

### When You Hit Limits

If you exceed the free tier:

- **Wait for reset** - Limits refresh monthly
- **Upgrade to Pro** - For unlimited usage. This will cost you, so only do this if you're willing to pay for Cursor.

## Your First AI-Assisted Coding Session

Let's practice with a simple exercise:

### Exercise: Implement a color pallette

1. Go to [coolers.co](https://coolors.co/palettes/trending) and find a color pallette you like.
2. Open that pallette
3. Copy the URL of the pallette
4. Open the `page.module.css` file in Cursor
5. Open the chat interface
6. Make sure that the **Agent** mode is selected in the chat interface
7. Choose **gpt-4.1** as your model
8. Enter the following prompt

```
Access the color pallette at the following URL: {paste your URL here}

Implement that theme in this project
```

9. When the agent is done implementing the color pallette, click the **Review changes** text at the end of the response to see what code it implemented.
10. Then click the **Keep All** button at the bottom of the chat panel.

## Troubleshooting Common Issues

### "AI features not working"
- Check your internet connection
- Verify you're signed in to your Cursor account
- Try restarting Cursor

### "Out of free usage"
- Check usage in Settings → Account
- Wait for monthly reset or consider upgrading
- Switch to other tools for practice

### "Generated code has errors"
- This is normal! AI isn't perfect
- Use this as a learning opportunity
- Ask the AI to fix the errors

## Comparing Cursor to Traditional Development

### Traditional Workflow
1. Think about the problem
2. Research solutions online
3. Write code from scratch
4. Debug and refine
5. Test and iterate

### AI-Assisted Workflow with Cursor
1. Think about the problem
2. **Describe the solution to AI**
3. **Review and understand generated code**
4. **Refine with AI assistance**
5. Test and iterate **with AI help**

The key difference: **AI accelerates each step**, but you still need to understand and verify everything.

## Key Takeaways

Cursor represents a significant evolution in development environments by seamlessly integrating AI assistance into a familiar VS Code-like interface, eliminating the friction typically associated with adopting new tools while providing access to cutting-edge AI capabilities. The platform's strength lies in its multiple interaction modes—chat for conversational problem-solving, inline AI for direct code generation and modification, intelligent completions for accelerated typing, and selection-based assistance for targeted help—each designed to support different aspects of your development workflow.

While the free tier offers generous access that supports serious learning and experimentation, understanding its limits helps you develop sustainable usage patterns and appreciate the value of thoughtful AI interaction. The fundamental principle of always reviewing and understanding generated code cannot be overstated, as this practice ensures code quality while reinforcing your learning and maintaining your ability to debug and modify AI-generated solutions.

Most importantly, view AI as a powerful accelerator for learning rather than a replacement for understanding—use it to explore new concepts, understand complex patterns, and gain insights that enhance your programming knowledge. Remember that context drives results: the more specific, detailed, and relevant information you provide in your prompts, the more useful and accurate the AI's responses will be.
