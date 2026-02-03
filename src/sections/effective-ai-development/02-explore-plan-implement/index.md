Complex development tasks often fail when we jump straight into coding. The Explore-Plan-Implement workflow provides a structured approach that improves outcomes by ensuring you understand the problem before writing solutions.

## The Problem with "Just Do It"

Consider this scenario:

```
You: Add a search feature to the products page

Claude: Sure! I'll add a search feature.
        [Creates SearchBar.tsx]
        [Updates ProductPage.tsx]
        [Adds search state]

You: Wait, we already have a search component in shared/
     And we use Algolia, not local filtering...
```

The agent did exactly what was asked—but without understanding the codebase, it created duplicate code and ignored existing patterns.

This happens when we skip the exploration phase.

## The Three Phases

The Explore-Plan-Implement workflow breaks complex tasks into three distinct phases:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   EXPLORE   │ ──> │    PLAN     │ ──> │  IMPLEMENT  │
│             │     │             │     │             │
│ Understand  │     │ Design      │     │ Execute     │
│ the system  │     │ the solution│     │ the plan    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Phase 1: Explore

**Goal**: Understand the current state before proposing changes

**Activities**:
- Read relevant code
- Understand existing patterns
- Find related implementations
- Identify constraints and dependencies

**Mode**: Plan mode (read-only)

### Phase 2: Plan

**Goal**: Design a solution that fits the existing system

**Activities**:
- Propose approach based on exploration
- Get feedback and refine
- Consider edge cases
- Verify approach with stakeholder (you)

**Mode**: Plan mode (discussion)

### Phase 3: Implement

**Goal**: Execute the agreed-upon plan

**Activities**:
- Make changes according to plan
- Run tests and verify
- Handle unexpected issues
- Document changes

**Mode**: Normal or Auto-accept

## Phase 1: Explore in Detail

The exploration phase is often skipped, but it's crucial for good outcomes.

### How to Explore Effectively

Start with broad questions, then narrow down:

```
Level 1: Project Structure
"Give me an overview of this project's structure and architecture"

Level 2: Feature Area
"How does the current search functionality work?"

Level 3: Specific Implementation
"Walk me through the SearchBar component and its integration"
```

### Exploration Prompts That Work

**For understanding architecture:**
```
Explore this codebase and tell me:
1. What framework and major libraries are used?
2. How is the code organized?
3. What are the main patterns used?
```

**For understanding a feature:**
```
Before we add search, I need to understand:
1. Are there any existing search implementations?
2. How does data flow from API to UI?
3. What state management is used?
```

**For understanding constraints:**
```
What would I need to consider before modifying the user dashboard?
Look at dependencies, tests, and related components.
```

### Signs You've Explored Enough

You're ready to move to planning when you can answer:

- What patterns does this codebase use?
- Where will my changes fit?
- What existing code can I reuse?
- What might break if I change things?

## Phase 2: Plan in Detail

Planning bridges understanding and action.

### Creating a Good Plan

A useful plan includes:

1. **Summary**: One sentence describing the approach
2. **Steps**: Ordered list of specific actions
3. **Files affected**: Which files will change
4. **Risks**: What could go wrong
5. **Questions**: Any remaining uncertainties

### Example Planning Session

```
You: Based on your exploration, how would you add user search to
     the dashboard?

Claude: Based on what I found, here's my plan:

        **Summary**: Add user search by extending the existing
        SearchBar component and connecting it to the users API.

        **Steps**:
        1. Extend SearchBar to accept an onSearch callback
        2. Create useUserSearch hook using existing useApi pattern
        3. Add SearchBar to UserDashboard
        4. Display results using existing UserCard component
        5. Add loading and empty states

        **Files to change**:
        - src/components/SearchBar.tsx (extend props)
        - src/hooks/useUserSearch.ts (new file)
        - src/pages/UserDashboard.tsx (add search)

        **Risks**:
        - SearchBar changes might affect other uses
        - Need to handle debouncing for performance

        **Questions**:
        - Should search persist across navigation?
        - What's the minimum query length?

You: Good plan. Search doesn't need to persist, and minimum length
     should be 2 characters. Please proceed.
```

### When to Revise the Plan

Revise your plan if:
- New information emerges during exploration
- The stakeholder has different requirements
- Risks seem too high
- There's a simpler approach

## Phase 3: Implement in Detail

With a solid plan, implementation becomes straightforward.

### Implementing Step by Step

Follow the plan sequentially:

```
You: Let's start implementing. Begin with step 1: extending SearchBar.

Claude: I'll modify SearchBar to accept an onSearch callback.
        [Shows proposed changes]

        Want me to proceed?

You: Yes, continue to step 2.
```

### Handling Deviations

Sometimes implementation reveals issues the plan didn't anticipate:

```
Claude: While implementing step 3, I noticed UserDashboard uses a
        different layout system than I expected. We have two options:

        A) Adapt SearchBar to fit the existing layout (easier)
        B) Update the layout to match other pages (cleaner long-term)

        Which approach do you prefer?

You: Let's go with option A for now. We can clean up layouts later.
```

### Verification During Implementation

After each step:

```
Claude: Step 1 complete. Let me verify:
        - Running lint... passed
        - Running tests... passed
        - SearchBar still works in existing locations... verified

        Ready for step 2?
```

## The Weather Widget Disaster

Let's practice the workflow with a realistic scenario.

### Exercise Setup

You're working on a dashboard application that displays various widgets. A stakeholder asks you to "add a weather widget to the dashboard."

Without the Explore-Plan-Implement workflow, you might immediately create a new component. But what could go wrong?

### Part 1: What Could Go Wrong

Consider these potential issues:

1. **There might already be a weather widget** in another part of the app
2. **The widget system might have specific patterns** you need to follow
3. **Weather data might need to come from a specific service** the app already uses
4. **The dashboard layout might have constraints** on widget sizes
5. **There might be user preferences** for widget configurations

### Part 2: Apply the Workflow

**Step 1: Explore**

```
You: Before adding a weather widget, I need to understand the widget
     system. Please explore and tell me:
     1. How are existing widgets structured?
     2. Is there a widget registration system?
     3. How do widgets get their data?
     4. Are there any weather-related implementations?
```

**What you might discover:**
- Widgets follow a specific interface (WidgetProps)
- There's a widget registry in src/widgets/index.ts
- Each widget has a data hook in src/widgets/hooks/
- There's already a WeatherService but no widget using it

**Step 2: Plan**

```
You: Good findings. Now plan how to add the weather widget following
     existing patterns.

Claude: **Plan: Weather Widget Implementation**

        **Summary**: Create a WeatherWidget following the existing widget
        pattern, using WeatherService for data.

        **Steps**:
        1. Create useWeatherData hook following useStockData pattern
        2. Create WeatherWidget component using WidgetCard base
        3. Register widget in widget registry
        4. Add to default dashboard layout

        **Files**:
        - src/widgets/hooks/useWeatherData.ts (new)
        - src/widgets/WeatherWidget.tsx (new)
        - src/widgets/index.ts (update registry)
        - src/config/defaultDashboard.ts (add to layout)

        **Risks**:
        - WeatherService might need location permissions
        - Need to handle API rate limits

        **Questions**:
        - What location should the widget use?
        - Should it be in the default layout or user-added?
```

**Step 3: Implement**

Follow the plan step by step, verifying each stage.

### Part 3: Compare Outcomes

**Without workflow:**
- Created standalone component not following patterns
- Duplicated data fetching logic
- Widget doesn't integrate with dashboard system
- User preferences don't work

**With workflow:**
- Widget follows existing patterns
- Uses established services and hooks
- Integrates with widget registry
- Works with user customization

### Part 4: Reflection Questions

After completing the exercise, consider:

1. How much time did exploration save in the long run?
2. What mistakes did planning help you avoid?
3. When might you skip parts of this workflow?

## Adapting the Workflow

Not every task needs full Explore-Plan-Implement. Adapt based on:

### Full Workflow (All Three Phases)

Use for:
- New features in unfamiliar codebases
- Complex, multi-file changes
- Architectural decisions
- When mistakes are costly

### Abbreviated Workflow

Use for:
- Simple additions to familiar code
- Bug fixes with clear causes
- Tasks following established patterns

```
Quick Explore: "Is there existing code similar to what I need?"
Quick Plan: "Here's what I'll do: [one sentence]"
Implement: Proceed with changes
```

### Skip to Implement

Use for:
- Trivial changes (typos, formatting)
- Exactly defined tasks with clear instructions
- Well-documented, isolated components

## Workflow Timing

A rough guide for task complexity:

| Task Complexity | Explore | Plan | Implement |
|-----------------|---------|------|-----------|
| Simple (lint fix) | Skip | Skip | 5 min |
| Medium (add form field) | 5 min | 2 min | 15 min |
| Complex (new feature) | 15 min | 10 min | 1+ hour |
| Major (architecture change) | 1+ hour | 30 min | Days |

Investing time in exploration and planning pays off for complex tasks.

## Common Mistakes to Avoid

### Skipping Exploration

**Symptom**: Creating duplicate code, ignoring patterns
**Fix**: Always ask "is there existing code for this?"

### Vague Plans

**Symptom**: Getting stuck during implementation
**Fix**: Plans should have specific steps with file names

### Ignoring Plan Deviations

**Symptom**: Implementation diverges from plan without discussion
**Fix**: Stop and reassess when discoveries contradict the plan

### Over-Planning Simple Tasks

**Symptom**: Spending more time planning than implementing
**Fix**: Match workflow depth to task complexity

## Key Takeaways

1. **Explore before acting**: Understanding the codebase prevents duplicate work and pattern violations
2. **Plan with specifics**: Good plans include files, steps, and risks
3. **Implement with verification**: Check each step before proceeding
4. **Adapt the workflow**: Match depth to complexity—simple tasks need less ceremony
5. **Learn from deviations**: When plans change, update your understanding
6. **Practice the pattern**: It becomes natural with repetition

## Glossary

- **Explore Phase**: The investigation stage where you understand existing code before proposing changes
- **Plan Phase**: The design stage where you propose a specific approach for review
- **Implement Phase**: The execution stage where you carry out the approved plan
- **Deviation**: When implementation reveals something the plan didn't anticipate
- **Verification**: Checking that each step completed successfully before proceeding

---

In the next chapter, we'll learn about Claude Code's built-in skills and workflows—pre-packaged commands that automate common development tasks.
