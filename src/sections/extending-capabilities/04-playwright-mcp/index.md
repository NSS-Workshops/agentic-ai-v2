Playwright is a powerful browser automation framework that enables reliable end-to-end testing. The Playwright MCP server allows Claude Code to control browsers directly—writing tests, debugging issues, and automating repetitive browser tasks through natural conversation.

## What is Playwright?

Playwright is a browser automation library developed by Microsoft that:

- Controls **Chromium, Firefox, and WebKit** with a single API
- Provides **auto-waiting** for elements before interacting
- Supports **multiple browsers** running in parallel
- Enables **headless and headed** execution
- Works across **desktop and mobile** viewports

Combined with Claude Code, you can describe what you want to test and have it write and execute the tests for you.

## Setting Up Playwright MCP

### Prerequisites

**1. Playwright installed in your project**

```bash
npm install -D @playwright/test
npx playwright install  # Download browser binaries
```

**2. Basic Playwright config**

```javascript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
});
```

### MCP Configuration

Add the Playwright MCP server:

```json
// ~/.claude/mcp_servers.json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-playwright"]
    }
  }
}
```

### Verifying Setup

```
You: What Playwright tools are available?

Claude: I have access to these Playwright MCP tools:

        **Browser Control:**
        - browser_navigate: Go to a URL
        - browser_back: Navigate back
        - browser_forward: Navigate forward
        - browser_refresh: Reload page

        **Interaction:**
        - browser_click: Click an element
        - browser_type: Type into an input
        - browser_select: Select from dropdown
        - browser_check: Check/uncheck checkbox

        **Observation:**
        - browser_snapshot: Capture accessibility tree
        - browser_screenshot: Take a screenshot
        - browser_evaluate: Run JavaScript

        **Assertions:**
        - browser_assert_text: Check text content
        - browser_assert_visible: Check element visibility
```

## Basic Browser Automation

### Navigating Pages

```
You: Go to our app's login page and tell me what you see

Claude: I'll navigate to the login page.

        [Using tool: browser_navigate]
        URL: http://localhost:3000/login

        [Using tool: browser_snapshot]

        I can see the login page with:
        - Email input field
        - Password input field
        - "Remember me" checkbox
        - "Sign In" button
        - "Forgot password?" link
        - "Create account" link

        The page looks well-structured. Would you like me
        to test the login flow?
```

### Interacting with Elements

```
You: Fill in the login form with test@example.com and password123

Claude: I'll fill in the login form.

        [Using tool: browser_type]
        Selector: input[type="email"]
        Text: test@example.com

        [Using tool: browser_type]
        Selector: input[type="password"]
        Text: password123

        Form filled. Should I submit it?

You: Yes, click the sign in button

Claude: [Using tool: browser_click]
        Selector: button[type="submit"]

        [Using tool: browser_snapshot]

        Login successful! The page now shows:
        - Dashboard header
        - Welcome message: "Hello, Test User"
        - Navigation menu with Dashboard, Settings, Profile
```

### Taking Screenshots

```
You: Take a screenshot of the current page

Claude: [Using tool: browser_screenshot]
        Saved: screenshot-2024-01-15-143022.png

        Here's what the page looks like:
        [Screenshot embedded in response]

        The dashboard displays 4 stat cards and a recent
        activity table.
```

## Writing Playwright Tests

Beyond manual automation, Claude can write formal test files.

### Test Generation

```
You: Write a Playwright test for the login flow

Claude: I'll create a login test based on what I observed.

        Creating tests/auth/login.spec.ts:

        ```typescript
        import { test, expect } from '@playwright/test';

        test.describe('Login Flow', () => {
          test('should log in with valid credentials', async ({ page }) => {
            // Navigate to login page
            await page.goto('/login');

            // Fill in credentials
            await page.fill('input[type="email"]', 'test@example.com');
            await page.fill('input[type="password"]', 'password123');

            // Submit form
            await page.click('button[type="submit"]');

            // Verify successful login
            await expect(page).toHaveURL('/dashboard');
            await expect(page.locator('h1')).toContainText('Dashboard');
          });

          test('should show error with invalid credentials', async ({ page }) => {
            await page.goto('/login');

            await page.fill('input[type="email"]', 'wrong@example.com');
            await page.fill('input[type="password"]', 'wrongpassword');
            await page.click('button[type="submit"]');

            await expect(page.locator('.error-message')).toBeVisible();
            await expect(page.locator('.error-message')).toContainText('Invalid credentials');
          });

          test('should navigate to forgot password', async ({ page }) => {
            await page.goto('/login');

            await page.click('text=Forgot password?');

            await expect(page).toHaveURL('/forgot-password');
          });
        });
        ```

        Want me to run these tests?
```

### Running Tests

```
You: Run the login tests

Claude: I'll run the login tests.

        [Executing: npx playwright test tests/auth/login.spec.ts]

        Results:
        ✓ should log in with valid credentials (1.2s)
        ✓ should show error with invalid credentials (0.8s)
        ✓ should navigate to forgot password (0.6s)

        All 3 tests passed!
```

### Test Debugging

```
You: The login test is failing. Can you debug it?

Claude: Let me investigate the failing test.

        [Running test in headed mode with trace]

        [Using tool: browser_navigate]
        [Using tool: browser_snapshot]

        I found the issue! The email input has changed:
        - Expected: input[type="email"]
        - Actual: input[name="email"]

        The test selector needs updating. Here's the fix:

        ```diff
        - await page.fill('input[type="email"]', 'test@example.com');
        + await page.fill('input[name="email"]', 'test@example.com');
        ```

        Want me to apply this fix and rerun the test?
```

## Test Patterns with Playwright MCP

### Pattern: Explore Then Test

Use browser automation to explore, then generate tests:

```
You: I need tests for our checkout flow but I'm not sure
     what's involved. Can you explore it first?

Claude: I'll explore the checkout flow and document what I find.

        [Navigates through checkout]

        The checkout flow has 4 steps:
        1. Cart review - shows items, quantities, remove button
        2. Shipping - address form with validation
        3. Payment - card form (Stripe elements)
        4. Confirmation - order summary and confirmation number

        Based on this exploration, I recommend these tests:
        - Cart item management (add/remove/update quantity)
        - Shipping form validation
        - Payment error handling
        - Complete checkout happy path

        Should I generate these tests?
```

### Pattern: Visual Regression Testing

```
You: Add visual regression tests for the dashboard

Claude: I'll set up visual regression testing for the dashboard.

        First, I'll capture baseline screenshots:

        [Using tool: browser_navigate]
        [Using tool: browser_screenshot]
        Saved: tests/visual/dashboard.baseline.png

        Creating visual regression test:

        ```typescript
        import { test, expect } from '@playwright/test';

        test('dashboard visual regression', async ({ page }) => {
          await page.goto('/dashboard');

          // Wait for dynamic content to load
          await page.waitForSelector('.stats-loaded');

          await expect(page).toHaveScreenshot('dashboard.png', {
            maxDiffPixels: 100,
          });
        });
        ```

        Run with: npx playwright test --update-snapshots
        to establish baselines.
```

### Pattern: Data-Driven Tests

```
You: Create tests for form validation with multiple scenarios

Claude: I'll create data-driven tests for form validation.

        ```typescript
        import { test, expect } from '@playwright/test';

        const invalidEmails = [
          { input: 'notanemail', error: 'Please enter a valid email' },
          { input: 'missing@', error: 'Please enter a valid email' },
          { input: '@nodomain.com', error: 'Please enter a valid email' },
          { input: '', error: 'Email is required' },
        ];

        test.describe('Email Validation', () => {
          for (const { input, error } of invalidEmails) {
            test(`should reject "${input || '(empty)'}"`, async ({ page }) => {
              await page.goto('/register');

              if (input) {
                await page.fill('input[name="email"]', input);
              }
              await page.click('button[type="submit"]');

              await expect(page.locator('.email-error')).toContainText(error);
            });
          }
        });
        ```

        This generates 4 individual tests from the test data.
```

### Pattern: API + UI Testing

```
You: Test that creating a user via API shows in the UI

Claude: I'll combine API and UI testing.

        ```typescript
        import { test, expect } from '@playwright/test';

        test('user created via API appears in UI', async ({ page, request }) => {
          // Create user via API
          const response = await request.post('/api/users', {
            data: {
              name: 'Test User',
              email: 'apitest@example.com',
            },
          });
          expect(response.ok()).toBeTruthy();

          const user = await response.json();

          // Verify in UI
          await page.goto('/admin/users');
          await expect(page.locator(`[data-user-id="${user.id}"]`)).toBeVisible();
          await expect(page.locator(`[data-user-id="${user.id}"]`)).toContainText('Test User');

          // Cleanup
          await request.delete(`/api/users/${user.id}`);
        });
        ```
```

## Advanced Automation

### Handling Authentication

```
You: My tests need to be logged in. How should I handle auth?

Claude: There are several approaches. Let me show you the best one
        for your setup.

        **Recommended: Authentication State**

        First, create a setup file:

        ```typescript
        // tests/auth.setup.ts
        import { test as setup, expect } from '@playwright/test';

        const authFile = 'playwright/.auth/user.json';

        setup('authenticate', async ({ page }) => {
          await page.goto('/login');
          await page.fill('input[name="email"]', process.env.TEST_EMAIL!);
          await page.fill('input[name="password"]', process.env.TEST_PASSWORD!);
          await page.click('button[type="submit"]');

          await page.waitForURL('/dashboard');

          await page.context().storageState({ path: authFile });
        });
        ```

        Then configure Playwright:

        ```typescript
        // playwright.config.ts
        export default defineConfig({
          projects: [
            { name: 'setup', testMatch: /.*\.setup\.ts/ },
            {
              name: 'chromium',
              use: {
                storageState: 'playwright/.auth/user.json',
              },
              dependencies: ['setup'],
            },
          ],
        });
        ```

        All tests will now run authenticated!
```

### Testing Responsive Design

```
You: Test how the navigation works on mobile

Claude: I'll test the navigation across different viewports.

        [Using tool: browser_resize]
        Width: 375, Height: 667 (iPhone SE)

        [Using tool: browser_snapshot]

        On mobile, I see:
        - Hamburger menu (3 lines icon)
        - Logo only, no text
        - No visible nav links

        [Using tool: browser_click]
        Selector: .hamburger-menu

        After clicking hamburger:
        - Slide-out menu from left
        - All nav links visible
        - Close button (X)

        Creating responsive navigation tests:

        ```typescript
        test.describe('Mobile Navigation', () => {
          test.use({ viewport: { width: 375, height: 667 } });

          test('should show hamburger menu on mobile', async ({ page }) => {
            await page.goto('/');

            await expect(page.locator('.hamburger-menu')).toBeVisible();
            await expect(page.locator('nav.desktop')).not.toBeVisible();
          });

          test('should open mobile menu on hamburger click', async ({ page }) => {
            await page.goto('/');

            await page.click('.hamburger-menu');

            await expect(page.locator('.mobile-nav')).toBeVisible();
            await expect(page.locator('nav a')).toHaveCount(5);
          });
        });
        ```
```

### Debugging with Traces

```
You: A test is flaky. Help me debug it.

Claude: Let me enable tracing to capture what's happening.

        [Running with trace enabled]

        I captured a trace. Here's what I found:

        **Timeline:**
        1. Page navigates to /products (200ms)
        2. Click on "Add to Cart" (50ms)
        3. Wait for cart badge update (TIMEOUT after 5000ms)

        **Issue:**
        The cart badge updates via WebSocket, but the test
        isn't waiting for the WebSocket message.

        **Fix:**
        ```typescript
        // Instead of:
        await page.click('.add-to-cart');
        await expect(page.locator('.cart-badge')).toHaveText('1');

        // Use:
        await page.click('.add-to-cart');
        await page.waitForResponse(resp =>
          resp.url().includes('/api/cart') && resp.status() === 200
        );
        await expect(page.locator('.cart-badge')).toHaveText('1');
        ```

        This waits for the API response before checking the UI.
```

## Workflow Integration

### Test-Driven Development

```
You: I'm adding a search feature. Let's write the tests first.

Claude: Great approach! Let me write tests for the search feature.

        **Requirements I'll test:**
        1. Search input is visible on products page
        2. Typing filters products in real-time
        3. Empty results shows "No products found"
        4. Clear button resets the search
        5. Search works with URL query params

        Creating tests/products/search.spec.ts:

        ```typescript
        import { test, expect } from '@playwright/test';

        test.describe('Product Search', () => {
          test.beforeEach(async ({ page }) => {
            await page.goto('/products');
          });

          test('should display search input', async ({ page }) => {
            await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
          });

          test('should filter products while typing', async ({ page }) => {
            await page.fill('input[placeholder*="Search"]', 'widget');

            // Products should update
            await expect(page.locator('.product-card')).toHaveCount(2);
            await expect(page.locator('.product-card').first()).toContainText('Widget');
          });

          // ... more tests
        });
        ```

        Run these to see them fail, then implement the feature!
```

### CI Integration

```
You: How should I run Playwright tests in CI?

Claude: Here's a GitHub Actions workflow for Playwright:

        ```yaml
        # .github/workflows/playwright.yml
        name: Playwright Tests

        on:
          push:
            branches: [main]
          pull_request:
            branches: [main]

        jobs:
          test:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4

              - uses: actions/setup-node@v4
                with:
                  node-version: 18

              - name: Install dependencies
                run: npm ci

              - name: Install Playwright browsers
                run: npx playwright install --with-deps

              - name: Run Playwright tests
                run: npx playwright test

              - uses: actions/upload-artifact@v4
                if: always()
                with:
                  name: playwright-report
                  path: playwright-report/
        ```

        The test report uploads as an artifact on failure.
```

## Practical Exercise: Testing a Feature

Practice writing tests with Playwright MCP.

### Exercise Goal

Create end-to-end tests for a todo list feature.

### Step-by-Step

**Step 1: Explore the feature**

```
You: Navigate to /todos and show me what's there
```

**Step 2: Write happy path test**

```
You: Write a test for adding a new todo
```

**Step 3: Add edge cases**

```
You: Add tests for:
     - Empty todo validation
     - Completing a todo
     - Deleting a todo
```

**Step 4: Run and fix**

```
You: Run the tests and fix any failures
```

### Reflect

- How did browser automation help understand the feature?
- What would you have missed without visual exploration?
- Where did Claude's test suggestions improve coverage?

## Key Takeaways

1. **Browser control is conversational**: Describe what you want, Claude executes
2. **Exploration aids testing**: Use automation to understand before writing tests
3. **Test generation is fast**: Claude writes tests based on what it observes
4. **Debugging is visual**: Screenshots and traces help identify issues
5. **Integration is straightforward**: Tests fit into CI/CD pipelines

## Glossary

- **Playwright**: Microsoft's browser automation framework
- **Selector**: A string that identifies elements on a page (CSS, XPath, text)
- **Assertion**: A check that verifies expected behavior
- **Trace**: A detailed recording of test execution for debugging
- **Viewport**: The visible area of a web page at a specific size

---

In the next chapter, we'll explore additional MCP integrations—GitHub, Memory, and other tools that extend Claude Code's capabilities even further.
