Shadcn/UI is a popular component library that provides beautifully designed, accessible components you can copy into your project. The Shadcn MCP server lets Claude Code add and customize these components directly, making UI development faster and more conversational.

## What is Shadcn/UI?

Unlike traditional component libraries that you install as npm packages, Shadcn/UI takes a different approach:

- Components are **copied into your project**, not installed as dependencies
- You **own the code** and can modify it freely
- Built on **Radix UI primitives** for accessibility
- Styled with **Tailwind CSS** for consistency

This model works perfectly with AI assistance—Claude can not only add components but customize them to fit your needs.

## Setting Up Shadcn MCP

### Prerequisites

Before configuring the MCP server, ensure your project is set up for Shadcn/UI:

**1. Tailwind CSS configured**

```javascript
// tailwind.config.js should exist with content paths
```

**2. Path aliases set up**

```javascript
// tsconfig.json or jsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**3. Shadcn initialized**

If you haven't already:
```bash
npx shadcn-ui@latest init
```

This creates the `components.json` configuration file.

### MCP Configuration

Add the Shadcn MCP server to your configuration:

```json
// ~/.claude/mcp_servers.json
{
  "mcpServers": {
    "shadcn-ui": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-shadcn-ui"]
    }
  }
}
```

### Verifying Setup

After configuring, restart Claude Code and verify:

```
You: What shadcn-ui tools are available?

Claude: I have access to these shadcn-ui MCP tools:

        - add_component: Add a new component to your project
        - list_components: Show available components
        - show_component: Display a component's source code
        - update_component: Update an existing component

        Would you like to add a component?
```

## Adding Components

The most common operation is adding components to your project.

### Basic Component Addition

```
You: Add a Button component

Claude: I'll add the Button component to your project.

        [Using tool: add_component]
        Component: button

        ✓ Button component added successfully!

        Created: src/components/ui/button.tsx

        Example usage:
        ```tsx
        import { Button } from "@/components/ui/button"

        <Button variant="default">Click me</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="destructive">Delete</Button>
        ```

        Would you like me to add this to a specific file?
```

### Adding Multiple Components

```
You: Add Card, Input, and Label components for a form

Claude: I'll add all three components.

        [Using tool: add_component] × 3

        ✓ Card component added
        ✓ Input component added
        ✓ Label component added

        Files created:
        - src/components/ui/card.tsx
        - src/components/ui/input.tsx
        - src/components/ui/label.tsx

        Here's how they work together:
        ```tsx
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" />
          </CardContent>
        </Card>
        ```
```

### Adding with Context

Claude can determine what components you need:

```
You: I need to build a data table with sorting and pagination

Claude: For a data table with those features, you'll need several
        components. Let me add them:

        [Using tool: add_component] × 5

        ✓ Table - base table structure
        ✓ Button - for sort buttons and pagination
        ✓ Select - for page size selection
        ✓ DropdownMenu - for column actions
        ✓ Badge - for status indicators

        Would you like me to create a DataTable component that
        combines these?
```

## Customizing Components

Shadcn components are yours to modify. Claude can help customize them.

### Variant Customization

```
You: Modify the Button component to add a "success" variant

Claude: I'll add a success variant to your Button component.

        [Reading src/components/ui/button.tsx]
        [Editing src/components/ui/button.tsx]

        Added success variant:
        ```tsx
        const buttonVariants = cva(
          // ... existing styles
          {
            variants: {
              variant: {
                default: "...",
                destructive: "...",
                outline: "...",
                secondary: "...",
                ghost: "...",
                link: "...",
                success: "bg-green-600 text-white hover:bg-green-700",
              },
              // ...
            },
          }
        )
        ```

        Usage:
        ```tsx
        <Button variant="success">Save Changes</Button>
        ```
```

### Style Customization

```
You: Update the Card component to match our brand colors

Claude: I'll update the Card to use your brand colors.

        What are your brand colors? Or should I read them from
        your Tailwind config?

You: Primary is #1a365d, secondary is #2d3748

Claude: [Editing src/components/ui/card.tsx]

        Updated Card with brand colors:
        - Card background now uses your secondary (#2d3748)
        - CardHeader uses your primary (#1a365d)
        - Added custom CSS variables for consistency

        I also added these to your tailwind.config.js for reuse:
        ```javascript
        colors: {
          brand: {
            primary: '#1a365d',
            secondary: '#2d3748',
          }
        }
        ```
```

### Extending Functionality

```
You: Add a loading state to the Button component

Claude: I'll extend Button to support a loading state.

        [Editing src/components/ui/button.tsx]

        Changes made:
        1. Added `loading` prop
        2. Shows spinner when loading
        3. Disables button during loading
        4. Maintains width to prevent layout shift

        ```tsx
        interface ButtonProps extends ... {
          loading?: boolean
        }

        <Button loading={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
        ```

        Added a Loader2 icon from lucide-react for the spinner.
```

## Building with Components

Beyond adding components, Claude can help you build interfaces.

### Creating Compositions

```
You: Build a user profile card with avatar, name, email,
     and action buttons

Claude: I'll create a UserProfileCard using shadcn components.

        First, let me ensure we have all needed components:
        [Checking: Card ✓, Avatar ✓, Button ✓]

        Creating src/components/UserProfileCard.tsx:

        ```tsx
        import { Card, CardContent, CardFooter } from "@/components/ui/card"
        import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
        import { Button } from "@/components/ui/button"

        interface UserProfileCardProps {
          user: {
            name: string
            email: string
            avatarUrl?: string
          }
          onEdit?: () => void
          onMessage?: () => void
        }

        export function UserProfileCard({ user, onEdit, onMessage }: UserProfileCardProps) {
          return (
            <Card className="w-[350px]">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onMessage}>Message</Button>
                <Button onClick={onEdit}>Edit</Button>
              </CardFooter>
            </Card>
          )
        }
        ```

        Ready to use!
```

### Creating Forms

```
You: Create a contact form with name, email, message, and submit

Claude: I'll create a ContactForm using shadcn form components.

        Components needed:
        [Adding: Form, Input, Textarea, Button, Label]

        Creating src/components/ContactForm.tsx:

        ```tsx
        "use client"

        import { useState } from "react"
        import { Button } from "@/components/ui/button"
        import { Input } from "@/components/ui/input"
        import { Label } from "@/components/ui/label"
        import { Textarea } from "@/components/ui/textarea"
        import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

        export function ContactForm() {
          const [loading, setLoading] = useState(false)

          async function onSubmit(e: React.FormEvent) {
            e.preventDefault()
            setLoading(true)
            // Handle submission
            setLoading(false)
          }

          return (
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )
        }
        ```
```

## Available Components

Shadcn/UI provides a comprehensive set of components:

### Layout Components

| Component | Description |
|-----------|-------------|
| Card | Container for related content |
| Separator | Visual divider |
| ScrollArea | Custom scrollable container |
| Collapsible | Expandable/collapsible content |
| Resizable | Resizable panels |

### Form Components

| Component | Description |
|-----------|-------------|
| Button | Clickable button with variants |
| Input | Text input field |
| Textarea | Multi-line text input |
| Select | Dropdown selection |
| Checkbox | Boolean selection |
| RadioGroup | Single selection from options |
| Switch | Toggle control |
| Slider | Range selection |
| Form | Form with validation (react-hook-form) |

### Display Components

| Component | Description |
|-----------|-------------|
| Avatar | User image with fallback |
| Badge | Status indicator |
| Alert | Notification banner |
| Progress | Progress indicator |
| Skeleton | Loading placeholder |
| Table | Data table |

### Overlay Components

| Component | Description |
|-----------|-------------|
| Dialog | Modal dialog |
| Sheet | Slide-out panel |
| Popover | Floating content |
| Tooltip | Hover information |
| DropdownMenu | Context menu |
| ContextMenu | Right-click menu |
| AlertDialog | Confirmation dialog |

### Navigation Components

| Component | Description |
|-----------|-------------|
| Tabs | Tabbed navigation |
| NavigationMenu | Site navigation |
| Breadcrumb | Location trail |
| Pagination | Page navigation |
| Command | Command palette |

## Workflow Patterns

### Pattern: Component-First Development

Start with UI, then add logic:

```
You: I'm building a settings page. Let's start with the UI.

Claude: I'll help you build the settings UI. What sections
        do you need?

You: Profile settings, notification preferences, and danger zone

Claude: I'll create a settings layout with those sections.

        [Adds Tabs, Card, Switch, Button, AlertDialog]
        [Creates SettingsPage.tsx with all sections]

        The UI is ready. Would you like me to add the state
        management and API integration next?
```

### Pattern: Rapid Prototyping

Quickly try different approaches:

```
You: Show me three different ways to display a user list

Claude: Here are three approaches using shadcn components:

        **Option 1: Card Grid**
        [Shows card-based layout]

        **Option 2: Table View**
        [Shows table-based layout]

        **Option 3: List with Avatars**
        [Shows list-based layout]

        Which approach fits your needs best?
```

### Pattern: Design System Building

Create consistent components:

```
You: Create a set of consistent components for our admin dashboard

Claude: I'll create an admin component set with consistent styling.

        Creating:
        1. AdminCard - standardized card with header actions
        2. AdminTable - data table with built-in features
        3. AdminForm - consistent form layout
        4. AdminPageHeader - page title with breadcrumbs
        5. AdminSidebar - navigation sidebar

        All components will share:
        - Consistent spacing (our 4px grid)
        - Your brand colors
        - Standard shadow and border radius

        Starting with AdminCard...
```

## Troubleshooting

### Component Not Found

```
You: Add DataTable component

Claude: DataTable isn't a base shadcn component. However, shadcn
        provides a data table recipe that combines several components.

        Would you like me to:
        1. Create a DataTable using the official recipe
        2. Add a simpler Table component
        3. Use a third-party data table library
```

### Style Conflicts

```
You: The Button looks wrong after adding it

Claude: Let me check for style conflicts.

        [Checking tailwind.config.js]
        [Checking CSS imports]

        I found the issue: your global CSS has conflicting button
        styles. Here are options:

        1. Add specificity with a custom class
        2. Remove the conflicting global styles
        3. Use CSS layers for proper cascade

        Which approach do you prefer?
```

### Missing Dependencies

```
Claude: The Form component requires additional packages:
        - react-hook-form
        - @hookform/resolvers
        - zod (for validation)

        Want me to install these and set up the form?
```

## Practical Exercise: Building a Dashboard

Practice using Shadcn MCP to build a complete interface.

### Exercise Goal

Create a dashboard with:
- Header with user menu
- Sidebar navigation
- Stats cards
- Recent activity table

### Step-by-Step

**Step 1: Plan components**

```
You: I want to build a dashboard. What shadcn components will I need?
```

**Step 2: Add components**

```
You: Add all the components you recommended
```

**Step 3: Create layout**

```
You: Create a DashboardLayout component with header, sidebar,
     and main content area
```

**Step 4: Build sections**

```
You: Now create a StatsCard component and an ActivityTable
```

**Step 5: Assemble**

```
You: Put it all together on a Dashboard page
```

### Reflect

- How fast was development with MCP?
- What would you have done manually?
- Where did Claude's understanding of Shadcn help?

## Key Takeaways

1. **Shadcn components are yours**: Copy into your project, modify freely
2. **MCP streamlines addition**: Add components conversationally, not CLI commands
3. **Customization is natural**: Claude can modify components to your needs
4. **Compositions are powerful**: Build complex UIs by combining components
5. **Context helps**: Tell Claude about your design system for consistent results

## Glossary

- **Shadcn/UI**: A component library where you copy components into your project
- **Radix UI**: Accessible, unstyled primitives that Shadcn builds on
- **Variant**: A style variation of a component (e.g., "destructive" button)
- **Composition**: Combining multiple components into a larger unit
- **components.json**: Shadcn configuration file specifying paths and styles

---

In the next chapter, we'll explore the Playwright MCP server—automating browser testing directly through Claude Code.
