Bugs happen. Code accumulates technical debt. This chapter shows you how to use Claude Code to find issues, understand their causes, and fix them—while also improving code quality through targeted refactoring.

## AI-Assisted Debugging

Debugging with AI differs from traditional debugging. Instead of manually tracing execution, you can describe symptoms and let Claude investigate.

### The Debugging Workflow

1. **Describe the symptom**: What's happening vs. what should happen
2. **Let Claude investigate**: It reads code, traces flows, identifies causes
3. **Verify the diagnosis**: Ensure Claude's explanation matches your observations
4. **Apply the fix**: Have Claude implement the solution
5. **Confirm the fix**: Test to verify the problem is resolved

### Example: A Real Bug in Coins R Us

Let's debug an actual issue. The coin list page sometimes shows stale data after adding a new coin.

```
You: I'm seeing a bug. When I add a new coin, the list page still shows
     the old data. I have to refresh manually. Find and fix this issue.

Claude: [Investigates the data flow]

        **Bug Investigation**

        I traced the data flow for adding coins:

        1. **Add Form (src/components/AddCoinForm.tsx:45)**
           ```typescript
           const handleSubmit = async (data: CoinFormData) => {
             await fetch('http://localhost:3001/coins', {
               method: 'POST',
               body: JSON.stringify(data),
             });
             router.push('/coins');  // ← Just navigates
           };
           ```

        2. **Coins Page (src/app/coins/page.tsx)**
           ```typescript
           const response = await fetch('http://localhost:3001/coins');
           ```
           This is a Server Component with default caching.

        **Root Cause:**
        Next.js caches server component data by default. When you
        navigate to /coins after adding, it shows cached data.

        **The Fix:**
        Two options:

        Option A: Revalidate after mutation
        ```typescript
        await fetch('http://localhost:3001/coins', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        revalidatePath('/coins');  // Add this
        router.push('/coins');
        ```

        Option B: Use router.refresh()
        ```typescript
        router.push('/coins');
        router.refresh();  // Force data refetch
        ```

        I recommend Option A—it's more explicit about what data changed.
        Should I implement this fix?
```

This demonstrates AI debugging at its best: Claude traced the entire flow, identified the caching issue, and proposed solutions with trade-offs.

### Debugging Techniques

#### Technique: Symptom Description

Good symptom descriptions lead to faster diagnosis:

**Less helpful:**
```
"The page is broken."
```

**More helpful:**
```
"When I click 'Add Coin' and submit the form, the new coin appears in the
database (I checked json-server) but doesn't show on the coins list page
until I manually refresh."
```

Include:
- What you did (action)
- What happened (actual result)
- What should have happened (expected result)
- Any context (only after adding, only with certain data, etc.)

#### Technique: Ask for Investigation

Let Claude do the detective work:

```
You: The delete button doesn't work. Instead of removing the coin,
     nothing happens. Investigate why.

Claude: [Reads relevant code, traces execution]

        **Investigation Results**

        Found the issue in CoinCard.tsx:

        ```typescript
        const handleDelete = async () => {
          await fetch(`http://localhost:3001/coins/${id}`, {
            method: 'DELETE',
          });
          // Missing: callback to parent
        };
        ```

        The fetch succeeds (coin is deleted from database), but
        there's no state update to remove it from the UI.

        The parent component passes an `onDelete` prop but it's
        never called:

        ```typescript
        interface CoinCardProps {
          coin: Coin;
          onDelete?: (id: string) => void;  // Passed but unused
        }
        ```

        **Fix:**
        ```typescript
        const handleDelete = async () => {
          await fetch(`http://localhost:3001/coins/${id}`, {
            method: 'DELETE',
          });
          onDelete?.(id);  // Add this line
        };
        ```
```

#### Technique: Understand Before Fixing

Sometimes you need to understand the issue before jumping to solutions:

```
You: Explain what's happening with this error. Don't fix it yet—
     I want to understand it first.

     Error: "Cannot read properties of undefined (reading 'price')"

Claude: [Analyzes the error context]

        **Error Analysis**

        This error occurs when trying to access `.price` on something
        that's `undefined`.

        **Where it happens:**
        The error trace points to CoinCard.tsx:28:

        ```typescript
        <PriceTag>${coin.price.toFixed(2)}</PriceTag>
        ```

        **Why it happens:**
        The `coin` object being passed is sometimes undefined.

        **When it happens:**
        Looking at CoinList.tsx:

        ```typescript
        {coins.map(coin => (
          <CoinCard key={coin.id} coin={coin} />
        ))}
        ```

        The `coins` array might contain undefined entries. This can
        happen if:
        1. The API returned malformed data
        2. A filter/map operation created undefined entries
        3. There's a race condition during data loading

        **Next step:**
        I'd recommend adding logging to see what `coins` actually
        contains when this error occurs. Want me to add that, or
        would you like to check the API response first?
```

#### Technique: Error Message Analysis

Paste error messages directly to Claude:

```
You: Fix this error:

     TypeError: Cannot set property 'quantity' of undefined
         at updateInventory (src/utils/inventory.ts:23:14)
         at handleStockChange (src/components/StockManager.tsx:45:5)

Claude: [Reads the files and analyzes]

        **Error Breakdown**

        Location: src/utils/inventory.ts line 23

        ```typescript
        function updateInventory(coins: Coin[], id: string, qty: number) {
          const coin = coins.find(c => c.id === id);
          coin.quantity = qty;  // ← Line 23: coin is undefined
          return coins;
        }
        ```

        **Cause:**
        `find()` returns undefined when no match is found. The code
        assumes a coin will always be found.

        **Fix:**
        ```typescript
        function updateInventory(coins: Coin[], id: string, qty: number) {
          const coin = coins.find(c => c.id === id);
          if (!coin) {
            throw new Error(`Coin with id ${id} not found`);
          }
          coin.quantity = qty;
          return coins;
        }
        ```

        Or, if you prefer non-throwing:
        ```typescript
        function updateInventory(coins: Coin[], id: string, qty: number) {
          return coins.map(coin =>
            coin.id === id ? { ...coin, quantity: qty } : coin
          );
        }
        ```

        The second approach is more functional and handles missing
        coins gracefully (just returns unchanged array).
```

## AI-Assisted Refactoring

Refactoring improves code structure without changing behavior. Claude can identify opportunities and execute refactors safely.

### Identifying Refactoring Opportunities

Ask Claude to analyze code quality:

```
You: Review the CoinCard and CoinDetailCard components. Are there
     refactoring opportunities?

Claude: [Reads both components]

        **Refactoring Analysis**

        **Code Duplication Found:**

        CoinCard.tsx and CoinDetailCard.tsx share 70% similar code:

        Both have:
        - Same styled components (CardWrapper, CardTitle, Badge)
        - Same price formatting logic
        - Same condition display

        Different:
        - CoinDetailCard shows description (full text)
        - CoinDetailCard has back navigation
        - CoinCard has edit/delete buttons

        **Recommended Refactoring:**

        1. **Extract shared styled components**
           Create src/components/shared/CoinStyles.ts

        2. **Create base component**
           CoinCardBase with shared rendering
           CoinCard extends with actions
           CoinDetailCard extends with navigation + description

        3. **Extract price formatter**
           Move to src/utils/formatters.ts

        **Estimated effort:** Medium
        **Risk:** Low (presentational components, easy to test)

        Want me to implement any of these refactorings?
```

### Safe Refactoring Patterns

#### Pattern: Small, Verified Steps

Refactor incrementally with verification at each step:

```
You: Refactor CoinCard and CoinDetailCard to share code.
     Do it in small steps, verifying each one.

Claude: **Step 1: Extract shared styled components**

        Created src/components/shared/CoinStyles.ts:

        ```typescript
        import styled from 'styled-components';

        export const CardWrapper = styled.div`
          background: ${props => props.theme.colors.surface};
          border-radius: ${props => props.theme.borderRadius};
          padding: ${props => props.theme.spacing.md};
          border: 1px solid ${props => props.theme.colors.textMuted}20;
        `;

        export const CardTitle = styled.h3`
          margin: 0 0 ${props => props.theme.spacing.sm};
          color: ${props => props.theme.colors.primary};
        `;

        export const PriceBadge = styled.span`
          font-size: 1.25rem;
          font-weight: 600;
          color: ${props => props.theme.colors.accent};
        `;
        ```

        Updated CoinCard.tsx to import from shared:

        ```typescript
        import { CardWrapper, CardTitle, PriceBadge } from './shared/CoinStyles';
        ```

        **Verify:** Run the app and confirm CoinCard still looks correct.
        Then I'll update CoinDetailCard.
```

#### Pattern: Preserve Behavior First

Always verify existing behavior before refactoring:

```
You: Before refactoring the price formatting, show me where it's
     currently used and what the expected output is.

Claude: **Price Formatting Audit**

        **Current usage:**

        1. CoinCard.tsx:34
           ```typescript
           ${coin.price.toFixed(2)}  // e.g., $125.00
           ```

        2. CoinDetailCard.tsx:45
           ```typescript
           ${coin.price.toFixed(2)}  // Same format
           ```

        3. InventoryRow.tsx:28
           ```typescript
           ${coin.price.toFixed(2)}  // Same format
           ```

        **Expected behavior:**
        - Input: 125 → Output: "$125.00"
        - Input: 12.5 → Output: "$12.50"
        - Input: 0.99 → Output: "$0.99"

        All three locations use identical formatting. Safe to extract.

        **Proposed utility:**
        ```typescript
        export function formatPrice(price: number): string {
          return `$${price.toFixed(2)}`;
        }
        ```

        Want me to create this utility and update all usages?
```

#### Pattern: One Change Type at a Time

Don't mix different refactoring types:

```
You: I want to refactor this component to use hooks AND rename some variables
     AND add TypeScript types.

Claude: I'd recommend doing these separately:

        1. **First: Add TypeScript types**
           This catches issues before other changes

        2. **Second: Rename variables**
           Easier to verify with types in place

        3. **Third: Extract to hooks**
           Most complex change, saved for last

        Each step builds on the previous. If anything breaks,
        we know exactly which change caused it.

        Let's start with adding types. Here's what I propose...
```

### Common Refactoring Tasks

#### Extract Repeated Logic

```
You: I see the same fetch + error handling pattern in multiple places.
     Extract it to a reusable utility.

Claude: Found this pattern in 5 places:

        ```typescript
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error('Request failed');
          return await response.json();
        } catch (error) {
          console.error(error);
          throw error;
        }
        ```

        Creating src/utils/api.ts:

        ```typescript
        export async function fetchJson<T>(url: string): Promise<T> {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
          }
          return response.json();
        }

        export async function postJson<T>(url: string, data: unknown): Promise<T> {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
          }
          return response.json();
        }
        ```

        Now updating the 5 call sites to use these utilities...
```

#### Simplify Conditionals

```
You: This nested if-else is hard to follow. Simplify it.

Claude: Current code:

        ```typescript
        function getDisplayStatus(coin: Coin) {
          if (coin.quantity === 0) {
            return 'OUT';
          } else {
            if (coin.quantity < 5) {
              return 'LOW';
            } else {
              if (coin.quantity < 10) {
                return 'MEDIUM';
              } else {
                return 'GOOD';
              }
            }
          }
        }
        ```

        Refactored using early returns:

        ```typescript
        function getDisplayStatus(coin: Coin) {
          if (coin.quantity === 0) return 'OUT';
          if (coin.quantity < 5) return 'LOW';
          if (coin.quantity < 10) return 'MEDIUM';
          return 'GOOD';
        }
        ```

        Same logic, much clearer. Each condition is independent.
```

#### Improve Naming

```
You: Review the variable names in InventoryList.tsx.
     Are there any that could be clearer?

Claude: **Naming Review**

        Current names and suggestions:

        | Current | Issue | Suggested |
        |---------|-------|-----------|
        | `d` | Too short | `direction` |
        | `f` | Too short | `filter` or `stockFilter` |
        | `c` | In callback | `coin` (already used elsewhere) |
        | `data` | Vague | `inventoryData` or `coins` |
        | `res` | Abbreviation | `response` |

        The callback parameters in `.filter()` and `.map()` are
        the most impactful—they're read more than written:

        Before: `coins.filter(c => c.quantity < 5)`
        After:  `coins.filter(coin => coin.quantity < 5)`

        Want me to update these names?
```

## Practical Exercise: Debug and Refactor

Practice debugging and refactoring on Coins R Us.

### Part 1: Debugging

Introduce a bug and debug it:

1. In CoinCard.tsx, change:
   ```typescript
   onDelete?.(coin.id);
   ```
   to:
   ```typescript
   onDelete?.(id);  // id is undefined
   ```

2. Try to delete a coin—it won't work.

3. Ask Claude to investigate:
   ```
   "The delete button doesn't remove coins. The console shows no errors.
   Investigate and fix."
   ```

4. Observe how Claude traces the issue.

### Part 2: Refactoring

1. Ask Claude to identify refactoring opportunities:
   ```
   "What refactoring would improve code quality in the components folder?"
   ```

2. Choose one suggestion and implement it incrementally:
   ```
   "Implement [the suggestion] in small, verified steps."
   ```

3. After each step, verify the app still works.

### Reflect

- How did Claude's investigation compare to manual debugging?
- What refactoring opportunities did Claude find that you might have missed?
- How did incremental refactoring reduce risk?

## Key Takeaways

1. **Describe symptoms clearly**: Action, actual result, expected result
2. **Let Claude investigate**: It can trace code paths faster than you
3. **Verify before fixing**: Ensure the diagnosis matches your observations
4. **Refactor incrementally**: Small steps with verification
5. **Preserve behavior**: Test after each refactoring step
6. **One change at a time**: Don't mix different types of changes

## Glossary

- **Root Cause**: The underlying reason a bug occurs, not just the symptom
- **Stack Trace**: The sequence of function calls leading to an error
- **Refactoring**: Restructuring code without changing its behavior
- **Early Return**: Pattern of returning from a function as soon as possible to reduce nesting
- **Technical Debt**: Suboptimal code that works but costs time to maintain

---

In the next chapter, we'll explore iterative development—connecting the add form to the backend and handling the full CRUD lifecycle.
