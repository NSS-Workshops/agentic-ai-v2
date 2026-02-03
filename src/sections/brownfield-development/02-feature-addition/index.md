After analyzing a codebase, the next step is adding new functionality. This chapter guides you through adding a complete feature to Coins R Us—an inventory view that displays stock levels and low-stock alerts.

## The Feature Request

Here's what we need to build:

> **Inventory View**: A new page showing all coins with their quantities, highlighting items that are low in stock (quantity < 5). Include filtering by stock status and sorting by quantity.

This is a realistic feature that touches multiple parts of the codebase:
- New page component
- Data fetching
- Filtering logic
- Styling consistent with existing design
- Navigation integration

## Approach: Explore-Plan-Implement

For any non-trivial feature, use the Explore-Plan-Implement workflow:

1. **Explore**: Understand existing patterns
2. **Plan**: Design the implementation approach
3. **Implement**: Build incrementally with verification

### Phase 1: Explore Existing Patterns

Before writing code, understand how similar features work:

```
You: I need to add a new page to this Next.js app. Show me how existing
     pages are structured—the coins listing page specifically.

Claude: [Reads src/app/coins/page.tsx]

        **Page Structure Analysis**

        The coins page follows this pattern:

        ```typescript
        // Server Component (default in App Router)
        export default async function CoinsPage() {
          // 1. Data fetching at top level
          const response = await fetch('http://localhost:3001/coins');
          const coins: Coin[] = await response.json();

          // 2. Render with client components
          return (
            <PageWrapper>
              <PageTitle>Our Collection</PageTitle>
              <CoinList coins={coins} />
            </PageWrapper>
          );
        }
        ```

        **Key Patterns:**
        - Server components for data fetching
        - Client components for interactivity
        - Styled Components (PageWrapper, PageTitle)
        - Types imported from @/types

        **File locations:**
        - Pages go in src/app/[route]/page.tsx
        - Components go in src/components/
        - Styles use Styled Components, co-located
```

Continue exploring to understand the styling system:

```
You: Show me how the existing styled components work. What theme
     variables are available?

Claude: [Reads styles/theme.ts and examples]

        **Theme System**

        The app uses a simple theme object:

        ```typescript
        const theme = {
          colors: {
            primary: '#1a365d',
            secondary: '#2d3748',
            accent: '#ed8936',
            success: '#48bb78',
            warning: '#ecc94b',
            danger: '#f56565',
            background: '#f7fafc',
            surface: '#ffffff',
            text: '#2d3748',
            textMuted: '#718096',
          },
          spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px',
          },
          borderRadius: '8px',
        };
        ```

        **Usage Pattern:**
        ```typescript
        const Card = styled.div`
          background: ${props => props.theme.colors.surface};
          padding: ${props => props.theme.spacing.md};
          border-radius: ${props => props.theme.borderRadius};
        `;
        ```

        Good news: `warning` and `danger` colors are already
        defined—perfect for low stock indicators.
```

### Phase 2: Plan the Implementation

Now ask Claude to help plan:

```
You: Plan the implementation for an inventory view page. It should:
     - Show all coins with quantities
     - Highlight low stock (< 5) items
     - Allow filtering by stock status
     - Sort by quantity

     Use the existing patterns you found.

Claude: **Implementation Plan: Inventory View**

        **Files to Create:**

        1. `src/app/inventory/page.tsx`
           - Server component for data fetching
           - Passes coins to client component

        2. `src/components/InventoryList.tsx`
           - Client component for interactivity
           - Filter state management
           - Sorting logic

        3. `src/components/InventoryRow.tsx`
           - Individual coin row
           - Stock status indicator
           - Conditional styling

        **Implementation Order:**

        1. Create basic page with data fetching
        2. Build InventoryRow with status styling
        3. Build InventoryList with mapping
        4. Add filter controls
        5. Add sorting
        6. Add navigation link

        **Design Decisions:**
        - Use table layout (different from card grid)
        - Stock status: Good (5+), Low (1-4), Out (0)
        - Default sort: Low stock first (highlight problems)

        Ready to implement?
```

### Phase 3: Implement Incrementally

Build the feature step by step, verifying as you go.

#### Step 1: Create the Basic Page

```
You: Create the inventory page with basic data fetching. No filtering
     yet—just display coins in a table with quantities.

Claude: [Creates src/app/inventory/page.tsx]

        Created src/app/inventory/page.tsx:

        ```typescript
        import { Coin } from '@/types';
        import InventoryList from '@/components/InventoryList';
        import { PageWrapper, PageTitle } from '@/styles/shared';

        async function getCoins(): Promise<Coin[]> {
          const response = await fetch('http://localhost:3001/coins', {
            cache: 'no-store'
          });
          return response.json();
        }

        export default async function InventoryPage() {
          const coins = await getCoins();

          return (
            <PageWrapper>
              <PageTitle>Inventory</PageTitle>
              <InventoryList coins={coins} />
            </PageWrapper>
          );
        }
        ```

        The page uses the same patterns as the existing coins page.
        I set `cache: 'no-store'` for inventory data since stock
        levels should always be fresh.

        Now I need to create the InventoryList component.
```

#### Step 2: Build the Components

```
You: Create the InventoryList and InventoryRow components.

Claude: [Creates both components]

        Created src/components/InventoryRow.tsx:

        ```typescript
        'use client';

        import styled from 'styled-components';
        import { Coin } from '@/types';

        interface InventoryRowProps {
          coin: Coin;
        }

        const Row = styled.tr<{ $stockStatus: 'good' | 'low' | 'out' }>`
          background: ${props => {
            switch (props.$stockStatus) {
              case 'out': return props.theme.colors.danger + '20';
              case 'low': return props.theme.colors.warning + '20';
              default: return 'transparent';
            }
          }};
        `;

        const StatusBadge = styled.span<{ $status: string }>`
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          background: ${props => {
            switch (props.$status) {
              case 'out': return props.theme.colors.danger;
              case 'low': return props.theme.colors.warning;
              default: return props.theme.colors.success;
            }
          }};
          color: white;
        `;

        function getStockStatus(quantity: number) {
          if (quantity === 0) return 'out';
          if (quantity < 5) return 'low';
          return 'good';
        }

        export default function InventoryRow({ coin }: InventoryRowProps) {
          const status = getStockStatus(coin.quantity);

          return (
            <Row $stockStatus={status}>
              <td>{coin.denomination}</td>
              <td>{coin.year}</td>
              <td>{coin.condition}</td>
              <td>${coin.price.toFixed(2)}</td>
              <td>{coin.quantity}</td>
              <td>
                <StatusBadge $status={status}>
                  {status === 'out' ? 'OUT OF STOCK' :
                   status === 'low' ? 'LOW STOCK' : 'IN STOCK'}
                </StatusBadge>
              </td>
            </Row>
          );
        }
        ```

        Created src/components/InventoryList.tsx:

        ```typescript
        'use client';

        import styled from 'styled-components';
        import { Coin } from '@/types';
        import InventoryRow from './InventoryRow';

        interface InventoryListProps {
          coins: Coin[];
        }

        const Table = styled.table`
          width: 100%;
          border-collapse: collapse;

          th, td {
            padding: ${props => props.theme.spacing.sm};
            text-align: left;
            border-bottom: 1px solid ${props => props.theme.colors.textMuted}30;
          }

          th {
            font-weight: 600;
            color: ${props => props.theme.colors.primary};
          }
        `;

        export default function InventoryList({ coins }: InventoryListProps) {
          return (
            <Table>
              <thead>
                <tr>
                  <th>Denomination</th>
                  <th>Year</th>
                  <th>Condition</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {coins.map(coin => (
                  <InventoryRow key={coin.id} coin={coin} />
                ))}
              </tbody>
            </Table>
          );
        }
        ```

        Both components follow existing patterns:
        - 'use client' directive for interactivity
        - Theme colors for consistency
        - Transient props ($prefix) to avoid DOM warnings
```

#### Step 3: Verify Before Continuing

Before adding more features, verify the basic implementation works:

```
You: Let's verify this works. What commands do I need to run to test it?

Claude: To test the inventory page:

        1. Start the backend (if not running):
           ```bash
           npx json-server --watch data/database.json --port 3001
           ```

        2. Start the Next.js dev server:
           ```bash
           npm run dev
           ```

        3. Visit http://localhost:3000/inventory

        You should see:
        - Page title "Inventory"
        - Table with all coins
        - Stock status badges
        - Row highlighting for low/out items

        Let me know what you see and if there are any issues.
```

This verification step is crucial. Don't pile on features before confirming the foundation works.

#### Step 4: Add Filtering

Once the basic page works, add filtering:

```
You: The basic page works. Now add filter buttons for:
     All, In Stock, Low Stock, Out of Stock

Claude: [Updates InventoryList.tsx]

        Updated src/components/InventoryList.tsx with filtering:

        ```typescript
        'use client';

        import { useState } from 'react';
        import styled from 'styled-components';
        import { Coin } from '@/types';
        import InventoryRow from './InventoryRow';

        type StockFilter = 'all' | 'good' | 'low' | 'out';

        const FilterBar = styled.div`
          display: flex;
          gap: ${props => props.theme.spacing.sm};
          margin-bottom: ${props => props.theme.spacing.lg};
        `;

        const FilterButton = styled.button<{ $active: boolean }>`
          padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
          border: none;
          border-radius: ${props => props.theme.borderRadius};
          background: ${props => props.$active
            ? props.theme.colors.primary
            : props.theme.colors.surface};
          color: ${props => props.$active ? 'white' : props.theme.colors.text};
          cursor: pointer;
          font-weight: ${props => props.$active ? '600' : '400'};

          &:hover {
            opacity: 0.8;
          }
        `;

        function getStockStatus(quantity: number) {
          if (quantity === 0) return 'out';
          if (quantity < 5) return 'low';
          return 'good';
        }

        export default function InventoryList({ coins }: InventoryListProps) {
          const [filter, setFilter] = useState<StockFilter>('all');

          const filteredCoins = coins.filter(coin => {
            if (filter === 'all') return true;
            return getStockStatus(coin.quantity) === filter;
          });

          return (
            <>
              <FilterBar>
                <FilterButton
                  $active={filter === 'all'}
                  onClick={() => setFilter('all')}
                >
                  All ({coins.length})
                </FilterButton>
                <FilterButton
                  $active={filter === 'good'}
                  onClick={() => setFilter('good')}
                >
                  In Stock ({coins.filter(c => getStockStatus(c.quantity) === 'good').length})
                </FilterButton>
                <FilterButton
                  $active={filter === 'low'}
                  onClick={() => setFilter('low')}
                >
                  Low Stock ({coins.filter(c => getStockStatus(c.quantity) === 'low').length})
                </FilterButton>
                <FilterButton
                  $active={filter === 'out'}
                  onClick={() => setFilter('out')}
                >
                  Out of Stock ({coins.filter(c => getStockStatus(c.quantity) === 'out').length})
                </FilterButton>
              </FilterBar>

              <Table>
                {/* ... table content ... */}
                <tbody>
                  {filteredCoins.map(coin => (
                    <InventoryRow key={coin.id} coin={coin} />
                  ))}
                </tbody>
              </Table>
            </>
          );
        }
        ```

        The filter shows counts in each button so you can see
        the inventory distribution at a glance.
```

#### Step 5: Add Sorting

```
You: Add sorting by quantity. Click the Quantity header to toggle
     ascending/descending.

Claude: [Updates with sorting]

        Added sorting to InventoryList.tsx:

        ```typescript
        const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

        const sortedCoins = [...filteredCoins].sort((a, b) => {
          return sortDirection === 'asc'
            ? a.quantity - b.quantity
            : b.quantity - a.quantity;
        });

        // In the table header:
        <th
          onClick={() => setSortDirection(d => d === 'asc' ? 'desc' : 'asc')}
          style={{ cursor: 'pointer' }}
        >
          Quantity {sortDirection === 'asc' ? '↑' : '↓'}
        </th>
        ```

        Default is ascending (lowest first) to highlight items
        that need attention.
```

#### Step 6: Add Navigation

Finally, integrate with the app's navigation:

```
You: Add a link to the inventory page in the main navigation.

Claude: [Finds and updates navigation component]

        Found navigation in src/components/Header.tsx

        Added inventory link:

        ```typescript
        <NavLink href="/inventory">Inventory</NavLink>
        ```

        The inventory page is now accessible from the header navigation.
```

## Patterns for Feature Addition

### Pattern: Match Existing Conventions

When Claude creates code, explicitly ask it to match existing patterns:

```
You: Create a [feature] following the same patterns used in [existing similar feature].
```

This produces more consistent code than generic implementations.

### Pattern: Incremental Building

Build features in layers:

1. **Skeleton**: Basic structure, no logic
2. **Core functionality**: Main feature works
3. **Polish**: Error handling, edge cases, styling refinement
4. **Integration**: Connect to rest of app

Verify at each layer before proceeding.

### Pattern: Explicit Verification Points

Tell Claude when you want to pause and verify:

```
You: Build the basic table display. Stop there so I can verify
     it works before we add filtering.
```

This prevents Claude from building a complex feature that has issues at the foundation.

### Pattern: Handle Edge Cases

After the main feature works, address edge cases:

```
You: What happens if there are no coins in the database?
     Add an empty state.

Claude: Good catch. Adding empty state handling:

        ```typescript
        if (coins.length === 0) {
          return (
            <EmptyState>
              <EmptyIcon>📦</EmptyIcon>
              <EmptyText>No coins in inventory</EmptyText>
            </EmptyState>
          );
        }
        ```
```

## Practical Exercise: Add Inventory Feature

Practice adding this feature yourself.

### Setup

1. Navigate to the coins-r-us directory
2. Ensure json-server is running on port 3001
3. Start the Next.js dev server
4. Open Claude Code

### Exercise Steps

**Part 1: Explore**

```
"Show me how pages and components are structured in this codebase.
I need to add a new page."
```

**Part 2: Plan**

```
"Plan an inventory page that shows coins with quantities,
highlights low stock items, and allows filtering."
```

**Part 3: Build Incrementally**

```
"Create the basic inventory page. Just data fetching and display—
no filtering yet."
```

Verify it works, then:

```
"Add the stock status indicators—green for in stock,
yellow for low (< 5), red for out."
```

Verify, then:

```
"Add filter buttons for All, In Stock, Low Stock, Out of Stock."
```

**Part 4: Polish**

```
"Add sorting by quantity and an empty state."
```

**Part 5: Integrate**

```
"Add a navigation link to the inventory page."
```

### Reflect

After completing the exercise:
- How did the incremental approach help?
- What would have been harder without exploring first?
- Did Claude match the existing code patterns?

## Common Mistakes

### Mistake: Starting Without Exploring

**Problem**: Jumping into implementation without understanding existing patterns leads to inconsistent code.

**Solution**: Always explore first, even if you think you know the codebase.

### Mistake: Building Too Much at Once

**Problem**: Implementing the entire feature before testing any of it makes debugging difficult.

**Solution**: Build incrementally with verification points.

### Mistake: Ignoring Context

**Problem**: Generic prompts like "add a table" produce generic code that doesn't match your codebase.

**Solution**: Reference existing code: "add a table like the one in CoinList."

### Mistake: Not Testing Edge Cases

**Problem**: Features work for happy path but break with empty data, errors, or unusual inputs.

**Solution**: Explicitly ask Claude about edge cases after the main feature works.

## Key Takeaways

1. **Explore first**: Understand patterns before implementing
2. **Plan the approach**: Design before coding
3. **Build incrementally**: Verify each layer before adding more
4. **Match conventions**: Reference existing code for consistency
5. **Handle edges**: Empty states, errors, unusual data
6. **Test continuously**: Verify frequently during development

## Glossary

- **Server Component**: React component that renders on the server, can fetch data directly
- **Client Component**: React component that runs in the browser, handles interactivity
- **Transient Props**: Styled-components pattern using $ prefix to prevent DOM warnings
- **Empty State**: UI shown when there's no data to display
- **Filter**: UI control to show subset of data matching criteria

---

In the next chapter, we'll explore debugging and refactoring—using Claude Code to find and fix problems in existing code.
