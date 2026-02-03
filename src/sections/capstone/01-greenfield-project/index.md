It's time to apply everything you've learned. In this capstone project, you'll build a complete application from scratch using Claude Code—from initial planning through working implementation.

## Project Overview

You will build a **Personal Finance Tracker**—a web application that helps users track income and expenses, categorize transactions, and visualize spending patterns.

### Why This Project?

This project is chosen because it:
- Requires CRUD operations you've practiced
- Involves data modeling and relationships
- Benefits from UI component generation
- Has clear scope but room for creativity
- Demonstrates real-world AI-assisted development

### Core Requirements

**Must Have:**
- Add income and expense transactions
- Categorize transactions (Food, Transport, Entertainment, etc.)
- View transaction history
- See spending summary by category
- Filter transactions by date range

**Nice to Have (stretch goals):**
- Monthly budget setting
- Visual charts for spending
- Export data to CSV
- Recurring transactions

## Getting Started

### Step 1: Project Setup

Create your project using Claude Code:

```
You: I'm starting a new project—a personal finance tracker.
     Help me set it up with Next.js, TypeScript, and Tailwind CSS.
     Use json-server for the backend like we did with Coins R Us.

Claude: I'll set up the project structure for you.

        **Creating project...**

        ```bash
        npx create-next-app@latest finance-tracker --typescript --tailwind
        cd finance-tracker
        npm install
        ```

        **Project structure:**
        ```
        finance-tracker/
        ├── src/
        │   ├── app/
        │   │   ├── page.tsx         # Dashboard
        │   │   ├── transactions/
        │   │   │   └── page.tsx     # Transaction list
        │   │   └── add/
        │   │       └── page.tsx     # Add transaction
        │   ├── components/
        │   └── types/
        ├── data/
        │   └── database.json        # json-server data
        └── package.json
        ```

        **Initial database.json:**
        ```json
        {
          "transactions": [],
          "categories": [
            { "id": "1", "name": "Food", "type": "expense" },
            { "id": "2", "name": "Transport", "type": "expense" },
            { "id": "3", "name": "Entertainment", "type": "expense" },
            { "id": "4", "name": "Salary", "type": "income" },
            { "id": "5", "name": "Freelance", "type": "income" }
          ]
        }
        ```

        Ready to start building?
```

### Step 2: Define the Data Model

Work with Claude to design your data structure:

```
You: Let's design the data model. A transaction needs amount, date,
     category, description, and whether it's income or expense.

Claude: Here's the proposed data model:

        **types/index.ts:**
        ```typescript
        export interface Category {
          id: string;
          name: string;
          type: 'income' | 'expense';
        }

        export interface Transaction {
          id: string;
          amount: number;
          date: string;  // ISO date string
          categoryId: string;
          description: string;
          type: 'income' | 'expense';
          createdAt: string;
        }

        export interface TransactionWithCategory extends Transaction {
          category: Category;
        }
        ```

        **Sample transaction:**
        ```json
        {
          "id": "1",
          "amount": 45.50,
          "date": "2024-01-15",
          "categoryId": "1",
          "description": "Grocery shopping",
          "type": "expense",
          "createdAt": "2024-01-15T10:30:00Z"
        }
        ```

        This structure supports:
        - Categorized transactions
        - Income vs expense tracking
        - Date-based filtering
        - Audit trail via createdAt
```

### Step 3: Build Incrementally

Apply the iterative approach you learned:

**Iteration 1: Display Transactions**
```
"Create a transactions page that fetches and displays all transactions
in a simple list. Just the basics—amount, date, category name."
```

**Iteration 2: Add Transaction Form**
```
"Create a form to add new transactions. Include all fields from our
data model. Submit to json-server."
```

**Iteration 3: Category Filtering**
```
"Add a filter dropdown to show transactions by category."
```

**Iteration 4: Date Range Filter**
```
"Add date range inputs to filter transactions between two dates."
```

**Iteration 5: Summary Dashboard**
```
"Create a dashboard showing:
- Total income this month
- Total expenses this month
- Net balance
- Top 3 expense categories"
```

## Development Guidelines

### Use What You've Learned

Throughout this project, apply the techniques from the course:

**Context Engineering**
- Create a CLAUDE.md with your project conventions
- Keep prompts focused and specific

**Explore-Plan-Implement**
- Explore requirements before building
- Plan complex features before coding
- Implement in verified increments

**Effective Prompting**
- Be specific about what you want
- Reference existing code for consistency
- Ask for explanations when learning

**MCP Integration**
- Consider using Shadcn/UI MCP for components
- Use Playwright MCP for testing if desired

### Suggested Development Order

1. **Foundation** (Day 1)
   - Project setup
   - Data model and types
   - Basic transaction list

2. **Core CRUD** (Day 2)
   - Add transaction form
   - Edit transactions
   - Delete transactions

3. **Filtering & Search** (Day 3)
   - Category filter
   - Date range filter
   - Search by description

4. **Dashboard** (Day 4)
   - Summary calculations
   - Category breakdown
   - Polish and styling

5. **Stretch Goals** (Optional)
   - Charts with a visualization library
   - Export functionality
   - Recurring transactions

## Working Independently

This capstone is designed for independent work. Here's how to approach it:

### When You're Stuck

1. **Describe the problem clearly to Claude**
   ```
   "I'm trying to calculate the total expenses by category, but the
   grouping isn't working. Here's what I have..."
   ```

2. **Ask for investigation**
   ```
   "The filter isn't updating the list. Can you trace through my
   code and find where it's breaking?"
   ```

3. **Request alternatives**
   ```
   "This approach feels complicated. Is there a simpler way to
   implement date range filtering?"
   ```

### When Claude Goes Off Track

1. **Redirect with specifics**
   ```
   "That's not what I meant. I want the filter to update the API
   call, not filter client-side."
   ```

2. **Provide examples**
   ```
   "Like how we did it in Coins R Us—the filter changes what data
   is fetched, not just displayed."
   ```

3. **Step back and re-explain**
   ```
   "Let me explain the full picture again. I need..."
   ```

### When to Take Over

Sometimes writing code yourself is faster:
- Simple one-line fixes
- Copy-pasting patterns you already know
- Minor styling tweaks

Use Claude for the heavy lifting; handle small adjustments yourself.

## Evaluation Criteria

Your project will be evaluated on:

### Functionality (40%)
- All core requirements working
- Proper data persistence
- Error handling

### Code Quality (30%)
- Consistent patterns
- Appropriate TypeScript usage
- Clean component structure

### AI Collaboration (30%)
- Effective use of Claude Code
- Evidence of iterative development
- Good prompt engineering

### Bonus Points
- Stretch goals implemented
- Creative additions
- Excellent UI/UX

## Submission Requirements

Prepare the following for presentation:

1. **Working Application**
   - Deployed or runnable locally
   - Sample data demonstrating features

2. **Code Repository**
   - Clean commit history
   - CLAUDE.md with project context

3. **Brief Walkthrough**
   - Demonstrate key features
   - Explain one interesting Claude interaction
   - Share what you learned

## Tips for Success

### Do
- Start with the simplest version of each feature
- Test frequently as you build
- Keep your CLAUDE.md updated
- Take breaks when frustrated

### Don't
- Try to build everything at once
- Ignore error messages
- Skip the planning phase
- Forget to verify each iteration

### Remember
- Claude is a partner, not a magic solution
- Your understanding matters more than quantity
- Simple working code beats complex broken code
- Ask questions—that's how you learn

## Getting Help

If you're truly stuck:
1. Re-read the relevant course chapter
2. Try explaining the problem to Claude differently
3. Ask a classmate for their perspective
4. Reach out to the instructor

The goal is learning, not perfection. Struggle productively, then seek help.

---

Good luck! You have all the skills you need. Now it's time to apply them.
