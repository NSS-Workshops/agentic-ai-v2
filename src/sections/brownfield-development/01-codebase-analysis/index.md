Working with existing code—brownfield development—is fundamentally different from starting fresh. Before you can add features or fix bugs, you must understand what already exists. This chapter teaches systematic approaches to analyzing unfamiliar codebases using Claude Code.

## The Brownfield Challenge

When you join an existing project, you face questions like:

- What's the overall architecture?
- What patterns does the code follow?
- Where is the relevant code for my task?
- What are the hidden dependencies?
- What might break if I change something?

Answering these questions manually takes time. Claude Code can accelerate this exploration significantly.

## Introducing Coins R Us

Throughout this section, we'll work with **Coins R Us**—a coin collection management application. It's a Next.js application with:

- React frontend
- API routes
- json-server backend
- Styled Components for styling
- Basic CRUD operations for coins

The codebase has typical characteristics of a real project:
- Multiple architectural layers
- Some inconsistencies
- Areas that could be improved
- Incomplete features

## Starting the Analysis

### First: Get Oriented

Before diving deep, get a high-level view:

```
You: Give me a quick overview of this codebase. What technologies
     does it use and how is it organized?

Claude: [Reads package.json, scans directory structure]

        **Coins R Us - Overview**

        **Framework:** Next.js 15 with App Router
        **Styling:** Styled Components + Radix UI
        **State:** React hooks (no external state management)
        **Backend:** json-server on port 3001

        **Directory Structure:**
        ```
        src/
        ├── app/           # Next.js App Router pages
        │   ├── page.tsx   # Home page
        │   └── coins/     # Coin-related routes
        ├── components/    # Reusable UI components
        ├── styles/        # Global styles and theme
        └── types/         # TypeScript type definitions

        data/
        └── database.json  # json-server data store
        ```

        **Key Files:**
        - src/app/page.tsx - Main landing page
        - src/components/CoinCard.tsx - Coin display component
        - data/database.json - Backend data

        Want me to explore any area in more detail?
```

### Second: Understand the Data Model

Understanding what data the application works with is crucial:

```
You: What data does this application manage? Show me the types and
     the actual data structure.

Claude: [Reads types and database.json]

        **Data Model**

        The application manages coin inventory with this structure:

        ```typescript
        interface Coin {
          id: string;
          denomination: string;  // Quarter, Dime, Nickel, Penny, etc.
          year: number;
          location: string;      // Mint location (Philadelphia, Denver, etc.)
          condition: string;     // Grading (MS-65, VF-30, etc.)
          price: number;
          quantity: number;
          description: string;
        }
        ```

        **Current Data:**
        - 15 coins in the database
        - 6 denominations represented
        - Dates ranging from 1878 to 2023
        - Prices from $1 to $250

        **Related Collections:**
        - users (2 entries)
        - orders (2 entries)

        The data model supports inventory tracking with quantity
        per coin type, pricing, and condition grading.
```

### Third: Trace the Data Flow

Understand how data moves through the application:

```
You: How does data flow from the backend to the UI? Walk me through
     how coins are fetched and displayed.

Claude: [Traces code paths]

        **Data Flow: Coins**

        1. **Backend (json-server)**
           ```
           GET http://localhost:3001/coins
           ```
           Returns all coins from database.json

        2. **API Call (src/app/coins/page.tsx:15)**
           ```typescript
           const response = await fetch('http://localhost:3001/coins');
           const coins = await response.json();
           ```
           Fetches on server component render (SSR)

        3. **State Management**
           No client-side state management - data is passed
           as props from server components

        4. **Component Rendering**
           ```
           CoinsPage (server) → CoinList (client) → CoinCard (client)
           ```

        **Observations:**
        - No caching layer
        - No error boundaries for failed fetches
        - Direct fetch without abstraction layer

        This is a straightforward data flow, but lacks error
        handling and loading states.
```

## Analysis Techniques

### Pattern: Ask "What Does This Do?"

When you encounter unfamiliar code:

```
You: What does the CoinCard component do? Explain its props and behavior.

Claude: [Reads src/components/CoinCard.tsx]

        **CoinCard Component**

        **Purpose:** Displays a single coin's information in a card format

        **Props:**
        ```typescript
        interface CoinCardProps {
          coin: Coin;
          onEdit?: (id: string) => void;
          onDelete?: (id: string) => void;
        }
        ```

        **Behavior:**
        - Renders coin details (denomination, year, condition, price)
        - Shows quantity badge in corner
        - Displays description text
        - Provides Edit and Delete buttons (optional)

        **Styling:**
        - Uses Styled Components (CardWrapper, CardTitle, etc.)
        - Responsive layout with flexbox
        - Hover state changes border color

        **Dependencies:**
        - Expects Coin type from types/
        - Uses theme colors from styles/theme

        The component is presentational—all logic is handled by
        parent components through callbacks.
```

### Pattern: Find Related Code

Understand how pieces connect:

```
You: What components or functions use CoinCard?

Claude: [Searches for CoinCard usage]

        **CoinCard Usage:**

        1. **src/app/coins/page.tsx:42**
           ```tsx
           <CoinList coins={coins} />
           ```
           CoinList internally maps over coins using CoinCard

        2. **src/components/CoinList.tsx:18**
           ```tsx
           {coins.map(coin => (
             <CoinCard
               key={coin.id}
               coin={coin}
               onDelete={handleDelete}
             />
           ))}
           ```

        3. **src/app/coins/[id]/page.tsx:28**
           Single coin detail view uses a modified CoinCard

        **Observations:**
        - CoinCard is always rendered within CoinList on the main page
        - The detail page has its own version (CoinDetailCard)
        - Some code duplication between CoinCard and CoinDetailCard
```

### Pattern: Check for Patterns and Conventions

Identify how the codebase does things:

```
You: What conventions does this codebase follow? Look at naming,
     file organization, and coding patterns.

Claude: [Analyzes multiple files]

        **Codebase Conventions**

        **Naming:**
        - Components: PascalCase (CoinCard, CoinList)
        - Files: Match component name (CoinCard.tsx)
        - Types: Singular nouns (Coin, User, Order)
        - Hooks: camelCase with use prefix (none found yet)

        **File Organization:**
        - One component per file
        - Types centralized in types/
        - No barrel exports (index.ts files)
        - Styles co-located with components (Styled Components)

        **Coding Patterns:**
        - Async/await for data fetching
        - Destructured props
        - Optional chaining used inconsistently
        - Mix of server and client components

        **Inconsistencies Found:**
        - Some components use default export, others named
        - Error handling exists in some places, not others
        - Some files have JSDoc, most don't

        These conventions should guide new code additions.
```

### Pattern: Identify Pain Points

Find areas needing improvement:

```
You: What issues or technical debt do you see in this codebase?

Claude: [Comprehensive analysis]

        **Technical Debt Assessment**

        **High Priority:**
        1. **No Error Handling**
           - API calls fail silently
           - No error boundaries
           - No user feedback for failures

        2. **No Loading States**
           - Fetch operations show no loading indicator
           - Poor perceived performance

        **Medium Priority:**
        3. **Duplicated Code**
           - CoinCard and CoinDetailCard share 70% of code
           - Could extract shared component

        4. **No Type Safety for API**
           - Response data not validated
           - Types assumed but not enforced

        5. **Hardcoded API URL**
           - http://localhost:3001 appears in multiple places
           - Should be environment variable

        **Low Priority:**
        6. **Missing Tests**
           - No test files found
           - No testing framework configured

        7. **Inconsistent Exports**
           - Some default, some named
           - No consistent pattern

        Addressing these would improve reliability and maintainability.
```

## Exploratory Questions

Good questions to ask when analyzing a codebase:

### Architecture Questions

```
"What's the overall architecture of this application?"
"How is the code organized into layers?"
"What are the main modules and how do they interact?"
"Where does business logic live?"
```

### Data Questions

```
"What data models does this application use?"
"How is data fetched, stored, and updated?"
"What's the state management strategy?"
"How does data flow between components?"
```

### Pattern Questions

```
"What patterns and conventions does this codebase follow?"
"How are errors handled?"
"How is authentication/authorization implemented?"
"What testing patterns are used?"
```

### Quality Questions

```
"What technical debt exists in this codebase?"
"What areas are most fragile?"
"What's missing that should be there?"
"What would you refactor first?"
```

## Creating a CLAUDE.md for the Project

After analysis, document your findings:

```markdown
# Coins R Us - Project Context

## Overview
Coin collection management app built with Next.js 15.

## Tech Stack
- Next.js 15 (App Router)
- Styled Components + Radix UI
- json-server backend
- TypeScript

## Architecture
- Server components for data fetching
- Client components for interactivity
- API at http://localhost:3001

## Data Model
Main entity: Coin
- id, denomination, year, location, condition, price, quantity, description

## Patterns to Follow
- One component per file
- Styled Components for styling
- Async/await for API calls
- Props destructuring

## Known Issues
- No error handling on API calls
- Hardcoded API URL
- Missing tests

## Running Locally
1. npm install
2. npm run dev (starts Next.js on :3000)
3. npx json-server data/database.json --port 3001
```

This becomes persistent context for future work.

## Practical Exercise: Analyze Coins R Us

Practice analyzing the codebase yourself.

### Setup

1. Navigate to the coins-r-us directory
2. Open Claude Code

### Exercise

**Part 1: High-Level Analysis**

```
"Give me a complete overview of this project: tech stack,
structure, and main features."
```

**Part 2: Data Understanding**

```
"What's the data model? Show me the types and how data flows
through the application."
```

**Part 3: Pattern Recognition**

```
"What patterns and conventions does this codebase follow?
What should I follow when adding new code?"
```

**Part 4: Issue Identification**

```
"What problems or areas for improvement do you see?"
```

**Part 5: Create Documentation**

```
"Create a CLAUDE.md file documenting what you learned about
this project."
```

### Reflect

After the exercise:
- How long did analysis take vs. doing it manually?
- What did Claude find that you might have missed?
- What questions would you add for future analyses?

## Key Takeaways

1. **Start broad, then narrow**: Overview first, then specific areas
2. **Understand data first**: Data models drive architecture
3. **Trace the flow**: Follow data from source to display
4. **Look for patterns**: Conventions guide new code
5. **Document findings**: Create CLAUDE.md for future context
6. **Identify issues**: Technical debt awareness prevents surprises

## Glossary

- **Brownfield Development**: Working on existing codebases (opposite of greenfield)
- **Data Flow**: The path data takes from source through the application to display
- **Technical Debt**: Suboptimal code that works but should be improved
- **Convention**: A pattern consistently followed throughout a codebase
- **Code Archaeology**: The process of understanding existing code through investigation

---

In the next chapter, we'll use what we learned to add a new feature to Coins R Us—an inventory view that displays stock levels.
