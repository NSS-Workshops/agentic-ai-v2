Real features rarely emerge fully formed. They grow through iterations—each cycle adding functionality, handling edge cases, and responding to feedback. This chapter demonstrates iterative development by completing the CRUD operations in Coins R Us.

## The Power of Iteration

Iteration means building in cycles:

1. **Build the minimum**: Get something working
2. **Test and observe**: See what's missing
3. **Enhance**: Add the next layer
4. **Repeat**: Until complete

This approach works well with Claude Code because:
- Each step is small enough to verify
- You can course-correct before going too far
- Claude's context stays focused on the current iteration

## Project: Complete CRUD for Coins

Coins R Us has an "Add Coin" form that doesn't work yet. Let's complete it, then add edit and delete functionality—iteratively.

### Starting Point Assessment

First, understand what exists:

```
You: What's the current state of the Add Coin functionality?
     Show me what exists and what's missing.

Claude: [Investigates the codebase]

        **Add Coin Assessment**

        **What exists:**
        - Form UI at src/components/AddCoinForm.tsx
        - Route at src/app/coins/add/page.tsx
        - Navigation link in Header

        **Current form code:**
        ```typescript
        export default function AddCoinForm() {
          const handleSubmit = (e: FormEvent) => {
            e.preventDefault();
            // TODO: Submit to API
            console.log('Form submitted');
          };

          return (
            <Form onSubmit={handleSubmit}>
              <Input name="denomination" placeholder="Denomination" />
              <Input name="year" type="number" placeholder="Year" />
              <Input name="condition" placeholder="Condition" />
              <Input name="price" type="number" placeholder="Price" />
              <Button type="submit">Add Coin</Button>
            </Form>
          );
        }
        ```

        **What's missing:**
        1. Form state management
        2. API integration
        3. Validation
        4. Success/error feedback
        5. Navigation after success

        **Backend ready:**
        json-server accepts POST to /coins with this shape:
        ```json
        {
          "denomination": "Quarter",
          "year": 1976,
          "condition": "MS-65",
          "price": 15
        }
        ```

        Where should we start?
```

### Iteration 1: Basic Form State

Start with the foundation—controlled inputs:

```
You: Let's start simple. Add state management for the form fields.
     No API yet, just capture the values.

Claude: [Updates AddCoinForm.tsx]

        Added form state management:

        ```typescript
        'use client';

        import { useState, FormEvent } from 'react';

        interface CoinFormData {
          denomination: string;
          year: string;
          condition: string;
          price: string;
        }

        const initialFormData: CoinFormData = {
          denomination: '',
          year: '',
          condition: '',
          price: '',
        };

        export default function AddCoinForm() {
          const [formData, setFormData] = useState<CoinFormData>(initialFormData);

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
          };

          const handleSubmit = (e: FormEvent) => {
            e.preventDefault();
            console.log('Form data:', formData);
          };

          return (
            <Form onSubmit={handleSubmit}>
              <Input
                name="denomination"
                placeholder="Denomination"
                value={formData.denomination}
                onChange={handleChange}
              />
              <Input
                name="year"
                type="number"
                placeholder="Year"
                value={formData.year}
                onChange={handleChange}
              />
              {/* ... other fields ... */}
            </Form>
          );
        }
        ```

        **Verify:** Open the form, fill in values, submit. Check console
        for the logged data.
```

Stop here. Test. Does the form capture values? Only proceed when this works.

### Iteration 2: API Integration

Now connect to the backend:

```
You: The form captures data correctly. Add API submission.
     On success, navigate to /coins.

Claude: [Updates with API call]

        Added API integration:

        ```typescript
        import { useRouter } from 'next/navigation';

        export default function AddCoinForm() {
          const router = useRouter();
          const [formData, setFormData] = useState<CoinFormData>(initialFormData);
          const [isSubmitting, setIsSubmitting] = useState(false);

          const handleSubmit = async (e: FormEvent) => {
            e.preventDefault();
            setIsSubmitting(true);

            try {
              const response = await fetch('http://localhost:3001/coins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  denomination: formData.denomination,
                  year: parseInt(formData.year),
                  condition: formData.condition,
                  price: parseFloat(formData.price),
                }),
              });

              if (!response.ok) throw new Error('Failed to add coin');

              router.push('/coins');
              router.refresh();  // Refresh to show new coin
            } catch (error) {
              console.error('Error adding coin:', error);
            } finally {
              setIsSubmitting(false);
            }
          };

          return (
            <Form onSubmit={handleSubmit}>
              {/* ... fields ... */}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Coin'}
              </Button>
            </Form>
          );
        }
        ```

        **Key additions:**
        - `isSubmitting` state prevents double submission
        - Number parsing for year and price
        - Navigation + refresh after success
        - Basic error handling

        **Verify:** Add a coin. It should appear in the list immediately.
```

Test again. Did the coin get added? Does it show in the list?

### Iteration 3: User Feedback

The form works but gives no feedback on errors:

```
You: Add proper error display. If the API fails, show an error message.

Claude: Added error handling UI:

        ```typescript
        const [error, setError] = useState<string | null>(null);

        const handleSubmit = async (e: FormEvent) => {
          e.preventDefault();
          setError(null);
          setIsSubmitting(true);

          try {
            const response = await fetch('http://localhost:3001/coins', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({...}),
            });

            if (!response.ok) {
              throw new Error('Failed to add coin. Please try again.');
            }

            router.push('/coins');
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
          } finally {
            setIsSubmitting(false);
          }
        };

        return (
          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {/* ... fields ... */}
          </Form>
        );
        ```

        Added styled component:
        ```typescript
        const ErrorMessage = styled.div`
          color: ${props => props.theme.colors.danger};
          padding: ${props => props.theme.spacing.sm};
          background: ${props => props.theme.colors.danger}10;
          border-radius: ${props => props.theme.borderRadius};
          margin-bottom: ${props => props.theme.spacing.md};
        `;
        ```

        **Verify:** Stop json-server and try to submit. Error should display.
```

### Iteration 4: Validation

Now add client-side validation:

```
You: Add validation. All fields required, year between 1793 and current year,
     price must be positive.

Claude: Added validation layer:

        ```typescript
        interface ValidationErrors {
          denomination?: string;
          year?: string;
          condition?: string;
          price?: string;
        }

        function validateForm(data: CoinFormData): ValidationErrors {
          const errors: ValidationErrors = {};
          const currentYear = new Date().getFullYear();

          if (!data.denomination.trim()) {
            errors.denomination = 'Denomination is required';
          }

          const year = parseInt(data.year);
          if (!data.year) {
            errors.year = 'Year is required';
          } else if (year < 1793 || year > currentYear) {
            errors.year = `Year must be between 1793 and ${currentYear}`;
          }

          if (!data.condition.trim()) {
            errors.condition = 'Condition is required';
          }

          const price = parseFloat(data.price);
          if (!data.price) {
            errors.price = 'Price is required';
          } else if (price <= 0) {
            errors.price = 'Price must be positive';
          }

          return errors;
        }

        export default function AddCoinForm() {
          const [errors, setErrors] = useState<ValidationErrors>({});

          const handleSubmit = async (e: FormEvent) => {
            e.preventDefault();

            const validationErrors = validateForm(formData);
            if (Object.keys(validationErrors).length > 0) {
              setErrors(validationErrors);
              return;
            }

            setErrors({});
            setIsSubmitting(true);
            // ... rest of submission
          };

          return (
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Input
                  name="denomination"
                  placeholder="Denomination"
                  value={formData.denomination}
                  onChange={handleChange}
                  $hasError={!!errors.denomination}
                />
                {errors.denomination && (
                  <FieldError>{errors.denomination}</FieldError>
                )}
              </InputGroup>
              {/* ... other fields ... */}
            </Form>
          );
        }
        ```

        **Verify:** Try submitting with invalid data. Errors should appear
        next to the appropriate fields.
```

### Iteration 5: Edit Functionality

With Create working, add Update:

```
You: Now add edit functionality. When clicking a coin, allow editing its details.

Claude: I'll need to:
        1. Add an edit route with the coin ID
        2. Create an EditCoinForm that loads existing data
        3. Add an edit button to CoinCard

        **Step 1: Edit Route**

        Created src/app/coins/[id]/edit/page.tsx:

        ```typescript
        import { Coin } from '@/types';
        import EditCoinForm from '@/components/EditCoinForm';

        interface EditPageProps {
          params: { id: string };
        }

        async function getCoin(id: string): Promise<Coin> {
          const response = await fetch(`http://localhost:3001/coins/${id}`, {
            cache: 'no-store',
          });
          return response.json();
        }

        export default async function EditCoinPage({ params }: EditPageProps) {
          const coin = await getCoin(params.id);

          return (
            <PageWrapper>
              <PageTitle>Edit Coin</PageTitle>
              <EditCoinForm coin={coin} />
            </PageWrapper>
          );
        }
        ```

        **Step 2: EditCoinForm**

        Created src/components/EditCoinForm.tsx:

        ```typescript
        'use client';

        interface EditCoinFormProps {
          coin: Coin;
        }

        export default function EditCoinForm({ coin }: EditCoinFormProps) {
          const router = useRouter();
          const [formData, setFormData] = useState({
            denomination: coin.denomination,
            year: coin.year.toString(),
            condition: coin.condition,
            price: coin.price.toString(),
          });

          const handleSubmit = async (e: FormEvent) => {
            e.preventDefault();
            setIsSubmitting(true);

            try {
              await fetch(`http://localhost:3001/coins/${coin.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...coin,  // Preserve other fields
                  denomination: formData.denomination,
                  year: parseInt(formData.year),
                  condition: formData.condition,
                  price: parseFloat(formData.price),
                }),
              });

              router.push('/coins');
              router.refresh();
            } catch (error) {
              setError('Failed to update coin');
            } finally {
              setIsSubmitting(false);
            }
          };

          // Same form structure as AddCoinForm
        }
        ```

        **Step 3: Edit button in CoinCard**

        Updated CoinCard.tsx:
        ```typescript
        <ActionButton onClick={() => router.push(`/coins/${coin.id}/edit`)}>
          Edit
        </ActionButton>
        ```

        **Verify:** Click Edit on a coin, modify values, save.
        Changes should persist.
```

### Iteration 6: Refactor for Reuse

Notice the duplication between AddCoinForm and EditCoinForm:

```
You: The two forms share most of their code. Refactor to reduce duplication.

Claude: Great observation. Creating a shared form component:

        **CoinForm.tsx** (shared base):

        ```typescript
        'use client';

        interface CoinFormProps {
          initialData?: Coin;
          onSubmit: (data: CoinFormData) => Promise<void>;
          submitLabel: string;
        }

        export default function CoinForm({
          initialData,
          onSubmit,
          submitLabel,
        }: CoinFormProps) {
          const [formData, setFormData] = useState<CoinFormData>(
            initialData
              ? {
                  denomination: initialData.denomination,
                  year: initialData.year.toString(),
                  condition: initialData.condition,
                  price: initialData.price.toString(),
                }
              : initialFormData
          );

          const [isSubmitting, setIsSubmitting] = useState(false);
          const [error, setError] = useState<string | null>(null);
          const [errors, setErrors] = useState<ValidationErrors>({});

          const handleSubmit = async (e: FormEvent) => {
            e.preventDefault();

            const validationErrors = validateForm(formData);
            if (Object.keys(validationErrors).length > 0) {
              setErrors(validationErrors);
              return;
            }

            setErrors({});
            setError(null);
            setIsSubmitting(true);

            try {
              await onSubmit(formData);
            } catch (err) {
              setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
              setIsSubmitting(false);
            }
          };

          // ... render form
        }
        ```

        **AddCoinForm.tsx** (simplified):

        ```typescript
        export default function AddCoinForm() {
          const router = useRouter();

          const handleSubmit = async (data: CoinFormData) => {
            const response = await fetch('http://localhost:3001/coins', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                denomination: data.denomination,
                year: parseInt(data.year),
                condition: data.condition,
                price: parseFloat(data.price),
              }),
            });

            if (!response.ok) throw new Error('Failed to add coin');

            router.push('/coins');
            router.refresh();
          };

          return <CoinForm onSubmit={handleSubmit} submitLabel="Add Coin" />;
        }
        ```

        **EditCoinForm.tsx** (simplified):

        ```typescript
        export default function EditCoinForm({ coin }: { coin: Coin }) {
          const router = useRouter();

          const handleSubmit = async (data: CoinFormData) => {
            const response = await fetch(`http://localhost:3001/coins/${coin.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...coin,
                denomination: data.denomination,
                year: parseInt(data.year),
                condition: data.condition,
                price: parseFloat(data.price),
              }),
            });

            if (!response.ok) throw new Error('Failed to update coin');

            router.push('/coins');
            router.refresh();
          };

          return (
            <CoinForm
              initialData={coin}
              onSubmit={handleSubmit}
              submitLabel="Save Changes"
            />
          );
        }
        ```

        Much cleaner. All form logic centralized, specific forms only
        handle their unique submission logic.
```

## Iteration Patterns

### Pattern: Minimal First

Always start with the minimum viable implementation:

```
// Iteration 1: Just make it work
const handleSubmit = () => console.log('submitted');

// Iteration 2: Add real functionality
const handleSubmit = async () => {
  await fetch('/api/coins', { method: 'POST' });
};

// Iteration 3: Add error handling
const handleSubmit = async () => {
  try {
    await fetch('/api/coins', { method: 'POST' });
  } catch (e) {
    setError(e.message);
  }
};
```

### Pattern: Test Before Advancing

Create a verification checkpoint after each iteration:

```
You: Before moving on, let's verify the current state. What should I test?

Claude: **Verification Checklist:**

        1. Submit with valid data → Coin added, redirects to list
        2. Submit with empty fields → Validation errors shown
        3. Submit with invalid year → Year error displayed
        4. Submit when API is down → Error message shown
        5. Double-click submit → Only one submission occurs

        Run through these scenarios before we continue.
```

### Pattern: Group Related Changes

Bundle logically connected changes:

```
You: Add the quantity field to the form.

Claude: This requires changes in multiple places. I'll do them together:

        1. **Form fields** - Add quantity input
        2. **Validation** - Quantity must be non-negative integer
        3. **Submission** - Include in API payload
        4. **Types** - Already includes quantity

        All changes for one logical feature, applied together.
```

### Pattern: Defer Complexity

Save complex features for later iterations:

```
You: I want to add image upload for coins.

Claude: That's a significant addition. I'd suggest deferring it:

        **Current iteration (CRUD complete):**
        - Focus on core text fields
        - Get edit/delete working

        **Future iteration (images):**
        - Add image upload component
        - Handle file storage
        - Display in card/detail views

        This keeps each iteration manageable. Should we complete
        basic CRUD first?
```

## Practical Exercise: Complete CRUD

Practice iterative development on Coins R Us.

### Setup

1. Ensure json-server is running
2. Start the Next.js dev server
3. Navigate to /coins/add

### Exercise Steps

**Iteration 1: Form State**
```
"Add state management to the AddCoinForm. Just capture values, no submission."
```
Test: Fill form, check console for logged values.

**Iteration 2: API Submission**
```
"Connect the form to the API. POST to /coins, navigate on success."
```
Test: Add a coin, verify it appears in the list.

**Iteration 3: Error Handling**
```
"Add error handling. Display errors when API fails."
```
Test: Stop json-server, try submitting, verify error shows.

**Iteration 4: Validation**
```
"Add client-side validation for all fields."
```
Test: Submit empty form, verify field errors appear.

**Iteration 5: Edit Feature**
```
"Add an edit page at /coins/[id]/edit that lets me update a coin."
```
Test: Click edit, change values, verify they persist.

**Iteration 6: Refactor**
```
"The add and edit forms have duplicate code. Refactor to share."
```
Test: Verify both forms still work after refactoring.

### Reflect

- How did iterating help you understand the feature?
- What problems did you catch early?
- How did refactoring after working code differ from refactoring theoretical code?

## Key Takeaways

1. **Start minimal**: Get something working before adding features
2. **Test each iteration**: Verify before moving forward
3. **One concern per iteration**: Don't mix validation, styling, and logic changes
4. **Refactor when patterns emerge**: Wait until you see duplication before abstracting
5. **Defer complexity**: Keep iterations small and focused
6. **Claude follows your lead**: Tell it when to stop and verify

## Glossary

- **CRUD**: Create, Read, Update, Delete—the four basic data operations
- **Iteration**: One cycle of build-test-improve
- **Controlled Component**: Form element whose value is managed by React state
- **Optimistic Update**: Showing changes in UI before server confirms
- **Validation**: Checking data correctness before submission

---

This concludes the Brownfield Development section. You've learned to analyze existing code, add features incrementally, debug issues, and refactor for quality—all with Claude Code as your partner.

Next, in the Capstone section, you'll apply everything you've learned in independent projects.
