# React & TypeScript Development Rules

This document defines comprehensive rules and guidelines for React development with TypeScript, Tailwind CSS v4, Shadcn/ui, Ultracite.ai, and Biome.

## Core Technology Stack

- **React 19+** with functional components and hooks
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** for styling
- **Shadcn/ui** for component library
- **Vite** or Next.js for build tooling
- **TanStack** libraries

## TypeScript Configuration

### tsconfig.json Requirements
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "jsx": "react-jsx"
  }
}
```

### Type Definitions
- Always define explicit types for props, state, and function parameters
- Use interface for object shapes, type for unions/intersections
- Avoid using `any` - use `unknown` if type is truly unknown
- Export types separately from components

```typescript
// Good
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant, size = 'md', onClick, children }) => {
  // Implementation
};

// Bad
export const Button = ({ variant, size, onClick, children }: any) => {
  // Implementation
};
```

## React Component Patterns

### Functional Components Only
- Use functional components exclusively
- No class components unless absolutely necessary for error boundaries

### Component Structure
```typescript
// 1. Imports
import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface ComponentProps {
  // Props definition
}

// 3. Component definition
export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState<string>('');
  
  // 5. Derived state/memoized values
  const derivedValue = useMemo(() => computeValue(state), [state]);
  
  // 6. Effects
  useEffect(() => {
    // Effect logic
  }, [dependency]);
  
  // 7. Event handlers
  const handleClick = (event: React.MouseEvent) => {
    // Handler logic
  };
  
  // 8. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Hooks Rules
- Custom hooks must start with `use`
- Place all hooks at the top of the component
- Never call hooks conditionally
- Extract complex logic into custom hooks

```typescript
// Custom hook example
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}
```

### State Management
- Use `useState` for local component state
- Use `useReducer` for complex state logic
- Use `useContext` sparingly - prefer prop drilling for 1-2 levels
- Consider Zustand or Jotai for global state (not Redux)

## Tailwind CSS v4 Guidelines

### Class Organization
Always organize Tailwind classes in this order:
1. Layout (display, position, grid/flex)
2. Spacing (margin, padding)
3. Sizing (width, height)
4. Typography (font, text)
5. Colors (background, text, border)
6. Effects (shadow, opacity, transform)
7. Interactions (hover, focus, active)
8. Responsive modifiers
9. Dark mode modifiers

```typescript
// Good
<div className="flex items-center justify-between p-4 w-full h-16 bg-white text-gray-900 shadow-sm hover:shadow-md transition-shadow sm:p-6 dark:bg-gray-900 dark:text-white">
```

### Tailwind v4 Specific Features
- Use CSS variables for theme values
- Leverage the new `@variant` API for custom variants
- Use `@utility` for custom utilities
- Prefer `@layer` for organizing custom CSS

```css
/* app.css */
@import "tailwindcss";

@layer base {
  :root {
    --color-primary: theme('colors.blue.600');
    --radius: 0.5rem;
  }
}

@utility {
  .text-balance {
    text-wrap: balance;
  }
}
```

### Dynamic Classes
- Never use string concatenation for dynamic classes
- Always use `cn()` utility from `@/lib/utils`

```typescript
// Good
import { cn } from '@/lib/utils';

<div className={cn(
  "px-4 py-2 rounded-md",
  variant === 'primary' && "bg-blue-600 text-white",
  variant === 'secondary' && "bg-gray-200 text-gray-900",
  disabled && "opacity-50 cursor-not-allowed"
)} />

// Bad
<div className={`px-4 py-2 ${variant === 'primary' ? 'bg-blue-600' : 'bg-gray-200'}`} />
```

## Shadcn/ui Integration

### Component Installation
- Install components individually as needed
- Always customize components after installation
- Store customized components in `@/components/ui/`

### Component Customization
```typescript
// components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### Form Handling with Shadcn/ui
- Use React Hook Form with Zod validation
- Integrate with Shadcn/ui form components

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
})

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

## Ultracite.ai Integration

### AI-Powered Development Features
- Use Ultracite for intelligent code completion
- Leverage AI for component generation
- Utilize AI-powered refactoring suggestions

### Ultracite Configuration
```typescript
// ultracite.config.ts
export default {
  ai: {
    model: 'gpt-4',
    temperature: 0.3,
    maxTokens: 2000,
  },
  codeGeneration: {
    componentTemplate: 'functional',
    styleSystem: 'tailwind',
    testingFramework: 'vitest',
  },
  analysis: {
    enableTypeChecking: true,
    enableAccessibility: true,
    enablePerformance: true,
  },
}
```

### AI-Assisted Component Creation
When using Ultracite to generate components:
1. Always review generated code
2. Ensure it follows project conventions
3. Add proper TypeScript types
4. Include necessary imports
5. Add appropriate error handling

## Biome Configuration

### biome.json
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": {
        "noBannedTypes": "error",
        "noExtraBooleanCast": "error",
        "noMultipleSpacesInRegularExpressionLiterals": "error",
        "noUselessCatch": "error",
        "noUselessConstructor": "error",
        "noUselessLabel": "error",
        "noUselessLoneBlockStatements": "error",
        "noUselessRename": "error",
        "noUselessTernary": "error",
        "noUselessThisAlias": "error",
        "noVoid": "error",
        "noWith": "error",
        "useLiteralKeys": "error",
        "useOptionalChain": "error"
      },
      "correctness": {
        "noConstAssign": "error",
        "noConstantCondition": "error",
        "noEmptyCharacterClassInRegex": "error",
        "noEmptyPattern": "error",
        "noGlobalObjectCalls": "error",
        "noInvalidConstructorSuper": "error",
        "noInvalidUseBeforeDeclaration": "error",
        "noNewSymbol": "error",
        "noPrecisionLoss": "error",
        "noSelfAssign": "error",
        "noSetterReturn": "error",
        "noSwitchDeclarations": "error",
        "noUndeclaredVariables": "error",
        "noUnreachable": "error",
        "noUnreachableSuper": "error",
        "noUnsafeFinally": "error",
        "noUnsafeOptionalChaining": "error",
        "noUnusedLabels": "error",
        "noUnusedVariables": "error",
        "useIsNan": "error",
        "useValidForDirection": "error",
        "useYield": "error"
      },
      "style": {
        "noCommaOperator": "error",
        "noInferrableTypes": "error",
        "noNamespace": "error",
        "noNonNullAssertion": "warn",
        "noParameterAssign": "error",
        "noParameterProperties": "off",
        "noRestrictedGlobals": "error",
        "noUselessElse": "error",
        "noVar": "error",
        "useAsConstAssertion": "error",
        "useBlockStatements": "error",
        "useConst": "error",
        "useDefaultParameterLast": "error",
        "useEnumInitializers": "error",
        "useExponentiationOperator": "error",
        "useFragmentSyntax": "error",
        "useImportType": "error",
        "useLiteralEnumMembers": "error",
        "useNamingConvention": {
          "level": "error",
          "options": {
            "strictCase": false,
            "conventions": [
              {
                "selector": {
                  "kind": "function"
                },
                "formats": ["camelCase", "PascalCase"]
              },
              {
                "selector": {
                  "kind": "variable"
                },
                "formats": ["camelCase", "PascalCase", "CONSTANT_CASE"]
              },
              {
                "selector": {
                  "kind": "typeLike"
                },
                "formats": ["PascalCase"]
              }
            ]
          }
        },
        "useShorthandArrayType": "error",
        "useShorthandAssign": "error",
        "useSingleCaseStatement": "error",
        "useSingleVarDeclarator": "error",
        "useTemplate": "error"
      },
      "suspicious": {
        "noAsyncPromiseExecutor": "error",
        "noCatchAssign": "error",
        "noClassAssign": "error",
        "noCompareNegZero": "error",
        "noConsoleLog": "warn",
        "noControlCharactersInRegex": "error",
        "noDebugger": "error",
        "noDuplicateCase": "error",
        "noDuplicateClassMembers": "error",
        "noDuplicateJsxProps": "error",
        "noDuplicateObjectKeys": "error",
        "noDuplicateParameters": "error",
        "noEmptyBlockStatements": "error",
        "noExplicitAny": "error",
        "noExtraNonNullAssertion": "error",
        "noFallthroughSwitchClause": "error",
        "noFunctionAssign": "error",
        "noGlobalAssign": "error",
        "noImportAssign": "error",
        "noMisleadingCharacterClass": "error",
        "noMisleadingInstantiator": "error",
        "noPrototypeBuiltins": "error",
        "noRedeclare": "error",
        "noShadowRestrictedNames": "error",
        "noUnsafeDeclarationMerging": "error",
        "noUnsafeNegation": "error",
        "useDefaultSwitchClauseLast": "error",
        "useGetterReturn": "error",
        "useValidTypeof": "error"
      },
      "a11y": {
        "noAccessKey": "error",
        "noAriaUnsupportedElements": "error",
        "noAutofocus": "warn",
        "noBlankTarget": "error",
        "noDistractingElements": "error",
        "noHeaderScope": "error",
        "noInteractiveElementToNoninteractiveRole": "error",
        "noNoninteractiveElementToInteractiveRole": "error",
        "noNoninteractiveTabindex": "error",
        "noPositiveTabindex": "error",
        "noRedundantAlt": "error",
        "noRedundantRoles": "error",
        "useAltText": "error",
        "useAnchorContent": "error",
        "useAriaActivedescendantWithTabindex": "error",
        "useAriaPropsForRole": "error",
        "useButtonType": "error",
        "useHeadingContent": "error",
        "useHtmlLang": "error",
        "useIframeTitle": "error",
        "useKeyWithClickEvents": "error",
        "useKeyWithMouseEvents": "error",
        "useMediaCaption": "error",
        "useValidAnchor": "error",
        "useValidAriaProps": "error",
        "useValidAriaRole": "error",
        "useValidAriaValues": "error",
        "useValidLang": "error"
      },
      "performance": {
        "noAccumulatingSpread": "error",
        "noDelete": "error"
      },
      "security": {
        "noDangerouslySetInnerHtml": "error",
        "noDangerouslySetInnerHtmlWithChildren": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineEnding": "lf",
    "lineWidth": 100,
    "attributePosition": "auto"
  },
  "javascript": {
    "formatter": {
      "arrowParentheses": "always",
      "bracketSameLine": false,
      "bracketSpacing": true,
      "jsxQuoteStyle": "double",
      "quoteProperties": "asNeeded",
      "quoteStyle": "single",
      "semicolons": "asNeeded",
      "trailingCommas": "all"
    }
  },
  "files": {
    "ignore": [
      "node_modules",
      "dist",
      "build",
      ".next",
      ".vercel",
      "coverage",
      "*.min.js",
      "*.min.css"
    ]
  }
}
```

### Biome Scripts
Add to package.json:
```json
{
  "scripts": {
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "check": "biome check --error-on-warnings ."
  }
}
```

## File Structure & Naming

### Directory Structure
```
src/
├── app/                    # Next.js app directory (if using Next.js)
├── components/
│   ├── ui/                # Shadcn/ui components
│   ├── layout/           # Layout components (Header, Footer, etc.)
│   ├── features/         # Feature-specific components
│   └── common/           # Shared components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and helpers
├── services/             # API services and external integrations
├── types/                # TypeScript type definitions
├── styles/               # Global styles and Tailwind config
└── utils/                # General utility functions
```

### Naming Conventions
- Components: PascalCase (`UserProfile.tsx`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`)
- Utilities: camelCase (`formatDate.ts`)
- Types/Interfaces: PascalCase (`UserData.ts`)
- Constants: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

## Performance Optimization

### React Optimization
- Use `React.memo` for expensive components
- Use `useMemo` for expensive computations
- Use `useCallback` for stable function references
- Implement code splitting with `React.lazy`
- Use React.Suspense for loading states

```typescript
// Memoized component
const ExpensiveComponent = React.memo(({ data }: { data: ComplexData }) => {
  return <div>{/* Render complex data */}</div>
}, (prevProps, nextProps) => {
  // Custom comparison function
  return prevProps.data.id === nextProps.data.id
})

// Code splitting
const HeavyFeature = React.lazy(() => import('./features/HeavyFeature'))

function App() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <HeavyFeature />
    </React.Suspense>
  )
}
```

### Bundle Optimization
- Use dynamic imports for route-based splitting
- Implement tree shaking
- Optimize images with next/image or vite-imagetools
- Use web fonts with font-display: swap

## Testing Guidelines

### Unit Testing with Vitest
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies correct variant classes', () => {
    const { rerender } = render(<Button variant="primary">Button</Button>)
    expect(screen.getByText('Button')).toHaveClass('bg-blue-600')
    
    rerender(<Button variant="secondary">Button</Button>)
    expect(screen.getByText('Button')).toHaveClass('bg-gray-200')
  })
})
```

### Integration Testing
- Test user flows end-to-end
- Mock external APIs
- Test error states and edge cases
- Ensure accessibility compliance

## Error Handling

### Error Boundaries
```typescript
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
    // Send to error reporting service
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}
```

### API Error Handling
```typescript
// Custom error class
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// API wrapper with error handling
async function apiCall<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new ApiError(
        'API request failed',
        response.status,
        response.statusText
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Network error', 0, 'NETWORK_ERROR')
  }
}

// Usage in component with error handling
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiCall<User>(`/api/users/${userId}`)
      .then(setUser)
      .catch((err) => {
        if (err instanceof ApiError) {
          setError(`Failed to load user: ${err.message}`)
        } else {
          setError('An unexpected error occurred')
        }
      })
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return <div>User not found</div>

  return <div>{/* Render user */}</div>
}
```

## Accessibility (a11y)

### ARIA Attributes
- Use semantic HTML elements first
- Add ARIA labels for interactive elements
- Ensure keyboard navigation works
- Test with screen readers

```typescript
// Accessible form example
<form onSubmit={handleSubmit} aria-label="Contact form">
  <div role="group" aria-labelledby="name-group">
    <h3 id="name-group">Your Name</h3>
    <label htmlFor="firstName">
      First Name
      <span aria-label="required">*</span>
    </label>
    <input
      id="firstName"
      type="text"
      required
      aria-required="true"
      aria-describedby="firstName-error"
    />
    {errors.firstName && (
      <span id="firstName-error" role="alert" aria-live="polite">
        {errors.firstName}
      </span>
    )}
  </div>
  
  <button
    type="submit"
    disabled={isSubmitting}
    aria-busy={isSubmitting}
    aria-disabled={isSubmitting}
  >
    {isSubmitting ? 'Submitting...' : 'Submit'}
  </button>
</form>
```

### Focus Management
```typescript
// Focus trap hook
function useFocusTrap(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    )
    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus()
          e.preventDefault()
        }
      }
    }

    element.addEventListener('keydown', handleKeyDown)
    firstFocusable?.focus()

    return () => {
      element.removeEventListener('keydown', handleKeyDown)
    }
  }, [ref])
}
```

## Security Best Practices

### XSS Prevention
- Never use dangerouslySetInnerHTML unless absolutely necessary
- Sanitize user input
- Use Content Security Policy headers

### Data Validation
- Validate all inputs on both client and server
- Use Zod for schema validation
- Implement rate limiting for API calls

```typescript
// Input sanitization
import DOMPurify from 'isomorphic-dompurify'

function SafeHTML({ html }: { html: string }) {
  const sanitizedHTML = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  })

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      className="prose"
    />
  )
}
```

## Git Workflow

### Commit Messages
Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test additions or modifications
- `chore:` Build process or auxiliary tool changes

### Branch Naming
- `feature/description`
- `fix/issue-description`
- `refactor/component-name`
- `docs/section-name`

## Performance Monitoring

### Web Vitals
Monitor and optimize:
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

```typescript
import { onCLS, onFID, onLCP } from 'web-vitals'

function sendToAnalytics(metric: any) {
  // Send to your analytics endpoint
  console.log(metric)
}

onCLS(sendToAnalytics)
onFID(sendToAnalytics)
onLCP(sendToAnalytics)
```

## Development Commands

### Common Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "ultracite:analyze": "ultracite analyze",
    "ultracite:optimize": "ultracite optimize"
  }
}
```

## Final Checklist

Before committing code, ensure:
- [ ] All TypeScript errors are resolved
- [ ] Biome linting passes without errors
- [ ] Components are properly typed
- [ ] Tailwind classes are organized correctly
- [ ] Shadcn/ui components are properly customized
- [ ] Tests are written and passing
- [ ] Accessibility requirements are met
- [ ] Performance optimizations are considered
- [ ] Security best practices are followed
- [ ] Code follows all conventions in this guide