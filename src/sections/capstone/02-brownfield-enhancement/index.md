This second capstone project tests your brownfield development skills. Instead of starting fresh, you'll enhance an existing codebase—applying analysis, feature addition, debugging, and refactoring skills with Claude Code.

## Project Overview

You will enhance **Coins R Us** with a complete **Shopping Cart** feature. This involves:
- Adding items to a cart
- Managing cart quantities
- Calculating totals
- Processing checkout
- Recording orders

### Why This Project?

This project is chosen because it:
- Requires understanding existing code first
- Adds significant functionality across multiple layers
- Involves state management challenges
- Requires backend integration
- Tests your brownfield skills in a realistic scenario

### Core Requirements

**Must Have:**
- Add coins to a shopping cart
- View cart with item list and quantities
- Update quantities in cart
- Remove items from cart
- Calculate cart total
- Checkout to create an order

**Nice to Have (stretch goals):**
- Persist cart in localStorage
- Order confirmation page
- Order history view
- Apply quantity limits (can't order more than in stock)

## Getting Started

### Step 1: Analyze the Existing Codebase

Before adding anything, understand what exists:

```
You: I need to add a shopping cart to Coins R Us. Before I start,
     help me understand the current codebase. What components exist?
     How is state managed? Where do API calls happen?

Claude: [Analyzes the codebase]

        **Codebase Analysis for Shopping Cart**

        **Current Architecture:**
        - Next.js 15 with App Router
        - Server components for data fetching
        - Client components for interactivity
        - json-server backend on port 3001

        **Existing Components:**
        - CoinCard - displays individual coins
        - CoinList - renders coin collection
        - Header - navigation
        - InventoryList/InventoryRow - inventory view

        **State Management:**
        - No global state management
        - Props passed from server components
        - Local state in client components

        **API Integration:**
        - Direct fetch calls in server components
        - Client-side fetches for mutations

        **Data Model:**
        - Coins with id, denomination, year, condition, price, quantity
        - Users (but not used in UI)
        - Orders (exists but incomplete)

        **For Shopping Cart, you'll need:**
        1. Cart state management (global, client-side)
        2. CartProvider context
        3. Add to cart button on CoinCard
        4. Cart page/drawer
        5. Checkout API integration

        Where would you like to start?
```

### Step 2: Plan the Enhancement

Design the feature before implementing:

```
You: Let's plan the shopping cart implementation. I want a cart icon
     in the header, ability to add coins from the listing, a cart page
     to manage items, and checkout that creates an order.

Claude: **Shopping Cart Implementation Plan**

        **New Files:**

        1. `src/context/CartContext.tsx`
           - CartProvider component
           - useCart hook
           - Cart state: items, add, remove, update, clear

        2. `src/components/CartIcon.tsx`
           - Shows cart item count
           - Links to cart page

        3. `src/components/AddToCartButton.tsx`
           - Button for CoinCard
           - Shows quantity selector if already in cart

        4. `src/app/cart/page.tsx`
           - Cart page with items list
           - Quantity controls
           - Remove buttons
           - Total calculation
           - Checkout button

        5. `src/components/CartItem.tsx`
           - Individual cart item row
           - Quantity controls
           - Remove button

        **Modified Files:**

        1. `src/components/CoinCard.tsx`
           - Add AddToCartButton

        2. `src/components/Header.tsx`
           - Add CartIcon

        3. `src/app/layout.tsx`
           - Wrap with CartProvider

        **Backend Changes:**

        1. `data/database.json`
           - Ensure orders collection exists

        **Cart Item Shape:**
        ```typescript
        interface CartItem {
          coinId: string;
          coin: Coin;
          quantity: number;
        }
        ```

        **Implementation Order:**
        1. CartContext with basic state
        2. AddToCartButton on CoinCard
        3. CartIcon in Header
        4. Cart page with items display
        5. Quantity controls
        6. Checkout functionality

        Ready to start with CartContext?
```

### Step 3: Build Incrementally

Apply iterative development:

**Iteration 1: Cart Context**
```
"Create the CartContext with state for items and functions to add,
remove, and update quantities. No UI yet."
```

**Iteration 2: Add to Cart**
```
"Add an 'Add to Cart' button to CoinCard. When clicked, add the coin
to the cart. The button should show if it's already in cart."
```

**Iteration 3: Cart Icon**
```
"Add a cart icon to the Header that shows the number of items in cart.
Link it to /cart."
```

**Iteration 4: Cart Page**
```
"Create the cart page. Display all items with quantity, price,
and line total. Show the cart total at the bottom."
```

**Iteration 5: Quantity Controls**
```
"Add + and - buttons to adjust quantities. Add a remove button.
Enforce minimum quantity of 1 (remove instead of going to 0)."
```

**Iteration 6: Checkout**
```
"Add a checkout button that creates an order via POST to /orders.
The order should include items, total, and date. Clear cart after."
```

## Technical Challenges

### Challenge: Global State in Next.js App Router

The shopping cart needs client-side state that persists across pages:

```typescript
// src/context/CartContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CartContextType {
  items: CartItem[];
  addItem: (coin: Coin) => void;
  removeItem: (coinId: string) => void;
  updateQuantity: (coinId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (coin: Coin) => {
    setItems(prev => {
      const existing = prev.find(item => item.coinId === coin.id);
      if (existing) {
        return prev.map(item =>
          item.coinId === coin.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { coinId: coin.id, coin, quantity: 1 }];
    });
  };

  // ... other functions

  const total = items.reduce(
    (sum, item) => sum + item.coin.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
```

### Challenge: Client Component in Server Layout

The CartProvider is a client component that wraps the layout:

```typescript
// src/app/layout.tsx
import { CartProvider } from '@/context/CartContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
```

### Challenge: Stock Validation

For the stretch goal—ensure users can't order more than available:

```typescript
const addItem = (coin: Coin) => {
  setItems(prev => {
    const existing = prev.find(item => item.coinId === coin.id);
    const currentQty = existing?.quantity ?? 0;

    if (currentQty >= coin.quantity) {
      // Already at max
      return prev;
    }

    if (existing) {
      return prev.map(item =>
        item.coinId === coin.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }
    return [...prev, { coinId: coin.id, coin, quantity: 1 }];
  });
};
```

## Development Guidelines

### Follow Existing Patterns

The codebase already has established patterns. Ask Claude to identify and follow them:

```
"What styling patterns are used in existing components?
I want the cart components to match."
```

```
"How are API calls structured elsewhere? I want checkout
to follow the same pattern."
```

### Test as You Go

After each iteration:
1. Add a coin to cart—does the count update?
2. Navigate away and back—is the cart preserved?
3. Refresh the page—cart will clear (expected without persistence)
4. Complete checkout—does the order appear in database.json?

### Handle Edge Cases

- Empty cart display
- Very long coin descriptions
- Maximum quantities
- Checkout with empty cart
- API errors during checkout

## Evaluation Criteria

### Codebase Analysis (20%)
- Demonstrated understanding of existing code
- Identified relevant patterns
- Created appropriate CLAUDE.md additions

### Implementation Quality (40%)
- All core requirements working
- Consistent with existing codebase
- Proper TypeScript usage
- Error handling

### Iterative Development (20%)
- Evidence of incremental building
- Verification at each step
- Appropriate refactoring

### AI Collaboration (20%)
- Effective prompts
- Good course correction
- Appropriate intervention

### Bonus Points
- Stretch goals implemented
- Particularly clean integration
- Creative solutions

## Submission Requirements

Prepare the following for presentation:

1. **Working Feature**
   - Add coins to cart
   - Manage cart items
   - Complete checkout

2. **Code Changes**
   - List of files added/modified
   - Brief explanation of approach

3. **Demo Walkthrough**
   - Full user journey: browse → add → cart → checkout
   - Show order in database.json

4. **Reflection**
   - What was challenging about brownfield development?
   - How did analyzing first help?
   - One thing you'd do differently

## Tips for Success

### Do
- Spend time understanding before coding
- Follow existing patterns religiously
- Test each piece before moving on
- Keep context focused (one feature at a time)

### Don't
- Refactor unrelated code
- Introduce new patterns unnecessarily
- Skip the analysis phase
- Build the whole cart at once

### Common Pitfalls

**Pitfall: Context not wrapping properly**
- Ensure CartProvider is in layout.tsx
- Ensure 'use client' directive is present

**Pitfall: Hydration errors**
- Client state (cart) won't match server initial render
- This is expected—cart starts empty on server

**Pitfall: Cart clearing on navigation**
- This happens if CartProvider isn't in layout
- Or if you're accidentally recreating it

**Pitfall: Order not persisting**
- Check json-server console for errors
- Ensure Content-Type header is set
- Verify order shape matches expected format

## Getting Help

If stuck on integration issues:
1. Ask Claude to trace the data flow
2. Check console for errors
3. Verify the API request in Network tab
4. Compare to existing patterns in the codebase

Remember: brownfield work requires patience. Understanding existing code takes time, but it prevents integration headaches later.

---

This project demonstrates that you can contribute meaningfully to existing codebases using AI assistance—a crucial skill for professional development.
